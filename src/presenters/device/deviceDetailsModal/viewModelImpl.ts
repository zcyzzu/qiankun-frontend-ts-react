/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:38:49
 */
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import DeviceDetailsModalViewModel from './viewModel';
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { ROOT_CONTAINER_IDENTIFIER } from '../../../constants/identifiers';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';

@injectable()
export default class DeviceDetailsModalViewModelImpl implements DeviceDetailsModalViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // 查看设备弹窗状态
  public deviceDetailsVisible: boolean;
  //
  public deviceListItemData: DeviceRecordListItemConfig;
  public supportedFeatureData: LookupsEntity[];
  public advertisementLevelTypeCode: LookupsEntity[];
  public playStatusCode: LookupsEntity[];

  public constructor() {
    this.deviceDetailsVisible = false;
    this.deviceListItemData = {};
    this.supportedFeatureData = [];
    this.advertisementLevelTypeCode = [];
    this.playStatusCode = [];

    makeObservable(this, {
      deviceDetailsVisible: observable,
      deviceListItemData: observable,
      supportedFeatureData: observable,
      advertisementLevelTypeCode: observable,
      playStatusCode: observable,
      setDeviceDetailsVisible: action,
      getLookupsValue: action,
    });
  }

  //设置标签model显示隐藏以及新增还是修改详情
  public setDeviceDetailsVisible = (): void => {
    this.deviceDetailsVisible = !this.deviceDetailsVisible;
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取是否支持特征广告快码数据
        if (code === LookupsCodeTypes.SUPPORTEDFEATURE_CODE) {
          this.supportedFeatureData = [...this.rootContainerUseCase.lookupsValue];
        }
        // 获取广告等级类型快码数据
        if (code === LookupsCodeTypes.AD_LEVEL_TYPE_CODE) {
          this.advertisementLevelTypeCode = [...this.rootContainerUseCase.lookupsValue];
        }

        // 获取审批状态快码数据
        if (code === LookupsCodeTypes.AD_PLAY_STATE_CODE) {
          this.playStatusCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.supportedFeatureData = [];
        this.advertisementLevelTypeCode = [];
        this.playStatusCode = [];
      });
    }
  };
}
