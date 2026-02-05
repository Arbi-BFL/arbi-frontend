import { Router } from './router.js';
import { renderDashboard } from './sections/dashboard.js';
import { renderWallet } from './sections/wallet.js';
import { renderEmail } from './sections/email.js';
import { renderAnalytics } from './sections/analytics.js';
import { renderOnchain } from './sections/onchain.js';

// Initialize router
const router = new Router();

// Add routes
router.addRoute('/', renderDashboard);
router.addRoute('/wallet', renderWallet);
router.addRoute('/email', renderEmail);
router.addRoute('/analytics', renderAnalytics);
router.addRoute('/onchain', renderOnchain);

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const mobileHeader = document.querySelector('.mobile-header');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
  });
}

// Show mobile header on small screens
function checkMobile() {
  if (window.innerWidth <= 768) {
    if (mobileHeader) mobileHeader.style.display = 'flex';
  } else {
    if (mobileHeader) mobileHeader.style.display = 'none';
    sidebar.classList.remove('active');
    hamburger?.classList.remove('active');
  }
}

window.addEventListener('resize', checkMobile);
checkMobile();

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && 
      sidebar.classList.contains('active') && 
      !sidebar.contains(e.target) && 
      !hamburger.contains(e.target)) {
    sidebar.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Start the router
router.start();
