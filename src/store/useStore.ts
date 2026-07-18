import { create } from 'zustand';
import {
  User,
  Project,
  Order,
  Inquiry,
  Dealer,
  PointRecord,
  ProjectCase,
  PointGoods,
  PointExchangeRecord,
  SystemMessage,
  SdcProduct,
  SdcProductForm,
  ProductStatus,
  SampleProduct,
  SampleProductForm,
  SampleSalesRecord,
  SampleSalesForm,
  SampleSalesStatus,
} from '@/types';
import { PRICE_DISCOUNTS, POINT_RULES } from '@/constants';
import { adminUser } from '@/api/mockFallback';
import {
  authApi,
  dealerApi,
  discountApi,
  projectApi,
  orderApi,
  inquiryApi,
  caseApi,
  pointGoodsApi,
  exchangeApi,
  pointRecordApi,
  uploadApi,
  wechatApi,
  messageApi,
  sdcProductApi,
  sampleSalesApi,
  getToken,
  setToken,
  removeToken,
  setStoredUser,
  getStoredUser,
  isUseMock,
  type LoginParams,
  type RegisterParams,
  type AddProjectParams,
  type UpdateProjectParams,
  type AddOrderParams,
  type AddInquiryParams,
  type UploadCaseParams,
  type AddPointGoodsParams,
  type UpdatePointGoodsParams,
  type RedeemParams,
  type UpdateDiscountParams,
  type WechatLoginParams,
} from '@/api';

interface DiscountConfig {
  provincial: number;
  city: number;
}

interface Store {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  initialized: boolean;

  projects: Project[];
  orders: Order[];
  inquiries: Inquiry[];
  dealerList: Dealer[];
  discounts: DiscountConfig;
  pointRecords: PointRecord[];
  myCases: ProjectCase[];
  pendingCases: ProjectCase[];
  pointGoods: PointGoods[];
  exchangeRecords: PointExchangeRecord[];

  products: import('@/types').Product[];
  cases: import('@/types').Case[];

  messages: SystemMessage[];

  /** 全局消息弹窗开关 */
  notifyOpen: boolean;
  /** 未读消息数 */
  unreadCount: number;
  toggleNotify: (open?: boolean) => void;

  globalLoading: boolean;
  globalError: string | null;

  login: (phone: string, password: string) => Promise<boolean>;
  wechatLogin: (code: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterParams) => Promise<boolean>;
  initialize: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearError: () => void;

  fetchMessages: () => Promise<void>;
  markMessageRead: (messageId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearMessages: () => void;

  isAdmin: () => boolean;
  isProvincial: () => boolean;
  isCityDealer: () => boolean;

  fetchProjects: (dealerId?: string) => Promise<void>;
  fetchOrders: (dealerId?: string) => Promise<void>;
  fetchInquiries: () => Promise<void>;
  fetchDealers: () => Promise<void>;
  fetchDiscounts: () => Promise<void>;
  fetchMyCases: () => Promise<void>;
  fetchPendingCases: () => Promise<void>;
  fetchPointGoods: () => Promise<void>;
  fetchExchangeRecords: (userId?: string) => Promise<void>;
  fetchPointRecords: (userId?: string) => Promise<void>;
  fetchProducts: (params?: { category?: string; keyword?: string }) => Promise<void>;
  fetchCases: () => Promise<void>;

  sdcProducts: SdcProduct[];
  sdcProductsTotal: number;
  sdcProductsPage: number;
  sdcProductsPageSize: number;
  fetchSdcProducts: (params?: {
    category?: string;
    keyword?: string;
    status?: ProductStatus;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  addSdcProduct: (data: SdcProductForm) => Promise<SdcProduct | null>;
  updateSdcProduct: (id: string, data: Partial<SdcProductForm>) => Promise<SdcProduct | null>;
  deleteSdcProduct: (id: string) => Promise<boolean>;
  publishSdcProduct: (id: string) => Promise<SdcProduct | null>;
  unpublishSdcProduct: (id: string) => Promise<SdcProduct | null>;

  sampleProducts: SampleProduct[];
  sampleProductsTotal: number;
  sampleProductsPage: number;
  sampleProductsPageSize: number;
  sampleSalesRecords: SampleSalesRecord[];
  sampleSalesTotal: number;
  sampleSalesPage: number;
  sampleSalesPageSize: number;
  fetchSampleProducts: (params?: {
    keyword?: string;
    category?: string;
    status?: ProductStatus;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  addSampleProduct: (data: SampleProductForm) => Promise<SampleProduct | null>;
  updateSampleProduct: (id: string, data: Partial<SampleProductForm>) => Promise<SampleProduct | null>;
  deleteSampleProduct: (id: string) => Promise<boolean>;
  publishSampleProduct: (id: string) => Promise<SampleProduct | null>;
  unpublishSampleProduct: (id: string) => Promise<SampleProduct | null>;
  fetchSampleSalesRecords: (params?: {
    keyword?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;
  createSampleSale: (data: SampleSalesForm) => Promise<SampleSalesRecord | null>;
  updateSampleSaleStatus: (id: string, status: SampleSalesStatus) => Promise<SampleSalesRecord | null>;

  addProject: (project: AddProjectParams) => Promise<Project | null>;
  updateProject: (projectId: string, updates: UpdateProjectParams) => Promise<void>;
  approveProject: (projectId: string) => Promise<void>;

  addOrder: (order: AddOrderParams) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;

  addInquiry: (inquiry: AddInquiryParams) => Promise<Inquiry | null>;

  approveDealer: (dealerId: string) => Promise<void>;
  rejectDealer: (dealerId: string) => Promise<void>;

  updateDiscount: (level: 'provincial' | 'city', discount: number) => void;
  saveDiscounts: (params: UpdateDiscountParams) => Promise<void>;
  getDiscount: (level: 'admin' | 'provincial' | 'city') => number;

  addPoints: (amount: number, description: string, type: PointRecord['type'], relatedId?: string) => void;
  getPointRecords: () => PointRecord[];

  uploadCase: (caseData: UploadCaseParams) => Promise<ProjectCase | null>;
  approveCase: (caseId: string) => Promise<void>;
  rejectCase: (caseId: string, reason: string) => Promise<void>;

  addPointGoods: (goods: AddPointGoodsParams) => Promise<PointGoods | null>;
  updatePointGoods: (goodsId: string, updates: UpdatePointGoodsParams) => Promise<void>;
  redeemGoods: (goodsId: string, address: string) => Promise<boolean>;
  updateShipStatus: (recordId: string, status: 'pending' | 'shipped') => Promise<void>;

  uploadFile: (file: File) => Promise<{ fileName: string; fileUrl: string; fileSize: number; uploadTime: string } | null>;

  setMockData: () => void;
}

const mockPointRecords: PointRecord[] = [];
const mockMyCases: ProjectCase[] = [];

function applyMockData(): Partial<Store> {
  return {
    products: [],
    cases: [],
  };
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  isLoggedIn: false,
  token: getToken(),
  initialized: false,

  projects: [],
  orders: [],
  inquiries: [],
  dealerList: [],
  discounts: {
    provincial: PRICE_DISCOUNTS.provincial,
    city: PRICE_DISCOUNTS.city,
  },
  pointRecords: [],
  myCases: [],
  pendingCases: [],
  pointGoods: [],
  exchangeRecords: [],

  products: [],
  cases: [],

  sdcProducts: [],
  sdcProductsTotal: 0,
  sdcProductsPage: 1,
  sdcProductsPageSize: 10,

  sampleProducts: [],
  sampleProductsTotal: 0,
  sampleProductsPage: 1,
  sampleProductsPageSize: 10,
  sampleSalesRecords: [],
  sampleSalesTotal: 0,
  sampleSalesPage: 1,
  sampleSalesPageSize: 10,

  messages: [],

  notifyOpen: false,
  unreadCount: 0,
  toggleNotify: (open) =>
    set((state) => ({ notifyOpen: typeof open === 'boolean' ? open : !state.notifyOpen })),

  globalLoading: false,
  globalError: null,

  setMockData: () => {
    import('@/data/mockData').then(({ projects, orders, dealers, inquiries, pointGoods, exchangeRecords, sdcProducts, cases }) => {
      sdcProductApi.all().then((allSdc) => {
        set({
          projects,
          orders,
          dealerList: dealers,
          inquiries,
          pointGoods,
          exchangeRecords,
          products: sdcProducts,
          cases,
          sdcProducts: allSdc,
          sdcProductsTotal: allSdc.length,
          pointRecords: mockPointRecords,
          myCases: mockMyCases,
          pendingCases: [],
        });
      });
    });
  },

  login: async (phone, password) => {
    try {
      const result = await authApi.login({ phone, password } as LoginParams);
      setToken(result.token);
      setStoredUser(result.user);
      set({ user: result.user, isLoggedIn: true, token: result.token });
      await get().refreshAll();
      return true;
    } catch (err) {
      console.error('登录失败', err);
      return false;
    }
  },

  wechatLogin: async (code, phone) => {
    try {
      const params: WechatLoginParams = phone ? { code, phone } : { code };
      const result = await wechatApi.loginByCode(params);
      setToken(result.token);
      setStoredUser(result.user);
      set({ user: result.user, isLoggedIn: true, token: result.token });
      await get().refreshAll();
      return true;
    } catch (err) {
      console.error('微信登录失败', err);
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    removeToken();
    set({
      user: null,
      isLoggedIn: false,
      token: null,
      initialized: false,
    });
  },

  register: async (data) => {
    try {
      const result = await authApi.register(data);
      return result.success;
    } catch (err) {
      console.error('注册失败', err);
      return false;
    }
  },

  initialize: async () => {
    const token = getToken();
    if (!token) {
      set({ initialized: true });
      return;
    }

    const storedUser = getStoredUser<User>();
    if (storedUser) {
      set({ user: storedUser, isLoggedIn: true });
    }

    if (isUseMock()) {
      get().setMockData();
      set({ initialized: true });
      return;
    }

    try {
      const user = await authApi.getCurrentUser();
      setStoredUser(user);
      set({ user, isLoggedIn: true });
      await get().refreshAll();
    } catch (err) {
      console.error('初始化失败', err);
      removeToken();
    } finally {
      set({ initialized: true });
    }
  },

  refreshAll: async () => {
    const user = get().user;
    if (!user) return;

    set({ globalLoading: true });
    try {
      await Promise.all([
        get().fetchProducts(),
        get().fetchCases(),
        get().fetchProjects(user.id),
        get().fetchOrders(user.id),
        get().fetchInquiries(),
        get().fetchDiscounts(),
        get().fetchPointGoods(),
        get().fetchExchangeRecords(user.id),
        get().fetchPointRecords(user.id),
        get().fetchMyCases(),
        get().fetchPendingCases(),
        get().fetchDealers(),
        get().fetchMessages(),
      ]);
    } catch (err) {
      console.error('刷新数据失败', err);
    } finally {
      set({ globalLoading: false });
    }
  },

  clearError: () => set({ globalError: null }),

  fetchMessages: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const list = await messageApi.list(user.id);
      const unread = list.filter((m) => !m.read).length;
      set({ messages: list, unreadCount: unread });
    } catch (err) {
      console.error('拉取消息失败', err);
    }
  },

  markMessageRead: async (messageId) => {
    try {
      await messageApi.markRead(messageId);
      set((state) => {
        const messages = state.messages.map((m) =>
          m.id === messageId ? { ...m, read: true } : m
        );
        return { messages, unreadCount: messages.filter((m) => !m.read).length };
      });
    } catch (err) {
      console.error('标记消息已读失败', err);
    }
  },

  markAllRead: async () => {
    const user = get().user;
    if (!user) return;
    try {
      await messageApi.markAllRead(user.id);
      set((state) => ({
        messages: state.messages.map((m) => ({ ...m, read: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('全部标记已读失败', err);
    }
  },

  clearMessages: () => set({ messages: [], unreadCount: 0 }),

  isAdmin: () => get().user?.role === 'admin',
  isProvincial: () => get().user?.role === 'provincial',
  isCityDealer: () => get().user?.role === 'city',

  fetchProjects: async (dealerId) => {
    try {
      const list = await projectApi.list({ dealerId });
      set({ projects: list });
    } catch (err) {
      console.error('拉取项目失败', err);
    }
  },

  fetchOrders: async (dealerId) => {
    try {
      const list = await orderApi.list({ dealerId });
      set({ orders: list });
    } catch (err) {
      console.error('拉取订单失败', err);
    }
  },

  fetchInquiries: async () => {
    try {
      const list = await inquiryApi.list();
      set({ inquiries: list });
    } catch (err) {
      console.error('拉取询价失败', err);
    }
  },

  fetchDealers: async () => {
    try {
      const result = await dealerApi.list();
      const list = Array.isArray(result) ? result : result.list;
      set({ dealerList: list });
    } catch (err) {
      console.error('拉取经销商失败', err);
    }
  },

  fetchDiscounts: async () => {
    try {
      const result = await discountApi.get();
      set({ discounts: result });
    } catch (err) {
      console.error('拉取折扣失败', err);
    }
  },

  fetchMyCases: async () => {
    try {
      const userId = get().user?.id;
      const list = await caseApi.myList({ dealerId: userId });
      set({ myCases: list });
    } catch (err) {
      console.error('拉取我的案例失败', err);
    }
  },

  fetchPendingCases: async () => {
    try {
      const list = await caseApi.pendingList();
      set({ pendingCases: list });
    } catch (err) {
      console.error('拉取待审核案例失败', err);
    }
  },

  fetchPointGoods: async () => {
    try {
      const list = await pointGoodsApi.list();
      set({ pointGoods: list });
    } catch (err) {
      console.error('拉取积分商品失败', err);
    }
  },

  fetchExchangeRecords: async (userId) => {
    try {
      const list = await exchangeApi.list({ userId });
      set({ exchangeRecords: list });
    } catch (err) {
      console.error('拉取兑换记录失败', err);
    }
  },

  fetchPointRecords: async (userId) => {
    try {
      const list = await pointRecordApi.list({ userId });
      set({ pointRecords: list });
    } catch (err) {
      console.error('拉取积分记录失败', err);
    }
  },

  fetchProducts: async (params) => {
    try {
      const list = await import('@/api').then((m) => m.productApi.list(params));
      set({ products: list });
    } catch (err) {
      console.error('拉取产品失败', err);
    }
  },

  fetchCases: async () => {
    try {
      const list = await import('@/api').then((m) => m.officialCaseApi.list());
      set({ cases: list });
    } catch (err) {
      console.error('拉取案例失败', err);
    }
  },

  fetchSdcProducts: async (params) => {
    try {
      const result = await sdcProductApi.list(params);
      set({
        sdcProducts: result.list,
        sdcProductsTotal: result.total,
        sdcProductsPage: result.page,
        sdcProductsPageSize: result.pageSize,
      });
    } catch (err) {
      console.error('拉取 SDC 产品失败', err);
    }
  },

  addSdcProduct: async (data) => {
    try {
      const newProduct = await sdcProductApi.create(data);
      set((state) => ({
        sdcProducts: [newProduct, ...state.sdcProducts],
        sdcProductsTotal: state.sdcProductsTotal + 1,
      }));
      return newProduct;
    } catch (err) {
      console.error('新增产品失败', err);
      return null;
    }
  },

  updateSdcProduct: async (id, data) => {
    try {
      const updated = await sdcProductApi.update(id, data);
      set((state) => ({
        sdcProducts: state.sdcProducts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      console.error('更新产品失败', err);
      return null;
    }
  },

  deleteSdcProduct: async (id) => {
    try {
      await sdcProductApi.remove(id);
      set((state) => ({
        sdcProducts: state.sdcProducts.filter((p) => p.id !== id),
        sdcProductsTotal: state.sdcProductsTotal - 1,
      }));
      return true;
    } catch (err) {
      console.error('删除产品失败', err);
      return false;
    }
  },

  publishSdcProduct: async (id) => {
    try {
      const updated = await sdcProductApi.publish(id);
      set((state) => ({
        sdcProducts: state.sdcProducts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      console.error('上架产品失败', err);
      return null;
    }
  },

  unpublishSdcProduct: async (id) => {
    try {
      const updated = await sdcProductApi.unpublish(id);
      set((state) => ({
        sdcProducts: state.sdcProducts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      console.error('下架产品失败', err);
      return null;
    }
  },

  fetchSampleProducts: async (params) => {
    try {
      const result = await sampleSalesApi.listProducts({
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        keyword: params?.keyword,
        category: params?.category,
        status: params?.status,
      });
      set({
        sampleProducts: result.list,
        sampleProductsTotal: result.total,
        sampleProductsPage: result.page,
        sampleProductsPageSize: result.pageSize,
      });
    } catch (err) {
      console.error('获取样品列表失败', err);
    }
  },

  addSampleProduct: async (data) => {
    try {
      const newProduct = await sampleSalesApi.createProduct(data);
      set((state) => ({
        sampleProducts: [newProduct, ...state.sampleProducts],
        sampleProductsTotal: state.sampleProductsTotal + 1,
      }));
      return newProduct;
    } catch (err) {
      console.error('新增样品失败', err);
      return null;
    }
  },

  updateSampleProduct: async (id, data) => {
    try {
      const updated = await sampleSalesApi.updateProduct(id, data);
      set((state) => ({
        sampleProducts: state.sampleProducts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      console.error('更新样品失败', err);
      return null;
    }
  },

  deleteSampleProduct: async (id) => {
    try {
      await sampleSalesApi.deleteProduct(id);
      set((state) => ({
        sampleProducts: state.sampleProducts.filter((p) => p.id !== id),
        sampleProductsTotal: state.sampleProductsTotal - 1,
      }));
      return true;
    } catch (err) {
      console.error('删除样品失败', err);
      return false;
    }
  },

  publishSampleProduct: async (id) => {
    try {
      const updated = await sampleSalesApi.publishProduct(id);
      set((state) => ({
        sampleProducts: state.sampleProducts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      console.error('上架样品失败', err);
      return null;
    }
  },

  unpublishSampleProduct: async (id) => {
    try {
      const updated = await sampleSalesApi.unpublishProduct(id);
      set((state) => ({
        sampleProducts: state.sampleProducts.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      console.error('下架样品失败', err);
      return null;
    }
  },

  fetchSampleSalesRecords: async (params) => {
    try {
      const result = await sampleSalesApi.listSales({
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        keyword: params?.keyword,
        status: params?.status,
      });
      set({
        sampleSalesRecords: result.list,
        sampleSalesTotal: result.total,
        sampleSalesPage: result.page,
        sampleSalesPageSize: result.pageSize,
      });
    } catch (err) {
      console.error('获取销售记录失败', err);
    }
  },

  createSampleSale: async (data) => {
    try {
      const newRecord = await sampleSalesApi.createSales(data);
      set((state) => ({
        sampleSalesRecords: [newRecord, ...state.sampleSalesRecords],
        sampleSalesTotal: state.sampleSalesTotal + 1,
      }));
      return newRecord;
    } catch (err) {
      console.error('创建销售订单失败', err);
      return null;
    }
  },

  updateSampleSaleStatus: async (id, status) => {
    try {
      const updated = await sampleSalesApi.updateSalesStatus(id, status);
      set((state) => ({
        sampleSalesRecords: state.sampleSalesRecords.map((r) => (r.id === id ? updated : r)),
      }));
      return updated;
    } catch (err) {
      console.error('更新销售状态失败', err);
      return null;
    }
  },

  addProject: async (projectData) => {
    try {
      const newProject = await projectApi.create(projectData);
      set((state) => ({ projects: [newProject, ...state.projects] }));
      const userId = get().user?.id;
      if (userId) {
        get().addPoints(POINT_RULES.project_report, '项目报备奖励', 'project_report', newProject.id);
      }
      return newProject;
    } catch (err) {
      console.error('新增项目失败', err);
      return null;
    }
  },

  updateProject: async (projectId, updates) => {
    try {
      await projectApi.update(projectId, updates);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : p
        ),
      }));
    } catch (err) {
      console.error('更新项目失败', err);
    }
  },

  approveProject: async (projectId) => {
    try {
      await projectApi.approve(projectId);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, status: 'approved', lastUpdate: new Date().toISOString().split('T')[0] } : p
        ),
      }));
    } catch (err) {
      console.error('审核项目失败', err);
    }
  },

  addOrder: async (orderData) => {
    try {
      const newOrder = await orderApi.create(orderData);
      set((state) => ({ orders: [newOrder, ...state.orders] }));

      const userId = get().user?.id;
      if (userId && newOrder.totalPrice) {
        const points = Math.floor(newOrder.totalPrice / 1000) * POINT_RULES.order_per_1000;
        if (points > 0) {
          get().addPoints(points, '订单消费奖励', 'order', newOrder.id);
        }
      }
      return newOrder;
    } catch (err) {
      console.error('新增订单失败', err);
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: status as Order['status'] } : o
        ),
      }));
    } catch (err) {
      console.error('更新订单状态失败', err);
    }
  },

  addInquiry: async (inquiryData) => {
    try {
      const newInquiry = await inquiryApi.create(inquiryData);
      set((state) => ({ inquiries: [newInquiry, ...state.inquiries] }));
      return newInquiry;
    } catch (err) {
      console.error('新增询价失败', err);
      return null;
    }
  },

  approveDealer: async (dealerId) => {
    try {
      await dealerApi.approve(dealerId);
      set((state) => ({
        dealerList: state.dealerList.map((d) =>
          d.id === dealerId ? { ...d, status: 'approved' as const } : d
        ),
      }));
    } catch (err) {
      console.error('审核经销商失败', err);
    }
  },

  rejectDealer: async (dealerId) => {
    try {
      await dealerApi.reject(dealerId);
      set((state) => ({
        dealerList: state.dealerList.map((d) =>
          d.id === dealerId ? { ...d, status: 'rejected' as const } : d
        ),
      }));
    } catch (err) {
      console.error('驳回经销商失败', err);
    }
  },

  updateDiscount: (level, discount) => {
    set((state) => ({
      discounts: { ...state.discounts, [level]: discount },
    }));
  },

  saveDiscounts: async (params: UpdateDiscountParams) => {
    try {
      await discountApi.update(params);
      set({ discounts: params });
    } catch (err) {
      console.error('保存折扣失败', err);
    }
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

  uploadCase: async (caseData) => {
    try {
      const newCase = await caseApi.upload(caseData);
      set((state) => ({
        myCases: [newCase, ...state.myCases],
        pendingCases: [newCase, ...state.pendingCases],
      }));
      return newCase;
    } catch (err) {
      console.error('上传案例失败', err);
      return null;
    }
  },

  approveCase: async (caseId) => {
    try {
      await caseApi.approve(caseId);
      set((state) => ({
        myCases: state.myCases.map((c) =>
          c.id === caseId
            ? { ...c, status: 'approved' as const, approvedAt: new Date().toISOString().split('T')[0], pointsAwarded: POINT_RULES.upload_case_approved }
            : c
        ),
        pendingCases: state.pendingCases.filter((c) => c.id !== caseId),
      }));

      const caseItem = get().myCases.find((c) => c.id === caseId);
      if (caseItem?.dealerId) {
        const currentUser = get().user;
        if (currentUser?.id === caseItem.dealerId) {
          get().addPoints(POINT_RULES.upload_case_approved, '项目案例审核通过奖励', 'upload_case', caseId);
        }
      }
    } catch (err) {
      console.error('审核案例失败', err);
    }
  },

  rejectCase: async (caseId, reason) => {
    try {
      await caseApi.reject({ caseId, reason });
      set((state) => ({
        myCases: state.myCases.map((c) =>
          c.id === caseId ? { ...c, status: 'rejected' as const, rejectReason: reason } : c
        ),
        pendingCases: state.pendingCases.filter((c) => c.id !== caseId),
      }));
    } catch (err) {
      console.error('驳回案例失败', err);
    }
  },

  addPointGoods: async (goods) => {
    try {
      const newGoods = await pointGoodsApi.create(goods);
      set((state) => ({ pointGoods: [newGoods, ...state.pointGoods] }));
      return newGoods;
    } catch (err) {
      console.error('新增积分商品失败', err);
      return null;
    }
  },

  updatePointGoods: async (goodsId, updates) => {
    try {
      await pointGoodsApi.update(goodsId, updates);
      set((state) => ({
        pointGoods: state.pointGoods.map((g) =>
          g.id === goodsId ? { ...g, ...updates } : g
        ),
      }));
    } catch (err) {
      console.error('更新积分商品失败', err);
    }
  },

  redeemGoods: async (goodsId, address) => {
    const user = get().user;
    if (!user) return false;

    const goods = get().pointGoods.find((g) => g.id === goodsId);
    if (!goods || goods.stock <= 0 || user.points < goods.needPoints) return false;

    try {
      const newRecord = await exchangeApi.redeem({ goodsId, receiveAddress: address } as RedeemParams);
      set((state) => ({
        exchangeRecords: [newRecord, ...state.exchangeRecords],
        pointGoods: state.pointGoods.map((g) =>
          g.id === goodsId ? { ...g, stock: g.stock - 1 } : g
        ),
        user: state.user
          ? {
              ...state.user,
              points: state.user.points - goods.needPoints,
            }
          : null,
      }));

      get().addPoints(-goods.needPoints, `兑换${goods.name}`, 'redeem', goodsId);
      return true;
    } catch (err) {
      console.error('兑换失败', err);
      return false;
    }
  },

  updateShipStatus: async (recordId, status) => {
    try {
      await exchangeApi.updateShipStatus(recordId, status);
      set((state) => ({
        exchangeRecords: state.exchangeRecords.map((r) =>
          r.id === recordId ? { ...r, shipStatus: status } : r
        ),
      }));
    } catch (err) {
      console.error('更新发货状态失败', err);
    }
  },

  uploadFile: async (file) => {
    try {
      return await uploadApi.uploadFile(file);
    } catch (err) {
      console.error('文件上传失败', err);
      return null;
    }
  },
}));

if (isUseMock()) {
  useStore.getState().setMockData();
}
