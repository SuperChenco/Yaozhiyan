import * as XLSX from 'xlsx';
import type { Dealer, Project, Order, PointRecord } from '@/types';

/** 通用导出选项 */
interface ExportOptions {
  /** 文件名（不含扩展名） */
  filename: string;
  /** 工作表名 */
  sheetName?: string;
}

/** 表格列定义 */
interface ColumnDef<T> {
  /** 列标题 */
  label: string;
  /** 取值函数 */
  value: (row: T) => string | number;
}

/**
 * 通用 Excel 导出：将任意对象数组按列定义导出为 xlsx
 * - 无数据返回 false，调用方提示「暂无数据可导出」
 * - 列宽自动适配内容长度
 */
export function exportToExcel<T>(
  rows: T[],
  columns: ColumnDef<T>[],
  options: ExportOptions
): boolean {
  if (!rows || rows.length === 0) {
    return false;
  }
  const header = columns.map((c) => c.label);
  const body = rows.map((row) => columns.map((c) => c.value(row)));
  const aoa = [header, ...body];

  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  // 列宽：取每列最大字符长度
  const colWidths = columns.map((col, idx) => {
    const max = Math.max(
      col.label.length * 2,
      ...body.map((r) => (String(r[idx] ?? '').length))
    );
    return { wch: Math.min(Math.max(max + 2, 8), 50) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName || 'Sheet1');
  const filename = `${options.filename}-${formatDate(new Date())}.xlsx`;
  XLSX.writeFile(workbook, filename);
  return true;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

// ===== 三种业务模板 =====

const DEALER_LEVEL_LABEL: Record<string, string> = {
  provincial: '省级总代',
  city: '城市经销商',
};

const DEALER_STATUS_LABEL: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
};

const PROJECT_STATUS_LABEL: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  producing: '生产中',
  shipped: '已发货',
  delivered: '已签收',
  completed: '已完成',
};

/**
 * 导出经销商报表
 * - 企业、联系人、手机号、省份、城市、等级、注册时间、总积分
 */
export function exportDealers(
  dealers: Dealer[],
  pointRecords: PointRecord[],
  options: ExportOptions = { filename: '经销商报表' }
): boolean {
  const cols: ColumnDef<Dealer>[] = [
    { label: '企业名称', value: (d) => d.company },
    { label: '联系人', value: (d) => d.name },
    { label: '手机号', value: (d) => d.phone },
    { label: '省份', value: (d) => d.province },
    { label: '城市', value: (d) => d.city || '-' },
    { label: '等级', value: (d) => DEALER_LEVEL_LABEL[d.level] || d.level },
    { label: '状态', value: (d) => DEALER_STATUS_LABEL[d.status] || d.status },
    {
      label: '注册时间',
      value: (d) => (d.createdAt ? new Date(d.createdAt).toLocaleDateString('zh-CN') : '-'),
    },
    {
      label: '总积分',
      value: (d) => pointRecords.filter((r) => r.userId === d.id).reduce((s, r) => s + r.amount, 0),
    },
  ];
  return exportToExcel(dealers, cols, options);
}

/**
 * 导出项目台账
 * - 项目名、面积、预估金额、图纸数、状态、报备经销商
 */
export function exportProjects(
  projects: Project[],
  options: ExportOptions = { filename: '项目台账' }
): boolean {
  const cols: ColumnDef<Project>[] = [
    { label: '项目名称', value: (p) => p.name },
    { label: '项目地点', value: (p) => p.location },
    { label: '项目类型', value: (p) => p.type },
    { label: '面积（㎡）', value: (p) => p.area },
    { label: '预估金额（元）', value: (p) => p.estimatedCost },
    { label: '图纸数量', value: (p) => p.drawFiles?.length || 0 },
    { label: '状态', value: (p) => PROJECT_STATUS_LABEL[p.status] || p.status },
    { label: '报备经销商', value: (p) => p.dealerName },
    {
      label: '最近更新',
      value: (p) => (p.lastUpdate ? new Date(p.lastUpdate).toLocaleDateString('zh-CN') : '-'),
    },
  ];
  return exportToExcel(projects, cols, options);
}

/**
 * 导出订单报表
 * - 产品、数量、单价、总金额、订单状态
 */
export function exportOrders(
  orders: Order[],
  options: ExportOptions = { filename: '订单报表' }
): boolean {
  const cols: ColumnDef<Order>[] = [
    { label: '订单号', value: (o) => o.id },
    { label: '产品名称', value: (o) => o.productName },
    { label: '数量', value: (o) => o.quantity },
    { label: '单价（元）', value: (o) => o.unitPrice },
    { label: '总金额（元）', value: (o) => o.totalPrice },
    { label: '订单状态', value: (o) => ORDER_STATUS_LABEL[o.status] || o.status },
    {
      label: '下单时间',
      value: (o) => (o.createdAt ? new Date(o.createdAt).toLocaleDateString('zh-CN') : '-'),
    },
    { label: '收货地址', value: (o) => o.deliveryAddress || '-' },
  ];
  return exportToExcel(orders, cols, options);
}
