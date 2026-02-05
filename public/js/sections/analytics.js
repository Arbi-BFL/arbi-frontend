import { getAnalyticsStats } from '../api.js';

export async function renderAnalytics() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">📊 Analytics</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card card-yellow">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Snapshots Recorded</h3>
          <div id="analytics-snapshots" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
        
        <div class="card card-cyan">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Tracking Since</h3>
          <div id="analytics-since" style="font-size: 1.1rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card card-purple">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Base Balance</h3>
          <div id="analytics-base" style="font-size: 1.5rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card card-coral">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Solana Balance</h3>
          <div id="analytics-solana" style="font-size: 1.5rem; font-weight: 700;">Loading...</div>
        </div>
      </div>
      
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Historical Tracking</h2>
        <p style="margin-bottom: 1rem;">SQLite-backed analytics for tracking system metrics and performance over time.</p>
        <div style="opacity: 0.8;">
          <p>📈 Historical data collection</p>
          <p>📊 Performance metrics</p>
          <p>💾 Persistent storage</p>
        </div>
      </div>
    </div>
  `;
  
  loadAnalyticsData();
}

async function loadAnalyticsData() {
  try {
    const data = await getAnalyticsStats();
    
    document.getElementById('analytics-snapshots').textContent = data.metrics?.snapshotsRecorded || '0';
    
    const since = data.metrics?.trackingSince;
    if (since) {
      const date = new Date(since);
      document.getElementById('analytics-since').textContent = date.toLocaleDateString();
    } else {
      document.getElementById('analytics-since').textContent = 'Unknown';
    }
    
    document.getElementById('analytics-base').textContent = `${data.current?.base?.balance || '0'} ETH`;
    document.getElementById('analytics-solana').textContent = `${data.current?.solana?.balance || '0'} SOL`;
  } catch (error) {
    console.error('Analytics error:', error);
    document.getElementById('analytics-snapshots').textContent = 'Error';
    document.getElementById('analytics-since').textContent = 'Error';
    document.getElementById('analytics-base').textContent = 'Error';
    document.getElementById('analytics-solana').textContent = 'Error';
  }
}
