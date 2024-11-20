<template>
    <aside>
        <div class="icons">
            <span v-for="icon in iconNames" @click="bruh(icon.pos)" class="material-symbols-outlined" :class="{colored: isActive[icon.pos]}">
                {{icon.name}}
           </span>
        </div>
        <div class="bottom-icons">
            <span @click="settingHandler()" class="material-symbols-outlined" :class="{colored: settingsActive}">
                settings
            </span>
        </div>
    </aside>
</template>

<script setup>

    import { ref } from 'vue'
    const iconNames = [
        {
            name: 'account_circle',
            pos: 0
        },
        {
            name: 'search',
            pos: 1              
        },
        {
            name: 'menu',
            pos: 2
        },
        {
            name: 'star',
            pos: 3
        },
        {
            name: 'group',
            pos: 4
        }];

    let isActive = ref([]);
    const settingsActive = ref(false);

    for(let i=0; i<iconNames.length; i++){
        isActive.value.push(false);
    }

    console.log("setup is done!");

    const bruh = (index) => {
        for(let i=0; i<iconNames.length; i++){
            isActive.value[i] = false;
        }
        settingsActive.value = false;
        isActive.value[index] = true;
    }

    const settingHandler = () => {
        //workaround to avoid code duplication
        bruh(0);
        isActive.value[0]=false;
        settingsActive.value = true;
    }

</script>

<style scoped>
    aside {
        display: flex;
        flex-direction: column;
        background-color: var(--dark-main);
        color: var(--light-main);
        width: calc(2rem + 32px);
        min-height: 100vh;
        padding: 1rem;
    }

    .colored{
        color: var(--accent-main);
    }

    .icons{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 2rem;
        padding: 0.5rem 0;
    }

    .material-symbols-outlined{
        font-size: 2rem;
        padding-bottom: 3rem;
    }

    .bottom-icons{
        margin-top: auto;
    }

    .bottom-icons > .material-symbols-outlined{
        padding-bottom: 1.5rem;
    }

</style>

