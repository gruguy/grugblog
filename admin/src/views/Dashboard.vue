<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.articleCount }}</div>
            <div class="stat-label">文章总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.musicCount }}</div>
            <div class="stat-label">音乐总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.imageCount }}</div>
            <div class="stat-label">图片总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stats.videoCount }}</div>
            <div class="stat-label">视频总数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>访问统计</span>
          </template>
          <div id="visitChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>内容分布</span>
          </template>
          <div id="contentChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getArticleList } from '../api/article'
import request from '../api/request'

// 统计数据
const stats = ref({
  articleCount: 0,
  musicCount: 0,
  imageCount: 0,
  videoCount: 0
})

// 获取统计数据
const getStats = async () => {
  try {
    // 获取文章总数
    const articleRes = await getArticleList()
    stats.value.articleCount = articleRes.data?.length || 0
    
    // 获取音乐总数
    const musicRes = await request.get('/music')
    stats.value.musicCount = musicRes.data?.length || 0
    
    // 获取图片总数
    // 假设图片接口是 /images
    const imageRes = await request.get('/images')
    stats.value.imageCount = imageRes.data?.length || 0
    
    // 获取视频总数
    // 假设视频接口是 /videos
    const videoRes = await request.get('/videos')
    stats.value.videoCount = videoRes.data?.length || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(async () => {
  // 获取统计数据
  await getStats()
  
  // 初始化图表
  const visitChart = echarts.init(document.getElementById('visitChart')!)
  const contentChart = echarts.init(document.getElementById('contentChart')!)
  
  visitChart.setOption({
    title: { text: '访问量趋势' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [{ data: [820, 932, 901, 934, 1290, 1330, 1320], type: 'line' }],
  })
  
  contentChart.setOption({
    title: { text: '内容分布' },
    series: [{
      type: 'pie',
      data: [
        { value: stats.value.articleCount, name: '文章' },
        { value: stats.value.musicCount, name: '音乐' },
        { value: stats.value.imageCount, name: '图片' },
        { value: stats.value.videoCount, name: '视频' },
      ],
    }],
  })
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    .stat-content {
      text-align: center;
      
      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 10px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>

