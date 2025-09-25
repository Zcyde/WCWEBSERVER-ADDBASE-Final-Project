import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../views/mainlayout.vue';

// Page routing 
import Dashboard from '../views/dashboard.vue';
import Planner from '../views/planner.vue';
import Schedule from '../views/schedule.vue';
import Login from '../views/login.vue';
import SignIn from '../views/signIn.vue';

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

  // MainLayout routing
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'planner', name: 'Planner', component: Planner },
      { path: 'schedule', name: 'Schedule', component: Schedule },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;