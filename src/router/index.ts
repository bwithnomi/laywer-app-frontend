import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { isGuest: true },
      component: () => import('@/pages/user/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      meta: { isGuest: true },
      component: () => import('@/pages/user/SignupView.vue')
    },
    {
      path: '/',
      name: 'defaultLayout',
      meta: { requiresAuth: true },
      component: () => import("@/layouts/DefaultUser.vue"),
      children: [
        {
          path: '/',
          name: 'home',
          meta: { requiresAuth: true },
          component: () => import("@/pages/user/HomeView.vue")
        },
        {
          path: '/profile',
          name: 'profile',
          meta: { requiresAuth: true },
          component: () => import("@/pages/user/ProfileView.vue")
        },
        {
          path: '/chat',
          name: 'chat',
          meta: { requiresAuth: true },
          component: () => import("@/pages/user/ChatView.vue")
        },
        {
          path: '/search',
          name: 'search',
          meta: { requiresAuth: true },
          component: () => import("@/pages/user/SearchView.vue")
        },
        {
          path: '/requests',
          name: 'requests',
          meta: { requiresAuth: true },
          component: () => import("@/pages/user/RequestView.vue")
        },
        {
          path: '/case/:id',
          name: 'case-detail',
          meta: { requiresAuth: true },
          component: () => import("@/pages/user/CaseDetail.vue")
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/AboutView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && userStore.user.token == null) {
    next({ name: "login" });
  } if (to.meta.isGuest && userStore.user.token != null) {
    next({ name: "home" });
  } else {
    next();
  }
})

export default router
