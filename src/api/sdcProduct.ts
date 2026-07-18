import { request, buildQuery, isUseMock } from './request';
import type { SdcProduct, SdcProductForm, ProductStatus } from '@/types';

const USE_MOCK = isUseMock();

/** SDC 产品列表查询参数 */
export interface SdcProductQuery {
  category?: string;
  keyword?: string;
  status?: ProductStatus;
  page?: number;
  pageSize?: number;
}

/** 分页结果 */
export interface SdcProductPageResult {
  list: SdcProduct[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * SDC 产品后台管理 API（管理员专属）
 * 完整 CRUD + 上下架 + 批量操作
 */
export const sdcProductApi = {
  /** 分页列表（后台管理用，含全部字段） */
  async list(params?: SdcProductQuery): Promise<SdcProductPageResult> {
    if (USE_MOCK) {
      return mockSdcProductList(params);
    }
    const query = buildQuery(params as Record<string, unknown> || {});
    return request<SdcProductPageResult>(`/admin/products${query}`);
  },

  /** 全部产品（不分页，用于前台展示/下拉选择） */
  async all(params?: { category?: string }): Promise<SdcProduct[]> {
    if (USE_MOCK) {
      const result = await mockSdcProductList({ ...params, page: 1, pageSize: 100 });
      return result.list;
    }
    const query = buildQuery(params as Record<string, unknown> || {});
    return request<SdcProduct[]>(`/admin/products/all${query}`);
  },

  /** 产品详情 */
  async detail(id: string): Promise<SdcProduct> {
    if (USE_MOCK) {
      return mockSdcProductDetail(id);
    }
    return request<SdcProduct>(`/admin/products/${id}`);
  },

  /** 新增产品 */
  async create(data: SdcProductForm): Promise<SdcProduct> {
    if (USE_MOCK) {
      return mockSdcProductCreate(data);
    }
    return request<SdcProduct>('/admin/products', { method: 'POST', body: data });
  },

  /** 更新产品 */
  async update(id: string, data: Partial<SdcProductForm>): Promise<SdcProduct> {
    if (USE_MOCK) {
      return mockSdcProductUpdate(id, data);
    }
    return request<SdcProduct>(`/admin/products/${id}`, { method: 'PUT', body: data });
  },

  /** 删除产品 */
  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      mockSdcProductRemove(id);
      return;
    }
    await request<void>(`/admin/products/${id}`, { method: 'DELETE' });
  },

  /** 上架 */
  async publish(id: string): Promise<SdcProduct> {
    if (USE_MOCK) {
      return mockSdcProductUpdate(id, { status: 'up' });
    }
    return request<SdcProduct>(`/admin/products/${id}/publish`, { method: 'PUT' });
  },

  /** 下架 */
  async unpublish(id: string): Promise<SdcProduct> {
    if (USE_MOCK) {
      return mockSdcProductUpdate(id, { status: 'down' });
    }
    return request<SdcProduct>(`/admin/products/${id}/unpublish`, { method: 'PUT' });
  },
};

// ===== Mock 实现 =====

/** 九大分类 */
export const SDC_CATEGORIES = [
  '平板系列',
  '木纹系列',
  '条纹系列',
  '立体系列',
  '清水系列',
  '石纹系列',
  '布纹系列',
  '金属系列',
  '定制系列',
];

const img = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;

const THICKNESS = '18mm中空';
const SPEC = '2400×1200mm';

/** 27 款产品 Mock 数据 */
let mockSdcProducts: SdcProduct[] = [
  {
    id: 'sdc-001',
    name: '平板_无涂装',
    code: 'ORA048HA03',
    category: '平板系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 345,
    coverImg: img('plain light beige concrete wall panel smooth surface minimalist texture product photo'),
    detailImgs: [
      img('concrete wall panel installation detail closeup'),
      img('concrete wall panel building facade'),
    ],
    description: '素色平板，无涂装处理，质感自然质朴，适用于追求极简风格的建筑外墙。',
    applications: ['别墅', '办公楼', '商业建筑'],
    stock: 5000,
    status: 'up',
    createTime: '2025-01-15T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-002',
    name: '平板_乳白',
    code: 'ORA048H7395R',
    category: '平板系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 410,
    coverImg: img('milky white smooth concrete wall panel painted finish elegant texture product photo'),
    detailImgs: [img('white concrete wall panel residential building')],
    description: '乳白色涂装平板，色彩温润柔和，营造干净明亮的建筑外观。',
    applications: ['别墅', '酒店', '会所'],
    stock: 3200,
    status: 'up',
    createTime: '2025-01-15T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-003',
    name: '流木',
    code: 'ORA112H',
    category: '木纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 410,
    coverImg: img('horizontal wood grain texture concrete wall panel light brown wood pattern product photo'),
    detailImgs: [img('wood grain wall panel villa exterior')],
    description: '横向木纹肌理，层次分明，模拟天然木材的温润质感，经久耐用。',
    applications: ['别墅', '民宿', '商业建筑'],
    stock: 2800,
    status: 'up',
    createTime: '2025-02-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-004',
    name: '竖木',
    code: 'ORA113H',
    category: '木纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 410,
    coverImg: img('vertical wood grain concrete wall panel dark walnut wood texture product photo'),
    detailImgs: [],
    description: '竖向木纹肌理，线条挺拔，增加建筑立面的纵向延伸感。',
    applications: ['商业建筑', '办公楼', '图书馆'],
    stock: 2100,
    status: 'up',
    createTime: '2025-02-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-005',
    name: '细条纹',
    code: 'ORA085H',
    category: '条纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 380,
    coverImg: img('fine striped texture concrete wall panel subtle linear pattern gray product photo'),
    detailImgs: [],
    description: '纤细条纹肌理，低调内敛，为建筑立面注入细腻的节奏感。',
    applications: ['办公楼', '学校', '医院'],
    stock: 1800,
    status: 'up',
    createTime: '2025-02-20T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-006',
    name: '粗条纹',
    code: 'ORA086H',
    category: '条纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 395,
    coverImg: img('bold striped concrete wall panel deep groove texture industrial product photo'),
    detailImgs: [],
    description: '粗犷条纹肌理，立体感强，适合大面积外墙应用。',
    applications: ['厂房', '仓储', '商业建筑'],
    stock: 2500,
    status: 'up',
    createTime: '2025-02-20T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-007',
    name: '菱格立体',
    code: 'ORA201H',
    category: '立体系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 455,
    coverImg: img('3d diamond grid texture concrete wall panel geometric relief pattern product photo'),
    detailImgs: [],
    description: '菱形立体格纹，光影变化丰富，增强建筑雕塑感。',
    applications: ['商业建筑', '美术馆', '会所'],
    stock: 1200,
    status: 'up',
    createTime: '2025-03-05T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-008',
    name: '波浪立体',
    code: 'ORA202H',
    category: '立体系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 470,
    coverImg: img('wavy 3d concrete wall panel undulating surface texture product photo'),
    detailImgs: [],
    description: '波浪形立体肌理，柔和自然，赋予建筑流动的立面语言。',
    applications: ['文化建筑', '商业综合体', '酒店'],
    stock: 900,
    status: 'up',
    createTime: '2025-03-05T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-009',
    name: '清水_浅灰',
    code: 'ORA301H',
    category: '清水系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 365,
    coverImg: img('fair-faced concrete wall panel light gray exposed concrete texture product photo'),
    detailImgs: [],
    description: '浅灰色清水混凝土质感，还原混凝土原始之美，质朴而高级。',
    applications: ['美术馆', '博物馆', '别墅'],
    stock: 3500,
    status: 'up',
    createTime: '2025-03-15T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-010',
    name: '清水_深灰',
    code: 'ORA302H',
    category: '清水系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 375,
    coverImg: img('dark gray fair-faced concrete wall panel smooth exposed aggregate product photo'),
    detailImgs: [],
    description: '深灰色清水混凝土质感，沉稳厚重，适合现代极简建筑风格。',
    applications: ['办公楼', '商业建筑', '别墅'],
    stock: 2800,
    status: 'up',
    createTime: '2025-03-15T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-011',
    name: '大理石纹_白',
    code: 'ORA401H',
    category: '石纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 460,
    coverImg: img('white marble texture concrete wall panel natural stone veins pattern product photo'),
    detailImgs: [],
    description: '白色大理石纹理，高贵典雅，彰显建筑品质。',
    applications: ['酒店', '会所', '商业建筑'],
    stock: 800,
    status: 'up',
    createTime: '2025-04-01T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-012',
    name: '大理石纹_灰',
    code: 'ORA402H',
    category: '石纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 460,
    coverImg: img('gray marble texture concrete wall panel carrara stone pattern product photo'),
    detailImgs: [],
    description: '灰色大理石纹理，层次分明，营造高端大气的立面效果。',
    applications: ['办公楼', '商业综合体', '酒店'],
    stock: 750,
    status: 'up',
    createTime: '2025-04-01T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-013',
    name: '亚麻布纹',
    code: 'ORA501H',
    category: '布纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 425,
    coverImg: img('linen fabric texture concrete wall panel soft textile pattern product photo'),
    detailImgs: [],
    description: '亚麻布纹肌理，触感细腻柔和，为建筑注入温暖气息。',
    applications: ['住宅', '公寓', '会所'],
    stock: 1100,
    status: 'up',
    createTime: '2025-04-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-014',
    name: '细麻布纹',
    code: 'ORA502H',
    category: '布纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 425,
    coverImg: img('fine burlap texture concrete wall panel woven fabric pattern product photo'),
    detailImgs: [],
    description: '细麻布纹肌理，肌理清晰，具有独特的手工质感。',
    applications: ['民宿', '艺术空间', '别墅'],
    stock: 950,
    status: 'up',
    createTime: '2025-04-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-015',
    name: '拉丝金属_银',
    code: 'ORA601H',
    category: '金属系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 520,
    coverImg: img('brushed silver metal texture concrete wall panel metallic finish product photo'),
    detailImgs: [],
    description: '银色拉丝金属质感，科技感十足，适合现代工业风建筑。',
    applications: ['科技园区', '商业建筑', '汽车展厅'],
    stock: 600,
    status: 'up',
    createTime: '2025-04-20T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-016',
    name: '拉丝金属_铜',
    code: 'ORA602H',
    category: '金属系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 540,
    coverImg: img('brushed copper metal texture concrete wall panel bronze finish product photo'),
    detailImgs: [],
    description: '铜色拉丝金属质感，复古奢华，赋予建筑独特的视觉焦点。',
    applications: ['高端商业', '会所', '艺术建筑'],
    stock: 400,
    status: 'up',
    createTime: '2025-04-20T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-017',
    name: '平板_米黄',
    code: 'ORA048H2591',
    category: '平板系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 410,
    coverImg: img('beige cream color concrete wall panel smooth finish warm tone product photo'),
    detailImgs: [],
    description: '米黄色调平板，温暖柔和，营造温馨舒适的建筑氛围。',
    applications: ['住宅', '学校', '医院'],
    stock: 3000,
    status: 'up',
    createTime: '2025-01-15T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-018',
    name: '平板_中灰',
    code: 'ORA048H3720',
    category: '平板系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 410,
    coverImg: img('medium gray concrete wall panel smooth matte finish modern product photo'),
    detailImgs: [],
    description: '中灰色平板，低调沉稳，百搭各种建筑风格。',
    applications: ['办公楼', '工业建筑', '商业建筑'],
    stock: 4200,
    status: 'up',
    createTime: '2025-01-15T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-019',
    name: '原木纹',
    code: 'ORA114H',
    category: '木纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 410,
    coverImg: img('natural wood grain concrete wall panel oak wood texture warm product photo'),
    detailImgs: [],
    description: '原木纹理，自然逼真，还原实木的温暖质感。',
    applications: ['别墅', '民宿', '度假村'],
    stock: 1900,
    status: 'up',
    createTime: '2025-02-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-020',
    name: '胡桃木纹',
    code: 'ORA115H',
    category: '木纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 430,
    coverImg: img('walnut wood grain concrete wall panel dark brown wood texture product photo'),
    detailImgs: [],
    description: '胡桃木纹理，深邃典雅，适合高端建筑应用。',
    applications: ['高端住宅', '酒店', '会所'],
    stock: 700,
    status: 'up',
    createTime: '2025-02-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-021',
    name: '横纹砖',
    code: 'ORA087H',
    category: '条纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 385,
    coverImg: img('horizontal brick pattern concrete wall panel brickwork texture product photo'),
    detailImgs: [],
    description: '横向砖纹肌理，经典怀旧，赋予建筑独特的历史感。',
    applications: ['商业建筑', '文化建筑', '住宅'],
    stock: 1500,
    status: 'up',
    createTime: '2025-02-20T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-022',
    name: '编织立体',
    code: 'ORA203H',
    category: '立体系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 475,
    coverImg: img('woven 3d texture concrete wall panel braided pattern product photo'),
    detailImgs: [],
    description: '编织立体肌理，交错纵横，呈现独特的手工艺美学。',
    applications: ['艺术空间', '商业建筑', '会所'],
    stock: 500,
    status: 'up',
    createTime: '2025-03-05T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-023',
    name: '砂岩纹',
    code: 'ORA403H',
    category: '石纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 430,
    coverImg: img('sandstone texture concrete wall panel natural stone grain product photo'),
    detailImgs: [],
    description: '砂岩纹理，自然粗犷，还原天然石材的质朴质感。',
    applications: ['别墅', '文化建筑', '景观建筑'],
    stock: 1300,
    status: 'up',
    createTime: '2025-04-01T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-024',
    name: '洞石纹',
    code: 'ORA404H',
    category: '石纹系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 450,
    coverImg: img('travertine stone texture concrete wall panel natural hole pattern product photo'),
    detailImgs: [],
    description: '洞石纹理，自然古朴，营造独特的地中海风情。',
    applications: ['酒店', '度假村', '商业建筑'],
    stock: 650,
    status: 'up',
    createTime: '2025-04-01T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-025',
    name: '金属_拉丝金',
    code: 'ORA603H',
    category: '金属系列',
    thickness: THICKNESS,
    spec: SPEC,
    basePrice: 560,
    coverImg: img('brushed gold metal texture concrete wall panel metallic gold finish product photo'),
    detailImgs: [],
    description: '金色拉丝金属质感，华贵典雅，提升建筑品质感。',
    applications: ['高端商业', '酒店', '会所'],
    stock: 300,
    status: 'down',
    createTime: '2025-04-20T08:00:00.000Z',
    updateTime: '2025-06-15T10:00:00.000Z',
  },
  {
    id: 'sdc-026',
    name: '定制_异形板',
    code: 'ORA901H',
    category: '定制系列',
    thickness: THICKNESS,
    spec: '定制尺寸',
    basePrice: 680,
    coverImg: img('custom shaped concrete wall panel unique architectural design product photo'),
    detailImgs: [],
    description: '异形定制板，根据项目需求定制尺寸与肌理，满足个性化设计。',
    applications: ['定制项目', '艺术建筑', '地标建筑'],
    stock: 0,
    status: 'down',
    createTime: '2025-05-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'sdc-027',
    name: '定制_透光板',
    code: 'ORA902H',
    category: '定制系列',
    thickness: THICKNESS,
    spec: '定制尺寸',
    basePrice: 820,
    coverImg: img('translucent concrete wall panel light transmitting product photo'),
    detailImgs: [],
    description: '透光混凝土板，光线穿过时呈现独特的星光效果，极具装饰性。',
    applications: ['景观建筑', '室内装饰', '艺术空间'],
    stock: 0,
    status: 'down',
    createTime: '2025-05-10T08:00:00.000Z',
    updateTime: '2025-06-20T10:00:00.000Z',
  },
];

async function mockSdcProductList(params?: SdcProductQuery): Promise<SdcProductPageResult> {
  await new Promise((r) => setTimeout(r, 200));
  let list = [...mockSdcProducts];

  if (params?.category && params.category !== 'all') {
    list = list.filter((p) => p.category === params.category);
  }
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.code.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw)
    );
  }
  if (params?.status) {
    list = list.filter((p) => p.status === params.status);
  }

  // 按更新时间倒序
  list.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());

  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const total = list.length;
  const start = (page - 1) * pageSize;
  const pageList = list.slice(start, start + pageSize);

  return { list: pageList, total, page, pageSize };
}

async function mockSdcProductDetail(id: string): Promise<SdcProduct> {
  await new Promise((r) => setTimeout(r, 100));
  const found = mockSdcProducts.find((p) => p.id === id);
  if (!found) throw { code: 404, message: '产品不存在' } as any;
  return found;
}

async function mockSdcProductCreate(data: SdcProductForm): Promise<SdcProduct> {
  await new Promise((r) => setTimeout(r, 300));
  const now = new Date().toISOString();
  const newProduct: SdcProduct = {
    id: `sdc-${Date.now()}`,
    ...data,
    createTime: now,
    updateTime: now,
  };
  mockSdcProducts.unshift(newProduct);
  return newProduct;
}

async function mockSdcProductUpdate(id: string, data: Partial<SdcProductForm>): Promise<SdcProduct> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = mockSdcProducts.findIndex((p) => p.id === id);
  if (idx < 0) throw { code: 404, message: '产品不存在' } as any;
  const updated: SdcProduct = {
    ...mockSdcProducts[idx],
    ...data,
    updateTime: new Date().toISOString(),
  };
  mockSdcProducts[idx] = updated;
  return updated;
}

function mockSdcProductRemove(id: string): void {
  const idx = mockSdcProducts.findIndex((p) => p.id === id);
  if (idx >= 0) {
    mockSdcProducts.splice(idx, 1);
  }
}
