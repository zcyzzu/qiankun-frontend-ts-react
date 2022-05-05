/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-01-13 10:45:52
 */
export default interface AdvertisementDetailsModalViewModel {
  // 查看设备弹窗状态
  advertDetailsVisible: boolean;
  // 设置窗口状态
  setAdvertDetailsVisible(tab?: string, name?: string): void;
  // 当前的tab页面
  currentTab: string;
  // 标题名称
  name: string;
}
