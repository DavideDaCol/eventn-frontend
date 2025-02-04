<template>
    <main>
        <div class="wrap">
            <h1>Logged user: {{ name }}</h1>
            <h2>Presenze segnate: {{ counter }}</h2>
        </div>
    </main>
</template>

<script setup>
    import { useUserStore } from '@/stores/user';
    const user = useUserStore();

    const userObject = user.info.user;
    const name = userObject.username;
    const counter = userObject.events.length;

    console.log(user.info);
    

</script>

<style scoped>
    main{
        width: 100%;
        height: 100vh;
        background-color: var(--dark-main);
    }

    .wrap{
        width: 25%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--light-main);
        text-align: center;
    }
</style>