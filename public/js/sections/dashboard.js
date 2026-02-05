import { getWalletBalances, getEmailStats, getAnalyticsStats, getOnchainStats } from '../api.js';

export async function renderDashboard() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">Dashboard</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="background: var(--nb-yellow);">
          <h3 style="margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">💰 Wallet</h3>
          <div id="wallet-widget">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-pink); color: white;">
          <h3 style="margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">📧 Email</h3>
          <div id="email-widget">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-blue);">
          <h3 style="margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">🔗 Onchain</h3>
          <div id="onchain-widget">Loading...</div>
        </div>
      </div>
      
      <div class="card">
        <h2 style="margin-bottom: 1rem;">Quick Stats</h2>
        <div id="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"></div>
      </div>
    </div>
  `;
  
  loadDashboardWidgets();
}

async function loadDashboardWidgets() {
  // Wallet widget
  try {
    const wallet = await getWalletBalances();
    document.getElementById('wallet-widget').innerHTML = `
      <div style="font-size: 1.5rem; font-weight: 700;">⛓️ ${wallet.base?.balance?.toFixed(4) || '0.0000'} ETH</div>
      <div style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">☀️ ${wallet.solana?.balance?.toFixed(4) || '0.0000'} SOL</div>
    `;
  } catch (e) {
    document.getElementById('wallet-widget').innerHTML = '<div style="opacity: 0.7;">Error loading</div>';
  }
  
  // Email widget
  try {
    const email = await getEmailStats();
    document.getElementById('email-widget').innerHTML = `
      <div style="font-size: 1.25rem; font-weight: 700;">${email.monitoring_status || 'Unknown'}</div>
      <div style="opacity: 0.9; margin-top: 0.5rem;">Last check: ${email.last_check_time || 'Never'}</div>
    `;
  } catch (e) {
    document.getElementById('email-widget').innerHTML = '<div style="opacity: 0.7;">Error loading</div>';
  }
  
  // Onchain widget
  try {
    const onchain = await getOnchainStats();
    document.getElementById('onchain-widget').innerHTML = `
      <div style="font-size: 1.5rem; font-weight: 700;">${onchain.total_transactions || 0} TXs</div>
      <div style="opacity: 0.9; margin-top: 0.5rem;">Base: ${onchain.base_transactions || 0} | Sol: ${onchain.solana_transactions || 0}</div>
    `;
  } catch (e) {
    document.getElementById('onchain-widget').innerHTML = '<div style="opacity: 0.7;">Error loading</div>';
  }
}
