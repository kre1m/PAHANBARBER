import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import Reviews from '../views/Reviews.vue';
import About from '../views/About.vue';
import Location from '../views/Location.vue';
import AdminLayout from '../views/admin/AdminLayout.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import AdminAppointments from '../views/admin/AdminAppointments.vue';
import AdminReviews from '../views/admin/AdminReviews.vue';
import AdminSchedule from '../views/admin/AdminSchedule.vue';
import AdminClients from '../views/admin/AdminClients.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: Reviews,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: true }
  },
  {
    path: '/location',
    name: 'Location',
    component: Location,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: Dashboard
      },
      {
        path: 'appointments',
        name: 'AdminAppointments',
        component: AdminAppointments
      },
      {
        path: 'reviews',
        name: 'AdminReviews',
        component: AdminReviews
      },
      {
        path: 'schedule',
        name: 'AdminSchedule',
        component: AdminSchedule
      },
      {
        path: 'clients',
        name: 'AdminClients',
        component: AdminClients
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Защита роутов
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresGuest && token) {
    if (user.role === 'admin') {
      next('/admin');
    } else {
      next('/home');
    }
  } else if (to.meta.requiresAdmin && user.role !== 'admin') {
    next('/home');
  } else {
    next();
  }
});

export default router;
