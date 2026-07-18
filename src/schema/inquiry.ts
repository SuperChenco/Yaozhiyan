import { z } from 'zod';

const phoneRegex = /^1[3-9]\d{9}$/;

export const inquirySchema = z.object({
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
    .max(50, '公司名称长度不能超过50个字符')
    .optional(),
  projectType: z
    .string()
    .min(1, '请选择项目类型'),
  area: z
    .string()
    .min(1, '请输入项目面积')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: '项目面积必须大于0',
    }),
  budget: z
    .string()
    .max(50, '预算范围长度不能超过50个字符')
    .optional(),
  description: z
    .string()
    .max(500, '需求描述不能超过500个字符')
    .optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
