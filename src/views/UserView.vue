<template>
    <LoginPage v-if="!isLogged" />
    <UserInfo v-else />
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue';
    import UserInfo from '../components/UserInfo.vue';
    // TODO: change when login is implemented
    const isLogged = document.cookie;

</script>

<style scoped>

</style>