<template>
    <div v-if="isActive" class="wrap">
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
            <button id="presence">Ci sono!</button>
            <button @click="openEvent" id="info">Informazioni</button>
        </div>
    </div>
</template>

<script setup>
import { watch, toRef, ref } from 'vue';
import router from '@/router';
import { dateFormatter } from '@/middleware/dateFormatter';

const props = defineProps(['eventPopup']);
const eventPopup = toRef(props, 'eventPopup');

let popupName = ref('');
let popupDesc = ref('');
let popupStart = ref('');
let popupEnd = ref('');
let popupAttending = ref(0);
let popupImage = ref('');
let isActive = ref(false);

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
}

#presence {
    background-color: var(--accent-main);
    color: var(--light-main);
}

#info {
    background-color: var(--dark-sec);
    color: var(--light-main);
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