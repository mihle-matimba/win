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
    <button class="nav-item nav-group-trigger" id="dashTrigger" aria-expanded="false" data-group="dashboard">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
      <span>Dashboard</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="dashGroup">
      <a class="nav-sub" data-page="performance" href="calendar-view.html"><span class="dot"></span><span>Performance</span></a>
      <a class="nav-sub" data-page="calendar" href="calendar-view.html"><span class="dot"></span><span>Calendar</span></a>
      <a class="nav-sub" data-page="journal" href="journal.html"><span class="dot"></span><span>Journal</span></a>
    </div>
    <button class="nav-item nav-group-trigger" id="toolsTrigger" aria-expanded="false" data-group="trading-tools">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>
      <span>Trading Tools</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="toolsGroup">
      <a class="nav-sub" data-page="monte-carlo"><span class="dot"></span><span>Monte Carlo</span></a>
    </div>
    <button class="nav-item nav-group-trigger" id="compTrigger" aria-expanded="false" data-group="competitions">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v5a6 6 0 0 1-12 0V4Z"/><path d="M9 18h6M10 22h4M12 14v4"/></svg>
      <span>Competitions</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="compGroup">
      <div class="nav-empty">No competitions yet</div>
    </div>
    <button class="nav-item nav-group-trigger" id="lbTrigger" aria-expanded="false" data-group="leaderboards">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7"/><path d="M3 20h14"/></svg>
      <span>Leaderboards</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="lbGroup">
      <div class="nav-empty">No leaderboards yet</div>
    </div>
    <button class="nav-item nav-group-trigger" id="networkTrigger" aria-expanded="false" data-group="network">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M8.5 17.5 12 11M15.5 17.5 12 11"/></svg>
      <span>Network</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="networkGroup">
      <a class="nav-sub" data-page="telegram"><span class="dot"></span><span>Telegram Groups</span></a>
      <a class="nav-sub" data-page="weekly-schedule"><span class="dot"></span><span>Weekly Schedule</span></a>
    </div>
    <button class="nav-item nav-group-trigger" id="coursesTrigger" aria-expanded="false" data-group="courses">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
      <span>Courses</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="coursesGroup">
      <div class="nav-empty">No courses yet</div>
    </div>

    <a class="nav-item" data-page="economic-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg><span>Economic Calendar</span></a>
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
  <div class="acct" id="acctMenu">
    <button class="acct-trigger" id="acctTrigger" aria-expanded="false">
      <span class="acct-tx">
        <span class="r2"><span class="acct-name" id="acctBroker">VT Markets (Pty) Ltd</span><span class="acct-num" id="acctNum">#54845698</span></span>
        <span class="r3"><span class="mut" id="acctSynced">Synced 1 hour ago</span></span>
      </span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="acct-drop" id="acctDrop"></div>
  </div>
  <div class="tb-spacer"></div>
  <button class="tb-btn" id="refresh" aria-label="Refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3L3 16"/><path d="M3 21v-5h5"/></svg></button>
  <img class="tb-avatar" alt="" src="https://i.pravatar.cc/80?img=12">`;

const ACCOUNTS = [
  { name:'Test Account', nickname:'', num:'#54845698', broker:'VT Markets (Pty) Ltd', synced:'Synced 1 hour ago' },
  { name:'Main Live',    nickname:'', num:'#88213004', broker:'VT Markets (Pty) Ltd', synced:'Synced 5 min ago' },
  { name:'Practice',     nickname:'', num:'#10029384', broker:'MetaQuotes Demo',      synced:'Synced just now' },
];

const BROKERS = [
  'VT Markets (Pty) Ltd',
  'MetaQuotes Demo',
  'IC Markets',
  'Exness',
  'XM Global',
  'FXCM',
  'Pepperstone',
  'OANDA',
  'IG Markets',
  'FP Markets',
];

/* Component CSS injected once so both pages stay in sync */
const SHELL_CSS = `
.nav-empty{padding:9px 10px;margin:1px 0;font-size:13px;font-weight:500;color:var(--faint);font-style:italic;white-space:nowrap;overflow:hidden}
.nav-sub-trigger{display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px 7px 28px;border-radius:9px;cursor:pointer;font-size:13.5px;font-weight:500;color:var(--muted);transition:background .12s,color .12s;background:none;border:none;text-align:left}
.nav-sub-trigger:hover{background:rgba(255,255,255,.04);color:var(--ink)}
.nav-sub-trigger .grp-chev{margin-left:auto;flex:0 0 14px;transition:transform .2s ease}
.nav-sub-trigger[aria-expanded="false"] .grp-chev{transform:rotate(-90deg)}
.nav-sub-group{padding-left:10px}
.acct{position:relative}
.acct-trigger{display:flex;align-items:center;gap:9px;cursor:pointer;text-align:left;padding:5px 8px;border-radius:11px;transition:background .15s}
.acct-trigger:hover{background:rgba(255,255,255,.045)}
.acct-tx{display:flex;flex-direction:column;min-width:0}
.acct .chev{transition:transform .2s ease;flex:0 0 17px}
.acct.open .chev{transform:rotate(180deg)}
.acct-drop{position:absolute;top:calc(100% + 8px);left:0;z-index:90;min-width:280px;background:var(--card);
  border:1px solid var(--line);border-radius:14px;padding:8px;box-shadow:0 26px 56px -22px rgba(0,0,0,.92);
  display:none;opacity:0;transform:translateY(-6px);transition:opacity .16s ease,transform .16s ease}
.acct.open .acct-drop{display:block;opacity:1;transform:translateY(0)}
.acct-drop .dm-label{font-size:10px;font-weight:700;letter-spacing:.8px;color:var(--faint);text-transform:uppercase;padding:8px 10px 6px}
.acct-opt{display:flex;align-items:center;gap:11px;width:100%;padding:10px 12px;border-radius:10px;text-align:left;transition:background .12s}
.acct-opt:hover{background:rgba(255,255,255,.045)}
.acct-opt.sel{background:var(--accent-soft)}
.acct-opt .ao-tx{flex:1;min-width:0}
.acct-opt .ao-name{font-size:14px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px}
.acct-opt .ao-num{font-size:11px;font-weight:700;color:var(--muted);background:var(--card-2);border:1px solid var(--line);border-radius:999px;padding:1px 8px}
.acct-opt .ao-meta{font-size:12px;color:var(--muted);margin-top:2px}
.acct-opt .ao-check{width:17px;height:17px;color:var(--accent);flex:0 0 17px;opacity:0}
.acct-opt.sel .ao-check{opacity:1}
/* collapse icon rotates 180 when sidebar is collapsed */
.collapse-btn svg{transition:transform .25s ease}
.app.collapsed .collapse-btn svg{transform:rotate(180deg)}

/* Manage Accounts button in dropdown */
.acct-manage-btn{display:flex;align-items:center;gap:8px;width:100%;padding:11px 12px;border-radius:10px;
  font-size:13.5px;font-weight:600;color:var(--accent);cursor:pointer;transition:background .12s;
  border-top:1px solid var(--line);margin-top:4px;background:none;border-left:none;border-right:none;border-bottom:none}
.acct-manage-btn:hover{background:rgba(91,116,255,.08)}
.acct-manage-btn svg{width:16px;height:16px;flex:0 0 16px}

/* Manage Accounts Modal */
.ma-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);
  display:none;align-items:center;justify-content:center;opacity:0;transition:opacity .18s ease}
.ma-overlay.show{display:flex;opacity:1}
.ma-modal{background:var(--card);border:1px solid var(--line);border-radius:18px;width:100%;max-width:480px;
  max-height:85vh;overflow:hidden;display:flex;flex-direction:column;
  box-shadow:0 32px 64px -16px rgba(0,0,0,.85);transform:translateY(10px);transition:transform .18s ease}
.ma-overlay.show .ma-modal{transform:translateY(0)}
.ma-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid var(--line)}
.ma-header h2{font-size:18px;font-weight:700;color:var(--ink);margin:0}
.ma-close{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;background:none;border:none;color:var(--muted);transition:background .12s,color .12s}
.ma-close:hover{background:rgba(255,255,255,.06);color:var(--ink)}
.ma-close svg{width:18px;height:18px}
.ma-body{padding:16px 24px 20px;overflow-y:auto;flex:1}
.ma-body::-webkit-scrollbar{width:5px}
.ma-body::-webkit-scrollbar-thumb{background:var(--line);border-radius:4px}

/* Account list in modal */
.ma-acct{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;
  border:1px solid var(--line);margin-bottom:10px;transition:background .12s}
.ma-acct:hover{background:rgba(255,255,255,.025)}
.ma-acct-info{flex:1;min-width:0}
.ma-acct-name{font-size:14px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px}
.ma-acct-nickname{font-size:12px;font-weight:500;color:var(--accent);margin-top:1px}
.ma-acct-num{font-size:11px;font-weight:700;color:var(--muted);background:var(--card-2);border:1px solid var(--line);
  border-radius:999px;padding:1px 8px}
.ma-acct-meta{font-size:12px;color:var(--muted);margin-top:3px}
.ma-acct-actions{display:flex;gap:6px;flex-shrink:0}
.ma-acct-btn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;background:none;border:1px solid var(--line);color:var(--muted);transition:all .12s}
.ma-acct-btn:hover{background:rgba(255,255,255,.06);color:var(--ink);border-color:var(--muted)}
.ma-acct-btn.danger:hover{background:rgba(255,107,129,.1);color:var(--red-val);border-color:var(--red-val)}
.ma-acct-btn svg{width:15px;height:15px}

/* Add account button */
.ma-add-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;
  border-radius:12px;border:1px dashed var(--line);background:none;color:var(--accent);font-size:14px;
  font-weight:600;cursor:pointer;transition:all .12s;margin-top:6px}
.ma-add-btn:hover{background:rgba(91,116,255,.06);border-color:var(--accent)}
.ma-add-btn svg{width:16px;height:16px}

/* Support text */
.ma-support{font-size:12px;color:var(--faint);text-align:center;padding:14px 24px;border-top:1px solid var(--line);
  line-height:1.5}
.ma-support a{color:var(--accent);text-decoration:none}
.ma-support a:hover{text-decoration:underline}

/* Steps flow */
.ma-step{display:none}
.ma-step.active{display:block}
.ma-step-header{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.ma-back-btn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;background:none;border:1px solid var(--line);color:var(--muted);transition:all .12s}
.ma-back-btn:hover{background:rgba(255,255,255,.06);color:var(--ink)}
.ma-back-btn svg{width:16px;height:16px}
.ma-step-title{font-size:15px;font-weight:700;color:var(--ink)}
.ma-step-subtitle{font-size:12px;color:var(--muted);margin-top:-10px;margin-bottom:16px}
.ma-steps-indicator{display:flex;gap:6px;margin-bottom:18px}
.ma-step-dot{height:3px;flex:1;border-radius:2px;background:var(--line);transition:background .2s}
.ma-step-dot.done{background:var(--accent)}

/* Broker list */
.ma-broker{display:flex;align-items:center;gap:10px;width:100%;padding:11px 14px;border-radius:10px;
  border:1px solid var(--line);background:none;color:var(--ink);font-size:14px;font-weight:500;
  cursor:pointer;transition:all .12s;margin-bottom:8px;text-align:left}
.ma-broker:hover{background:rgba(91,116,255,.06);border-color:var(--accent)}
.ma-broker.sel{background:var(--accent-soft);border-color:var(--accent)}
.ma-broker-icon{width:32px;height:32px;border-radius:8px;background:var(--card-2);display:flex;align-items:center;
  justify-content:center;font-size:14px;font-weight:700;color:var(--accent);flex-shrink:0}

/* Form inputs */
.ma-field{margin-bottom:14px}
.ma-label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
.ma-input{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--line);background:var(--card-2);
  color:var(--ink);font-size:14px;font-weight:500;transition:border-color .15s;outline:none;box-sizing:border-box}
.ma-input:focus{border-color:var(--accent)}
.ma-input::placeholder{color:var(--faint)}
.ma-submit-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;
  border-radius:12px;border:none;background:var(--accent);color:#fff;font-size:14px;font-weight:700;
  cursor:pointer;transition:opacity .12s;margin-top:6px}
.ma-submit-btn:hover{opacity:.88}
.ma-submit-btn:disabled{opacity:.4;cursor:not-allowed}
.ma-submit-btn svg{width:16px;height:16px}

/* Nickname edit inline */
.ma-nickname-input{padding:4px 8px;border-radius:6px;border:1px solid var(--accent);background:var(--card-2);
  color:var(--ink);font-size:12px;font-weight:500;outline:none;width:120px;box-sizing:border-box}

/* Remove confirm */
.ma-confirm{padding:16px;border-radius:12px;border:1px solid var(--red-val);background:rgba(255,107,129,.06);margin-bottom:10px}
.ma-confirm p{font-size:14px;color:var(--ink);margin:0 0 12px}
.ma-confirm-actions{display:flex;gap:8px}
.ma-confirm-btn{flex:1;padding:10px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .12s}
.ma-confirm-btn.cancel{background:var(--card-2);border:1px solid var(--line);color:var(--ink)}
.ma-confirm-btn.remove{background:var(--red-val);border:none;color:#fff}
.ma-confirm-btn:hover{opacity:.85}
`;

function injectCSS() {
  if (document.getElementById('win-shell-css')) return;
  const s = document.createElement('style');
  s.id = 'win-shell-css';
  s.textContent = SHELL_CSS;
  document.head.appendChild(s);
}

function initShell({ activePage = '' } = {}) {
  injectCSS();
  const sidebar = document.getElementById('sidebar');
  const topbar  = document.querySelector('.topbar');
  if (sidebar) sidebar.innerHTML = SIDEBAR_HTML;
  if (topbar)  topbar.innerHTML  = TOPBAR_HTML;

  initAccountMenu();

  // logo fallback
  const brandLogo = document.getElementById('brandLogo');
  const logoFallback = document.getElementById('logoFallback');
  if (brandLogo) brandLogo.addEventListener('error', () => { brandLogo.style.display='none'; logoFallback.style.display='flex'; });

  // find the group trigger that owns a given sub-item
  const groupTriggerFor = el => {
    const group = el.closest('.nav-group');
    const tr = group && group.previousElementSibling;
    return (tr && tr.classList.contains('nav-group-trigger')) ? tr : null;
  };

  // all groups start closed — mark their nav-group as closed
  document.querySelectorAll('.nav-group-trigger').forEach(trigger => {
    const group = trigger.nextElementSibling;
    if (group && group.classList.contains('nav-group')) group.classList.add('closed');
  });

  // highlight active page (and its parent group trigger, if any) + expand that group
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === activePage) {
      el.classList.add('active');
      const tr = groupTriggerFor(el);
      if (tr) {
        tr.classList.add('active');
        tr.setAttribute('aria-expanded', 'true');
        const group = tr.nextElementSibling;
        if (group) group.classList.remove('closed');
      }
    }
  });

  // expandable group toggles (Dashboard, Competitions, ...)
  document.querySelectorAll('.nav-group-trigger').forEach(trigger => {
    const group = trigger.nextElementSibling;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (group && group.classList.contains('nav-group')) group.classList.toggle('closed', open);
    });
  });

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

  // regular nav items (not group triggers)
  document.querySelectorAll('.nav-item:not(.nav-group-trigger)').forEach(n => n.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.nav-sub').forEach(x => x.classList.remove('active'));
    n.classList.add('active');
    if (innerWidth <= 1024) closeDrawer();
  }));
  // sub items — also light up their group trigger
  document.querySelectorAll('.nav-sub').forEach(n => n.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.nav-sub').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    n.classList.add('active');
    const tr = groupTriggerFor(n);
    if (tr) tr.classList.add('active');
    if (innerWidth <= 1024) closeDrawer();
  }));

  // refresh spin
  const rf = document.getElementById('refresh');
  if (rf) rf.onclick = () => { rf.classList.add('spin'); setTimeout(() => rf.classList.remove('spin'), 650); };
}

const checkIcon = '<svg class="ao-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m5 12 5 5L20 7"/></svg>';

function initAccountMenu() {
  const menu = document.getElementById('acctMenu');
  const trigger = document.getElementById('acctTrigger');
  const drop = document.getElementById('acctDrop');
  if (!menu || !trigger || !drop) return;
  let selected = 0;

  const manageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';

  function renderOptions() {
    drop.innerHTML = '<div class="dm-label">Switch account</div>' + ACCOUNTS.map((a, i) => `
      <button class="acct-opt${i === selected ? ' sel' : ''}" data-i="${i}">
        <span class="ao-tx">
          <span class="ao-name">${a.broker}<span class="ao-num">${a.num}</span></span>
          <span class="ao-meta">${a.synced}</span>
        </span>
        ${checkIcon}
      </button>`).join('') +
      `<button class="acct-manage-btn" id="manageAcctsBtn">${manageIcon}<span>Manage accounts</span></button>`;
  }
  function applyAccount(i) {
    const a = ACCOUNTS[i];
    document.getElementById('acctBroker').textContent = a.broker;
    document.getElementById('acctNum').textContent = a.num;
    const synced = document.getElementById('acctSynced');
    if (synced) synced.textContent = a.synced;
  }
  function open() { renderOptions(); menu.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
  function close() { menu.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); }

  trigger.addEventListener('click', e => { e.stopPropagation(); menu.classList.contains('open') ? close() : open(); });
  drop.addEventListener('click', e => {
    if (e.target.closest('#manageAcctsBtn')) { close(); openManageModal(); return; }
    const opt = e.target.closest('.acct-opt'); if (!opt) return;
    selected = +opt.dataset.i; applyAccount(selected); close();
  });
  document.addEventListener('click', e => { if (!e.target.closest('#acctMenu')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // ── Manage Accounts Modal ──
  const overlay = document.createElement('div');
  overlay.className = 'ma-overlay';
  overlay.id = 'manageAccountsModal';
  document.body.appendChild(overlay);

  let modalView = 'list'; // 'list' | 'add-step1' | 'add-step2'
  let addBroker = '';
  let confirmRemoveIdx = -1;
  let editNicknameIdx = -1;

  function openManageModal() { modalView = 'list'; addBroker = ''; confirmRemoveIdx = -1; editNicknameIdx = -1; renderModal(); overlay.classList.add('show'); }
  function closeManageModal() { overlay.classList.remove('show'); }

  const trashIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  const editIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
  const plusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
  const backArrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>';
  const closeX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  const linkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

  function renderModal() {
    if (modalView === 'list') renderListView();
    else if (modalView === 'add-step1') renderStep1();
    else if (modalView === 'add-step2') renderStep2();
  }

  function renderListView() {
    overlay.innerHTML = `
      <div class="ma-modal">
        <div class="ma-header">
          <h2>Manage Accounts</h2>
          <button class="ma-close" id="maClose">${closeX}</button>
        </div>
        <div class="ma-body">
          ${ACCOUNTS.map((a, i) => `
            <div class="ma-acct" data-i="${i}">
              ${confirmRemoveIdx === i ? `
                <div class="ma-confirm" style="width:100%">
                  <p>Remove <strong>${a.broker}</strong> (${a.num})?</p>
                  <div class="ma-confirm-actions">
                    <button class="ma-confirm-btn cancel" data-cancel="${i}">Cancel</button>
                    <button class="ma-confirm-btn remove" data-remove="${i}">Remove</button>
                  </div>
                </div>
              ` : `
                <div class="ma-acct-info">
                  <div class="ma-acct-name">${a.name}<span class="ma-acct-num">${a.num}</span></div>
                  ${editNicknameIdx === i ? `
                    <input class="ma-nickname-input" id="nicknameInput" type="text" value="${a.nickname || ''}" placeholder="Enter nickname..." maxlength="30" autofocus>
                  ` : `
                    ${a.nickname ? `<div class="ma-acct-nickname">${a.nickname}</div>` : ''}
                  `}
                  <div class="ma-acct-meta">${a.broker} &bull; ${a.synced}</div>
                </div>
                <div class="ma-acct-actions">
                  <button class="ma-acct-btn" title="${editNicknameIdx === i ? 'Save nickname' : 'Edit nickname'}" data-edit="${i}">${editIcon}</button>
                  <button class="ma-acct-btn danger" title="Remove account" data-trash="${i}">${trashIcon}</button>
                </div>
              `}
            </div>
          `).join('')}
          <button class="ma-add-btn" id="maAddBtn">${plusIcon}<span>Add Account</span></button>
        </div>
        <div class="ma-support">Having trouble? <a href="mailto:support@mdmtraders.com">Contact support</a> for help linking or managing your accounts.</div>
      </div>`;
    bindListEvents();
  }

  function renderStep1() {
    overlay.innerHTML = `
      <div class="ma-modal">
        <div class="ma-header">
          <h2>Add Account</h2>
          <button class="ma-close" id="maClose">${closeX}</button>
        </div>
        <div class="ma-body">
          <div class="ma-steps-indicator"><div class="ma-step-dot done"></div><div class="ma-step-dot"></div></div>
          <div class="ma-step-header">
            <button class="ma-back-btn" id="maBack">${backArrow}</button>
            <div class="ma-step-title">Step 1: Choose your broker</div>
          </div>
          <div class="ma-step-subtitle">Select the broker your trading account is registered with.</div>
          ${BROKERS.map(b => `
            <button class="ma-broker${addBroker === b ? ' sel' : ''}" data-broker="${b}">
              <span class="ma-broker-icon">${b.charAt(0)}</span>
              <span>${b}</span>
            </button>
          `).join('')}
        </div>
        <div class="ma-support">Can't find your broker? <a href="mailto:support@mdmtraders.com">Contact support</a> and we'll help you get set up.</div>
      </div>`;
    bindStep1Events();
  }

  function renderStep2() {
    overlay.innerHTML = `
      <div class="ma-modal">
        <div class="ma-header">
          <h2>Add Account</h2>
          <button class="ma-close" id="maClose">${closeX}</button>
        </div>
        <div class="ma-body">
          <div class="ma-steps-indicator"><div class="ma-step-dot done"></div><div class="ma-step-dot done"></div></div>
          <div class="ma-step-header">
            <button class="ma-back-btn" id="maBack">${backArrow}</button>
            <div class="ma-step-title">Step 2: Account details</div>
          </div>
          <div class="ma-step-subtitle">Enter your account number from <strong>${addBroker}</strong>.</div>
          <div class="ma-field">
            <label class="ma-label">Account Number</label>
            <input class="ma-input" id="maAcctNum" type="text" placeholder="e.g. 54845698" maxlength="20">
          </div>
          <div class="ma-field">
            <label class="ma-label">Nickname (optional)</label>
            <input class="ma-input" id="maAcctNick" type="text" placeholder="e.g. My Main Account" maxlength="30">
          </div>
          <button class="ma-submit-btn" id="maSubmit" disabled>${linkIcon}<span>Link Account</span></button>
        </div>
        <div class="ma-support">Unable to see your account after linking? <a href="mailto:support@mdmtraders.com">Contact support</a> for assistance.</div>
      </div>`;
    bindStep2Events();
  }

  function bindListEvents() {
    overlay.querySelector('#maClose').onclick = closeManageModal;
    overlay.querySelector('#maAddBtn').onclick = () => { modalView = 'add-step1'; addBroker = ''; renderModal(); };
    overlay.querySelectorAll('[data-trash]').forEach(btn => {
      btn.onclick = () => { confirmRemoveIdx = +btn.dataset.trash; renderModal(); };
    });
    overlay.querySelectorAll('[data-cancel]').forEach(btn => {
      btn.onclick = () => { confirmRemoveIdx = -1; renderModal(); };
    });
    overlay.querySelectorAll('[data-remove]').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.remove;
        ACCOUNTS.splice(idx, 1);
        confirmRemoveIdx = -1;
        if (selected >= ACCOUNTS.length) selected = Math.max(0, ACCOUNTS.length - 1);
        if (ACCOUNTS.length) applyAccount(selected);
        renderModal();
      };
    });
    overlay.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.edit;
        if (editNicknameIdx === idx) {
          const input = overlay.querySelector('#nicknameInput');
          if (input) ACCOUNTS[idx].nickname = input.value.trim();
          editNicknameIdx = -1;
          applyAccount(selected);
        } else {
          editNicknameIdx = idx;
        }
        renderModal();
        const inp = overlay.querySelector('#nicknameInput');
        if (inp) inp.focus();
      };
    });
    const nicknameInput = overlay.querySelector('#nicknameInput');
    if (nicknameInput) {
      nicknameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          ACCOUNTS[editNicknameIdx].nickname = nicknameInput.value.trim();
          editNicknameIdx = -1;
          applyAccount(selected);
          renderModal();
        }
      });
    }
    overlay.onclick = e => { if (e.target === overlay) closeManageModal(); };
  }

  function bindStep1Events() {
    overlay.querySelector('#maClose').onclick = closeManageModal;
    overlay.querySelector('#maBack').onclick = () => { modalView = 'list'; renderModal(); };
    overlay.querySelectorAll('[data-broker]').forEach(btn => {
      btn.onclick = () => { addBroker = btn.dataset.broker; modalView = 'add-step2'; renderModal(); };
    });
    overlay.onclick = e => { if (e.target === overlay) closeManageModal(); };
  }

  function bindStep2Events() {
    overlay.querySelector('#maClose').onclick = closeManageModal;
    overlay.querySelector('#maBack').onclick = () => { modalView = 'add-step1'; renderModal(); };
    const numInput = overlay.querySelector('#maAcctNum');
    const nickInput = overlay.querySelector('#maAcctNick');
    const submitBtn = overlay.querySelector('#maSubmit');
    numInput.addEventListener('input', () => { submitBtn.disabled = !numInput.value.trim(); });
    submitBtn.onclick = () => {
      const num = numInput.value.trim();
      if (!num) return;
      const nick = nickInput.value.trim();
      const newAcct = {
        name: addBroker.split(' ')[0] + ' Account',
        nickname: nick,
        num: '#' + num.replace(/^#/, ''),
        broker: addBroker,
        synced: 'Synced just now'
      };
      ACCOUNTS.push(newAcct);
      selected = ACCOUNTS.length - 1;
      applyAccount(selected);
      modalView = 'list';
      renderModal();
    };
    overlay.onclick = e => { if (e.target === overlay) closeManageModal(); };
    numInput.focus();
  }

  addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('show')) closeManageModal(); });
}

return { initShell };
})();
