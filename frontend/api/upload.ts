import request from './request';

// 单文件上传
export const uploadFile = (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<{ url: string }>('/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 多文件上传
export const uploadFiles = (files: File[]): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  return request.post<{ urls: string[] }>('/upload/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};