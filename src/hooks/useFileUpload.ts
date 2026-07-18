import { useState, useCallback } from 'react';
import { getFileSuffix } from '@/utils';

interface UploadedFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  file?: File | null;
}

interface UseFileUploadOptions {
  maxCount?: number;
  maxSizeMB?: number;
  accept?: string[];
  onUpload?: (file: File) => Promise<string>;
}

interface UseFileUploadResult {
  fileList: UploadedFile[];
  uploading: boolean;
  handleChange: (files: any[]) => void;
  handleRemove: (uid: string) => void;
  handleClear: () => void;
  validateFile: (file: File) => { valid: boolean; message?: string };
}

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const DOC_EXT = ['pdf', 'dwg', 'dxf'];

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadResult {
  const { maxCount = 10, maxSizeMB = 20, accept = [] } = options;

  const [fileList, setFileList] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const validateFile = useCallback(
    (file: File): { valid: boolean; message?: string } => {
      const suffix = getFileSuffix(file.name);

      if (accept.length > 0 && !accept.includes(suffix)) {
        return { valid: false, message: `不支持的文件格式，仅支持 ${accept.join('、')}` };
      }

      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        return { valid: false, message: `文件大小不能超过 ${maxSizeMB}MB` };
      }

      return { valid: true };
    },
    [accept, maxSizeMB]
  );

  const handleChange = useCallback(
    (files: any[]) => {
      const validFiles: UploadedFile[] = [];

      for (const file of files) {
        const nativeFile = file.file;
        if (nativeFile && nativeFile instanceof File) {
          const result = validateFile(nativeFile);
          if (!result.valid) {
            console.warn(result.message);
            continue;
          }
        }

        validFiles.push({
          uid: file.uid || String(Date.now() + Math.random()),
          name: file.name,
          size: file.size,
          type: file.type || '',
          previewUrl: file.previewUrl,
          file: file.file || null,
        });
      }

      if (validFiles.length > maxCount) {
        setFileList(validFiles.slice(0, maxCount));
        console.warn(`最多上传 ${maxCount} 个文件`);
      } else {
        setFileList(validFiles);
      }
    },
    [maxCount, validateFile]
  );

  const handleRemove = useCallback((uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  }, []);

  const handleClear = useCallback(() => {
    setFileList([]);
  }, []);

  return {
    fileList,
    uploading,
    handleChange,
    handleRemove,
    handleClear,
    validateFile,
  };
}

export function isImageFile(fileName: string): boolean {
  return IMAGE_EXT.includes(getFileSuffix(fileName));
}

export function isDocFile(fileName: string): boolean {
  return DOC_EXT.includes(getFileSuffix(fileName));
}
