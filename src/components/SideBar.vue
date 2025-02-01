<template>
    <aside>
        <div class="icons">
            <span
                @click="routerSwitch(0)"
                class="material-symbols-outlined"
                :class="{ colored: loginActive }"
            >
                account_circle
            </span>
            <span 
                v-for="(icon, index) in iconNames" :key="index"
                @click="componentSwitch(icon.pos, icon.emit)"
                class="material-symbols-outlined"
                :class="{ colored: isActive[index + 1] }"
            >
                {{ icon.name }}
            </span>
        </div>
        <div class="bottom-icons">
            <span
                @click="routerSwitch(1)"
                class="material-symbols-outlined"
                :class="{ colored: settingsActive }"
            >
                settings
            </span>
        </div>
    </aside>
</template>

<script setup>

    import router from '@/router';
    import { ref } from 'vue';
    let prevEvent = 'nullEmit'; //used as a type of null object, "an object with no referenced value or with defined neutral behavior"
    const iconNames = [
        {
            name: 'search', //name of the icon to display
            pos: 1, //position of the icon in the sidebar, top to bottom (pos 0 is the login icon)
            emit: 'searchBar' //name of the actual emit that is sent to the other components
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

    const emit = defineEmits(['searchBar', 'hallTab', 'savedTab', 'friendsTab', 'nullEmit']);
    const isActive = ref([]); //array with the state of all of the icons
    const settingsActive = ref(false);
    const loginActive = ref(false);

    //initializes all icons to be inactive on startup
    for (let i = 0; i <= iconNames.length; i++) {
        isActive.value.push(false);
    }

    //function used to mount auxiliary components on top of the map
    const componentSwitch = (index, event) => {

        //sets all icons to inactive
        for (let i = 0; i <= iconNames.length; i++) {
            if (i != index) {
                isActive.value[i] = false;
            }
        }

        //only sets selected icon to active
        settingsActive.value = false;
        loginActive.value = false;
        isActive.value[index] = !isActive.value[index];

        //sends the event associated to the icon to all other components
        emit(event);

        //if the component has changed, unmount the previous one
        if (prevEvent != event) {
            emit(prevEvent);
            prevEvent = event;
        } else prevEvent = "nullEmit";

        //sends user back to the map if the icon isn't the login or the settings page
        if (index > 0 && index < 5) {
            router.replace({ path: '/' });
        }
    }

    //function to navigate to a new page instead of mounting a component
    const routerSwitch = (type) => {
        //turns off any previous component
        emit(prevEvent);
        prevEvent = 'nullEmit';

        //sets all the icons to inactive
        for (let i = 1; i <= iconNames.length; i++) {
            isActive.value[i] = false;
        }

        //change the router page
        if (type === 0) {
            navigateTo(loginActive, '/user');
        } else if (type === 1) {
            navigateTo(settingsActive, '/settings');
        }


    }

    const navigateTo = (reference, newPath) => {
        if (reference.value) {
            //user wants to go back to the map: reset everything
            reference.value = !reference.value;
            router.replace({ path: '/' });
        } else {
            //user wants to change the page
            reference.value = true;
            router.push({ path: newPath });
        }
    }

</script>

<style scoped>
    aside {
        position: sticky;
        top: 0;
        width: calc(2rem + 32px);
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--dark-main);
        color: var(--light-main);
        padding: 1rem;
    }

    .colored {
        color: var(--accent-main);
    }

    .icons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 2rem;
        padding: 0.5rem 0;
    }

    .material-symbols-outlined {
        font-size: 2rem;
        margin-bottom: 3rem;
        user-select: none;
    }

    .bottom-icons {
        margin-top: auto;
    }

    .bottom-icons>.material-symbols-outlined {
        padding-bottom: 1.5rem;
    }

    .LinkStyle,
    .LinkStyle:visited,
    .LinkStyle:hover,
    .LinkStyle:active {
        color: inherit;
    }
</style>
