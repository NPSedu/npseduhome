/**
 * RSVP backend for Nicole's 40th Pool Party.
 * Paste this into Extensions → Apps Script of a Google Sheet, then deploy as a Web App
 * (see SETUP.md). RSVPs land in the "RSVPs" tab. Re-submitting the same name updates that row.
 */
const SHEET_NAME = 'RSVPs';
const HEADERS = ['Updated', 'Name', 'Attending', 'Adults', 'Kids', 'Free flow pre-book'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function listGuests_() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  return rows
    .filter(r => r[1])
    .map(r => ({ name: String(r[1]), attending: r[2] === 'no' ? 'no' : 'yes', adults: Number(r[3]) || 0, kids: Number(r[4]) || 0, freeFlow: Number(r[5]) || 0 }));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clampInt_(v, min, max) {
  const n = Math.floor(Number(v));
  return isNaN(n) ? min : Math.max(min, Math.min(max, n));
}

function doGet() {
  return json_({ ok: true, guests: listGuests_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return json_({ ok: true, guests: listGuests_() }); // spam honeypot

    // A leading = + - @ would be treated as a formula by Sheets, so strip it.
    const name = String(d.name || '').trim().replace(/\s+/g, ' ').replace(/^[=+\-@]+/, '').slice(0, 60);
    if (!name) return json_({ ok: false, error: 'Name required' });
    const attending = d.attending === 'no' ? 'no' : 'yes';
    const adults = attending === 'yes' ? clampInt_(d.adults, 1, 20) : 0;
    const kids = attending === 'yes' ? clampInt_(d.kids, 0, 20) : 0;
    const freeFlow = attending === 'yes' ? clampInt_(d.freeFlow, 0, adults) : 0;
    const row = [new Date(), name, attending, adults, kids, freeFlow];

    const sheet = getSheet_();
    const names = sheet.getRange(1, 2, sheet.getLastRow(), 1).getValues().map(r => String(r[0]).toLowerCase());
    const idx = names.indexOf(name.toLowerCase());
    if (idx > 0) sheet.getRange(idx + 1, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);

    return json_({ ok: true, guests: listGuests_() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
