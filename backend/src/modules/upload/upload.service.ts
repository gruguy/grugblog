import { Injectable } from '@nestjs/common'

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/uploads/${file.filename}`
    
    return {
      url,
      filename: file.filename,
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<{ url: string; filename: string }[]> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    
    return files.map((file) => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
    }))
  }
}

