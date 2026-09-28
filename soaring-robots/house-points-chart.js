// Shared House MIT Points bar chart — used by index.html and mit-week-2026-staff.html.
// Reads data from assets/data/house-points-data.js (load that script first).
(function () {
  function renderHousePointsChart(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof HOUSE_POINTS_DATA === 'undefined') return;

    const { points, updated, final } = HOUSE_POINTS_DATA;
    const order = ['Air', 'Earth', 'Water', 'Fire'];
    const entries = order.map(h => ({ house: h, value: points[h] || 0 }));
    entries.sort((a, b) => b.value - a.value);

    const max = Math.max(1, ...entries.map(e => e.value));
    const topValue = entries[0].value;
    const winners = entries.filter(e => e.value === topValue);
    const tiedAtTop = winners.length > 1;

    const rows = entries.map(e => {
      const cls = 'house-' + e.house.toLowerCase();
      const pct = Math.round((e.value / max) * 100);
      const crown = (!tiedAtTop && e.value === topValue) ? ' 🏆' : '';
      return `
        <div class="house-chart-row">
          <span class="house-chart-label ${cls}"><span class="house-dot"></span>${e.house}</span>
          <div class="house-chart-track"><div class="house-chart-fill ${cls}" style="width:${pct}%"></div></div>
          <span class="house-chart-value">${e.value}${crown}</span>
        </div>`;
    }).join('');

    let winnerBanner = '';
    if (final) {
      const names = winners.map(w => w.house).join(' & ');
      const cls = tiedAtTop ? '' : 'house-' + winners[0].house.toLowerCase();
      winnerBanner = `
        <div class="house-winner-banner ${cls}">
          <span class="house-winner-trophy">🏆</span>
          <div>
            <div class="house-winner-title">Congratulations, ${names}!</div>
            <div class="house-winner-sub">${tiedAtTop ? 'Joint winners' : 'Winner'} of the House MIT Trophy 2026 — final score: ${topValue} points</div>
          </div>
        </div>`;
    }

    el.innerHTML = `
      ${winnerBanner}
      <div class="house-chart">${rows}</div>
      <p class="house-chart-updated">${final ? 'Final result' : 'Last updated'} ${updated}</p>
    `;
  }

  window.renderHousePointsChart = renderHousePointsChart;
})();
