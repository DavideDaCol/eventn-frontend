<template>
  <div class="saved-tab">
    <h1>Eventi Salvati</h1>

    <template v-if="!isLogged">
      <p class="login-message">
        Accedi per vedere i tuoi eventi salvati.<br />
        <RouterLink to="/user" class="auth-link">Login</RouterLink>
      </p>
    </template>

    <h3
      v-for="result in titlesOnly"
      :key="result[1]"
      @click="openEvent(result[1])"
    >
      {{ result[0].length < 35 ? result[0] : result[0].substring(0, 35) + '...' }}
    </h3>
  </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useUserStore } from '@/stores/user';
    import { globalEvents } from '@/stores/events';
    import { useRouter } from 'vue-router';

    const { info, isLogged } = useUserStore();
    const router = useRouter();
    // Lista di eventi salvati dall'utente (se loggato)
    const savedEvents = computed(() => {
    return info.user?.events || [];
    });

    // Lista completa di eventi disponibili
    const allEvents = computed(() => globalEvents.value || []);

    // Filtra i titoli da mostrare
    const titlesOnly = computed(() => {
    if (!isLogged.value) return [];
    return allEvents.value
        .filter(ev => savedEvents.value.includes(ev._id))
        .map(ev => [ev.eventName, ev._id]);
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