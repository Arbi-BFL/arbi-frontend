import { getOnchainStats, getOnchainTransactions } from '../api.js';

export async function renderOnchain() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">🔗 Onchain Activity</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="background: #0052FF; color: white;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Base Transactions</h3>
          <div id="base-txs" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
        
        <div class="card" style="background: #14F195;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Solana Transactions</h3>
          <div id="solana-txs" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-pink); color: white;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Total Activity</h3>
          <div id="total-txs" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
      </div>
      
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Recent Transactions</h2>
        <div id="transactions-list">
          <div style="text-align: center; padding: 2rem; opacity: 0.7;">Loading transactions...</div>
        </div>
      </div>
    </div>
  `;
  
  loadOnchainData();
}

async function loadOnchainData() {
  try {
    const stats = await getOnchainStats();
    
    document.getElementById('base-txs').textContent = stats.base_transactions || '0';
    document.getElementById('solana-txs').textContent = stats.solana_transactions || '0';
    document.getElementById('total-txs').textContent = stats.total_transactions || '0';
    
    // Load transactions
    const txs = await getOnchainTransactions();
    if (txs && txs.transactions && txs.transactions.length > 0) {
      renderTransactions(txs.transactions.slice(0, 10));
    } else {
      document.getElementById('transactions-list').innerHTML = 
        '<div style="text-align: center; padding: 2rem; opacity: 0.7;">No recent transactions</div>';
    }
  } catch (error) {
    document.getElementById('base-txs').textContent = 'Error';
    document.getElementById('solana-txs').textContent = 'Error';
    document.getElementById('total-txs').textContent = 'Error';
  }
}

function renderTransactions(txs) {
  const html = txs.map(tx => `
    <div style="padding: 1rem; border-bottom: 3px solid var(--nb-black); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-weight: 700; margin-bottom: 0.25rem;">
          <span style="display: inline-block; padding: 2px 8px; background: ${tx.network === 'base' ? '#0052FF' : '#14F195'}; color: ${tx.network === 'base' ? 'white' : 'black'}; border: 2px solid var(--nb-black); font-size: 0.75rem; margin-right: 0.5rem;">${tx.network.toUpperCase()}</span>
          ${tx.type || 'Transaction'}
        </div>
        <div style="font-family: monospace; font-size: 0.85rem; opacity: 0.8;">${tx.hash?.slice(0, 16)}...</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.85rem; opacity: 0.7;">${new Date(tx.timestamp * 1000).toLocaleString()}</div>
      </div>
    </div>
  `).join('');
  
  document.getElementById('transactions-list').innerHTML = html || '<div style="text-align: center; padding: 2rem; opacity: 0.7;">No transactions</div>';
}
