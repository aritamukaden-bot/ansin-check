<script setup lang="ts">
defineProps<{
  msg?: string
}>()
</script>

<template>
  <div class="box">
    <h2 class="green">{{ msg }}</h2>
  </div>
</template>