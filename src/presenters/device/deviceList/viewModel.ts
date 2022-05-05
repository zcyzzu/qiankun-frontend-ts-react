/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 10:49:30
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-12 18:45:27
 */
import { DeviceType } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { DeviceTypeNumberEntity } from '../../../domain/entities/deviceEntities';

export default interface DeviceListViewModel {
  // 获取tab设备类型列表
  getTabsList(): void;
  // 设备类型
  deviceTypeData: LookupsEntity[];
  // 当前选中的设备类型
  currentDevicetype: DeviceType;
  // 设置当前选中的设备类型
  setCurrentDevicetype(deviceType?: string): void;
  // tab栏 设备类型和数量
  deviceInfo: DeviceTypeNumberEntity;
  // 组织id
  unitId: number | undefined;
  // 门店id
  storeId: number | undefined;
  // 设置组织id
  setUnitId(unitId?: number): void;
  // 设置门店id
  setStoreId(storeId?: number): void;
}
