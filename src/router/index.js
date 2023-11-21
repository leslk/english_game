import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/RegisterView.vue'
import Gameplay from '@/components/Gameplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'register',
      component: Register
    },
    {
      path: '/gameplay',
      name: 'gameplay',
      component: Gameplay
    }
  ]
})

export default router
