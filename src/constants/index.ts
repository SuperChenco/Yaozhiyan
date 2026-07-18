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
  { value: 'pending', label: '待审核', color: 'warn' },
  { value: 'approved', label: '已通过', color: 'success' },
  { value: 'in_progress', label: '进行中', color: 'warn' },
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

// 以下数据同步自官网 www.yaozhiyan.com
export const COMPANY_INFO = {
  name: '曜之岩建材科技有限公司',
  englishName: 'Yaozhiyan Building Materials Technology Co., Ltd.',
  tagline: '专业的建筑内外墙体系统供应商',
  englishTagline: 'Professional supplier for decorative concrete in/out wall systems',
  description:
    '曜之岩建材科技有限公司是一家国内领先的高性能混凝土建材制品销售企业，公司主要产品是SDC轻质混凝土装饰挂板和EHPC挤出型高性能混凝土外墙以及GRC玻璃纤维增强混凝土构件以及UHPC超高性能混凝土构件，均采用先进工艺精制而成，具有环保、耐候、自洁等特点。产品适用于民用、工业和商用建筑领域，是外墙装饰面层材料的升级选择。',
  website: 'https://www.yaozhiyan.com',
};

// 官网三大核心服务
export const OFFICIAL_SERVICES = [
  {
    id: 'out-wall',
    name: '外墙',
    englishName: 'Out Wall',
    icon: '🏠',
    image: 'https://aka.doubaocdn.com/s/po0Z1wnRJj',
    description:
      '通过对石材、木纹、流水纹、砖纹等肌理的模仿，利用水泥制品可回收、无释放、高度自洁等的优点，可以实现别墅、自建房类建筑外墙各种组合从而实现设计述求。',
  },
  {
    id: 'in-wall',
    name: '内墙',
    englishName: 'In Wall',
    icon: '🛋',
    image: 'https://aka.doubaocdn.com/s/7jbg1wnRJj',
    description:
      '通过精准的机加工工艺，实现板材本身四企口加工和安装，配合自身系统的完整性，可以实现内墙对于精致性的超高要求，从而实现安装快、可更换等要求。',
  },
  {
    id: 'facade',
    name: '围护',
    englishName: 'Facade',
    icon: '🛡',
    image: 'https://aka.doubaocdn.com/s/MHP81wnRJj',
    description:
      '配合外墙围护的龙骨系统，采用100%干法施工的安装工艺，提升安装效率、配合满足建筑装配率要求、全系10年、15年以及30年耐候质保，保证外墙不褪色不黄变。',
  },
];

// 官网"为什么选择我们"
export const OFFICIAL_ADVANTAGES = [
  {
    id: 'quality-product',
    title: '优质的产品',
    englishTitle: 'Quality Product',
    items: ['SDC 轻质装饰混凝土', 'GRC 玻璃纤维增强混凝土', 'EHPC 挤出型高性能混凝土', 'UHPC 超高性能混凝土'],
  },
  {
    id: 'free-consulting',
    title: '免费的咨询',
    englishTitle: 'Free Consulting',
    items: [
      '产品设计及配套系统结构件合理性咨询',
      '墙体围护结构系统荷载抗风压计算咨询',
      '混凝土制品表面肌理以及涂装工艺咨询',
      '建筑认证以及内外墙体装配率计算咨询',
    ],
  },
  {
    id: 'extensive-service',
    title: '全面的服务',
    englishTitle: 'Extensive Service',
    items: [
      '售前建筑及产品结构相关技术咨询',
      '技术图纸排版以及结构方案的深化',
      '项目现场履约或者安装类技术指导',
      '工地上安装服务以及物流装卸服务',
    ],
  },
  {
    id: 'various-certification',
    title: '完善的认证',
    englishTitle: 'Various Certification',
    items: ['物理性能检测报告', '不燃性能检测报告', '外墙四性检测报告', '系统防火时效报告'],
  },
];

// 官网联系方式
export const OFFICIAL_CONTACT = {
  address: '佛山市华宝南路13号四座首层',
  workTime: '星期一09:00至星期六18:00',
  phone: '+86 176 2157 4543',
  phoneRaw: '17621574543',
  email: 'yaozhiyan2022@126.com',
};

// 官网首页 banner 图
export const OFFICIAL_BANNER_IMAGE = 'https://aka.doubaocdn.com/s/C0Ke1wnRJj';