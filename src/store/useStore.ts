import { create } from 'zustand';
import { User, Project, Order, Inquiry, Dealer, PointRecord, ProjectCase } from '@/types';
import { projects as mockProjects, orders as mockOrders, dealers, inquiries as mockInquiries } from '@/data/mockData';
import { PRICE_DISCOUNTS, POINT_RULES } from '@/constants';

interface DiscountConfig {
  provincial: number;
  city: number;
}

interface Store {
  user: User | null;
  isLoggedIn: boolean;
  projects: Project[];
  orders: Order[];
  inquiries: Inquiry[];
  dealerList: Dealer[];
  discounts: DiscountConfig;
  pointRecords: PointRecord[];
  myCases: ProjectCase[];
  pendingCases: ProjectCase[];

  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<boolean>;

  isAdmin: () => boolean;
  isProvincial: () => boolean;
  isCityDealer: () => boolean;

  addProject: (project: any) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  approveProject: (projectId: string) => void;

  addOrder: (order: any) => void;
  updateOrderStatus: (orderId: string, status: string) => void;

  addInquiry: (inquiry: any) => void;

  approveDealer: (dealerId: string) => void;
  rejectDealer: (dealerId: string) => void;

  updateDiscount: (level: 'provincial' | 'city', discount: number) => void;
  getDiscount: (level: 'admin' | 'provincial' | 'city') => number;

  addPoints: (amount: number, description: string, type: PointRecord['type'], relatedId?: string) => void;
  getPointRecords: () => PointRecord[];

  uploadCase: (caseData: Omit<ProjectCase, 'id' | 'dealerId' | 'dealerName' | 'status' | 'createdAt'>) => void;
  approveCase: (caseId: string) => void;
  rejectCase: (caseId: string, reason: string) => void;
  getMyCases: () => ProjectCase[];
}

const adminUser: User = {
  id: 'admin-001',
  name: '管理员',
  phone: '13900000000',
  company: '曜之岩（广州）建材科技有限公司',
  role: 'admin',
  province: '广东省',
  city: '广州市',
  status: 'approved',
  points: 0,
  totalPoints: 0,
};

const mockPointRecords: PointRecord[] = [];

const mockMyCases: ProjectCase[] = [];

export const useStore = create<Store>((set, get) => ({
  user: null,
  isLoggedIn: false,
  projects: mockProjects,
  orders: mockOrders,
  inquiries: mockInquiries,
  dealerList: dealers,
  discounts: {
    provincial: PRICE_DISCOUNTS.provincial,
    city: PRICE_DISCOUNTS.city,
  },
  pointRecords: mockPointRecords,
  myCases: mockMyCases,
  pendingCases: [],

  login: async (phone, password) => {
    if (phone === '13900000000' && password === '123456') {
      set({ user: adminUser, isLoggedIn: true });
      return true;
    }

    const dealer = dealers.find(d => d.phone === phone);
    if (dealer && password === '123456') {
      set({
        user: {
          id: dealer.id,
          name: dealer.name,
          phone: dealer.phone,
          company: dealer.company,
          role: dealer.level,
          level: dealer.level,
          province: dealer.province,
          city: dealer.city,
          status: dealer.status,
          points: 1280,
          totalPoints: 2280,
        },
        isLoggedIn: true,
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
  },

  register: async (data) => {
    const existingDealer = dealers.find(d => d.phone === data.phone);
    if (existingDealer) {
      return false;
    }
    const newDealer: Dealer = {
      id: `dealer-${Date.now()}`,
      name: data.name,
      company: data.company,
      phone: data.phone,
      level: data.level,
      province: data.province,
      city: data.city,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ dealerList: [...state.dealerList, newDealer] }));
    return true;
  },

  isAdmin: () => {
    return get().user?.role === 'admin';
  },

  isProvincial: () => {
    return get().user?.role === 'provincial';
  },

  isCityDealer: () => {
    return get().user?.role === 'city';
  },

  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      dealerName: get().user?.name || '当前用户',
      status: 'pending',
      lastUpdate: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ projects: [newProject, ...state.projects] }));

    const userId = get().user?.id;
    if (userId) {
      get().addPoints(POINT_RULES.project_report, '项目报备奖励', 'project_report', newProject.id);
    }
  },

  updateProject: (projectId, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : p
      ),
    }));
  },

  approveProject: (projectId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, status: 'approved', lastUpdate: new Date().toISOString().split('T')[0] } : p
      ),
    }));
  },

  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));

    const userId = get().user?.id;
    if (userId && newOrder.totalPrice) {
      const points = Math.floor(newOrder.totalPrice / 1000) * POINT_RULES.order_per_1000;
      if (points > 0) {
        get().addPoints(points, '订单消费奖励', 'order', newOrder.id);
      }
    }
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: status as any } : o
      ),
    }));
  },

  addInquiry: (inquiryData) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inquiry-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ inquiries: [newInquiry, ...state.inquiries] }));
  },

  approveDealer: (dealerId) => {
    set((state) => ({
      dealerList: state.dealerList.map((d) =>
        d.id === dealerId ? { ...d, status: 'approved' as const } : d
      ),
    }));
  },

  rejectDealer: (dealerId) => {
    set((state) => ({
      dealerList: state.dealerList.map((d) =>
        d.id === dealerId ? { ...d, status: 'rejected' as const } : d
      ),
    }));
  },

  updateDiscount: (level, discount) => {
    set((state) => ({
      discounts: { ...state.discounts, [level]: discount },
    }));
  },

  getDiscount: (level) => {
    const { discounts } = get();
    if (level === 'admin') return 1;
    return discounts[level] || 1;
  },

  addPoints: (amount, description, type, relatedId) => {
    const userId = get().user?.id;
    if (!userId) return;

    const record: PointRecord = {
      id: `point-${Date.now()}`,
      userId,
      type,
      amount,
      description,
      relatedId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      pointRecords: [record, ...state.pointRecords],
      user: state.user
        ? {
            ...state.user,
            points: state.user.points + amount,
            totalPoints: state.user.totalPoints + (amount > 0 ? amount : 0),
          }
        : null,
    }));
  },

  getPointRecords: () => {
    const userId = get().user?.id;
    if (!userId) return [];
    return get().pointRecords.filter((r) => r.userId === userId);
  },

  uploadCase: (caseData) => {
    const user = get().user;
    if (!user) return;

    const newCase: ProjectCase = {
      ...caseData,
      id: `case-${Date.now()}`,
      dealerId: user.id,
      dealerName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      myCases: [newCase, ...state.myCases],
      pendingCases: [newCase, ...state.pendingCases],
    }));
  },

  approveCase: (caseId) => {
    const caseItem = get().myCases.find((c) => c.id === caseId) || get().pendingCases.find((c) => c.id === caseId);
    if (!caseItem) return;

    set((state) => ({
      myCases: state.myCases.map((c) =>
        c.id === caseId
          ? { ...c, status: 'approved' as const, approvedAt: new Date().toISOString().split('T')[0], pointsAwarded: POINT_RULES.upload_case_approved }
          : c
      ),
      pendingCases: state.pendingCases.filter((c) => c.id !== caseId),
    }));

    if (caseItem.dealerId) {
      const currentUser = get().user;
      if (currentUser?.id === caseItem.dealerId) {
        get().addPoints(POINT_RULES.upload_case_approved, '项目案例审核通过奖励', 'upload_case', caseId);
      }
    }
  },

  rejectCase: (caseId, reason) => {
    set((state) => ({
      myCases: state.myCases.map((c) =>
        c.id === caseId ? { ...c, status: 'rejected' as const, rejectReason: reason } : c
      ),
      pendingCases: state.pendingCases.filter((c) => c.id !== caseId),
    }));
  },

  getMyCases: () => {
    const userId = get().user?.id;
    if (!userId) return [];
    return get().myCases.filter((c) => c.dealerId === userId);
  },
}));
