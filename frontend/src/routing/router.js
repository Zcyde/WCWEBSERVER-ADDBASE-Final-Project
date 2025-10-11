// NEW ROUTER FOR CHECKING
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../views/mainlayout.vue';

// Page routing 
import Dashboard from '../views/dashboard.vue';
import Planner from '../views/planner.vue';
import Schedule from '../views/schedule.vue';
import Login from '../views/login.vue';
import SignIn from '../views/signIn.vue';
import Library from '../views/library.vue';

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
    { path: '', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: 'planner', name: 'Planner', component: Planner, meta: { requiresAuth: true } },
    { path: 'schedule', name: 'Schedule', component: Schedule, meta: { requiresAuth: true } },
    { path: 'account', name: 'Account', component: () => import('../views/account.vue'), meta: { requiresAuth: true } },
    { path: 'library', name: 'Library', component: Library, meta: { requiresAuth: true } },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Authentication Guard (meta field)

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthPage = ['Login', 'Sign-In'].includes(to.name);

  // 1. If the route requires auth AND the user is NOT authenticated,
  // AND the destination is NOT already the Login page, redirect to Login.
  if (requiresAuth && !isAuthenticated && to.name !== 'Login') {
    return next({ name: 'Login' }); // Use 'return' to halt execution and resolve the guard
  } 
  
  // 2. If the user IS authenticated AND trying to go to a public auth page (Login/Sign-In),
  // redirect them away to the Dashboard.
  else if (isAuthPage && isAuthenticated) {
    return next({ name: 'Dashboard' }); // Use 'return' here as well
  } 
  
  // 3. For all other cases (e.g., authenticated to protected, or unauthenticated to Login), proceed.
  else {
    next();
  }
});
export default router;