<template>
  <div class="map-view">
    <!-- Pass the selectedTag prop to MapOSM -->
    <MapOSM :selectedTag="selectedTag" />
  </div>
</template>

<script setup>
import { watch } from 'vue'; // Import watch from Vue
import MapOSM from '@/components/MapOSM.vue'; // Adjust path as needed

// Accept selectedTag prop from router-view
const props = defineProps({
  selectedTag: String
});

// Log when prop changes
watch(() => props.selectedTag, (newTag) => {
  console.log('Route component received selectedTag:', newTag);
});
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
}
</style>