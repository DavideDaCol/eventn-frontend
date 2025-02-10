<template>
    <aside>
        <div class="icons">
            <span
                @click="routerSwitch(0)"
                class="material-symbols-outlined"
                :class="{ colored: currentActive === 'login' }"
            >
                account_circle
            </span>
            <span 
                v-for="(icon, index) in iconNames" :key="index"
                @click="componentSwitch(icon.pos, icon.emit)"
                class="material-symbols-outlined"
                :class="{ colored: currentActive === icon.pos }"
            >
                {{ icon.name }}
            </span>
        </div>
        <div class="bottom-icons">
            <span
                @click="routerSwitch(1)"
                class="material-symbols-outlined"
                :class="{ colored: currentActive === 'settings' }"
            >
                settings
            </span>
        </div>
    </aside>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

let prevEvent = 'nullEmit'; // Previous event to track toggling
const iconNames = [
    { name: 'search', pos: 1, emit: 'searchBar' },
    { name: 'menu', pos: 2, emit: 'hallTab' },
    { name: 'star', pos: 3, emit: 'savedTab' },
    { name: 'group', pos: 4, emit: 'friendsTab' }
];

const emit = defineEmits(['searchBar', 'hallTab', 'savedTab', 'friendsTab', 'nullEmit']);
const currentActive = ref(null); // Tracks the active icon
const route = useRoute(); // Get the current route

// Watch for route changes
watch(
    () => route.path,
    () => {
        currentActive.value = null; // Reset the active icon
    }
);

// Handles component switching
const componentSwitch = (index, event) => {
    if (currentActive.value === index) {
        currentActive.value = null; // Toggle off
        emit(prevEvent);
        prevEvent = 'nullEmit';
    } else {
        currentActive.value = index; // Activate new
        emit(event);

        if (prevEvent !== event) {
            emit(prevEvent);
            prevEvent = event;
        } else {
            prevEvent = "nullEmit";
        }
        
        router.replace({ path: '/' }); // Always return to the map
    }
};

// Handles navigation-based icons (login and settings)
const routerSwitch = (type) => {
    const routeMap = { 0: 'login', 1: 'settings' };
    const newPath = { 0: '/user', 1: '/settings' };

    if (currentActive.value === routeMap[type]) {
        currentActive.value = null;
        router.replace({ path: '/' }); // Back to map
    } else {
        currentActive.value = routeMap[type];
        router.push({ path: newPath[type] });
    }
};
</script>


<style scoped>
aside {
    position: sticky;
    top: 0;
    width: calc(2rem + 32px);
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--dark-main);
    color: var(--light-main);
    padding: 1rem;
}

.colored {
    color: var(--accent-main);
}

.icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 2rem;
    padding: 0.5rem 0;
}

.material-symbols-outlined {
    font-size: 2rem;
    margin-bottom: 3rem;
    user-select: none;
}

.bottom-icons {
    margin-top: auto;
}

.bottom-icons>.material-symbols-outlined {
    padding-bottom: 1.5rem;
}

.LinkStyle,
.LinkStyle:visited,
.LinkStyle:hover,
.LinkStyle:active {
    color: inherit;
}
</style>
