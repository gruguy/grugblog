<template>
  <div class="article-form">
    <el-card>
      <template #header>
        <span>{{ isEdit ? "编辑文章" : "创建文章" }}</span>
      </template>

      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择分类"
            :disabled="categoriesLoading"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <div class="editor-container">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="form.content"
              style="height: 500px; overflow-y: hidden"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleEditorCreated"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('published')"
            >发布</el-button
          >
          <el-button @click="handleSubmit('draft')">保存草稿</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import type { IDomEditor } from "@wangeditor/editor";
import {
  createArticle,
  updateArticle,
  getArticleById,
  getCategories,
} from "@/api/article";

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);

const form = ref({
  title: "",
  categoryId: 0,
  content: "",
});

// 分类列表
const categories = ref<any[]>([]);
const categoriesLoading = ref(false);

// 加载分类列表
const loadCategories = async () => {
  try {
    categoriesLoading.value = true;
    const res = await getCategories();
    categories.value = res;
  } catch (error) {
    console.error("获取分类列表失败:", error);
    ElMessage.error("获取分类列表失败");
  } finally {
    categoriesLoading.value = false;
  }
};

// 编辑器实例，必须用 ref
const editorRef = ref<IDomEditor | null>(null);

// 编辑器配置
const toolbarConfig = {
  excludeKeys: [
    "fullScreen",
    "insertVideo",
    "codeBlock",
    "splitLine",
    "group-video",
  ],
};

const editorConfig = {
  placeholder: "请输入文章内容...",
  autoFocus: true,
  MENU_CONF: {
    uploadImage: {
      server: "/api/upload/image",
      maxFileSize: 2 * 1024 * 1024, // 2MB
      maxNumberOfFiles: 10,
      fieldName: "file",
    },
  },
};

// 编辑器创建完成时的回调
const handleEditorCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

// 组件销毁时，也销毁编辑器
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});

// 页面加载时，如果是编辑模式则获取文章详情
onMounted(async () => {
  // 先加载分类列表
  await loadCategories();

  if (isEdit.value) {
    loadArticleDetail();
  }
});

// 获取文章详情
const loadArticleDetail = async () => {
  try {
    const id = Number(route.params.id);
    const res = await getArticleById(id);
    form.value = {
      title: res.title,
      categoryId: res.categoryId,
      content: res.content,
    };
  } catch (error) {
    console.error("获取文章详情失败:", error);
    ElMessage.error("获取文章详情失败");
  }
};

// 提交表单
const handleSubmit = async (status: string) => {
  try {
    const formData = { ...form.value, status };

    if (isEdit.value) {
      // 编辑文章
      const id = Number(route.params.id);
      await updateArticle(id, formData);
      ElMessage.success("更新成功");
    } else {
      // 创建文章
      await createArticle(formData);
      ElMessage.success("创建成功");
    }
    // 跳转回文章列表
    router.push("/articles");
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败");
  }
};
</script>

<style scoped>
.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
</style>
