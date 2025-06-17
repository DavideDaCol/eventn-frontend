<script setup>
    import { useUserStore } from '@/stores/user';
    const user = useUserStore();
    import axios from 'axios';
    import { useRouter } from 'vue-router';
  import { extractErrorMessages } from '../middleware/errorHelper.js';

    const router = useRouter();

    //definemodel is used to define a 2-way reactive value (updates both js and html)
    const name = defineModel('name');
    const surname = defineModel('surname');
    const username = defineModel('username');
    const email = defineModel('email');
    const phone = defineModel('phone');
    const password  = defineModel('password');
    const confirmPassword = defineModel('confirmPassword');

    async function register() {
        //request formatting based on backend documentation
        if (password.value !== confirmPassword.value) {
            alert('Errore: le password non corrispondono.');
            return;
        }
        const request = {
            "name": name.value,
            "surname": surname.value,
            "username": username.value,
            "phone": phone.value,
            "email": email.value,
            "password": password.value
        }
        
        try{
            //makes actual axios post request
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/account/registration`,
                request, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });

            const request2 = {
                "usernameOrEmail": username.value,
                "password": password.value
            }

            //logs in because idk
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/account/login`,
                request2, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true //makes it so the server sends back the auth cookie
            });

            //saves userId to the browser for the UserInfo component
            await user.updateUser();
            console.log(`created an account for ${user.info.value}`);
            alert("registration was successful. Page will be reloaded");

            //page reload: router tells the page to go back to itself
            router.replace({ path: '/' });
        } catch (error) {
            console.error('updateProfile error payload:', error.response?.data);
            const userMsg = extractErrorMessages(error.response?.data);
            alert(userMsg);
        }
    }
</script>

<template>
    <main>
        <div class="wrap">
            <h1>Registrati</h1>
            <form @submit.prevent="register">
                <input type="text" v-model="name" placeholder="es. Mario" />
                <input type="text" v-model="surname" placeholder="es. Rossi" />
                <input type="text" v-model="username" placeholder="es. superMario92" />
                <input type="text" v-model="phone" placeholder="es. 1234567890" />
                <input type="text" v-model="email" placeholder="es. marioRossi@gmail.com" />
                <input type="password" v-model="password"  placeholder="inserisci una password valida" />
                <input type="password" v-model="confirmPassword" placeholder="Conferma password" />
                <button type="submit">Registrati</button>
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