import { request, buildQuery, isUseMock } from './request';
import type { SampleProduct, SampleProductForm, SampleSalesRecord, SampleSalesForm, SampleSalesStatus, ProductStatus } from '@/types';

const USE_MOCK = isUseMock();

export interface SampleProductQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  status?: ProductStatus;
}

export interface SampleProductPageResult {
  list: SampleProduct[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SampleSalesQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}

export interface SampleSalesPageResult {
  list: SampleSalesRecord[];
  total: number;
  page: number;
  pageSize: number;
}

const mockSampleProducts: SampleProduct[] = [
  {
    id: 'smp001',
    name: 'SDC-平板无涂装样品',
    code: 'SDC-SMP-P01',
    category: '平板系列',
    spec: '300×300×18mm',
    basePrice: 50,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=light%20gray%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '标准平板样品，无涂装处理，展示基材质感',
    parentProductId: 'prod001',
    parentProductName: 'SDC-平板无涂装',
    stock: 200,
    status: 'up',
    createTime: '2026-01-15 10:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp002',
    name: 'SDC-乳白样品',
    code: 'SDC-SMP-P02',
    category: '平板系列',
    spec: '300×300×18mm',
    basePrice: 55,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ivory%20white%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '乳白色平板样品，适合室内墙面装饰',
    parentProductId: 'prod002',
    parentProductName: 'SDC-平板乳白',
    stock: 180,
    status: 'up',
    createTime: '2026-01-15 10:05:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp003',
    name: 'SDC-流木样品',
    code: 'SDC-SMP-W01',
    category: '木纹系列',
    spec: '300×300×18mm',
    basePrice: 60,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wood%20grain%20texture%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '流畅木纹纹理样品，自然质感',
    parentProductId: 'prod005',
    parentProductName: 'SDC-木纹流木',
    stock: 150,
    status: 'up',
    createTime: '2026-01-16 09:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp004',
    name: 'SDC-竖木样品',
    code: 'SDC-SMP-W02',
    category: '木纹系列',
    spec: '300×300×18mm',
    basePrice: 60,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vertical%20wood%20grain%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '竖向木纹纹理样品',
    parentProductId: 'prod006',
    parentProductName: 'SDC-木纹竖木',
    stock: 140,
    status: 'up',
    createTime: '2026-01-16 09:05:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp005',
    name: 'SDC-细条纹样品',
    code: 'SDC-SMP-S01',
    category: '条纹系列',
    spec: '300×300×18mm',
    basePrice: 58,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fine%20striped%20pattern%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '细密条纹纹理样品',
    parentProductId: 'prod009',
    parentProductName: 'SDC-条纹细条纹',
    stock: 160,
    status: 'up',
    createTime: '2026-01-17 10:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp006',
    name: 'SDC-菱格立体样品',
    code: 'SDC-SMP-D01',
    category: '立体系列',
    spec: '300×300×18mm',
    basePrice: 70,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=diamond%20pattern%203D%20texture%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '菱形格立体纹理样品',
    parentProductId: 'prod012',
    parentProductName: 'SDC-立体菱格',
    stock: 120,
    status: 'up',
    createTime: '2026-01-18 09:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp007',
    name: 'SDC-清水浅灰样品',
    code: 'SDC-SMP-Q01',
    category: '清水系列',
    spec: '300×300×18mm',
    basePrice: 55,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=light%20gray%20plain%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '清水混凝土浅灰色样品',
    parentProductId: 'prod015',
    parentProductName: 'SDC-清水浅灰',
    stock: 180,
    status: 'up',
    createTime: '2026-01-19 10:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp008',
    name: 'SDC-大理石白样品',
    code: 'SDC-SMP-M01',
    category: '石纹系列',
    spec: '300×300×18mm',
    basePrice: 65,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20marble%20pattern%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '白色大理石纹理样品',
    parentProductId: 'prod017',
    parentProductName: 'SDC-石纹大理石白',
    stock: 130,
    status: 'up',
    createTime: '2026-01-20 09:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp009',
    name: 'SDC-亚麻布纹样品',
    code: 'SDC-SMP-F01',
    category: '布纹系列',
    spec: '300×300×18mm',
    basePrice: 62,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=linen%20fabric%20texture%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '亚麻布纹纹理样品',
    parentProductId: 'prod021',
    parentProductName: 'SDC-布纹亚麻',
    stock: 150,
    status: 'up',
    createTime: '2026-01-21 10:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp010',
    name: 'SDC-拉丝银样品',
    code: 'SDC-SMP-MT01',
    category: '金属系列',
    spec: '300×300×18mm',
    basePrice: 75,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brushed%20silver%20metal%20texture%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '拉丝银色金属纹理样品',
    parentProductId: 'prod023',
    parentProductName: 'SDC-金属拉丝银',
    stock: 80,
    status: 'up',
    createTime: '2026-01-22 09:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp011',
    name: 'SDC-定制异形样品',
    code: 'SDC-SMP-C01',
    category: '定制系列',
    spec: '200×200×18mm',
    basePrice: 100,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=custom%20irregular%20shape%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '定制异形样品，需提前沟通',
    parentProductId: 'prod026',
    parentProductName: 'SDC-定制异形板',
    stock: 30,
    status: 'down',
    createTime: '2026-02-01 10:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
  {
    id: 'smp012',
    name: 'SDC-透光样品',
    code: 'SDC-SMP-C02',
    category: '定制系列',
    spec: '200×200×18mm',
    basePrice: 120,
    coverImg: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=translucent%20glowing%20concrete%20panel%20sample%20tile%20on%20white%20background&image_size=square',
    description: '透光混凝土样品',
    parentProductId: 'prod027',
    parentProductName: 'SDC-定制透光板',
    stock: 20,
    status: 'down',
    createTime: '2026-02-02 10:00:00',
    updateTime: '2026-06-20 14:30:00',
  },
];

const mockSampleSalesRecords: SampleSalesRecord[] = [
  {
    id: 'ssl001',
    orderNo: 'SS20260601001',
    customerName: '张经理',
    customerPhone: '138****1234',
    customerAddress: '上海市浦东新区XX路XX号',
    sampleItems: [
      { sampleId: 'smp001', sampleName: 'SDC-平板无涂装样品', sampleCode: 'SDC-SMP-P01', quantity: 5, unitPrice: 50, totalPrice: 250 },
      { sampleId: 'smp003', sampleName: 'SDC-流木样品', sampleCode: 'SDC-SMP-W01', quantity: 3, unitPrice: 60, totalPrice: 180 },
    ],
    totalAmount: 430,
    shippingFee: 15,
    actualPayment: 445,
    status: 'completed',
    createTime: '2026-06-01 10:30:00',
    updateTime: '2026-06-05 14:00:00',
  },
  {
    id: 'ssl002',
    orderNo: 'SS20260605001',
    customerName: '李总',
    customerPhone: '139****5678',
    customerAddress: '北京市朝阳区XX街道XX号',
    sampleItems: [
      { sampleId: 'smp008', sampleName: 'SDC-大理石白样品', sampleCode: 'SDC-SMP-M01', quantity: 4, unitPrice: 65, totalPrice: 260 },
      { sampleId: 'smp010', sampleName: 'SDC-拉丝银样品', sampleCode: 'SDC-SMP-MT01', quantity: 2, unitPrice: 75, totalPrice: 150 },
      { sampleId: 'smp007', sampleName: 'SDC-清水浅灰样品', sampleCode: 'SDC-SMP-Q01', quantity: 3, unitPrice: 55, totalPrice: 165 },
    ],
    totalAmount: 575,
    shippingFee: 20,
    actualPayment: 595,
    status: 'delivered',
    createTime: '2026-06-05 11:00:00',
    updateTime: '2026-06-12 10:00:00',
  },
  {
    id: 'ssl003',
    orderNo: 'SS20260610001',
    customerName: '王老板',
    customerPhone: '137****9012',
    customerAddress: '广州市天河区XX路XX号',
    sampleItems: [
      { sampleId: 'smp006', sampleName: 'SDC-菱格立体样品', sampleCode: 'SDC-SMP-D01', quantity: 6, unitPrice: 70, totalPrice: 420 },
    ],
    totalAmount: 420,
    shippingFee: 18,
    actualPayment: 438,
    status: 'shipped',
    createTime: '2026-06-10 14:00:00',
    updateTime: '2026-06-15 09:00:00',
  },
  {
    id: 'ssl004',
    orderNo: 'SS20260618001',
    customerName: '陈总监',
    customerPhone: '136****3456',
    customerAddress: '深圳市南山区XX科技园',
    sampleItems: [
      { sampleId: 'smp002', sampleName: 'SDC-乳白样品', sampleCode: 'SDC-SMP-P02', quantity: 10, unitPrice: 55, totalPrice: 550 },
      { sampleId: 'smp004', sampleName: 'SDC-竖木样品', sampleCode: 'SDC-SMP-W02', quantity: 5, unitPrice: 60, totalPrice: 300 },
    ],
    totalAmount: 850,
    shippingFee: 25,
    actualPayment: 875,
    status: 'paid',
    createTime: '2026-06-18 09:30:00',
    updateTime: '2026-06-18 10:00:00',
  },
  {
    id: 'ssl005',
    orderNo: 'SS20260620001',
    customerName: '赵经理',
    customerPhone: '135****7890',
    customerAddress: '成都市锦江区XX路XX号',
    sampleItems: [
      { sampleId: 'smp005', sampleName: 'SDC-细条纹样品', sampleCode: 'SDC-SMP-S01', quantity: 8, unitPrice: 58, totalPrice: 464 },
      { sampleId: 'smp009', sampleName: 'SDC-亚麻布纹样品', sampleCode: 'SDC-SMP-F01', quantity: 4, unitPrice: 62, totalPrice: 248 },
    ],
    totalAmount: 712,
    shippingFee: 22,
    actualPayment: 734,
    status: 'pending',
    createTime: '2026-06-20 15:00:00',
    updateTime: '2026-06-20 15:00:00',
  },
];

let mockSampleProductsStore = [...mockSampleProducts];
let mockSampleSalesStore = [...mockSampleSalesRecords];

function mockSampleProductList(params?: SampleProductQuery): SampleProductPageResult {
  let filtered = [...mockSampleProductsStore];
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(kw) || p.code.toLowerCase().includes(kw));
  }
  if (params?.category && params.category !== 'all') {
    filtered = filtered.filter(p => p.category === params.category);
  }
  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter(p => p.status === params.status);
  }
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
  };
}

function mockSampleSalesList(params?: SampleSalesQuery): SampleSalesPageResult {
  let filtered = [...mockSampleSalesStore];
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(r => r.orderNo.toLowerCase().includes(kw) || r.customerName.toLowerCase().includes(kw));
  }
  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter(r => r.status === params.status);
  }
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
  };
}

export const sampleSalesApi = {
  async listProducts(params?: SampleProductQuery): Promise<SampleProductPageResult> {
    if (USE_MOCK) {
      return mockSampleProductList(params);
    }
    const query = buildQuery(params as Record<string, unknown> || {});
    return request<SampleProductPageResult>(`/admin/sample/products${query}`);
  },

  async allProducts(): Promise<SampleProduct[]> {
    if (USE_MOCK) {
      return mockSampleProductsStore;
    }
    return request<SampleProduct[]>('/admin/sample/products/all');
  },

  async productDetail(id: string): Promise<SampleProduct> {
    if (USE_MOCK) {
      const found = mockSampleProductsStore.find(p => p.id === id);
      if (!found) throw new Error('样品不存在');
      return found;
    }
    return request<SampleProduct>(`/admin/sample/products/${id}`);
  },

  async createProduct(data: SampleProductForm): Promise<SampleProduct> {
    if (USE_MOCK) {
      const now = new Date().toLocaleString('zh-CN');
      const newProduct: SampleProduct = {
        ...data,
        id: `smp${String(mockSampleProductsStore.length + 1).padStart(3, '0')}`,
        parentProductName: '',
        createTime: now,
        updateTime: now,
      };
      mockSampleProductsStore.push(newProduct);
      return newProduct;
    }
    return request<SampleProduct>('/admin/sample/products', { method: 'POST', body: data });
  },

  async updateProduct(id: string, data: Partial<SampleProductForm>): Promise<SampleProduct> {
    if (USE_MOCK) {
      const idx = mockSampleProductsStore.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('样品不存在');
      mockSampleProductsStore[idx] = {
        ...mockSampleProductsStore[idx],
        ...data,
        updateTime: new Date().toLocaleString('zh-CN'),
      };
      return mockSampleProductsStore[idx];
    }
    return request<SampleProduct>(`/admin/sample/products/${id}`, { method: 'PUT', body: data });
  },

  async deleteProduct(id: string): Promise<void> {
    if (USE_MOCK) {
      mockSampleProductsStore = mockSampleProductsStore.filter(p => p.id !== id);
      return;
    }
    await request(`/admin/sample/products/${id}`, { method: 'DELETE' });
  },

  async publishProduct(id: string): Promise<SampleProduct> {
    if (USE_MOCK) {
      const idx = mockSampleProductsStore.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('样品不存在');
      mockSampleProductsStore[idx] = {
        ...mockSampleProductsStore[idx],
        status: 'up',
        updateTime: new Date().toLocaleString('zh-CN'),
      };
      return mockSampleProductsStore[idx];
    }
    return request<SampleProduct>(`/admin/sample/products/${id}/publish`, { method: 'POST' });
  },

  async unpublishProduct(id: string): Promise<SampleProduct> {
    if (USE_MOCK) {
      const idx = mockSampleProductsStore.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('样品不存在');
      mockSampleProductsStore[idx] = {
        ...mockSampleProductsStore[idx],
        status: 'down',
        updateTime: new Date().toLocaleString('zh-CN'),
      };
      return mockSampleProductsStore[idx];
    }
    return request<SampleProduct>(`/admin/sample/products/${id}/unpublish`, { method: 'POST' });
  },

  async listSales(params?: SampleSalesQuery): Promise<SampleSalesPageResult> {
    if (USE_MOCK) {
      return mockSampleSalesList(params);
    }
    const query = buildQuery(params as Record<string, unknown> || {});
    return request<SampleSalesPageResult>(`/admin/sample/sales${query}`);
  },

  async salesDetail(id: string): Promise<SampleSalesRecord> {
    if (USE_MOCK) {
      const found = mockSampleSalesStore.find(r => r.id === id);
      if (!found) throw new Error('销售记录不存在');
      return found;
    }
    return request<SampleSalesRecord>(`/admin/sample/sales/${id}`);
  },

  async createSales(data: SampleSalesForm): Promise<SampleSalesRecord> {
    if (USE_MOCK) {
      const now = new Date().toLocaleString('zh-CN');
      const orderNo = `SS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(mockSampleSalesStore.length + 1).padStart(3, '0')}`;
      let totalAmount = 0;
      const sampleItems = data.sampleItems.map(item => {
        const sample = mockSampleProductsStore.find(p => p.id === item.sampleId);
        if (!sample) throw new Error(`样品 ${item.sampleId} 不存在`);
        const itemTotal = sample.basePrice * item.quantity;
        totalAmount += itemTotal;
        return {
          sampleId: sample.id,
          sampleName: sample.name,
          sampleCode: sample.code,
          quantity: item.quantity,
          unitPrice: sample.basePrice,
          totalPrice: itemTotal,
        };
      });
      const actualPayment = totalAmount + (data.shippingFee || 0);
      const newRecord: SampleSalesRecord = {
        id: `ssl${String(mockSampleSalesStore.length + 1).padStart(3, '0')}`,
        orderNo,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        sampleItems,
        totalAmount,
        shippingFee: data.shippingFee || 0,
        actualPayment,
        status: 'pending',
        createTime: now,
        updateTime: now,
      };
      mockSampleSalesStore.push(newRecord);
      return newRecord;
    }
    return request<SampleSalesRecord>('/admin/sample/sales', { method: 'POST', body: data });
  },

  async updateSalesStatus(id: string, status: SampleSalesStatus): Promise<SampleSalesRecord> {
    if (USE_MOCK) {
      const idx = mockSampleSalesStore.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('销售记录不存在');
      mockSampleSalesStore[idx] = {
        ...mockSampleSalesStore[idx],
        status,
        updateTime: new Date().toLocaleString('zh-CN'),
      };
      return mockSampleSalesStore[idx];
    }
    return request<SampleSalesRecord>(`/admin/sample/sales/${id}/status`, { method: 'PUT', body: { status } });
  },
};