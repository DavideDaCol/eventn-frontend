<template>
    <Transition name="fade">
        <LoadingScreen v-if="isLoading" />
    </Transition>
    <div id="bruh" ref="mapContainer"></div>
    <InfoPopup :eventPopup="eventPopup"/>
</template>

<script setup>
    import LoadingScreen from './LoadingScreen.vue';
    import { onMounted, ref, Transition } from 'vue';
    import L from 'leaflet'
    import 'leaflet/dist/leaflet.css';
    import axios from 'axios';
    import {filename} from 'pathe/utils';
    import { globalEvents } from '@/stores/events';
    import InfoPopup from './InfoPopup.vue';

    let isLoading = ref(true);
    const map = ref();
    //allows the div container to be responsive
    const mapContainer = ref();
    const eventPopup = ref({
        eventName: "nope"
    });

    //function is called when component is mounted
    onMounted( async () => {
        //make new map leaflet object
        map.value = L.map(mapContainer.value, {zoomControl: false}).setView([46.069, 11.124], 13.5);

        //creates layer for all the map tiles (refer to Leaflet documentation about tiles)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 11, 
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map.value);

        //set bounds to the navigation of the map
        const boundPoint1 = L.latLng(45.70477120908757, 10.439696563104636);
        const boundPoint2 = L.latLng(46.49243389138334, 11.802673739144229);
        const boundsTrento = L.latLngBounds(boundPoint1, boundPoint2);
        map.value.setMaxBounds(boundsTrento);

        //get pins from assets folder
        const allPins = import.meta.glob('@/assets/pins/*.png', { eager: true });
        //maps all images to their corresponding name (file name mapped to corresponding file path)
        const images = Object.fromEntries(
            Object.entries(allPins).map(([key, value]) => [filename(key), value.default])
        );


        //get all the available events
        const allEvents = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/all`);
        //place pins on map
        createPins(allEvents,images);
        isLoading.value = false;
    });

    //creates the appropiate pin object based on the event tag
    function optionsCreator(tag){
        const urlString = tag;

        var iconOptions = {
        iconUrl: new URL(urlString, import.meta.url).href, //creates URL object pointing to pin image
        iconSize: [48,59] // from image size
        };

        var customIcon = L.icon(iconOptions);
        var markerOptions = {
            icon: customIcon,
            draggable: false
        }

        return markerOptions;
    }

    //gets all of the event and adds the icon and click event handler for each event, then adds the
    //final object to the map.
    function createPins(allEvents,images){
        
        const eventList = allEvents.data;
        globalEvents.value = eventList;

        eventList.forEach(element => {

            //gets event coordinates
            const eventCoord = element.eventPosition;
            const pinColored = optionsCreator(images[element.eventTag]);

            //adds custom options and creates event handler for the InfoPopup component
            const toAdd = L.marker(eventCoord,pinColored).on("click", () => {
                eventPopup.value = element;
            })

            //actually adds the final result to the map
            toAdd.addTo(map.value);
            console.log(`created pin for event ${element.eventName}`)
        });
        
    }

</script>

<style scoped> 
    #bruh{
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