<template>
    <div>
        <h1>Cerca</h1>
            <button
                :class="{active: !comune}"
                @click="comune = !comune"
                >
                    Vedi Eventi Comune
            </button>
        <input type="search" v-model="query">
        <h3 v-if="comune" v-for="resultComune in searchResultTrento" :key="resultComune" @click="openEvent(resultComune[1])">
            {{ resultComune[0].length < 35 ? resultComune[0] : resultComune[0].substring(0, 35).concat('...') }} </h3>
        <h3 v-else v-for="result in searchResult" :key="result" @click="openEvent(result[1])">
            {{ result[0].length < 35 ? result[0] : result[0].substring(0, 35).concat('...') }} </h3>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { globalEvents } from '@/stores/events';
import { useRouter } from 'vue-router';

let titlesOnly = ref([]);
let comune = ref(false);
const router = useRouter();

const query = defineModel('query');
query.value = "";

//loads all of the events, keeps only the title the ID and the tag for filtering
onMounted(() => {
    const allEvents = globalEvents.value;
    allEvents.forEach(element => {
        titlesOnly.value.push([element.eventName, element._id, element.eventTag]);
    });
});

//redirects to the chosen event when you click on it
function openEvent(event) {
    router.push({ path: `/event/${event}` });
}

//keeps only the results that match the search query. updates in real time
const searchResult = computed(() => {
    return titlesOnly.value.filter(el =>
        el[0].toLowerCase().includes(query.value.toLowerCase())
    );
});

//same as above but only for events with the tag "comune"
const searchResultTrento = computed(() => {
    return titlesOnly.value.filter(el =>
        el[2] === 'Comune' && el[0].toLowerCase().includes(query.value.toLowerCase())
    );
});

</script>

<style scoped>
div {
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

h3 {
    margin-bottom: 2rem;
}

input {
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

button {
    border-radius: 20px;
    width: 80%;
    height: 1.5rem;
    margin-top:1rem;
    border: unset;
    background-color: var(--accent-main);
    color: var(--light-main);
}

.active{
    background-color: var(--dark-sec);
}
</style>