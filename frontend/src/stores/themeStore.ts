import { defineStore } from "pinia";
import { ref } from "vue";
import { useInterval } from "@vueuse/core";
import dayjs from "dayjs";
import type { ThemeConfig } from "@/types/theme";

export const useThemeStore = defineStore("theme", () => {
  // 状态
  const currentTheme = ref<string>("light");
  const customThemes = ref<ThemeConfig[]>([]);
  const themeSwitchTime = ref<string | null>(null);
  const isAutoSwitchEnabled = ref<boolean>(false);

  // 主题预设
  const themePresets: Record<string, ThemeConfig> = {
    light: {
      name: "浅色",
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#ffffff",
      foreground: "#1f2937",
    },
    dark: {
      name: "深色",
      primary: "#60a5fa",
      secondary: "#a78bfa",
      background: "#111827",
      foreground: "#f9fafb",
    },
    cyberpunk: {
      name: "赛博朋克",
      primary: "#00ff41",
      secondary: "#ff0080",
      background: "#0a0e27",
      foreground: "#00ff41",
    },
  };

  // 初始化主题
  const initTheme = () => {
    // 从本地存储加载主题配置
    const savedTheme = localStorage.getItem("theme");
    const savedSwitchTime = localStorage.getItem("themeSwitchTime");
    const savedAutoSwitch = localStorage.getItem("isAutoSwitchEnabled");

    if (savedTheme) {
      currentTheme.value = savedTheme;
      applyTheme(savedTheme);
    }

    if (savedSwitchTime) {
      themeSwitchTime.value = savedSwitchTime;
    }

    if (savedAutoSwitch === "true") {
      isAutoSwitchEnabled.value = true;
      startAutoSwitch();
    }
  };

  // 应用主题
  const applyTheme = (themeName: string) => {
    const theme =
      themePresets[themeName] ||
      customThemes.value.find((t) => t.name === themeName);

    if (!theme) return;

    const root = document.documentElement;
    root.setAttribute("data-theme", themeName);
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-background", theme.background);
    root.style.setProperty("--color-foreground", theme.foreground);

    currentTheme.value = themeName;
    localStorage.setItem("theme", themeName);
  };

  // 切换主题
  const switchTheme = (themeName: string) => {
    applyTheme(themeName);
  };

  // 添加自定义主题
  const addCustomTheme = (theme: ThemeConfig) => {
    customThemes.value.push(theme);
    localStorage.setItem("customThemes", JSON.stringify(customThemes.value));
  };

  // 设置定时切换
  const setThemeSwitchTime = (time: string | null) => {
    themeSwitchTime.value = time;
    localStorage.setItem("themeSwitchTime", time || "");

    if (time) {
      isAutoSwitchEnabled.value = true;
      startAutoSwitch();
    } else {
      isAutoSwitchEnabled.value = false;
    }
  };

  // 启动自动切换
  const startAutoSwitch = () => {
    if (!themeSwitchTime.value) return;

    // useInterval的正确用法：第一个参数是时间间隔，第二个参数是选项对象，包含回调函数
    useInterval(60000, {
      callback: () => {
        const now = dayjs();
        const switchTime = dayjs(themeSwitchTime.value, "HH:mm");

        // 检查是否到达切换时间（允许1分钟误差）
        if (Math.abs(now.diff(switchTime, "minute")) < 1) {
          // 在浅色和深色之间切换
          const nextTheme = currentTheme.value === "light" ? "dark" : "light";
          switchTheme(nextTheme);
        }
      },
    });
  };

  // 获取所有可用主题
  const getAvailableThemes = () => {
    return [...Object.values(themePresets), ...customThemes.value];
  };

  return {
    currentTheme,
    customThemes,
    themeSwitchTime,
    isAutoSwitchEnabled,
    themePresets,
    initTheme,
    switchTheme,
    addCustomTheme,
    setThemeSwitchTime,
    getAvailableThemes,
  };
});
