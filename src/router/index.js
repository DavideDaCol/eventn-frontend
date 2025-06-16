import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import UserView from '../views/UserView.vue'
import EventPage from '../components/EventPage.vue'
import PublishForm from '../components/PublishForm.vue'

import { useUserStore } from '@/stores/user'

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
        },
        {
            path: '/event/:id',
            component: EventPage
        },
        {
            path: '/publish/:code',
            component: PublishForm,
            beforeEnter: () => {
                const userStore = useUserStore();
                console.log(userStore.hasCode.value)
                if(userStore.hasCode.value == false){
                    return '/'
                }
            }
        }
    ]
})

export default router