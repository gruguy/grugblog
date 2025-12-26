import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator'

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题' })
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string

  @ApiProperty({ description: '文章内容' })
  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  content: string

  @ApiProperty({ description: '文章摘要', required: false })
  @IsString()
  @IsOptional()
  summary?: string

  @ApiProperty({ description: '封面图片', required: false })
  @IsString()
  @IsOptional()
  cover?: string

  @ApiProperty({ description: '分类ID' })
  @IsNumber()
  @IsNotEmpty({ message: '分类ID不能为空' })
  categoryId: number

  @ApiProperty({ description: '标签ID数组', required: false, type: [Number] })
  @IsArray()
  @IsOptional()
  tagIds?: number[]

  @ApiProperty({ description: '文章状态', enum: ['draft', 'published'], default: 'draft', required: false })
  @IsString()
  @IsOptional()
  status?: string
}

