// Bộ icon nét mảnh dùng chung cho toàn trang. Gọi ic('ten') để lấy thẻ <svg>.
const ICONS={
 zoomIn:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20.5 20.5M10.5 7.5v6M7.5 10.5h6"/>',
 bookcase:'<rect x="4" y="3" width="16" height="18" rx="1.2"/><path d="M4 9h16M4 15h16M7 9V5.5M9 9V6M12.5 15v-3.5M15 15v-4M8 21v-3.5M10 21v-3"/>',
 rotate:'<rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 3.5a6.5 6.5 0 0 1 9 1.2"/><path d="M16.6 2.2l-.4 2.7-2.7-.4"/>',
 ticket:'<path d="M3.5 6.5h17v3.5a2 2 0 0 0 0 4v3.5h-17V14a2 2 0 0 0 0-4z"/><path d="M15 7v10" stroke-dasharray="1.4 2"/>',
 crop:'<path d="M6.5 2.5v13a2 2 0 0 0 2 2h13"/><path d="M17.5 21.5v-13a2 2 0 0 0-2-2h-13"/>',
 vol:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
 volX:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
 shelfUp:'<path d="M3 20h18"/><rect x="5" y="6" width="3.2" height="14" rx=".6"/><rect x="9.2" y="4" width="3.2" height="16" rx=".6"/><path d="M14.4 19.6l3-12.6 3.1.8-3 12.6"/>',
 shelfFlat:'<path d="M3 20.5h18"/><rect x="5" y="15.5" width="14" height="4" rx=".8"/><rect x="4" y="11" width="13" height="4" rx=".8"/><rect x="6.5" y="6.5" width="12" height="4" rx=".8"/>',
 palette:'<path d="M12 3a9 9 0 1 0 0 18c1.3 0 1.8-.9 1.4-1.8-.5-1.1.3-2.4 1.6-2.4H17a4 4 0 0 0 4-4C21 7.2 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10.5" cy="7.2" r="1.1"/><circle cx="15" cy="7.5" r="1.1"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 sparkle:'<path d="M11 3l1.7 4.8L17.5 9.5l-4.8 1.7L11 16l-1.7-4.8L4.5 9.5l4.8-1.7z"/><path d="M18 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 sunset:'<path d="M3 18h18M6 21h12"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 3v5M9.5 5.5L12 8l2.5-2.5M4.2 11.2l1.4 1M19.8 11.2l-1.4 1"/>',
 moon:'<path d="M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2z"/>',
 auto:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
 bookPlus:'<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v14H6.5A1.5 1.5 0 0 0 5 18.5z"/><path d="M5 18.5A1.5 1.5 0 0 0 6.5 20H19"/><path d="M12 6.5v7M8.5 10h7"/>',
 imagePlus:'<rect x="3" y="5" width="14" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="M17 15.5l-3.5-3.5L6 19.5"/><path d="M19.5 2.5v6M16.5 5.5h6"/>',
 camera:'<path d="M4 8h3l1.8-2.5h6.4L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/>',
 trash:'<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.9 13h9.2l.9-13M10 11v5.5M14 11v5.5"/>',
 chevL:'<path d="M14.5 6l-6 6 6 6"/>',
 chevR:'<path d="M9.5 6l6 6-6 6"/>',
 x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
 bookOpen:'<path d="M3 5.5c3-1.3 6-1 9 1 3-2 6-2.3 9-1V19c-3-1.3-6-1-9 1-3-2-6-2.3-9-1z"/><path d="M12 6.5V20"/>'
};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n]||''}</svg>`;
// Hình nhỏ cho ba kiểu trang, dùng trong bảng thêm trang.
const LAYIC={
 scatter:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><rect x="4" y="5" width="15" height="17" fill="#c9d9e6" transform="rotate(-6 11 13)"/><rect x="21" y="8" width="15" height="17" fill="#e8d2b8" transform="rotate(5 28 16)"/><rect x="11" y="28" width="16" height="18" fill="#cfe3cf" transform="rotate(-3 19 37)"/></svg>',
 hero:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><rect x="4" y="4" width="32" height="33" fill="#c9d9e6" stroke="#fbfaf6" stroke-width="2" transform="rotate(-2 20 20)"/><rect x="9" y="42" width="22" height="2.5" rx="1" fill="#b9a78d"/></svg>',
 ticket:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><g transform="rotate(-6 20 15)"><path d="M5 8h30v14H5z" fill="#e8c15a"/><circle cx="27" cy="8" r="2" fill="#fff"/><circle cx="27" cy="22" r="2" fill="#fff"/><path d="M27 10v10" stroke="#fff" stroke-dasharray="1.4 1.4"/></g><path d="M12 27h17v19l-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6z" fill="#f2ece0" stroke="#d9cdb6" stroke-width=".6" transform="rotate(4 20 36)"/><path d="M15 31h11M15 34h8M15 37h10" stroke="#b9a78d" stroke-width="1" transform="rotate(4 20 36)"/></svg>',
 quote:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><rect x="7" y="19" width="26" height="2.5" rx="1" fill="#b9a78d"/><rect x="9" y="25" width="22" height="2.5" rx="1" fill="#b9a78d"/><rect x="12" y="31" width="16" height="2.5" rx="1" fill="#b9a78d"/></svg>'
};