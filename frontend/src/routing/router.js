// NEW ROUTER FOR CHECKING
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../views/mainlayout.vue';

// Page routing 
import Dashboard from '../views/dashboard.vue';
import Planner from '../views/planner.vue';
import Schedule from '../views/schedule.vue';
import Login from '../views/login.vue';
import SignIn from '../views/signIn.vue';
import Portfolio from '../views/portfolio.vue';

const routes = [
  // This is the parent route for the main application layout
  // AuthLayout routing
  {
    path: '/login', 
    name: 'Login', 
    component: Login
  },
  {
    path: '/sign-in',
    name: 'Sign-In',
    component: SignIn
  },

  // MainLayout routing WITH AUTHENTICATION
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard, meta: {requiresAuth: true} },
      { path: 'planner', name: 'Planner', component: Planner, meta: {requiresAuth: true} },
      { path: 'schedule', name: 'Schedule', component: Schedule, meta: {requiresAuth: true} },
      { path: 'account', name: 'Account', component: () => import('../views/account.vue'), meta: {requiresAuth: true} }, // Lazy-loaded
      { path: 'portfolio', name: 'Portfolio', component: Portfolio, meta: {requiresAuth: true} }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Authentication Guard (meta field)

router.beforeEach((to, from, next) => { //Checks everytime a user changes pages if logged in
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example authentication check
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthPage = ['Login', 'Sign-In'].includes(to.name); //Makes the login and sign up pages the pages that redirect if logged in

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (isAuthPage && isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});
export default router;