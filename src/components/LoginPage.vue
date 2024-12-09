<script setup>
    async function login() {
        console.log("test");
    }
</script>

<template>
    <main>
        <div class="wrap">
            <h1>Login</h1>
            <form @submit.prevent="login">
                <input type="text" name="username" id="username" placeholder="inserisci username" />
                <input type="password" name="password" id="password" placeholder="inserisci password" />
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