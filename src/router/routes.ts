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
      {
        path: 'reports',
        name: 'reports',
        component: () => import('pages/ReportsPage.vue'),
      },
      {
        path: 'recipes',
        name: 'recipes',
        component: () => import('pages/RecipesPage.vue'),
      },
      {
        path: 'tests',
        name: 'tests',
        component: () => import('pages/TestsPage.vue'),
      },
      {
        name: 'profile',
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/professional',
    component: () => import('layouts/ProfessionalLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'professional' },
      },
      {
        name: 'professional',
        path: 'home',
        component: () => import('pages/professional/IndexPage.vue'),
      },
      {
        path: 'chats',
        children: [
          {
            name: 'professional-chats',
            path: '',
            component: () => import('pages/professional/ChatsPage.vue'),
          },
          {
            name: 'professional-chat',
            path: ':id',
            component: () => import('pages/professional/ChatPage.vue'),
          },
        ],
      },
      {
        path: 'agenda',
        children: [
          {
            name: 'professional-agenda',
            path: '',
            component: () => import('pages/professional/AgendaPage.vue'),
          },
          {
            name: 'professional-appointment',
            path: ':id',
            component: () => import('pages/professional/AppointmentDetailsPage.vue'),
          },
        ],
      },
      {
        path: 'patients',
        children: [
          {
            name: 'professional-patients',
            path: '',
            component: () => import('pages/professional/PatientsPage.vue'),
          },
          {
            name: 'professional-patient-details',
            path: ':id',
            component: () => import('pages/professional/PatientDetailsPage.vue'),
          },
        ],
      },
    ],
    meta: { requiresAuth: true, requiresProfesional: true },
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        name: 'admin-index',
        path: '',
        redirect: { name: 'admin' },
      },
      {
        name: 'admin',
        path: 'home',
        component: () => import('pages/admin/IndexPage.vue'),
      },
      {
        path: 'medical-centers',
        children: [
          {
            name: 'admin-medical-centers',
            path: '',
            component: () => import('pages/admin/MedicalCentersListPage.vue'),
          },
        ],
      },
      {
        path: 'rooms',
        children: [
          {
            name: 'admin-rooms',
            path: '',
            component: () => import('pages/admin/RoomsPage.vue'),
          },
        ],
      },
      {
        path: 'specialties',
        children: [
          {
            name: 'admin-specialties',
            path: '',
            component: () => import('pages/admin/SpecialtiesPage.vue'),
          },
        ],
      },
      {
        path: 'patients',
        children: [
          {
            name: 'admin-patients',
            path: '',
            component: () => import('pages/admin/PatientsPage.vue'),
          },
          {
            name: 'admin-patient',
            path: ':id',
            component: () => import('pages/admin/PatientDetailsPage.vue'),
          },
        ],
      },
      {
        path: 'doctors',
        children: [
          {
            name: 'admin-doctors',
            path: '',
            component: () => import('pages/admin/DoctorsPage.vue'),
          },
          {
            path: ':id',
            children: [
              {
                name: 'admin-doctor',
                path: '',
                component: () => import('pages/admin/DoctorDetailsPage.vue'),
              },
              {
                path: 'appointments',
                children: [
                  {
                    name: 'admin-doctor-appointments',
                    path: '',
                    component: () => import('pages/admin/DoctorAppointmentsPage.vue'),
                  },
                  {
                    name: 'admin-doctor-appointment',
                    path: ':appointmentId',
                    component: () => import('pages/admin/AppointmentDetailsPage.vue'),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: { name: 'login' } },
      {
        name: 'login',
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresGuest: true },
      },
      {
        name: 'register',
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { requiresGuest: true },
      },
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
        meta: { requiresGuest: true },
      },
      {
        path: 'verify/:token',
        component: () => import('pages/VerifyEmailPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
