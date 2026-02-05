import { getWalletBalances, getWalletTokens } from '../api.js';

export async function renderWallet() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">💰 Wallet</h1>
      
      <!-- Total Balance Card -->
      <div class="card" style="background: var(--nb-green); margin-bottom: 2rem;">
        <div style="text-align: center;">
          <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; opacity: 0.9;">Total Balance</div>
          <div id="total-balance" style="font-size: 4rem; font-weight: 700; font-family: 'Courier New', monospace; color: var(--nb-black);">$0.00</div>
          <div id="total-breakdown" style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">Loading...</div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        <div class="card" style="background: var(--nb-yellow);">
          <h2 style="margin-bottom: 1rem;">⛓️ Base</h2>
          <div id="base-balance" style="font-size: 3rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
          <div id="base-usd" style="font-size: 1.25rem; font-weight: 600; margin-top: 0.5rem; color: var(--nb-black); opacity: 0.8;">Native Balance: $0.00</div>
          <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.1); border: 2px solid var(--nb-black); font-family: monospace; font-size: 0.85rem; word-break: break-all;">
            0x75f39d9Bff76d376F3960028d98F324aAbB6c5e6
          </div>
        </div>
        
        <div class="card" style="background: var(--nb-blue);">
          <h2 style="margin-bottom: 1rem;">☀️ Solana</h2>
          <div id="solana-balance" style="font-size: 3rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
          <div id="solana-usd" style="font-size: 1.25rem; font-weight: 600; margin-top: 0.5rem; color: var(--nb-black); opacity: 0.8;">Native Balance: $0.00</div>
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

let allTokens = [];
let nativeBalances = { base: 0, solana: 0 };

async function loadWalletData() {
  try {
    const data = await getWalletBalances();
    
    // Update native balances and USD values
    if (data.base) {
      const ethBalance = data.base.balance?.toFixed(4) || '0.0000';
      const ethUsd = parseFloat(data.base.usd) || 0;
      nativeBalances.base = ethUsd;
      
      document.getElementById('base-balance').textContent = `${ethBalance} ETH`;
      document.getElementById('base-usd').textContent = `Native Balance: $${ethUsd.toFixed(2)}`;
    }
    
    if (data.solana) {
      const solBalance = data.solana.balance?.toFixed(4) || '0.0000';
      const solUsd = parseFloat(data.solana.usd) || 0;
      nativeBalances.solana = solUsd;
      
      document.getElementById('solana-balance').textContent = `${solBalance} SOL`;
      document.getElementById('solana-usd').textContent = `Native Balance: $${solUsd.toFixed(2)}`;
    }
    
    // Load tokens
    const tokensData = await getWalletTokens();
    if (tokensData && tokensData.tokens) {
      allTokens = tokensData.tokens;
      renderTokens(allTokens);
      updateTotalBalance();
    } else {
      document.getElementById('tokens-list').innerHTML = `
        <div style="text-align: center; padding: 2rem; opacity: 0.7;">
          No tokens found
        </div>
      `;
      updateTotalBalance();
    }
  } catch (error) {
    console.error('Error loading wallet data:', error);
    document.getElementById('base-balance').textContent = 'Error';
    document.getElementById('solana-balance').textContent = 'Error';
    document.getElementById('total-balance').textContent = 'Error';
    document.getElementById('tokens-list').innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--nb-coral);">
        Error loading tokens: ${error.message}
      </div>
    `;
  }
}

function updateTotalBalance() {
  const tokenValue = allTokens.reduce((sum, t) => sum + t.value, 0);
  const total = nativeBalances.base + nativeBalances.solana + tokenValue;
  
  document.getElementById('total-balance').textContent = `$${total.toFixed(2)}`;
  document.getElementById('total-breakdown').textContent = 
    `Native: $${(nativeBalances.base + nativeBalances.solana).toFixed(2)} • Tokens: $${tokenValue.toFixed(2)}`;
}

function renderTokens(tokens) {
  if (!tokens || tokens.length === 0) {
    document.getElementById('tokens-list').innerHTML = `
      <div style="text-align: center; padding: 2rem; opacity: 0.7;">
        No tokens found
      </div>
    `;
    return;
  }
  
  const html = tokens.map(token => {
    const networkColor = token.network === 'base' ? '#0052FF' : '#14F195';
    const priceChangeColor = token.priceChange24h >= 0 ? '#2ECC71' : '#E74C3C';
    const priceChangeSign = token.priceChange24h >= 0 ? '+' : '';
    
    return `
      <div style="padding: 1.25rem; border-bottom: 3px solid var(--nb-black); display: flex; justify-content: space-between; align-items: center; background: white; transition: all 0.2s;">
        <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
          <div style="display: inline-block; padding: 4px 10px; background: ${networkColor}; color: black; border: 2px solid var(--nb-black); font-size: 0.7rem; font-weight: 700;">
            ${token.network.toUpperCase()}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 1.05rem;">${token.symbol}</div>
            <div style="font-size: 0.85rem; opacity: 0.7;">${token.name}</div>
          </div>
        </div>
        
        <div style="text-align: right; flex: 1;">
          <div style="font-weight: 700; font-size: 1.05rem;">${token.balance.toFixed(6)}</div>
          <div style="font-size: 0.85rem; opacity: 0.7;">${token.symbol}</div>
        </div>
        
        <div style="text-align: right; flex: 1;">
          <div style="font-weight: 700; font-size: 1.05rem;">$${token.price.toFixed(4)}</div>
          <div style="font-size: 0.85rem; color: ${priceChangeColor}; font-weight: 600;">
            ${priceChangeSign}${token.priceChange24h.toFixed(2)}%
          </div>
        </div>
        
        <div style="text-align: right; flex: 1;">
          <div style="font-weight: 700; font-size: 1.1rem; font-family: 'Courier New', monospace;">
            $${token.value.toFixed(2)}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  const totalValue = tokens.reduce((sum, t) => sum + t.value, 0);
  
  document.getElementById('tokens-list').innerHTML = `
    <div style="background: var(--nb-yellow); padding: 1rem; border: 3px solid var(--nb-black); box-shadow: 6px 6px 0 var(--nb-black); margin-bottom: 1.5rem;">
      <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem;">Total Token Value</div>
      <div style="font-size: 2rem; font-weight: 700; font-family: 'Courier New', monospace;">$${totalValue.toFixed(2)}</div>
      <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 0.25rem;">${tokens.length} token${tokens.length !== 1 ? 's' : ''} found</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.5rem; padding: 0.75rem; background: var(--nb-black); color: white; font-weight: 700; font-size: 0.85rem; border: 3px solid var(--nb-black);">
      <div>TOKEN</div>
      <div style="text-align: right;">BALANCE</div>
      <div style="text-align: right;">PRICE</div>
      <div style="text-align: right;">VALUE</div>
    </div>
    
    ${html}
  `;
}

function filterTokens(query) {
  if (!query || query.trim() === '') {
    renderTokens(allTokens);
    return;
  }
  
  const lowercaseQuery = query.toLowerCase();
  const filtered = allTokens.filter(token => 
    token.symbol.toLowerCase().includes(lowercaseQuery) ||
    token.name.toLowerCase().includes(lowercaseQuery) ||
    token.address.toLowerCase().includes(lowercaseQuery)
  );
  
  renderTokens(filtered);
}
