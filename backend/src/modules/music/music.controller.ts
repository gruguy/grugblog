import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { MusicService } from "./music.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("音乐")
@Controller("music")
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "获取音乐列表" })
  async findAll() {
    return this.musicService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "获取音乐详情" })
  async findOne(@Param("id") id: string) {
    return this.musicService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建音乐" })
  async create(@Body() musicData: any) {
    return this.musicService.create(musicData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "更新音乐" })
  async update(@Param("id") id: string, @Body() musicData: any) {
    return this.musicService.update(+id, musicData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除音乐" })
  async remove(@Param("id") id: string) {
    return this.musicService.remove(+id);
  }
}
