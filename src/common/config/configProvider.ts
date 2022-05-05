/*
 * @Author: liyou
 * @Date: 2021-06-04 18:12:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2021-11-22 18:14:17
 */
import 'reflect-metadata';
import { injectable } from 'inversify';

@injectable()
export default class ConfigProvider {
  apiPublicUrl = 'https://api-tmis-dev.timework.cn';

  constructor() {
    // following parameter can be inject from window global params
    window.__FE_API_PUBLIC_URL__ && (this.apiPublicUrl = window.__FE_API_PUBLIC_URL__);
  }
}