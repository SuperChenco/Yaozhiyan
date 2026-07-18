import { z } from 'zod';

const phoneRegex = /^1[3-9]\d{9}$/;

export const projectReportSchema = z.object({
  name: z
    .string()
    .min(2, '项目名称长度不能少于2个字符')
    .max(50, '项目名称长度不能超过50个字符'),
  location: z
    .string()
    .min(2, '项目地点长度不能少于2个字符')
    .max(100, '项目地点长度不能超过100个字符'),
  type: z
    .string()
    .min(1, '请选择项目类型'),
  area: z
    .string()
    .min(1, '请输入预计面积')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: '预计面积必须大于0',
    }),
  description: z
    .string()
    .max(500, '项目描述不能超过500个字符')
    .optional(),
});

export type ProjectReportFormData = z.infer<typeof projectReportSchema>;
