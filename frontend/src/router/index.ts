import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("@/views/Articles.vue"),
    meta: {
      title: "文章列表",
    },
  },
  {
    path: "/article/:id",
    name: "ArticleDetail",
    component: () => import("@/views/ArticleDetail.vue"),
    meta: {
      title: "文章详情",
    },
  },
  {
    path: "/music",
    name: "Music",
    component: () => import("@/views/Music.vue"),
    meta: {
      title: "音乐馆",
    },
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: () => import("@/views/Gallery.vue"),
    meta: {
      title: "相册",
    },
  },
  {
    path: "/vlog",
    name: "Vlog",
    component: () => import("@/views/Vlog.vue"),
    meta: {
      title: "Vlog",
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue"),
    meta: {
      title: "关于我",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
    meta: {
      title: "注册",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
    meta: {
      title: "个人中心",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      title: "404",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 个人博客` : "个人博客";
  next();
});

export default router;
