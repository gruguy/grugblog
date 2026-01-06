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
              style="
                width: 40px;
                height: 40px;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="openScoreModal(scope.row)"
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
        <el-table-column label="乐谱" width="150">
          <template #default="scope">
            <span v-if="scope.row.scores && scope.row.scores.length > 0">
              共 {{ scope.row.scores.length }} 张
            </span>
            <span v-else class="text-gray-400"> 无 </span>
          </template>
        </el-table-column>
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

      <!-- 乐谱展示Modal - 使用Element Plus默认样式 -->
      <el-dialog
        v-model="scoreModalVisible"
        :title="scoreModalTitle"
        width="80%"
        v-model:fullscreen="isFullscreen"
      >
        <template #header-extra>
          <el-button
            type="text"
            @click="toggleFullscreen"
            :title="isFullscreen ? '退出全屏' : '全屏'"
          >
            <el-icon><FullScreen /></el-icon>
          </el-button>
        </template>

        <div class="flex flex-col h-[70vh] min-h-[400px]">
          <div
            v-if="
              currentMusic &&
              currentMusic.scores &&
              currentMusic.scores.length > 0
            "
            class="flex-1 relative overflow-hidden"
          >
            <div
              class="flex h-full transition-transform duration-300"
              :style="{
                transform: `translateX(calc(-100% * ${currentScoreIndex}))`,
              }"
            >
              <div
                v-for="(score, index) in currentMusic.scores"
                :key="index"
                class="flex-shrink-0 w-full h-full flex items-center justify-center p-4"
              >
                <div
                  class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden"
                >
                  <img
                    v-if="isImage(score)"
                    :src="score"
                    class="max-w-full max-h-full object-contain min-w-[200px] min-h-[200px]"
                    alt="乐谱"
                  />
                  <iframe
                    v-else-if="isPdf(score)"
                    :src="score"
                    class="w-full h-full border-none"
                    frameborder="0"
                  ></iframe>
                  <div
                    v-else
                    class="flex flex-col items-center justify-center gap-5 p-10"
                  >
                    <el-icon class="text-8xl text-gray-400"
                      ><Document
                    /></el-icon>
                    <span class="text-xl text-gray-600">{{
                      getFileName(score)
                    }}</span>
                    <el-button
                      type="primary"
                      size="small"
                      @click="downloadScore(score)"
                    >
                      下载
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页指示器 -->
            <div
              class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
            >
              <span
                v-for="(score, index) in currentMusic.scores"
                :key="index"
                class="w-3 h-3 rounded-full bg-black bg-opacity-30 cursor-pointer transition-all hover:scale-125"
                :class="{
                  'bg-primary transform scale-125': currentScoreIndex === index,
                }"
                @click="currentScoreIndex = index"
              ></span>
            </div>

            <!-- 左右箭头 -->
            <button
              class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all"
              @click="prevScore"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>
            <button
              class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all"
              @click="nextScore"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div
            v-else
            class="flex-1 flex flex-col items-center justify-center min-h-[400px] text-gray-500"
          >
            <el-icon class="text-8xl mb-4"><DocumentRemove /></el-icon>
            <p>暂无乐谱文件</p>
          </div>
        </div>
      </el-dialog>

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
              :action="singleUploadUrl"
              :on-success="handleCoverUpload"
              :on-error="handleCoverUploadError"
              :on-progress="handleCoverUploadProgress"
              :before-upload="beforeCoverUpload"
              :show-file-list="false"
              :headers="uploadHeaders"
              accept="image/*"
              name="file"
            >
              <div class="upload-container">
                <!-- 图片预览 -->
                <div v-if="musicForm.cover" class="preview-container">
                  <img
                    :src="musicForm.cover"
                    class="avatar"
                    @click="previewCover"
                  />
                  <!-- 删除封面按钮 -->
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    class="delete-btn"
                    @click.stop="removeCover"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                  <!-- 加载中遮罩 -->
                  <div v-if="isCoverUploading" class="upload-mask">
                    <el-icon class="is-loading"><Loading /></el-icon>
                    <span>{{ coverUploadProgress }}%</span>
                  </div>
                </div>
                <!-- 上传按钮 -->
                <div v-else class="upload-btn">
                  <el-icon v-if="!isCoverUploading"><Plus /></el-icon>
                  <el-icon v-else class="is-loading"><Loading /></el-icon>
                  <div class="upload-text">
                    {{ isCoverUploading ? "上传中..." : "点击上传封面" }}
                  </div>
                  <div class="upload-hint">
                    支持 JPG、PNG、WebP 等格式，大小不超过 10MB
                  </div>
                </div>
              </div>
            </el-upload>
          </el-form-item>

          <!-- 图片预览对话框 -->
          <el-dialog v-model="previewVisible" title="封面预览" width="500px">
            <img :src="musicForm.cover" class="preview-img" alt="封面预览" />
          </el-dialog>

          <el-form-item label="音频文件">
            <el-upload
              class="audio-uploader"
              :action="singleUploadUrl"
              :on-success="handleAudioUpload"
              :on-error="handleAudioUploadError"
              :on-progress="handleAudioUploadProgress"
              :before-upload="beforeAudioUpload"
              :show-file-list="true"
              :headers="uploadHeaders"
              accept="audio/*"
              :file-list="audioFileList"
              name="file"
            >
              <el-button type="primary">
                <el-icon v-if="!isAudioUploading"><Upload /></el-icon>
                <el-icon v-else class="is-loading"><Loading /></el-icon>
                {{ isAudioUploading ? "上传中..." : "选择音频文件" }}
              </el-button>
              <div
                class="upload-hint"
                style="margin-top: 8px; font-size: 12px; color: #909399"
              >
                支持 MP3、WAV、FLAC 等格式，大小不超过 50MB
              </div>
            </el-upload>

            <!-- 音频上传进度条 -->
            <el-progress
              v-if="isAudioUploading"
              :percentage="audioUploadProgress"
              :stroke-width="2"
              style="margin-top: 10px"
            />
          </el-form-item>

          <!-- 乐谱文件（多文件上传） -->
          <el-form-item label="乐谱文件">
            <el-upload
              class="score-uploader"
              :action="singleUploadUrl"
              :on-success="handleScoreUpload"
              :on-error="handleScoreUploadError"
              :on-progress="handleScoreUploadProgress"
              :before-upload="beforeScoreUpload"
              :on-remove="handleScoreRemove"
              :show-file-list="true"
              :headers="uploadHeaders"
              accept=".pdf,.jpg,.png,.jpeg,.webp,.txt"
              :file-list="scoreFileList"
              multiple
              name="file"
            >
              <el-button type="primary">
                <el-icon v-if="!isScoreUploading"><Upload /></el-icon>
                <el-icon v-else class="is-loading"><Loading /></el-icon>
                {{ isScoreUploading ? "上传中..." : "选择乐谱文件" }}
              </el-button>
              <div
                class="upload-hint"
                style="margin-top: 8px; font-size: 12px; color: #909399"
              >
                支持 PDF、图片、文本等格式，大小不超过 20MB，可上传多个文件
              </div>
            </el-upload>

            <!-- 乐谱上传进度条 -->
            <el-progress
              v-if="isScoreUploading"
              :percentage="scoreUploadProgress"
              :stroke-width="2"
              style="margin-top: 10px"
            />
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
import { ref, onMounted, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Upload,
  Plus,
  Delete,
  Loading,
  FullScreen,
  ArrowLeft,
  ArrowRight,
  Document,
  DocumentRemove,
} from "@element-plus/icons-vue";
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

// 乐谱Modal相关
const scoreModalVisible = ref(false);
const isFullscreen = ref(false);
const currentScoreIndex = ref(0);
const currentMusic = ref(null);
const scoreModalTitle = computed(() => {
  return currentMusic.value ? `${currentMusic.value.name} - 乐谱` : "乐谱";
});

// 音乐表单
const musicForm = reactive({
  id: undefined,
  name: "",
  artist: "",
  cover: "",
  url: "",
  duration: 0,
  description: "",
  scores: [] as string[], // 乐谱文件URL数组
});

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请输入音乐名称", trigger: "blur" }],
  artist: [{ required: true, message: "请输入艺术家名称", trigger: "blur" }],
});

// 上传配置
const uploadHeaders = reactive({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 单文件上传URL（封面、音频）
const singleUploadUrl = "/api/upload/file";

// 多文件上传URL（乐谱）
const multipleUploadUrl = "/api/upload/files";

// 封面上传状态
const isCoverUploading = ref(false);
const coverUploadProgress = ref(0);
const previewVisible = ref(false);

// 音频上传状态
const isAudioUploading = ref(false);
const audioUploadProgress = ref(0);

// 音频文件列表
const audioFileList = ref<any[]>([]);

// 乐谱上传状态
const isScoreUploading = ref(false);
const scoreUploadProgress = ref(0);

// 乐谱文件列表
const scoreFileList = ref<any[]>([]);

// 获取音乐列表
const fetchMusicList = async () => {
  try {
    const res = await getMusicList();
    musicList.value = res || [];
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
    scores: [] as string[], // 重置乐谱数组
  });
  // 重置文件列表
  audioFileList.value = [];
  scoreFileList.value = [];
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

// 封面上传前检查
const beforeCoverUpload = (file: File) => {
  // 检查文件类型
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("请上传图片类型的文件");
    return false;
  }

  // 检查文件大小（10MB）
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("封面图片大小不能超过 10MB");
    return false;
  }

  // 重置上传状态
  isCoverUploading.value = true;
  coverUploadProgress.value = 0;

  return true;
};

// 封面上传进度处理
const handleCoverUploadProgress = (event: any) => {
  coverUploadProgress.value = Math.round(event.percent || 0);
};

// 封面上传成功处理
const handleCoverUpload = (response: any) => {
  isCoverUploading.value = false;
  coverUploadProgress.value = 0;

  if (response.code === 200) {
    musicForm.cover = response.data.url;
    ElMessage.success("封面上传成功");
  } else {
    ElMessage.error("封面上传失败");
  }
};

// 封面上传失败处理
const handleCoverUploadError = (error: any) => {
  isCoverUploading.value = false;
  coverUploadProgress.value = 0;
  ElMessage.error("封面上传失败，请重试");
  console.error("封面上传失败:", error);
};

// 预览封面
const previewCover = () => {
  if (musicForm.cover) {
    previewVisible.value = true;
  }
};

// 删除封面
const removeCover = () => {
  musicForm.cover = "";
  ElMessage.success("封面已删除");
};

// 音频上传前检查
const beforeAudioUpload = (file: File) => {
  // 检查文件类型
  const isAudio = file.type.startsWith("audio/");
  if (!isAudio) {
    ElMessage.error("请上传音频类型的文件");
    return false;
  }

  // 检查文件大小（50MB）
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    ElMessage.error("音频文件大小不能超过 50MB");
    return false;
  }

  // 重置上传状态
  isAudioUploading.value = true;
  audioUploadProgress.value = 0;

  return true;
};

// 音频上传进度处理
const handleAudioUploadProgress = (event: any) => {
  audioUploadProgress.value = Math.round(event.percent || 0);
};

// 音频上传成功处理
const handleAudioUpload = (response: any) => {
  isAudioUploading.value = false;
  audioUploadProgress.value = 0;

  if (response.code === 200) {
    musicForm.url = response.data.url;
    ElMessage.success("音频上传成功");
  } else {
    ElMessage.error("音频上传失败");
  }
};

// 音频上传失败处理
const handleAudioUploadError = (error: any) => {
  isAudioUploading.value = false;
  audioUploadProgress.value = 0;
  ElMessage.error("音频上传失败，请重试");
  console.error("音频上传失败:", error);
};

// 乐谱上传前检查
const beforeScoreUpload = (file: File) => {
  // 检查文件大小（20MB）
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    ElMessage.error("乐谱文件大小不能超过 20MB");
    return false;
  }

  // 重置上传状态
  isScoreUploading.value = true;
  scoreUploadProgress.value = 0;

  return true;
};

// 乐谱上传进度处理
const handleScoreUploadProgress = (event: any) => {
  scoreUploadProgress.value = Math.round(event.percent || 0);
};

// 乐谱上传成功处理
const handleScoreUpload = (response: any, file: any, fileList: any[]) => {
  if (response.code === 200) {
    // 将文件URL添加到表单中
    musicForm.scores.push(response.data.url);
    // 更新文件列表
    scoreFileList.value = fileList;
    ElMessage.success("乐谱上传成功");
  } else {
    ElMessage.error("乐谱上传失败");
  }

  // 检查是否所有文件都已上传完成
  if (
    fileList.length === 0 ||
    fileList.every((item) => item.status === "success")
  ) {
    isScoreUploading.value = false;
    scoreUploadProgress.value = 0;
  }
};

// 乐谱上传失败处理
const handleScoreUploadError = (error: any, file: any, fileList: any[]) => {
  ElMessage.error("乐谱上传失败，请重试");
  console.error("乐谱上传失败:", error);

  // 检查是否所有文件都已上传完成
  if (
    fileList.length === 0 ||
    fileList.every((item) => item.status === "success")
  ) {
    isScoreUploading.value = false;
    scoreUploadProgress.value = 0;
  }
};

// 乐谱文件删除处理
const handleScoreRemove = (file: any, fileList: any[]) => {
  // 更新文件列表
  scoreFileList.value = fileList;

  // 从表单中移除对应的URL
  const index = musicForm.scores.indexOf(file.url);
  if (index > -1) {
    musicForm.scores.splice(index, 1);
  }

  ElMessage.success("乐谱已删除");
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    // 使用普通的对象格式，而不是FormData，便于后端使用@Body()装饰器处理
    const formData = {
      name: musicForm.name,
      artist: musicForm.artist,
      cover: musicForm.cover,
      url: musicForm.url,
      duration: musicForm.duration,
      description: musicForm.description || undefined,
      // 始终传递scores数组，包括空数组
      scores: musicForm.scores,
    };

    let res;
    if (isEdit.value && musicForm.id) {
      res = await updateMusic(musicForm.id, formData);
    } else {
      res = await createMusic(formData);
    }

    // 由于响应拦截器已经处理了统一格式，直接返回了res.data，所以这里不需要检查res.code
    // 只要没有抛出错误，就表示请求成功
    ElMessage.success(isEdit.value ? "编辑成功" : "上传成功");
    dialogVisible.value = false;
    fetchMusicList();
  } catch (error: any) {
    console.error("表单提交失败:", error);
    // 打印更详细的错误信息
    if (error.response) {
      console.error("错误响应数据:", error.response.data);
      console.error("错误状态码:", error.response.status);
      console.error("错误响应头:", error.response.headers);
    } else if (error.request) {
      console.error("请求发送但未收到响应:", error.request);
    } else {
      console.error("请求配置错误:", error.message);
    }
    ElMessage.error(
      error.response?.data?.message || "提交失败，请检查控制台日志"
    );
  }
};

// 打开乐谱Modal
const openScoreModal = (music: any) => {
  currentMusic.value = music;
  currentScoreIndex.value = 0;
  scoreModalVisible.value = true;
};

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 判断是否为图片文件
const isImage = (url: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = url.substring(url.lastIndexOf(".")).toLowerCase();
  return imageExtensions.includes(ext);
};

// 判断是否为PDF文件
const isPdf = (url: string) => {
  return url.toLowerCase().endsWith(".pdf");
};

// 获取文件名
const getFileName = (url: string) => {
  return url.substring(url.lastIndexOf("/") + 1);
};

// 下载乐谱
const downloadScore = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = getFileName(url);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 上一张乐谱
const prevScore = () => {
  if (currentScoreIndex.value > 0) {
    currentScoreIndex.value--;
  }
};

// 下一张乐谱
const nextScore = () => {
  if (
    currentMusic.value &&
    currentMusic.value.scores &&
    currentScoreIndex.value < currentMusic.value.scores.length - 1
  ) {
    currentScoreIndex.value++;
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
  display: block;
  margin-top: 8px;

  .upload-container {
    position: relative;
    display: inline-block;
  }

  .preview-container {
    position: relative;
    display: block;
  }

  .avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .avatar:hover {
    transform: scale(1.05);
  }

  .delete-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 4px;
  }

  .upload-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
  }

  .upload-mask .is-loading {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .upload-btn {
    width: 120px;
    height: 120px;
    background-color: #f0f2f5;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
    text-align: center;
  }

  .upload-btn:hover {
    background-color: #e4e7ed;
  }

  .upload-btn .el-icon {
    font-size: 24px;
    color: #8c939d;
    margin-bottom: 8px;
  }

  .upload-text {
    font-size: 13px;
    color: #606266;
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .upload-hint {
    font-size: 11px;
    color: #909399;
    text-align: center;
    line-height: 1.3;
    padding: 0 8px;
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

/* 预览图片样式 */
.preview-img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

/* 音频上传样式 */
.audio-uploader {
  margin-top: 10px;
}

/* 乐谱上传样式 */
.score-uploader {
  margin-top: 10px;
}

/* 文件列表样式优化 */
:deep(.el-upload-list__item) {
  margin-top: 8px;
}

:deep(.el-upload-list__item-name) {
  font-size: 13px;
  color: #606266;
}

:deep(.el-upload-list__item-status-label) {
  font-size: 12px;
}

.dialog-footer {
  text-align: right;
}

/* 确保全屏状态下内容区域有正确高度 */
:deep(.el-dialog__wrapper.is-fullscreen) {
  .el-dialog__body {
    height: calc(100vh - 60px) !important;
    display: flex;
    flex-direction: column;
  }

  .flex-col.h-\[70vh\] {
    height: 100% !important;
    min-height: calc(100vh - 100px);
  }
}
</style>
