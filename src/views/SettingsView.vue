<template>
    <main class="settings-page">
        <div v-if="userState">
        <h1 id="header">Impostazioni</h1>
        <div class="wrap">
            <div id="col1" class="col">
                <h2>Account</h2>
                <a href=""><h3>Modifica dati</h3></a>
                <a @click="clearCookies"><h3>Effettua logout</h3></a>
                <a href="" class="danger"><h3 class="danger">Elimina account</h3></a>
                <h2>Lingua</h2>
                <h3>Lingua attuale: Italiano (Italia)</h3>
                <h4 class="minor">La traduzione, al momento, è WIP. Ci scusiamo per il disagio</h4>
            </div>
            <div id="col2" class="col">
                <h2>Vuoi pubblicare un evento?</h2>
                <h3></h3>
                <h4>Per poter pubblicare eventi su EvenTN, ogni richiesta dovrà essere prima presentata presso il comune di Trento in modo da poter verificare eventuali permessi e criteri legali. In seguito all’approvazione dell’evento, riceverai un codice da inserire per poter pubblicare il tuo evento! <br /><br />Inserisci il codice distruibuito dal comune per accedere alla pagina di pubblicazione dell’evento.</h4>
                <form @submit.prevent="submitCode">
                    <input id="codeField" v-model="eventCode" type="text" placeholder="Inserisci il codice evento..."><br>
                    <button type="submit" id="submitButton">Pubblica evento</button>
                </form>
            </div>
        </div>
        </div>
        <div v-else>
        <h1>Log in!</h1>
        <p>per accedere a questa sezione, per favore registrati. è semplice! clicca qui in alto a sinistra sull'icona dell'utente e premi il tasto registrati</p>
    </div>
    </main>
</template>

<script setup>
    import { useUserStore } from '@/stores/user';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    const user = useUserStore();
    const userState = user.isLogged;
    const router = useRouter();

    const eventCode = defineModel('eventCode');
    
    async function submitCode(){
        try{
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/eventCodes/validate-code`,
                {"code": eventCode.value}, {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                });

            user.eventCode = eventCode.value;
            alert("the code has been validated! redirecting...");
            router.push({ path: `/publish/${eventCode.value}`})

        } catch (error){
            alert("validation failed. Please try again.");
            console.log(error);
            router.go();
        }
    }

    function clearCookies(){
        // gets the token cookie and sets it to expire in 1970 (i. e. instantly)
        document.cookie = "token" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //removes the user info from LocalStorage
        user.clearUser();
    }
</script>

<style scoped>
    main{
        background-color: var(--dark-main);
        color: var(--light-main);
    }

    .wrap{
        display: flex;
        flex-direction: row;
    }

    .col{
        margin: 2rem;
    }

    a, a:visited, a:hover, a:active {
        color: #B8B5B5;
    }

    .danger{
        color: #B64848;
        text-decoration: none;
    }

    .minor{
        color: #A7A4A4;
        margin-top: 1rem;
    }
    
    #header{
        margin-left: 3rem;
        margin-top: 1rem;
        font-size: 50px;
    }

    #col1{
        width: 33%;
        flex-grow: 1;
        flex-shrink: 0;
        margin-left: 3rem;
    }

    #col1 > h2,h3{
        margin-bottom: 2rem;
    }

    #col2{
        flex-grow: 2;
        text-align: center;
    }

    form{
        margin-top: 2rem;
    }

    form > input,button{
        margin-bottom: 1rem;
    }

    #codeField{
        width: 80%;
        height: 2.7rem;
        text-align: center;
        background-color: var(--light-main);
        color: var(--dark-main);
        border-radius: 20px;
        border: 2px solid #A7A4A4;
        font-family: var(--main-font);
        font-weight: 700;
    }

    #submitButton{
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