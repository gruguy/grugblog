<template>
  <div class="article-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>文章列表</span>
          <el-button type="primary" @click="$router.push('/articles/create')">
            创建文章
          </el-button>
        </div>
      </template>

      <el-table :data="articleList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category.name" label="分类" width="120" />
        <el-table-column prop="views" label="阅读量" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getArticleList, deleteArticle } from "@/api/article";
import dayjs from "dayjs";

const router = useRouter();
const articleList = ref([]);

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

// 加载文章列表
const loadArticleList = async () => {
  try {
    const res = await getArticleList();
    articleList.value = res.list || [];
  } catch (error) {
    console.error("加载文章列表失败:", error);
    ElMessage.error("加载文章列表失败");
  }
};

// 跳转到编辑页面
const handleEdit = (id: number) => {
  router.push(`/articles/edit/${id}`);
};

// 删除文章
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这篇文章吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteArticle(id);
    ElMessage.success("删除成功");
    // 重新加载文章列表
    await loadArticleList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除文章失败:", error);
      ElMessage.error("删除文章失败");
    }
    // 用户取消操作不处理
  }
};

// 页面挂载时加载文章列表
onMounted(() => {
  loadArticleList();
});
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
