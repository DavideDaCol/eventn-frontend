<template>
    <main class="content">
        <h1>Pubblica un Evento</h1>
        <form @submit.prevent="submitEvent" class="event-form">
            <label for="title">Titolo</label>
            <input type="text" id="title" v-model="eventData.eventName" required>
            
            <label for="start">Data e ora inizio</label>
            <input type="datetime-local" id="start" v-model="eventData.eventStart" required>
            
            <label for="end">Data e ora fine</label>
            <input type="datetime-local" id="end" v-model="eventData.eventLength" required>

            <label for="tag">Descrizione</label>
            <select id="tag" v-model="eventData.eventTag" required>
                <option value="Musica">Musica</option>
                <option value="Festival">Festival</option>
                <option value="Sport">Sport</option>
                <option value="Conferenza">Conferenza</option>
                <option value="Sagra">Sagra</option>
                <option value="Comune">Comune</option>
            </select>
            
            <label for="desc">Descrizione</label>
            <textarea id="desc" v-model="eventData.eventDescription" required></textarea>
            
            <label>Posizione</label>
            <div id="map" ref="mapContainer"></div>
            <p v-if="!eventData.xcoord">Clicca sulla mappa per selezionare la posizione</p>
            
            <label for="image">Immagine</label>
            <input type="file" id="image" @change="cacheFile">
            
            <button type="submit" class="submit-btn">Pubblica</button>
        </form>
    </main>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useUserStore } from '@/stores/user';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const eventData = ref({
    eventName: '',
    eventStart: '',
    eventLength: '',
    eventTag: '',
    eventDescription: '',
    xcoord: '',
    ycoord: '',
    eventImage: "",
});

const userStore = useUserStore();

const mapContainer = ref(null);
let map = null;
let marker = null;
let file = "";

onMounted(() => {
    map = L.map(mapContainer.value).setView([46.069, 11.124], 13.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    map.on('click', (e) => {
        eventData.value.xcoord = e.latlng.lat;
        eventData.value.ycoord = e.latlng.lng;
        let showPos = [e.latlng.lat, e.latlng.lng];
        if (marker) marker.remove();
        marker = L.marker(showPos).addTo(map);
    });
});

function cacheFile(event) {
    file = event.target.files[0];
}

async function handleImageUpload(eventId) {
    const imageRequest = new FormData();
    imageRequest.append("eventImage", file);
    imageRequest.append("eventId", eventId);
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/image`, imageRequest, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
    console.log("attached image to event");
}

async function bindCode(eventId, eventCode) {
    const request = {
        "code": eventCode,
        "eventId": eventId
    }
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/eventCodes/invalidate-code`, request, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
    console.log("code invalidated successfully");
}

async function submitEvent() {
    try {
        const final = toRaw(eventData.value);
        console.log(final);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events`, final, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true //makes it so the server sends back the auth cookie
            });
        const newEventId = response.data.eventId;
        bindCode(newEventId, userStore.eventCode);
        handleImageUpload(newEventId);
        alert("Evento pubblicato con successo!");
    } catch (error) {
        console.error("Errore nella pubblicazione dell'evento:", error);
        alert("Qualcosa è andato storto. Controlla che tutti i dati necessari siano presenti e riprova.");
    }
}
</script>

<style scoped>
.content {
    background-color: var(--dark-main);
    color: var(--light-main);
    padding: 2rem;
    text-align: center;
}

.event-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: auto;
}

label {
    font-size: 1.2rem;
}

input, textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 5px;
    border: none;
}

#map {
    width: 100%;
    height: 300px;
    border-radius: 10px;
    border: 2px solid var(--light-main);
}

.submit-btn {
    background-color: var(--accent-main);
    color: var(--light-main);
    padding: 0.75rem;
    font-size: 1.25rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
</style>
