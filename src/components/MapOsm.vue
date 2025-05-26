<template>
    <Transition name="fade">
        <LoadingScreen v-if="isLoading" />
    </Transition>
    <div id="map" ref="mapContainer"></div>
    <InfoPopup :eventPopup="eventPopup" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { filename } from 'pathe/utils';
import { globalEvents } from '@/stores/events';
import LoadingScreen from './LoadingScreen.vue';
import InfoPopup from './InfoPopup.vue';

const props = defineProps({
  selectedTag: String
});

const isLoading = ref(true);
const map = ref(null);
const mapContainer = ref(null);
const currentMarkers = ref([]);
const eventPopup = ref({ eventName: "nope" });

// Improved loadAndRenderPins function
async function loadAndRenderPins() {
   
  try {
    const allPins = import.meta.glob('@/assets/pins/*.png', { eager: true });
    const images = Object.fromEntries(
        Object.entries(allPins).map(([key, value]) => [filename(key), value.default])
    );
    
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/all`);
    const eventList = response.data;
    globalEvents.value = eventList;
       
    // Clear old markers more reliably
    currentMarkers.value.forEach(marker => {
        if (marker && map.value) {
            map.value.removeLayer(marker);
        }
    });
    currentMarkers.value = [];
    
    
    let filtered;
    if (props.selectedTag) {
        console.log('Filtering by tag:', props.selectedTag);
        filtered = eventList.filter(e => {
            const matches = e.eventTag.toLowerCase() === props.selectedTag.toLowerCase();
            console.log(`  Event "${e.eventName}" (tag: "${e.eventTag}") matches: ${matches}`);
            return matches;
        });
    } else {
        console.log('No filter applied, showing all events');
        filtered = eventList;
    }
    
    console.log('Filtered events count:', filtered.length);
    console.log('Events to show on map:', filtered.map(e => ({ name: e.eventName, tag: e.eventTag })));
    
    // Add pins with error handling
    filtered.forEach((event, index) => {
        try {
            console.log(`Creating marker ${index + 1}/${filtered.length} for event: "${event.eventName}"`);
            
            const iconImageKey = event.eventTag;
            if (!images[iconImageKey]) {
                console.warn(`No icon found for tag: ${iconImageKey}. Available icons:`, Object.keys(images));
            }
            
            const icon = L.icon({
                iconUrl: new URL(images[event.eventTag], import.meta.url).href,
                iconSize: [48, 59],
            });
            
            const marker = L.marker(event.eventPosition, { icon })
                .on("click", () => {
                    eventPopup.value = event;
                })
                .addTo(map.value);
            
            currentMarkers.value.push(marker);
            
        } catch (error) {
            console.error(`Error creating marker for event ${event.eventName}:`, error);
        }
    });
    
    console.log('Total markers now on map:', currentMarkers.value.length);
  } catch (error) {
    console.error("Error loading and rendering pins:", error);
  }
}

onMounted(async () => { 
  try {
    map.value = L.map(mapContainer.value, { zoomControl: false }).setView([46.069, 11.124], 13.5);
        
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);
    
    
    const bounds = L.latLngBounds(
        [45.70477120908757, 10.439696563104636],
        [46.49243389138334, 11.802673739144229]
    );
    map.value.setMaxBounds(bounds);
    console.log('Map bounds set');
    
    await loadAndRenderPins();
    isLoading.value = false;
    console.log('Map initialization complete');
  } catch (error) {
    console.error("Map initialization error:", error);
    isLoading.value = false;
  }
});

// Enhanced tag filter watcher
watch(() => props.selectedTag, async (newTag, oldTag) => {
  console.log('Watch triggered!');
  console.log('  Old tag:', oldTag);
  console.log('  New tag:', newTag);
  console.log('  Map exists:', !!map.value);
  
  if (!map.value) {
    console.log('Map not ready, skipping watch');
    return;
  }
 
  isLoading.value = true;
  
  
  try {
    await loadAndRenderPins();
   
    // Optional: Adjust view to show all filtered markers
    if (currentMarkers.value.length > 0) {
      console.log('Fitting map bounds to show', currentMarkers.value.length, 'markers');
      const group = new L.featureGroup(currentMarkers.value);
      map.value.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else {
      console.log('No markers to fit bounds for');
    }
  } catch (error) {
    console.error("Error filtering markers by tag:", error);
  } finally {
    isLoading.value = false;
  }
}, { immediate: false }); // Changed to false since we load pins in onMounted

</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>