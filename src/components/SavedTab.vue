<template>
    <div>
        <h1>Cerca</h1>
        <h3 v-for="result in titlesOnly" :key="result" @click="openEvent(result[1])">
            {{ result[0].length < 35 ? result[0] : result[0].substring(0,35).concat('...') }}
        </h3>
    </div>
</template>

<script setup>
    import { useUserStore } from '@/stores/user';
    import { globalEvents } from '@/stores/events';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const user = useUserStore();
    let titlesOnly = ref([]);
    const router = useRouter();

    const userInfo = user.info.user;
    const savedEvents = userInfo.events;

    const allEvents = globalEvents.value;
    let eventNames = [];
    allEvents.forEach(el => {
        eventNames.push([el.eventName, el._id]);
    })
    console.log(eventNames);

    onMounted(() => {
        eventNames.forEach(element => {
            console.log(element[1]);
            if(savedEvents.includes(element[1])) {
                titlesOnly.value.push([element[0], element[1]]);
            }
        });
        console.log(titlesOnly);
    });

    function openEvent(event){
        router.push({path: `/event/${event}`});
    }
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