import type {
  User,
  Dealer,
  Project,
  Order,
  Inquiry,
  PointRecord,
  ProjectCase,
  PointGoods,
  PointExchangeRecord,
  Product,
  Case,
  DealerLevel,
  ProjectStatus,
  OrderStatus,
  CaseStatus,
} from '@/types';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export interface RegisterParams {
  name: string;
  phone: string;
  company: string;
  level: DealerLevel;
  province: string;
  city?: string;
  password: string;
}

export interface DealerQueryParams {
  status?: 'pending' | 'approved' | 'rejected';
  level?: DealerLevel;
  page?: number;
  pageSize?: number;
}

export interface ProjectQueryParams {
  dealerId?: string;
  status?: ProjectStatus;
  page?: number;
  pageSize?: number;
}

export interface OrderQueryParams {
  dealerId?: string;
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
}

export interface CaseQueryParams {
  dealerId?: string;
  status?: CaseStatus;
  page?: number;
  pageSize?: number;
}

export interface PointRecordQueryParams {
  userId?: string;
  type?: PointRecord['type'];
  page?: number;
  pageSize?: number;
}

export interface ExchangeRecordQueryParams {
  userId?: string;
  shipStatus?: 'pending' | 'shipped';
  page?: number;
  pageSize?: number;
}

export interface AddProjectParams {
  name: string;
  location: string;
  type: string;
  area: number;
  estimatedCost: number;
  dealerId: string;
  description?: string;
  drawFiles?: Project['drawFiles'];
}

export interface UpdateProjectParams {
  status?: ProjectStatus;
  failReason?: string;
  description?: string;
}

export interface AddOrderParams {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  dealerId: string;
  deliveryAddress?: string;
}

export interface AddInquiryParams {
  name: string;
  phone: string;
  company?: string;
  projectType: string;
  area: number;
  budget?: string;
  description?: string;
}

export interface UploadCaseParams {
  name: string;
  location: string;
  type: string;
  area: number;
  productId: string;
  productName: string;
  description: string;
  images: string[];
}

export interface RejectCaseParams {
  caseId: string;
  reason: string;
}

export interface AddPointGoodsParams {
  name: string;
  coverImg: string;
  needPoints: number;
  stock: number;
  desc: string;
}

export interface UpdatePointGoodsParams {
  name?: string;
  coverImg?: string;
  needPoints?: number;
  stock?: number;
  desc?: string;
  status?: 'up' | 'down';
}

export interface RedeemParams {
  goodsId: string;
  receiveAddress: string;
}

export interface UpdateDiscountParams {
  provincial: number;
  city: number;
}

export interface UploadFileResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadTime: string;
}

export type ApiList<T> = T[];
export type { User, Dealer, Project, Order, Inquiry, PointRecord, ProjectCase, PointGoods, PointExchangeRecord, Product, Case };
