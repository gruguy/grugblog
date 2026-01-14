# Vue 3 + Vite 项目 SSR 迁移方案

本方案将指导你将现有的 Vue 3 + Vite + TypeScript + Pinia + Vue Router 项目转换为服务端渲染 (SSR) 项目，以实现 SEO 优化。

## 1. 安装必要依赖

```bash
npm install @vitejs/plugin-vue @vitejs/plugin-vue-jsx vite-plugin-ssr vue-router@4 pinia@2
```

## 2. 修改项目结构

### 2.1 创建 SSR 相关目录和文件

```
frontend/
├── src/
│   ├── entry-client.ts    # 客户端入口
│   ├── entry-server.ts    # 服务端入口
│   ├── app.ts             # 应用创建逻辑
│   ├── vite-env.d.ts
│   ├── ... (现有文件)
├── server/
│   └── index.ts           # SSR 服务器
├── vite.config.ts         # 修改 Vite 配置
├── package.json           # 修改脚本
└── tsconfig.json          # 修改 TypeScript 配置
```

### 2.2 实现应用创建逻辑 (app.ts)

```typescript
// src/app.ts
import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import { createRouter } from "./router";
import App from "./App.vue";
import "./styles/main.css";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const router = createRouter();

  app.use(pinia);
  app.use(router);

  return {
    app,
    router,
    pinia,
  };
}
```

### 2.3 实现客户端入口 (entry-client.ts)

```typescript
// src/entry-client.ts
import { createApp } from "./app";

const { app, router } = createApp();

// 等待路由准备就绪
router.isReady().then(() => {
  app.mount("#app");
});
```

### 2.4 实现服务端入口 (entry-server.ts)

```typescript
// src/entry-server.ts
import type { RenderContext } from "vite-plugin-ssr";
import { createApp } from "./app";

export async function renderPage(context: RenderContext) {
  const { app, router, pinia } = createApp();

  // 设置当前路由
  const url = context.url;
  router.push(url);
  await router.isReady();

  // 渲染应用
  const appHtml = await app.renderToString();

  // 获取状态，用于客户端水合
  const state = pinia.state.value;

  return {
    appHtml,
    pageContext: {
      state,
    },
  };
}
```

### 2.5 修改路由配置

```typescript
// src/router/index.ts
import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
} from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  // 保持现有路由配置不变
];

export function createRouter() {
  // SSR 环境下使用内存历史，客户端使用浏览器历史
  const history = import.meta.env.SSR
    ? createMemoryHistory()
    : createWebHistory();

  return _createRouter({
    history,
    routes,
  });
}
```

### 2.6 修改 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vitePluginSsr } from "vite-plugin-ssr";

export default defineConfig({
  plugins: [vue(), vitePluginSsr()],
  // 其他配置保持不变
});
```

### 2.7 创建 SSR 服务器

```typescript
// server/index.ts
import express from "express";
import { renderPage } from "vite-plugin-ssr/express";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const root = path.resolve(process.cwd(), "./frontend");

async function startServer() {
  const app = express();

  if (isProduction) {
    // 生产环境：提供静态文件
    app.use(express.static(path.join(root, "dist/client")));
  } else {
    // 开发环境：使用 Vite 中间件
    const vite = await import("vite");
    const viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    });
    app.use(viteDevServer.middlewares);
  }

  // 使用 vite-plugin-ssr 渲染页面
  app.get("*", async (req, res, next) => {
    try {
      const pageContext = {
        url: req.originalUrl,
      };
      const result = await renderPage(pageContext);
      if (result.nothingRendered) return next();
      res.send(result.renderResult);
    } catch (error) {
      next(error);
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
```

### 2.8 修改 package.json

```json
{
  "scripts": {
    "dev": "node --experimental-vm-modules server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "vite build --ssr src/entry-server.ts",
    "preview": "npm run build && NODE_ENV=production node server/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2"
    // 其他依赖保持不变
  }
}
```

## 3. 组件和逻辑适配

### 3.1 处理浏览器 API

在 SSR 环境中，浏览器 API（如 window、document、localStorage 等）不可用。你需要确保这些 API 只在客户端使用：

```vue
<script setup lang="ts">
import { onMounted } from "vue";

// 只在客户端执行
onMounted(() => {
  // 这里可以安全地使用浏览器 API
  console.log(window.location.href);
});
</script>
```

### 3.2 处理全局状态

确保状态管理（Pinia）在 SSR 环境中正确初始化和水合：

```typescript
// src/app.ts - 可选：添加 Pinia SSR 插件
import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import { createRouter } from "./router";
import App from "./App.vue";
import "./styles/main.css";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const router = createRouter();

  app.use(pinia);
  app.use(router);

  return {
    app,
    router,
    pinia,
  };
}
```

### 3.3 处理异步数据

对于需要在服务端获取数据的页面，使用 `async setup` 或 `onBeforeRouteEnter` 钩子：

```vue
<script setup lang="ts">
import { useContentStore } from "../stores/contentStore";
import { onBeforeRouteEnter } from "vue-router";

const contentStore = useContentStore();

// 预加载数据
onBeforeRouteEnter(async (to, from, next) => {
  await contentStore.fetchArticleList();
  next();
});
</script>
```

## 4. 创建 HTML 模板

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title || '个人博客' }}</title>
    <meta name="description" content="{{ description || '个人博客网站' }}" />
    <meta name="keywords" content="{{ keywords || '博客,个人博客' }}" />
  </head>
  <body>
    <div id="app"><!--app-html--></div>
    <script type="module" src="/src/entry-client.ts"></script>
    <!--script-state-->
  </body>
</html>
```

## 5. 测试和部署

### 5.1 开发环境测试

```bash
npm run dev
```

### 5.2 生产环境构建和测试

```bash
npm run build
npm run preview
```

### 5.3 部署

将构建后的 `dist` 目录和 `server/index.js` 部署到服务器上，并使用 Node.js 运行服务器。

## 6. SEO 优化建议

1. **添加元标签**：为每个页面添加独特的 title、description 和 keywords
2. **添加结构化数据**：使用 JSON-LD 格式添加结构化数据
3. **优化页面加载速度**：使用 CDN、压缩资源、懒加载等
4. **添加 sitemap.xml**：生成网站地图并提交给搜索引擎
5. **添加 robots.txt**：指导搜索引擎爬虫
6. **优化 URL 结构**：使用语义化的 URL

## 7. 注意事项

1. SSR 会增加服务器的负载，需要确保服务器有足够的资源
2. 某些第三方库可能不支持 SSR，需要进行适配
3. 静态资源的处理需要特别注意，确保在服务端和客户端都能正确访问
4. 状态管理在 SSR 环境中需要特别处理，确保客户端和服务端状态一致

## 8. 替代方案：使用 Nuxt.js

如果你希望更快速地实现 SSR，可以考虑迁移到 Nuxt.js，这是一个基于 Vue 3 的全栈框架，内置了 SSR 支持。

### 迁移到 Nuxt.js 的步骤

1. 安装 Nuxt.js

   ```bash
   npm init nuxt-app@latest new-project
   ```

2. 将现有代码迁移到 Nuxt.js 项目结构中
3. 适配路由、组件和逻辑
4. 部署 Nuxt.js 项目

## 总结

将 Vue 3 + Vite 项目转换为 SSR 项目需要进行一系列的配置和代码调整，但这将大大提升网站的 SEO 性能。你可以根据项目的实际情况选择使用 Vite SSR 方案或迁移到 Nuxt.js。

如果你对某个步骤有疑问，或者需要更详细的指导，请随时告诉我。
