<template>
    <ModalContent>
        <label><span>Name</span><input v-model="name" type="text" /></label>
        <button @click="close">Cancel</button>
        <button @click="exportFrames()">Ok</button>
    </ModalContent>
</template>

<script>
import ModalContent from './ModalContent.vue';
export default {
    components:{
        ModalContent
    },
    data(){
        return{
            name: 'morph'
        }
    },
    methods:{
        exportFrames(){
            this.$emit('export-frames', { name: this.name });
            this.close();
        },
        close(){
            this.$emit('close');
        }
    }
}
</script>

<style>

</style>