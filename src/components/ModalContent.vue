<template>
    <div class="modal-content">
        <div class="modal-inner">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>

export default {
    methods: {
        close(data){
            this.$emit('close', data);
        }
    }
}
</script>

<style>

</style>