<template>
    <aside>
        <div class="icons">
            <span class="material-symbols-outlined">
                account_circle
            </span>
            <span class="material-symbols-outlined">
                search
            </span>
            <span class="material-symbols-outlined">
                menu
            </span>
            <span class="material-symbols-outlined">
                star
            </span>
            <span class="material-symbols-outlined">
                group
            </span>
        </div>
        <div class="bottom-icons">
            <span class="material-symbols-outlined">
                settings
            </span>
        </div>
    </aside>
</template>

<script setup>

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

