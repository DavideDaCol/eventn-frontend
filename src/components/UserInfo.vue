<template>
    <main>
        <div class="wrap">
            <h1>Logged user: {{ name }}</h1>
            <h2>Presenze segnate: {{ counter }}</h2>
            <div v-if="admin" class="operatore">
                <h1>Operatore comunale:</h1>
                <button @click="code">Genera codice</button>
                <button @click="openData">Scarica open data</button>
                <h3>Codice evento: {{ generatedCode?generatedCode:"..." }}</h3>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { useUserStore } from '@/stores/user';
    import axios from 'axios';
    import { ref } from 'vue';
    const user = useUserStore();

    const userObject = user.info.user;
    const admin = user.isAdmin;
    const name = userObject.username;
    const counter = userObject.events.length;

    const generatedCode = ref("");

    //TODO: modify API so only admins can call these functions
    async function code(){
        console.log("this would generate a code");
        let codeReq = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/eventCodes/create-code`, {}, {
            withCredentials: true
        });
        console.log(codeReq);
        generatedCode.value = codeReq.data.code;
    }

    const openData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/oc/openData`, {
                responseType: 'blob', // Needed for downloading files
                withCredentials: true
            });

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.csv');
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download CSV:', error);
    }
}

    console.log(user.info);
    

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

    .operatore{
        padding-top: 3rem;
    }
</style>