<template>
    <aside>
        <div class="icons">
            <span @click="fixedHandler(0)" class="material-symbols-outlined" :class="{colored: loginActive}">
                account_circle
            </span>
            <span @click="sidebarSwitch(1,'searchBar')" class="material-symbols-outlined" :class="{colored: isActive[1]}">
                search
            </span>
            <span @click="sidebarSwitch(2,'hallTab')" class="material-symbols-outlined" :class="{colored: isActive[2]}">
                menu
            </span>
            <span @click="sidebarSwitch(3,'savedTab')" class="material-symbols-outlined" :class="{colored: isActive[3]}">
                star
            </span>
            <span @click="sidebarSwitch(4,'friendsTab')" class="material-symbols-outlined" :class="{colored: isActive[4]}">
                group
            </span>

        </div>
        <div class="bottom-icons">
            <span @click="fixedHandler(1)" class="material-symbols-outlined" :class="{colored: settingsActive}">
                settings 
            </span>
        </div>
    </aside>
</template>

<script setup>

    import router from '@/router';
    import { ref } from 'vue'
    let prevEvent = 'sink';
    const iconNames = [
        {
            name: 'search',
            pos: 1,
            emit: 'searchBar'              
        },
        {
            name: 'menu',
            pos: 2,
            emit: 'hallTab'
        },
        {
            name: 'star',
            pos: 3,
            emit: 'savedTab'
        },
        {
            name: 'group',
            pos: 4,
            emit: 'friendsTab'
        }];

    const emit = defineEmits(['searchBar' , 'hallTab' , 'savedTab', 'friendsTab', 'sink']);
    let isActive = ref([]);
    const settingsActive = ref(false);
    const loginActive = ref(false);

    //initializes all icons to be inactive on startup
    for(let i=0; i<=iconNames.length; i++){
        isActive.value.push(false);
    }

    console.log("setup is done!");

    const sidebarSwitch = (index,event) => {

        //sets all icons to inactive
        for(let i=0; i<=iconNames.length; i++){
            if(i!=index){
                isActive.value[i] = false;
            }
        }

        //only sets selected icon to active
        settingsActive.value = false;
        loginActive.value = false;
        isActive.value[index] = !isActive.value[index];
        emit(event);
        //turns off previous component only if it's different
        if(prevEvent != event){
            emit(prevEvent);
            prevEvent = event;
        }

        //sends user back to the map if the icon isn't the login or the settings page
        if(index > 0 && index < 5){
            router.replace({path: '/'});
        }
    }

    const fixedHandler = (type) => {
        //turns off any previous component
        emit(prevEvent);
        prevEvent = 'sink';
        
        for(let i=1; i<=iconNames.length; i++){
            isActive.value[i] = false;
        }

        if(type === 0){
            changeFixedStatus(loginActive,'/user');
        } else if(type === 1){
            changeFixedStatus(settingsActive,'/settings');
        }
        

    }

    const changeFixedStatus = (reference, newPath) => {
        if(reference.value){
            reference.value = !reference.value;
            router.replace({path: '/'});
        } else {
            reference.value = true;
            console.log(newPath);
            router.push({path: newPath});
        }
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
        margin-bottom: 3rem;
        user-select: none;
    }

    .bottom-icons{
        margin-top: auto;
    }

    .bottom-icons > .material-symbols-outlined{
        padding-bottom: 1.5rem;
    }

    .LinkStyle, .LinkStyle:visited, .LinkStyle:hover, .LinkStyle:active {
        color: inherit;
    }

</style>

