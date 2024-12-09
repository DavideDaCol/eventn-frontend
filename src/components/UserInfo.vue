<template>
  <main>
    <div class="wrap">
      <h1>Logged user: {{ name }}</h1>
      <h2>Presenze segnate: {{ counter }}</h2>
    </div>
  </main>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';

  const name = ref('');
  const counter = ref(0);
  let cachedUser = '';

  if(!localStorage.getItem('user')){
    getUserInfo();
  } else {
    cachedUser = JSON.parse(localStorage.getItem('user'));
    displayInfo();
  }

  async function getUserInfo(){
      const user = await axios.get('http://localhost:8080/users/info', { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(user.data));
      console.log(cachedUser);
      cachedUser = user.data;
      displayInfo(); 
  }

  function displayInfo(){
    name.value = cachedUser.username;
    counter.value = cachedUser.events.length;
  }

</script>

<style scoped>
  main{
      width: 100%;
      height: 100vh;
      background-color: var(--dark-main);
  }

  .wrap{
      width: 25%;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--light-main);
      text-align: center;
  }
</style>