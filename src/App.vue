<template>
    <div class="app">
        <SideBar v-if="mobile"
            @search-bar="toggleSearch = !toggleSearch"
            @tag-tab="toggleTag = !toggleTag"
            @saved-tab="toggleSaved = !toggleSaved"
            @friends-tab="toggleFriends = !toggleFriends">
        </SideBar>
        <Transition name="fade">
            <SearchBar v-if="toggleSearch"></SearchBar>
        </Transition>
        <Transition name="fade">
            <FriendsList v-if="toggleFriends"></FriendsList>
        </Transition>
        <Transition name="fade">
            <SavedTab v-if="toggleSaved"></SavedTab>
        </Transition>
        <Transition name="fade">
            <!-- Listen to tagSelected event from TagBar -->
            <TagBar v-if="toggleTag" @tagSelected="handleTagSelected"></TagBar>
        </Transition>
        <!-- Pass selectedTag to router-view so it can reach MapOSM -->
        <router-view :selectedTag="selectedTag" />
    </div>
</template>

<script setup>
    import SearchBar from './components/SearchBar.vue';
    import FriendsList from './components/FriendsList.vue';
    import SideBar from './components/SideBar.vue';
    import SavedTab from './components/SavedTab.vue';
    import TagBar from './components/TagBar.vue';
    import { ref, watch, Transition } from 'vue';
    import { useRoute } from 'vue-router';
    
    const toggleSearch = ref(false);
    const toggleTag = ref(false);
    const toggleSaved = ref(false);
    const toggleFriends = ref(false);
    const mobile = ref(false);
    
    // Add selectedTag state
    const selectedTag = ref(null);
    
    const isDesktop = () => {
        console.log(screen.width);
        if(screen.width >= 760){
            return true;
        } else return false;
    };
    
    mobile.value = isDesktop();
    const route = useRoute();
    
    // Handle tag selection from TagBar
    function handleTagSelected(tag) {
        console.log('App.vue received tagSelected event:', tag);
        selectedTag.value = tag;
        console.log('Updated selectedTag in App.vue:', selectedTag.value);
    }
    
    // Watch for route changes and reset toggled states
    watch(route, () => {
        toggleSearch.value = false;
        toggleTag.value = false;
        toggleSaved.value = false;
        toggleFriends.value = false;
        // Optional: Reset selected tag when navigating
        // selectedTag.value = null;
    });
</script>

<style>
    /* global CSS variables*/
    :root{
        --dark-main: #151515;
        --dark-sec: #727272;
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
    
    html, body, .app {
        height: auto;
        min-height: 100vh;
    }
    
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.25s ease;
    }
    
    .fade-enter-from,
    .fade-leave-to {
        transform: translate(-2rem);
        opacity: 0;
    }
</style>