import { getEmailStats } from '../api.js';

export async function renderEmail() {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="section">
      <h1 class="section-title">📧 Email Automation</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card card-coral">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Total Processed</h3>
          <div id="email-total" style="font-size: 2rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card card-yellow">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Last Check</h3>
          <div id="email-last-check" style="font-size: 1.25rem; font-weight: 700;">Loading...</div>
        </div>
        
        <div class="card card-cyan">
          <h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; opacity: 0.9;">Status</h3>
          <div id="email-status" style="font-size: 1.5rem; font-weight: 700;">Loading...</div>
        </div>
      </div>
      
      <div class="card">
        <h2 style="margin-bottom: 1.5rem;">Recent Emails</h2>
        <div id="email-list" style="max-height: 500px; overflow-y: auto;"></div>
      </div>
    </div>
  `;
  
  loadEmailData();
}

async function loadEmailData() {
  try {
    const data = await getEmailStats();
    
    document.getElementById('email-total').textContent = data.total_processed || 0;
    document.getElementById('email-last-check').textContent = data.last_check || 'Never';
    document.getElementById('email-status').textContent = data.status || 'Unknown';
    
    // Render recent emails
    const emailList = document.getElementById('email-list');
    if (data.recent_emails && data.recent_emails.length > 0) {
      emailList.innerHTML = data.recent_emails.map(email => `
        <div style="padding: 1rem; border-bottom: 3px solid var(--nb-black); margin-bottom: 0.5rem; background: var(--nb-gray-light);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
            <strong style="font-size: 1.05rem;">${escapeHtml(email.subject)}</strong>
            <span style="display: inline-block; padding: 2px 8px; background: var(--nb-${getCategoryColor(email.category)}); border: 2px solid var(--nb-black); font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">${email.category}</span>
          </div>
          <div style="font-size: 0.9rem; opacity: 0.8;">${escapeHtml(email.from)}</div>
          <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.25rem;">${new Date(email.timestamp * 1000).toLocaleString()}</div>
        </div>
      `).join('');
    } else {
      emailList.innerHTML = '<div style="text-align: center; padding: 2rem; opacity: 0.7;">No recent emails</div>';
    }
  } catch (error) {
    console.error('Email data error:', error);
    document.getElementById('email-total').textContent = 'Error';
    document.getElementById('email-last-check').textContent = 'Error';
    document.getElementById('email-status').textContent = 'Error';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCategoryColor(category) {
  const colors = {
    'urgent': 'coral',
    'technical': 'cyan',
    'partnership': 'purple',
    'business': 'blue',
    'community': 'green',
    'spam': 'gray-dark',
    'general': 'yellow'
  };
  return colors[category] || 'yellow';
}
