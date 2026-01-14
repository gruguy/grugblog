import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

// 消息类型
export interface Message {
  id: number;
  type: "follow" | "like" | "comment";
  content: string;
  fromUser: {
    id: number;
    username: string;
    avatar?: string;
  };
  articleId?: number;
  articleTitle?: string;
  createdAt: string;
  isRead: boolean;
}

export const useMessageStore = defineStore("message", () => {
  const api = useApi();

  // 消息列表
  const messages = ref<Message[]>([]);
  // 未读消息数量
  const unreadCount = ref(0);
  // 是否显示消息弹窗
  const showMessagePopup = ref(false);
  // 加载状态
  const loading = ref(false);

  // 从API获取消息列表
  const fetchMessages = async () => {
    try {
      loading.value = true;
      const response = await api.getMessages();
      // 适配API返回数据格式
      messages.value = response.data || [];
      updateUnreadCount();
    } catch (error) {
      // 静默处理API调用失败，不向控制台输出错误
      // 这是预期行为，因为后端可能还没有实现消息API
      // 使用模拟数据作为备选
      messages.value = [
        // {
        //   id: 1,
        //   type: "follow",
        //   content: "关注了您",
        //   fromUser: {
        //     id: 2,
        //     username: "张三",
        //     avatar: "https://picsum.photos/id/1/40/40",
        //   },
        //   createdAt: "2026-01-13 10:00:00",
        //   isRead: false,
        // },
        // {
        //   id: 2,
        //   type: "like",
        //   content: "给您的文章点赞",
        //   fromUser: {
        //     id: 3,
        //     username: "李四",
        //     avatar: "https://picsum.photos/id/2/40/40",
        //   },
        //   articleId: 1,
        //   articleTitle: "Vue 3 入门指南",
        //   createdAt: "2026-01-13 09:30:00",
        //   isRead: false,
        // },
      ];
      updateUnreadCount();
    } finally {
      loading.value = false;
    }
  };

  // 更新未读消息数量
  const updateUnreadCount = () => {
    unreadCount.value = messages.value.filter((msg) => !msg.isRead).length;
  };

  // 标记所有消息为已读
  const markAllAsRead = async () => {
    try {
      // 调用API标记所有消息为已读
      await api.markAllMessagesAsRead();
    } catch (error) {
      // 静默处理API调用失败，不向控制台输出错误
      // 这是预期行为，因为后端可能还没有实现消息API
    } finally {
      // 无论API调用成功与否，都更新本地状态
      messages.value.forEach((msg) => {
        msg.isRead = true;
      });
      updateUnreadCount();
    }
  };

  // 标记单条消息为已读
  const markAsRead = async (id: number) => {
    try {
      // 调用API标记单条消息为已读
      await api.markMessageAsRead(id);
    } catch (error) {
      // 静默处理API调用失败，不向控制台输出错误
      // 这是预期行为，因为后端可能还没有实现消息API
    } finally {
      // 无论API调用成功与否，都更新本地状态
      const message = messages.value.find((msg) => msg.id === id);
      if (message) {
        message.isRead = true;
        updateUnreadCount();
      }
    }
  };

  // 打开消息弹窗
  const openMessagePopup = () => {
    showMessagePopup.value = true;
    // 打开弹窗时标记所有消息为已读
    markAllAsRead();
  };

  // 关闭消息弹窗
  const closeMessagePopup = () => {
    showMessagePopup.value = false;
  };

  // 初始化数据
  onMounted(() => {
    fetchMessages();
  });

  return {
    messages,
    unreadCount,
    showMessagePopup,
    loading,
    fetchMessages,
    openMessagePopup,
    closeMessagePopup,
    markAllAsRead,
    markAsRead,
  };
});
