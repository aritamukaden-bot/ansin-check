<script setup>
import {ref} from 'vue'
import Box from './components/box.vue'
import Variable from './components/variable.vue'

const items = ref([])
const handleUpdateItems=(newItems)=>{
  items.value = newItems
}

</script>
<template>

<h1>
戸締まり・火の元チェック
</h1>
<div class="boxspace">
<h2>ここにあるよ</h2>
<Variable @update-items="handleUpdateItems" />

<Box v-for="item in items" :key="item" :msg="item"/>
</div>
</template>
<style>

</style>