<script setup>
import { ref } from "vue";
import Box from "./components/box.vue";
import Variable from "./components/variable.vue";

const items = ref([]);
const handleUpdateItems = (newItems) => {
  items.value = newItems;
};

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen = !isMenuOpen.value;
};
</script>
<template>
  <div class="container">
    <button class="circle-btn" @click="toggleMenu">⚙️</button>
    <div v-if="isMenuOpen" class="floating-menu">
      <h3>メニュー</h3>
      <ul>
        <li><button @click="alert('機能1')">設定</button></li>
        <li><button @click="alert('機能2')">データリセット</button></li>
        <li><button @click="alert('機能3')">ヘルプ</button></li>
      </ul>
    </div>
    <h1>戸締まり・火の元チェック</h1>
    <div class="boxspace">
      <Variable @update-items="handleUpdateItems" />

      <Box v-for="item in items" :key="item" :msg="item" />
    </div>
  </div>
</template>
<style>
/* 🔵 3. 丸いボタンを右上に固定するCSS */
.circle-btn {
  position: fixed; /* 画面に対して絶対配置 */
  top: 20px; /* 上から20pxの位置 */
  right: 20px; /* 右から20pxの位置 */
  width: 50px; /* 横幅 */
  height: 50px; /* 縦幅を同じにすると正方形に */
  border-radius: 50%; /* ★50%にすると完璧な「丸」になる */
  background-color: #4fc08d; /* ボタンの色（Vueグリーン） */
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* ちょっと影をつけて立体的に */
  z-index: 100; /* 一番手前に表示されるようにする */
}

/* 🔵 4. 飛び出すメニューのCSS */
.floating-menu {
  position: fixed; /* これも画面に対して固定 */
  top: 80px; /* ボタンの下あたりに出るように調整 */
  right: 20px;
  background: white;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 99; /* ボタンの少し下のレイヤー */
}

.floating-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.floating-menu li {
  margin: 10px 0;
}
.container {
  display: grid;
  align-content: start; /* ★これで中身が全部上へギュッと詰まります */
  min-height: 100vh; /* 画面全体の高さを確保する場合（お好みで） */
  padding: 20px; /* 画面の端にくっつきすぎないように余白をプラス */
}
</style>
