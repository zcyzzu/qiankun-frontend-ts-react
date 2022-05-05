/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-17 09:52:52
 */
import { AdvertisementListItemConfig } from '../../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric } from '../../../../common/config/commonConfig';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';

// 广告发布列表数据格式（不包含分页数据）
export interface AdvertisementListDataConfig extends AdvertisementListItemConfig {
  key?: number;
}

export interface AdvertisementParamsConfig {
  size: number;
  page: number;
  queryType: string;
  status?: string;
  approvalStatus?: string;
  storeIdList?: string;
  adName?: string;
  deviceName?: string;
}

export default interface AdvertisementListViewModel {
  // 广告发布列表-单项数据
  advertisementListItemData: AdvertisementListItemConfig;
  // 广告发布列表-整体数据
  advertisementListData: CommonPagesGeneric<AdvertisementListDataConfig>;
  // 广告发布列表-表格数据
  advertisementListDataSource: AdvertisementListDataConfig[];
  // 查询参数
  queryParams: AdvertisementParamsConfig;
  // 搜索表单查询
  onFinish(values: AdvertisementParamsConfig): void;
  // 获取列表数据
  getAdvertisementList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 发布状态-查询表单数据
  selectStatus(e: string): void;
  statusData: LookupsEntity[];
  getStatus(): void;
  // 项目/门店列表数据
  storesListData: StoreListItemConfig[];
  getStoresList(): void;
  // 项目/广告发布种类-查询表单数据
  selectStores(e: string): void;
  // 是否可以发布广告
  getTenantStatus(): Promise<string | boolean>;
  // 是否可以发布广告状态
  checkStaus: string | boolean;
  //删除单条数据
  deleteItem(record: AdvertisementListDataConfig): void;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: AdvertisementListDataConfig): Promise<void>;
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
