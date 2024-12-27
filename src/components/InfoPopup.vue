<template>
    <div v-if="isActive" class="wrap">
      <div class="content">
        <div class="title centered">
            <h1>{{ popupName }}</h1>
        </div>
        <div class="desc centered">
            <h2>{{ popupStart }} - {{ popupEnd }}</h2>
            <p>{{ popupDesc }}</p>
        </div>
          <div id="attendance" class="centered">
            <h1>{{ popupAttending }}</h1>
            <p>Attending</p>
          </div>
        <div class="image">
          <img id="eventImage" src="../assets/sampleImage.jpg" alt="event image">
        </div>
        <div class="actions">
            <button id="presence">ci sono!</button>
            <button @click="openEvent" id="info">informazioni</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { watch, toRef, ref } from 'vue';
  import router from '@/router';
  import { dateFormatter } from '@/middleware/dateFormatter';
  
  const props = defineProps(['eventPopup']);
  const eventPopup = toRef(props, 'eventPopup');
  
  let popupName = ref();
  let popupDesc = ref();
  let popupStart = ref();
  let popupEnd = ref();
  let popupAttending = ref(0);
  let isActive = false;
  
  watch(
    () => props.eventPopup,
    (newVal) => {
      console.log(`InfoPopup received new eventPopup: ${newVal.eventName}`);
  
      popupName.value = eventPopup.value.eventName;
      popupDesc.value = eventPopup.value.eventDescription;
      popupStart.value = dateFormatter(eventPopup.value.eventStart);
      popupEnd.value = dateFormatter(eventPopup.value.eventLength);
      popupAttending.value = eventPopup.value.eventPresence;
  
      if (popupName.value !== "nope") {
        isActive = true;
      } else isActive = false;
    }
  );

    function openEvent() {
        router.replace({path: `/event/${eventPopup.value._id}`});
    }
  </script>
  
  <style scoped>
  .wrap {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10%;
  width: 50vw;
  height: 33vh;
  z-index: 400;
  background-color: var(--dark-main);
  padding: 1rem 2rem;
  border-radius: 20px;
  color: var(--light-main);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.content {
  display: grid;
  height: 100%;
  grid-template-rows: repeat(6, 16%);
  grid-template-columns: repeat(2, 50%);
}

.centered{
    text-align: center;
}

.title{
    grid-row: 1 / 2;
    grid-column: 1 / 3;
}

.desc{
    grid-row: 2 / 3;
    grid-column: 1 / 2;
}

#attendance {
    grid-row: 4 / 5;
    grid-column: 1 / 2;
}

.actions{
    grid-row: 6 / 7;
    grid-column: 1 / 3;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.image{
    grid-row: 2 / 6;
    grid-column: 2 / 3;
    margin: 0.75rem;
}

.image > img{
    display: block;
    margin: auto;
    border: 1px solid white;
    border-radius: 20px;
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
}

#presence,
#info {
  width: 45%;
  height: 2.5rem;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

#presence {
  background-color: var(--accent-main);
  color: var(--light-main);
  margin-right: 1rem;
}

#info {
  background-color: var(--dark-sec);
  color: var(--light-main);
}

  </style>
  