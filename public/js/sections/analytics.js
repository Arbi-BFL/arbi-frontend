import { getAnalyticsStats } from '../api.js';

export async function renderAnalytics() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">📊 Analytics</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="background: var(--nb-yellow);">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Total Data Points</h3>
          <div id="analytics-total" style="font-size: 2.5rem; font-weight: 700; font-family: 'Courier New', monospace;">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-blue);">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Last Updated</h3>
          <div id="analytics-updated" style="font-size: 1.25rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-pink); color: white;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Status</h3>
          <div id="analytics-status" style="font-size: 1.5rem; font-weight: 700;">Loading...</div>
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
    
    document.getElementById('analytics-total').textContent = data.total_points || '0';
    document.getElementById('analytics-updated').textContent = data.last_updated || 'Never';
    document.getElementById('analytics-status').textContent = data.status || 'Unknown';
  } catch (error) {
    document.getElementById('analytics-total').textContent = 'Error';
    document.getElementById('analytics-updated').textContent = 'Error';
    document.getElementById('analytics-status').textContent = 'Error';
  }
}
