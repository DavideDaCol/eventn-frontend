<template>
    <LoginPage v-if="!isLogged" />
    <h1 v-else >Error - user is already logged in</h1>
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue';
    // TODO: change when login is implemented
    const isLogged = document.cookie;

</script>

<style scoped>

</style>