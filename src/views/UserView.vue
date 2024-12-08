<template>
    <LoginPage v-if="isLogged" />
    <UserInfo v-else />
</template>

<script setup>

    import LoginPage from '../components/LoginPage.vue'
    // TODO: change when login is implemented
    const isLogged = true

</script>

<style scoped>

</style>