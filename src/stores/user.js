import axios from 'axios';
import { reactive, ref, computed, watch } from 'vue'

const info = reactive({
    user: JSON.parse(localStorage.getItem('user')) || null
});

const eventCode = ref("");

const isLogged = computed(() => !!info.user);

const isAdmin = computed(() => !!info.user.isAdmin);

watch(() => info.user, (newUser) => {
    if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
    }
}, {deep: true});

const updateUser = async () => {
    const newUser = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/info`, {withCredentials: true});
    console.log("updated user", newUser.data);
    info.user = newUser.data;
}

const clearUser = () => {
    info.user = null;
    localStorage.removeItem('user');
}

export function useUserStore(){
    return { info, isLogged, isAdmin, updateUser, clearUser, eventCode };
}