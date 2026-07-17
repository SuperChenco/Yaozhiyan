export const PROVINCES = [
  { id: '110000', name: '北京市' },
  { id: '120000', name: '天津市' },
  { id: '130000', name: '河北省' },
  { id: '140000', name: '山西省' },
  { id: '150000', name: '内蒙古自治区' },
  { id: '210000', name: '辽宁省' },
  { id: '220000', name: '吉林省' },
  { id: '230000', name: '黑龙江省' },
  { id: '310000', name: '上海市' },
  { id: '320000', name: '江苏省' },
  { id: '330000', name: '浙江省' },
  { id: '340000', name: '安徽省' },
  { id: '350000', name: '福建省' },
  { id: '360000', name: '江西省' },
  { id: '370000', name: '山东省' },
  { id: '410000', name: '河南省' },
  { id: '420000', name: '湖北省' },
  { id: '430000', name: '湖南省' },
  { id: '440000', name: '广东省' },
  { id: '450000', name: '广西壮族自治区' },
  { id: '460000', name: '海南省' },
  { id: '500000', name: '重庆市' },
  { id: '510000', name: '四川省' },
  { id: '520000', name: '贵州省' },
  { id: '530000', name: '云南省' },
  { id: '540000', name: '西藏自治区' },
  { id: '610000', name: '陕西省' },
  { id: '620000', name: '甘肃省' },
  { id: '630000', name: '青海省' },
  { id: '640000', name: '宁夏回族自治区' },
  { id: '650000', name: '新疆维吾尔自治区' },
];

export const DEALER_LEVELS = [
  { value: 'provincial', label: '省级总代' },
  { value: 'city', label: '城市经销商' },
];

export const PROJECT_STATUSES = [
  { value: 'pending', label: '待审核', color: 'warning' },
  { value: 'approved', label: '已通过', color: 'success' },
  { value: 'in_progress', label: '进行中', color: 'info' },
  { value: 'completed', label: '已完成', color: 'success' },
  { value: 'cancelled', label: '已取消', color: 'danger' },
];

export const ORDER_STATUSES = [
  { value: 'pending', label: '待付款' },
  { value: 'paid', label: '已付款' },
  { value: 'producing', label: '生产中' },
  { value: 'shipped', label: '已发货' },
  { value: 'delivered', label: '已送达' },
  { value: 'completed', label: '已完成' },
];

export const PROJECT_TYPES = [
  '别墅',
  '自建房',
  '商业综合体',
  '办公楼',
  '酒店',
  '学校',
  '医院',
  '产业园',
  '其他',
];

export const USER_ROLES = [
  { value: 'admin', label: '管理员' },
  { value: 'provincial', label: '省级总代' },
  { value: 'city', label: '城市经销商' },
];

export const PRICE_DISCOUNTS = {
  admin: 1,
  provincial: 0.7,
  city: 0.85,
};

export const POINT_RULES = {
  upload_case_approved: 500,
  project_report: 50,
  order_per_1000: 10,
};