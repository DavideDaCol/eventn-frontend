<template>
  <main class="content">
    <h1>Modifica Dati Account</h1>

    <!-- Sezione: informazioni profilo -->
    <section class="account-section">
      <h2>Informazioni personali</h2>
      <form @submit.prevent="updateProfile" class="edit-form">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          placeholder="Username"
          required
        />

        <label for="name">Nome</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          placeholder="Nome"
          required
        />

        <label for="surname">Cognome</label>
        <input
          type="text"
          id="surname"
          v-model="form.surname"
          placeholder="Cognome"
          required
        />

        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Email"
          required
        />

        <button type="submit" class="submit-btn">Salva modifiche</button>
      </form>
    </section>

    <!-- Sezione: cambio password -->
    <section class="account-section">
      <h2>Cambio Password</h2>
      <form @submit.prevent="updatePassword" class="edit-form">
        <label for="oldPassword">Password attuale</label>
        <input
          
          id="oldPassword"
          v-model="password.oldPassword"
          placeholder="Password attuale"
          required
        />

        <label for="newPassword">Nuova password</label>
        <input
          
          id="newPassword"
          v-model="password.password"
          placeholder="Nuova password"
          required
        />

        <label for="confirmPassword">Conferma nuova password</label>
        <input
          
          id="confirmPassword"
          v-model="password.passwordConfirmation"
          placeholder="Conferma password"
          required
        />

        <button type="submit" class="submit-btn">Aggiorna password</button>
      </form>
    </section>

    <button @click="goBack" class="cancel-btn">Annulla</button>
  </main>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const { info, updateUser, clearUser } = useUserStore();

// Reactive state per profilo
const form = reactive({
  username: '',
  name: '',
  surname: '',
  email: '',
});

// Reactive state per password
const password = reactive({
  oldPassword: '',
  password: '',
  passwordConfirmation: '',
});

// Al montaggio, carico dal localStorage tramite lo store
onMounted(() => {
  if (info.user) {
    form.username = info.user.username;
    form.name = info.user.name;
    form.surname = info.user.surname;
    form.email = info.user.email;
  }
});

// Funzione per salvare profilo
async function updateProfile() {
  try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/account`,
      { username: form.username, name: form.name, surname: form.surname, email: form.email },
      { withCredentials: true }
    );
    await updateUser();
    alert('Profilo aggiornato con successo!');
    router.push('/settings');
  } catch (err) {
    console.error(err);
    alert('Errore durante l\'aggiornamento del profilo');
  }
}

// Funzione per aggiornare password
async function updatePassword() {
  try {
    console.log(password.oldPassword);
    console.log(password.password);
    console.log(password.passwordConfirmation);
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/account/password`,
      { oldPassword: password.oldPassword, password: password.password, passwordConfirmation: password.passwordConfirmation },
      { withCredentials: true }
    );
    console.log('palle');
    // console.log(password.oldPassword);
    // console.log(password.password);
    // console.log(password.passwordConfirmation);
    alert('Password aggiornata con successo!');
    clearUser();
    router.push('/login');
  } catch (err) {
    console.error('AXIOS ERROR:', err.response?.data);
    const msg = err.response?.data?.message || 'Errore nel cambio password';
    alert(msg);
  }
}

// Torna indietro
function goBack() {
  router.back();
}
</script>

<style scoped>
.content {
  background-color: var(--dark-main);
  color: var(--light-main);
  padding: 2rem;
  max-width: 600px;
  margin: auto;
  text-align: left;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.account-section {
  margin-bottom: 2rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 1.1rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
}

.submit-btn {
  background-color: var(--accent-main);
  color: var(--light-main);
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.cancel-btn {
  background-color: transparent;
  color: var(--light-main);
  border: 1px solid var(--light-main);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  margin: auto;
}
</style>
