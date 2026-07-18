import { request, buildQuery, isUseMock } from './request';
import type {
  Project,
  ProjectQueryParams,
  AddProjectParams,
  UpdateProjectParams,
  Order,
  OrderQueryParams,
  AddOrderParams,
  Inquiry,
  AddInquiryParams,
  UploadFileResult,
} from './types';

const USE_MOCK = isUseMock();

export const projectApi = {
  async list(params: ProjectQueryParams = {}): Promise<Project[]> {
    if (USE_MOCK) {
      return mockProjectList(params);
    }
    const query = buildQuery(params as Record<string, unknown>);
    return request<Project[]>(`/projects${query}`);
  },

  async create(params: AddProjectParams): Promise<Project> {
    if (USE_MOCK) {
      return mockCreateProject(params);
    }
    return request<Project>('/projects', { method: 'POST', body: params });
  },

  async update(projectId: string, params: UpdateProjectParams): Promise<void> {
    if (USE_MOCK) {
      return mockUpdateProject(projectId, params);
    }
    await request<void>(`/projects/${projectId}`, { method: 'PUT', body: params });
  },

  async approve(projectId: string): Promise<void> {
    if (USE_MOCK) {
      return mockApproveProject(projectId);
    }
    await request<void>(`/projects/${projectId}/approve`, { method: 'PUT' });
  },
};

export const orderApi = {
  async list(params: OrderQueryParams = {}): Promise<Order[]> {
    if (USE_MOCK) {
      return mockOrderList(params);
    }
    const query = buildQuery(params as Record<string, unknown>);
    return request<Order[]>(`/orders${query}`);
  },

  async create(params: AddOrderParams): Promise<Order> {
    if (USE_MOCK) {
      return mockCreateOrder(params);
    }
    return request<Order>('/orders', { method: 'POST', body: params });
  },

  async updateStatus(orderId: string, status: string): Promise<void> {
    if (USE_MOCK) {
      return mockUpdateOrderStatus(orderId, status);
    }
    await request<void>(`/orders/${orderId}/status`, { method: 'PUT', body: { status } });
  },
};

export const inquiryApi = {
  async list(): Promise<Inquiry[]> {
    if (USE_MOCK) {
      const { inquiries } = await import('@/data/mockData');
      return inquiries;
    }
    return request<Inquiry[]>('/inquiries');
  },

  async create(params: AddInquiryParams): Promise<Inquiry> {
    if (USE_MOCK) {
      return mockCreateInquiry(params);
    }
    return request<Inquiry>('/inquiries', { method: 'POST', body: params });
  },
};

export const uploadApi = {
  async uploadFile(file: File): Promise<UploadFileResult> {
    if (USE_MOCK) {
      return mockUploadFile(file);
    }
    const formData = new FormData();
    formData.append('file', file);
    return request<UploadFileResult>('/upload/file', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  },
};

import { projects as mockProjects, orders as mockOrders } from '@/data/mockData';

async function mockProjectList(params: ProjectQueryParams): Promise<Project[]> {
  await new Promise((r) => setTimeout(r, 200));
  let list = [...mockProjects];
  if (params.dealerId) {
    list = list.filter((p) => p.dealerId === params.dealerId);
  }
  if (params.status) {
    list = list.filter((p) => p.status === params.status);
  }
  return list;
}

async function mockCreateProject(params: AddProjectParams): Promise<Project> {
  await new Promise((r) => setTimeout(r, 300));
  const newProject: Project = {
    ...params,
    id: `project-${Date.now()}`,
    dealerName: '当前用户',
    status: 'pending',
    lastUpdate: new Date().toISOString().split('T')[0],
  };
  return newProject;
}

async function mockUpdateProject(_projectId: string, _params: UpdateProjectParams): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

async function mockApproveProject(_projectId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

async function mockOrderList(params: OrderQueryParams): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 200));
  let list = [...mockOrders];
  if (params.dealerId) {
    list = list.filter((o) => o.dealerId === params.dealerId);
  }
  if (params.status) {
    list = list.filter((o) => o.status === params.status);
  }
  return list;
}

async function mockCreateOrder(params: AddOrderParams): Promise<Order> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    ...params,
    id: `order-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
  };
}

async function mockUpdateOrderStatus(_orderId: string, _status: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

async function mockCreateInquiry(params: AddInquiryParams): Promise<Inquiry> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    ...params,
    id: `inquiry-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

async function mockUploadFile(file: File): Promise<UploadFileResult> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    fileName: file.name,
    fileUrl: URL.createObjectURL(file),
    fileSize: file.size,
    uploadTime: new Date().toISOString().split('T')[0],
  };
}
