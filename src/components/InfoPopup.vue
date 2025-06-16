<template>
    <div v-if="isActive" class="wrap">
        <button class="close-button" @click="isActive = !isActive">✕</button>
        <div class="title centered">
            <h1>{{ popupName }}</h1>
        </div>
        <div class="content">
            <div class="text-section">
                <div class="desc centered">
                    <h2 v-if="popupStart != popupEnd">{{ popupStart }} - {{ popupEnd }}</h2>
                    <h2 v-else>{{ popupStart }}</h2>
                    <p>{{ popupDesc.length > 100 ? popupDesc.substring(0,100).concat('...') : popupDesc }}</p>
                </div>
                <div id="attendance" class="centered">
                    <h1>{{ popupAttending }}</h1>
                    <p>Attending</p>
                </div>
            </div>
            <div class="image">
                <img id="eventImage" class="centered" :src="popupImage" alt="event image">
            </div>
        </div>
        <div class="actions">
            <button @click="addPresence" :class="!getButtonState ? 'activeBtn' : 'inactiveBtn'" id="presence">
            ci sono!
        </button>
            <button @click="openEvent" id="info">Informazioni</button>
        </div>
    </div>
</template>

<script setup>
import { watch, toRef, ref, computed } from 'vue';
import router from '@/router';
import { dateFormatter } from '@/middleware/dateFormatter';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

const props = defineProps(['eventPopup']);
const eventPopup = toRef(props, 'eventPopup');

let popupName = ref('');
let popupDesc = ref('');
let popupStart = ref('');
let popupEnd = ref('');
let popupAttending = ref(0);
let popupImage = ref('');
let isActive = ref(false);

const user = useUserStore();

watch(
    () => props.eventPopup,
    (newVal) => {
        if (!newVal || newVal.eventName === 'nope') {
            isActive.value = false;
            return;
        }

        popupName.value = eventPopup.value.eventName;
        popupDesc.value = eventPopup.value.eventDescription;
        popupStart.value = dateFormatter(eventPopup.value.eventStart);
        popupEnd.value = dateFormatter(eventPopup.value.eventLength);
        popupAttending.value = eventPopup.value.eventPresence;
        popupImage.value = eventPopup.value.eventImage ? eventPopup.value.eventImage : 'src/assets/sampleImage.jpg';
        isActive.value = true;
    }
);

function openEvent() {
    router.push({ path: `/event/${eventPopup.value._id}` });
}

const getButtonState = computed(() => {
    let isPresent = false;
    if(user.isLogged){
        console.log(user.info);
        const userInfo = user.info.user;
        if (userInfo == null){
            console.log("user is not logged in");
        } else {
            const userEvents = userInfo.events;
            console.log(userEvents);
            if (userEvents.includes(eventPopup.value._id)){
                isPresent = true;
            }
        }
    }
    return isPresent;
});

async function addPresence() {
    try {
        if (!user.isLogged.value) {
            alert("per favore registrati per salvare gli eventi!");
            return;
        }

        const wasPresent = getButtonState.value;

        // 1. Update event attendance counter
        await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/events/counter/${eventPopup.value._id}`, {}, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        // 2. Add or remove user from attending list
        if (wasPresent) {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/events/${eventPopup.value._id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
        } else {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/events/${eventPopup.value._id}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
        }

        // 3. Refresh user data and event attendance count
        await user.updateUser();

        const updatedEvent = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/info/${eventPopup.value._id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        popupAttending.value = updatedEvent.data.eventPresence;

    } catch (error) {
        alert("Errore durante la modifica della presenza. Riprova più tardi.");
        console.error(error);
    }
}

</script>

<style scoped>
.wrap {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10%;
    width: 50vw;
    max-width: 80vw;
    height: auto;
    max-height: 45vh;
    z-index: 400;
    background-color: var(--dark-main);
    padding: 1rem;
    border-radius: 20px;
    color: var(--light-main);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.content {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
}

.text-section {
    display: flex;
    flex-direction: column;
    width: 45%;
}

.centered {
    text-align: center;
}

/* Updated Image Styling */
.image {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 45%;
}

.image img {
    width: 100%;
    /* Reduced width */
    aspect-ratio: 16/9;
    max-height: 100%;
    /* Reduced height */
    border: 1px solid white;
    border-radius: 12px;
    object-fit: cover;
}

.actions {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}

button {
    width: 45%;
    height: 2.5rem;
    border-radius: 20px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease;
}
button:hover {
    transform: scale(1.05); /* Slight enlargement on hover */
}

#presence {
    color: var(--light-main);
}

#info {
    background-color: var(--dark-sec);
    color: var(--light-main);
}

.activeBtn {
    background-color: var(--accent-main);
}

.inactiveBtn {
    background-color: grey;
}

.close-button {
    width: auto;
    position: absolute;
    top: 1rem;
    right: 5%;
    background: transparent;
    border: none;
    color: var(--light-main);
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
}
.close-button:hover {
    transform: scale(1.2);
    color: var(--accent-main); /* Optional: changes color on hover */
}
/* Responsive Layout */
@media (max-width: 768px) {
    .wrap {
        position: fixed;
        left: 50%;
        transform: translateX(calc(-50% + 32px));
        width: 90vw;
        max-height: 70vh;
        padding: 0.5rem;
    }

    .content {
        flex-direction: column;
        align-items: center;
    }

    .text-section{
        width: 80%
    }

    .image {
        display: none;
    }

    .actions {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    button {
        width: 80%;
    }
}
</style>