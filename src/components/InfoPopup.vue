<template>
    <div v-if="isActive" class="wrap">
        <h1>{{ popupName }}</h1>
        <h2>{{ popupStart }} - {{ popupEnd }}</h2>
        <p>{{ popupDesc }}</p>
    </div>
</template>

<script setup>
    import { watch, toRef, ref } from 'vue';
    //grabs the eventPopup object from the parent container
    const props = defineProps(['eventPopup']);
    //converts the constant into a reactive value
    const eventPopup = toRef(props, 'eventPopup');
    let popupName = ref();
    let popupDesc = ref();
    let popupStart = ref();
    let popupEnd = ref();
    let isActive = false;
    //Triggers callback when the pin that is clicked changes
    watch(() => props.eventPopup, (newVal) => {
        console.log(`InfoPopup received new eventPopup: ${newVal.eventName}`);
      
        popupName.value = eventPopup.value.eventName;
        popupDesc.value = eventPopup.value.eventDescription;
        popupStart.value = dateConverter(eventPopup.value.eventStart);
        popupEnd.value = dateConverter(eventPopup.value.eventLength);
        //nope is the default title of the component when a pin hasn't been clicked
        if(popupName.value !== "nope"){
            isActive = true;
        } else isActive = false;
    });
    //converts a UNIX date string into a date object and back into a formatted date
    const dateConverter = (date) => (new Date(date)).toLocaleDateString('it-IT', {dateStyle: "medium", });
</script>

<style scoped>
    .wrap{
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10%;
        /*i have no idea why vue wants this. it's 1 am.*/
        z-index: 400;
        background-color: gray;
        padding: 1rem 2rem;
        border-radius: 20px;
        color: var(--light-main);
        background-color: var(--dark-main);
    }
</style>