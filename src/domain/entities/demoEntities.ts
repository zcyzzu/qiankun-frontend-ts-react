/*
 * @Author: zhangchenyang
 * @Date: 2022-06-13 15:54:05
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 17:09:42
 */
interface ArgsConfig {}

type HeadersConfigKeys =
  | "Accept"
  | "Accept-Encoding"
  | "Host"
  | "Postman-Token"
  | "User-Agent"
  | "X-Amzn-Trace-Id";

type HeadersConfig = { [key in HeadersConfigKeys]: string };

export interface DemoEntity {
  args?: ArgsConfig;
  headers?: HeadersConfig;
  origin?: string;
  url?: string;
}
