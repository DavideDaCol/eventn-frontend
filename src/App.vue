<template>
    <div class="app">
        <SideBar></SideBar>
        <router-view />
    </div>
</template>

<script setup>
    import SideBar from './components/SideBar.vue'
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
