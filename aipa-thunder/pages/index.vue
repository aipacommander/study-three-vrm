<template>
    <canvas ref="canvasRef" style="width:640px;height:480px;"></canvas>
</template>
<script setup lang="ts">
import { vrmLoader } from '~~/lib/vrm'
import { onMounted, ref } from 'vue'

const canvasRef = ref()
onMounted(() => {
    vrmLoader(canvasRef)
})
</script>