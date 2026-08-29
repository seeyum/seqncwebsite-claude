/**
 * Greyhouse Ops — demo application shell.
 * Fully client-side, in-memory only. Nothing is ever sent over the network,
 * nothing is written to localStorage/sessionStorage/cookies. A hard page
 * refresh (or the Restart demo control) returns to the exact seed state.
 */

/* ==========================================================================
   Icons (hand-drawn, Lucide-style outline set, 24x24, stroke-based)
   ========================================================================== */
var ICON = {
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v9h5v-5h2v5h5v-9"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><circle cx="17.2" cy="9.2" r="2.4"/><path d="M15.3 14.7c2.6.3 4.2 2.2 4.2 5.3"/>',
  chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M3 20.5h18"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.8 5.8l2.1 2.1M16.1 16.1l2.1 2.1M5.8 18.2l2.1-2.1M16.1 7.9l2.1-2.1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.3A8.4 8.4 0 1 1 9.7 4a7 7 0 0 0 10.3 10.3z"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
  chevronRight: '<path d="M9 18l6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v5"/><path d="M12 17.3h.01"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 7.8h.01"/><path d="M10.75 11h1.25v5.5h1.25"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/>',
  folder: '<path d="M3 6.5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-10.5z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
  external: '<path d="M14 3h7v7"/><path d="M21 3l-9 9"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  upload: '<path d="M12 21V9"/><path d="M7 14l5-5 5 5"/><path d="M4.5 4h15"/>'
};
function icon(name, cls) {
  return '<span class="nav-icon' + (cls ? ' ' + cls : '') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg></span>';
}

/* ==========================================================================
   State
   ========================================================================== */
var STATE;

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function buildInitialState() {
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    theme: prefersDark ? 'dark' : 'light',
    currentUserId: null,
    sidebarCollapsed: false,
    mobileNavOpen: false,
    avatarMenuOpen: false,
    portalOpenItemId: null,
    adminOpenItemId: null,
    calendar: { year: 2026, month: 5 }, // June 2026 (0-indexed) — matches DEMO_TODAY
    agency: deepClone(DEMO_SEED.agency),
    users: deepClone(DEMO_SEED.users),
    clients: deepClone(DEMO_SEED.clients),
    onboardingItems: deepClone(DEMO_SEED.onboardingItems),
    pipelineWeeks: deepClone(DEMO_SEED.pipelineWeeks),
    weeklyLogs: deepClone(DEMO_SEED.weeklyLogs),
    goals: deepClone(DEMO_SEED.goals),
    integrations: deepClone(DEMO_SEED.integrations),
    discoveryCalls: deepClone(DEMO_SEED.discoveryCalls),
    seq: { client: 100, item: 1000 },
    toasts: []
  };
}

function resetDemo() {
  STATE = buildInitialState();
  closeAllDialogs();
  location.hash = '#/login';
  renderAll();
  showToast('Demo restarted');
}

/* ==========================================================================
   Small utilities
   ========================================================================== */
function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function fmtDate(iso) {
  if (!iso) return '—';
  var d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  var d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function initials(name) {
  return (name || '').split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('').toUpperCase();
}
function statusKey(status) {
  return { 'Waiting Onboarding': 'waiting_onboarding', 'Onboarded': 'onboarded', 'Work In Progress': 'in_progress', 'Delivered': 'delivered', 'New Updates': 'updates' }[status] || 'neutral';
}
function itemStatusLabel(s) {
  return { pending: 'Pending', submitted: 'Submitted', approved: 'Approved', revision_requested: 'Revision requested' }[s] || s;
}
function badge(text, key) {
  return '<span class="badge badge--' + key + '"><span class="badge-dot"></span>' + esc(text) + '</span>';
}
function currentUser() {
  return STATE.users.filter(function (u) { return u.id === STATE.currentUserId; })[0] || null;
}
function clientById(id) { return STATE.clients.filter(function (c) { return c.id === id; })[0] || null; }
function itemsForClient(id) { return STATE.onboardingItems[id] || []; }
function userById(id) { return STATE.users.filter(function (u) { return u.id === id; })[0] || null; }

/* ==========================================================================
   Business logic (ported from the real app's rules)
   ========================================================================== */
function onboardingProgress(clientId) {
  var items = itemsForClient(clientId).filter(function (i) { return !i.is_optional; });
  var approved = items.filter(function (i) { return i.status === 'approved'; }).length;
  var submitted = items.filter(function (i) { return i.status === 'submitted'; }).length;
  return { total: items.length, approved: approved, submitted: submitted };
}
function onboardingPercent(client) {
  if (client.status !== 'Waiting Onboarding') return 100;
  var p = onboardingProgress(client.id);
  if (p.total === 0) return 0;
  return Math.round(((p.approved + p.submitted * 0.5) / p.total) * 100);
}
function hasNewItems(clientId) {
  return itemsForClient(clientId).some(function (i) { return i.status === 'submitted'; });
}
function isRecentlyCreated(iso) {
  var created = new Date(iso);
  var ref = new Date(DEMO_TODAY);
  var days = (ref - created) / 86400000;
  return days >= 0 && days <= 7;
}
function currentMRR() {
  return STATE.clients.reduce(function (s, c) { return s + (c.mrr_value || 0); }, 0);
}
function avgContractValue() {
  return STATE.clients.length ? currentMRR() / STATE.clients.length : 0;
}
function recentPipeline(n) {
  return STATE.pipelineWeeks.slice(-n);
}
function projectedMRR() {
  var recent = recentPipeline(4);
  var avgDeals = recent.reduce(function (s, w) { return s + w.deals_closed; }, 0) / (recent.length || 1);
  return currentMRR() + avgDeals * avgContractValue() * 4;
}
function deliveryStats() {
  var active = STATE.clients.filter(function (c) { return c.status === 'Work In Progress'; }).length;
  var waiting = STATE.clients.filter(function (c) { return c.status === 'Waiting Onboarding'; }).length;
  return { active: active, total: STATE.clients.length, waiting: waiting };
}
function statusDistribution() {
  var order = ['Waiting Onboarding', 'Onboarded', 'Work In Progress', 'Delivered', 'New Updates'];
  return order.map(function (s) {
    return { label: s, value: STATE.clients.filter(function (c) { return c.status === s; }).length, className: 'd-' + statusKey(s).replace('waiting_onboarding', 'waiting').replace('in_progress', 'progress') };
  });
}
function topIndustries() {
  var counts = {};
  STATE.clients.forEach(function (c) { counts[c.industry] = (counts[c.industry] || 0) + 1; });
  return Object.keys(counts).map(function (k) { return { label: k, value: counts[k] }; })
    .sort(function (a, b) { return b.value - a.value; }).slice(0, 5);
}
function onboardingCompletionRate() {
  var waitingClients = STATE.clients.filter(function (c) { return c.status === 'Waiting Onboarding'; });
  var total = 0, done = 0;
  waitingClients.forEach(function (c) {
    itemsForClient(c.id).filter(function (i) { return !i.is_optional; }).forEach(function (i) {
      total++;
      if (i.status === 'submitted' || i.status === 'approved') done++;
    });
  });
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
function monthOf(iso) { return iso.slice(0, 7); }
function teamMonthToDate(userId) {
  var month = monthOf(DEMO_TODAY);
  var logs = STATE.weeklyLogs.filter(function (l) { return l.user_id === userId && monthOf(l.week_start) === month; });
  return logs.reduce(function (acc, l) {
    acc.contacts += l.contacts; acc.calls_completed += l.calls_completed;
    acc.clients_closed += l.clients_closed; acc.revenue_closed += l.revenue_closed;
    return acc;
  }, { contacts: 0, calls_completed: 0, clients_closed: 0, revenue_closed: 0 });
}
function goalsFor(userId) {
  return STATE.goals.filter(function (g) { return g.user_id === userId && g.month === monthOf(DEMO_TODAY); })[0] || null;
}
function latestWeek(userId) {
  var logs = STATE.weeklyLogs.filter(function (l) { return l.user_id === userId; });
  logs.sort(function (a, b) { return a.week_start < b.week_start ? 1 : -1; });
  return logs[0] || null;
}
function pipelineFunnel(w) {
  return {
    responseRate: w.contacted ? Math.round((w.replied / w.contacted) * 100) : 0,
    proposalRate: w.replied ? Math.round((w.proposals_sent / w.replied) * 100) : 0,
    closeRate: w.proposals_sent ? Math.round((w.deals_closed / w.proposals_sent) * 100) : 0
  };
}

/* ==========================================================================
   Toasts
   ========================================================================== */
var toastTimer = null, toastSeq = 0;
function showToast(msg) {
  var id = ++toastSeq;
  STATE.toasts.push({ id: id, msg: msg });
  renderToasts();
  setTimeout(function () {
    STATE.toasts = STATE.toasts.filter(function (t) { return t.id !== id; });
    renderToasts();
  }, 2600);
}
function renderToasts() {
  var el = document.getElementById('toast-root');
  el.innerHTML = STATE.toasts.map(function (t) { return '<div class="toast">' + esc(t.msg) + '</div>'; }).join('');
}

/* ==========================================================================
   Dialogs
   ========================================================================== */
function closeAllDialogs() {
  document.getElementById('dialog-root').innerHTML = '';
}
function openDialog(innerHtml, onMount) {
  var root = document.getElementById('dialog-root');
  root.innerHTML = '<div class="dialog-backdrop" data-close-dialog>' +
    '<div class="dialog" role="dialog" aria-modal="true">' + innerHtml + '</div></div>';
  root.querySelector('.dialog-backdrop').addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close-dialog')) closeAllDialogs();
  });
  if (onMount) onMount(root);
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeAllDialogs();
});

/* ==========================================================================
   Router
   ========================================================================== */
function route() { return location.hash || '#/login'; }
function navigate(hash) { location.hash = hash; }
window.addEventListener('hashchange', renderAll);

function defaultRouteForUser(user) {
  if (!user) return '#/login';
  if (user.role === 'client') return '#/portal';
  if (user.role === 'owner') return '#/analytics';
  return '#/my-dashboard';
}

/* ==========================================================================
   Boot / top-level render
   ========================================================================== */
function renderAll() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  var r = route();
  var user = currentUser();

  if (!user) {
    document.getElementById('root').innerHTML = renderLogin();
    bindLogin();
    return;
  }

  // Guard role-restricted routes
  var path = r.split('?')[0];
  if (path === '#/login') { navigate(defaultRouteForUser(user)); return; }
  if (path.indexOf('#/portal') === 0 && user.role !== 'client') { navigate(defaultRouteForUser(user)); return; }
  if ((path.indexOf('#/clients') === 0 || path.indexOf('#/analytics') === 0) && user.role === 'client') { navigate(defaultRouteForUser(user)); return; }
  if (path.indexOf('#/team') === 0 && user.role !== 'owner') { navigate(defaultRouteForUser(user)); return; }
  if (path.indexOf('#/my-dashboard') === 0 && user.role === 'client') { navigate(defaultRouteForUser(user)); return; }

  document.getElementById('root').innerHTML = renderShell(user);
  mountShellEvents();
  renderRouteContent(user);
  renderToasts();
}

function renderRouteContent(user) {
  var path = route().split('?')[0];
  var el = document.getElementById('view-root');
  var title = 'Overview';
  var html = '';

  if (path === '#/portal') { title = 'Your Project'; html = renderPortal(user); }
  else if (path === '#/clients') { title = 'Clients'; html = renderClientsList(); }
  else if (path.indexOf('#/clients/') === 0) {
    var id = path.replace('#/clients/', '');
    var c = clientById(id);
    if (!c) { navigate('#/clients'); return; }
    title = c.business_name;
    html = renderClientDetail(c);
  }
  else if (path === '#/analytics') { title = 'Analytics'; html = renderAnalytics(); }
  else if (path === '#/my-dashboard') { title = 'My Dashboard'; html = renderMyDashboard(user); }
  else if (path === '#/team') { title = 'Team & Settings'; html = renderTeamSettings(); }
  else { html = renderPortal(user); }

  document.getElementById('header-title').textContent = title;
  el.innerHTML = html;
  bindRouteEvents(path);
}

/* ==========================================================================
   Shell (sidebar + header)
   ========================================================================== */
function navItemsFor(user) {
  if (user.role === 'client') {
    return [{ hash: '#/portal', label: 'Your Project', icon: 'home' }];
  }
  if (user.role === 'owner') {
    return [
      { hash: '#/clients', label: 'Clients', icon: 'users' },
      { hash: '#/analytics', label: 'Analytics', icon: 'chart' },
      { hash: '#/team', label: 'Team & Settings', icon: 'gear' }
    ];
  }
  return [
    { hash: '#/my-dashboard', label: 'My Dashboard', icon: 'home' },
    { hash: '#/clients', label: 'Clients', icon: 'users' }
  ];
}

function renderShell(user) {
  var items = navItemsFor(user);
  var path = route().split('?')[0];
  var navHtml = items.map(function (it) {
    var active = path === it.hash || (it.hash === '#/clients' && path.indexOf('#/clients') === 0);
    return '<button class="nav-link' + (active ? ' is-active' : '') + '" data-nav="' + it.hash + '">' +
      icon(it.icon) + '<span class="nav-label">' + esc(it.label) + '</span></button>';
  }).join('');

  return '' +
    '<div class="app-shell">' +
      '<div class="sidebar-backdrop' + (STATE.mobileNavOpen ? ' is-visible' : '') + '" id="sidebar-backdrop"></div>' +
      '<aside class="sidebar' + (STATE.sidebarCollapsed ? ' is-collapsed' : '') + (STATE.mobileNavOpen ? ' is-mobile-open' : '') + '" id="sidebar">' +
        '<div class="sidebar-brand">' + brandMark() + '<span class="brand-name">' + esc(STATE.agency.product) + '</span></div>' +
        '<nav class="sidebar-nav">' + navHtml + '</nav>' +
        '<div class="sidebar-foot">' +
          '<a class="sidebar-foot-btn" href="/#demos" style="text-decoration:none;">' + icon('chevronLeft') + '<span class="sidebar-foot-text">Back to Seqnc</span></a>' +
          '<button class="sidebar-foot-btn" id="btn-restart-sidebar">' + icon('refresh') + '<span class="sidebar-foot-text">Restart demo</span></button>' +
          '<button class="sidebar-foot-btn" id="btn-collapse">' + icon('panel') + '<span class="sidebar-foot-text">Collapse</span></button>' +
        '</div>' +
      '</aside>' +
      '<div class="main-col">' +
        '<header class="app-header">' +
          '<div class="header-title-group">' +
            '<button class="icon-btn" id="btn-mobile-nav" data-mobile-toggle>' + icon('menu') + '</button>' +
            '<h1 class="header-title" id="header-title">Overview</h1>' +
            demoBadge() +
          '</div>' +
          '<div class="header-actions">' +
            '<button class="theme-toggle" id="btn-theme">' + icon(STATE.theme === 'dark' ? 'sun' : 'moon') + '</button>' +
            renderAvatarMenu(user) +
          '</div>' +
        '</header>' +
        '<main><div class="page-container" id="view-root"></div></main>' +
      '</div>' +
    '</div>';
}

function brandMark() {
  return '<div class="brand-mark">' + esc((STATE.agency.name || 'G')[0]) + '</div>';
}
function demoBadge() {
  return '<span class="demo-badge"><span class="demo-badge__dot"></span>Demo</span>';
}

function renderAvatarMenu(user) {
  return '<div class="avatar-menu">' +
    '<button class="avatar-btn" id="btn-avatar">' +
      '<span class="avatar-circle">' + esc(initials(user.full_name)) + '</span>' +
      '<span style="text-align:left;line-height:1.25;">' +
        '<span class="avatar-name" style="display:block;">' + esc(user.full_name) + '</span>' +
        '<span class="avatar-role">' + esc(user.role) + '</span>' +
      '</span>' + icon('chevronDown') +
    '</button>' +
    '<div class="dropdown-menu' + (STATE.avatarMenuOpen ? ' is-open' : '') + '" id="avatar-dropdown">' +
      '<button class="dropdown-item" id="btn-signout">' + icon('logout') + ' Sign out</button>' +
      '<div class="dropdown-sep"></div>' +
      '<button class="dropdown-item" id="btn-restart-menu">' + icon('refresh') + ' Restart demo</button>' +
    '</div>' +
  '</div>';
}

function mountShellEvents() {
  document.querySelectorAll('[data-nav]').forEach(function (btn) {
    btn.addEventListener('click', function () { STATE.mobileNavOpen = false; navigate(btn.getAttribute('data-nav')); });
  });
  var collapseBtn = document.getElementById('btn-collapse');
  if (collapseBtn) collapseBtn.addEventListener('click', function () { STATE.sidebarCollapsed = !STATE.sidebarCollapsed; renderAll(); });
  var mobileToggle = document.getElementById('btn-mobile-nav');
  if (mobileToggle) mobileToggle.addEventListener('click', function () { STATE.mobileNavOpen = !STATE.mobileNavOpen; renderAll(); });
  var backdrop = document.getElementById('sidebar-backdrop');
  if (backdrop) backdrop.addEventListener('click', function () { STATE.mobileNavOpen = false; renderAll(); });
  var themeBtn = document.getElementById('btn-theme');
  if (themeBtn) themeBtn.addEventListener('click', function () { STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark'; renderAll(); });
  var avatarBtn = document.getElementById('btn-avatar');
  if (avatarBtn) avatarBtn.addEventListener('click', function (e) { e.stopPropagation(); STATE.avatarMenuOpen = !STATE.avatarMenuOpen; renderAll(); });
  var signout = document.getElementById('btn-signout');
  if (signout) signout.addEventListener('click', function () { STATE.currentUserId = null; STATE.avatarMenuOpen = false; navigate('#/login'); });
  ['btn-restart-sidebar', 'btn-restart-menu'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', resetDemo);
  });
  document.addEventListener('click', function closeMenus(e) {
    if (STATE.avatarMenuOpen && !e.target.closest('.avatar-menu')) { STATE.avatarMenuOpen = false; renderAll(); }
  }, { once: true });
}

/* ==========================================================================
   Login
   ========================================================================== */
function renderLogin() {
  var demoAccounts = [
    { id: 'owner-01', tag: 'Owner' },
    { id: 'admin-01', tag: 'Team member' },
    { id: 'client-01', tag: 'Client — established' },
    { id: 'client-06', tag: 'Client — new signup' }
  ];
  var rows = demoAccounts.map(function (a) {
    var u = userById(a.id);
    return '<button class="demo-account-btn" data-demo-login="' + u.id + '">' +
      '<span class="demo-account-avatar">' + esc(initials(u.full_name)) + '</span>' +
      '<span class="demo-account-info">' +
        '<span class="demo-account-name">' + esc(u.full_name) + '</span>' +
        '<span class="demo-account-role">' + esc(a.tag) + ' · ' + esc(u.email) + '</span>' +
      '</span>' + icon('chevronRight') +
    '</button>';
  }).join('');

  return '<div class="login-screen"><div class="login-card">' +
    '<div class="login-brand">' + brandMark() + '<span class="brand-name">' + esc(STATE.agency.product) + '</span>' + demoBadge() + '</div>' +
    '<h1>Explore the demo</h1>' +
    '<p class="login-sub">' + esc(STATE.agency.name) + ' client &amp; team portal.</p>' +
    '<div class="login-note">' + icon('info') + '<span>Login and password screens are simulated for this demo — pick an account below and you\'ll be signed in directly.</span></div>' +
    '<p class="login-accounts-label">Demo accounts</p>' +
    '<div class="demo-account-list">' + rows + '</div>' +
    '<p class="login-footnote">Nothing you do here is sent or saved anywhere — everything resets on refresh.</p>' +
    '<div class="login-reset-wrap"><button class="restart-btn" id="btn-restart-login">' + icon('refresh') + ' Reset demo data</button>' +
      '<a class="restart-btn" href="/#demos" style="text-decoration:none;margin-left:8px;">' + icon('chevronLeft') + ' Back to Seqnc</a></div>' +
  '</div></div>';
}

function bindLogin() {
  document.querySelectorAll('[data-demo-login]').forEach(function (btn) {
    btn.addEventListener('click', function () { loginAs(btn.getAttribute('data-demo-login')); });
  });
  var resetBtn = document.getElementById('btn-restart-login');
  if (resetBtn) resetBtn.addEventListener('click', resetDemo);
}
function loginAs(userId) {
  var u = userById(userId);
  if (!u) return;
  STATE.currentUserId = userId;
  navigate(defaultRouteForUser(u));
}

/* ==========================================================================
   Shared bits: onboarding accordion, status icons, drive popup
   ========================================================================== */
function accordionStatusIcon(status) {
  var map = {
    pending: ['circle', 'badge--pending'],
    submitted: ['circle', 'badge--submitted'],
    approved: ['check', 'badge--approved'],
    revision_requested: ['alert', 'badge--revision_requested']
  };
  var m = map[status] || map.pending;
  return '<span class="accordion-status-icon ' + m[1] + '">' + icon(m[0]) + '</span>';
}

function renderOnboardingAccordion(client, items, mode) {
  // mode: 'client' (editable answers) or 'admin' (approve / revision controls)
  var byCategory = {};
  var order = [];
  items.forEach(function (i) {
    if (!byCategory[i.category]) { byCategory[i.category] = []; order.push(i.category); }
    byCategory[i.category].push(i);
  });

  var openId = mode === 'client' ? STATE.portalOpenItemId : STATE.adminOpenItemId;

  var html = order.map(function (cat) {
    return byCategory[cat].map(function (item) {
      var isOpen = openId === item.id;
      return '<div class="accordion-item' + (isOpen ? ' is-open' : '') + '" data-item-id="' + item.id + '">' +
        '<button class="accordion-trigger" data-toggle-item="' + item.id + '" data-mode="' + mode + '">' +
          accordionStatusIcon(item.status) +
          '<span class="accordion-title"><span class="item-label">' + esc(item.label) + (item.is_optional ? ' <span class="text-faint" style="font-weight:400;">(optional)</span>' : '') + '</span>' +
          '<span class="item-category">' + esc(item.category) + '</span></span>' +
          badge(itemStatusLabel(item.status), item.status) +
          '<span class="accordion-chevron">' + icon('chevronDown') + '</span>' +
        '</button>' +
        '<div class="accordion-panel"><div class="accordion-panel-inner">' +
          (isOpen ? (mode === 'client' ? renderClientItemBody(client, item) : renderAdminItemBody(client, item)) : '') +
        '</div></div>' +
      '</div>';
    }).join('');
  }).join('');

  return html || '<div class="empty-state">No checklist items yet.</div>';
}

function renderClientItemBody(client, item) {
  var out = '';
  if (item.status === 'revision_requested' && item.admin_note) {
    out += '<div class="revision-note"><strong>Revision requested:</strong> ' + esc(item.admin_note) + '</div>';
  }
  if (item.status === 'approved') {
    out += '<div style="font-size:13px;">' + (item.type === 'file'
      ? '<span class="file-chip">' + icon('fileText') + esc(item.file_name || 'file') + '</span>'
      : '<p>' + esc(item.answer_text || '') + '</p>') + '</div>';
    return out;
  }
  if (item.type === 'file') {
    out += item.file_name
      ? '<div class="file-chip" style="margin-bottom:10px;">' + icon('fileText') + esc(item.file_name) + '</div>'
      : '';
    out += '<div class="file-drop" data-trigger-file="' + item.id + '">' + icon('upload') + '<div style="margin-top:6px;">Click to choose a file</div></div>' +
      '<input type="file" data-file-input="' + item.id + '" style="display:none" />';
  } else {
    out += '<textarea class="textarea" data-item-textarea="' + item.id + '" placeholder="Type your answer…">' + esc(item.answer_text || '') + '</textarea>';
  }
  out += '<div style="margin-top:10px;display:flex;justify-content:flex-end;">' +
    '<button class="btn btn-primary btn-sm" data-submit-item="' + item.id + '">Submit answer</button></div>';
  return out;
}

function renderAdminItemBody(client, item) {
  var answer = item.type === 'file'
    ? (item.file_name ? '<span class="file-chip">' + icon('fileText') + esc(item.file_name) + '</span>' : '<span class="text-faint">No file yet</span>')
    : '<p style="font-size:13px;">' + (item.answer_text ? esc(item.answer_text) : '<span class="text-faint">No answer yet</span>') + '</p>';

  var actions = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">';
  if (item.status === 'submitted' || item.status === 'pending') {
    actions += '<button class="btn btn-outline btn-sm" data-approve-item="' + item.id + '">' + icon('check') + ' Approve</button>';
    actions += '<button class="btn btn-outline btn-sm" data-request-revision="' + item.id + '">' + icon('alert') + ' Request revision</button>';
  }
  if (item.status === 'revision_requested') {
    actions += '<button class="btn btn-outline btn-sm" data-approve-item="' + item.id + '">' + icon('check') + ' Approve anyway</button>';
  }
  actions += '<button class="btn btn-ghost btn-sm" data-upload-behalf="' + item.id + '">' + icon('upload') + ' Upload on behalf of client</button>';
  if (item.type === 'file' && item.file_name) {
    actions += '<button class="btn btn-ghost btn-sm" data-download-item="' + item.id + '">' + icon('download') + ' Download</button>';
  }
  actions += '</div>';

  var note = item.admin_note ? '<div class="revision-note" style="margin-top:10px;"><strong>Note sent to client:</strong> ' + esc(item.admin_note) + '</div>' : '';

  return answer + note + actions +
    '<input type="file" data-file-input-admin="' + item.id + '" style="display:none" />';
}

function openDrivePopup() {
  openDialog(
    '<div class="dialog-header"><div>' + icon('folder') + '</div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body" style="text-align:center;padding-top:6px;">' +
      '<h3 style="margin-bottom:8px;">Shared drive folder</h3>' +
      '<p class="text-muted" style="font-size:13px;">This routes to the client\'s shared Drive folder. Connections are simulated in this demo — nothing actually opens.</p>' +
    '</div>' +
    '<div class="dialog-footer"><button class="btn btn-primary" data-close-dialog>Got it</button></div>',
    function (root) { root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); }); }
  );
}

/* ==========================================================================
   Client Portal
   ========================================================================== */
function renderPortal(user) {
  var client = clientById(user.id);
  if (!client) return '<div class="empty-state">No project found for this account.</div>';
  var items = itemsForClient(client.id);
  var progress = onboardingProgress(client.id);
  var percent = onboardingPercent(client);
  var firstName = client.full_name.split(' ')[0];

  var timelineHtml;
  if (client.build_start_date && client.planned_delivery_date) {
    var start = new Date(client.build_start_date), end = new Date(client.planned_delivery_date), today = new Date(DEMO_TODAY);
    var totalSpan = Math.max(1, end - start);
    var elapsed = Math.min(Math.max(today - start, 0), totalSpan);
    var pct = Math.round((elapsed / totalSpan) * 100);
    timelineHtml = '<div class="timeline-bar"><div class="timeline-fill" style="width:' + pct + '%"></div>' +
      '<div class="timeline-marker" style="left:' + pct + '%"></div></div>' +
      '<div class="timeline-labels"><span>' + fmtDate(client.build_start_date) + '</span><span>' + fmtDate(client.planned_delivery_date) + '</span></div>';
  } else {
    timelineHtml = '<div class="empty-state" style="padding:20px 0;">Your build start and delivery dates will appear here once scheduling is confirmed.</div>';
  }

  return '<div class="page-head"><div><h1>Welcome back, ' + esc(firstName) + '</h1><p>' + esc(client.business_name) + '</p></div></div>' +
    '<div class="stack">' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><div><h3>Onboarding progress</h3><p>' + (progress.approved + progress.submitted) + ' of ' + progress.total + ' required items completed</p></div>' + badge(client.status, statusKey(client.status)) + '</div>' +
          '<div class="card-body"><div class="progress-track"><div class="progress-fill" style="width:' + percent + '%"></div></div>' +
          '<p class="pace-note">' + percent + '% complete</p></div></div>' +
        '<div class="card"><div class="card-header"><h3>Documents</h3></div><div class="card-body">' +
          (client.drive_connected
            ? '<p class="text-muted" style="font-size:13px;margin-bottom:12px;">Your signed contract and shared files live in your project drive folder.</p><button class="btn btn-outline" data-open-drive>' + icon('folder') + ' Open shared folder</button>'
            : '<div class="empty-state" style="padding:10px 0;">Your shared folder will appear here once it\'s set up.</div>') +
        '</div></div>' +
      '</div>' +

      '<div class="card"><div class="card-header"><h3>Project scope</h3></div><div class="card-body">' +
        (client.project_scope ? '<p style="font-size:13.5px;line-height:1.6;">' + esc(client.project_scope) + '</p>' : '<div class="empty-state">Your project scope will appear here once your build plan is finalized.</div>') +
      '</div></div>' +

      '<div class="card"><div class="card-header"><h3>Project timeline</h3></div><div class="card-body">' + timelineHtml + '</div></div>' +

      '<div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;" class="portal-lower">' +
        '<div class="card"><div class="card-header"><div><h3>Required items</h3><p>Fill these out so we can start building</p></div></div>' +
          '<div class="card-body">' + renderOnboardingAccordion(client, items, 'client') + '</div></div>' +
        '<div class="card"><div class="card-header"><h3>Your notes</h3></div><div class="card-body">' +
          '<textarea class="textarea" id="client-notes-input" placeholder="Questions, ideas, follow-ups…" style="min-height:140px;">' + esc(client.client_notes || '') + '</textarea>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">' +
            '<span class="text-faint" style="font-size:11.5px;">' + (client.client_notes_updated_at ? 'Saved ' + fmtDateTime(client.client_notes_updated_at) : 'Not saved yet') + '</span>' +
            '<button class="btn btn-outline btn-sm" id="btn-save-client-notes">Save</button>' +
          '</div></div></div>' +
      '</div>' +
    '</div>' +
    '<style>@media (max-width: 860px){.portal-lower{grid-template-columns:1fr !important;}}</style>';
}

function rerenderRoute() { renderRouteContent(currentUser()); }

/* Shared accordion interaction handling — used by both Portal (client mode)
   and Admin Client Detail (admin mode). */
function bindOnboardingAccordionEvents(scopeEl, clientId, mode) {
  scopeEl.querySelectorAll('[data-toggle-item]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-toggle-item');
      var key = btn.getAttribute('data-mode') === 'admin' ? 'adminOpenItemId' : 'portalOpenItemId';
      STATE[key] = STATE[key] === id ? null : id;
      rerenderRoute();
    });
  });
  scopeEl.querySelectorAll('[data-trigger-file]').forEach(function (dz) {
    dz.addEventListener('click', function () {
      var id = dz.getAttribute('data-trigger-file');
      var input = scopeEl.querySelector('[data-file-input="' + id + '"]');
      if (input) input.click();
    });
  });
  scopeEl.querySelectorAll('[data-file-input]').forEach(function (input) {
    input.addEventListener('change', function () {
      var id = input.getAttribute('data-file-input');
      var item = findItem(clientId, id);
      if (item && input.files && input.files[0]) {
        item.file_name = input.files[0].name;
        rerenderRoute();
        restoreOpenItem(mode, id);
      }
    });
  });
  scopeEl.querySelectorAll('[data-submit-item]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-submit-item');
      var item = findItem(clientId, id);
      if (!item) return;
      if (item.type === 'text') {
        var ta = scopeEl.querySelector('[data-item-textarea="' + id + '"]');
        item.answer_text = ta ? ta.value.trim() : item.answer_text;
        if (!item.answer_text) { showToast('Add an answer before submitting'); return; }
      } else if (!item.file_name) {
        showToast('Attach a file before submitting'); return;
      }
      item.status = 'submitted';
      item.admin_note = null;
      advanceToNextItem(clientId);
      showToast('Answer submitted');
      rerenderRoute();
    });
  });
  scopeEl.querySelectorAll('[data-approve-item]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-approve-item');
      var item = findItem(clientId, id);
      if (!item) return;
      item.status = 'approved';
      item.admin_note = null;
      showToast('Item approved');
      rerenderRoute();
    });
  });
  scopeEl.querySelectorAll('[data-request-revision]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-request-revision');
      openRevisionDialog(clientId, id);
    });
  });
  scopeEl.querySelectorAll('[data-upload-behalf]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-upload-behalf');
      var input = scopeEl.querySelector('[data-file-input-admin="' + id + '"]');
      if (input) input.click();
    });
  });
  scopeEl.querySelectorAll('[data-file-input-admin]').forEach(function (input) {
    input.addEventListener('change', function () {
      var id = input.getAttribute('data-file-input-admin');
      var item = findItem(clientId, id);
      if (item && input.files && input.files[0]) {
        item.file_name = input.files[0].name;
        item.status = 'approved';
        item.admin_note = null;
        showToast('File uploaded on behalf of client');
        rerenderRoute();
      }
    });
  });
  scopeEl.querySelectorAll('[data-download-item]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('Demo mode — files are not actually stored or downloadable');
    });
  });
  var driveBtn = scopeEl.querySelector('[data-open-drive]');
  if (driveBtn) driveBtn.addEventListener('click', openDrivePopup);
}
function findItem(clientId, itemId) {
  return (STATE.onboardingItems[clientId] || []).filter(function (i) { return i.id === itemId; })[0] || null;
}
function advanceToNextItem(clientId) {
  var items = itemsForClient(clientId);
  var next = items.filter(function (i) { return i.status === 'pending' || i.status === 'revision_requested'; })[0];
  STATE.portalOpenItemId = next ? next.id : null;
}
function restoreOpenItem(mode, id) {
  if (mode === 'client') STATE.portalOpenItemId = id; else STATE.adminOpenItemId = id;
}

function openRevisionDialog(clientId, itemId) {
  openDialog(
    '<div class="dialog-header"><div><h3>Request revision</h3><p>The client will see this note on the item.</p></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body"><div class="field"><label class="field-label">Note to client</label>' +
      '<textarea class="textarea" id="revision-note-input" placeholder="What needs to change?"></textarea></div></div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-confirm-revision">Send request</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-confirm-revision').addEventListener('click', function () {
        var note = root.querySelector('#revision-note-input').value.trim();
        var item = findItem(clientId, itemId);
        if (item) {
          item.status = 'revision_requested';
          item.admin_note = note || 'Please review and update this item.';
        }
        closeAllDialogs();
        showToast('Revision requested');
        rerenderRoute();
      });
    }
  );
}

/* ==========================================================================
   Admin — Client List
   ========================================================================== */
var DEFAULT_ONBOARDING_TEMPLATE = [
  { category: 'Business Information', label: 'Business description', type: 'text', is_optional: false },
  { category: 'Business Information', label: 'Target audience', type: 'text', is_optional: false },
  { category: 'Branding', label: 'Logo files (PNG / SVG)', type: 'file', is_optional: false },
  { category: 'Branding', label: 'Brand color preferences', type: 'text', is_optional: false },
  { category: 'Technical & Credentials', label: 'Domain registrar access', type: 'text', is_optional: false }
];

function renderClientsList() {
  var clients = STATE.clients.slice().sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; });
  var rows = clients.map(function (c) {
    var pct = onboardingPercent(c);
    return '<tr class="is-clickable" data-goto-client="' + c.id + '">' +
      '<td><div class="cell-primary">' + esc(c.business_name) + (hasNewItems(c.id) ? ' <span class="badge badge--updates" style="margin-left:6px;">New</span>' : '') + '</div><div class="cell-sub">' + esc(c.full_name) + '</div></td>' +
      '<td>' + esc(c.industry) + '</td>' +
      '<td>' + esc(c.package) + '</td>' +
      '<td>' + badge(c.status, statusKey(c.status)) + '</td>' +
      '<td style="min-width:120px;"><div class="progress-track" style="margin-bottom:4px;"><div class="progress-fill" style="width:' + pct + '%"></div></div><span class="text-faint" style="font-size:11px;">' + pct + '%</span></td>' +
      '<td>' + (c.drive_connected ? '<button class="btn btn-ghost btn-sm" data-open-drive data-stop-row>' + icon('folder') + ' Drive</button>' : '<span class="text-faint">—</span>') + '</td>' +
      '<td onclick="event.stopPropagation()"><button class="icon-btn" data-delete-client="' + c.id + '" title="Delete client">' + icon('trash') + '</button></td>' +
    '</tr>';
  }).join('');

  var cards = clients.map(function (c) {
    var pct = onboardingPercent(c);
    return '<div class="client-row-card" data-goto-client="' + c.id + '">' +
      '<div style="display:flex;justify-content:space-between;gap:8px;"><div><div class="cell-primary">' + esc(c.business_name) + '</div><div class="cell-sub">' + esc(c.full_name) + ' · ' + esc(c.industry) + '</div></div>' + badge(c.status, statusKey(c.status)) + '</div>' +
      '<div class="progress-track" style="margin-top:10px;"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
    '</div>';
  }).join('');

  return '<div class="page-head"><div><h1>Clients</h1><p>' + clients.length + ' client' + (clients.length === 1 ? '' : 's') + '</p></div>' +
    '<button class="btn btn-primary" id="btn-new-client">' + icon('plus') + ' New client</button></div>' +
    '<div class="card"><div class="table-wrap"><table class="data-table">' +
      '<thead><tr><th>Client</th><th>Industry</th><th>Package</th><th>Status</th><th>Progress</th><th>Drive</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      '<div class="client-row-cards card-body">' + cards + '</div>' +
    '</div>';
}

function bindClientsListEvents(el) {
  el.querySelectorAll('[data-goto-client]').forEach(function (row) {
    row.addEventListener('click', function (e) {
      if (e.target.closest('[data-stop-row]') || e.target.closest('[data-delete-client]')) return;
      navigate('#/clients/' + row.getAttribute('data-goto-client'));
    });
  });
  el.querySelectorAll('[data-open-drive]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); openDrivePopup(); }); });
  el.querySelectorAll('[data-delete-client]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      confirmDeleteClient(b.getAttribute('data-delete-client'));
    });
  });
  var newBtn = el.querySelector('#btn-new-client');
  if (newBtn) newBtn.addEventListener('click', openCreateClientDialog);
}

function confirmDeleteClient(id) {
  var c = clientById(id);
  if (!c) return;
  openDialog(
    '<div class="dialog-header"><div><h3>Delete ' + esc(c.business_name) + '?</h3><p>This removes their account, onboarding items, and files. This can\'t be undone (for this demo session).</p></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-danger" id="btn-confirm-delete">Delete client</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-confirm-delete').addEventListener('click', function () {
        STATE.clients = STATE.clients.filter(function (x) { return x.id !== id; });
        delete STATE.onboardingItems[id];
        closeAllDialogs();
        showToast('Client deleted (demo)');
        if (route().indexOf('#/clients/' + id) === 0) navigate('#/clients'); else rerenderRoute();
      });
    }
  );
}

function openCreateClientDialog() {
  openDialog(
    '<div class="dialog-header"><div><h3>New client</h3><p>Creates a demo account with a starter onboarding checklist.</p></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body">' +
      '<div class="field"><label class="field-label">Contact name</label><input class="input" id="nc-name" placeholder="Jordan Casey" /></div>' +
      '<div class="field"><label class="field-label">Business name</label><input class="input" id="nc-business" placeholder="Casey & Co." /></div>' +
      '<div class="field-row"><div class="field"><label class="field-label">Industry</label><input class="input" id="nc-industry" placeholder="Retail" /></div>' +
      '<div class="field"><label class="field-label">Package</label><select class="input" id="nc-package"><option>Starter</option><option>Business</option><option>E-Commerce</option><option>Custom</option></select></div></div>' +
      '<div class="field"><label class="field-label">Email</label><input class="input" id="nc-email" type="email" placeholder="hello@business.com" /></div>' +
      '<p class="text-faint" style="font-size:11.5px;">A temporary password and shared drive folder would normally be provisioned here — both are simulated in this demo.</p>' +
    '</div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-confirm-create">Create client</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-confirm-create').addEventListener('click', function () {
        var name = root.querySelector('#nc-name').value.trim() || 'New Contact';
        var business = root.querySelector('#nc-business').value.trim() || 'New Business';
        var industry = root.querySelector('#nc-industry').value.trim() || 'General';
        var pkg = root.querySelector('#nc-package').value;
        STATE.seq.client++;
        var id = 'client-new-' + STATE.seq.client;
        STATE.clients.unshift({
          id: id, full_name: name, business_name: business, industry: industry, package: pkg,
          status: 'Waiting Onboarding', mrr_value: 0, setup_fee: 0, build_start_date: null, planned_delivery_date: null,
          admin_notes: '', project_scope: '', client_notes: '', client_notes_updated_at: null,
          drive_connected: false, onboarded_at: null, created_at: DEMO_TODAY + 'T12:00:00Z'
        });
        STATE.onboardingItems[id] = DEFAULT_ONBOARDING_TEMPLATE.map(function (t, i) {
          STATE.seq.item++;
          return { id: 'oi-new-' + STATE.seq.item, category: t.category, label: t.label, type: t.type, answer_text: null, file_name: null, status: 'pending', admin_note: null, is_optional: t.is_optional };
        });
        closeAllDialogs();
        showToast('Client created (demo)');
        rerenderRoute();
      });
    }
  );
}

/* ==========================================================================
   Admin — Client Detail
   ========================================================================== */
function renderClientDetail(c) {
  var items = itemsForClient(c.id);
  var progress = onboardingProgress(c.id);

  return '<button class="btn btn-ghost btn-sm" id="btn-back-clients" style="margin-bottom:14px;">' + icon('chevronLeft') + ' All clients</button>' +
    '<div class="page-head"><div><h1>' + esc(c.business_name) + '</h1><p>' + esc(c.full_name) + ' · ' + esc(c.industry) + '</p></div>' +
      '<div style="display:flex;gap:8px;">' + badge(c.status, statusKey(c.status)) + '<button class="btn btn-outline btn-sm" id="btn-edit-client">' + icon('pencil') + ' Edit details</button></div></div>' +
    '<div class="stack">' +
      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><h3>Client details</h3></div><div class="card-body">' +
          '<dl style="margin:0;">' +
            '<div class="kv-row"><dt>MRR</dt><dd>' + money(c.mrr_value) + '/mo</dd></div>' +
            '<div class="kv-row"><dt>Setup fee</dt><dd>' + money(c.setup_fee) + '</dd></div>' +
            '<div class="kv-row"><dt>Package</dt><dd>' + esc(c.package) + '</dd></div>' +
            '<div class="kv-row"><dt>Build start</dt><dd>' + fmtDate(c.build_start_date) + '</dd></div>' +
            '<div class="kv-row"><dt>Planned delivery</dt><dd>' + fmtDate(c.planned_delivery_date) + '</dd></div>' +
            '<div class="kv-row"><dt>Client since</dt><dd>' + fmtDate(c.created_at) + '</dd></div>' +
          '</dl></div></div>' +
        '<div class="card"><div class="card-header"><h3>Onboarding progress</h3></div><div class="card-body">' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + onboardingPercent(c) + '%"></div></div>' +
          '<p class="pace-note">' + (progress.approved) + ' approved · ' + progress.submitted + ' submitted · ' + (progress.total - progress.approved - progress.submitted) + ' pending (of ' + progress.total + ' required)</p>' +
        '</div></div>' +
      '</div>' +

      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><h3>Admin notes</h3><p>Private — only visible to your team</p></div><div class="card-body">' +
          '<textarea class="textarea" id="admin-notes-input" style="min-height:100px;">' + esc(c.admin_notes || '') + '</textarea>' +
          '<div style="display:flex;justify-content:flex-end;margin-top:8px;"><button class="btn btn-outline btn-sm" id="btn-save-admin-notes">Save</button></div></div></div>' +
        '<div class="card"><div class="card-header"><h3>Client notes</h3><p>Written by the client — read only</p></div><div class="card-body">' +
          (c.client_notes ? '<p style="font-size:13px;line-height:1.6;">' + esc(c.client_notes) + '</p><p class="text-faint" style="font-size:11px;margin-top:8px;">Updated ' + fmtDateTime(c.client_notes_updated_at) + '</p>' : '<div class="empty-state">The client hasn\'t written any notes yet.</div>') +
        '</div></div>' +
      '</div>' +

      '<div class="card"><div class="card-header"><div><h3>Project scope</h3><p>Shown read-only in the client portal</p></div></div><div class="card-body">' +
        '<textarea class="textarea" id="scope-input" style="min-height:90px;" placeholder="Describe what will be built…">' + esc(c.project_scope || '') + '</textarea>' +
        '<div style="display:flex;justify-content:flex-end;margin-top:8px;"><button class="btn btn-outline btn-sm" id="btn-save-scope">Save</button></div></div></div>' +

      '<div class="card"><div class="card-header"><h3>Onboarding items</h3></div><div class="card-body">' + renderOnboardingAccordion(c, items, 'admin') + '</div></div>' +
    '</div>';
}

function openEditClientDialog(c) {
  var statuses = ['Waiting Onboarding', 'Onboarded', 'Work In Progress', 'Delivered', 'New Updates'];
  openDialog(
    '<div class="dialog-header"><div><h3>Edit client details</h3></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body">' +
      '<div class="field-row"><div class="field"><label class="field-label">Business name</label><input class="input" id="ec-business" value="' + esc(c.business_name) + '" /></div>' +
      '<div class="field"><label class="field-label">Industry</label><input class="input" id="ec-industry" value="' + esc(c.industry) + '" /></div></div>' +
      '<div class="field-row"><div class="field"><label class="field-label">Package</label>' +
        '<select class="input" id="ec-package">' + ['Starter', 'Business', 'E-Commerce', 'Custom'].map(function (p) { return '<option' + (p === c.package ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="field-label">Status</label><select class="input" id="ec-status">' + statuses.map(function (s) { return '<option' + (s === c.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field-row"><div class="field"><label class="field-label">MRR ($/mo)</label><input class="input" type="number" id="ec-mrr" value="' + c.mrr_value + '" /></div>' +
      '<div class="field"><label class="field-label">Setup fee ($)</label><input class="input" type="number" id="ec-setup" value="' + c.setup_fee + '" /></div></div>' +
      '<div class="field-row"><div class="field"><label class="field-label">Build start date</label><input class="input" type="date" id="ec-start" value="' + (c.build_start_date || '') + '" /></div>' +
      '<div class="field"><label class="field-label">Planned delivery</label><input class="input" type="date" id="ec-delivery" value="' + (c.planned_delivery_date || '') + '" /></div></div>' +
    '</div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-save-client">Save changes</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-save-client').addEventListener('click', function () {
        c.business_name = root.querySelector('#ec-business').value.trim() || c.business_name;
        c.industry = root.querySelector('#ec-industry').value.trim() || c.industry;
        c.package = root.querySelector('#ec-package').value;
        c.status = root.querySelector('#ec-status').value;
        c.mrr_value = Number(root.querySelector('#ec-mrr').value) || 0;
        c.setup_fee = Number(root.querySelector('#ec-setup').value) || 0;
        c.build_start_date = root.querySelector('#ec-start').value || null;
        c.planned_delivery_date = root.querySelector('#ec-delivery').value || null;
        if (c.status !== 'Waiting Onboarding' && !c.onboarded_at) c.onboarded_at = DEMO_TODAY + 'T12:00:00Z';
        closeAllDialogs();
        showToast('Client updated');
        rerenderRoute();
      });
    }
  );
}

function bindClientDetailEvents(el, c) {
  var back = el.querySelector('#btn-back-clients');
  if (back) back.addEventListener('click', function () { navigate('#/clients'); });
  var edit = el.querySelector('#btn-edit-client');
  if (edit) edit.addEventListener('click', function () { openEditClientDialog(c); });
  var saveNotes = el.querySelector('#btn-save-admin-notes');
  if (saveNotes) saveNotes.addEventListener('click', function () {
    c.admin_notes = el.querySelector('#admin-notes-input').value;
    showToast('Admin notes saved');
    rerenderRoute();
  });
  var saveScope = el.querySelector('#btn-save-scope');
  if (saveScope) saveScope.addEventListener('click', function () {
    c.project_scope = el.querySelector('#scope-input').value;
    showToast('Project scope saved');
    rerenderRoute();
  });
  bindOnboardingAccordionEvents(el, c.id, 'admin');
}

function bindPortalEvents(el, client) {
  var save = el.querySelector('#btn-save-client-notes');
  if (save) save.addEventListener('click', function () {
    client.client_notes = el.querySelector('#client-notes-input').value;
    client.client_notes_updated_at = new Date().toISOString();
    showToast('Notes saved');
    rerenderRoute();
  });
  bindOnboardingAccordionEvents(el, client.id, 'client');
}

/* ==========================================================================
   Calendar card (shared by Analytics + My Dashboard)
   ========================================================================== */
function renderCalendarCard() {
  var y = STATE.calendar.year, m = STATE.calendar.month;
  var monthLabel = new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  var events = [];
  STATE.clients.forEach(function (c) {
    if (c.build_start_date) events.push({ date: c.build_start_date, label: c.business_name, className: 'cal-chip--start' });
    if (c.planned_delivery_date) events.push({ date: c.planned_delivery_date, label: c.business_name, className: 'cal-chip--delivery' });
  });
  return '<div class="card"><div class="card-header"><div><h3>Project timeline</h3><p>Build start &amp; planned delivery across all clients</p></div>' +
      '<div class="cal-toolbar" style="margin:0;"><button class="cal-nav-btn" id="cal-prev">' + icon('chevronLeft') + '</button>' +
      '<span class="cal-month-label" style="margin:0 8px;">' + esc(monthLabel) + '</span>' +
      '<button class="cal-nav-btn" id="cal-next">' + icon('chevronRight') + '</button></div></div>' +
    '<div class="card-body">' + Charts.monthCalendar(y, m, events, DEMO_TODAY) +
      '<div class="cal-legend"><span class="cal-legend-item"><span class="cal-legend-dot" style="background:var(--info-text);"></span>Build start</span>' +
      '<span class="cal-legend-item"><span class="cal-legend-dot" style="background:var(--warning-text);"></span>Planned delivery</span></div>' +
    '</div></div>';
}
function bindCalendarCardEvents(el) {
  var prev = el.querySelector('#cal-prev'), next = el.querySelector('#cal-next');
  if (prev) prev.addEventListener('click', function () {
    STATE.calendar.month--; if (STATE.calendar.month < 0) { STATE.calendar.month = 11; STATE.calendar.year--; }
    rerenderRoute();
  });
  if (next) next.addEventListener('click', function () {
    STATE.calendar.month++; if (STATE.calendar.month > 11) { STATE.calendar.month = 0; STATE.calendar.year++; }
    rerenderRoute();
  });
}

/* ==========================================================================
   Admin — Analytics
   ========================================================================== */
function renderAnalytics() {
  var week = STATE.pipelineWeeks[STATE.pipelineWeeks.length - 1];
  var funnel = pipelineFunnel(week);
  var onboardedThisWeek = STATE.clients.filter(function (c) { return c.onboarded_at && isRecentlyCreated(c.onboarded_at); }).length;
  var mrr = currentMRR();
  var target = STATE.agency.mrr_target;
  var mrrPct = Math.min(100, Math.round((mrr / target) * 100));
  var gap = Math.max(0, target - mrr);
  var avgDeal = avgContractValue();
  var moreClientsNeeded = gap > 0 && avgDeal > 0 ? Math.ceil(gap / avgDeal) : 0;
  var delivery = deliveryStats();
  var dist = statusDistribution();
  var industries = topIndustries();

  var weeklyGroups = STATE.pipelineWeeks.slice(-9).map(function (w) {
    return { label: fmtDate(w.week_start).replace(/, \d{4}/, ''), bars: [{ value: w.contacted, className: 'chart-bar' }, { value: w.deals_closed, className: 'chart-bar--secondary' }] };
  });

  var teamRows = STATE.users.filter(function (u) { return u.role === 'owner' || u.role === 'admin'; }).map(function (u) {
    var mtd = teamMonthToDate(u.id);
    var g = goalsFor(u.id);
    return '<tr><td><div class="cell-primary">' + esc(u.full_name) + '</div><div class="cell-sub">' + esc(u.role) + '</div></td>' +
      '<td>' + mtd.contacts + (g ? ' / ' + g.contacts_goal : '') + '</td>' +
      '<td>' + mtd.calls_completed + (g ? ' / ' + g.calls_goal : '') + '</td>' +
      '<td>' + mtd.clients_closed + (g ? ' / ' + g.closed_goal : '') + '</td>' +
      '<td>' + money(mtd.revenue_closed) + (g ? ' / ' + money(g.revenue_goal) : '') + '</td>' +
      '<td><button class="btn btn-outline btn-sm" data-log-team="' + u.id + '">Log / Goals</button></td></tr>';
  }).join('');

  return '<div class="page-head"><div><h1>Analytics</h1><p>Agency performance overview</p></div></div>' +
    '<div class="stack">' +
      '<div class="grid-4">' +
        statTile('Calls booked', STATE.discoveryCalls.booked, 'This week') +
        statTile('Deals closed', week.deals_closed, 'This week') +
        statTile('Clients onboarded', onboardedThisWeek, 'This week') +
        statTile('Contacts made', week.contacted, 'This week') +
      '</div>' +

      renderCalendarCard() +

      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><h3>Discovery calls</h3></div><div class="card-body">' +
          '<div class="grid-3" style="gap:12px;">' +
            miniStat('Booked', STATE.discoveryCalls.booked) + miniStat('Completed', STATE.discoveryCalls.completed) + miniStat('Show rate', STATE.discoveryCalls.show_rate + '%') +
          '</div>' +
          '<div class="divider" style="margin:14px 0;"></div>' +
          renderIntegrationsList() +
        '</div></div>' +

        '<div class="card"><div class="card-header"><div><h3>Revenue</h3></div><button class="icon-btn" id="btn-edit-target">' + icon('pencil') + '</button></div><div class="card-body">' +
          '<div class="grid-3" style="gap:12px;margin-bottom:14px;">' +
            miniStat('Current MRR', money(mrr)) + miniStat('Avg contract', money(avgDeal)) + miniStat('Projected (4-wk)', money(projectedMRR())) +
          '</div>' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + mrrPct + '%"></div></div>' +
          '<p class="pace-note">' + (mrr >= target ? 'On track — target reached' : moreClientsNeeded + ' more avg. client' + (moreClientsNeeded === 1 ? '' : 's') + ' to hit ' + money(target) + ' target (' + money(gap) + ' gap)') + '</p>' +
        '</div></div>' +
      '</div>' +

      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><h3>Delivery</h3></div><div class="card-body"><div class="grid-3" style="gap:12px;">' +
          miniStat('Active builds', delivery.active) + miniStat('Total clients', delivery.total) + miniStat('Waiting onboarding', delivery.waiting) +
        '</div></div></div>' +

        '<div class="card"><div class="card-header"><div><h3>Pipeline</h3><p>Week of ' + fmtDate(week.week_start) + '</p></div><button class="btn btn-outline btn-sm" id="btn-log-pipeline">Update</button></div><div class="card-body">' +
          '<div class="grid-3" style="gap:12px;">' + miniStat('Response rate', funnel.responseRate + '%') + miniStat('Proposal rate', funnel.proposalRate + '%') + miniStat('Close rate', funnel.closeRate + '%') + '</div>' +
        '</div></div>' +
      '</div>' +

      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><div><h3>Weekly outreach activity</h3><p>Contacted vs. deals closed</p></div></div><div class="card-body">' +
          Charts.groupedBarChart({ groups: weeklyGroups }) +
          '<div class="chart-legend" style="flex-direction:row;gap:16px;margin-top:8px;"><span class="chart-legend-key"><span class="chart-legend-swatch" style="background:var(--text);"></span>Contacted</span><span class="chart-legend-key"><span class="chart-legend-swatch" style="background:var(--border-strong);"></span>Deals closed</span></div>' +
        '</div></div>' +

        '<div class="card"><div class="card-header"><h3>Status distribution</h3></div><div class="card-body">' +
          '<div class="donut-wrap">' + Charts.donutChart(dist.map(function (d) { return { label: d.label, value: d.value, className: d.className }; })) +
          '<div class="chart-legend">' + dist.map(function (d) {
            return '<div class="chart-legend-row"><span class="chart-legend-key"><span class="chart-legend-swatch" style="background:var(--' + d.className.replace('d-', '') + '-text, var(--text-muted));"></span>' + esc(d.label) + '</span><strong>' + d.value + '</strong></div>';
          }).join('') + '</div></div>' +
        '</div></div>' +
      '</div>' +

      '<div class="card"><div class="card-header"><h3>Team performance</h3><p>Month to date vs. monthly goals</p></div><div class="table-wrap"><table class="data-table">' +
        '<thead><tr><th>Member</th><th>Contacts</th><th>Calls</th><th>Closed</th><th>Revenue</th><th></th></tr></thead><tbody>' + teamRows + '</tbody></table></div></div>' +

      '<div class="grid-2">' +
        '<div class="card"><div class="card-header"><h3>Onboarding completion</h3></div><div class="card-body">' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + onboardingCompletionRate() + '%"></div></div>' +
          '<p class="pace-note">' + onboardingCompletionRate() + '% of required items submitted or approved across clients still onboarding</p>' +
        '</div></div>' +
        '<div class="card"><div class="card-header"><h3>Top industries</h3></div><div class="card-body">' + Charts.horizontalBarChart(industries, { padL: 110 }) + '</div></div>' +
      '</div>' +
    '</div>';
}
function statTile(label, value, meta) {
  return '<div class="stat-tile"><div class="stat-tile__label">' + esc(label) + '</div><div class="stat-tile__value mono">' + esc(value) + '</div><div class="stat-tile__meta">' + esc(meta) + '</div></div>';
}
function miniStat(label, value) {
  return '<div><div class="text-faint" style="font-size:11px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">' + esc(label) + '</div><div style="font-weight:700;font-size:16px;" class="mono">' + esc(value) + '</div></div>';
}
function renderIntegrationsList() {
  return '<div class="integration-list">' + STATE.integrations.map(function (i) {
    return '<div class="integration-row"><span class="integration-name">' + esc(i.label) + '</span>' +
      '<span class="integration-status ' + (i.connected ? 'integration-status--on' : 'integration-status--off') + '">' +
      (i.connected ? icon('check') : icon('x')) + (i.connected ? 'Connected (demo)' : 'Not connected') + '</span></div>';
  }).join('') + '</div>';
}

function openEditTargetDialog() {
  openDialog(
    '<div class="dialog-header"><div><h3>Set MRR target</h3></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body"><div class="field"><label class="field-label">Monthly target ($)</label><input class="input" type="number" id="target-input" value="' + STATE.agency.mrr_target + '" /></div></div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-save-target">Save</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-save-target').addEventListener('click', function () {
        STATE.agency.mrr_target = Number(root.querySelector('#target-input').value) || STATE.agency.mrr_target;
        closeAllDialogs(); showToast('Target updated'); rerenderRoute();
      });
    }
  );
}

function openLogPipelineDialog() {
  var week = STATE.pipelineWeeks[STATE.pipelineWeeks.length - 1];
  openDialog(
    '<div class="dialog-header"><div><h3>Update this week\'s pipeline</h3><p>Week of ' + fmtDate(week.week_start) + '</p></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body">' +
      ['contacted', 'replied', 'calls_booked', 'proposals_sent', 'deals_closed'].map(function (f) {
        return '<div class="field"><label class="field-label">' + f.replace(/_/g, ' ') + '</label><input class="input" type="number" data-pw-field="' + f + '" value="' + week[f] + '" /></div>';
      }).join('') +
    '</div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-save-pipeline">Save</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-save-pipeline').addEventListener('click', function () {
        root.querySelectorAll('[data-pw-field]').forEach(function (inp) {
          week[inp.getAttribute('data-pw-field')] = Number(inp.value) || 0;
        });
        closeAllDialogs(); showToast('Pipeline updated'); rerenderRoute();
      });
    }
  );
}

function openLogTeamDialog(userId) {
  var u = userById(userId);
  var wk = latestWeek(userId) || { contacts: 0, calls_completed: 0, clients_closed: 0, revenue_closed: 0, week_start: STATE.pipelineWeeks[STATE.pipelineWeeks.length - 1].week_start };
  var g = goalsFor(userId) || { contacts_goal: 0, calls_goal: 0, closed_goal: 0, revenue_goal: 0 };
  openDialog(
    '<div class="dialog-header"><div><h3>' + esc(u.full_name) + '</h3><p>Log this week\'s numbers and set monthly goals</p></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body">' +
      '<p class="field-label" style="margin-bottom:8px;">This week</p>' +
      '<div class="field-row"><div class="field"><label class="field-label">Contacts</label><input class="input" type="number" id="lt-contacts" value="' + wk.contacts + '" /></div><div class="field"><label class="field-label">Calls</label><input class="input" type="number" id="lt-calls" value="' + wk.calls_completed + '" /></div></div>' +
      '<div class="field-row"><div class="field"><label class="field-label">Closed</label><input class="input" type="number" id="lt-closed" value="' + wk.clients_closed + '" /></div><div class="field"><label class="field-label">Revenue</label><input class="input" type="number" id="lt-revenue" value="' + wk.revenue_closed + '" /></div></div>' +
      '<div class="divider" style="margin:14px 0;"></div>' +
      '<p class="field-label" style="margin-bottom:8px;">Monthly goals</p>' +
      '<div class="field-row"><div class="field"><label class="field-label">Contacts goal</label><input class="input" type="number" id="lt-g-contacts" value="' + g.contacts_goal + '" /></div><div class="field"><label class="field-label">Calls goal</label><input class="input" type="number" id="lt-g-calls" value="' + g.calls_goal + '" /></div></div>' +
      '<div class="field-row"><div class="field"><label class="field-label">Closed goal</label><input class="input" type="number" id="lt-g-closed" value="' + g.closed_goal + '" /></div><div class="field"><label class="field-label">Revenue goal</label><input class="input" type="number" id="lt-g-revenue" value="' + g.revenue_goal + '" /></div></div>' +
    '</div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-save-team-log">Save</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-save-team-log').addEventListener('click', function () {
        var existing = STATE.weeklyLogs.filter(function (l) { return l.user_id === userId && l.week_start === wk.week_start; })[0];
        var vals = {
          contacts: Number(root.querySelector('#lt-contacts').value) || 0,
          calls_completed: Number(root.querySelector('#lt-calls').value) || 0,
          clients_closed: Number(root.querySelector('#lt-closed').value) || 0,
          revenue_closed: Number(root.querySelector('#lt-revenue').value) || 0
        };
        if (existing) { Object.assign(existing, vals); }
        else { STATE.weeklyLogs.push(Object.assign({ user_id: userId, week_start: wk.week_start }, vals)); }

        var goalVals = {
          contacts_goal: Number(root.querySelector('#lt-g-contacts').value) || 0,
          calls_goal: Number(root.querySelector('#lt-g-calls').value) || 0,
          closed_goal: Number(root.querySelector('#lt-g-closed').value) || 0,
          revenue_goal: Number(root.querySelector('#lt-g-revenue').value) || 0
        };
        var existingGoal = goalsFor(userId);
        if (existingGoal) { Object.assign(existingGoal, goalVals); }
        else { STATE.goals.push(Object.assign({ user_id: userId, month: monthOf(DEMO_TODAY) }, goalVals)); }

        closeAllDialogs(); showToast('Saved for ' + u.full_name); rerenderRoute();
      });
    }
  );
}

function bindAnalyticsEvents(el) {
  bindCalendarCardEvents(el);
  var editTarget = el.querySelector('#btn-edit-target');
  if (editTarget) editTarget.addEventListener('click', openEditTargetDialog);
  var logPipeline = el.querySelector('#btn-log-pipeline');
  if (logPipeline) logPipeline.addEventListener('click', openLogPipelineDialog);
  el.querySelectorAll('[data-log-team]').forEach(function (b) { b.addEventListener('click', function () { openLogTeamDialog(b.getAttribute('data-log-team')); }); });
}

/* ==========================================================================
   Team Member Dashboard (non-owner admin)
   ========================================================================== */
function renderMyDashboard(user) {
  var wk = latestWeek(user.id);
  var mtd = teamMonthToDate(user.id);
  var g = goalsFor(user.id);

  var weekCard = '<div class="card"><div class="card-header"><div><h3>This week</h3><p>Week of ' + (wk ? fmtDate(wk.week_start) : '—') + '</p></div><button class="btn btn-outline btn-sm" id="btn-update-week">Update</button></div><div class="card-body">' +
    '<div class="grid-4">' + miniStat('Contacts', wk ? wk.contacts : 0) + miniStat('Calls', wk ? wk.calls_completed : 0) + miniStat('Closed', wk ? wk.clients_closed : 0) + miniStat('Revenue', money(wk ? wk.revenue_closed : 0)) + '</div>' +
  '</div></div>';

  var goalRows = ['contacts', 'calls_completed', 'clients_closed', 'revenue_closed'];
  var goalLabels = { contacts: 'Contacts', calls_completed: 'Calls completed', clients_closed: 'Clients closed', revenue_closed: 'Revenue closed' };
  var goalKeys = { contacts: 'contacts_goal', calls_completed: 'calls_goal', clients_closed: 'closed_goal', revenue_closed: 'revenue_goal' };

  var goalsCard = '<div class="card"><div class="card-header"><h3>Monthly goals</h3></div><div class="card-body">' +
    (g ? goalRows.map(function (k) {
      var actual = mtd[k], target = g[goalKeys[k]] || 0;
      var pct = target ? Math.min(100, Math.round((actual / target) * 100)) : 0;
      var isMoney = k === 'revenue_closed';
      return '<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;"><span>' + goalLabels[k] + '</span><span class="mono">' + (isMoney ? money(actual) : actual) + ' / ' + (isMoney ? money(target) : target) + '</span></div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';
    }).join('') : ('<div class="empty-state">No goals set yet for this month.</div><div class="stack" style="margin-top:10px;">' +
      goalRows.map(function (k) { return '<div class="kv-row"><dt>' + goalLabels[k] + '</dt><dd>' + (k === 'revenue_closed' ? money(mtd[k]) : mtd[k]) + '</dd></div>'; }).join('') + '</div>'))
  + '</div></div>';

  return '<div class="page-head"><div><h1>Welcome back, ' + esc(user.full_name.split(' ')[0]) + '</h1><p>Your personal performance view</p></div></div>' +
    '<div class="stack">' + weekCard + '<div class="grid-2">' + goalsCard + renderCalendarCard() + '</div></div>';
}
function bindMyDashboardEvents(el, user) {
  bindCalendarCardEvents(el);
  var btn = el.querySelector('#btn-update-week');
  if (btn) btn.addEventListener('click', function () { openLogTeamDialog(user.id); });
}

/* ==========================================================================
   Team & Settings (owner only)
   ========================================================================== */
function renderTeamSettings() {
  var admins = STATE.users.filter(function (u) { return u.role === 'owner' || u.role === 'admin'; });
  var clientsUsers = STATE.users.filter(function (u) { return u.role === 'client'; });

  var adminRows = admins.map(function (u) {
    return '<tr><td><div class="cell-primary">' + esc(u.full_name) + '</div><div class="cell-sub">' + esc(u.email) + '</div></td>' +
      '<td>' + (u.role === 'owner' ? '<span class="badge badge--owner">Owner</span>' : '<span class="badge badge--neutral">Admin</span>') + '</td>' +
      '<td>' + (u.role === 'owner' ? '<span class="text-faint">—</span>' : '<button class="btn btn-outline btn-sm" data-demote="' + u.id + '">Demote to client</button>') + '</td></tr>';
  }).join('');

  var clientRows = clientsUsers.map(function (u) {
    return '<tr><td><div class="cell-primary">' + esc(u.full_name) + '</div><div class="cell-sub">' + esc(u.email) + '</div></td>' +
      '<td><button class="btn btn-outline btn-sm" data-promote="' + u.id + '">Promote to admin</button></td></tr>';
  }).join('');

  return '<div class="page-head"><div><h1>Team &amp; settings</h1><p>Manage roles for your team. Role changes apply for this demo session only.</p></div>' +
    '<button class="btn btn-primary" id="btn-add-admin">' + icon('plus') + ' Add admin</button></div>' +
    '<div class="stack">' +
      '<div class="card"><div class="card-header"><h3>Admins</h3></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Role</th><th></th></tr></thead><tbody>' + adminRows + '</tbody></table></div></div>' +
      '<div class="card"><div class="card-header"><h3>Clients</h3></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th></th></tr></thead><tbody>' + (clientRows || '<tr><td colspan="2" class="text-faint">No client-role users.</td></tr>') + '</tbody></table></div></div>' +
    '</div>';
}
function openAddAdminDialog() {
  openDialog(
    '<div class="dialog-header"><div><h3>Add admin</h3></div><button class="dialog-close" data-close-dialog>' + icon('x') + '</button></div>' +
    '<div class="dialog-body">' +
      '<div class="field"><label class="field-label">Full name</label><input class="input" id="aa-name" placeholder="Jamie Park" /></div>' +
      '<div class="field"><label class="field-label">Email</label><input class="input" id="aa-email" type="email" placeholder="jamie@greyhouse.studio" /></div>' +
      '<p class="text-faint" style="font-size:11.5px;">A temporary password would normally be generated here — simulated in this demo.</p>' +
    '</div>' +
    '<div class="dialog-footer"><button class="btn btn-outline" data-close-dialog>Cancel</button><button class="btn btn-primary" id="btn-confirm-admin">Add admin</button></div>',
    function (root) {
      root.querySelectorAll('[data-close-dialog]').forEach(function (b) { b.addEventListener('click', closeAllDialogs); });
      root.querySelector('#btn-confirm-admin').addEventListener('click', function () {
        var name = root.querySelector('#aa-name').value.trim() || 'New Admin';
        var email = root.querySelector('#aa-email').value.trim() || 'new@greyhouse.studio';
        STATE.users.push({ id: 'admin-new-' + Date.now(), full_name: name, email: email, role: 'admin' });
        closeAllDialogs(); showToast('Admin added (demo)'); rerenderRoute();
      });
    }
  );
}
function bindTeamSettingsEvents(el) {
  var addBtn = el.querySelector('#btn-add-admin');
  if (addBtn) addBtn.addEventListener('click', openAddAdminDialog);
  el.querySelectorAll('[data-demote]').forEach(function (b) {
    b.addEventListener('click', function () {
      var u = userById(b.getAttribute('data-demote'));
      if (u) { u.role = 'client'; showToast(u.full_name + ' demoted to client (demo)'); rerenderRoute(); }
    });
  });
  el.querySelectorAll('[data-promote]').forEach(function (b) {
    b.addEventListener('click', function () {
      var u = userById(b.getAttribute('data-promote'));
      if (u) { u.role = 'admin'; showToast(u.full_name + ' promoted to admin (demo)'); rerenderRoute(); }
    });
  });
}

/* ==========================================================================
   Route event dispatcher
   ========================================================================== */
function bindRouteEvents(path) {
  var el = document.getElementById('view-root');
  var user = currentUser();
  if (path === '#/portal') { var portalClient = clientById(user.id); if (portalClient) bindPortalEvents(el, portalClient); }
  else if (path === '#/clients') bindClientsListEvents(el);
  else if (path.indexOf('#/clients/') === 0) bindClientDetailEvents(el, clientById(path.replace('#/clients/', '')));
  else if (path === '#/analytics') bindAnalyticsEvents(el);
  else if (path === '#/my-dashboard') bindMyDashboardEvents(el, user);
  else if (path === '#/team') bindTeamSettingsEvents(el);
}

/* ==========================================================================
   Boot
   ========================================================================== */
STATE = buildInitialState();
renderAll();

