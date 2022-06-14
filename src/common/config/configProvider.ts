/*
 * @Author: liyou
 * @Date: 2021-06-04 18:12:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 17:49:28
 */
import "reflect-metadata";
import { injectable } from "inversify";

@injectable()
export default class ConfigProvider {
  apiPublicUrl = "http://httpbin.org";
}
