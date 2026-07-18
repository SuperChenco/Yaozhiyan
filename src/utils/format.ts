export function formatPrice(price: number, options?: {
  unit?: string;
  showSymbol?: boolean;
  originalPrice?: number;
}): string {
  const { unit = '', showSymbol = true, originalPrice } = options || {};
  const symbol = showSymbol ? '¥' : '';
  const formatted = `${symbol}${price.toLocaleString()}`;
  if (originalPrice && originalPrice > price) {
    return `${formatted}${unit}`;
  }
  return `${formatted}${unit}`;
}

export function formatOriginalPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 0) return '0B';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function formatDate(dateStr: string | Date, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'MM-DD' = 'YYYY-MM-DD'): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'MM-DD':
      return `${month}-${day}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

export function formatPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export function getFileSuffix(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return '';
  return fileName.slice(lastDot + 1).toLowerCase();
}

const ROLE_LABEL_MAP: Record<string, string> = {
  admin: '管理员',
  provincial: '省级总代理',
  city: '城市经销商',
};

export function getRoleLabel(role: string): string {
  return ROLE_LABEL_MAP[role] || role;
}
