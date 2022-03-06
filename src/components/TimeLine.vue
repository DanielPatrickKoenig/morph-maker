<template>
    <div class="time-line">
        <div 
            v-for="(frame, i) in frameCount"
            :key="`frame-${i}`"
            class="frame"
        >
            <slot :name="i+1">
                <div class="empty-frame">

                </div>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        frameCount: {
            type: Number,
            required: true,
        }
    }
}
</script>

<style>

</style>