import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, X, FileText, Image as ImageIcon } from 'lucide-react';

export interface UploadedFile {
  uid: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface FileUploadProps {
  /** 已上传文件列表（受控） */
  value?: UploadedFile[];
  /** 文件变化回调 */
  onChange?: (files: UploadedFile[]) => void;
  /** 允许的文件后缀，如 ['jpg','png','pdf']；不传则不限 */
  accept?: string[];
  /** 允许的 MIME 类型，与 accept 二选一即可 */
  acceptMime?: string;
  /** 单文件大小上限（MB），默认 10MB */
  maxSizeMB?: number;
  /** 最大文件数量，默认 5 */
  maxCount?: number;
  /** 是否多选 */
  multiple?: boolean;
  /** 提示文字 */
  hint?: string;
  /** disabled */
  disabled?: boolean;
}

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const DOC_EXTS = ['pdf', 'dwg', 'dxf', 'cad', 'doc', 'docx', 'xls', 'xlsx'];

function getFileExt(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || IMAGE_EXTS.includes(getFileExt(file.name));
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export default function FileUpload({
  value,
  onChange,
  accept,
  acceptMime,
  maxSizeMB = 10,
  maxCount = 5,
  multiple = true,
  hint,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 内部非受控模式
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const files = value ?? internalFiles;

  const setFiles = useCallback(
    (next: UploadedFile[]) => {
      if (!value) setInternalFiles(next);
      onChange?.(next);
    },
    [value, onChange]
  );

  const validateAndAdd = useCallback(
    (incoming: File[]): UploadedFile[] => {
      const errors: string[] = [];
      const valid: UploadedFile[] = [];

      for (const file of incoming) {
        const ext = getFileExt(file.name);
        if (accept && accept.length > 0 && !accept.includes(ext)) {
          errors.push(`${file.name} 后缀不允许`);
          continue;
        }
        if (acceptMime && !file.type.match(acceptMime.replace(/\*/g, '.*'))) {
          errors.push(`${file.name} 类型不允许`);
          continue;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          errors.push(`${file.name} 超过 ${maxSizeMB}MB`);
          continue;
        }
        if (files.length + valid.length >= maxCount) {
          errors.push(`最多上传 ${maxCount} 个文件`);
          break;
        }
        const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const previewUrl = isImageFile(file) ? URL.createObjectURL(file) : undefined;
        valid.push({
          uid,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl,
        });
      }

      setErrorMsg(errors.length > 0 ? errors[0] : '');
      return valid;
    },
    [accept, acceptMime, maxSizeMB, maxCount, files.length]
  );

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    const valid = validateAndAdd(incoming);
    if (valid.length === 0) return;
    setFiles(multiple ? [...files, ...valid] : [valid[0]]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleRemove = (uid: string) => {
    const target = files.find((f) => f.uid === uid);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setFiles(files.filter((f) => f.uid !== uid));
  };

  const acceptAttr = acceptMime
    ? acceptMime
    : accept && accept.length > 0
    ? accept.map((ext) => `.${ext}`).join(',')
    : undefined;

  const reachedMax = files.length >= maxCount;

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !reachedMax && inputRef.current?.click()}
        className={[
          'flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-base border border-dashed transition-colors duration-150 ease-fade',
          isDragging
            ? 'border-rock-blue bg-rock-blue/5'
            : 'border-steel-light-gray bg-steel-light',
          disabled || reachedMax ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-rock-hover',
        ].join(' ')}
      >
        <UploadCloud size={28} strokeWidth={1.5} className="text-steel-light-gray" />
        <p className="text-xs text-steel-gray">
          点击或拖拽文件到此处上传
        </p>
        <p className="text-[11px] text-steel-light-gray">
          {hint ??
            `支持 ${accept?.join(' / ') ?? '所有类型'}，单文件 ≤ ${maxSizeMB}MB，最多 ${maxCount} 个`}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptAttr}
          multiple={multiple}
          disabled={disabled || reachedMax}
          onChange={handleChange}
        />
      </div>

      {errorMsg && (
        <p className="mt-2 text-xs text-status-danger">{errorMsg}</p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((item) => {
            const isImg = isImageFile(item.file);
            return (
              <li
                key={item.uid}
                className="flex items-center gap-3 p-2 bg-steel-white border border-steel-light-gray rounded-base"
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-steel-light rounded-base overflow-hidden">
                  {isImg && item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText size={18} strokeWidth={1.5} className="text-steel-gray" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {isImg ? (
                      <ImageIcon size={12} strokeWidth={1.5} className="text-steel-light-gray flex-shrink-0" />
                    ) : null}
                    <p className="text-xs text-steel-gray truncate">{item.name}</p>
                  </div>
                  <p className="text-[11px] text-steel-light-gray mt-0.5">{formatSize(item.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.uid);
                  }}
                  className="p-1 text-steel-light-gray hover:text-status-danger transition-colors"
                  aria-label="删除"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export const ACCEPT_IMAGE = IMAGE_EXTS;
export const ACCEPT_DRAWING = [...DOC_EXTS, ...IMAGE_EXTS];
