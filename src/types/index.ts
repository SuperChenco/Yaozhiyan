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