/*
 * @Author: tongyuqiang
 * @Date: 2021-11-25 15:00:59
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:40:14
 */
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { isEqual } from 'lodash';
import { FormInstance } from 'antd';
import DeviceListViewModel from '../deviceList/viewModel';

import DeviceEditModal from './viewModel';
import { DeviceType, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import {
  DeviceRecordListItemConfig,
  StoreListItemConfig,
  GroupListEntity,
} from '../../../domain/entities/deviceEntities';
import {
  DEVICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  ORGANIZATION_TREE_IDENTIFIER,
} from '../../../constants/identifiers';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import utils from '../../../utils/index';
import AdvertisementMachineViewModel from '../advertisementMachine/viewModel';
import RaspberryMachinePropsViewModel from '../raspberryMachine/viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import {
  OrganizationTreeListEntity,
  OrganizationListByUnitEntity,
} from '../../../domain/entities/organizationEntities';
import StoreUseCase from '../../../domain/useCases/organizationUseCase';
import RootContainereViewModel from '../../rootContainer/viewModel';

@injectable()
export default class DeviceEditModalViewModelImpl implements DeviceEditModal {
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private deviceUseCase!: DeviceUseCase;

  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  @inject(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_USE_CASE)
  private storeUseCase!: StoreUseCase;

  public deviceEditVisible: boolean;
  public selectedDeviceType: DeviceType;
  // 所选设备数据
  public selectedDeviceDate: DeviceRecordListItemConfig;
  // 弹窗类型
  public modalType: ModalStatus;
  public supportedFeatureData: LookupsEntity[];
  public floorData: LookupsEntity[];
  public resolutionData: LookupsEntity[];
  public deviceBrandFormatData: LookupsEntity[];
  public organizationData: OrganizationTreeListEntity[];
  public orgId: number;
  public tenantId: number;
  public createStatus: boolean;
  public raspberryFormRefData: React.RefObject<FormInstance<unknown>> | undefined;
  public storeListData: StoreListItemConfig[];
  public groupListData: GroupListEntity[];
  public currentUnitId: number;
  public managerDepartmentData: OrganizationListByUnitEntity[];
  public tabDeviceType: DeviceType;

  public constructor() {
    this.deviceEditVisible = false;
    this.selectedDeviceType = DeviceType.Advertisement;
    this.selectedDeviceDate = {};
    this.modalType = ModalStatus.Edit;
    this.supportedFeatureData = [];
    this.floorData = [];
    this.resolutionData = [];
    this.deviceBrandFormatData = [];
    this.organizationData = [];
    this.orgId = 0;
    this.tenantId = 0;
    this.createStatus = false;
    this.raspberryFormRefData = undefined;
    this.storeListData = [];
    this.groupListData = [];
    this.currentUnitId = 0;
    this.managerDepartmentData = [];
    this.tabDeviceType = DeviceType.Advertisement;

    makeObservable(this, {
      deviceEditVisible: observable,
      selectedDeviceType: observable,
      selectedDeviceDate: observable,
      modalType: observable,
      supportedFeatureData: observable,
      floorData: observable,
      resolutionData: observable,
      deviceBrandFormatData: observable,
      organizationData: observable,
      orgId: observable,
      tenantId: observable,
      createStatus: observable,
      raspberryFormRefData: observable,
      storeListData: observable,
      groupListData: observable,
      currentUnitId: observable,
      managerDepartmentData: observable,
      tabDeviceType: observable,
      setDeviceEditVisible: action,
      onFinish: action,
      deviceEditModalSwitch: action,
      getLookupsValue: action,
      onCreate: action,
      getOrganization: action,
      childrenTree: action,
      initialData: action,
      getStoreList: action,
      deviceTypeChange: action,
      getGroupList: action,
      submitFailed: action,
      selectOrganization: action,
      getManagerDepartmentData: action,
    });
  }

  // 所选设备类型
  public setDeviceEditVisible = async (
    item: DeviceRecordListItemConfig,
    type: DeviceType,
    modalStatus?: ModalStatus,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    this.tabDeviceType = type;
    this.deviceEditVisible = !this.deviceEditVisible;
    this.selectedDeviceType = type;
    this.selectedDeviceDate = item;
    this.modalType = modalStatus || ModalStatus.Edit;
    if (this.selectedDeviceDate.unitId) {
      this.currentUnitId = this.selectedDeviceDate.unitId;
    }
    if (rootContainereViewModel) {
      this.orgId = rootContainereViewModel.userInfo.organizationId || 0;
      this.tenantId = rootContainereViewModel.userInfo.tenantId || 0;
    }
  };

  // modal开关
  public deviceEditModalSwitch = (): void => {
    this.deviceEditVisible = !this.deviceEditVisible;
    this.initialData();
  };

  // 表单提交
  public onFinish = (
    values: DeviceRecordListItemConfig,
    advertisementMachineViewModel?: AdvertisementMachineViewModel,
    raspberryMachinePropsViewModel?: RaspberryMachinePropsViewModel,
    deviceListViewModel?: DeviceListViewModel,
  ): void => {
    if (this.modalType === ModalStatus.Edit) {
      const newParam: DeviceRecordListItemConfig = {};
      Object.assign(newParam, this.selectedDeviceDate);
      Object.assign(newParam, values);
      if (isEqual(newParam, this.selectedDeviceDate)) {
        utils.globalMessge({
          content: '请修改后再保存哦~',
          type: 'error',
        });
      } else {
        Object.assign(newParam, {
          tenantId: this.tenantId,
          organizationId: this.orgId,
          unitId: values.unitName?.includes('+')
            ? values.unitName?.split('+')[0]
            : this.selectedDeviceDate.unitId,
          unitName: values.unitName?.includes('+')
            ? values.unitName?.split('+')[1]
            : this.selectedDeviceDate.unitName,
          managerDepartmentId: values.managerDepartmentList,
          managerDepartmentIdList: values.managerDepartmentList,
          groupIdList: values.groupNameList,
          projectStoreId: values.projectStoreId,
        });
        this.deviceUseCase
          .editDevice(newParam)
          .then(() => {
            utils.globalMessge({
              content: '保存成功~',
              type: 'success',
            });
            if (advertisementMachineViewModel) {
              advertisementMachineViewModel.getDeviceList(this.tabDeviceType);
            }
            if (raspberryMachinePropsViewModel) {
              raspberryMachinePropsViewModel.getDeviceList();
            }
            if (deviceListViewModel) {
              deviceListViewModel.getTabsList();
            }
            this.deviceEditModalSwitch();
          })
          .catch((err) => {
            utils.globalMessge({
              content: `${err.message}!`,
              type: 'error',
            });
          });
      }
    } else {
      const newParam: DeviceRecordListItemConfig = {};
      Object.assign(newParam, values, {
        type: DeviceType.Raspberry,
        tenantId: this.tenantId,
        organizationId: this.orgId,
        unitId: values.unitName?.split('+')[0],
        unitName: values.unitName?.split('+')[1],
        managerDepartmentIdList: [values.managerDepartmentList],
      });
      this.deviceUseCase
        .createDevice(newParam)
        .then(() => {
          utils.globalMessge({
            content: '新增设备成功~',
            type: 'success',
          });
          if (raspberryMachinePropsViewModel) {
            raspberryMachinePropsViewModel.getDeviceList();
          }
          if (deviceListViewModel) {
            deviceListViewModel.getTabsList();
          }
          if (this.createStatus) {
            this.onCreate();
            this.setDeviceEditVisible({}, DeviceType.Raspberry, ModalStatus.Creat);
          }
          this.deviceEditModalSwitch();
        })
        .catch((err) => {
          utils.globalMessge({
            content: `新增设备失败${err.message}!`,
            type: 'error',
          });
        });
    }
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
        // 获取楼层快码数据
        if (code === LookupsCodeTypes.DEVICE_FLOOR) {
          this.floorData = [...this.rootContainerUseCase.lookupsValue];
        }
        // 获取分辨率快码数据
        if (code === LookupsCodeTypes.DEVICE_RESOLUTION_TYPE) {
          this.resolutionData = [...this.rootContainerUseCase.lookupsValue];
        }
        // 设备品牌业态数据
        if (code === LookupsCodeTypes.DEVICE_BRAND_FORMAT) {
          this.deviceBrandFormatData = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.supportedFeatureData = [];
        this.floorData = [];
        this.resolutionData = [];
        this.deviceBrandFormatData = [];
      });
    }
  };

  //保存后打开新的弹窗
  public onCreate = (raspberryFormRef?: React.RefObject<FormInstance<unknown>>): void => {
    if (raspberryFormRef) {
      this.raspberryFormRefData = raspberryFormRef;
    }
    if (this.createStatus) {
      this.raspberryFormRefData?.current?.setFieldsValue({
        unitName: undefined,
        name: undefined,
        macAddress: undefined,
        ipAddress: undefined,
        subMask: undefined,
        status: undefined,
        deviceBrand: undefined,
        department: undefined,
      });
    }
    this.createStatus = true;
  };

  // 表单提交失败
  public submitFailed = (): void => {
    this.createStatus = false;
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

  // 初始化数据
  public initialData = (): void => {
    this.createStatus = false;
  };

  // 获取门店列表
  public getStoreList = async (): Promise<void> => {
    const data = await this.deviceUseCase.getSelectStoreListByDeviceOrgId([this.currentUnitId]);
    this.storeListData = [...data];
  };

  // 设备类型change
  public deviceTypeChange = (e: DeviceType): void => {
    this.selectedDeviceType = e;
  };

  // 获取门店列表
  public getGroupList = async (unitIds?: number): Promise<void> => {
    await this.deviceUseCase.getGroupList(unitIds);
    this.groupListData = [...this.deviceUseCase.groupListData];
  };

  // 组织-查询表单数据
  public selectOrganization = (
    e: string,
    formRef: React.RefObject<FormInstance<unknown>>,
  ): void => {
    formRef.current?.setFieldsValue({
      projectStoreId: undefined,
      managerDepartmentList: undefined,
    });
    if (e) {
      this.currentUnitId = Number(e.split('+')[0]);
    }
    this.getStoreList();
    this.getManagerDepartmentData();
  };

  // 获取分管部门数据
  public getManagerDepartmentData = async (): Promise<void> => {
    const data = await this.storeUseCase.getOrgListByUnit(this.currentUnitId);
    this.managerDepartmentData = data;
  };
}
