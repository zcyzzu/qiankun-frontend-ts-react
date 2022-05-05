/*
 * @Author: zhangchenyang
 * @Date: 2021-12-07 17:47:09
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-22 17:00:12
 */
import { makeObservable, action, observable, runInAction } from 'mobx';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { injectable, inject } from 'inversify';
import BatchEditModalViewModel, { GroupList } from './viewModel';
import AdvertisementMachine, { DeviceRecordDataConfig } from '../advertisementMachine/viewModel';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import { DeviceType } from '../../../common/config/commonConfig';
import utils from '../../../utils/index';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';

import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';

@injectable()
export default class BatchEditModalViewModelImpl implements BatchEditModalViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private deviceUseCase!: DeviceUseCase;
  public batchEditModalVisible: boolean;
  public deviceGroupStatus: boolean;
  public storeGroupStatus: boolean;
  public deviceGroupList: GroupList[];
  public selectedGroupList: string[];
  public selectedStore: string;
  public storeDataList: StoreListItemConfig[];
  public constructor() {
    this.batchEditModalVisible = false;
    this.deviceGroupStatus = false;
    this.storeGroupStatus = false;
    this.deviceGroupList = [];
    this.selectedGroupList = [];
    this.selectedStore = '';
    this.storeDataList = [];
    makeObservable(this, {
      batchEditModalVisible: observable,
      deviceGroupStatus: observable,
      storeGroupStatus: observable,
      deviceGroupList: observable,
      selectedGroupList: observable,
      selectedStore: observable,
      storeDataList: observable,
      setBatchEditModalVisible: action,
      setDeviceGroupStatus: action,
      setStoreGroupStatus: action,
      setSelectedGroupList: action,
      onFinish: action,
      setSelectedStore: action,
      clearSelectedGroup: action,
    });
  }

  // 设置设备分组状态
  public setDeviceGroupStatus = (val: boolean, unitIds?: number): void => {
    this.deviceGroupStatus = val;
    if (val) {
      this.getGroupList(unitIds);
    } else {
      this.clearSelectedGroup();
    }
  };

  // 清空选中的组名
  public clearSelectedGroup = (): void => {
    this.selectedGroupList = [];
  };

  // 设置所属门店状态
  public setStoreGroupStatus = async (
    val: boolean,
    selectedRowItemData: DeviceRecordDataConfig[],
  ): Promise<void> => {
    const [item] = selectedRowItemData;
    this.storeGroupStatus = val;
    if (val) {
      const data = await this.deviceUseCase.getSelectStoreListByDeviceOrgId([item.unitId || 0]);
      this.storeDataList = [...data];
    } else {
      this.selectedStore = '';
    }
  };

  // 设置弹窗状态
  public setBatchEditModalVisible = (val: boolean): void => {
    this.batchEditModalVisible = val;
    if (!val) {
      this.deviceGroupStatus = false;
      this.storeGroupStatus = false;
    }
  };

  // 获取分组列表
  public getGroupList = async (unitIds?: number): Promise<void> => {
    await this.deviceUseCase.getGroupList(unitIds);
    runInAction(() => {
      this.deviceGroupList = this.deviceUseCase.groupListData.map((ele) => {
        return {
          label: ele.groupName,
          value: String(ele.id),
        };
      });
    });
  };

  // 设置选择组名
  public setSelectedGroupList = (val: CheckboxValueType[]): void => {
    this.selectedGroupList = val as string[];
  };

  // 设置选择的门店
  public setSelectedStore = (selectedStore: string): void => {
    this.selectedStore = selectedStore;
  };

  // 表单提交
  public onFinish = async (
    deviceIdList: React.Key[],
    advertisementMachine: AdvertisementMachine,
    deviceType: DeviceType,
  ): Promise<void> => {
    if (this.deviceGroupStatus && !this.selectedGroupList.length) {
      utils.globalMessge({
        content: '分组未选择',
        type: 'error',
      });
      return;
    }
    if (this.storeGroupStatus && !this.selectedStore) {
      utils.globalMessge({
        content: '项目/门店未选择',
        type: 'error',
      });
      return;
    }
    if (!this.storeGroupStatus && !this.deviceGroupStatus) {
      utils.globalMessge({
        content: '请选择批量修改的属性!',
        type: 'error',
      });
      return;
    }
    try {
      await this.deviceUseCase.batchUpdate(
        deviceIdList as string[],
        this.selectedGroupList,
        this.selectedStore,
      );
      utils.globalMessge({
        content: '批量修改成功',
        type: 'success',
      });
      this.clearSelectedGroup()
      this.setSelectedStore('')
    } catch (error) {
      utils.globalMessge({
        content: `批量修改失败, ${error.message}`,
        type: 'error',
      });
    }
    this.setBatchEditModalVisible(false);
    await advertisementMachine.getDeviceList(deviceType);
  };
}
