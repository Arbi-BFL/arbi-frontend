// Simple client-side router
export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    if (this.routes[path]) {
      this.currentRoute = path;
      history.pushState({}, '', path);
      this.routes[path]();
      this.updateActiveNav(path);
    }
  }

  updateActiveNav(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const route = link.getAttribute('data-route');
      if ((path === '/' && route === '') || (path === `/${route}` && route !== '')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  start() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      if (this.routes[path]) {
        this.routes[path]();
        this.updateActiveNav(path);
      }
    });

    // Handle nav link clicks
    document.querySelectorAll('.nav-link[data-route]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigate(path);
      });
    });

    // Load initial route
    const path = window.location.pathname;
    if (this.routes[path]) {
      this.navigate(path);
    } else {
      this.navigate('/');
    }
  }
}
