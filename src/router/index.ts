import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/AuthStore'
import { useUserStore } from 'src/stores/UserStore'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const userStore = useUserStore()

    // Check if the user store is loaded
    if (authStore.isAuthenticated && !userStore.user) {
      await userStore.getCurrentUser() // the result is ignored, this is just to load the store
    }

    // Verifications
    if (to.matched.some((record) => record.meta.requiresAuth) && !authStore.isAuthenticated) {
      next('/auth/login')
    } else if (
      to.matched.some((record) => record.meta.requiresGuest) &&
      authStore.isAuthenticated
    ) {
      next('/')
    } else {
      // Check if the route requires admin access
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        // Check if the user is an admin
        if (!userStore.hasRole('ADMIN')) {
          // Redirect to the home page or show an error message
          next('/')
          return
        }
      } else if (to.matched.some((record) => record.meta.requiresProfesional)) {
        // Check if the user is a professional
        if (!userStore.hasRole('PROFESSIONAL')) {
          // Redirect to the home page or show an error message
          next('/')
          return
        }
      }

      // If the user is authenticated and the site is public, allow access to the route
      next()
    }
  })

  return Router
})
