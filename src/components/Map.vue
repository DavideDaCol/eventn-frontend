<template>
  <div id="bruh" ref="mapContainer">

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L, {icon} from 'leaflet'
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

  const map = ref();
  //TODO: what
  const mapContainer = ref();

  //function is called when component is mounted
  onMounted( async () => {
    //make new map
    map.value = L.map(mapContainer.value).setView([46.069, 11.124], 13.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);
    const allEvents = await axios.get('http://localhost:8080/events');
    createPins(allEvents);
  });

  function createPins(allEvents){
    var iconOptions = {
      iconUrl: new URL('@/assets/pin.png', import.meta.url).href,
      iconSize: [48,59]
    };
    var customIcon = L.icon(iconOptions);
    var markerOptions = {
      icon: customIcon,
      draggable: false
    }
    const eventList = allEvents.data;
    eventList.forEach(element => {
      const eventCoord = element.eventPosition;
      L.marker(eventCoord,markerOptions).addTo(map.value);
      console.log(`created pin for event ${element.eventName}`)
    });
  }
</script>

<style scoped> 
  #bruh{
    height: 100%;
    width: 100%;
  }
</style>