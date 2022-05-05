/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 13:41:04
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:41:03
 */
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';
import { CommonPagesGeneric, ModalStatus, DeviceType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { DeviceListParamsConfig } from '../advertisementMachine/viewModel';
import DeviceEditModalViewModel from '../deviceEditModal/viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import RootContainereViewModel from '../../rootContainer/viewModel';

export interface DeviceRecordDataConfig extends DeviceRecordListItemConfig {
  key?: number;
  order?: number;
}

export default interface RaspberryMachineViewModel {
  // 获取树莓派列表
  getDeviceList(unitIds?: number, storeIds?: number): void;
  // 设备列表整体数据
  deviceListData: CommonPagesGeneric<DeviceRecordListItemConfig>;
  // 树莓派列表表格数据
  deviceListColumnDataSource: DeviceRecordDataConfig[];
  // 树莓派列表单项数据
  deviceListItemData: DeviceRecordDataConfig;
  // 搜索表单数据
  getDeviceListParams: DeviceListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 选择状态
  selectStatus(e: string): void;
  // 快码状态数据
  statusListData: LookupsEntity[];
  // 快码调用
  getLookupsValue(code: LookupsCodeTypes): void;
  // 设备名称搜索
  searchByDeviceName(e: string, unitIds?: number, storeIds?: number): void;
  // 批量删除
  batchDelete(selectedRowKeys: React.Key[]): void;
  // 删除单个设备
  deleteItemData(item: DeviceRecordListItemConfig): void;
  // 检查设备是否有播放中的广告
  checkAdPlaying(selectedRowKeys: React.Key[] | string[]): Promise<string>;
  // 列表单项的数据赋值（新增/查看/编辑）
  setDeviceItemData(
    item?: DeviceRecordDataConfig,
    deviceType?: DeviceType,
    deviceEditModalViewModel?: DeviceEditModalViewModel,
    modalStatus?: ModalStatus,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void>;
  // 初始化查询参数
  initDeviceListParams(): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
}
