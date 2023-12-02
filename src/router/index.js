import { createRouter, createWebHistory } from 'vue-router'
import FriSportMainPage from "@/views/FriSportMainPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import NhlPage from "@/views/NhlPage.vue";
const routes = [
  {
    path: '/',
    name: 'FriSportMainPage',
    component: FriSportMainPage
  },
  {
    path: '/login-page',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/nhl-page',
    name: 'NhlPage',
    component: NhlPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
