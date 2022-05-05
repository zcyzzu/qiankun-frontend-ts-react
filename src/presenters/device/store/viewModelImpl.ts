import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import StoreListViewModel, { StoreListDataConfig, StoreParamsConfig } from './viewModel';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import {
  DEVICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import { CommonPagesGeneric, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import CreateProjectModalViewModel from './createStoreModal/viewModal';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class StoreListViewModelImpl implements StoreListViewModel {
  // StoreUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private deviceUseCase!: DeviceUseCase;

  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public storeListItemData: StoreListItemConfig;
  public queryParams: StoreParamsConfig;
  public selectedStore: StoreListDataConfig;
  public storeListData: CommonPagesGeneric<StoreListItemConfig>;
  public storeListDataSource: StoreListDataConfig[];
  public categoryData: LookupsEntity[];
  public typeData: LookupsEntity[];
  public unitId?: number;
  public storeId?: number;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.storeListItemData = {};
    this.storeListDataSource = [];
    this.categoryData = [];
    this.typeData = [];
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.storeListData = {
      content: [],
    };
    this.selectedStore = {};
    makeObservable(this, {
      storeListItemData: observable,
      storeListDataSource: observable,
      storeListData: observable,
      categoryData: observable,
      typeData: observable,
      unitId: observable,
      storeId: observable,
      permissionsData: observable,
      getStoreList: action,
      pageChange: action,
      sizeChange: action,
      selectType: action,
      selectCategory: action,
      onFinish: action,
      deleteStore: action,
      isRelate: action,
      getCategory: action,
      setStoreItemData: action,
      setUnitId: action,
      setStoreId: action,
      getPermissionsData: action,
      setPermissionsData: action,
      initParams: action,
    });
  }

  // 设置组织ID
  public setUnitId = (unitId: number): void => {
    this.unitId = unitId;
    this.storeId = undefined;
    this.queryParams.page = 0;
    this.getStoreList();
  };

  // 设置门店ID
  public setStoreId = (storeId: number): void => {
    this.storeId = storeId;
    this.unitId = undefined;
    this.queryParams.page = 0;
    this.getStoreList();
  };

  public initParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
    };
  };
  // 获取列表数据
  public getStoreList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: StoreListDataConfig[] = [];
      const { name, type, city, categoryCode, page, size } = this.queryParams;
      try {
        const data = await this.deviceUseCase.getStoreList(
          page,
          size,
          name,
          type,
          city,
          categoryCode,
          this.unitId,
          this.storeId,
        );
        runInAction(() => {
          this.storeListData = data;
          if (this.storeListData.content) {
            this.storeListData.content.forEach((item: StoreListItemConfig, index: number) => {
              listData.push({
                ...item,
                key: index + 1,
              });
            });
          }
          this.storeListDataSource = listData;
        });
      } catch (e) {
        utils.globalMessge({
          content: `列表获取失败，${e.message}`,
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
    this.getStoreList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 删除列表单项数据
  public deleteStore = async (record: StoreListDataConfig): Promise<void> => {
    try {
      await this.deviceUseCase.deleteStore(record.id);
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
    this.getStoreList();
  };

  // 是否关联设备
  public isRelate = async (record: StoreListDataConfig): Promise<void> => {
    await this.deviceUseCase.isRelate(record.id);
  };
  // 获取门店类型快码
  public getType = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.STROE_TYPE_CODE);
      runInAction(() => {
        this.typeData = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.typeData = [];
      });
    }
  };
  // 类型-查询表单数据
  public selectType = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.type = e;
    } else {
      delete this.queryParams.type;
    }
    this.getStoreList();
  };

  // 获取门店种类快码
  public getCategory = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.STROE_CATEGORY_CODE);
      runInAction(() => {
        this.categoryData = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.categoryData = [];
      });
    }
  };
  // 种类-查询表单数据
  public selectCategory = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.categoryCode = e;
    } else {
      delete this.queryParams.categoryCode;
    }
    this.queryParams.page = 0;
    this.getStoreList();
  };

  //表单搜索
  public onFinish = (values: StoreParamsConfig): void => {
    const { name, city } = values;
    if (name) {
      this.queryParams.name = name;
    } else {
      delete this.queryParams.name;
    }
    if (city) {
      this.queryParams.city = city;
    } else {
      delete this.queryParams.city;
    }
    this.queryParams.page = 0;
    this.getStoreList();
  };

  // 单项数据赋值（新增/编辑）
  public setStoreItemData = async (
    statusType: ModalStatus,
    storesType: string,
    itemData: StoreListDataConfig,
    createProjectModalViewModel?: CreateProjectModalViewModel,
  ): Promise<void> => {
    if (statusType === ModalStatus.Creat) {
      createProjectModalViewModel?.setStoreModalVisible(statusType, storesType, { status: true });
      return;
    }
    await this.deviceUseCase.getStoreDetails(itemData.id).then((val) => {
      Object.assign(this.storeListItemData, { ...val });
    });
    if (statusType === ModalStatus.Edit) {
      createProjectModalViewModel?.setStoreModalVisible(
        statusType,
        storesType,
        this.storeListItemData,
      );
    }
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
