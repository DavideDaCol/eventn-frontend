<template>
  <main class="account-edit-page">
    <h1>Modifica dati account</h1>

    <!-- Sezione dati base -->
    <section>
      <h2>Informazioni personali</h2>
      <form @submit.prevent="updateProfile">
        <label>
          Username
          <input v-model="form.username" type="text" placeholder="Username" />
        </label>
        <label>
          Nome
          <input v-model="form.name" type="text" placeholder="Nome" />
        </label>
        <label>
          Cognome
          <input v-model="form.surname" type="text" placeholder="Cognome" />
        </label>
        <label>
          Email
          <input v-model="form.email" type="email" placeholder="Email" />
        </label>
        <button type="submit">Salva modifiche</button>
      </form>
    </section>

    <!-- Sezione cambio password -->
    <section>
      <h2>Cambio password</h2>
      <form @submit.prevent="updatePassword">
        <label>
          Password attuale
          <input v-model="password.oldPassword" type="password" />
        </label>
        <label>
          Nuova password
          <input v-model="password.password" type="password" />
        </label>
        <label>
          Conferma nuova password
          <input v-model="password.passwordConfirmation" type="password" />
        </label>
        <button type="submit">Aggiorna password</button>
      </form>
    </section>

    <button @click="goBack">Annulla</button>
  </main>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const { clearUser } = useUserStore();

// Modello dati per il profilo
const form = reactive({
  username: '',
  name: '',
  surname: '',
  email: '',
});

// Modello dati per la password
const password = reactive({
  oldPassword: '',
  password: '',
  passwordConfirmation: '',
});

// Carica i dati utente al mount
onMounted(async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/users/me`,
      { withCredentials: true }
    );
    Object.assign(form, {
      username: res.data.username,
      name:     res.data.name,
      surname:  res.data.surname,
      email:    res.data.email,
    });
  } catch (err) {
    console.error('Impossibile caricare utente', err);
  }
});

// Funzione per aggiornare username/name/email
async function updateProfile() {
  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/users`,
      { ...form },
      { withCredentials: true }
    );
    alert('Profilo aggiornato con successo!');
    router.push('/settings');
  } catch (err) {
    alert('Errore durante l’aggiornamento del profilo.');
    console.error(err);
  }
}

// Funzione per aggiornare la password
async function updatePassword() {
  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/users/password`,
      { ...password },
      { withCredentials: true }
    );
    alert('Password aggiornata correttamente!');
    // opzionale: forza logout
    clearUser();
    router.push('/login');
  } catch (err) {
    alert(err.response?.data?.message || 'Errore durante il cambio password.');
    console.error(err);
  }
}

// Torna indietro a SettingsPage
function goBack() {
  router.back();
}
</script>

<style scoped>
.account-edit-page {
  max-width: 600px;
  margin: 2rem auto;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
section {
  margin-bottom: 2rem;
}
</style>
