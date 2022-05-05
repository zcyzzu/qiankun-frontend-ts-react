/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:13:22
 */
import { ApproveSettingListItemConfig } from '../../../domain/entities/approveEnities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import { OrganizationTreeListEntity } from '../../../domain/entities/organizationEntities';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

// 审批类型
export enum ApproveType {
  // 依次审批
  Turn = 'TURN',
  // 或签
  Or = 'OR',
}

// 审批设置列表数据格式
export interface ApproveSettingListDataConfig extends ApproveSettingListItemConfig {
  key?: number;
}

// 列表查询参数格式
export interface StoreParamsConfig {
  page: number;
  size: number;
  approveType?: string;
  storeId?: string;
  unitId?: string;
}

export default interface ApproveSettingListViewModel {
  // 审批设置列表-单项数据
  ApproveSettingListItemData: ApproveSettingListItemConfig;
  // 审批设置列表-整体数据
  approveSettingListData: CommonPagesGeneric<ApproveSettingListDataConfig>;
  // 审批设置列表-表格数据
  ApproveSettingListDataSource: ApproveSettingListDataConfig[];
  // 查询参数
  queryParams: StoreParamsConfig;
  // 获取列表数据
  getApproveSettingList(): Promise<void>;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 审批方式-查询表单数据
  selectApprove(e: string): void;
  approveType: LookupsEntity[];
  getApprove(): void;
  // 获取项目/门店列表数据
  getStoresList(): void;
  // 项目/门店列表数据
  storesListData: StoreListItemConfig[];
  // 项目/审批设置种类-查询表单数据
  selectStores(e: string): void;
  // 组织列表数据
  getOrganization(): void;
  organizationData: OrganizationTreeListEntity[];
  // 组织-查询表单数据
  selectOrganization(e: string): void;
  // 判断该组织是否依然存在
  isExist(record: ApproveSettingListDataConfig): Promise<number>;
  // 删除列表单项数据
  deleteItem(record: ApproveSettingListDataConfig): Promise<void>;
  // 初始化查询参数
  initQueryParams(): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
  // 初始化筛选项
  initQueryParams(): void;
}
