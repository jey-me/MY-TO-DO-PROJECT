import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import TaskManager from '@/components/TaskManager.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm,
    meta: { requiresGuest: true },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TaskManager,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/login',
    },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;

  if (requiresAuth && !authStore.isLoggedIn) {
    console.log('Guard: Needs auth -> redirect to Login');
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }
  if (requiresGuest && authStore.isLoggedIn) {
    console.log('Guard: Guest route but already logged in -> redirect to Tasks');
    return next({ name: 'Tasks' });
  }
  console.log('Guard: Allowing navigation to', to.name);
  next();
});

export default router;
