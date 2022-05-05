/*
 * @Author: tongyuqiang
 * @Date: 2021-06-16 09:54:59
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:35:01
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import ApproveSettingListViewModel, {
  ApproveSettingListDataConfig,
  StoreParamsConfig,
} from './viewModel';
import {
  NOTICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  ORGANIZATION_TREE_IDENTIFIER,
  APPROVE_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import NoticeUseCase from '../../../domain/useCases/noticeUseCase';
import StoreUseCase from '../../../domain/useCases/organizationUseCase';
import ApproveUseCase from '../../../domain/useCases/approveUseCase';
import { ApproveSettingListItemConfig } from '../../../domain/entities/approveEnities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import { OrganizationTreeListEntity } from '../../../domain/entities/organizationEntities';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class ApproveSettingListViewModelImpl implements ApproveSettingListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  @inject(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_USE_CASE)
  private storeUseCase!: StoreUseCase;

  // NoticeUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  // ApproveUseCase
  @inject(APPROVE_IDENTIFIER.APPROVE_USE_CASE)
  private approveUseCase!: ApproveUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public ApproveSettingListItemData: ApproveSettingListItemConfig;
  public queryParams: StoreParamsConfig;
  public selectedStore: ApproveSettingListDataConfig;
  public approveSettingListData: CommonPagesGeneric<ApproveSettingListItemConfig>;
  public ApproveSettingListDataSource: ApproveSettingListDataConfig[];
  public approveType: LookupsEntity[];
  public storesListData: StoreListItemConfig[];
  public organizationData: OrganizationTreeListEntity[];
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.ApproveSettingListItemData = {};
    this.ApproveSettingListDataSource = [];
    this.approveType = [];
    this.storesListData = [];
    this.organizationData = [];
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.approveSettingListData = {
      content: [],
    };
    this.selectedStore = {};
    makeObservable(this, {
      ApproveSettingListItemData: observable,
      ApproveSettingListDataSource: observable,
      approveSettingListData: observable,
      approveType: observable,
      storesListData: observable,
      organizationData: observable,
      queryParams: observable,
      permissionsData: observable,
      getApproveSettingList: action,
      pageChange: action,
      sizeChange: action,
      selectApprove: action,
      getApprove: action,
      selectStores: action,
      getStoresList: action,
      selectOrganization: action,
      isExist: action,
      deleteItem: action,
      getOrganization: action,
      initQueryParams: action,
      getPermissionsData: action,
      setPermissionsData: action,
    });
  }

  // 获取组织列表数据
  public getOrganization = async (): Promise<void> => {
    try {
      await this.storeUseCase.getAllStoreTreeList();
      runInAction(() => {
        this.organizationData = this.storeUseCase.storeTreeListData;
        this.organizationData.forEach((item) => {
          const { unitId, unitName } = item;
          const obj = {
            title: unitName,
            value: unitId,
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
        const obj = {
          title: unitName,
          value: unitId,
        };
        Object.assign(item, obj);
        if (item.children) {
          this.childrenTree(item.children);
        }
      });
    }
  };

  // 获取审批方式快码
  public getApprove = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.APPROVE_TYPE_CODE);
      runInAction(() => {
        this.approveType = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.approveType = [];
      });
    }
  };

  // 审批方式-查询表单数据
  public selectApprove = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.approveType = e;
    } else {
      delete this.queryParams.approveType;
    }
    this.queryParams.page = 0;
    this.getApproveSettingList();
  };

  //获取项目/门店列表数据
  public getStoresList = async (): Promise<void> => {
    try {
      await this.noticeUseCase.getStoresList();
      runInAction(() => {
        this.storesListData = this.noticeUseCase.storesListData;
      });
    } catch (e) {
      runInAction(() => {
        this.storesListData = [];
      });
    }
  };

  // 项目/门店-查询表单数据
  public selectStores = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.storeId = e;
    } else {
      delete this.queryParams.storeId;
    }
    this.queryParams.page = 0;
    this.getApproveSettingList();
  };

  // 组织-查询表单数据
  public selectOrganization = (e: string): void => {
    if (e) {
      this.queryParams.unitId = e;
    } else {
      delete this.queryParams.unitId;
    }
    this.queryParams.page = 0;
    this.getApproveSettingList();
  };

  // 获取列表数据
  public getApproveSettingList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: ApproveSettingListDataConfig[] = [];
      const { page, size, approveType, storeId, unitId } = this.queryParams;
      try {
        const data = await this.approveUseCase.getApproveSettingList(
          page,
          size,
          approveType,
          storeId,
          unitId,
        );
        runInAction(() => {
          this.approveSettingListData = data;
          if (this.approveSettingListData.content) {
            this.approveSettingListData.content.forEach(
              (item: ApproveSettingListDataConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
          this.ApproveSettingListDataSource = listData;
        });
      } catch (e) {
        utils.globalMessge({
          content: `获取列表失败，${e.message}`,
          type: 'error',
        });
      }
    });
  };

  // 切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.queryParams.page = page - 1;
    if (pageSize) {
      this.queryParams.size = pageSize;
    }
    this.getApproveSettingList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 判断该组织是否依然存在
  public isExist = async (record: ApproveSettingListDataConfig): Promise<number> => {
    try {
      const status = await this.approveUseCase.isExist(record.unitId);
      if (status === 204) {
        utils.globalMessge({
          content: '删除成功!',
          type: 'success',
        });
      }
      return status;
    } catch (err) {
      utils.globalMessge({
        content: `${err.message}`,
        type: 'error',
      });
      return 1;
    }
  };

  // 删除列表单项数据
  public deleteItem = async (record: ApproveSettingListDataConfig): Promise<void> => {
    try {
      await this.approveUseCase.deleteItem(record.id);
      utils.globalMessge({
        content: '删除成功!',
        type: 'success',
      });
    } catch (err) {
      utils.globalMessge({
        content: `删除失败，${err.message}`,
        type: 'error',
      });
    }
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.getApproveSettingList();
  };

  // 初始化查询参数
  public initQueryParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
    };
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
