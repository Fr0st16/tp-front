import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import PageConnexion from './pages/PageConnexion.vue'
import PageCreationDeck from './pages/PageCreationDeck.vue'
import PageEdition from './pages/PageEdition.vue'
import PageInscription from './pages/PageInscription.vue'
import { useAuthStore } from './stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

export const isAuthenticated = ref(false)

export const ROUTES = {
  HOME: '/',
  CONNEXION: '/connexion',
  INSCRIPTION: '/inscription',
  CREATIONDECK: '/decks/create',
  EDITION: '/decks/:id',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.CONNEXION,
    component: PageConnexion,
    meta: { requiresAuth: false },
  },
  {
    path: ROUTES.INSCRIPTION,
    component: PageInscription,
    meta: { requiresAuth: false },
  },
  {
    path: ROUTES.CREATIONDECK,
    component: PageCreationDeck,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.EDITION,
    component: PageEdition,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.CONNEXION
  } else if (!to.meta.requiresAuth && auth.isAuthenticated) {
    return ROUTES.HOME
  } else {
    return true
  }
})

export default router
