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


router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthPage = ['Login', 'Sign-In'].includes(to.name);

  if (requiresAuth && !isAuthenticated && to.name !== 'Login') {
    return next({ name: 'Login' }); 
  } 

  else if (isAuthPage && isAuthenticated) {
    return next({ name: 'Dashboard' }); 
  } 
  
  else {
    next();
  }
});
export default router;