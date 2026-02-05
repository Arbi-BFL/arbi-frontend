import { getWalletBalances } from '../api.js';

export async function renderWallet() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">💰 Wallet</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        <div class="card" style="background: var(--nb-yellow);">
          <h2 style="margin-bottom: 1rem;">⛓️ Base</h2>
          <div id="base-balance" style="font-size: 3rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
          <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.1); border: 2px solid var(--nb-black); font-family: monospace; font-size: 0.85rem; word-break: break-all;">
            0x75f39d9Bff76d376F3960028d98F324aAbB6c5e6
          </div>
        </div>
        
        <div class="card" style="background: var(--nb-blue);">
          <h2 style="margin-bottom: 1rem;">☀️ Solana</h2>
          <div id="solana-balance" style="font-size: 3rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
          <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.1); border: 2px solid var(--nb-black); font-family: monospace; font-size: 0.85rem; word-break: break-all;">
            FeB1jqjCFKyQ2vVTPLgYmZu1yLvBWhsGoudP46fhhF8z
          </div>
        </div>
      </div>
      
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2>Token Holdings</h2>
          <div>
            <input type="text" id="token-filter" placeholder="Search tokens..." style="padding: 0.5rem; border: 3px solid var(--nb-black); font-size: 0.9rem;">
          </div>
        </div>
        <div id="tokens-list">
          <div style="text-align: center; padding: 2rem; opacity: 0.7;">Loading token balances...</div>
        </div>
      </div>
    </div>
  `;
  
  loadWalletData();
  
  // Add token filter event
  document.getElementById('token-filter')?.addEventListener('input', (e) => {
    filterTokens(e.target.value);
  });
}

async function loadWalletData() {
  try {
    const data = await getWalletBalances();
    
    // Update native balances
    if (data.base) {
      document.getElementById('base-balance').textContent = 
        `${data.base.balance?.toFixed(4) || '0.0000'} ETH`;
    }
    
    if (data.solana) {
      document.getElementById('solana-balance').textContent = 
        `${data.solana.balance?.toFixed(4) || '0.0000'} SOL`;
    }
    
    // Load tokens (placeholder - will enhance wallet API later)
    document.getElementById('tokens-list').innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="margin-bottom: 1rem; font-size: 1.1rem;">Token scanning coming soon!</p>
        <p style="opacity: 0.7;">Will scan Base ERC-20 and Solana SPL tokens with DexScreener prices</p>
      </div>
    `;
  } catch (error) {
    document.getElementById('base-balance').textContent = 'Error';
    document.getElementById('solana-balance').textContent = 'Error';
  }
}

function filterTokens(query) {
  // Placeholder for token filtering
  console.log('Filtering tokens:', query);
}
