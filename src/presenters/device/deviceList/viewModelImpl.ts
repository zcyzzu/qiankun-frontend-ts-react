/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 10:49:37
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:40:27
 */
import { makeObservable, action, runInAction, observable } from 'mobx';
import { injectable, inject } from 'inversify';
import DeviceListViewModel from './viewModel';
import { DeviceTypeNumberEntity } from '../../../domain/entities/deviceEntities';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';

import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import { DeviceType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { ROOT_CONTAINER_IDENTIFIER, DEVICE_IDENTIFIER } from '../../../constants/identifiers';

@injectable()
export default class DeviceListViewModelImple implements DeviceListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private deviceUseCase!: DeviceUseCase;

  public deviceTypeData: LookupsEntity[];
  public currentDevicetype: DeviceType;
  public deviceInfo: DeviceTypeNumberEntity;
  public unitId: number | undefined = undefined;
  public storeId: number | undefined = undefined;

  public constructor() {
    this.deviceTypeData = [];
    this.currentDevicetype = DeviceType.Advertisement;
    this.deviceInfo = {};
    this.unitId = undefined;
    makeObservable(this, {
      unitId: observable,
      deviceTypeData: observable,
      currentDevicetype: observable,
      deviceInfo: observable,
      storeId: observable,
      getTabsList: action,
      setCurrentDevicetype: action,
      setUnitId: action,
      setStoreId: action,
    });
  }

  // 设置组织ID
  public setUnitId = (unitId: number | undefined): void => {
    this.unitId = unitId;
    this.storeId = undefined;
  };
  // 设置门店ID
  public setStoreId = (storeId: number | undefined): void => {
    this.storeId = storeId;
    this.unitId = undefined;
  };

  public getTabsList = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_CODE);
      const data = await this.deviceUseCase.getTypeAndNumber(this.unitId, this.storeId);
      runInAction(() => {
        this.deviceTypeData = [...this.rootContainerUseCase.lookupsValue];
        this.deviceInfo = data;
      });
    } catch (error) {
      runInAction(() => {
        this.deviceTypeData = [];
        this.deviceInfo = {};
      });
    }
  };

  public setCurrentDevicetype = (deviceType: string): void => {
    // 设置当前选中的设备类型
    switch (deviceType) {
      case DeviceType.Advertisement:
        this.currentDevicetype = DeviceType.Advertisement;
        break;
      case DeviceType.Cashier:
        this.currentDevicetype = DeviceType.Cashier;
        break;
      case DeviceType.Led:
        this.currentDevicetype = DeviceType.Led;
        break;
      case DeviceType.Raspberry:
        this.currentDevicetype = DeviceType.Raspberry;
        break;
      default:
        this.currentDevicetype = DeviceType.Advertisement;
        break;
    }
  };
}
