<script setup>
import { ref, watch, nextTick } from "vue";
import Sortable from "sortablejs";
import Box from "./components/box.vue";
import Variable from "./components/variable.vue";

// 1. ローカルストレージ用のキー名を決める
const STORAGE_KEY = "lock-check-items";

// 2. 初期化：ローカルストレージにデータがあればそれを使い、なければ空の配列 [] を使う
const savedItems = localStorage.getItem(STORAGE_KEY);
const items = ref(savedItems ? JSON.parse(savedItems) : []);

// 3. items の中身を監視（watch）し、変更があったら自動でローカルストレージに保存する
watch(
  items,
  (newItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  },
  { deep: true }, // 💡重要：配列の中身の追加・削除・並び替えを検知するために deep: true が必要です
);

const logs = ref([]);
const handleUpdateItems = (newItems) => {
  items.value = newItems;
};

const handleBoxClick = (itemName) => {
  const time = new Date().toLocaleTimeString();
  // unshiftを使うことで、新しいログが一番上に表示されます
  logs.value.unshift(`${time} - [${itemName}] がチェックされました`);
};

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const isHelpOpen = ref(false);

const resetCounter = ref(0);

const resetdata = () => {
  items.value = [];
  resetCounter.value++;
};

const menuListRef = ref(null);
let sortableInstance = null;

const initSortable = () => {
  if (!menuListRef.value) return;
  sortableInstance = new Sortable(menuListRef.value, {
    animation: 150, // 動く時のアニメーション（ミリ秒）
    handle: ".drag-handle",
    onEnd: (evt) => {
      const movedItem = items.value.splice(evt.oldIndex, 1)[0];
      items.value.splice(evt.newIndex, 0, movedItem);
    },
  });
};
//boxを消す
const handleRemoveItem = (index) => {
  items.value.splice(index, 1);
};

watch(isMenuOpen, async (open) => {
  if (open) {
    await nextTick();
    initSortable();
  } else {
    if (sortableInstance) {
      sortableInstance.destroy();
    }
  }
});
</script>
<template>
  <div class="container">
    <button class="circle-btn" @click="toggleMenu">⚙️</button>
    <div class="floating-menu" :class="{ 'is-open': isMenuOpen }">
      <div v-if="isHelpOpen">
        <button @click="isHelpOpen = false">← メニューに戻る</button>
        <h3>ヘルプ</h3>
        <p>ここに使い方の説明文を自由に書きます。</p>
      </div>
      <h3>メニュー</h3>
      <ul>
        <li><button @click="resetdata">データリセット</button></li>
        <li><button @click="isHelpOpen = true">ヘルプ</button></li>
        <p>チェック項目追加</p>
        <li>
          <Variable :key="resetCounter" @update-items="handleUpdateItems" />
        </li>
      </ul>
      <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc" />

      <h3>並び替え</h3>
      <ul ref="menuListRef" class="sortable-list">
        <li v-for="(item, index) in items" :key="item" class="sortable-item">
          <span class="drag-handle">☰</span>
          <span class="item-text">{{ item }}</span>
          <button class="delete-btn" @click="handleRemoveItem(index)">✕</button>
        </li>
      </ul>
      <div v-if="logs.length > 0" class="log-container">
        ✕
        <h3>操作ログ</h3>
        <ul>
          <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
        </ul>
      </div>
    </div>
    <h1>戸締まり・火の元チェック</h1>
    <div class="boxspace" :class="`box-count-${items.length}`">
      <!-- 3. @checked イベントをキャッチできるように変更 -->
      <Box
        v-for="(item, index) in items"
        :key="item"
        :msg="item"
        @checked="handleBoxClick"
        @remove="handleRemoveItem(index)"
      />
    </div>
  </div>
</template>
<style>
.container {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important; /* 画面の高さを強制的に固定 */
  padding: 20px;
  box-sizing: border-box;
}

.boxspace {
  flex-grow: 1 !important; /* 残りの画面を全部使う */
  display: grid !important;
  grid-template-columns: 1fr !important; /* 横は1列 */
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 100px 0 !important;
}

/* 個数に応じて縦幅を等分（1fr）する指定 */
.box-count-1 {
  grid-template-rows: 1fr !important;
}
.box-count-2 {
  grid-template-rows: repeat(2, 1fr) !important;
}
.box-count-3 {
  grid-template-rows: repeat(3, 1fr) !important;
}

.boxspace > * {
  width: 100% !important;
  height: 100% !important; /* 子要素を強制的に縦いっぱいに伸ばす */
  display: block;
}
.circle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4fc08d;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  z-index: 101;
}
.floating-menu {
  position: fixed;
  top: 0;
  right: 0; /* 画面の右端にピッタリつける */
  width: 350px; /* 横幅を決める */
  height: 100vh; /* 高さを画面いっぱいに */
  background: white;
  color: #2c3e50;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15); /* 左側にだけ影をつける */
  z-index: 100;
  padding: 80px 20px 20px 20px; /* ⚙️ボタンと被らないように上の余白を多めにする */
  box-sizing: border-box;
  overflow-y: auto; /* 中身が増えたらスクロールできるように */
  right: -350px; /* 最初は画面の外に隠す */
  transition: right 0.3s ease; /* 右側の位置が変わるときにアニメーションさせる */
}
.floating-menu.is-open {
  right: 0;
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
  align-content: start;
  min-height: 100vh;
  padding: 20px;
}

/* 👇 追加した並び替えリスト用のスタイル */
.sortable-list {
  margin-top: 10px;
}
.sortable-item {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 8px 12px;
  margin-bottom: 6px !important;
  border-radius: 4px;
  cursor: grab;
}
.sortable-item:active {
  cursor: grabbing;
}
.drag-handle {
  margin-right: 10px;
  color: #999;
  font-weight: bold;
  user-select: none;
}
.item-text {
  flex-grow: 1;
}
@media screen and (max-width: 768px) {
  /* 1. スマホだと100pxの余白は広すぎるので、上下の余白を少し縮めて押し込みを防止 */
  .boxspace {
    padding: 60px 0 20px 0 !important;
    gap: 15px; /* 隙間も少し狭くして画面に収まりやすく */
  }

  /* 2. 右上のメニューボタンをスマホでも押しやすいサイズ＆位置に調整 */
  .circle-btn {
    top: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  /* 3. メニューが画面からはみ出さないように、スマホでは横幅いっぱいに広げる */
  .floating-menu {
    top: 70px;
    right: 15px;
    left: 15px; /* 左側にも余白を作って画面幅に合わせる */
    max-height: 75vh;
    padding: 12px;
  }

  /* 4. タイトル文字が大きすぎて2行に崩れるのを防ぐ */
  h1 {
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 10px;
    padding-right: 50px; /* ⚙️ボタンと被らないように右側にスペースを空ける */
  }
}
</style>
