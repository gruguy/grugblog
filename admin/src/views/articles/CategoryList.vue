<template>
  <div class="category-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>文章分类管理</span>
          <el-button type="primary" @click="handleCreate">创建分类</el-button>
        </div>
      </template>

      <!-- 分类列表 -->
      <el-table :data="categories" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              style="margin-right: 5px"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '创建分类'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            placeholder="请输入分类描述"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/article";

// 分类列表
const categories = ref<any[]>([]);

// 对话框状态
const dialogVisible = ref(false);
const isEdit = ref(false);

// 表单数据
const form = ref({
  id: "",
  name: "",
  description: "",
});

// 加载分类列表
const loadCategories = async () => {
  try {
    const res = await getCategories();
    categories.value = res;
  } catch (error) {
    console.error("获取分类列表失败:", error);
    ElMessage.error("获取分类列表失败");
  }
};

// 创建分类
const handleCreate = () => {
  isEdit.value = false;
  form.value = {
    id: "",
    name: "",
    description: "",
  };
  dialogVisible.value = true;
};

// 编辑分类
const handleEdit = (row: any) => {
  isEdit.value = true;
  form.value = {
    id: row.id,
    name: row.name,
    description: row.description || "",
  };
  dialogVisible.value = true;
};

// 删除分类
const handleDelete = async (row: any) => {
  try {
    await deleteCategory(row.id);
    ElMessage.success("删除成功");
    loadCategories();
  } catch (error) {
    console.error("删除分类失败:", error);
    ElMessage.error("删除分类失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await updateCategory(form.value.id, form.value);
      ElMessage.success("更新成功");
    } else {
      await createCategory(form.value);
      ElMessage.success("创建成功");
    }
    dialogVisible.value = false;
    loadCategories();
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  }
};

// 页面加载时获取分类列表
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.category-list {
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
