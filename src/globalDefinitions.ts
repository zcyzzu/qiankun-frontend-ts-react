/*
 * @Author: liyou
 * @Date: 2021-06-04 18:14:18
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2021-11-18 18:14:35
 */

import ConfigProvider from './common/config/configProvider';

declare global {
  interface Window {
    __FE_CONF_PROV__: ConfigProvider;
    authorization: string;
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __FE_API_PUBLIC_URL__?: string;
    __FE_PAGE_PUBLIC_URL__?: string;
    __FE_OCR_SERVICE_PUBLIC_URL__?: string;
  }
}
