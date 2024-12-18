<template>
    <div class="app">
        <SideBar v-if="mobile"
            @search-bar="toggleSearch = !toggleSearch"
            @hall-tab="toggleHall = !toggleHall"
            @saved-tab="toggleSaved = !toggleSaved"></SideBar>
        <SearchBar v-if="toggleSearch"></SearchBar>
        <router-view />
    </div>
</template>

<script setup>
    import SearchBar from './components/SearchBar.vue';
    import SideBar from './components/SideBar.vue'
    import { ref } from 'vue'

    const toggleSearch = ref(false);
    const toggleHall = ref(false);
    const toggleSaved = ref(false);

    const mobile = ref(false);
    const isDesktop = () => { 
        console.log(screen.width);
        if(screen.width >= 760){
            return true;
        } else return false;
    }; 

    mobile.value=isDesktop();
</script>

<style>
    /* global CSS variables*/
    :root{
        --dark-main: #151515;
        --light-main: #d5d5d5;
        --accent-main: #0469B8;
        --main-font: 'Source Sans 3';
    }
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Source Sans 3', sans-serif;
    }

    .app{
        display: flex;
        height: 100vh;
        /* targets the router view element */
        main{
        /* sets the shrink ratio for every flex column */
        flex: 1 1 0;
        padding: 1rem;
        /*media query for sidebar behavior, 768 is the width of an iPad screen in portrait mode*/
        @media (max-width: 768px) {
            padding-left: 6rem;
        }
        }
    }
</style>
