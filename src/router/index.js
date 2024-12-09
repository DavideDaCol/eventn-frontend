import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import UserView from '../views/UserView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomeView
        },
        {
            path: '/settings',
            component: SettingsView
        },
        {
            path: '/user',
            component: UserView
        }
    ]
})

export default router