<script setup>
import { ref, watch, nextTick } from "vue";
import Sortable from "sortablejs";
import Box from "./components/box.vue";
import Variable from "./components/variable.vue";

const items = ref([]);
const handleUpdateItems = (newItems) => {
  items.value = newItems;
};

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleAlert = (msg) => {
  alert(msg);
};

const menuListRef=ref(null);
let sortableInstance=null;

const initSortable=()=>{
  if (!menuListRef.value)return;
sortableInstance= new Sortable(menuListRef.value,{
  animation: 150, // 動く時のアニメーション（ミリ秒）
    handle: ".drag-handle",
    onEnd: (evt) => {
      const movedItem = items.value.splice(evt.oldIndex, 1)[0];
      items.value.splice(evt.newIndex, 0, movedItem);
    },
})
}


watch(isMenuOpen,async(open)=>{
  if(open){
  await nextTick();
  initSortable();
  }else{
    if(sortableInstance){
      sortableInstance.destroy();
    }
  }


});
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
        <p>チェック項目追加</p>
        <li>          <Variable @update-items="handleUpdateItems" /></li>
      </ul>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc;" />
      
      <h3>並び替え</h3>
      <ul ref="menuListRef" class="sortable-list">
        <li v-for="item in items" :key="item" class="sortable-item">
          <span class="drag-handle">☰</span> <span class="item-text">{{ item }}</span>
        </li>
      </ul>
    </div>
    <h1>戸締まり・火の元チェック</h1>
    <div class="boxspace">
    
      <Box v-for="item in items" :key="item" :msg="item" />
    </div>
  </div>
</template>
<style>
/* --- 既存のスタイルはそのまま --- */
.circle-btn {
  position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%;
  background-color: #4fc08d; color: white; border: none; font-size: 20px; cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 100;
}
.floating-menu {
  position: fixed; top: 80px; right: 20px; background: white; color: #2c3e50;
  border: 1px solid #ccc; padding: 15px; border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 99; max-height: 80vh; overflow-y: auto;
}
.floating-menu ul { list-style: none; padding: 0; margin: 0; }
.floating-menu li { margin: 10px 0; }
.container { display: grid; align-content: start; min-height: 100vh; padding: 20px; }

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
</style>