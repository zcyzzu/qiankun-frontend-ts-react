/*
 * @Author: tongyuqiang
 * @Date: 2021-06-16 09:54:59
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:15:48
 */
import { FormInstance } from 'antd';
import { isEqual } from 'lodash';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { injectable, inject } from 'inversify';
import CreateProjectModalViewModel from './viewModal';
import { ModalStatus } from '../../../../common/config/commonConfig';
import StoreListViewModel, { StoreListDataConfig, StoreType } from '../viewModel';
import { ORGANIZATION_TREE_IDENTIFIER, DEVICE_IDENTIFIER } from '../../../../constants/identifiers';
import DeviceUseCase from '../../../../domain/useCases/deviceUseCase';
import { OrganizationTreeListEntity } from '../../../../domain/entities/organizationEntities';
import utils from '../../../../utils/index';
import StoreUseCase from '../../../../domain/useCases/organizationUseCase';

import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';

@injectable()
export default class CreateProjectModalViewModelImpl implements CreateProjectModalViewModel {
  @inject(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_USE_CASE)
  private storeUseCase!: StoreUseCase;

  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private deviceUseCase!: DeviceUseCase;

  // 弹窗新增编辑类型参数
  public createProjectModalType: ModalStatus;
  // 弹窗项目门店类型参数
  public createStoresType: string;
  public createProjectModalVisible: boolean;
  public organizationData: OrganizationTreeListEntity[];
  // 编辑单条数据
  public storeItemData: StoreListDataConfig;
  public cityCodeData: string | undefined;
  public countyCode: string | undefined;
  public add: boolean;
  public mapKey: number = 0;

  public constructor() {
    this.createProjectModalVisible = false;
    this.createProjectModalType = ModalStatus.Creat;
    this.createStoresType = StoreType.Project;
    this.organizationData = [];
    this.storeItemData = {};
    this.cityCodeData = '';
    this.countyCode = '';
    this.add = false;

    makeObservable(this, {
      createProjectModalVisible: observable,
      createProjectModalType: observable,
      createStoresType: observable,
      organizationData: observable,
      storeItemData: observable,
      cityCodeData: observable,
      countyCode: observable,
      add: observable,
      mapKey: observable,
      onFinish: action,
      onCreate: action,
      getOrganization: action,
      setStoreModalVisible: action,
      close: action,
    });
  }

  // modal开关
  public ModalSwitch = (): void => {
    this.createProjectModalVisible = !this.createProjectModalVisible;
  };

  // 弹窗类型
  public setStoreModalVisible = (
    statusType: ModalStatus,
    storesType: string,
    itemData: StoreListDataConfig,
  ): void => {
    this.createProjectModalVisible = !this.createProjectModalVisible;
    this.createProjectModalType = statusType;
    this.createStoresType = storesType;
    this.storeItemData = itemData;
  };
  //保存后打开新的弹窗
  public onCreate = (add: boolean, formRef?: React.RefObject<FormInstance<unknown>>): void => {
    this.add = add;
    formRef?.current?.submit();
  };
  // 表单提交
  public onFinish = (
    values: StoreListItemConfig,
    storeListViewModel: StoreListViewModel,
    formRef?: React.RefObject<FormInstance<unknown>>,
  ): void => {
    const newValues: StoreListItemConfig = {};
    Object.assign(newValues, values);
    let time1;
    let time2;
    let categoryName;
    if (newValues.runningTime) {
      time1 = newValues.runningTime[0].format('HH:mm:ss');
      time2 = newValues.runningTime[1].format('HH:mm:ss');
    }
    if (newValues.categoryCode) {
      const index = storeListViewModel.categoryData.findIndex(
        (item) => item.value === newValues.categoryCode,
      );
      categoryName = storeListViewModel.categoryData[index].meaning;
    }
    const params = {
      beginBusinessHours: time1,
      endBusinessHours: time2,
      cityCode: this.cityCodeData || this.storeItemData.cityCode,
      countyCode: this.countyCode || this.storeItemData.countyCode,
      category: categoryName,
    };
    const unitObj = {
      unitId: newValues.organization?.split('+')[0],
      unitName: newValues.organization?.split('+')[1],
    };
    if (this.createProjectModalType === ModalStatus.Creat) {
      // 新增接口
      Object.assign(newValues, params, unitObj, { type: this.createStoresType });
      delete newValues.runningTime;
      delete newValues.organization;
      this.deviceUseCase
        .addStore(newValues)
        .then(() => {
          this.ModalSwitch();
          utils.globalMessge({
            content: '保存成功',
            type: 'success',
          });
          this.storeItemData = {};
          formRef?.current?.setFieldsValue({
            id: undefined,
            address: undefined,
            status: true,
            unitId: undefined,
            unitName: undefined,
            beginBusinessHours: undefined,
            endBusinessHours: undefined,
            type: this.createStoresType,
            category: undefined,
            categoryCode: undefined,
            city: undefined,
            cityCode: undefined,
            county: undefined,
            countyCode: undefined,
            name: undefined,
            runningTime: undefined,
            description: undefined,
            latitude: undefined,
            longitude: undefined,
            organization: undefined,
          });
          if (this.add) {
            this.createProjectModalVisible = true;
            this.storeItemData = { status: true };
            this.add = false;
          }
          storeListViewModel.getStoreList();
        })
        .catch((err) => {
          utils.globalMessge({
            content: `${err.message}!`,
            type: 'error',
          });
        });
    } else {
      //编辑接口
      const newParam: StoreListItemConfig = {};
      Object.assign(newParam, newValues, this.storeItemData, values);
      if (this.storeItemData.unitName !== values.organization) {
        Object.assign(newParam, unitObj);
      }
      Object.assign(newParam, params);
      delete newParam.runningTime;
      delete newParam.organization;
      if (isEqual(newParam, this.storeItemData)) {
        utils.globalMessge({
          content: '请修改后再保存哦~',
          type: 'error',
        });
      } else {
        this.deviceUseCase
          .editStore(newParam)
          .then(() => {
            this.ModalSwitch();
            utils.globalMessge({
              content: '保存成功',
              type: 'success',
            });
            storeListViewModel.getStoreList();
            // organizationTreeViewModel?.getTreeData();
          })
          .catch((err) => {
            utils.globalMessge({
              content: `${err.message}!`,
              type: 'error',
            });
          });
      }
    }
    this.mapKey = new Date().getTime();
  };

  public childrenTree = (val?: OrganizationTreeListEntity[]): void => {
    if (val) {
      val.forEach((item) => {
        const { unitId, unitName } = item;
        const orgData = `${unitId}+${unitName}`;
        const obj = {
          title: unitName,
          value: orgData,
        };
        Object.assign(item, obj);
        if (item.children) {
          this.childrenTree(item.children);
        }
      });
    }
  };

  // 获取组织列表数据
  public getOrganization = async (): Promise<void> => {
    try {
      await this.storeUseCase.getAllStoreTreeListWithStore();
      runInAction(() => {
        this.organizationData = this.storeUseCase.storeTreeListData;
        this.organizationData.forEach((item) => {
          const { unitId, unitName } = item;
          const orgData = `${unitId}+${unitName}`;
          const obj = {
            title: unitName,
            value: orgData,
          };
          Object.assign(item, obj);
          if (item.children) {
            this.childrenTree(item.children);
          }
        });
      });
    } catch (error) {
      runInAction(() => {
        this.organizationData = [];
      });
    }
  };

  public close = (): void => {
    this.createProjectModalVisible = false;
  };
}
