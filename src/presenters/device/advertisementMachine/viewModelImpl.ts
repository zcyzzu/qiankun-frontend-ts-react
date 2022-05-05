/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 13:03:27
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:38:25
 */
import React from 'react';
import moment from 'moment';
import { cloneDeep, omit } from 'lodash';
import { injectable, inject } from 'inversify';
import { makeObservable, action, runInAction, observable } from 'mobx';
import utils from '../../../utils/index';
import { DeviceType, CommonPagesGeneric, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import AdvertisementMachineViewModel, {
  DeviceListParamsConfig,
  DeviceRecordDataConfig,
  TimingSwitchData,
} from './viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';

import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import DeviceEditModalViewModel from '../deviceEditModal/viewModel';
import RootContainereViewModel from '../../rootContainer/viewModel';
import {
  DEVICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class AdvertisementMachineViewModelImpl implements AdvertisementMachineViewModel {
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
  public deviceListData: CommonPagesGeneric<DeviceRecordListItemConfig>;
  public getDeviceListParams: DeviceListParamsConfig;
  public currentDeviceType: DeviceType;
  public floorListData: LookupsEntity[];
  public statusListData: LookupsEntity[];
  public issuedVisiblle: boolean;
  public timingSwitchData: TimingSwitchData;
  public selectedRowItemData: DeviceRecordDataConfig[] = [];
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.deviceListColumnDataSource = [];
    this.deviceListItemData = {};
    this.deviceListData = {
      content: [],
    };
    this.getDeviceListParams = {
      page: 0,
      size: 10,
    };
    this.currentDeviceType = DeviceType.Advertisement;
    this.floorListData = [];
    this.statusListData = [];
    this.issuedVisiblle = false;
    this.timingSwitchData = {};

    makeObservable(this, {
      deviceListColumnDataSource: observable,
      deviceListItemData: observable,
      deviceListData: observable,
      floorListData: observable,
      statusListData: observable,
      issuedVisiblle: observable,
      timingSwitchData: observable,
      selectedRowItemData: observable,
      permissionsData: observable,
      getDeviceList: action,
      pageChange: action,
      selectStatus: action,
      selectFloor: action,
      exportDevice: action,
      searchByDeviceName: action,
      sizeChange: action,
      deleteItemData: action,
      initDeviceListParams: action,
      checkAdPlaying: action,
      deleteBatch: action,
      shutDown: action,
      bootup: action,
      reboot: action,
      enableOrDisable: action,
      setDeviceItemData: action,
      setCheckedList: action,
      getLookupsValue: action,
      setIssuedVisiblle: action,
      delTimingSwitch: action,
      onTimingSwitchFinish: action,
      setSelectedRowItemData: action,
      updateSelectedRowItemData: action,
      setBootTime: action,
      getPermissionsData: action,
      setPermissionsData: action,
      // downLog: action,
    });
  }

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取楼层数据
        if (code === LookupsCodeTypes.DEVICE_FLOOR) {
          this.floorListData = [...this.rootContainerUseCase.lookupsValue];
          // 添加全部楼层
          this.floorListData.unshift({
            meaning: '全部楼层',
            orderSeq: this.rootContainerUseCase.lookupsValue.length + 1,
            value: 'ALL',
          });
        }
        // 获取状态数据
        if (code === LookupsCodeTypes.DEVICE_PAGE_STATUS) {
          this.statusListData = [...this.rootContainerUseCase.lookupsValue];
          // 添加全部状态
          this.statusListData.unshift({
            meaning: '全部状态',
            orderSeq: this.rootContainerUseCase.lookupsValue.length + 1,
            value: 'ALL',
          });
        }
      });
    } catch (e) {
      runInAction(() => {
        this.floorListData = [];
        this.statusListData = [];
      });
    }
  };

  // 设置 选中的 行数据
  public setSelectedRowItemData = (val: DeviceRecordDataConfig[]): void => {
    this.selectedRowItemData = val;
  };

  // 更新选中的 行数据
  public updateSelectedRowItemData = (listData: DeviceRecordDataConfig[]): void => {
    for (let i = 0; i < listData.length; i += 1) {
      for (let j = 0; j < this.selectedRowItemData.length; j += 1) {
        if (listData[i].id === this.selectedRowItemData[j].id) {
          this.selectedRowItemData[j] = listData[i];
        }
      }
    }
  };

  public getDeviceList = async (
    deviceType?: DeviceType,
    unitIds?: number,
    storeIds?: number,
  ): Promise<void> => {
    unitIds ? (this.getDeviceListParams.unitId = unitIds) : null;
    storeIds ? (this.getDeviceListParams.storeId = storeIds) : null;
    deviceType ? (this.getDeviceListParams.type = deviceType) : null;
    const { unitId, storeId } = this.getDeviceListParams;
    if (unitId || storeId) {
      try {
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
          this.updateSelectedRowItemData(listData);
        });
      } catch (error) {
        utils.globalMessge({
          content: `设备列表获取失败，${(error as Error).message}`,
          type: 'error',
        });
      }
    }
  };
  // 分组id参数赋值
  public setCheckedList = (value: number[], deviceType: DeviceType): void => {
    if (value.length > 0) {
      this.getDeviceListParams.groupIdList = value.join(',');
    } else {
      this.getDeviceListParams.groupIdList = undefined;
    }
    this.getDeviceListParams.page = 0;
    this.getDeviceList(deviceType);
  };

  // 改变页码
  public pageChange = (page: number, pageSize?: number, devicetype?: DeviceType): void => {
    this.getDeviceListParams.page = page - 1;
    if (pageSize) {
      this.getDeviceListParams.size = pageSize;
    }
    this.getDeviceList(devicetype);
  };

  // 删除单个设备
  public deleteItemData = async (
    item: DeviceRecordListItemConfig,
    devicetype: DeviceType,
  ): Promise<void> => {
    await this.deviceUseCase.deleteDevice(item.id);
    this.getDeviceList(devicetype);
  };

  // 修改当前页每页条数
  public sizeChange = (current: number, size: number, devicetype?: DeviceType): void => {
    // TODO
    console.log(current, size, devicetype);
  };

  // 初始化筛选项目
  public initDeviceListParams = (): void => {
    this.getDeviceListParams = {
      page: 0,
      size: 10,
    };
  };

  // 设备名称搜索
  public searchByDeviceName = (
    e: string,
    deviceType: DeviceType,
    unitIds?: number,
    storeIds?: number,
  ): void => {
    if (deviceType === DeviceType.Cashier) {
      if (e) {
        this.getDeviceListParams.pointBrandName = e;
      } else {
        delete this.getDeviceListParams.pointBrandName;
      }
    } else {
      if (e) {
        this.getDeviceListParams.name = e;
      } else {
        delete this.getDeviceListParams.name;
      }
    }
    this.getDeviceListParams.unitId = unitIds;
    this.getDeviceListParams.storeId = storeIds;
    this.getDeviceListParams.page = 0;
    this.getDeviceList(deviceType);
  };

  // 选择状态
  public selectStatus = (e: string, deviceType: DeviceType): void => {
    if (e === 'ALL') {
      delete this.getDeviceListParams.status;
    } else {
      this.getDeviceListParams.status = e;
    }
    this.getDeviceListParams.page = 0;
    this.getDeviceList(deviceType);
  };

  //  选择楼层
  public selectFloor = (e: string, deviceType: DeviceType): void => {
    if (e === 'ALL') {
      delete this.getDeviceListParams.floor;
    } else {
      this.getDeviceListParams.floor = e;
    }
    this.getDeviceListParams.page = 0;
    this.getDeviceList(deviceType);
  };

  // 设备列表导出
  public exportDevice = async (
    selectedRowKeys: React.Key[],
    deviceType: DeviceType,
  ): Promise<void> => {
    const params = omit(cloneDeep(this.getDeviceListParams), ['page', 'size']);
    try {
      let ids = '';
      if (deviceType === DeviceType.Cashier) {
        ids = '2,3,4,5,7,8,9,10,11,12,13,14,15,17';
      } else {
        ids = '2,3,6,7,8,9,10,11,12,13,14,15,17';
      }
      let data;
      if (selectedRowKeys.length > 0) {
        data = await this.deviceUseCase.deviceExport(
          params,
          ids,
          (selectedRowKeys as number[]).toString(),
        );
      } else {
        data = await this.deviceUseCase.deviceExport(params, ids);
      }
      let excelName = `广告机设备表${moment().format('YYYYMMDD')}.xlsx`;
      switch (deviceType) {
        case DeviceType.Advertisement:
          excelName = `广告机设备表${moment().format('YYYYMMDD')}.xlsx`;
          break;
        case DeviceType.Cashier:
          excelName = `收银机设备表${moment().format('YYYYMMDD')}.xlsx`;
          break;
        case DeviceType.Led:
          excelName = `LED设备表${moment().format('YYYYMMDD')}.xlsx`;
          break;
        default:
          excelName = `广告机设备表${moment().format('YYYYMMDD')}.xlsx`;
          break;
      }
      const eleLink = document.createElement('a');
      eleLink.download = excelName;
      eleLink.style.display = 'none';
      eleLink.href = URL.createObjectURL(data);
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
      utils.globalMessge({
        content: '设备列表导出成功!',
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `设备列表导出失败，${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 检查设备是否有播放中的广告
  public checkAdPlaying = async (selectedRowKeys: React.Key[] | string[]): Promise<string> => {
    return this.deviceUseCase.requestCheckAdPlaying(selectedRowKeys as string[]);
  };

  // 批量删除
  public deleteBatch = async (
    selectedRowKeys: React.Key[],
    deviceType: DeviceType,
  ): Promise<void> => {
    try {
      await this.deviceUseCase.deleteBatchDevice(selectedRowKeys as string[]);
      utils.globalMessge({
        content: '批量删除成功!',
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `批量删除失败，${(error as Error).message}`,
        type: 'error',
      });
    }
    this.getDeviceList(deviceType);
  };

  // 关机
  public shutDown = async (
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isSingle: boolean,
  ): Promise<void> => {
    try {
      await this.deviceUseCase.shutDownDevice(selectedRowKeys as string[]);
      utils.globalMessge({
        content: `${isSingle ? '关机' : '批量关机'}指令已下发!`,
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `${isSingle ? '关机' : '批量关机'}指令下发失败，${(error as Error).message}`,
        type: 'error',
      });
    }
    this.getDeviceList(deviceType);
  };

  // 开机
  public bootup = async (
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isSingle: boolean,
  ): Promise<void> => {
    try {
      await this.deviceUseCase.bootUpDevice(selectedRowKeys as string[]);
      utils.globalMessge({
        content: `${isSingle ? '开机' : '批量开机'}指令已下发!`,
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `${isSingle ? '开机' : '批量开机'}指令下发失败，${(error as Error).message}`,
        type: 'error',
      });
    }
    this.getDeviceList(deviceType);
  };

  // 重启
  public reboot = async (
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isSingle: boolean,
  ): Promise<void> => {
    try {
      await this.deviceUseCase.rebootDevice(selectedRowKeys as string[]);
      utils.globalMessge({
        content: `${isSingle ? '重启' : '批量重启'}指令已下发!`,
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `${isSingle ? '重启' : '批量重启'}指令下发失败，${(error as Error).message}`,
        type: 'error',
      });
    }
    this.getDeviceList(deviceType);
  };

  // 启用/禁用
  public enableOrDisable = async (
    selectedRowKeys: React.Key[] | string[],
    deviceType: DeviceType,
    isEnable: boolean,
    isSingle: boolean,
  ): Promise<void> => {
    try {
      await this.deviceUseCase.batchUpdate(
        selectedRowKeys as string[],
        undefined,
        undefined,
        isEnable,
      );
      utils.globalMessge({
        content: `设备已${isEnable ? '启用' : '禁用'}!`,
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `${isSingle ? '一键' : '批量'}${isEnable ? '启用' : '禁用'}失败，${
          (error as Error).message
        }`,
        type: 'error',
      });
    }
    this.getDeviceList(deviceType);
  };

  // public downLog = (record: string[]): Promise<void> => {
  //   console.log(record)
  // }

  // 列表单项的数据赋值（查看/编辑）
  public setDeviceItemData = async (
    item: DeviceRecordListItemConfig,
    deviceType: DeviceType,
    deviceEditModalViewModel: DeviceEditModalViewModel,
    modalStatus: ModalStatus,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    const data = await this.deviceUseCase.getDeviceDetails(item.id);
    this.deviceListItemData = cloneDeep(data);
    this.currentDeviceType = deviceType;
    if (modalStatus === ModalStatus.Edit) {
      deviceEditModalViewModel?.setDeviceEditVisible(
        this.deviceListItemData,
        deviceType,
        modalStatus,
        rootContainereViewModel,
      );
    }
  };

  public setIssuedVisiblle = (val: boolean): void => {
    this.issuedVisiblle = val;
  };

  public onTimingSwitchFinish = async (
    selectedRowKeysList: React.Key[],
    deviceType: DeviceType,
  ): Promise<void> => {
    const { bootTime, shutdownTime } = this.timingSwitchData;
    try {
      if (!bootTime && !shutdownTime) {
        utils.globalMessge({
          content: '请选择开机或关机时间！',
          type: 'error',
        });
        return;
      }
      let bootTimeSeconds = 0;
      let shutdownTimeSeconds = 0;
      if (bootTime) {
        const [bootHour, bootMin, bootSec] = bootTime?.split(':');
        bootTimeSeconds = Number(bootHour) * 3600 + Number(bootMin) * 60 + Number(bootSec);
      }
      if (shutdownTime) {
        const [shutdownHour, shutdownMin, shutdownSec] = shutdownTime?.split(':');
        shutdownTimeSeconds =
          Number(shutdownHour) * 3600 + Number(shutdownMin) * 60 + Number(shutdownSec);
      }
      if (shutdownTime && shutdownTimeSeconds <= bootTimeSeconds) {
        utils.globalMessge({
          content: '关机时间必须大于开机时间',
          type: 'error',
        });
        return;
      }
      await this.deviceUseCase.timingSwitch(
        selectedRowKeysList as number[],
        bootTime,
        shutdownTime,
      );
      this.setIssuedVisiblle(false);
      this.getDeviceList(deviceType);
      utils.globalMessge({
        content: '定时开关机设置成功！',
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `设置定时开关机失败！${(error as Error).message}!`,
        type: 'error',
      });
    }
  };

  public setBootTime = (e?: string[]): void => {
    if (e?.length) {
      const [bootTime, shutdownTime] = e;
      this.timingSwitchData.bootTime = bootTime;
      this.timingSwitchData.shutdownTime = shutdownTime;
    } else {
      this.timingSwitchData.bootTime = '';
      this.timingSwitchData.shutdownTime = '';
    }
  };

  public delTimingSwitch = async (
    deviceIdList: number[],
    deviceType: DeviceType,
  ): Promise<void> => {
    try {
      await this.deviceUseCase.delTimingSwitch(deviceIdList);
      this.getDeviceList(deviceType);
      utils.globalMessge({
        content: '删除开关机设置成功！',
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: `删除定时开关机失败！${(error as Error).message}!`,
        type: 'error',
      });
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
