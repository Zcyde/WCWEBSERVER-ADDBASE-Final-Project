import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../views/mainlayout.vue';
import Dashboard from '../views/dashboard.vue';
import Planner from '../views/planner.vue';
import Schedule from '../views/schedule.vue';

const routes = [
  // This is the parent route for the main application layout
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'planner', name: 'Planner', component: Planner },
      { path: 'schedule', name: 'Schedule', component: Schedule }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;