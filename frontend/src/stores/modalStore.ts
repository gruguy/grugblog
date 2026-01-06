import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const showLoginModal = ref<boolean>(false);
  const showRegisterModal = ref<boolean>(false);

  // 显示登录弹窗
  const openLoginModal = () => {
    showLoginModal.value = true;
    showRegisterModal.value = false;
  };

  // 显示注册弹窗
  const openRegisterModal = () => {
    showRegisterModal.value = true;
    showLoginModal.value = false;
  };

  // 关闭所有弹窗
  const closeAllModals = () => {
    showLoginModal.value = false;
    showRegisterModal.value = false;
  };

  // 切换弹窗类型
  const toggleModal = (type: "login" | "register") => {
    if (type === "login") {
      showRegisterModal.value = false;
      setTimeout(() => {
        showLoginModal.value = true;
      }, 100);
    } else {
      showLoginModal.value = false;
      setTimeout(() => {
        showRegisterModal.value = true;
      }, 100);
    }
  };

  return {
    showLoginModal,
    showRegisterModal,
    openLoginModal,
    openRegisterModal,
    closeAllModals,
    toggleModal,
  };
});
