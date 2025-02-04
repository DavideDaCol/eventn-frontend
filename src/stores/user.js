import { reactive } from 'vue'

export const userStore = reactive({
    isLogged: false,
    username: '',
    friends: [],
    events: []
});