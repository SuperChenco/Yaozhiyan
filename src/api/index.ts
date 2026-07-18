export { authApi, dealerApi, discountApi } from './auth';
export { productApi, caseApi as officialCaseApi } from './product';
export { projectApi, orderApi, inquiryApi, uploadApi } from './business';
export { caseApi, pointGoodsApi, exchangeApi, pointRecordApi } from './points';
export { wechatApi, type WechatAuthInfo, type WechatLoginParams } from './wechat';
export { messageApi, type MessageQueryParams, type CreateMessageParams } from './messages';
export {
  sdcProductApi,
  type SdcProductQuery,
  type SdcProductPageResult,
  SDC_CATEGORIES,
} from './sdcProduct';
export {
  sampleSalesApi,
  type SampleProductQuery,
  type SampleProductPageResult,
  type SampleSalesQuery,
  type SampleSalesPageResult,
} from './sampleSales';
export {
  request,
  ApiError,
  isUseMock,
  getToken,
  setToken,
  removeToken,
  setStoredUser,
  getStoredUser,
} from './request';
export type * from './types';
