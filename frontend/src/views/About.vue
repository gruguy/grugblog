<template>
  <MainLayout>
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center">
        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
          我
        </div>
        <h1 class="text-4xl font-bold mb-4">关于我</h1>
        <p class="text-xl text-muted-foreground">一名热爱技术的前端开发者</p>
      </div>

      <section class="bg-card rounded-lg p-8 border border-border">
        <h2 class="text-2xl font-bold mb-4">个人简介</h2>
        <p class="text-foreground leading-7 mb-4">
          欢迎来到我的个人博客！我是一名前端开发工程师，专注于 Vue、React 等现代前端技术栈。
          喜欢分享技术心得，记录学习成长的过程。
        </p>
        <p class="text-foreground leading-7">
          这个博客是我用 Vue3 + NestJS 构建的个人项目，包含了文章、音乐、相册、Vlog 等多种内容形式。
          希望通过这个平台，能够与更多志同道合的朋友交流学习。
        </p>
      </section>

      <section class="bg-card rounded-lg p-8 border border-border">
        <h2 class="text-2xl font-bold mb-4">技能栈</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="skill in skills"
            :key="skill.name"
            class="p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div class="text-lg font-semibold mb-2">{{ skill.name }}</div>
            <div class="text-sm text-muted-foreground">{{ skill.level }}</div>
          </div>
        </div>
      </section>

      <section class="bg-card rounded-lg p-8 border border-border">
        <h2 class="text-2xl font-bold mb-4">联系方式</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="text-muted-foreground">邮箱:</span>
            <a href="mailto:example@example.com" class="text-primary hover:underline">
              example@example.com
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-muted-foreground">GitHub:</span>
            <a href="https://github.com" target="_blank" class="text-primary hover:underline">
              github.com/username
            </a>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'

const skills = [
  { name: 'Vue3', level: '熟练' },
  { name: 'React', level: '熟练' },
  { name: 'TypeScript', level: '熟练' },
  { name: 'Node.js', level: '熟悉' },
  { name: 'NestJS', level: '熟悉' },
  { name: 'MySQL', level: '熟悉' },
]
</script>

