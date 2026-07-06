const state = {
  crypto: [],
  filteredCrypto: [],
  chart: null,
  theme: 'dark',
};

const els = {
  healthStatus: document.getElementById('healthStatus'),
  healthBadge: document.getElementById('healthBadge'),
  healthMessage: document.getElementById('healthMessage'),
  healthLoader: document.getElementById('healthLoader'),
  responseViewer: document.getElementById('responseViewer'),
  cryptoGrid: document.getElementById('cryptoGrid'),
  searchCrypto: document.getElementById('searchCrypto'),
  githubInput: document.getElementById('githubInput'),
  githubProfile: document.getElementById('githubProfile'),
  userCard: document.getElementById('userCard'),
  jokeContent: document.getElementById('jokeContent'),
  quoteContent: document.getElementById('quoteContent'),
  toast: document.getElementById('toast'),
  themeToggle: document.getElementById('themeToggle'),
};

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
}

function setLoading(isLoading) {
  els.healthLoader.style.display = isLoading ? 'block' : 'none';
}

function renderHealth(payload) {
  els.healthStatus.textContent = payload.status;
  els.healthBadge.textContent = 'Live';
  els.healthBadge.className = 'badge success';
  els.healthMessage.textContent = `Backend is healthy at ${new Date(payload.time).toLocaleString()}`;
  els.responseViewer.textContent = JSON.stringify(payload, null, 2);
}

function renderCryptoList(items) {
  state.filteredCrypto = items;
  if (!items.length) {
    els.cryptoGrid.innerHTML = '<div class="crypto-card">No results found.</div>';
    return;
  }

  els.cryptoGrid.innerHTML = items.map((coin) => `
    <article class="crypto-card">
      <div class="panel-header">
        <h3>${coin.name}</h3>
        <img src="${coin.image}" alt="${coin.name}" width="24" height="24" />
      </div>
      <div class="crypto-meta">${coin.symbol}</div>
      <div class="price">$${coin.price.toLocaleString()}</div>
      <div class="crypto-meta">24h: <span class="${coin.change24h >= 0 ? 'success' : 'error'}">${coin.change24h.toFixed(2)}%</span></div>
      <div class="crypto-meta">Market cap: $${coin.marketCap.toLocaleString()}</div>
    </article>
  `).join('');
}

function renderChart(items) {
  const ctx = document.getElementById('cryptoChart');
  const labels = items.slice(0, 6).map((coin) => coin.symbol);
  const data = items.slice(0, 6).map((coin) => coin.price);

  if (state.chart) {
    state.chart.destroy();
  }

  state.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Price (USD)',
        data,
        backgroundColor: ['#60a5fa', '#34d399', '#f59e0b', '#f472b6', '#818cf8', '#2dd4bf'],
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
}

function renderGithub(payload) {
  const profile = payload.data;
  els.githubProfile.innerHTML = `
    <img src="${profile.avatar}" alt="${profile.login}" />
    <h3>${profile.login}</h3>
    <p>${profile.bio}</p>
    <div class="crypto-meta">Followers: ${profile.followers}</div>
    <div class="crypto-meta">Repositories: ${profile.repositories}</div>
    <a href="${profile.profileUrl}" target="_blank" rel="noreferrer">View profile</a>
  `;
}

function renderUser(payload) {
  const user = payload.data;
  els.userCard.innerHTML = `
    <img src="${user.picture}" alt="${user.name}" />
    <h3>${user.name}</h3>
    <div class="crypto-meta">${user.email}</div>
    <div class="crypto-meta">${user.country}</div>
  `;
}

function renderJoke(payload) {
  els.jokeContent.textContent = payload.data.joke;
}

function renderQuote(payload) {
  els.quoteContent.textContent = `“${payload.data.content}” — ${payload.data.author}`;
}

async function loadHealth() {
  setLoading(true);
  try {
    const payload = await requestJson('/api/health');
    renderHealth(payload);
    els.responseViewer.textContent = JSON.stringify(payload, null, 2);
    showToast('Health check passed');
  } catch (error) {
    els.healthStatus.textContent = 'Error';
    els.healthBadge.textContent = 'Offline';
    els.healthBadge.className = 'badge error';
    els.healthMessage.textContent = error.message;
    els.responseViewer.textContent = JSON.stringify({ success: false, message: error.message }, null, 2);
    showToast('Unable to reach backend');
  } finally {
    setLoading(false);
  }
}

async function loadCrypto() {
  try {
    const payload = await requestJson('/api/crypto');
    state.crypto = payload.data;
    renderCryptoList(state.crypto);
    renderChart(state.crypto);
    els.responseViewer.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    els.responseViewer.textContent = JSON.stringify({ success: false, message: error.message }, null, 2);
    showToast('Crypto data unavailable');
  }
}

async function loadGithub(username = 'octocat') {
  try {
    const payload = await requestJson(`/api/github/${username}`);
    renderGithub(payload);
    els.responseViewer.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    els.githubProfile.innerHTML = `<p>${error.message}</p>`;
    els.responseViewer.textContent = JSON.stringify({ success: false, message: error.message }, null, 2);
    showToast('GitHub lookup failed');
  }
}

async function loadUser() {
  try {
    const payload = await requestJson('/api/random-user');
    renderUser(payload);
    els.responseViewer.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    els.userCard.innerHTML = `<p>${error.message}</p>`;
    els.responseViewer.textContent = JSON.stringify({ success: false, message: error.message }, null, 2);
    showToast('User generation failed');
  }
}

async function loadJoke() {
  try {
    const payload = await requestJson('/api/jokes');
    renderJoke(payload);
    els.responseViewer.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    els.jokeContent.textContent = error.message;
    els.responseViewer.textContent = JSON.stringify({ success: false, message: error.message }, null, 2);
  }
}

async function loadQuote() {
  try {
    const payload = await requestJson('/api/quote');
    renderQuote(payload);
    els.responseViewer.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    els.quoteContent.textContent = error.message;
    els.responseViewer.textContent = JSON.stringify({ success: false, message: error.message }, null, 2);
  }
}

function debounce(func, wait = 250) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  els.themeToggle.textContent = state.theme === 'dark' ? '☀️' : '🌙';
}

async function refreshAll() {
  await Promise.all([loadHealth(), loadCrypto(), loadGithub(els.githubInput.value || 'octocat'), loadUser(), loadJoke(), loadQuote()]);
}

function attachEvents() {
  document.getElementById('refreshAll').addEventListener('click', refreshAll);
  document.getElementById('retryButton').addEventListener('click', loadHealth);
  document.getElementById('refreshCrypto').addEventListener('click', loadCrypto);
  document.getElementById('searchGithub').addEventListener('click', () => loadGithub(els.githubInput.value.trim() || 'octocat'));
  document.getElementById('generateUser').addEventListener('click', loadUser);
  document.getElementById('refreshJoke').addEventListener('click', loadJoke);
  document.getElementById('refreshQuote').addEventListener('click', loadQuote);
  document.getElementById('copyJson').addEventListener('click', () => {
    navigator.clipboard.writeText(els.responseViewer.textContent);
    showToast('JSON copied');
  });
  els.themeToggle.addEventListener('click', toggleTheme);
  els.searchCrypto.addEventListener('input', debounce((event) => {
    const term = event.target.value.toLowerCase();
    const filtered = state.crypto.filter((coin) => coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term));
    renderCryptoList(filtered);
  }));

  els.githubInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      loadGithub(els.githubInput.value.trim() || 'octocat');
    }
  });
}

window.addEventListener('load', () => {
  attachEvents();
  loadHealth();
  loadCrypto();
  loadGithub();
  loadUser();
  loadJoke();
  loadQuote();
  setInterval(refreshAll, 60000);
});
