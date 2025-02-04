<template>
    <LoginPage v-if="!isLogged" />
    <UserInfo v-else />
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue';
    import UserInfo from '../components/UserInfo.vue';
    import { userStore } from '@/stores/user';
    const isLogged = userStore.isLogged;

</script>

<style scoped>

</style>