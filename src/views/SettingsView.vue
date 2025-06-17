<template>
  <main class="settings-page">
    <div v-if="isLogged">
      <h1 id="header">Impostazioni</h1>
      <div class="wrap">
        <div id="col1" class="col">
          <h2>Account</h2>
          <router-link to="/edit"><h3>Modifica dati</h3></router-link>
          <a @click="clearCookies"><h3>Effettua logout</h3></a>
          <a href="" class="danger"><h3 class="danger">Elimina account</h3></a>
          <h2>Lingua</h2>
          <h3>Lingua attuale: Italiano (Italia)</h3>
          <h4 class="minor">La traduzione, al momento, è WIP. Ci scusiamo per il disagio</h4>
        </div>
        <div id="col2" class="col">
          <h2>Vuoi pubblicare un evento?</h2>

          <template v-if="!isAdmin">
            <h4>
              Per poter pubblicare eventi su EvenTN, ogni richiesta dovrà essere prima presentata presso il comune di Trento
              in modo da poter verificare eventuali permessi e criteri legali. In seguito all’approvazione dell’evento,
              riceverai un codice da inserire per poter pubblicare il tuo evento!
              <br /><br />
              Inserisci il codice distribuito dal comune per accedere alla pagina di pubblicazione dell’evento.
            </h4>
            <form @submit.prevent="submitCode">
              <input
                id="codeField"
                v-model="eventCodeModel"
                type="text"
                placeholder="Inserisci il codice evento..."
              /><br />
              <button type="submit" id="submitButton">Pubblica evento</button>
            </form>
          </template>

          <template v-else>
            <h4>Genera un nuovo evento direttamente senza codice esterno</h4>
            <button @click="handleAdminPublish" id="submitButton">Pubblica evento</button>
          </template>
        </div>
      </div>
    </div>

    <div v-else>
      <h1>Log in!</h1>
      <p>
        per accedere a questa sezione, per favore registrati. è semplice! clicca qui in alto
        a sinistra sull'icona dell'utente e premi il tasto registrati
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Stato utente
const { isLogged, isAdmin, clearUser, eventCode } = useUserStore();
const router = useRouter();

const eventCodeModel = defineModel('eventCodeModel');

// Per admin: codice generato
const generatedCode = ref('');

// Funzione per validazione codice utente normale
async function submitCode() {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/eventCodes/validate-code`,
      { code: eventCodeModel.value },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    eventCode.value = eventCodeModel.value;
    alert('Il codice è stato validato! Reindirizzamento in corso...');
    router.push({ path: `/publish/${eventCode.value}` });
  } catch (error) {
    alert('Validazione fallita. Riprova.');
    console.error(error);
    router.go();
  }
}

// Funzione per generare un nuovo codice per admin
async function generateCode() {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/eventCodes/create-code`,
      {},
      { withCredentials: true }
    );
    generatedCode.value = response.data.code;
    return generatedCode.value;
  } catch (error) {
    console.error('Errore generazione codice:', error);
    throw error;
  }
}

// Handler per utenti admin
async function handleAdminPublish() {
  try {
    const code = await generateCode();
    eventCode.value = code;
    alert('Codice generato! Reindirizzamento in corso...');
    router.push({ path: `/publish/${code}` });
  } catch {
    alert('Errore nella generazione del codice. Riprova.');
    console.log(eventCode.value);
  }
}

// Logout
function clearCookies() {
  document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  clearUser();
}
</script>

<style scoped>
main {
  background-color: var(--dark-main);
  color: var(--light-main);
}
.wrap {
  display: flex;
  flex-direction: row;
}
.col {
  margin: 2rem;
}
a,
a:visited,
a:hover,
a:active {
  color: #b8b5b5;
}
.danger {
  color: #b64848;
  text-decoration: none;
}
.minor {
  color: #a7a4a4;
  margin-top: 1rem;
}
#header {
  margin-left: 3rem;
  margin-top: 1rem;
  font-size: 50px;
}
#col1 {
  width: 33%;
  flex-grow: 1;
  flex-shrink: 0;
  margin-left: 3rem;
}
#col1 > h2,
h3 {
  margin-bottom: 2rem;
}
#col2 {
  flex-grow: 2;
  text-align: center;
}
form {
  margin-top: 2rem;
}
form > input,
button {
  margin-bottom: 1rem;
}
#codeField {
  width: 80%;
  height: 2.7rem;
  text-align: center;
  background-color: var(--light-main);
  color: var(--dark-main);
  border-radius: 20px;
  border: 2px solid #a7a4a4;
  font-family: var(--main-font);
  font-weight: 700;
}
#submitButton {
  width: 50%;
  height: 2.5rem;
  background-color: var(--accent-main);
  color: var(--light-main);
  border-radius: 20px;
  border: 0;
  font-family: var(--main-font);
  font-weight: 700;
}
</style>
