import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa"; // PWAプラグインを読み込み

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      // PWA（スマホアプリ化）の設定を追加
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "あんしんチェック", // スマホで起動した時の正式名称
        short_name: "あんしんチェック", // ホーム画面のアイコンの下に表示される名前
        description: "鍵の閉め忘れや火の元を確認するアプリ",
        theme_color: "#ffffff", // アプリのテーマカラー
        background_color: "#ffffff", // アプリ起動時の背景色
        display: "standalone", // 設定するとURLバーが消えてネイティブアプリのようになります
        icons: [
          {
            src: "pwa-192x192.png", // publicフォルダに置くアイコン画像（サイズ192）
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png", // publicフォルダに置くアイコン画像（サイズ512）
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Android用などで綺麗にマスクされる設定
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
