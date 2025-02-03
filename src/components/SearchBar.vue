<template>
    <div>
        <h1>Cerca</h1>
        <input type="search" v-model="query">
        <h3 v-for="result in searchResult" :key="result">
            {{ result.length < 35 ? result : result.substring(0,35).concat('...') }}
        </h3>
    </div>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { globalEvents } from '@/stores/events';
    let titlesOnly = ref([]);
    const query = defineModel('query');
    query.value = "";

    onMounted(() => {
        const allEvents = globalEvents.value;
        allEvents.forEach(element => {
            titlesOnly.value.push(element.eventName);
        });
        console.log(titlesOnly);
    });

    const searchResult = computed(() => {
        return titlesOnly.value.filter(el => 
            el.toLowerCase().includes(query.value.toLowerCase())
        );
    });

    console.log('balls'.length);
</script>

<style scoped>
    div{
        position: absolute;
        overflow: auto;
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
    }

    h3{
        margin-bottom: 2rem;
    }

    input{
        width: 90%;
        border: unset;
        border-bottom: 3px solid var(--dark-sec);
        background-color: var(--dark-main);
        color: var(--light-main);
        font-size: large;
        margin: 1.5rem;
    }

    input:focus {
        outline: none;
    }
</style>