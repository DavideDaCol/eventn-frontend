<template>
  <div id="bruh" ref="mapContainer">

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';

  const map = ref();
  //TODO: what
  const mapContainer = ref();

  //function is called when component is mounted
  onMounted(() => {
    //make new map
    map.value = L.map(mapContainer.value).setView([46.069, 11.124], 13.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);
  })
</script>

<style scoped> 
  #bruh{
    height: 100%;
    width: 100%;
  }
</style>