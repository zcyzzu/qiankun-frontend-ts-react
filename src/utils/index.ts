/*
 * @Author: liyou
 * @Date: 2021-06-29 18:11:14
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 17:58:23
 */

import { message } from "antd";

// ant design message组件props
type NoticeType = "success" | "error";
export interface AntMessageProps {
  content: React.ReactNode;
  type: NoticeType;
  duration?: number | null;
  icon?: React.ReactNode;
}

const utils = {
  // 全局提示框
  globalMessge(config: AntMessageProps): void {
    message.config({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getContainer: () => document.getElementById("root-container-element")!,
    });
    message.open({
      content: config.content,
      type: config.type,
      duration: 2,
      className: "global-ant-message",
    });
  },
};
export default utils;
