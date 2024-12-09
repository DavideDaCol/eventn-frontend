<template>
    <main>
        <div class="wrap">
            <h1>Logged user: {{ name }}</h1>
            <h2>Presenze segnate: {{ counter }}</h2>
        </div>
    </main>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';

    const name = ref('');
    const counter = ref(0);
    //user is only pulled from the database if the browser doesn't have a local copy, hence cache.
    let cachedUser = '';

    //looks in local storage to see if the user is opening this page for the first time (post login)
    if(!localStorage.getItem('user')){
        getUserInfo();
    } else {
        cachedUser = JSON.parse(localStorage.getItem('user'));
        displayInfo();
    }

    //gets user from database (based on the jwt token) and saves it in localstorage as cache
    async function getUserInfo(){
        const user = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/info`, { withCredentials: true });
        localStorage.setItem('user', JSON.stringify(user.data));
        cachedUser = user.data;

        displayInfo(); 
    }

    //after getting the user, sends all relevant info to the component to be displayed
    function displayInfo(){
        name.value = cachedUser.username;
        counter.value = cachedUser.events.length;
    }

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