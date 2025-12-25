<template>
  <div class="video-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>视频管理</span>
          <el-button type="primary" @click="openUploadDialog"
            >上传视频</el-button
          >
        </div>
      </template>

      <!-- 视频列表 -->
      <el-table :data="videoList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.cover"
              fit="cover"
              style="width: 80px; height: 45px; border-radius: 4px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="250" />
        <el-table-column prop="duration" label="时长" width="100">
          <template #default="scope">
            {{ formatDuration(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览次数" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="editVideo(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteVideo(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 上传/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑视频' : '上传视频'"
        width="500px"
      >
        <el-form
          :model="videoForm"
          label-width="80px"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="videoForm.title" placeholder="请输入视频标题" />
          </el-form-item>

          <el-form-item label="简介" prop="description">
            <el-input
              v-model="videoForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入视频简介"
            />
          </el-form-item>

          <el-form-item label="封面">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :on-success="handleCoverUpload"
              :show-file-list="false"
              :headers="uploadHeaders"
              accept="image/*"
            >
              <img
                v-if="videoForm.cover"
                :src="videoForm.cover"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item label="视频文件">
            <el-upload
              class="video-uploader"
              :action="uploadUrl"
              :on-success="handleVideoUpload"
              :show-file-list="true"
              :headers="uploadHeaders"
              accept="video/*"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon> 选择视频文件
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Upload, Plus } from "@element-plus/icons-vue";
import {
  getVideoList,
  createVideo,
  updateVideo,
  deleteVideo as deleteVideoApi,
} from "../api/video";

// 视频列表
const videoList = ref([]);

// 对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 视频表单
const videoForm = reactive({
  id: undefined,
  title: "",
  description: "",
  url: "",
  cover: "",
  duration: 0,
  viewCount: 0,
});

// 表单验证规则
const rules = reactive({
  title: [{ required: true, message: "请输入视频标题", trigger: "blur" }],
});

// 上传配置
const uploadUrl = "/api/upload";
const uploadHeaders = reactive({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 获取视频列表
const fetchVideoList = async () => {
  try {
    const res = await getVideoList();
    videoList.value = res.data || [];
  } catch (error) {
    ElMessage.error("获取视频列表失败");
    console.error(error);
  }
};

// 格式化时长
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// 打开上传对话框
const openUploadDialog = () => {
  isEdit.value = false;
  // 重置表单
  Object.assign(videoForm, {
    id: undefined,
    title: "",
    description: "",
    url: "",
    cover: "",
    duration: 0,
    viewCount: 0,
  });
  dialogVisible.value = true;
};

// 编辑视频
const editVideo = (video: any) => {
  isEdit.value = true;
  // 填充表单数据
  Object.assign(videoForm, video);
  dialogVisible.value = true;
};

// 删除视频
const deleteVideo = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这个视频吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteVideoApi(id);
    ElMessage.success("删除成功");
    fetchVideoList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
      console.error(error);
    }
  }
};

// 封面上传成功处理
const handleCoverUpload = (response: any) => {
  if (response.code === 200) {
    videoForm.cover = response.data.url;
    ElMessage.success("封面上传成功");
  } else {
    ElMessage.error("封面上传失败");
  }
};

// 视频上传成功处理
const handleVideoUpload = (response: any) => {
  if (response.code === 200) {
    videoForm.url = response.data.url;
    ElMessage.success("视频上传成功");
  } else {
    ElMessage.error("视频上传失败");
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    const formData = new FormData();
    formData.append("title", videoForm.title);
    formData.append("url", videoForm.url);
    formData.append("cover", videoForm.cover);
    formData.append("duration", videoForm.duration.toString());
    if (videoForm.description) {
      formData.append("description", videoForm.description);
    }
    if (videoForm.viewCount) {
      formData.append("viewCount", videoForm.viewCount.toString());
    }

    let res;
    if (isEdit.value && videoForm.id) {
      res = await updateVideo(videoForm.id, formData);
    } else {
      res = await createVideo(formData);
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? "编辑成功" : "上传成功");
      dialogVisible.value = false;
      fetchVideoList();
    } else {
      ElMessage.error(isEdit.value ? "编辑失败" : "上传失败");
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 生命周期钩子
onMounted(() => {
  fetchVideoList();
});
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  display: flex;
  align-items: center;

  .avatar {
    width: 120px;
    height: 67.5px;
    object-fit: cover;
    border-radius: 8px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    background-color: #f0f2f5;
    width: 120px;
    height: 67.5px;
    text-align: center;
    line-height: 67.5px;
    border-radius: 8px;
    cursor: pointer;
  }
}

.video-uploader {
  margin-top: 10px;
}

.dialog-footer {
  text-align: right;
}
</style>
