<template>
    <LoginPage v-if="!isLogged" />
    <UserInfo v-else />
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue';
    import UserInfo from '../components/UserInfo.vue';
    import { useUserStore } from '@/stores/user';
    const user = useUserStore();
    const isLogged = user.isLogged;

</script>

<style scoped>

</style>