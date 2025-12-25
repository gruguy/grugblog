<template>
  <div class="music-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>音乐管理</span>
          <el-button type="primary" @click="openUploadDialog"
            >上传音乐</el-button
          >
        </div>
      </template>

      <!-- 音乐列表 -->
      <el-table :data="musicList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.cover"
              fit="cover"
              style="width: 40px; height: 40px; border-radius: 4px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="artist" label="艺术家" width="150" />
        <el-table-column prop="duration" label="时长" width="100">
          <template #default="scope">
            {{ formatDuration(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="playCount" label="播放次数" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="editMusic(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteMusic(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 上传/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑音乐' : '上传音乐'"
        width="500px"
      >
        <el-form
          :model="musicForm"
          label-width="80px"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="musicForm.name" placeholder="请输入音乐名称" />
          </el-form-item>

          <el-form-item label="艺术家" prop="artist">
            <el-input
              v-model="musicForm.artist"
              placeholder="请输入艺术家名称"
            />
          </el-form-item>

          <el-form-item label="简介" prop="description">
            <el-input
              v-model="musicForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入音乐简介"
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
                v-if="musicForm.cover"
                :src="musicForm.cover"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item label="音频文件">
            <el-upload
              class="audio-uploader"
              :action="uploadUrl"
              :on-success="handleAudioUpload"
              :show-file-list="true"
              :headers="uploadHeaders"
              accept="audio/*"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon> 选择音频文件
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
  getMusicList,
  createMusic,
  updateMusic,
  deleteMusic as deleteMusicApi,
} from "../api/music";

// 音乐列表
const musicList = ref([]);

// 对话框
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 音乐表单
const musicForm = reactive({
  id: undefined,
  name: "",
  artist: "",
  cover: "",
  url: "",
  duration: 0,
  description: "",
});

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入音乐名称", trigger: "blur" }],
  artist: [{ required: true, message: "请输入艺术家名称", trigger: "blur" }],
});

// 上传配置
const uploadUrl = "/api/upload";
const uploadHeaders = reactive({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 获取音乐列表
const fetchMusicList = async () => {
  try {
    const res = await getMusicList();
    musicList.value = res.data || [];
  } catch (error) {
    ElMessage.error("获取音乐列表失败");
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
  Object.assign(musicForm, {
    id: undefined,
    name: "",
    artist: "",
    cover: "",
    url: "",
    duration: 0,
    description: "",
  });
  dialogVisible.value = true;
};

// 编辑音乐
const editMusic = (music: any) => {
  isEdit.value = true;
  // 填充表单数据
  Object.assign(musicForm, music);
  dialogVisible.value = true;
};

// 删除音乐
const deleteMusic = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这首音乐吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteMusicApi(id);
    ElMessage.success("删除成功");
    fetchMusicList();
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
    musicForm.cover = response.data.url;
    ElMessage.success("封面上传成功");
  } else {
    ElMessage.error("封面上传失败");
  }
};

// 音频上传成功处理
const handleAudioUpload = (response: any) => {
  if (response.code === 200) {
    musicForm.url = response.data.url;
    ElMessage.success("音频上传成功");
  } else {
    ElMessage.error("音频上传失败");
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    const formData = new FormData();
    formData.append("name", musicForm.name);
    formData.append("artist", musicForm.artist);
    formData.append("cover", musicForm.cover);
    formData.append("url", musicForm.url);
    formData.append("duration", musicForm.duration.toString());
    if (musicForm.description) {
      formData.append("description", musicForm.description);
    }

    let res;
    if (isEdit.value && musicForm.id) {
      res = await updateMusic(musicForm.id, formData);
    } else {
      res = await createMusic(formData);
    }

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? "编辑成功" : "上传成功");
      dialogVisible.value = false;
      fetchMusicList();
    } else {
      ElMessage.error(isEdit.value ? "编辑失败" : "上传失败");
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 生命周期钩子
onMounted(() => {
  fetchMusicList();
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
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    background-color: #f0f2f5;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border-radius: 8px;
    cursor: pointer;
  }
}

.audio-uploader {
  margin-top: 10px;
}

.dialog-footer {
  text-align: right;
}
</style>
