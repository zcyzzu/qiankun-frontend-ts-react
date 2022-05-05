/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 13:03:18
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:38:17
 */

import React from 'react';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';
import { DeviceType, CommonPagesGeneric, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import DeviceEditModalViewModel from '../deviceEditModal/viewModel';
import RootContainereViewModel from '../../rootContainer/viewModel';

// 获取列表数据参数结构
export interface DeviceListParamsConfig extends DeviceListParams {
  page: number;
  size: number;
}

export interface DeviceListParams {
  name?: string;
  pointBrandName?: string;
  offOn?: string;
  type?: string;
  floor?: string;
  unitId?: number;
  storeId?: number;
  groupIdList?: string;
  status?: string;
}

export interface TimingSwitchData {
  bootTime?: string;
  shutdownTime?: string;
}

export interface DeviceRecordDataConfig extends DeviceRecordListItemConfig {
  key?: number;
}

export default interface AdvertisementMachineViewModel {
  // 获取设备列表
  getDeviceList(deviceType?: DeviceType, unitId?: number, storeIds?: number): Promise<void>;
  // 设备列表整体数据
  deviceListData: CommonPagesGeneric<DeviceRecordListItemConfig>;
  // 设备列表表格数据
  deviceListColumnDataSource: DeviceRecordDataConfig[];
  // 设备列表单项数据
  deviceListItemData: DeviceRecordDataConfig;
  // 搜索表单数据
  getDeviceListParams: DeviceListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number, deviceType?: DeviceType): void;
  // 下拉框选择状态
  selectStatus(e: string, deviceType: DeviceType): void;
  // 下拉框选择楼层
  selectFloor(e: string, deviceType: DeviceType): void;
  // 设备导出
  exportDevice(selectedRowKeys: React.Key[], deviceType: DeviceType): void;
  // 设备名称搜索
  searchByDeviceName(e: string, deviceType: DeviceType, unitIds?: number, storeIds?: number): void;
  // 设置表格每页条数
  sizeChange(current: number, size: number, deviceType?: DeviceType): void;
  // 删除单项数据
  deleteItemData(item: DeviceRecordListItemConfig, devicetype: DeviceType): void;
  // 初始化筛选项
  initDeviceListParams(): void;
  // 检查设备是否有播放中的广告
  checkAdPlaying(selectedRowKeys: React.Key[] | string[]): Promise<string>;
  // 批量删除
  deleteBatch(selectedRowKeys: React.Key[], deviceType: DeviceType): void;
  // 关机
  shutDown(
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isSingle: boolean,
  ): Promise<void>;
  // 开机
  bootup(
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isSingle: boolean,
  ): Promise<void>;
  // 重启
  reboot(
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isSingle: boolean,
  ): Promise<void>;
  // 启用/禁用
  enableOrDisable(
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isEnable: boolean,
    isSingle: boolean,
  ): Promise<void>;
  // 当前所选的设备类型
  currentDeviceType: DeviceType;
  // 列表单项的数据赋值（新增/查看/编辑）
  setDeviceItemData(
    item: DeviceRecordListItemConfig,
    deviceType: DeviceType,
    deviceEditModalViewModel?: DeviceEditModalViewModel,
    modalStatus?: ModalStatus,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void>;
  // 设置列表分组参数
  setCheckedList(value: number[], deviceType: DeviceType): void;
  // 快码调用
  getLookupsValue(code: LookupsCodeTypes): void;
  // 快码楼层数据
  floorListData: LookupsEntity[];
  // 快码状态数据
  statusListData: LookupsEntity[];
  // 下发设置弹框状态
  issuedVisiblle: boolean;
  // 设置下发设置弹框状态
  setIssuedVisiblle(val: boolean): void;
  // 开关机设置单项数据
  timingSwitchData: TimingSwitchData;
  // 定时开关机设置提交
  onTimingSwitchFinish(selectedRowKeys: React.Key[], deviceType: DeviceType): void;
  // 删除定时设置
  delTimingSwitch(deviceIdList: number[], deviceType: DeviceType): void;
  // 选中的行数据
  selectedRowItemData: DeviceRecordDataConfig[];
  // 设置 选中的行数据
  setSelectedRowItemData(val: DeviceRecordDataConfig[]): void;
  // 更新 选中的行数据
  updateSelectedRowItemData(val: DeviceRecordDataConfig[]): void;
  // 设置定时开关机数据
  setBootTime(e?: string[]): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
  // 下载日志
  // downLog(record: string[]): Promise<void>;
}
