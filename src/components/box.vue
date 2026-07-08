<script setup>
import { ref } from "vue";

const props = defineProps(["msg"]);
const emit = defineEmits(["checked"]);
const isChecked = ref(false);

const handleCheckboxChange = () => {
  if (isChecked.value) {
    emit("checked", props.msg);
  }
};
</script>

<template>
  <div class="box" :class="{ done: isChecked }">
    <label class="box-label">
      <input
        type="checkbox"
        v-model="isChecked"
        @change="handleCheckboxChange"
        class="checkbox"
      />
      <span class="text">{{ msg }}</span>
    </label>
  </div>
</template>

<style scoped>
.box {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  transition: all 0.3s ease;

  /* 👇 親のGridから指定されたサイズ（1fr）いっぱいに強制拡大 */
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;

  /* 中身を真ん中に寄せる */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.box.done {
  background-color: #f58e5e;
  border-color: #f58e5e;
}

.box-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100% !important;
  height: 100% !important; /* ラベル領域も縦いっぱいに広げる */
  padding: 20px;
  box-sizing: border-box;
}

.checkbox {
  transform: scale(2); /* チェックボックスもかなり大きめに */
  margin-right: 15px;
  cursor: pointer;
}

.text {
  font-size: 32px; /* 文字もデカくして押しやすく */
  font-weight: bold;
  color: #333;
  user-select: none;

  /* 長文がはみ出さないための設定を追加 */
  display: block; /* 改行の効きを良くする */
  white-space: normal; /* 自動改行を許可 */
  word-break: break-all; /* 枠の右端で綺麗に折る */
  line-height: 1.3; /* 改行されたときに文字が重ならないよう行間を調整 */
}

.box.done .text {
  color: #fff;
}
</style>
