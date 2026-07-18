export type UserRole = 'admin' | 'provincial' | 'city';

export type DealerLevel = 'provincial' | 'city';

export type ProjectStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';

export type OrderStatus = 'pending' | 'paid' | 'producing' | 'shipped' | 'delivered' | 'completed';

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  length: number;
  width: number;
  thickness: number;
  basePrice: number;
  unit: string;
  image: string;
  applications: string[];
}

export interface Case {
  id: string;
  name: string;
  location: string;
  type: string;
  area: string;
  year: string;
  description: string;
  images: string[];
  products: string[];
}

export interface Dealer {
  id: string;
  name: string;
  company: string;
  phone: string;
  level: DealerLevel;
  province: string;
  city?: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  area: number;
  estimatedCost: number;
  dealerId: string;
  dealerName: string;
  status: ProjectStatus;
  lastUpdate: string;
  description?: string;
  failReason?: string;
  drawFiles?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadTime: string;
  }>;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  dealerId: string;
  createdAt: string;
  deliveryAddress?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  company: string;
  projectType: string;
  area: number;
  budget: string;
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  company: string;
  role: UserRole;
  level?: DealerLevel;
  province: string;
  city?: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  totalPoints: number;
  /** 微信 openid（绑定微信登录后存在） */
  openid?: string;
  /** 微信昵称 */
  wechatName?: string;
  /** 微信头像 URL */
  wechatAvatar?: string;
}

/** 系统消息类型 */
export type SystemMessageType = 'audit' | 'order' | 'project' | 'exchange';

/** 系统消息 */
export interface SystemMessage {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: SystemMessageType;
  read: boolean;
  createTime: string;
  /** 点击跳转的业务页面 key（与 App.tsx currentPage 对应） */
  jumpPage?: string;
}

export type PointRecordType = 'upload_case' | 'project_report' | 'order' | 'redeem' | 'admin_adjust';

export interface PointRecord {
  id: string;
  userId: string;
  type: PointRecordType;
  amount: number;
  description: string;
  relatedId?: string;
  createdAt: string;
}

export type CaseStatus = 'pending' | 'approved' | 'rejected';

export interface ProjectCase {
  id: string;
  dealerId: string;
  dealerName: string;
  name: string;
  location: string;
  type: string;
  area: number;
  productId: string;
  productName: string;
  description: string;
  images: string[];
  status: CaseStatus;
  rejectReason?: string;
  createdAt: string;
  approvedAt?: string;
  pointsAwarded?: number;
}

export type ProductStatus = 'up' | 'down';

/**
 * SDC 轻强混凝土装饰挂板完整数据模型（后台管理用）
 * 包含九大分类、规格、多图、库存、上下架等完整字段
 */
export interface SdcProduct {
  id: string;
  /** 产品名称 */
  name: string;
  /** 产品编号/品号 */
  code: string;
  /** 产品分类（九大分类） */
  category: string;
  /** 厚度描述（固定18mm中空） */
  thickness: string;
  /** 尺寸规格（如 2400×1200mm） */
  spec: string;
  /** 基准指导价（元/㎡） */
  basePrice: number;
  /** 产品主图 URL */
  coverImg: string;
  /** 详情多图 URL 列表 */
  detailImgs: string[];
  /** 产品简介 */
  description: string;
  /** 应用场景标签 */
  applications: string[];
  /** 库存数量（㎡） */
  stock: number;
  /** 上下架状态 */
  status: ProductStatus;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/** 新增/编辑 SDC 产品入参 */
export interface SdcProductForm {
  name: string;
  code: string;
  category: string;
  thickness: string;
  spec: string;
  basePrice: number;
  coverImg: string;
  detailImgs: string[];
  description: string;
  applications: string[];
  stock: number;
  status: ProductStatus;
}

export interface SampleProduct {
  id: string;
  name: string;
  code: string;
  category: string;
  spec: string;
  basePrice: number;
  coverImg: string;
  description: string;
  parentProductId: string;
  parentProductName: string;
  stock: number;
  status: ProductStatus;
  createTime: string;
  updateTime: string;
}

export interface SampleProductForm {
  name: string;
  code: string;
  category: string;
  spec: string;
  basePrice: number;
  coverImg: string;
  description: string;
  parentProductId: string;
  stock: number;
  status: ProductStatus;
}

export type SampleSalesStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed';

export interface SampleSalesRecord {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  sampleItems: {
    sampleId: string;
    sampleName: string;
    sampleCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  shippingFee: number;
  actualPayment: number;
  status: SampleSalesStatus;
  createTime: string;
  updateTime: string;
}

export interface SampleSalesForm {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  sampleItems: {
    sampleId: string;
    quantity: number;
  }[];
  shippingFee: number;
}

export interface PointExchangeRecord {
  id: string;
  userId: string;
  userName: string;
  goodsId: string;
  goodsName: string;
  consumePoints: number;
  receiveAddress: string;
  createTime: string;
  shipStatus: 'pending' | 'shipped';
}