import { request, isUseMock } from './request';
import type { SystemMessage } from '@/types';

const USE_MOCK = isUseMock();

/** 消息查询入参 */
export interface MessageQueryParams {
  userId: string;
  type?: SystemMessage['type'];
  read?: boolean;
}

/** 消息创建入参（后端产生审核/订单等业务时自动调用） */
export interface CreateMessageParams {
  userId: string;
  title: string;
  content: string;
  type: SystemMessage['type'];
  jumpPage?: string;
}

/**
 * 系统消息 API
 * - 拉取当前用户全部消息
 * - 标记单条已读
 * - 一键标记当前用户全部已读
 * - 创建消息（业务侧触发）
 */
export const messageApi = {
  async list(userId: string): Promise<SystemMessage[]> {
    if (USE_MOCK) {
      return mockMessageList(userId);
    }
    return request<SystemMessage[]>(`/messages?userId=${encodeURIComponent(userId)}`);
  },

  async markRead(messageId: string): Promise<void> {
    if (USE_MOCK) {
      return;
    }
    await request<void>(`/messages/${messageId}/read`, { method: 'PUT' });
  },

  async markAllRead(userId: string): Promise<void> {
    if (USE_MOCK) {
      return;
    }
    await request<void>(`/messages/read-all`, { method: 'PUT', body: { userId } });
  },

  async create(params: CreateMessageParams): Promise<SystemMessage> {
    if (USE_MOCK) {
      return {
        id: `mock-msg-${Date.now()}`,
        userId: params.userId,
        title: params.title,
        content: params.content,
        type: params.type,
        read: false,
        createTime: new Date().toISOString(),
        jumpPage: params.jumpPage,
      };
    }
    return request<SystemMessage>('/messages', { method: 'POST', body: params });
  },
};

// ===== Mock =====

async function mockMessageList(userId: string): Promise<SystemMessage[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = Date.now();
  return [
    {
      id: `mock-msg-1-${userId}`,
      userId,
      title: '注册审核通过',
      content: '您的经销商账号已审核通过，欢迎使用曜之岩SDC分销系统。',
      type: 'audit',
      read: false,
      createTime: new Date(now - 1000 * 60 * 30).toISOString(),
      jumpPage: 'profile',
    },
    {
      id: `mock-msg-2-${userId}`,
      userId,
      title: '订单状态更新',
      content: '您的订单 #20260718001 已发货，请注意查收。',
      type: 'order',
      read: false,
      createTime: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      jumpPage: 'order-management',
    },
    {
      id: `mock-msg-3-${userId}`,
      userId,
      title: '项目报备成功',
      content: '您提交的项目「北京国贸中心」已成功报备，等待审核。',
      type: 'project',
      read: true,
      createTime: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      jumpPage: 'project-report',
    },
    {
      id: `mock-msg-4-${userId}`,
      userId,
      title: '积分商品已发货',
      content: '您兑换的「SDC 周边马克杯」已寄出，单号 SF1234567890。',
      type: 'exchange',
      read: true,
      createTime: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      jumpPage: 'points',
    },
  ];
}
