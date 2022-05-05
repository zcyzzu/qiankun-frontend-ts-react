/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 13:41:13
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:41:11
 */
import { makeObservable, action, runInAction, observable } from 'mobx';
import { cloneDeep } from 'lodash';
import { injectable, inject } from 'inversify';
import RaspberryMachineViewModel, { DeviceRecordDataConfig } from './viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';
import { CommonPagesGeneric, DeviceType, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { DeviceListParamsConfig } from '../advertisementMachine/viewModel';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import DeviceEditModalViewModel from '../deviceEditModal/viewModel';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import RootContainereViewModel from '../../rootContainer/viewModel';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

import {
  DEVICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';

@injectable()
export default class RaspberryMachineViewModelImpl implements RaspberryMachineViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private deviceUseCase!: DeviceUseCase;
  // rootContainerUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;
  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;
  public deviceListColumnDataSource: DeviceRecordDataConfig[];
  public deviceListItemData: DeviceRecordDataConfig;
  public getDeviceListParams: DeviceListParamsConfig;
  public deviceListData: CommonPagesGeneric<DeviceRecordListItemConfig>;
  public statusListData: LookupsEntity[];
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.deviceListColumnDataSource = [];
    this.deviceListItemData = {};
    this.getDeviceListParams = {
      page: 0,
      size: 10,
      type: 'RASPBERRYPI',
    };
    this.deviceListData = {
      content: [],
    };
    this.statusListData = [];
    makeObservable(this, {
      deviceListColumnDataSource: observable,
      deviceListItemData: observable,
      getDeviceListParams: observable,
      deviceListData: observable,
      statusListData: observable,
      permissionsData: observable,
      getDeviceList: action,
      pageChange: action,
      selectStatus: action,
      searchByDeviceName: action,
      batchDelete: action,
      deleteItemData: action,
      setDeviceItemData: action,
      getLookupsValue: action,
      initDeviceListParams: action,
      getPermissionsData: action,
      setPermissionsData: action,
    });
  }

  // 初始化查询参数
  public initDeviceListParams = (): void => {
    this.getDeviceListParams = {
      page: 0,
      size: 10,
      type: 'RASPBERRYPI',
    };
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取状态数据
        if (code === LookupsCodeTypes.DEVICE_PAGE_STATUS) {
          this.statusListData = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.statusListData = [];
      });
    }
  };

  public getDeviceList = async (unitIds?: number, storeIds?: number): Promise<void> => {
    unitIds ? (this.getDeviceListParams.unitId = unitIds) : null;
    storeIds ? (this.getDeviceListParams.storeId = storeIds) : null;
    const data = await this.deviceUseCase.getDeviceList(this.getDeviceListParams);
    runInAction(() => {
      const listData: DeviceRecordDataConfig[] = [];
      this.deviceListData = data;
      if (this.deviceListData.content) {
        this.deviceListData.content.forEach((item: DeviceRecordListItemConfig) => {
          listData.push({
            ...item,
            key: item.id,
          });
        });
      }
      this.deviceListColumnDataSource = listData;
    });
  };

  public pageChange = (page: number, pageSize?: number): void => {
    this.getDeviceListParams.page = page - 1;
    if (pageSize) {
      this.getDeviceListParams.size = pageSize;
    }
    this.getDeviceList();
  };

  // 删除单个设备
  public deleteItemData = async (item: DeviceRecordListItemConfig): Promise<void> => {
    await this.deviceUseCase.deleteDevice(item.id);
    this.getDeviceList();
  };

  public selectStatus = (e: string): void => {
    if (e && e !== 'all') {
      this.getDeviceListParams.status = e;
    } else {
      delete this.getDeviceListParams.status;
    }
    this.getDeviceListParams.page = 0;
    this.getDeviceList();
  };

  public searchByDeviceName = (e: string, unitIds?: number, storeIds?: number): void => {
    this.getDeviceListParams.name = e;
    this.getDeviceListParams.unitId = unitIds;
    this.getDeviceListParams.storeId = storeIds;
    this.getDeviceListParams.page = 0;
    this.getDeviceList();
  };

  public batchDelete = async (selectedRowKeys: React.Key[]): Promise<void> => {
    const deviceIdList: string[] = [];
    selectedRowKeys.forEach((ele) => deviceIdList.push(String(ele)));
    await this.deviceUseCase.deleteBatchDevice(deviceIdList);
    this.getDeviceList();
  };

  // 检查设备是否有播放中的广告
  public checkAdPlaying = async (selectedRowKeys: React.Key[] | string[]): Promise<string> => {
    const deviceIdList: string[] = [];
    selectedRowKeys.forEach((ele) => deviceIdList.push(String(ele)));
    const data = await this.deviceUseCase.requestCheckAdPlaying(deviceIdList);
    return data;
  };

  // 列表单项的数据赋值（新增/编辑/查看）
  public setDeviceItemData = async (
    item: DeviceRecordDataConfig,
    deviceType: DeviceType,
    deviceEditModalViewModel?: DeviceEditModalViewModel,
    modalStatus?: ModalStatus,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    if (modalStatus === ModalStatus.Creat) {
      deviceEditModalViewModel?.setDeviceEditVisible({}, deviceType, modalStatus);
      return;
    }
    const data = await this.deviceUseCase.getDeviceDetails(item.id);
    this.deviceListItemData = cloneDeep(data);
    if (modalStatus === ModalStatus.Edit || modalStatus === ModalStatus.View) {
      deviceEditModalViewModel?.setDeviceEditVisible(
        this.deviceListItemData,
        deviceType,
        modalStatus,
        rootContainereViewModel,
      );
    }
  };

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };
}
