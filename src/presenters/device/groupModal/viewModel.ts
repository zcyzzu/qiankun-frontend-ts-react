/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-05 22:12:28
 */
import { GroupListEntity, DeviceListEntity } from '../../../domain/entities/deviceEntities';
import { CommonPagesGeneric, DeviceType } from '../../../common/config/commonConfig';
import AdvertisementMachineViewModel from '../advertisementMachine/viewModel';
import DeviceListViewModel from '../deviceList/viewModel';

export default interface GroupModalViewModel {
  //标签弹窗状态
  groupModalVisible: boolean;
  //设置标签窗口状态
  setGroupModalVisible(
    deviceType?: DeviceType,
    deviceListViewModel?: DeviceListViewModel,
  ): void;

  // 获取tag列表
  getGroupList(unitId?: number): void;
  // 所有tag值
  tagData: GroupListEntity[];
  // tag是否可以的删除状态
  tagVisible: boolean;
  // tag是否可以的删除
  deleteTagVisible(): void;
  // 点击tag
  tagClick(id?: number): void;
  // 删除单个tag
  deleteTag(e: React.MouseEvent<HTMLElement>, id?: number): void;
  // tag是否可以的新增状态
  addTagVisible: boolean;
  // tag是否可以的新增
  setAddTagVisible(): void;
  // 添加单个tag
  setAddTag(): void;
  // 输入新增tag
  tagOnchange(e: React.SyntheticEvent): void;
  // tag新增值
  addTagData: string;
  // 分组id
  groupId: number[];

  //改变key
  setTarKeys(nextTargetKeys: string[]): void;
  // 清空key
  setEmpty(): void;
  //key
  targetKeys: string[];
  // 设备列表
  deviceListData: DeviceListEntity[];
  deviceListDataSource: DeviceListData[];
  deviceListParams: DeviceListParams;
  deviceType: string;
  getDeviceList(id: number | undefined, deviceType: string): void;
  setDevice(advertisementMachineViewModel?: AdvertisementMachineViewModel): void;
}

export interface DeviceListData extends DeviceListEntity {
  key: string;
  disabled?: boolean;
}

// 获取设备列表参数
export interface DeviceListParams {
  groupIds?: string;
  type?: string;
  page?: number;
  size?: number;
}
