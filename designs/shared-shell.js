/*  WIN — shared sidebar + topbar shell
    Usage:  <script src="shared-shell.js"></script>
    Then call:  WIN.initShell({ activePage: 'journal' })
    activePage: 'performance' | 'calendar' | 'journal' | 'weekly-draw' | 'tp-paradise' | ...
*/
const WIN = (() => {

const SIDEBAR_HTML = `
  <div class="brand">
    <img class="brand-logo" id="brandLogo" alt="WIN" src="https://ffxlryusmstnfjedleds.supabase.co/storage/v1/object/public/Assets/WIN.png">
    <div class="logo-fallback" id="logoFallback" style="display:none"><span>WI</span><span class="sl">/</span><span>N</span></div>
  </div>
  <nav class="nav">
    <button class="nav-item nav-group-trigger" id="dashTrigger" aria-expanded="true" data-group="dashboard">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
      <span>Dashboard</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="dashGroup">
      <a class="nav-sub" data-page="performance" href="calendar-view.html"><span class="dot"></span><span>Performance</span></a>
      <a class="nav-sub" data-page="calendar" href="calendar-view.html"><span class="dot"></span><span>Calendar</span></a>
      <a class="nav-sub" data-page="journal" href="journal.html"><span class="dot"></span><span>Journal</span></a>
    </div>
    <div class="nav-label">Competitions</div>
    <a class="nav-item" data-page="weekly-draw"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v5a6 6 0 0 1-12 0V4Z"/><path d="M9 18h6M10 22h4M12 14v4"/></svg><span>Weekly Draw</span></a>
    <a class="nav-item" data-page="tp-paradise"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg><span>TP To Paradise</span></a>
    <a class="nav-item" data-page="telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4 20-7Z"/></svg><span>Telegram Channels</span></a>
    <a class="nav-item" data-page="courses"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg><span>Courses</span></a>
    <a class="nav-item" data-page="weekly-schedule"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>Weekly Schedule</span></a>
    <a class="nav-item" data-page="economic-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg><span>Economic Calendar</span></a>
    <a class="nav-item" data-page="strategy-sim"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg><span>Strategy Simulator</span></a>
    <a class="nav-item" data-page="trading-tools"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/></svg><span>Trading Tools</span></a>
    <a class="nav-item" data-page="trade-history"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg><span>Trade History</span></a>
  </nav>
  <div class="side-foot">
    <div class="side-user">
      <img class="side-avatar" alt="" src="https://i.pravatar.cc/80?img=12">
      <div class="meta"><div class="nm">Yuveshnee</div><div class="em">support@mdmtraders.com</div></div>
    </div>
    <a class="signout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg><span>Sign Out</span></a>
  </div>`;

const TOPBAR_HTML = `
  <button class="icon-rnd hamburger" id="hamburger" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
  <button class="icon-rnd collapse-btn" id="collapseBtn" aria-label="Collapse sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 17-5-5 5-5M19 17l-5-5 5-5"/></svg></button>
  <div class="acct">
    <div class="r2"><span class="acct-name">Test Account</span><span class="acct-num">#54845698</span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg></div>
    <div class="r3"><span class="mut">VT Markets (Pty) Ltd</span><span class="sep">&bull;</span><span class="mut">Synced 1 hour ago</span></div>
  </div>
  <div class="tb-spacer"></div>
  <button class="tb-btn" id="refresh" aria-label="Refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3L3 16"/><path d="M3 21v-5h5"/></svg></button>
  <img class="tb-avatar" alt="" src="https://i.pravatar.cc/80?img=12">`;

const DASH_SUBS = ['performance','calendar','journal'];

function initShell({ activePage = '' } = {}) {
  const sidebar = document.getElementById('sidebar');
  const topbar  = document.querySelector('.topbar');
  if (sidebar) sidebar.innerHTML = SIDEBAR_HTML;
  if (topbar)  topbar.innerHTML  = TOPBAR_HTML;

  // logo fallback
  const brandLogo = document.getElementById('brandLogo');
  const logoFallback = document.getElementById('logoFallback');
  if (brandLogo) brandLogo.addEventListener('error', () => { brandLogo.style.display='none'; logoFallback.style.display='flex'; });

  // highlight active page
  const isDashSub = DASH_SUBS.includes(activePage);
  const dashTrigger = document.getElementById('dashTrigger');
  if (isDashSub && dashTrigger) dashTrigger.classList.add('active');

  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === activePage) {
      el.classList.add('active');
      if (el.classList.contains('nav-item')) el.classList.add('active');
    }
  });

  // dashboard group toggle
  const dashGroup = document.getElementById('dashGroup');
  if (dashTrigger && dashGroup) {
    dashTrigger.addEventListener('click', () => {
      const open = dashTrigger.getAttribute('aria-expanded') === 'true';
      dashTrigger.setAttribute('aria-expanded', open ? 'false' : 'true');
      dashGroup.classList.toggle('closed', open);
    });
  }

  // sidebar collapse / mobile drawer
  const app = document.getElementById('app');
  const sb  = document.getElementById('sidebar');
  const bd  = document.getElementById('backdrop');
  function closeDrawer() { sb.classList.remove('open'); bd.classList.remove('show'); }
  const collapseBtn = document.getElementById('collapseBtn');
  const hamburger   = document.getElementById('hamburger');
  if (collapseBtn) collapseBtn.onclick = () => app.classList.toggle('collapsed');
  if (hamburger)   hamburger.onclick   = () => { sb.classList.add('open'); bd.classList.add('show'); };
  if (bd) bd.onclick = closeDrawer;

  document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active')); n.classList.add('active');
    document.querySelectorAll('.nav-sub').forEach(x => x.classList.remove('active'));
    if (innerWidth <= 1024 && n !== dashTrigger) closeDrawer();
  }));
  document.querySelectorAll('.nav-sub').forEach(n => n.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.nav-sub').forEach(x => x.classList.remove('active')); n.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active')); dashTrigger.classList.add('active');
    if (innerWidth <= 1024) closeDrawer();
  }));

  // refresh spin
  const rf = document.getElementById('refresh');
  if (rf) rf.onclick = () => { rf.classList.add('spin'); setTimeout(() => rf.classList.remove('spin'), 650); };
}

return { initShell };
})();
