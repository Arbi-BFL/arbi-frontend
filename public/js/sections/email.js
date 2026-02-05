import { getEmailStats } from '../api.js';

export async function renderEmail() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">📧 Email Automation</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="background: var(--nb-pink); color: white;">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Status</h3>
          <div id="email-status" style="font-size: 1.5rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-yellow);">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Last Check</h3>
          <div id="email-last-check" style="font-size: 1.25rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card" style="background: var(--nb-blue);">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Monitoring</h3>
          <div id="email-monitoring" style="font-size: 1.25rem; font-weight: 700;">Loading...</div>
        </div>
      </div>
      
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Email Service</h2>
        <p style="margin-bottom: 1rem;">Automated email monitoring and categorization for arbi@betterfuturelabs.xyz</p>
        <div style="opacity: 0.8;">
          <p>✅ Priority-based categorization</p>
          <p>✅ Discord notifications for urgent emails</p>
          <p>✅ Automated filtering (spam, community, business)</p>
        </div>
      </div>
    </div>
  `;
  
  loadEmailData();
}

async function loadEmailData() {
  try {
    const data = await getEmailStats();
    
    document.getElementById('email-status').textContent = data.status || 'Unknown';
    document.getElementById('email-last-check').textContent = data.last_check_time || 'Never';
    document.getElementById('email-monitoring').textContent = data.monitoring_status || 'Inactive';
  } catch (error) {
    document.getElementById('email-status').textContent = 'Error';
    document.getElementById('email-last-check').textContent = 'Error';
    document.getElementById('email-monitoring').textContent = 'Error';
  }
}
