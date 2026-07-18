import { request, buildQuery, isUseMock } from './request';
import type {
  ProjectCase,
  CaseQueryParams,
  UploadCaseParams,
  RejectCaseParams,
  PointGoods,
  AddPointGoodsParams,
  UpdatePointGoodsParams,
  PointExchangeRecord,
  ExchangeRecordQueryParams,
  RedeemParams,
  PointRecord,
  PointRecordQueryParams,
} from './types';

const USE_MOCK = isUseMock();

export const caseApi = {
  async myList(params: CaseQueryParams = {}): Promise<ProjectCase[]> {
    if (USE_MOCK) {
      return mockMyCaseList(params);
    }
    const query = buildQuery(params as Record<string, unknown>);
    return request<ProjectCase[]>(`/cases/my${query}`);
  },

  async pendingList(): Promise<ProjectCase[]> {
    if (USE_MOCK) {
      return mockPendingCaseList();
    }
    return request<ProjectCase[]>('/cases/pending');
  },

  async upload(params: UploadCaseParams): Promise<ProjectCase> {
    if (USE_MOCK) {
      return mockUploadCase(params);
    }
    return request<ProjectCase>('/cases', { method: 'POST', body: params });
  },

  async approve(caseId: string): Promise<void> {
    if (USE_MOCK) {
      return mockApproveCase(caseId);
    }
    await request<void>(`/cases/${caseId}/approve`, { method: 'PUT' });
  },

  async reject(params: RejectCaseParams): Promise<void> {
    if (USE_MOCK) {
      return mockRejectCase(params);
    }
    await request<void>(`/cases/${params.caseId}/reject`, {
      method: 'PUT',
      body: { reason: params.reason },
    });
  },
};

export const pointGoodsApi = {
  async list(): Promise<PointGoods[]> {
    if (USE_MOCK) {
      const { pointGoods } = await import('@/data/mockData');
      return pointGoods;
    }
    return request<PointGoods[]>('/point-goods');
  },

  async create(params: AddPointGoodsParams): Promise<PointGoods> {
    if (USE_MOCK) {
      return mockCreateGoods(params);
    }
    return request<PointGoods>('/point-goods', { method: 'POST', body: params });
  },

  async update(goodsId: string, params: UpdatePointGoodsParams): Promise<void> {
    if (USE_MOCK) {
      return mockUpdateGoods(goodsId, params);
    }
    await request<void>(`/point-goods/${goodsId}`, { method: 'PUT', body: params });
  },
};

export const exchangeApi = {
  async list(params: ExchangeRecordQueryParams = {}): Promise<PointExchangeRecord[]> {
    if (USE_MOCK) {
      return mockExchangeList(params);
    }
    const query = buildQuery(params as Record<string, unknown>);
    return request<PointExchangeRecord[]>(`/exchange-records${query}`);
  },

  async redeem(params: RedeemParams): Promise<PointExchangeRecord> {
    if (USE_MOCK) {
      return mockRedeem(params);
    }
    return request<PointExchangeRecord>('/exchange-records', { method: 'POST', body: params });
  },

  async updateShipStatus(recordId: string, status: 'pending' | 'shipped'): Promise<void> {
    if (USE_MOCK) {
      return mockUpdateShipStatus(recordId, status);
    }
    await request<void>(`/exchange-records/${recordId}/ship`, { method: 'PUT', body: { status } });
  },
};

export const pointRecordApi = {
  async list(params: PointRecordQueryParams = {}): Promise<PointRecord[]> {
    if (USE_MOCK) {
      return mockPointRecordList(params);
    }
    const query = buildQuery(params as Record<string, unknown>);
    return request<PointRecord[]>(`/point-records${query}`);
  },
};

const mockMyCasesStore: ProjectCase[] = [];
const mockPendingCasesStore: ProjectCase[] = [];

async function mockMyCaseList(params: CaseQueryParams): Promise<ProjectCase[]> {
  await new Promise((r) => setTimeout(r, 200));
  let list = [...mockMyCasesStore];
  if (params.dealerId) {
    list = list.filter((c) => c.dealerId === params.dealerId);
  }
  if (params.status) {
    list = list.filter((c) => c.status === params.status);
  }
  return list;
}

async function mockPendingCaseList(): Promise<ProjectCase[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...mockPendingCasesStore];
}

async function mockUploadCase(params: UploadCaseParams): Promise<ProjectCase> {
  await new Promise((r) => setTimeout(r, 400));
  const newCase: ProjectCase = {
    ...params,
    id: `case-${Date.now()}`,
    dealerId: 'current-user',
    dealerName: '当前用户',
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
  };
  mockMyCasesStore.unshift(newCase);
  mockPendingCasesStore.unshift(newCase);
  return newCase;
}

async function mockApproveCase(caseId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const item = mockMyCasesStore.find((c) => c.id === caseId);
  if (item) {
    item.status = 'approved';
    item.approvedAt = new Date().toISOString().split('T')[0];
    item.pointsAwarded = 500;
  }
  const idx = mockPendingCasesStore.findIndex((c) => c.id === caseId);
  if (idx !== -1) mockPendingCasesStore.splice(idx, 1);
}

async function mockRejectCase(params: RejectCaseParams): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const item = mockMyCasesStore.find((c) => c.id === params.caseId);
  if (item) {
    item.status = 'rejected';
    item.rejectReason = params.reason;
  }
  const idx = mockPendingCasesStore.findIndex((c) => c.id === params.caseId);
  if (idx !== -1) mockPendingCasesStore.splice(idx, 1);
}

async function mockCreateGoods(params: AddPointGoodsParams): Promise<PointGoods> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    ...params,
    id: `goods-${Date.now()}`,
    status: 'up',
  };
}

async function mockUpdateGoods(_goodsId: string, _params: UpdatePointGoodsParams): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}

async function mockExchangeList(params: ExchangeRecordQueryParams): Promise<PointExchangeRecord[]> {
  await new Promise((r) => setTimeout(r, 200));
  const { exchangeRecords } = await import('@/data/mockData');
  let list = [...exchangeRecords];
  if (params.userId) {
    list = list.filter((r) => r.userId === params.userId);
  }
  if (params.shipStatus) {
    list = list.filter((r) => r.shipStatus === params.shipStatus);
  }
  return list;
}

async function mockRedeem(params: RedeemParams): Promise<PointExchangeRecord> {
  await new Promise((r) => setTimeout(r, 500));
  const { pointGoods } = await import('@/data/mockData');
  const goods = pointGoods.find((g) => g.id === params.goodsId);
  if (!goods) throw { code: 404, message: '商品不存在' } as any;
  return {
    id: `record-${Date.now()}`,
    userId: 'current-user',
    userName: '当前用户',
    goodsId: goods.id,
    goodsName: goods.name,
    consumePoints: goods.needPoints,
    receiveAddress: params.receiveAddress,
    createTime: new Date().toISOString().split('T')[0],
    shipStatus: 'pending',
  };
}

async function mockUpdateShipStatus(_recordId: string, _status: 'pending' | 'shipped'): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}

async function mockPointRecordList(params: PointRecordQueryParams): Promise<PointRecord[]> {
  await new Promise((r) => setTimeout(r, 200));
  if (params.userId) {
    return [];
  }
  return [];
}
