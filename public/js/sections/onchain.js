import { getOnchainStats, getOnchainTransactions } from '../api.js';

export async function renderOnchain() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">🔗 Onchain Activity</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="background: #0052FF; color: black;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Base Transactions</h3>
          <div id="base-txs" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
        
        <div class="card" style="background: #14F195;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Solana Transactions</h3>
          <div id="solana-txs" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-pink); color: black;">
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
  const html = txs.map(tx => {
    const explorerUrl = tx.network === 'base' 
      ? `https://basescan.org/tx/${tx.hash}`
      : `https://explorer.solana.com/tx/${tx.hash}`;
    
    const value = parseFloat(tx.value) || 0;
    const valueDisplay = tx.network === 'base' 
      ? `${value.toFixed(6)} ETH` 
      : `${value.toFixed(6)} SOL`;
    
    return `
      <div style="padding: 1.25rem; border-bottom: 3px solid var(--nb-black); background: ${tx.network === 'base' ? '#E3F2FD' : '#E8F5E9'};">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
          <div style="flex: 1;">
            <div style="margin-bottom: 0.5rem;">
              <span style="display: inline-block; padding: 3px 10px; background: ${tx.network === 'base' ? '#0052FF' : '#14F195'}; color: black; border: 2px solid var(--nb-black); font-size: 0.75rem; font-weight: 700; margin-right: 0.5rem;">${tx.network.toUpperCase()}</span>
              <span style="font-weight: 700; font-size: 1rem;">${valueDisplay}</span>
              <span style="display: inline-block; padding: 2px 6px; background: ${tx.status === 'confirmed' ? '#2ECC71' : '#E74C3C'}; color: black; border: 2px solid var(--nb-black); font-size: 0.65rem; margin-left: 0.5rem;">${tx.status.toUpperCase()}</span>
            </div>
            
            <div style="font-family: monospace; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <strong>From:</strong> <span style="opacity: 0.8;">${tx.from_address.slice(0, 10)}...${tx.from_address.slice(-8)}</span>
            </div>
            <div style="font-family: monospace; font-size: 0.85rem; margin-bottom: 0.25rem;">
              <strong>To:</strong> <span style="opacity: 0.8;">${tx.to_address.slice(0, 10)}...${tx.to_address.slice(-8)}</span>
            </div>
            
            <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.5rem;">
              Block #${tx.block_number} • ${new Date(tx.timestamp * 1000).toLocaleString()}
            </div>
          </div>
          
          <div style="text-align: right;">
            <a href="${explorerUrl}" target="_blank" rel="noopener" style="display: inline-block; padding: 6px 12px; background: var(--nb-yellow); border: 2px solid var(--nb-black); box-shadow: 3px 3px 0 var(--nb-black); text-decoration: none; color: black; font-size: 0.85rem; font-weight: 700; transition: all 0.15s;">
              VIEW TX →
            </a>
          </div>
        </div>
        
        <div style="font-family: monospace; font-size: 0.75rem; opacity: 0.6; word-break: break-all;">
          ${tx.hash}
        </div>
      </div>
    `;
  }).join('');
  
  document.getElementById('transactions-list').innerHTML = html || '<div style="text-align: center; padding: 2rem; opacity: 0.7;">No transactions</div>';
}
