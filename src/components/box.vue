<script setup>
import { ref } from "vue";

// 親から渡される項目名（msg）を受け取る
const props = defineProps(["msg"]);

const emit = defineEmits(["checked"]);

// 💡 追加ポイント①：このボタンが押されているかを覚える変数（最初は false = 押されてない）
const isChecked = ref(false);

const handleCheckboxChange = () => {
  // チェックが入った（trueになった）ときだけ親に通知する場合
  if (isChecked.value) {
    emit("checked", props.msg);
  }
  // ※もし「チェックを外した時のログ」も取りたい場合は、ifを外して常に emit してもOKです！
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
/* 💡 通常時の Box のデザイン */

.box {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-left: 5px solid #42b883; /* 左側に緑の線をアクセントに */
  padding: 15px;
  margin: 10px 0;
  border-radius: 6px;
  transition: all 0.3s ease; /* 色が滑らかに変わるアニメーション */
}

/* 💡 チェックが入った（.done クラスがついた）ときのデザイン */
.box.done {
  background-color: #f58e5e; /* 薄い緑色に変更 */
  border-color: #c3e6cb;
  border-left-color: #28a745; /* 濃い緑色に */
}

/* その他、見た目を整えるスタイル */
.box-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.checkbox {
  transform: scale(1.4); /* チェックボックスを少し大きく */
  margin-right: 12px;
  cursor: pointer;
}

.text {
  font-size: 18px;
  color: #333;
  user-select: none; /* 文字がダブルクリックで選択されないように */
}
</style>
