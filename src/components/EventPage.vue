<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ref, watchEffect, onBeforeUnmount, computed } from 'vue';
import { dateFormatter, timeFormatter } from '@/middleware/dateFormatter';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingScreen from './LoadingScreen.vue';
import { useUserStore } from '@/stores/user';

//shows the loading spinner if the page is fetching data
let isLoadingEvent = ref(true);
const route = useRoute();
//the small frame where leaflet is loaded to show the event's position
const positionContainer = ref(null);
//empty template for the page's data
const eventData = ref({
    title: '',
    start: '',
    length: '',
    timeStart: '',
    timeEnd: '',
    desc: '',
    pos: [],
    image: '',
});

const user = useUserStore();

//leaflet scaffolding
const map = ref(null);
const marker = ref(null);
let resizeObserver = null;

//function that fetches and fills the event data
async function loadValues(eventId) {
    try {
        isLoadingEvent.value = true;
        //hit events info API
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/info/${eventId}`);
        const newEvent = response.data;

        // Update event data
        eventData.value = {
            title: newEvent.eventName,
            start: dateFormatter(newEvent.eventStart),
            length: dateFormatter(newEvent.eventLength),
            timeStart: timeFormatter(newEvent.eventStart),
            timeEnd: timeFormatter(newEvent.eventLength),
            desc: newEvent.eventDescription,
            pos: newEvent.eventPosition,
            image: newEvent.eventImage ?  newEvent.eventImage : "https://i.ibb.co/fV0kYc6T/sample-Image.jpg",
        };
        
        //loads the needed data to show the position of the event in a leaflet frame
        updateMap(eventData.value.pos);
    } catch (error) {
        console.error("Error fetching event data:", error);
    } finally {
        isLoadingEvent.value = false;
    }
}

function updateMap(position) {
    if (!positionContainer.value) return;

    //if the map hasn't been set up yet, start doing that!
    if (!map.value) {
        map.value = L.map(positionContainer.value).setView(position, 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 11,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.value);

        marker.value = L.marker(position).addTo(map.value);

        // Initialize ResizeObserver
        resizeObserver = new ResizeObserver(() => {
            setTimeout(() => {
                map.value.invalidateSize();
            }, 200);
        });
        resizeObserver.observe(positionContainer.value);
    } else {
        map.value.setView(position, 14);
        marker.value.setLatLng(position);
    }
}

async function addPresence() {
    try {
        if(!user.isLogged.value){
            alert("per favore registrati per salvare gli eventi!");
        } else {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/events/counter/${route.params.id}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (getButtonState.value) { // true if the user is already present
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/events/${route.params.id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/events/${route.params.id}`, {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
            }
            user.updateUser();
        }
    } catch (error) {
        alert("internal issue. Please try again later");
        console.error(error);
    }
}

const getButtonState = computed(() => {
    let isPresent = false;
    if(user.isLogged.value){
        console.log(user.info);
        const userInfo = user.info.user;
        if (userInfo == null){
            console.log("user is not logged in");
        } else {
            const userEvents = userInfo.events;
            console.log(userEvents);
            if (userEvents.includes(route.params.id)){
                isPresent = true;
            }
        }
    }
    return isPresent;
})

watchEffect(() => {
    if (route.params.id) {
        loadValues(route.params.id);
    }
});

onBeforeUnmount(() => {
    if (map.value) {
        map.value.remove();
        map.value = null;
        marker.value = null;
    }
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
});
</script>

<template>
    <LoadingScreen v-if="isLoadingEvent" />
    <main class="content">
        <h1 id="title">{{ eventData.title }}</h1>
        <h2 id="date">{{ eventData.start }} - {{ eventData.length }}</h2>
        <p id="desc">{{ eventData.desc }}</p>
        <button @click="addPresence" :class="!getButtonState ? 'activeBtn' : 'inactiveBtn'" id="presence">
            ci sono!
        </button>
        <div class="flexRow" id="bigContainer">
            <img id="coverImage" :src="eventData.image" />
            <div class="flexColumn" id="verticalContainer">
                <h1 style="text-align: center;">
                    {{ eventData.timeStart }} - {{ eventData.timeEnd }}
                </h1>
                <div id="position" ref="positionContainer"></div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    background-color: var(--dark-main);
    background-size: cover;
    color: var(--light-main);
    text-align: center;
}

h1 {
    font-size: 3.5rem;
}

h2 {
    font-size: 2rem;
}

p {
    font-size: 1.25rem;
}

.content {
    padding: 1rem 4rem;
}

.flexRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.flexCol {
    display: flex;
    flex-direction: column;
}

.activeBtn {
    background-color: var(--accent-main);
}

.inactiveBtn {
    background-color: grey;
}

#bigContainer {
    margin: 2rem 0;
}

#verticalContainer {
    width: 45%;
}

#desc {
    margin: 0 15%;
}

#coverImage {
    max-width: 45%;
    aspect-ratio: 16/9;
    border: 2px solid var(--light-main);
    border-radius: 20px;
}

#presence {
    width: 30%;
    height: 3rem;
    border-radius: 20px;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: var(--light-main);
    margin: 2rem;
}

#position {
    max-width: 800px;
    height: calc(100% - 5rem);
    border: 2px solid var(--light-main);
    border-radius: 20px;
}
</style>
