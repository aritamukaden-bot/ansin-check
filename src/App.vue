<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import Sortable from "sortablejs";
import Box from "./components/box.vue";
import Variable from "./components/variable.vue";

// 1. ローカルストレージ用のキー名を決める
const STORAGE_KEY = "lock-check-items";

const VISIT_KEY = "lock-check-first-visit";
// 2. 初期化：ローカルストレージにデータがあればそれを使い、なければ空の配列 [] を使う
const savedItems = localStorage.getItem(STORAGE_KEY);
const items = ref(savedItems ? JSON.parse(savedItems) : []);

const showWelcomeNotice = ref(false);
// 3. items の中身を監視（watch）し、変更があったら自動でローカルストレージに保存する
watch(
  items,
  (newItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  },
  { deep: true }, // 💡重要：配列の中身の追加・削除・並び替えを検知するために deep: true が必要です
);

onMounted(() => {
  const hasVisited = localStorage.getItem(VISIT_KEY);
  if (!hasVisited) {
    // 初めての訪問の場合
    showWelcomeNotice.value = true;
    // メニューを自動的に開いて設定を見せる
    isMenuOpen.value = true;
    isHelpOpen.value = true; // 最初からヘルプを開いた状態にする

    // 訪問済みフラグを保存
    localStorage.setItem(VISIT_KEY, "true");
  }
});

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
  if (isMenuOpen.value) {
    showWelcomeNotice.value = false;
  }
};

const isHelpOpen = ref(false);

const resetCounter = ref(0);

const boxResetCounter = ref(0);

// すべてのチェックを一気に外す関数を追加
const clearAllChecks = () => {
  boxResetCounter.value++;
  // ログにもクリアしたことを記録したい場合は以下を追加
  const time = new Date().toLocaleTimeString();
  logs.value.unshift(`${time} - [すべてのチェック] が外されました`);
};

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
    <div v-if="showWelcomeNotice" class="welcome-badge">
      まずはここから項目を追加しましょう！ ➔
    </div>

    <button class="circle-btn" @click="toggleMenu">⚙️</button>

    <div class="floating-menu" :class="{ 'is-open': isMenuOpen }">
      <div v-if="isHelpOpen" class="help-content">
        <button class="back-btn" @click="isHelpOpen = false">
          ← メニューに戻る
        </button>
        <h3>🔰 つかいかた</h3>
        <p>
          このアプリは、お出かけ前の「戸締まり」や「火の元」を忘れないようにチェックするツールです。
        </p>

        <h4>1. 項目を追加する</h4>
        <p>
          メニュー内の「チェック項目追加」から、あなたが毎日チェックしたい場所（例：玄関の鍵、ガスの元栓、エアコンなど）を入力して追加してください。
        </p>

        <h4>2. 並び替える・削除する</h4>
        <p>
          「並び替え」エリアの ☰
          をドラッグすると順番を変えられます。いらなくなった項目は ✕
          で消去できます。
        </p>

        <h4>3. 毎日チェックする</h4>
        <p>
          設定が終わったらメニューを閉じます。画面に大きなボタンができるので、確認した場所をタップしてチェックしていきましょう！
        </p>
        <hr style="margin: 15px 0; border: 0; border-top: 1px dashed #ccc" />
      </div>

      <div v-else>
        <h3>メニュー</h3>
        <ul>
          <li v-if="items.length > 0">
            <button @click="clearAllChecks" class="menu-btn clear-all">
              すべてのチェックを外す
            </button>
          </li>
          <li>
            <button @click="resetdata" class="menu-btn reset">
              データリセット
            </button>
          </li>
          <li>
            <button @click="isHelpOpen = true" class="menu-btn">
              使い方ヘルプを見る
            </button>
          </li>
          <p class="menu-title">➕ チェック項目追加</p>
          <li>
            <Variable :key="resetCounter" @update-items="handleUpdateItems" />
          </li>
        </ul>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc" />

        <h3>並び替え</h3>
        <ul ref="menuListRef" class="sortable-list">
          <li v-for="(item, index) in items" :key="item" class="sortable-item">
            <span class="drag-handle">☰</span>
            <span class="item-text">{{ item }}</span>
            <button class="delete-btn" @click="handleRemoveItem(index)">
              ✕
            </button>
          </li>
        </ul>

        <div v-if="logs.length > 0" class="log-container">
          <h3>操作ログ</h3>
          <ul>
            <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
          </ul>
        </div>
      </div>
    </div>

    <h1>戸締まり・火の元チェック</h1>
    <div
      class="boxspace"
      :class="
        items.length >= 5 ? 'box-count-5plus' : `box-count-${items.length}`
      "
    >
      <Box
        v-for="(item, index) in items"
        :key="item + boxResetCounter"
        :msg="item"
        @checked="handleBoxClick"
        @remove="handleRemoveItem(index)"
      />
      <div v-if="items.length === 0" class="empty-state">
        <p>現在チェック項目がありません。</p>
        <p>右上の ⚙️ ボタンから項目を追加してください！</p>
      </div>
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
.box-count-4 {
  grid-template-columns: 1fr !important;
  grid-template-rows: repeat(4, 1fr) !important;
}
/* 💡 grid-auto-rows を max-content に修正 */
.box-count-5plus {
  grid-template-columns: repeat(2, 1fr) !important;
  grid-auto-rows: max-content !important;
}

/* 💡 height: auto !important; を追加して縦の潰れを防ぐ */
.box-count-5plus > * {
  min-height: 120px; /* ボタンが潰れないように最低限の高さを確保 */
  height: auto !important;
}

/* 💡 height: 100% から auto !important に修正 */
.boxspace > * {
  width: 100% !important;
  height: auto !important;
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
  z-index: 101;
}
.floating-menu {
  position: fixed;
  top: 0;
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

/* 並び替えリスト用のスタイル */
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

/* 新しく追加するスタイル */
.welcome-badge {
  position: fixed;
  top: 25px;
  right: 85px; /* ⚙️ボタンの左側に配置 */
  background-color: #ff9800;
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 102;
  animation: bounce 2s infinite; /* ピコピコ動かすアニメーション */
}

/* 吹き出しの三角矢印 */
.welcome-badge::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -6px;
  margin-top: -6px;
  border-width: 6px 0 6px 6px;
  border-style: solid;
  border-color: transparent transparent transparent #ff9800;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(0);
  }
  40% {
    transform: translateX(-8px);
  }
  60% {
    transform: translateX(-4px);
  }
}

.help-content h4 {
  margin: 15px 0 5px 0;
  color: #4fc08d;
}
.help-content p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 10px 0;
}
.back-btn {
  background: #eee;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
}
.empty-state {
  text-align: center;
  color: #7f8c8d;
  padding-top: 40px;
  font-size: 16px;
  grid-column: 1 / -1;
}
.menu-btn {
  width: 100%;
  padding: 8px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}
.menu-btn.reset {
  background: #fff0f0;
  border-color: #fcc;
  color: #c0392b;
}
.menu-title {
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
}

.menu-btn.clear-all {
  background: #e8f4fd;
  border-color: #bbeeec;
  color: #2980b9;
  font-weight: bold;
}
.menu-btn.clear-all:active {
  background: #d4ebfd;
}

/* スマホ用の位置微調整 */
@media screen and (max-width: 768px) {
  .welcome-badge {
    top: 20px;
    right: 70px;
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* スマホ用レスポンシブスタイルまとめ */
@media screen and (max-width: 768px) {
  /* 1. 上下の余白と隙間の調整 */
  .boxspace {
    padding: 70px 0 20px 0 !important; /* タイトルと被らないよう上を少し広めに */
    gap: 12px !important;
  }

  /* 2. スマホかつ5つ以上のときの設定 */
  .box-count-5plus :deep(.text) {
    font-size: 20px !important; /* 文字を適度に小さく */
    display: inline-block !important; /* 改行を正常に効かせる */
    white-space: normal !important; /* 自動改行を許可 */
    word-break: break-all !important; /* 端で折る */
    line-height: 1.3 !important;
  }

  /* 3. 箱の高さが潰れて重なるのを絶対に防ぐ指定 */
  .box-count-5plus > * {
    min-height: 90px !important; /* 最低限の押しやすさを確保 */
    height: auto !important; /* 文字が多いときは自動で下に伸びるようにする */
  }

  /* 4. 右上のメニューボタンの調整 */
  .circle-btn {
    top: 15px;
    right: 15px;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  /* 5. スマホではメニューを画面横幅いっぱいに */
  .floating-menu {
    width: 100vw;
    right: -100vw;
    padding-top: 70px;
  }
  .floating-menu.is-open {
    right: 0;
  }

  /* 6. タイトル文字の調整 */
  h1 {
    font-size: 1.15rem !important;
    letter-spacing: -0.5px;
    margin-top: 0;
    margin-bottom: 5px;
    padding-right: 55px;
    white-space: nowrap;
  }
}
</style>
