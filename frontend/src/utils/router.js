export const router = {
  routes: {},
  currentPath: '#/dashboard',
  init(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.renderRoute());
    window.addEventListener('load', () => this.renderRoute());
    this.renderRoute();
  },
  navigate(path) {
    window.location.hash = path;
  },
  renderRoute() {
    const hash = window.location.hash || '#/dashboard';
    this.currentPath = hash;
    const route = this.routes[hash] || this.routes['#/dashboard'];
    route();
  },
};
