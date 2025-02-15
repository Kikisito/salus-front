import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'main',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: '',
        redirect: { name: 'home' },
      },
      {
        name: 'home',
        path: 'home',
        component: () => import('pages/HomePage.vue'),
      },
      {
        path: 'appointments',
        children: [
          {
            name: 'appointments',
            path: '',
            component: () => import('pages/AppointmentsPage.vue'),
          },
          {
            name: 'appointment',
            path: ':id',
            component: () => import('pages/AppointmentDetailsPage.vue'),
          },
        ],
      },
      {
        path: 'chats',
        children: [
          {
            name: 'chats',
            path: '',
            component: () => import('pages/ChatsPage.vue'),
          },
          {
            name: 'chat',
            path: ':id',
            component: () => import('pages/ChatPage.vue'),
          },
        ],
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: { name: 'login' } },
      { name: 'login', path: 'login', component: () => import('pages/LoginPage.vue') },
      { name: 'register', path: 'register', component: () => import('pages/RegisterPage.vue') },
      {
        path: 'forgot-password',
        children: [
          {
            path: '',
            name: 'forgot-password',
            component: () => import('pages/ForgotPasswordPage.vue'),
          },
          {
            name: 'reset-password-recover',
            path: ':token',
            component: () => import('pages/ForgotPasswordRecoverPage.vue'),
          },
        ],
      },
    ],
    meta: { requiresGuest: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
