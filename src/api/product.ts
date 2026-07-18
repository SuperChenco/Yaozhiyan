import { request, buildQuery, isUseMock } from './request';
import type {
  Product,
  Case,
  Product as ProductType,
} from '@/types';

const USE_MOCK = isUseMock();

export const productApi = {
  async list(params?: { category?: string; keyword?: string }): Promise<Product[]> {
    if (USE_MOCK) {
      return mockProductList(params);
    }
    const query = buildQuery(params || {});
    return request<Product[]>(`/products${query}`);
  },

  async detail(id: string): Promise<Product> {
    if (USE_MOCK) {
      return mockProductDetail(id);
    }
    return request<Product>(`/products/${id}`);
  },

  async categories(): Promise<string[]> {
    if (USE_MOCK) {
      return ['全部', '平板系列', '木纹系列', '条纹系列', '立体系列'];
    }
    return request<string[]>('/products/categories');
  },
};

export const caseApi = {
  async list(): Promise<Case[]> {
    if (USE_MOCK) {
      const { cases } = await import('@/data/mockData');
      return cases;
    }
    return request<Case[]>('/cases');
  },

  async detail(id: string): Promise<Case> {
    if (USE_MOCK) {
      const { cases } = await import('@/data/mockData');
      const found = cases.find((c) => c.id === id);
      if (!found) throw { code: 404, message: '案例不存在' } as any;
      return found;
    }
    return request<Case>(`/cases/${id}`);
  },
};

import { sdcProducts } from '@/data/mockData';

async function mockProductList(params?: { category?: string; keyword?: string }): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 150));
  let list = [...sdcProducts];
  if (params?.category && params.category !== '全部' && params.category !== 'all') {
    list = list.filter((p) => p.category === params.category);
  }
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.code.toLowerCase().includes(kw)
    );
  }
  return list;
}

async function mockProductDetail(id: string): Promise<Product> {
  await new Promise((r) => setTimeout(r, 100));
  const found = sdcProducts.find((p) => p.id === id);
  if (!found) throw { code: 404, message: '产品不存在' } as any;
  return found;
}

export type { ProductType };
