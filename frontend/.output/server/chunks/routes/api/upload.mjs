import service from './request.mjs';
import 'axios';
import 'pinia';
import 'vue';

const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return service.post("/upload/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
const uploadFiles = (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return service.post("/upload/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export { uploadFile, uploadFiles };
//# sourceMappingURL=upload.mjs.map
