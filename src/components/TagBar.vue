<template>
    <div class="tags-container">
        <h1>Tags</h1>
        <div class="tag-list">
            <h3
                v-for="tag in tags"
                :key="tag"
                @click="selectTag(tag)"
                :class="{ active: selectedTag === tag }"
            >
                {{ tag }}
            </h3>
        </div>
        <!-- Add this reset button at the bottom -->
        <button class="reset-button" @click="resetFilter">
            Reimposta Filtri
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['tagSelected']);
const tags = ["Musica", "Festival", "Sport", "Conferenza", "Sagra", "Comune"];
const selectedTag = ref(null);

function selectTag(tag) {
    console.log('Tag clicked in TagTab:', tag);
    selectedTag.value = tag;
    emit('tagSelected', tag);
    console.log('Event emitted successfully');
}

// Add this function to handle reset
function resetFilter() {
    console.log('Resetting tag filter');
    selectedTag.value = null;
    emit('tagSelected', null);
}
</script>

<style scoped>
.tags-container {
    position: absolute;
    left: calc(2rem + 32px);
    z-index: 999;
    width: 20%;
    height: 95vh;
    margin: 1.5rem;
    border-radius: 20px;
    background-color: var(--dark-main);
    color: var(--light-main);
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    display: flex; /* Add flex display */
    flex-direction: column; /* Stack children vertically */
}

h1 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}

.tag-list {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 1; /* Allow this to take up available space */
}

h3 {
    cursor: pointer;
    border-radius: 20px;
    padding: 1rem;
    width: auto;
    margin: 0 auto;
    background-color: var(--accent-main);
    color: var(--light-main);
    font-size: 1.2rem;
    white-space: nowrap;
    min-width: 80%;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

h3:hover {
    transform: scale(1.02);
}

h3.active {
    background-color: var(--dark-sec);
    transform: scale(1.03);
}

/* Add these styles for the reset button */
.reset-button {
    margin-top: auto; /* Pushes button to bottom */
    margin-bottom: 1rem;
    padding: 0.8rem;
    border-radius: 20px;
    border: none;
    background-color: var(--dark-sec);
    color: var(--light-main);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 80%;
    align-self: center;
}

.reset-button:hover {
    background-color: #727272;
    transform: scale(1.02);
}
</style>