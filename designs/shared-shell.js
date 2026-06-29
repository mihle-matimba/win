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
      <a class="nav-sub" data-page="performance" href="performance.html"><span class="dot"></span><span>Performance</span></a>
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
      <a class="nav-sub" data-page="economic-calendar" href="economic-calendar.html"><span class="dot"></span><span>Economic Calendar</span></a>
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
      <div class="nav-empty" id="networkLoading">Loading...</div>
    </div>
    <button class="nav-item nav-group-trigger" id="coursesTrigger" aria-expanded="false" data-group="courses">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
      <span>Courses</span>
      <svg class="grp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="nav-group" id="coursesGroup">
      <a class="nav-sub" data-page="courses" href="courses.html"><span class="dot"></span><span>All Courses</span></a>
    </div>
  </nav>
  <div class="side-foot">
    <a class="side-user" href="profile.html" title="View profile">
      <div class="side-avatar-wrap" id="sideAvatarWrap"></div>
      <div class="meta"><div class="nm" id="sideUserName"></div><div class="em" id="sideUserEmail"></div></div>
    </a>
    <a class="signout"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg><span>Sign Out</span></a>
  </div>`;

const TOPBAR_HTML = `
  <button class="icon-rnd hamburger" id="hamburger" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
  <button class="icon-rnd collapse-btn" id="collapseBtn" aria-label="Collapse sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m13 17-5-5 5-5M19 17l-5-5 5-5"/></svg></button>
  <div class="acct" id="acctMenu">
    <button class="acct-trigger" id="acctTrigger" aria-expanded="false">
      <span class="acct-tx">
        <span class="r2"><span class="acct-name" id="acctBroker">No accounts</span><span class="acct-num" id="acctNum"></span></span>
        <span class="r3"><span class="mut" id="acctSynced"></span></span>
      </span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="acct-drop" id="acctDrop"></div>
  </div>
  <div class="tb-spacer"></div>
  <button class="tb-btn" id="refresh" aria-label="Refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3L3 16"/><path d="M3 21v-5h5"/></svg></button>
  <a class="tb-avatar-wrap" id="tbAvatarWrap" href="profile.html" title="View profile"></a>`;

const ACCOUNTS = [];

/* Fallback broker list — overridden by community.allowed_brokers once loaded */
const BROKERS_FALLBACK = [
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

let communityBrokers    = null; // null = not loaded yet
let networksLocked      = false;
let communityLoadPromise = null;

// ── Helper functions (defined before initShell to avoid hoisting issues) ──

function timeAgo(dateStr) {
  if (!dateStr) return 'Synced';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)  return 'Synced just now';
  if (diff < 3600) { const m = Math.floor(diff / 60); return `Synced ${m}m ago`; }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return `Synced ${h}h ago`; }
  const d = Math.floor(diff / 86400);
  return `Synced ${d}d ago`;
}

async function loadCommunity() {
  try {
    const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
    const communityId = userObj?.user_metadata?.community_id;
    const param = communityId
      ? `id=${encodeURIComponent(communityId)}`
      : `domain=${encodeURIComponent(location.hostname)}`;
    const res = await fetch(`/api/community?${param}`);
    if (!res.ok) throw new Error();
    const { community } = await res.json();
    communityBrokers = Array.isArray(community?.allowed_brokers) && community.allowed_brokers.length
      ? community.allowed_brokers
      : BROKERS_FALLBACK;
    if (community?.logo_url) {
      const brandLogo = document.getElementById('brandLogo');
      if (brandLogo) { brandLogo.src = community.logo_url; brandLogo.style.display = ''; }
      const logoFallback = document.getElementById('logoFallback');
      if (logoFallback) logoFallback.style.display = 'none';
    }
  } catch {
    communityBrokers = BROKERS_FALLBACK;
  }
  const modal = document.getElementById('manageAccountsModal');
  if (modal && modal.classList.contains('show') && modal.querySelector('.ma-loading')) {
    modal.dispatchEvent(new CustomEvent('community-loaded'));
  }
}

function applyUserInfo() {
  const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
  const email    = userObj?.email || '';
  const name     = userObj?.user_metadata?.full_name || '';
  const avatar   = userObj?.user_metadata?.avatar_url || '';
  const firstName = (name || email).split(/[\s@]/)[0] || '?';
  const initial  = firstName.charAt(0).toUpperCase();
  const avatarWrap = document.getElementById('sideAvatarWrap');
  if (avatarWrap) {
    avatarWrap.innerHTML = avatar
      ? `<img class="side-avatar" alt="${firstName}" src="${avatar}">`
      : `<div class="side-avatar-init">${initial}</div>`;
  }
  const sideEmail = document.getElementById('sideUserEmail');
  if (sideEmail) sideEmail.textContent = email;
  const sideName = document.getElementById('sideUserName');
  if (sideName) sideName.textContent = firstName;
  const tbWrap = document.getElementById('tbAvatarWrap');
  if (tbWrap) {
    tbWrap.innerHTML = avatar
      ? `<img class="tb-avatar" alt="${firstName}" src="${avatar}">`
      : `<div class="tb-avatar-init">${initial}</div>`;
  }
}

async function loadLinkedAccounts() {
  const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
  if (!userObj?.id) return;
  // Wait for community brokers before building broker name
  if (communityLoadPromise) await communityLoadPromise;
  try {
    const res = await fetch(`/api/linked-accounts?user_id=${encodeURIComponent(userObj.id)}`);
    if (!res.ok) return;
    const { accounts } = await res.json();
    if (!accounts || !accounts.length) return;
    // Clear and repopulate ACCOUNTS from DB
    ACCOUNTS.length = 0;
    accounts.forEach(row => {
      const bc = row.broker_clients || {};
      ACCOUNTS.push({
        name:    bc.name || 'Account ' + row.id,
        nickname: '',
        num:     '#' + row.id,
        broker:  (communityBrokers && communityBrokers[0])
                   ? (typeof communityBrokers[0] === 'string' ? communityBrokers[0] : communityBrokers[0].name)
                   : 'Broker',
        balance: bc.balance || 0,
        currency: bc.account_currency || '',
        synced:  timeAgo(bc.synced_at)
      });
    });
    // Restore selected account (clamp to valid range) and refresh display
    const storedIdx = +(localStorage.getItem('win_selected_account') || 0);
    const idx = Math.min(storedIdx, ACCOUNTS.length - 1);
    const acctBroker = document.getElementById('acctBroker');
    if (acctBroker && ACCOUNTS.length) {
      const a = ACCOUNTS[idx];
      acctBroker.textContent = a.broker;
      document.getElementById('acctNum').textContent = a.num;
      const synced = document.getElementById('acctSynced');
      if (synced) synced.textContent = a.synced;
    }
  } catch { /* silent fail */ }
}

const navLockSvg = '<svg class="nav-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

function lockNetworkChannels() {
  const group = document.getElementById('networkGroup');
  if (!group) return;
  group.querySelectorAll('.nav-sub').forEach(a => {
    a.removeAttribute('href');
    a.removeAttribute('target');
    a.removeAttribute('rel');
    a.classList.add('nav-sub-locked');
    if (!a.querySelector('.nav-lock-icon')) a.insertAdjacentHTML('beforeend', navLockSvg);
  });
}

async function loadChannels() {
  try {
    const res = await fetch('/api/channels');
    if (!res.ok) throw new Error();
    const { channels } = await res.json();
    const group = document.getElementById('networkGroup');
    if (!group) return;
    if (!channels || !channels.length) {
      group.innerHTML = '<div class="nav-empty">No channels yet</div>';
      return;
    }
    group.innerHTML = channels.map(ch => `
      <a class="nav-sub" href="${ch.url}" target="_blank" rel="noopener">
        <span class="dot"></span><span>${ch.name}</span>
      </a>`).join('');
    if (networksLocked) lockNetworkChannels();
  } catch {
    const group = document.getElementById('networkGroup');
    if (group) group.innerHTML = '<div class="nav-empty">No channels yet</div>';
  }
}

// ── Shell init ──

function initShell({ activePage = '' } = {}) {
  // Auth guard — redirect unauthenticated visitors to sign-in
  const _session = localStorage.getItem('win_session');
  const _user    = localStorage.getItem('win_user');
  if (!_session || !_user) {
    window.location.replace('auth.html');
    return;
  }

  const sidebar = document.getElementById('sidebar');
  const topbar  = document.querySelector('.topbar');
  if (sidebar) sidebar.innerHTML = SIDEBAR_HTML;
  if (topbar)  topbar.innerHTML  = TOPBAR_HTML;

  loadChannels();
  communityLoadPromise = loadCommunity();
  applyUserInfo();
  initAccountMenu(activePage);
  loadLinkedAccounts();

  // sign out
  const signoutBtn = sidebar && sidebar.querySelector('.signout');
  if (signoutBtn) {
    signoutBtn.onclick = () => {
      localStorage.removeItem('win_session');
      localStorage.removeItem('win_user');
      localStorage.removeItem('win_selected_account');
      window.location.href = 'auth.html';
    };
  }

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

function initAccountMenu(activePage) {
  const menu = document.getElementById('acctMenu');
  const trigger = document.getElementById('acctTrigger');
  const drop = document.getElementById('acctDrop');
  if (!menu || !trigger || !drop) return;
  let selected = +(localStorage.getItem('win_selected_account') || 0);

  const manageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';

  function renderOptions() {
    const accountRows = ACCOUNTS.length
      ? '<div class="dm-label">Switch account</div>' + ACCOUNTS.map((a, i) => `
          <button class="acct-opt${i === selected ? ' sel' : ''}" data-i="${i}">
            <span class="ao-tx">
              <span class="ao-name">${a.broker}<span class="ao-num">${a.num}</span></span>
              <span class="ao-meta">${a.synced}</span>
            </span>
            ${checkIcon}
          </button>`).join('')
      : '<div class="dm-no-accounts">No connected accounts</div>';
    drop.innerHTML = accountRows +
      `<button class="acct-manage-btn" id="manageAcctsBtn">${manageIcon}<span>Manage accounts</span></button>`;
  }

  function applyAccount(i) {
    if (!ACCOUNTS.length) {
      document.getElementById('acctBroker').textContent = 'No accounts';
      document.getElementById('acctNum').textContent = '';
      const synced = document.getElementById('acctSynced');
      if (synced) synced.textContent = '';
      return;
    }
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
    selected = +opt.dataset.i; localStorage.setItem('win_selected_account', selected); applyAccount(selected); close();
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
  let addBrokerObj = null; // full broker object {name, logo_url, signup_url}
  let foundAccount = null; // broker_clients record after lookup
  let searchAcctNum = ''; // preserves typed account number across re-renders
  let confirmRemoveIdx = -1;
  let editNicknameIdx = -1;

  function openManageModal() { modalView = 'list'; addBroker = ''; addBrokerObj = null; foundAccount = null; searchAcctNum = ''; confirmRemoveIdx = -1; editNicknameIdx = -1; renderModal(); overlay.classList.add('show'); }
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
          ${communityBrokers === null
            ? `<div class="ma-loading">Loading brokers…</div>`
            : (communityBrokers.length === 0
                ? `<div class="ma-loading">No brokers configured for your community.</div>`
                : communityBrokers.map(b => {
                    const bName = typeof b === 'string' ? b : b.name;
                    const bLogo = typeof b === 'string' ? null : b.logo_url;
                    return `
                    <button class="ma-broker${addBroker === bName ? ' sel' : ''}" data-broker="${bName}">
                      <span class="ma-broker-icon">
                        ${bLogo
                          ? `<img src="${bLogo}" alt="${bName}" class="ma-broker-logo">`
                          : bName.charAt(0)}
                      </span>
                      <span>${bName}</span>
                    </button>`;
                  }).join('')
              )
          }
        </div>
        <div class="ma-support">Can't find your broker? <a href="mailto:support@mdmtraders.com">Contact support</a> and we'll help you get set up.</div>
      </div>`;
    bindStep1Events();
  }

  function renderStep2() {
    const signupUrl  = addBrokerObj?.signup_url || null;
    const externalIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;flex-shrink:0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    const accountPreview = foundAccount ? `
      <div class="ma-acct-preview">
        <div class="ma-ap-row"><span class="ma-ap-label">Name</span><span class="ma-ap-val">${foundAccount.name || '—'}</span></div>
        <div class="ma-ap-row"><span class="ma-ap-label">Email</span><span class="ma-ap-val">${foundAccount.email || '—'}</span></div>
        <div class="ma-ap-row"><span class="ma-ap-label">Balance</span><span class="ma-ap-val ma-ap-balance">${foundAccount.account_currency || ''} ${Number(foundAccount.balance || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
      </div>
      <div id="maLinkMsg" class="ma-link-msg"></div>
      <button class="ma-submit-btn" id="maConfirm">${linkIcon}<span>Connect this account</span></button>
    ` : '';

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
            <div class="ma-step-title">Step 2: Link your account</div>
          </div>

          ${signupUrl ? `
          <div class="ma-create-box">
            <p class="ma-create-text">Don't have a <strong>${addBroker}</strong> account yet?</p>
            <a class="ma-create-btn" href="${signupUrl}" target="_blank" rel="noopener">
              <span>Create an account with ${addBroker}</span>
              ${externalIcon}
            </a>
          </div>
          <div class="ma-or-divider"><span>Already have an account?</span></div>
          ` : ''}

          <p class="ma-step-subtitle">If your account is verified, enter your account number below.</p>
          <div class="ma-field">
            <label class="ma-label">Account Number</label>
            <div style="display:flex;gap:8px">
              <input class="ma-input" id="maAcctNum" type="text" placeholder="e.g. 1009016" maxlength="20" autocomplete="off" style="flex:1" value="${searchAcctNum}">
              <button class="ma-lookup-btn" id="maLookup" ${searchAcctNum ? '' : 'disabled'}>Search</button>
            </div>
            <div id="maLookupMsg" class="ma-link-msg" style="margin-top:8px"></div>
          </div>
          ${accountPreview}
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
      btn.onclick = async () => {
        const idx = +btn.dataset.remove;
        const acct = ACCOUNTS[idx];
        const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
        if (acct && userObj?.id) {
          const accountId = acct.num.replace('#', '');
          try {
            await fetch('/api/link-account', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userObj.id, account_id: accountId })
            });
          } catch { /* ignore network errors — remove locally anyway */ }
        }
        ACCOUNTS.splice(idx, 1);
        confirmRemoveIdx = -1;
        if (selected >= ACCOUNTS.length) selected = Math.max(0, ACCOUNTS.length - 1);
        if (ACCOUNTS.length) applyAccount(selected); else applyAccount(0);
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
      btn.onclick = () => {
        addBroker = btn.dataset.broker;
        addBrokerObj = communityBrokers
          ? communityBrokers.find(b => (typeof b === 'string' ? b : b.name) === addBroker) || null
          : null;
        modalView = 'add-step2';
        renderModal();
      };
    });
    overlay.onclick = e => { if (e.target === overlay) closeManageModal(); };
    overlay.addEventListener('community-loaded', () => renderModal(), { once: true });
  }

  function bindStep2Events() {
    overlay.querySelector('#maClose').onclick = closeManageModal;
    overlay.querySelector('#maBack').onclick = () => { modalView = 'add-step1'; foundAccount = null; searchAcctNum = ''; renderModal(); };

    const numInput  = overlay.querySelector('#maAcctNum');
    const lookupBtn = overlay.querySelector('#maLookup');
    const lookupMsg = overlay.querySelector('#maLookupMsg');

    numInput.addEventListener('input', () => {
      searchAcctNum = numInput.value;
      lookupBtn.disabled = !numInput.value.trim();
    });

    lookupBtn.onclick = async () => {
      const num = numInput.value.trim();
      if (!num) return;
      searchAcctNum = num;
      lookupMsg.textContent = 'Searching…';
      lookupMsg.style.color = 'var(--muted)';
      lookupBtn.disabled = true;
      foundAccount = null;
      try {
        const res  = await fetch(`/api/link-account?account_id=${encodeURIComponent(num)}`);
        const json = await res.json();
        if (!res.ok) {
          lookupMsg.textContent = json.error || 'Account not found.';
          lookupMsg.style.color = 'var(--red-val)';
          lookupBtn.disabled = false;
        } else {
          foundAccount = json.account;
          renderStep2();
        }
      } catch {
        lookupMsg.textContent = 'Network error. Please try again.';
        lookupMsg.style.color = 'var(--red-val)';
        lookupBtn.disabled = false;
      }
    };

    const confirmBtn = overlay.querySelector('#maConfirm');
    if (confirmBtn) {
      const linkMsg = overlay.querySelector('#maLinkMsg');
      confirmBtn.onclick = async () => {
        const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
        const userId = userObj?.id;
        if (!userId || !foundAccount) return;
        confirmBtn.disabled = true;
        if (linkMsg) { linkMsg.textContent = 'Linking…'; linkMsg.style.color = 'var(--muted)'; }
        try {
          const res  = await fetch('/api/link-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, account_id: foundAccount.id })
          });
          const json = await res.json();
          if (!res.ok) {
            if (linkMsg) { linkMsg.textContent = json.error || 'Failed to link account.'; linkMsg.style.color = 'var(--red-val)'; }
            confirmBtn.disabled = false;
          } else {
            ACCOUNTS.push({
              name: foundAccount.name || addBroker + ' Account',
              nickname: '',
              num: '#' + foundAccount.id,
              broker: addBroker,
              synced: 'Just linked'
            });
            selected = ACCOUNTS.length - 1;
            applyAccount(selected);
            const gate = document.getElementById('accountGate');
            if (gate) gate.remove();
            removePageLocks();
            foundAccount = null;
            searchAcctNum = '';
            modalView = 'list';
            renderModal();
          }
        } catch {
          if (linkMsg) { linkMsg.textContent = 'Network error. Please try again.'; linkMsg.style.color = 'var(--red-val)'; }
          confirmBtn.disabled = false;
        }
      };
    }

    overlay.onclick = e => { if (e.target === overlay) closeManageModal(); };
    numInput.focus();
  }

  addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('show')) closeManageModal(); });

  // ── Account gate (lock pages until a trading account is linked) ──
  const GATED_PAGES = ['calendar', 'journal', 'courses', 'performance'];

  const PAGE_LOCK_SELECTORS = {
    calendar:    ['.cal', '.th-card'],
    journal:     ['.j-layout'],
    courses:     ['#gridView'],
    performance: ['.perf-content']
  };

  const lockSvg = '<svg class="lock-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

  function applyPageLocks(page) {
    const sels = PAGE_LOCK_SELECTORS[page] || [];
    sels.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el || el.classList.contains('has-lock')) return;
      el.classList.add('has-lock');
      const overlay = document.createElement('div');
      overlay.className = 'card-lock';
      overlay.innerHTML = lockSvg + '<button class="lock-unlock-btn">Unlock</button>';
      el.appendChild(overlay);
      overlay.querySelector('.lock-unlock-btn').onclick = () => showAccountGate();
    });
  }

  function removePageLocks() {
    document.querySelectorAll('.has-lock').forEach(el => {
      el.classList.remove('has-lock');
      const lk = el.querySelector('.card-lock');
      if (lk) lk.remove();
    });
    networksLocked = false;
    // Re-render channels to restore stripped href/target/rel attrs and remove lock icons
    loadChannels();
  }

  function showAccountGate() {
    if (document.getElementById('accountGate')) return;

    const broker     = communityBrokers?.[0] || null;
    const brokerName = broker ? (typeof broker === 'string' ? broker : broker.name) : 'your broker';
    const signupUrl  = broker && typeof broker !== 'string' ? (broker.signup_url || null) : null;
    const externalIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    const brokerLogo = broker && typeof broker !== 'string' ? (broker.logo_url || null) : null;
    const brokerLogoHtml = brokerLogo
      ? `<div class="gate-broker-logo-wrap"><img class="gate-broker-logo-img" src="${brokerLogo}" alt="${brokerName}"></div>`
      : '';

    const gate = document.createElement('div');
    gate.id = 'accountGate';
    gate.className = 'account-gate';
    gate.innerHTML = `
      <div class="gate-card">
        <button class="gate-close" id="gateClose" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        <img class="gate-logo" src="https://ffxlryusmstnfjedleds.supabase.co/storage/v1/object/public/Assets/WIN.png" alt="WIN">
        <p class="gate-desc">To enjoy the WIN platform for free, connect a Live, Funded, ${brokerName} account.</p>
        ${brokerLogoHtml}
        ${signupUrl
          ? `<a class="gate-btn gate-broker-btn" href="${signupUrl}" target="_blank" rel="noopener"><span>Create Account</span>${externalIcon}</a>`
          : `<button class="gate-btn gate-broker-btn" disabled>Create Account</button>`
        }
        <p class="gate-support">Struggling to create an account? <a href="mailto:support@mdmtraders.com">Contact support</a></p>
        <div class="gate-divider"><span>Already have an account?</span></div>
        <p class="gate-existing-desc">Already have a ${brokerName} account? Enter your existing account ID below.</p>
        <div class="gate-search-row">
          <input class="gate-input" id="gateAcctNum" type="text" placeholder="Enter your account number" autocomplete="off" maxlength="20">
          <button class="gate-connect-btn" id="gateConnectBtn" disabled>Connect</button>
        </div>
        <div class="gate-msg" id="gateMsg"></div>
      </div>`;
    document.body.appendChild(gate);

    gate.querySelector('#gateClose').onclick = () => gate.remove();

    const numInput   = gate.querySelector('#gateAcctNum');
    const connectBtn = gate.querySelector('#gateConnectBtn');
    const gateMsg    = gate.querySelector('#gateMsg');

    numInput.addEventListener('input', () => {
      connectBtn.disabled = !numInput.value.trim();
    });

    connectBtn.onclick = async () => {
      const num = numInput.value.trim();
      if (!num) return;
      const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
      if (!userObj?.id) { gateMsg.textContent = 'Please sign in first.'; gateMsg.style.color = 'var(--red-val)'; return; }
      connectBtn.disabled = true;
      gateMsg.textContent = 'Connecting…';
      gateMsg.style.color = 'var(--muted)';
      try {
        const res  = await fetch('/api/link-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userObj.id, account_id: num })
        });
        const json = await res.json();
        if (!res.ok) {
          gateMsg.textContent = json.error || 'Failed to connect account.';
          gateMsg.style.color = 'var(--red-val)';
          connectBtn.disabled = false;
        } else {
          gateMsg.textContent = 'Account connected!';
          gateMsg.style.color = 'var(--green-val)';
          await loadLinkedAccounts();
          removePageLocks();
          setTimeout(() => gate.remove(), 600);
        }
      } catch {
        gateMsg.textContent = 'Network error. Please try again.';
        gateMsg.style.color = 'var(--red-val)';
        connectBtn.disabled = false;
      }
    };
  }

  async function checkAccountGate(page) {
    const userObj = JSON.parse(localStorage.getItem('win_user') || 'null');
    if (!userObj?.id) return;
    let hasAccounts = false;
    try {
      const res = await fetch(`/api/linked-accounts?user_id=${encodeURIComponent(userObj.id)}`);
      if (!res.ok) return;
      const { accounts } = await res.json();
      hasAccounts = !!(accounts && accounts.length > 0);
    } catch { return; }
    if (hasAccounts) return; // all unlocked
    if (communityLoadPromise) await communityLoadPromise;
    // Lock network channels on every page when no account
    networksLocked = true;
    lockNetworkChannels();
    // Lock page content + show gate only on gated pages
    if (GATED_PAGES.includes(page)) {
      applyPageLocks(page);
      showAccountGate();
    }
  }

  checkAccountGate(activePage);
}

return { initShell, loadChannels };
})();
