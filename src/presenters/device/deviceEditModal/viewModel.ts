/*
 * @Author: tongyuqiang
 * @Date: 2021-11-25 15:00:45
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:40:01
 */
import { FormInstance } from 'antd';
import { DeviceType, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import {
  DeviceRecordListItemConfig,
  StoreListItemConfig,
  GroupListEntity,
} from '../../../domain/entities/deviceEntities';
import AdvertisementMachineViewModel from '../advertisementMachine/viewModel';
import RaspberryMachinePropsViewModel from '../raspberryMachine/viewModel';
import DeviceListViewModel from '../deviceList/viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import {
  OrganizationTreeListEntity,
  OrganizationListByUnitEntity,
} from '../../../domain/entities/organizationEntities';
import RootContainereViewModel from '../../rootContainer/viewModel';

export default interface DeviceEditModalViewModel {
  // 编辑设备弹窗状态
  deviceEditVisible: boolean;
  // 设置窗口状态
  setDeviceEditVisible(
    item?: DeviceRecordListItemConfig,
    type?: DeviceType,
    modalStatus?: ModalStatus,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void>;
  // 设置窗口状态开关
  deviceEditModalSwitch(): void;
  // 表单提交
  onFinish(
    values: DeviceRecordListItemConfig,
    advertisementMachineViewModel?: AdvertisementMachineViewModel,
    raspberryMachinePropsViewModel?: RaspberryMachinePropsViewModel,
    deviceListViewModel?: DeviceListViewModel,
  ): void;
  // 所选设备类型
  selectedDeviceType: DeviceType;
  // 弹窗类型
  modalType: ModalStatus;
  // 所选设备数据
  selectedDeviceDate: DeviceRecordListItemConfig;
  // 请求快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 是否支持特征广告快码数据
  supportedFeatureData: LookupsEntity[];
  // 楼层数据
  floorData: LookupsEntity[];
  // 分辨率数据
  resolutionData: LookupsEntity[];
  // 设备品牌业态数据
  deviceBrandFormatData: LookupsEntity[];
  // 保存并继续添加状态
  createStatus: boolean;
  // 树莓派ref
  raspberryFormRefData: React.RefObject<FormInstance<unknown>> | undefined;
  // 保存并继续添加
  onCreate(raspberryFormRef?: React.RefObject<FormInstance<unknown>>): void;
  // 组织列表数据
  organizationData: OrganizationTreeListEntity[];
  // 获取组织列表
  getOrganization(): Promise<void>;
  orgId: number;
  tenantId: number;
  // 初始化数据
  initialData(): void;
  // 获取门店列表
  getStoreList(): Promise<void>;
  // 门店列表数据
  storeListData: StoreListItemConfig[];
  // 设备类型change
  deviceTypeChange(e: DeviceType): void;
  // 设备分组列表数据
  groupListData: GroupListEntity[];
  // 获取设备分组列表
  getGroupList(unitIds?: number): Promise<void>;
  // 表单提交失败
  submitFailed(): void;
  // 组织-查询表单数据
  selectOrganization(e: string, formRef: React.RefObject<FormInstance<unknown>>): void;
  // 当前unitId
  currentUnitId?: number;
  // 分管部门数据
  managerDepartmentData: OrganizationListByUnitEntity[];
  // 获取分管部门数据
  getManagerDepartmentData(): Promise<void>;
  // 当前tab页的设备类型
  tabDeviceType: DeviceType;
}
