<template>
    <ModalContent>
        <label><span></span><input v-model="currentFrame" type="number" /></label>
        <button @click="close">Cancel</button>
        <button @click="editFrame()">Ok</button>
    </ModalContent>
</template>

<script>
import ModalContent from './ModalContent.vue';
export default {
    components:{
        ModalContent
    },
    props: {
        frame: {
            type: Number,
            default: 1,
        },
        index: {
            type: Number,
            default: -1
        }
    },
    data(){
        return {
            currentFrame: this.frame,
            adding: this.index === -1
        }
    },
    methods: {
        editFrame(){
            if(this.adding){
                this.$emit('add-frame', {frame: this.currentFrame});
            }
            else{
                this.$emit('edit-frame', {frame: this.currentFrame, index: this.index});
            }
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