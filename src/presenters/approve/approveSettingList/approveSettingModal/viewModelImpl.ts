/*
 * @Author: zhangchenyang
 * @Date: 2021-12-03 11:56:38
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-24 21:17:47
 */
import { injectable, inject } from 'inversify';
import { remove } from 'lodash';
import { action, makeObservable, observable, runInAction } from 'mobx';
import ApproveSettingListViewModel from '../viewModel';
import ApproveSettingModalViewModel, { DefaultCheckboxDataListConfig } from './viewModel';
import {
  ApproveSettingListItemConfig,
  UnitInfoConfig,
  AdminListDataItem,
  ApproveRulesRequestConfig,
} from '../../../../domain/entities/approveEnities';
import ApproveUseCase from '../../../../domain/useCases/approveUseCase';
import RootContainereViewModel from '../../../rootContainer/viewModel';

import { ModalStatus } from '../../../../common/config/commonConfig';
import utils from '../../../../utils';
import { APPROVE_IDENTIFIER } from '../../../../constants/identifiers';

@injectable()
export default class ApproveSettingModalViewModelImpl implements ApproveSettingModalViewModel {
  @inject(APPROVE_IDENTIFIER.APPROVE_USE_CASE)
  private approveUseCase!: ApproveUseCase;

  public approveSettingModalVisible: boolean;
  public approveSettingModalItemData: ApproveSettingListItemConfig;
  public selectMode: string;
  public defaultCheckboxDataList: DefaultCheckboxDataListConfig[];
  public isSelectedUnitName: boolean = false;
  public unitList: UnitInfoConfig[] = [];
  public modalTyle: ModalStatus = ModalStatus.Creat;
  public adminListData: AdminListDataItem[] = [];
  public currentUnitId: number;
  public unitIsChange: boolean;
  public approveSettingItemData: ApproveRulesRequestConfig;
  public tenantId: number;

  public constructor() {
    this.approveSettingModalVisible = false;
    this.approveSettingModalItemData = {};
    this.selectMode = 'OR';
    this.defaultCheckboxDataList = [];
    this.currentUnitId = 0;
    this.unitIsChange = false;
    this.approveSettingItemData = {};
    this.tenantId = 0;

    makeObservable(this, {
      approveSettingModalVisible: observable,
      approveSettingModalItemData: observable,
      selectMode: observable,
      defaultCheckboxDataList: observable,
      isSelectedUnitName: observable,
      unitList: observable,
      modalTyle: observable,
      adminListData: observable,
      currentUnitId: observable,
      unitIsChange: observable,
      approveSettingItemData: observable,
      tenantId: observable,
      setApproveSettingModalItemData: action,
      selectModeChange: action,
      onFinish: action,
      approveOrderChange: action,
      setIsSelectedUnitName: action,
      getUnitList: action,
      getAdminList: action,
      setApproveSettingModalVisible: action,
    });
  }

  // 获取审批人列表
  public getAdminList = async (unitId?: number): Promise<void> => {
    try {
      const data = await this.approveUseCase.getAdminInfo(unitId);
      this.adminListData = data;
      runInAction(() => {
        this.defaultCheckboxDataList = data.map((ele) => Object.assign(ele, {
          checked: false,
          sort: 0,
        }));
      })
    } catch (error) {
      console.log(error);
    }
  };

  // 获取未创建审批设置的组织列表
  public getUnitList = async (): Promise<void> => {
    try {
      const data = await this.approveUseCase.getUnitInfo();
      runInAction(() => {
        this.unitList = data;
      })
    } catch (error) {
      console.log(error);
    }
  };

  // 设置是否选择组织状态
  public setIsSelectedUnitName = async (val: boolean, e?: string): Promise<void> => {
    this.isSelectedUnitName = val;
    this.unitIsChange = true;
    const unitId = this.unitList[
      this.unitList.findIndex((ele) => ele.unitName === e)
    ].unitId || 0;
    await this.getAdminList(unitId);
    this.initORCheckboxDataList();
  };

  // 初始化已选择审批人
  public initORCheckboxDataList = (): void => {
    this.defaultCheckboxDataList.map((ele) => {
      return Object.assign(ele, {
        // eslint-disable-next-line no-unneeded-ternary
        checked: ele.adminRole ? true : false,
        sort: undefined,
      });
    });
  };

  // 设置审批设置弹窗状态
  public setApproveSettingModalVisible = async (
    value: boolean,
    type?: ModalStatus,
    record?: ApproveSettingListItemConfig,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    runInAction(async () => {
      if (!value) {
        this.isSelectedUnitName = false;
        this.selectMode = 'OR';
        this.unitIsChange = false;
      }
      if (rootContainereViewModel) {
        this.tenantId = rootContainereViewModel.userInfo.tenantId || 0;
      }
      if (type === ModalStatus.Creat) {
        this.modalTyle = ModalStatus.Creat;
        this.approveSettingModalItemData = {
          unitName: '',
          approveType: 'OR',
        };
        if (value) {
          // 获取组织列表
        await this.getUnitList();
        }
      } else if (type === ModalStatus.Edit) {
        this.modalTyle = ModalStatus.Edit;
        this.currentUnitId = record?.unitId || 0;
        const data = await this.approveUseCase.getApproveDetails(record?.id || 0);
        this.approveSettingItemData = data;
        await this.getUnitList();
        await this.getAdminList(this.currentUnitId);
        this.approveSettingModalItemData = {
          unitName: data.unitName,
          approveType: data.approveType,
        };
        if (data.unitName) {
          this.isSelectedUnitName = true;
        }
        if (data.approveType === 'OR') {
          data.instances?.map((item) => {
            this.defaultCheckboxDataList.forEach((itemData) => {
              if (item.approverId === itemData.userId) {
                // eslint-disable-next-line no-param-reassign
                itemData.checked = true;
              }
            })
          })
        }
        if (data.approveType === 'TURN') {
          this.selectMode = 'TURN';
          data.instances?.map((item) => {
            this.defaultCheckboxDataList.forEach((itemData) => {
              if (item.approverId === itemData.userId) {
                // eslint-disable-next-line no-param-reassign
                itemData.sort = item.sort;
                // eslint-disable-next-line no-param-reassign
                itemData.checked = true;
              }
            })
          })
        }
      }
      this.approveSettingModalVisible = value;
    })
  };

  // 查看内容单项数据赋值
  public setApproveSettingModalItemData = (item?: ApproveSettingListItemConfig): void => {
    console.log(item);
  };

  // 设置选择方式
  public selectModeChange = (e: string): void => {
    this.selectMode = e;
  };

  // 表单提交事件
  public onFinish = async (
    e: ApproveSettingListItemConfig,
    approveSettingListViewModel: ApproveSettingListViewModel,
  ): Promise<void> => {
    // 审批顺序是否为空
    let status = false;
    this.defaultCheckboxDataList.forEach((item) => {
      if (e.approveType === 'TURN' && item.checked && !item.sort) {
        status = true;
      }
    })
    if (status) {
        utils.globalMessge({
          content: '审批人及审批顺序不能为空！',
          type: 'error',
        });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArr: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataArr: any[] = [];
    this.defaultCheckboxDataList.forEach((item) => {
      if (item.checked && !newArr.includes(item.sort)) {
        newArr.push(item.sort);
      }
      if (item.checked) {
        dataArr.push(item);
      }
    });
    if (e.approveType === 'TURN' && dataArr.length !== newArr.length) {
      utils.globalMessge({
        content: '审批人顺序重复，请输入其他顺序！',
        type: 'error',
      });
      return;
    }
    if (this.modalTyle === ModalStatus.Creat) {
      this.currentUnitId = this.unitList[
        this.unitList.findIndex((ele) => ele.unitName === e.unitName)
      ].unitId || 0;
    }
    if (this.unitIsChange && this.modalTyle === ModalStatus.Edit) {
      this.currentUnitId = this.unitList[
        this.unitList.findIndex((ele) => ele.unitName === e.unitName)
      ].unitId || 0;
    }
    const instances = this.defaultCheckboxDataList.map((ele) => {
      if (ele.checked) {
        return {
          approverId: ele.userId,
          approverName: ele.userName,
          sort: ele.sort,
          unitId: this.currentUnitId,
          unitName: e.unitName,
          tenantId: this.tenantId,
        };
      }
      return null;
    });
    remove(instances, (ele) => {
      return ele === null;
    });
    if (!instances.length) {
      utils.globalMessge({
        content: '请选择审批人!',
        type: 'error',
      });
      return;
    }
    let params: ApproveSettingListItemConfig = {};
    if (this.modalTyle === ModalStatus.Creat) {
      params = Object.assign(e, {
        tenantId: this.tenantId,
        unitId: this.currentUnitId,
        instances,
      });
      try {
        await this.approveUseCase.createApprove(params);
        utils.globalMessge({
          content: '新建成功!',
          type: 'success',
        });
        runInAction(async () => {
          approveSettingListViewModel.initQueryParams();
          await approveSettingListViewModel.getApproveSettingList();
          this.setApproveSettingModalVisible(false);
          this.getUnitList();
        })
      } catch (error) {
        utils.globalMessge({
          content: `创建失败，${(error as Error).message}!`,
          type: 'error',
        });
      }
    }
    if (this.modalTyle === ModalStatus.Edit) {
      params = Object.assign(e, {
        tenantId: this.tenantId,
        unitId: this.currentUnitId,
        instances,
        id: this.approveSettingItemData.id,
        objectVersionNumber: this.approveSettingItemData.objectVersionNumber,
      });
      await this.approveUseCase.editApprove(params).then(() => {
        runInAction(async () => {
          utils.globalMessge({
            content: '更新成功!',
            type: 'success',
          });
          approveSettingListViewModel.initQueryParams();
          await approveSettingListViewModel.getApproveSettingList();
          this.setApproveSettingModalVisible(false);
          this.getUnitList();
        });
      });
    }
  };

  // 或签时 设置审批人
  public defaultCheckboxDataListChange = (e: boolean, index: number): void => {
    if (this.selectMode === 'TURN' && e) {
      let maxorder = 0;
      this.defaultCheckboxDataList.forEach((item) => {
        if (item.sort) {
          if (item.sort > maxorder) {
            maxorder = item.sort;
          }
        }
      });
      maxorder += 1;
      this.defaultCheckboxDataList[index].sort = maxorder;
    } else if (this.selectMode === 'TURN' && !e) {
      this.defaultCheckboxDataList[index].sort = 0;
    }
    this.defaultCheckboxDataList[index].checked = e;
  };

  // 设置审批顺序
  public approveOrderChange = (e: number, index: number): void => {
    // if (!e) {
    //   return;
    // }
    // for (let i = 0; i < this.defaultCheckboxDataList.length; i += 1) {
    //   if (this.defaultCheckboxDataList[i].sort === e) {
    //     utils.globalMessge({
    //       content: '该顺序已存在，请输入其他顺序！',
    //       type: 'error',
    //     });
    //     return;
    //   }
    // }
    runInAction(() => {
      this.defaultCheckboxDataList[index].sort = e;
    })
  };
}
