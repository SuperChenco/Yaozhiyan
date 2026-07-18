import { z } from 'zod';

const phoneRegex = /^1[3-9]\d{9}$/;

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, '请输入手机号')
    .regex(phoneRegex, '手机号格式不正确'),
  password: z
    .string()
    .min(6, '密码长度不能少于6位')
    .max(20, '密码长度不能超过20位'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
