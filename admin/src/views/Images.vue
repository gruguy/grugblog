<template>
  <div class="image-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>图片管理</span>
          <el-button type="primary" @click="openUploadDialog">上传图片</el-button>
        </div>
      </template>
      
      <!-- 图片列表 -->
      <el-table :data="imageList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-image 
              :src="scope.row.url" 
              fit="cover" 
              style="width: 100px; height: 80px; border-radius: 4px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="width" label="宽度" width="80">
          <template #default="scope">
            {{ scope.row.width }}px
          </template>
        </el-table-column>
        <el-table-column prop="height" label="高度" width="80">
          <template #default="scope">
            {{ scope.row.height }}px
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览次数" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editImage(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteImage(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 上传/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑图片' : '上传图片'"
        width="500px"
      >
        <el-form :model="imageForm" label-width="80px" :rules="rules" ref="formRef">
          <el-form-item label="标题" prop="title">
            <el-input v-model="imageForm.title" placeholder="请输入图片标题" />
          </el-form-item>
          
          <el-form-item label="简介" prop="description">
            <el-input
              v-model="imageForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入图片简介"
            />
          </el-form-item>
          
          <el-form-item label="图片">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :on-success="handleImageUpload"
              :show-file-list="false"
              :headers="uploadHeaders"
              accept="image/*"
            >
              <img v-if="imageForm.url" :src="imageForm.url" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Plus } from '@element-plus/icons-vue'
import { getImageList, createImage, updateImage, deleteImage as deleteImageApi } from '../api/image'

// 图片列表
const imageList = ref([])

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 图片表单
const imageForm = reactive({
  id: undefined,
  title: '',
  description: '',
  url: '',
  width: 0,
  height: 0,
  viewCount: 0
})

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入图片标题', trigger: 'blur' }
  ]
})

// 上传配置
const uploadUrl = '/api/upload'
const uploadHeaders = reactive({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

// 获取图片列表
const fetchImageList = async () => {
  try {
    const res = await getImageList()
    imageList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取图片列表失败')
    console.error(error)
  }
}

// 打开上传对话框
const openUploadDialog = () => {
  isEdit.value = false
  // 重置表单
  Object.assign(imageForm, {
    id: undefined,
    title: '',
    description: '',
    url: '',
    width: 0,
    height: 0,
    viewCount: 0
  })
  dialogVisible.value = true
}

// 编辑图片
const editImage = (image: any) => {
  isEdit.value = true
  // 填充表单数据
  Object.assign(imageForm, image)
  dialogVisible.value = true
}

// 删除图片
const deleteImage = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这张图片吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteImageApi(id)
    ElMessage.success('删除成功')
    fetchImageList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// 图片上传成功处理
const handleImageUpload = (response: any) => {
  if (response.code === 200) {
    imageForm.url = response.data.url
    ElMessage.success('图片上传成功')
    
    // 自动获取图片尺寸
    const img = new Image()
    img.onload = () => {
      imageForm.width = img.width
      imageForm.height = img.height
    }
    img.src = response.data.url
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const formData = new FormData()
    formData.append('title', imageForm.title)
    formData.append('url', imageForm.url)
    formData.append('width', imageForm.width.toString())
    formData.append('height', imageForm.height.toString())
    if (imageForm.description) {
      formData.append('description', imageForm.description)
    }
    if (imageForm.viewCount) {
      formData.append('viewCount', imageForm.viewCount.toString())
    }
    
    let res
    if (isEdit.value && imageForm.id) {
      res = await updateImage(imageForm.id, formData)
    } else {
      res = await createImage(formData)
    }
    
    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '编辑成功' : '上传成功')
      dialogVisible.value = false
      fetchImageList()
    } else {
      ElMessage.error(isEdit.value ? '编辑失败' : '上传失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  fetchImageList()
})
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
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    background-color: #f0f2f5;
    width: 200px;
    height: 150px;
    text-align: center;
    line-height: 150px;
    border-radius: 8px;
    cursor: pointer;
  }
}

.dialog-footer {
  text-align: right;
}
</style>

