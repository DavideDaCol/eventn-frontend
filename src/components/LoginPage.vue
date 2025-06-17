<script setup>
    import NewAccount from '../components/NewAccount.vue';
    import { useUserStore } from '@/stores/user';
    const user = useUserStore();
    const regpage = ref(false);
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import { extractErrorMessages } from '../middleware/errorHelper.js';

    const router = useRouter();

    //definemodel is used to define a 2-way reactive value (updates both js and html)
    const usernameOrEmail = defineModel('usernameOrEmail');
    const password  = defineModel('password');

    async function login() {
        //request formatting based on backend documentation
        const request = {
            "usernameOrEmail": usernameOrEmail.value,
            "password": password.value
        }
        
        try{
            //makes actual axios post request
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/account/login`,
                request, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true //makes it so the server sends back the auth cookie
            });

            //saves userId to the browser for the UserInfo component
            await user.updateUser();
            alert("login successful. Page will be reloaded");

            //page reload: router tells the page to go back to itself
            router.replace({ path: '/' });
        } catch (error){
            // alert("login failed. please try again");
            // console.log(error);
            console.error('updateProfile error payload:', error.response?.data);
            const userMsg = extractErrorMessages(error.response?.data);
            alert(userMsg);
        }
    }

    function handleReg() {
        regpage.value = true;
        console.log("regpage status: ", regpage);
    }
</script>

<template>
    <main v-if="!regpage">
        <div class="wrap">
            <h1>Login</h1>
            <form @submit.prevent="login">
                <input type="text" v-model="usernameOrEmail" placeholder="inserisci username oppure email" />
                <input type="password" v-model="password"  placeholder="inserisci password" />
                <button type="submit">Login</button>
            </form>
            <button @click="handleReg">Registrati</button>
        </div>
    </main>
    <NewAccount v-else></NewAccount>
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