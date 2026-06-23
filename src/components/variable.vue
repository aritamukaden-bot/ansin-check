<script setup >
import { ref } from 'vue'

const emit = defineEmits(['update-items'])


const tempInput = ref('')

const savedVariable = ref([])

const handleClick = () => {
  if (tempInput.value.trim() === '') return // 空っぽなら追加しない
  
  savedVariable.value.push(tempInput.value)
  emit('update-items', savedVariable.value)
  tempInput.value = '' // 入力欄をリセット
}
</script>


<template>
  <div style="border: 2px solid #42b883; padding: 20px; margin: 10px 0; border-radius: 8px;">
    <p>チェックしたい項目を入力してください：</p>
    <input type="text" v-model="tempInput" placeholder="例：玄関の鍵" style="padding: 5px; font-size: 16px;">
    <button @click="handleClick" style="padding: 5px 10px; margin-left: 5px; cursor: pointer;">
      追加する
    </button>
  </div>
</template>