<script setup>
import { ref } from "vue";

// 1. 親から現在の items を受け取れるように props を定義します
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update-items"]);
const tempInput = ref("");

const handleClick = () => {
  if (tempInput.value.trim() === "") return; // 空っぽなら追加しない

  // 2. 親から受け取った既存のデータ（props.items）をコピーして、そこに新しい項目を追加します
  const updatedList = [...props.items, tempInput.value];

  // 3. 新しいリストを親に送る
  emit("update-items", updatedList);

  tempInput.value = ""; // 入力欄をリセット
};
</script>

<template>
  <div
    style="
      border: 2px solid #42b883;
      padding: 20px;
      margin: 10px 0;
      border-radius: 8px;
    "
  >
    <p>チェックしたい項目を入力してください：</p>
    <input
      type="text"
      v-model="tempInput"
      placeholder="例：玄関の鍵"
      style="padding: 5px; font-size: 16px"
    />
    <button
      @click="handleClick"
      style="padding: 5px 10px; margin-left: 5px; cursor: pointer"
    >
      追加する
    </button>
  </div>
</template>
