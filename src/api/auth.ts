import { request, buildQuery } from './request';
import { isUseMock } from './request';
import type {
  LoginParams,
  LoginResult,
  RegisterParams,
  User,
  Dealer,
  DealerQueryParams,
  PageResult,
  UpdateDiscountParams,
} from './types';

const USE_MOCK = isUseMock();

export const authApi = {
  async login(params: LoginParams): Promise<LoginResult> {
    if (USE_MOCK) {
      return mockLogin(params);
    }
    return request<LoginResult>('/auth/login', { method: 'POST', body: params });
  },

  async register(params: RegisterParams): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      return mockRegister(params);
    }
    return request<{ success: boolean }>('/auth/register', { method: 'POST', body: params });
  },

  async logout(): Promise<void> {
    if (USE_MOCK) return;
    await request<void>('/auth/logout', { method: 'POST' });
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      return mockGetCurrentUser();
    }
    return request<User>('/auth/me');
  },
};

export const dealerApi = {
  async list(params: DealerQueryParams = {}): Promise<PageResult<Dealer> | Dealer[]> {
    if (USE_MOCK) {
      return mockDealerList(params);
    }
    const query = buildQuery(params as Record<string, unknown>);
    return request<PageResult<Dealer> | Dealer[]>(`/dealers${query}`);
  },

  async approve(dealerId: string): Promise<void> {
    if (USE_MOCK) {
      return mockApproveDealer(dealerId);
    }
    await request<void>(`/dealers/${dealerId}/approve`, { method: 'PUT' });
  },

  async reject(dealerId: string): Promise<void> {
    if (USE_MOCK) {
      return mockRejectDealer(dealerId);
    }
    await request<void>(`/dealers/${dealerId}/reject`, { method: 'PUT' });
  },
};

export const discountApi = {
  async get(): Promise<{ provincial: number; city: number }> {
    if (USE_MOCK) {
      return { provincial: 0.7, city: 0.85 };
    }
    return request<{ provincial: number; city: number }>('/config/discount');
  },

  async update(params: UpdateDiscountParams): Promise<void> {
    if (USE_MOCK) {
      return;
    }
    await request<void>('/config/discount', { method: 'PUT', body: params });
  },
};

import { dealers as mockDealers } from '@/data/mockData';
import { adminUser } from '@/api/mockFallback';

async function mockLogin(params: LoginParams): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 300));
  if (params.phone === '13900000000' && params.password === '123456') {
    return { token: 'mock-admin-token', user: adminUser };
  }
  const dealer = mockDealers.find((d) => d.phone === params.phone);
  if (dealer && params.password === '123456') {
    return {
      token: `mock-token-${dealer.id}`,
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
    };
  }
  throw { code: 1001, message: '手机号或密码错误' } as any;
}

async function mockRegister(params: RegisterParams): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 300));
  const existing = mockDealers.find((d) => d.phone === params.phone);
  if (existing) {
    return { success: false };
  }
  return { success: true };
}

async function mockGetCurrentUser(): Promise<User> {
  await new Promise((r) => setTimeout(r, 100));
  return adminUser;
}

async function mockDealerList(params: DealerQueryParams): Promise<Dealer[]> {
  await new Promise((r) => setTimeout(r, 200));
  let list = [...mockDealers];
  if (params.status) {
    list = list.filter((d) => d.status === params.status);
  }
  if (params.level) {
    list = list.filter((d) => d.level === params.level);
  }
  return list;
}

async function mockApproveDealer(_dealerId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

async function mockRejectDealer(_dealerId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}
