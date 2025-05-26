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
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['tagSelected']);
const tags = ["Musica", "Festival", "Sport", "Conferenza", "Sagra"];
const selectedTag = ref(null);

function selectTag(tag) {
    console.log('Tag clicked in TagTab:', tag);
    selectedTag.value = tag;
    
    emit('tagSelected', tag);
    console.log('Event emitted successfully');
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
    box-sizing: border-box; /* Ensures padding is included in width */
    overflow: hidden; /* Changed from auto to prevent scrollbars */
}

h1 {
    font-size: 1.8rem; /* Larger font for heading */
    margin-bottom: 1.5rem;
}

.tag-list {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Consistent spacing between tags */
}

h3 {
    cursor: pointer;
    border-radius: 20px;
    padding: 1rem; /* Increased padding */
    width: auto; /* Changed from 80% to auto */
    margin: 0 auto; /* Centered with auto margins */
    background-color: var(--accent-main);
    color: var(--light-main);
    font-size: 1.2rem; /* Larger font size */
    white-space: nowrap; /* Prevents text wrapping */
    min-width: 80%; /* Ensures consistent width */
    box-sizing: border-box; /* Includes padding in width calculation */
    transition: all 0.3s ease; /* Smooth transition for hover/active */
}

h3:hover {
    transform: scale(1.02); /* Slight grow effect on hover */
}

h3.active {
    background-color: var(--dark-sec);
    transform: scale(1.03); /* Slightly larger when active */
}
</style>