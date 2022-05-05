/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:14:45
 */
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import { CommonPagesGeneric, ModalStatus } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import CreateProjectModalViewModel from './createStoreModal/viewModal';

// 门店类型
export enum StoreType {
  // 项目
  Project = 'PROJECT',
  // 门店
  Store = 'STORE',
}

// 项目门店列表数据格式
export interface StoreListDataConfig extends StoreListItemConfig {
  key?: number;
}

// 列表查询参数格式
export interface StoreParamsConfig {
  name?: string;
  type?: string;
  city?: string;
  categoryCode?: string;
  unitId?: number;
  storeId?: number;
  page: number;
  size: number;
}

export default interface StoreListViewModel {
  // 门店列表-单项数据
  storeListItemData: StoreListItemConfig;
  // 门店列表-整体数据
  storeListData: CommonPagesGeneric<StoreListDataConfig>;
  // 门店列表-表格数据
  storeListDataSource: StoreListDataConfig[];
  // 查询参数
  queryParams: StoreParamsConfig;
  // 获取列表数据
  getStoreList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 类型-查询表单数据
  selectType(e: string): void;
  // 种类-查询表单数据
  selectCategory(e: string): void;
  // 搜索表单查询
  onFinish(values: StoreParamsConfig): void;
  // 列表多选
  selectedStore: StoreListDataConfig;
  //是否关联设备
  isRelate(record: StoreListDataConfig): Promise<void>;
  // 删除列表单条数据
  deleteStore(record: StoreListDataConfig): void;
  // 门店种类
  categoryData: LookupsEntity[];
  // 获取门店种类
  getCategory(): void;
  // 门店类型
  typeData: LookupsEntity[];
  // 获取门店类型
  getType(): void;
  // 单条数据赋值(新增、编辑)
  setStoreItemData(
    statusType?: ModalStatus,
    storesType?: string,
    itemData?: StoreListDataConfig,
    createProjectModalViewModel?: CreateProjectModalViewModel,
  ): Promise<void>;
  // 设置组织id
  setUnitId(unitId: number | undefined): void;
  // 设置门店id
  setStoreId(storeId?: number): void;
  unitId?: number;
  storeId?: number;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
  // 初始化筛选项
  initParams(): void;
}
