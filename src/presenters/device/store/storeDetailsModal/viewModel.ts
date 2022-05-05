/*
 * @Author: tongyuqiang
 * @Date: 2022-03-04 09:31:13
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-04 18:00:31
 */
import { StoreListDataConfig } from '../viewModel';

export default interface StoreDetailsModalViewModel {
  // 详情弹窗状态
  storeDetailsModalVisible: boolean;
  // 设置详情弹窗状态
  setStoreDetailsModalVisible(visible: boolean, record?: StoreListDataConfig): void;
  // 所选列表的单项数据
  listItemData: StoreListDataConfig;
}
