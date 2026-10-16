# Connecting the RSVP guest list (about 5 minutes)

The invite stores RSVPs in a Google Sheet you own, so you get a live spreadsheet and the page shows the guest list to everyone.

1. Create a new Google Sheet (e.g. "Nicole 40th RSVPs").
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's there, paste in everything from `rsvp-apps-script.gs`, and click **Save**.
4. Click **Deploy → New deployment**. Under the gear icon, pick **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, allow the permissions it asks for (it's your own script), and copy the **Web app URL** (it ends in `/exec`).
6. Open `index.html`, find `const RSVP_ENDPOINT = '';` near the bottom, and paste the URL between the quotes.
7. Upload the `nicole-40` folder to Netlify as usual. The invite will be at `https://npsedu.netlify.app/nicole-40/`.

A "RSVPs" tab appears in the sheet after the first reply. If someone RSVPs again with the same name, their row is updated rather than duplicated. To remove a guest, delete their row in the sheet.

If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
