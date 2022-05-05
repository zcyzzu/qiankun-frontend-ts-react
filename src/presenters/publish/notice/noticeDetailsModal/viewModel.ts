/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-12-17 17:00:24
 */
export default interface NoticeDetailsModalViewModel {
  // 查看设备弹窗状态
  noticeDetailsVisible: boolean;
  // 设置窗口状态
  setNoticeDetailsVisible(tab?: string): void;
  // 当前的tab页面
  currentTab: string;
}
