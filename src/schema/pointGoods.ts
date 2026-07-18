import { z } from 'zod';

export const pointGoodsSchema = z.object({
  name: z
    .string()
    .min(2, '商品名称长度不能少于2个字符')
    .max(50, '商品名称长度不能超过50个字符'),
  needPoints: z
    .number({
      required_error: '请输入所需积分',
      invalid_type_error: '所需积分必须为数字',
    })
    .int('所需积分必须为整数')
    .min(1, '所需积分必须大于0'),
  stock: z
    .number({
      required_error: '请输入库存数量',
      invalid_type_error: '库存数量必须为数字',
    })
    .int('库存数量必须为整数')
    .min(0, '库存数量不能小于0'),
  desc: z
    .string()
    .max(200, '商品简介不能超过200个字符')
    .optional(),
  coverImg: z
    .string()
    .min(1, '请上传商品封面图'),
});

export type PointGoodsFormData = z.infer<typeof pointGoodsSchema>;
