export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true, // 启用 SSR
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/sitemap"],
  runtimeConfig: {
    public: {
      apiBase: (import.meta.env.NUXT_PUBLIC_API_BASE as string) || "/api",
      baseUrl:
        (import.meta.env.NUXT_PUBLIC_BASE_URL as string) ||
        "http://localhost:3005",
    },
  },
  css: ["./src/styles/main.css"],
  // 配置开发服务器端口
  devServer: {
    port: 3005,
  },
  // 性能优化配置
  vite: {
    build: {
      cssCodeSplit: true,
      sourcemap: false,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "vue-router"],
            "ui-vendor": ["@nuxtjs/tailwindcss"],
            "store-vendor": ["pinia", "@pinia/nuxt"],
          },
        },
      },
    },
  },
  // 图片优化
  image: {
    provider: "netlify",
    netlify: {
      baseURL: "/",
    },
  },

  // 配置SEO头部信息
  app: {
    head: {
      title: {
        template: "%s - Grug Blog",
        default: "Grug Blog - 分享技术与生活",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Grug Blog 是一个分享技术与生活的博客平台，专注于前端开发、后端开发、人工智能等领域。",
        },
        {
          name: "keywords",
          content: "技术博客,前端开发,后端开发,人工智能,编程,分享",
        },
        { name: "author", content: "Grug" },
        { name: "robots", content: "index, follow" },

        // Open Graph 标签
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Grug Blog - 分享技术与生活" },
        {
          property: "og:description",
          content:
            "Grug Blog 是一个分享技术与生活的博客平台，专注于前端开发、后端开发、人工智能等领域。",
        },
        { property: "og:url", content: "http://localhost:3005" },
        { property: "og:site_name", content: "Grug Blog" },
        { property: "og:image", content: "http://localhost:3005/og-image.jpg" },

        // Twitter 卡片标签
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Grug Blog - 分享技术与生活" },
        {
          name: "twitter:description",
          content:
            "Grug Blog 是一个分享技术与生活的博客平台，专注于前端开发、后端开发、人工智能等领域。",
        },
        {
          name: "twitter:image",
          content: "http://localhost:3005/og-image.jpg",
        },
        { name: "twitter:site", content: "@grugblog" },

        // 其他SEO相关标签
        { name: "theme-color", content: "#3b82f6" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "http://localhost:3005" },
      ],
    },
  },

  // 配置代理，将 API 请求转发到后端服务器
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3000/api",
        changeOrigin: true,
        // 不删除/api前缀，因为后端接口需要/api前缀
      },
    },
    // 生产环境代理（部署时生效，可选）
    routeRules: {
      "/api/**": { proxy: "http://localhost:3000/api/**" },
    },
  },

  // 配置sitemap
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3005",
    gzip: true,
    exclude: ["/admin/**", "/login", "/register"],
    routes: async () => {
      // 可以在这里添加动态路由，例如文章详情页
      return [];
    },
  },
});
