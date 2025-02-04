<template>
    <div class="container">
    <h1>Amici</h1>
    <div v-if="loginState">
        <input type="search" v-model="query">
        <h3 v-for="result in searchResult" :key="result">
            {{ result.length < 35 ? result : result.substring(0,35).concat('...') }}
        </h3>
    </div>
    <h1 v-else>Log In</h1>
</div>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useUserStore } from '@/stores/user';
    import axios from 'axios';
    let titlesOnly = ref([]);
    const user = useUserStore();
    const loginState = user.isLogged;
    const userObject = user.info.user;
    const friends = userObject.friends
    const query = defineModel('query');
    query.value = "";

    onMounted(() => {
        friends.forEach(element => {
            //const request = await axios.get() potrebbe mancare questo endpoint
            titlesOnly.value.push(element);
        });
        console.log(titlesOnly.value);
    });

    const searchResult = computed(() => {
        return titlesOnly.value.filter(el => 
            el.toLowerCase().includes(query.value.toLowerCase())
        );
    });

    console.log('balls'.length);
</script>

<style scoped>
    .container{
        position: absolute;
        overflow: auto;
        left: calc(2rem + 32px);
        z-index: 999;
        width: 20%;
        height: 95vh;
        margin: 1.5rem;
        border-radius: 20px;
        background-color: var(--dark-main);
        color: var(--light-main);
        text-align: center;
        padding: 1rem;
    }

    h3{
        margin-bottom: 2rem;
    }

    input{
        width: 90%;
        border: unset;
        border-bottom: 3px solid var(--dark-sec);
        background-color: var(--dark-main);
        color: var(--light-main);
        font-size: large;
        margin: 1.5rem;
    }

    input:focus {
        outline: none;
    }
</style>