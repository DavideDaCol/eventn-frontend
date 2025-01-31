<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { dateFormatter, timeFormatter } from '@/middleware/dateFormatter';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const positionContainer = ref(null);
const eventData = ref({
  title: '',
  start: '',
  length: '',
  timeStart: '',
  timeEnd: '',
  desc: '',
  pos: [],
});

const map = ref(null);
const marker = ref(null);

async function loadValues(eventId) {
  try {
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
    };

    updateMap(eventData.value.pos);
  } catch (error) {
    console.error("Error fetching event data:", error);
  }
}

function updateMap(position) {
  if (!positionContainer.value) return;

  if (!map.value) {
    map.value = L.map(positionContainer.value).setView(position, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 11,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.value);

    marker.value = L.marker(position).addTo(map.value);
  } else {
    map.value.setView(position, 14);
    marker.value.setLatLng(position);
  }
}

async function addPresence() {
  try {
    await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/events/counter/${route.params.id}`);
  } catch (error) {
    console.error("Error updating presence:", error);
  }
}

watchEffect(() => {
  if (route.params.id) {
    loadValues(route.params.id);
  }
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
    marker.value = null;
  }
});
</script>

<template>
    <main class="content">
        <h1 id="title">
            {{ eventData.title }}
        </h1>
        <h2 id="date">{{ eventData.start }} - {{ eventData.length }}</h2>
        <p id="desc">{{ eventData.desc }}</p>
        <button @click="addPresence" id="presence">ci sono!</button>
        <div class="flexRow" id="bigContainer">
            <img id="coverImage" src="../assets/sampleImage.jpg">
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
    main{
        background-color: var(--dark-main);
        background-size: cover;
        color: var(--light-main);
        text-align: center;
    }

    h1{
        font-size: 3.5rem;
    }

    h2{
        font-size: 2rem;
    }

    p{
        font-size: 1.25rem;
    }

    .content{
        padding: 1rem 4rem;
    }

    .flexRow{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .flexCol{
        display: flex;
        flex-direction: column;
    }

    #bigContainer{
        margin: 2rem 0;
    }

    #verticalContainer{
        width: 45%;
    }

    #desc{
        margin: 0 15%;
    }

    #coverImage{
        max-width: 45%;
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
        background-color: var(--accent-main);
        color: var(--light-main);
        margin: 2rem;
    }

    #position{
        max-width: 800px;
        height: calc(100% - 5rem);
        border: 2px solid var(--light-main);
        border-radius: 20px;
    }

</style>