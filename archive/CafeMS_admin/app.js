const defaultClients = [
  { name: 'Kaffeine House', domain: 'kaffeinehouse.com', plan: 'Professional', status: 'Active', contact: 'hello@kaffeinehouse.com', joined: 'Oct 08, 2026', logo: 'K', logoClass: 'logo-k' },
  { name: 'Bean There', domain: 'beanthere.cafe', plan: 'Starter', status: 'Active', contact: 'team@beanthere.cafe', joined: 'Oct 07, 2026', logo: 'B', logoClass: 'logo-b' },
  { name: 'Morning Ritual', domain: 'morningritual.co', plan: 'Professional', status: 'Paused', contact: 'hi@morningritual.co', joined: 'Oct 05, 2026', logo: 'M', logoClass: 'logo-m' },
  { name: 'Juniper & Grain', domain: 'junipergrain.com', plan: 'Enterprise', status: 'Active', contact: 'ops@junipergrain.com', joined: 'Sep 29, 2026', logo: 'J', logoClass: 'logo-k' },
  { name: 'The Daily Pour', domain: 'thedailypour.com', plan: 'Starter', status: 'Active', contact: 'hello@thedailypour.com', joined: 'Sep 24, 2026', logo: 'D', logoClass: 'logo-b' }
];
const clients = JSON.parse(localStorage.getItem('cafems.clients') || 'null') || defaultClients;
const apis = [
  { name: 'Tableflow POS', client: 'Kaffeine House', key: 'tf_live_••••••••9a42', status: 'Active', used: '2 mins ago' },
  { name: 'Orders webhook', client: 'Bean There', key: 'tf_live_••••••••c812', status: 'Active', used: '18 mins ago' },
  { name: 'Analytics export', client: 'Morning Ritual', key: 'tf_test_••••••••71bd', status: 'Paused', used: '3 days ago' },
  { name: 'Reservations API', client: 'Juniper & Grain', key: 'tf_live_••••••••4d91', status: 'Active', used: '1 hour ago' }
];
const monthlyGrowth = [
  { month: 'May', value: 24 },
  { month: 'Jun', value: 31 },
  { month: 'Jul', value: 36 },
  { month: 'Aug', value: 43 },
  { month: 'Sep', value: 51 },
  { month: 'Oct', value: 58 }
];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
document.body.classList.add('login-lock');
function enterDashboard() {
  document.body.classList.remove('login-lock');
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
}
function saveClients() {
  localStorage.setItem('cafems.clients', JSON.stringify(clients));
}
if (!clients.some((client) => client.name === 'Chiya Ghar')) {
  clients.push({ name: 'Chiya Ghar', domain: 'chiyaghar.cafe', plan: 'Professional', status: 'Active', contact: 'hello@chiyaghar.cafe', joined: 'Oct 08, 2026', logo: 'C', logoClass: 'logo-b' });
  saveClients();
}

function clientRow(client, includeContact = false) {
  return `<tr><td><span class="client-cell client-cell-clickable" data-client="${client.name}"><span class="client-logo ${client.logoClass}">${client.logo}</span><span><strong>${client.name}</strong><small>${client.domain}</small></span></span></td><td>${client.plan}</td><td><span class="status ${client.status.toLowerCase()}">${client.status}</span></td>${includeContact ? `<td>${client.contact}</td>` : ''}<td>${client.joined}</td><td><button class="row-menu" data-client="${client.name}">•••</button></td></tr>`;
}
function renderClients(filter = '') {
  const filtered = clients.filter((client) => `${client.name} ${client.domain} ${client.plan}`.toLowerCase().includes(filter.toLowerCase()));
  $('#clientsTable').innerHTML = filtered.map((client) => clientRow(client, true)).join('') || '<tr><td colspan="6" class="empty-state">No clients found.</td></tr>';
}
function renderOverviewClients() {
  $('#overviewClients').innerHTML = clients.slice(0, 3).map((client) => clientRow(client)).join('');
}
function renderApis(filter = '') {
  const filtered = apis.filter((api) => `${api.name} ${api.client}`.toLowerCase().includes(filter.toLowerCase()));
  $('#apisTable').innerHTML = filtered.map((api) => `<tr><td><strong class="api-name-clickable" data-api="${api.name}">${api.name}</strong></td><td>${api.client}</td><td><span class="api-key">${api.key}</span></td><td><span class="status ${api.status.toLowerCase()}">${api.status}</span></td><td>${api.used}</td><td><button class="row-menu" data-api="${api.name}">•••</button></td></tr>`).join('');
}
function renderMonthlyGrowth() {
  $('.chart-panel').insertAdjacentHTML('beforeend', `<div class="growth-summary" aria-label="Monthly network growth">${monthlyGrowth.map((item) => `<div class="growth-month"><span>${item.month}</span><strong>${item.value}</strong><small>new clients</small></div>`).join('')}</div>`);
}
function showPage(page) {
  $$('.page').forEach((section) => section.classList.remove('active-page'));
  $(`#${page}Page`).classList.add('active-page');
  $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.page === page));
  $('#breadcrumbPage').textContent = page === 'overview' ? 'Dashboard' : page === 'apis' ? 'API management' : page === 'clients' ? 'Client management' : 'Settings';
  $('.sidebar').classList.remove('open');
}
function openModal(type) {
  const isApi = type === 'api';
  $('#modalEyebrow').textContent = isApi ? 'DEVELOPER TOOLS' : 'CLIENT MANAGEMENT';
  $('#modalTitle').textContent = isApi ? 'Register API' : 'Register client';
  $('#modalDescription').textContent = isApi ? 'Create credentials for a new client integration.' : 'Add a new café or restaurant to your hospitality network.';
  $('#modalFields').innerHTML = isApi ? `<label>API name<input name="apiName" required placeholder="e.g. Orders webhook"></label><label>Client<select name="client"><option>Kaffeine House</option><option>Bean There</option><option>Morning Ritual</option></select></label><label>Environment<select name="environment"><option>Production</option><option>Sandbox</option></select></label>` : `<label>Business name<input name="businessName" required placeholder="e.g. The Corner Café"></label><label>Plan<select name="plan"><option>Starter</option><option>Professional</option><option>Enterprise</option></select></label><label>Contact email<input name="contact" type="email" required placeholder="hello@business.com"></label><label>Website<input name="website" placeholder="business.com"></label>`;
  $('#modal').classList.remove('hidden');
}
function openActivityDetail(item) {
  const title = item.querySelector('strong').textContent;
  const description = item.querySelector('p').textContent;
  const time = item.querySelector('time').textContent;
  const registeredClient = clients.find((client) => client.name === 'Kaffeine House') || clients[0];
  $('#activityDetailModal .eyebrow').textContent = 'ACTIVITY DETAIL';
  $('#activityDetailTitle').textContent = title;
  $('#activityDetailDescription').textContent = description;
  $('#activityDetailContent').innerHTML = title === 'New client registered' && registeredClient
    ? `<div class="activity-detail-row"><span>Client</span><strong>${registeredClient.name}</strong></div><div class="activity-detail-row"><span>Website</span><strong>${registeredClient.domain}</strong></div><div class="activity-detail-row"><span>Plan</span><strong>${registeredClient.plan}</strong></div><div class="activity-detail-row"><span>Status</span><strong class="detail-status">${registeredClient.status}</strong></div><div class="activity-detail-row"><span>Registered</span><strong>${registeredClient.joined}</strong></div>`
    : `<div class="activity-detail-row"><span>Updated</span><strong>${time}</strong></div><div class="activity-detail-row"><span>Details</span><strong>${description}</strong></div>`;
  $('#activityDetailModal').classList.remove('hidden');
}
function openClientDetail(name) {
  const client = clients.find((item) => item.name === name);
  if (!client) return;
  $('#activityDetailTitle').textContent = client.name;
  $('#activityDetailDescription').textContent = 'Client profile and account details.';
  $('#activityDetailContent').innerHTML = `<div class="activity-detail-row"><span>Website</span><strong>${client.domain}</strong></div><div class="activity-detail-row"><span>Plan</span><strong>${client.plan}</strong></div><div class="activity-detail-row"><span>Status</span><strong class="detail-status">${client.status}</strong></div><div class="activity-detail-row"><span>Contact</span><strong>${client.contact}</strong></div><div class="activity-detail-row"><span>Joined</span><strong>${client.joined}</strong></div><div class="activity-detail-row"><span>Registered by</span><strong>${client.registeredBy || 'Super Admin'}</strong></div>`;
  $('#activityDetailModal .eyebrow').textContent = 'CLIENT DETAIL';
  $('#activityDetailModal').classList.remove('hidden');
}
function openApiDetail(name) {
  const api = apis.find((item) => item.name === name);
  if (!api) return;
  $('#activityDetailModal .eyebrow').textContent = 'API DETAIL';
  $('#activityDetailTitle').textContent = api.name;
  $('#activityDetailDescription').textContent = 'Integration credentials and connection status.';
  $('#activityDetailContent').innerHTML = `<div class="activity-detail-row"><span>Client</span><strong>${api.client}</strong></div><div class="activity-detail-row"><span>API key</span><strong>${api.key}</strong></div><div class="activity-detail-row"><span>Status</span><strong class="detail-status">${api.status}</strong></div><div class="activity-detail-row"><span>Last used</span><strong>${api.used}</strong></div>`;
  $('#activityDetailModal').classList.remove('hidden');
}

$('#loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = $('#username').value.trim();
  const password = $('#password').value;
  if (username !== 'admin' || password !== 'admin') {
    $('#loginMessage').textContent = 'Incorrect username or password.';
    return;
  }
  $('#loginMessage').textContent = '';
  if ($('#rememberMe').checked) localStorage.setItem('cafems.rememberedLogin', 'admin');
  else localStorage.removeItem('cafems.rememberedLogin');
  enterDashboard();
});
$('#togglePassword').addEventListener('click', () => { const password = $('#password'); const visible = password.type === 'text'; password.type = visible ? 'password' : 'text'; $('#togglePassword').textContent = visible ? 'Show' : 'Hide'; });
$('#forgotLink').addEventListener('click', (event) => { event.preventDefault(); $('#loginMessage').textContent = 'Password reset instructions are coming your way.'; });
$('#logoutButton').addEventListener('click', () => {
  document.body.classList.add('login-lock');
  $('#appView').classList.add('hidden');
  $('#loginView').classList.remove('hidden');
  $('#loginForm').reset();
  $('#loginMessage').textContent = '';
  showPage('overview');
});
$('#mobileMenu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
$('#workspaceButton').addEventListener('click', () => {
  $('#activityDetailModal .eyebrow').textContent = 'WORKSPACE';
  $('#activityDetailTitle').textContent = 'Super Admin';
  $('#activityDetailDescription').textContent = 'Manage your complete CafeMS network from the global workspace.';
  $('#activityDetailContent').innerHTML = '<div class="activity-detail-row"><span>Role</span><strong>Super administrator</strong></div><div class="activity-detail-row"><span>Scope</span><strong>All clients and APIs</strong></div><div class="activity-detail-row"><span>Access</span><strong class="detail-status">Full access</strong></div>';
  $('#activityDetailModal').classList.remove('hidden');
  $('.sidebar').classList.remove('open');
});
$('#profileButton').addEventListener('click', () => {
  $('#activityDetailModal .eyebrow').textContent = 'ACCOUNT';
  $('#activityDetailTitle').textContent = 'Super Admin';
  $('#activityDetailDescription').textContent = 'Your administrator profile for the CafeMS workspace.';
  $('#activityDetailContent').innerHTML = '<div class="activity-detail-row"><span>Role</span><strong>Super administrator</strong></div><div class="activity-detail-row"><span>Workspace</span><strong>Global workspace</strong></div><div class="activity-detail-row"><span>Access</span><strong class="detail-status">Full access</strong></div>';
  $('#activityDetailModal').classList.remove('hidden');
});
$('#supportButton').addEventListener('click', () => {
  $('#activityDetailModal .eyebrow').textContent = 'SUPPORT';
  $('#activityDetailTitle').textContent = 'Need a hand?';
  $('#activityDetailDescription').textContent = 'Find quick answers and guidance for managing your CafeMS workspace.';
  $('#activityDetailContent').innerHTML = '<div class="activity-detail-row"><span>Help center</span><strong>Available 24/7</strong></div><div class="activity-detail-row"><span>Workspace</span><strong>Super Admin</strong></div><div class="activity-detail-row"><span>Support</span><strong>Contact your administrator</strong></div>';
  $('#activityDetailModal').classList.remove('hidden');
  $('.sidebar').classList.remove('open');
});
$$('.nav-item').forEach((item) => item.addEventListener('click', () => showPage(item.dataset.page)));
$$('[data-page-link]').forEach((item) => item.addEventListener('click', () => showPage(item.dataset.pageLink)));
['#clientsTable', '#overviewClients'].forEach((selector) => $(selector).addEventListener('click', (event) => {
  const action = event.target.closest('.row-menu, .client-cell-clickable');
  if (action) openClientDetail(action.dataset.client);
}));
$('#apisTable').addEventListener('click', (event) => {
  const action = event.target.closest('.api-name-clickable, .row-menu');
  if (action) openApiDetail(action.dataset.api);
});
$('#addClientButton').addEventListener('click', () => openModal('client'));
$('#dashboardAddClientButton').addEventListener('click', () => openModal('client'));
$('#addApiButton').addEventListener('click', () => openModal('api'));
$('#modalClose').addEventListener('click', () => $('#modal').classList.add('hidden'));
$('.modal-backdrop').addEventListener('click', () => $('#modal').classList.add('hidden'));
$('#modalForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = String(formData.get('businessName') || '').trim();
  if (name) {
    const contact = String(formData.get('contact') || '').trim();
    const website = String(formData.get('website') || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || contact.split('@')[1] || 'new-client.cafe';
    clients.unshift({ name, domain: website, plan: String(formData.get('plan') || 'Starter'), status: 'Active', contact, joined: 'Oct 08, 2026', registeredBy: 'Super Admin', logo: name.charAt(0).toUpperCase(), logoClass: 'logo-k' });
    saveClients();
    renderClients();
    renderOverviewClients();
    $('#modal').classList.add('hidden');
    showPage('clients');
    return;
  }
  $('#modal').classList.add('hidden');
});
$('#clientSearch').addEventListener('input', (event) => renderClients(event.target.value));
$('#apiSearch').addEventListener('input', (event) => renderApis(event.target.value));
$('#activityToggle').addEventListener('click', () => {
  const panel = $('.activity-panel');
  const expanded = panel.classList.toggle('is-expanded');
  $('#activityToggle').textContent = expanded ? 'Show less ↑' : 'View all →';
});
$$('.activity-item').forEach((item) => {
  item.classList.add('activity-item-clickable');
  item.setAttribute('tabindex', '0');
  item.addEventListener('click', () => openActivityDetail(item));
  item.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openActivityDetail(item); } });
});
$('#activityDetailClose').addEventListener('click', () => $('#activityDetailModal').classList.add('hidden'));
$$('[data-close-activity]').forEach((backdrop) => backdrop.addEventListener('click', () => $('#activityDetailModal').classList.add('hidden')));
$('#exportButton').addEventListener('click', () => { $('#exportButton').textContent = '✓ Report exported'; setTimeout(() => { $('#exportButton').innerHTML = '↓ &nbsp;Export report'; }, 1600); });
renderClients();
renderOverviewClients();
renderApis();
renderMonthlyGrowth();
if (localStorage.getItem('cafems.rememberedLogin') === 'admin') enterDashboard();
