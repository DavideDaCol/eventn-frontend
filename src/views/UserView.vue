<template>
    <LoginPage v-if="!isLogged" />
    <UserInfo v-else />
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue';
    import UserInfo from '../components/UserInfo.vue';
    const isLogged = document.cookie;

</script>

<style scoped>

</style>