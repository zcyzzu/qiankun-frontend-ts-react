/*
 * @Author: tongyuqiang
 * @Date: 2022-03-04 09:31:27
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-04 18:00:55
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import StoreDetailsModalViewModel from './viewModel';
import { StoreListDataConfig } from '../viewModel';
import { DEVICE_IDENTIFIER } from '../../../../constants/identifiers';
import DeviceUseCase from '../../../../domain/useCases/deviceUseCase';

@injectable()
export default class StoreDetailsModalViewModelImpl implements StoreDetailsModalViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private DeviceUseCase!: DeviceUseCase;

  // 下载日志弹窗状态
  public storeDetailsModalVisible: boolean;
  public listItemData: StoreListDataConfig;

  public constructor() {
    this.storeDetailsModalVisible = false;
    this.listItemData = {};

    makeObservable(this, {
      storeDetailsModalVisible: observable,
      listItemData: observable,
      setStoreDetailsModalVisible: action,
    });
  }

  // 设置详情弹窗状态
  public setStoreDetailsModalVisible = (visible: boolean, record?: StoreListDataConfig): void => {
    if (record) {
      this.listItemData = record;
    }
    this.storeDetailsModalVisible = visible;
  };
}
