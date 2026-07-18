import { z } from 'zod';

const phoneRegex = /^1[3-9]\d{9}$/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, '姓名长度不能少于2个字符')
    .max(20, '姓名长度不能超过20个字符'),
  phone: z
    .string()
    .min(1, '请输入手机号')
    .regex(phoneRegex, '手机号格式不正确'),
  company: z
    .string()
    .min(2, '公司名称长度不能少于2个字符')
    .max(50, '公司名称长度不能超过50个字符'),
  level: z
    .enum(['provincial', 'city'], {
      errorMap: () => ({ message: '请选择申请等级' }),
    }),
  province: z
    .string()
    .min(1, '请选择所在省份'),
  city: z
    .string()
    .optional(),
  password: z
    .string()
    .min(6, '密码长度不能少于6位')
    .max(20, '密码长度不能超过20位'),
  confirmPassword: z
    .string()
    .min(6, '确认密码长度不能少于6位'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
