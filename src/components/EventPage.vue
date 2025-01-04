<script setup>
    import axios from 'axios';
    import { useRoute } from 'vue-router';
    import { watch, ref } from 'vue';
    import { dateFormatter, timeFormatter }  from '@/middleware/dateFormatter';

    const eventTitle = ref('');
    const eventStart = ref('');
    const eventLength = ref('');
    const eventTimeStart = ref('');
    const eventTimeEnd = ref('');

    const route = useRoute();

    loadValues(route.params.id);
    watch(
        () => route.params.id,
        async (newId, oldId) => {
            console.log (`passing from ${oldId} to ${newId}`);
            loadValues(newId);
        }
    );

    async function loadValues(eventId){
        const newEventRequest = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/info/${eventId}`);
        const newEvent = newEventRequest.data;
        eventTitle.value = newEvent.eventName;
        eventStart.value = dateFormatter(newEvent.eventStart);
        eventLength.value = dateFormatter(newEvent.eventLength);
        eventTimeStart.value = timeFormatter(newEvent.eventStart);
        eventTimeEnd.value = timeFormatter(newEvent.eventLength);
    }
</script>

<template>
    <main class="content">
        <h1 id="title">
            {{ eventTitle }}
        </h1>
        <h2 id="date">{{ eventStart }} - {{ eventLength }}</h2>
        <h1 style="text-align: center;">
            {{ eventTimeStart }} - {{ eventTimeEnd }}
        </h1>
    </main>
</template>

<style scoped>
    main{
        background-color: var(--dark-main);
        color: var(--light-main);
    }

    .content{
        padding: 1rem 4rem;
    }

    #title, #date{
        text-align: center;
    }

</style>