<script setup>
    import axios from 'axios';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const username = defineModel('username');
    const password  = defineModel('password');

    async function login() {
        const request = {
            "username": username.value,
            "password": password.value
        }
        
        try{
            const response = await axios.post('http://localhost:8080/users/login', request, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
            localStorage.setItem('userId', response.data.id);
            alert("login successful. Page will be reloaded");
            router.go();
        } catch (error){
            alert("login failed. please try again");
            console.log(error);
        }
    }
</script>

<template>
    <main>
        <div class="wrap">
            <h1>Login</h1>
            <form @submit.prevent="login">
                <input type="text" v-model="username" placeholder="inserisci username" />
                <input type="password" v-model="password"  placeholder="inserisci password" />
                <button type="submit">Login</button>
            </form>
        </div>
    </main>
</template>

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

    form{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    form > input,button {
        margin-top: 1.5rem;
        width: 70%;
        text-align: center;
        font-family: var(--main-font);
    }

    form > input{
        height: 2.5rem;
        border-radius: 10px;
    }

    form > button{
        height: 2rem;
        border-radius: 20px;
        border: 0;
        background-color: var(--accent-main);
        color: var(--light-main);
    }
</style>