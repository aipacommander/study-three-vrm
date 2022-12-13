<template>
    <div ref="divRef" style="width:640px;height:480px;"></div>
</template>
<script setup lang="ts">
import { vrmLoader } from '~~/lib/vrm'
import { onMounted, ref } from 'vue'

const divRef = ref()
onMounted(() => {
    vrmLoader(divRef)
})
</script>