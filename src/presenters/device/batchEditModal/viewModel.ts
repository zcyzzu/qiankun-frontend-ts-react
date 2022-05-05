/*
 * @Author: zhangchenyang
 * @Date: 2021-12-07 17:47:00
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-06 10:39:33
 */
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import AdvertisementMachine, { DeviceRecordDataConfig } from '../advertisementMachine/viewModel';
import { DeviceType } from '../../../common/config/commonConfig';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';

export interface GroupList {
  label?: string;
  value?: string;
}

export default interface BatchEditModalViewModel {
  // 弹窗状态
  batchEditModalVisible: boolean;
  // 设置弹窗状态
  setBatchEditModalVisible(val: boolean): void;
  // 设备分组列表
  deviceGroupList: GroupList[];
  // 设备分组状态
  deviceGroupStatus: boolean;
  // 设置设备分组状态
  setDeviceGroupStatus(val: boolean, unitIds?: number): void;
  // 所属门店状态
  storeGroupStatus: boolean;
  // 设置所属门店状态
  setStoreGroupStatus(val: boolean, selectedRowItemData: DeviceRecordDataConfig[]): void;
  // 选中的组名列表
  selectedGroupList: string[];
  // 设置选择组名
  setSelectedGroupList(val: CheckboxValueType[]): void;
  // 清空选中的组名
  clearSelectedGroup(): void;
  // 门店列表
  storeDataList: StoreListItemConfig[];
  // 选中的门店
  selectedStore: string;
  // 设置选中的门店
  setSelectedStore(selectedStore: string): void;
  // 表单提交
  onFinish(
    selectedRowKeysList: React.Key[],
    advertisementMachine: AdvertisementMachine,
    deviceType: DeviceType,
  ): void;
}
