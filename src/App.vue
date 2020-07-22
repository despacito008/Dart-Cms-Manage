<template>
    <div id="app" class="pr">
        <router-view/>
        <global-loading/>
    </div>
</template>
<script>
import globalLoading from '@components/global-loding'
export default {
    components: {
        globalLoading
    }
}
</script>
<style lang="scss">
#app,textarea{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
body,
html,
#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
</style>
