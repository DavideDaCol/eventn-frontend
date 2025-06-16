<template>
    <div class="container">
        <h1>Amici</h1>
        <div v-if="loginState">
            <div class="flex" id="top-selector">
                <button class="inner-button" :class="{ active: buttonSwitch }" @click="buttonSwitch = !buttonSwitch">
                    Amici
                </button>
                <button class="inner-button" :class="{ active: !buttonSwitch }" @click="buttonSwitch = !buttonSwitch">
                    Utenti
                </button>
            </div>
            <input type="search" v-model="query">
            <div v-for="user in searchResult" :key="user._id" class="flex user-box">
                <span class="material-symbols-outlined"> account_circle </span>
                <h3>
                    {{ user.username.length < 15 ? user.username : user.username.substring(0, 15).concat('...') }} </h3>
                        <button class="friend" :disabled="!buttonSwitch && friends.includes(getUserId(user))"
                            @click="toggleFriend(getUserId(user), user)">
                            {{ friends.includes(getUserId(user)) ? '✓' : '+' }}
                        </button>
            </div>
        </div>
        <h1 v-else>Log In</h1>
    </div>
</template>

<script setup>
    import { onMounted, ref, computed, watch } from 'vue';
    import { useUserStore } from '@/stores/user';
    import axios from 'axios';

    let titlesOnly = ref([]);
    const user = useUserStore();
    const loginState = user.isLogged;
    const userObject = user.info.user ?? {};
    const friends = userObject.friends ?? [];
    const query = defineModel('query');
    const data = ref([]);
    const friendNames = ref([]);
    const buttonSwitch = ref(false);

    query.value = "";

    const getUserId = (username) => {
        const match = data.value.find(u => u.username === username.username);
        return match ? match._id : null;
    };
 
    const globalSearch = (users) => {
        titlesOnly.value = [];
        users.forEach(element => {
            titlesOnly.value.push(element.username);
        });
        console.log(titlesOnly.value);
    }

    const friendList = () =>{ 
        return data.value.filter(el => 
            friends.includes(el._id)
        );
    }
    console.log(friendList());

    onMounted(async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/all`);
        data.value = response.data;
        friendNames.value = friendList();
        globalSearch(friendNames.value);
    });

    watch(() => buttonSwitch.value, (newState) => {
        if(newState){
            globalSearch(friendNames.value);
        } else {
            globalSearch(data.value);
        }
    })

    const searchResult = computed(() => {
        const sourceList = buttonSwitch.value
            ? data.value.filter(el => friends.includes(el._id))
            : data.value;

        const matches = sourceList.filter(user =>
            user.username.toLowerCase().includes(query.value.toLowerCase())
        );

        return matches;
    });

    const toggleFriend = async (id, username) => {
        try {
            const isAlreadyFriend = friends.includes(id);

            if (isAlreadyFriend) {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/friends/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/friends/${id}`, {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
            }

            await user.updateUser();
            const updatedUser = user.info.user;
            if (updatedUser) {
                friends.splice(0, friends.length, ...updatedUser.friends);
            }

            alert(`${username.username} ${isAlreadyFriend ? 'rimosso dagli' : 'aggiunto agli'} amici!`);
        } catch (error) {
            console.error("Errore nella modifica della lista amici:", error);
            alert("Si è verificato un errore. Riprova più tardi.");
        }
    };


</script>

<style scoped>

    input{
        width: 90%;
        border: unset;
        border-bottom: 3px solid var(--dark-sec);
        background-color: var(--dark-main);
        color: var(--light-main);
        font-size: large;
        margin: 1.5rem auto;
    }

    input:focus {
        outline: none;
    }

    .container{
        position: absolute;
        overflow: auto;
        left: calc(2rem + 32px);
        z-index: 999;
        width: 25%;
        height: 95vh;
        margin: 1.5rem;
        border-radius: 20px;
        background-color: var(--dark-main);
        color: var(--light-main);
        text-align: center;
        padding: 1rem;
    }

    .user-box{
        margin: 0.5rem auto;
        padding: 0 0.5rem;
        border-radius: 10px;
        background-color: #333333;
        width: 90%;
        height: 3rem;
        align-items: center;
    }

    .material-symbols-outlined {
        font-size: 2em;
        user-select: none;
    }

    .flex{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .friend{
        width: 1.5em;
        height: 1.5em;
        border: unset;
        background-color: var(--accent-main);
        color: var(--light-main);
        border-radius: 5px;
    }

    #top-selector{
        width: 90%;
        margin: 0.5rem auto 0;
    }

    .inner-button{
        width: 45%;
        height: 2em;
        border: unset;
        color: var(--light-main);
        background-color: var(--dark-sec);
        border-radius: 5px;
    }

    .active{
        background-color: var(--accent-main);
    }
</style>