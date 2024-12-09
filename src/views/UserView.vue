<template>
    <LoginPage v-if="isLogged" />
    <h1 v-else >Error - user is not logged in</h1>
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue'
    // TODO: change when login is implemented
    const isLogged = true

</script>

<style scoped>

</style>