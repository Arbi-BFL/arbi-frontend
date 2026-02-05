import { getWalletBalances, getWalletTokens, getEmailStats, getAnalyticsStats, getOnchainStats } from '../api.js';

export async function renderDashboard() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">🤖 Dashboard</h1>
      
      <div class="grid grid-4" style="margin-bottom: 2rem;">
        <div class="stat-card card-yellow">
          <div class="stat-label">💰 Wallet Status</div>
          <div class="stat-value" id="wallet-widget">...</div>
          <div class="stat-label">Total Balance</div>
        </div>
        
        <div class="stat-card card-coral">
          <div class="stat-label">📧 Email System</div>
          <div class="stat-value" id="email-widget">...</div>
          <div class="stat-label">Emails Processed</div>
        </div>
        
        <div class="stat-card card-cyan">
          <div class="stat-label">🔗 Onchain Activity</div>
          <div class="stat-value" id="onchain-widget">...</div>
          <div class="stat-label">Total Transactions</div>
        </div>
        
        <div class="stat-card card-purple">
          <div class="stat-label">📊 Analytics</div>
          <div class="stat-value" id="analytics-widget">...</div>
          <div class="stat-label">Snapshots Recorded</div>
        </div>
      </div>
      
      <div class="card">
        <h2 style="margin-bottom: 1rem; font-size: 1.5rem;">System Overview</h2>
        <div class="grid grid-2" id="overview-grid">
          <div style="padding: 1rem; background: var(--nb-gray-light); border: var(--border-thin);">
            <strong>Backend Services:</strong> 4 running
          </div>
          <div style="padding: 1rem; background: var(--nb-gray-light); border: var(--border-thin);">
            <strong>Unified Frontend:</strong> Active
          </div>
        </div>
      </div>
    </div>
  `;
  
  loadDashboardWidgets();
}

async function loadDashboardWidgets() {
  // Wallet widget
  try {
    const wallet = await getWalletBalances();
    if (wallet.error) throw new Error(wallet.error);
    
    const nativeTotal = parseFloat(wallet.base?.usd || 0) + parseFloat(wallet.solana?.usd || 0);
    
    // Fetch tokens to get total balance including tokens
    const tokensData = await getWalletTokens();
    let tokenTotal = 0;
    if (tokensData && tokensData.tokens) {
      tokenTotal = tokensData.tokens.reduce((sum, t) => sum + t.value, 0);
    }
    
    const total = nativeTotal + tokenTotal;
    document.getElementById('wallet-widget').textContent = `$${total.toFixed(2)}`;
  } catch (e) {
    console.error('Wallet error:', e);
    document.getElementById('wallet-widget').innerHTML = '<span style="font-size: 1rem;">Error</span>';
  }
  
  // Email widget
  try {
    const email = await getEmailStats();
    if (email.error) throw new Error(email.error);
    const total = email.total_processed || 0;
    document.getElementById('email-widget').textContent = total.toString();
  } catch (e) {
    console.error('Email error:', e);
    document.getElementById('email-widget').innerHTML = '<span style="font-size: 1rem;">Error</span>';
  }
  
  // Onchain widget
  try {
    const onchain = await getOnchainStats();
    if (onchain.error) throw new Error(onchain.error);
    document.getElementById('onchain-widget').textContent = onchain.total_transactions || '0';
  } catch (e) {
    console.error('Onchain error:', e);
    document.getElementById('onchain-widget').innerHTML = '<span style="font-size: 1rem;">Error</span>';
  }
  
  // Analytics widget
  try {
    const analytics = await getAnalyticsStats();
    if (analytics.error) throw new Error(analytics.error);
    const snapshots = analytics.metrics?.snapshotsRecorded || 0;
    document.getElementById('analytics-widget').textContent = snapshots.toString();
  } catch (e) {
    console.error('Analytics error:', e);
    document.getElementById('analytics-widget').innerHTML = '<span style="font-size: 1rem;">Error</span>';
  }
}
