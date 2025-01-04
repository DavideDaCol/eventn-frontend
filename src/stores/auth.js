import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const id = ref('');
    const token = ref('');

    return { id, token }
})