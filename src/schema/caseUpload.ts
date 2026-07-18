import { z } from 'zod';

export const caseUploadSchema = z.object({
  name: z
    .string()
    .min(2, '案例名称长度不能少于2个字符')
    .max(50, '案例名称长度不能超过50个字符'),
  location: z
    .string()
    .min(2, '项目地点长度不能少于2个字符')
    .max(100, '项目地点长度不能超过100个字符'),
  type: z
    .string()
    .min(1, '请选择案例类型'),
  area: z
    .string()
    .min(1, '请输入项目面积')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: '项目面积必须大于0',
    }),
  productId: z
    .string()
    .min(1, '请选择关联产品'),
  description: z
    .string()
    .min(10, '案例描述不能少于10个字符')
    .max(1000, '案例描述不能超过1000个字符'),
  images: z
    .array(z.any())
    .min(1, '请至少上传1张案例图片')
    .max(10, '最多上传10张案例图片'),
});

export type CaseUploadFormData = z.infer<typeof caseUploadSchema>;
