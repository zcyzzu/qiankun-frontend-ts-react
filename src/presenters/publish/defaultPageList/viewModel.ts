/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-17 09:54:21
 */
import { PublishDefaultPageListItemConfig } from '../../../domain/entities/defaultPageEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

// 缺省页列表数据格式（不包含分页数据）
export interface PublishDefaultPageListDataConfig extends PublishDefaultPageListItemConfig {
  key?: number;
}

export interface DefaultPageParamsConfig {
  size: number;
  page: number;
  unitId?: number;
  deviceType?: string;
}

export default interface PublishDefaultPageListViewModel {
  // 缺省页列表-单项数据
  publishDefaultPageListItemData: PublishDefaultPageListItemConfig;
  // 缺省页列表-整体数据
  publishDefaultPageListData: CommonPagesGeneric<PublishDefaultPageListDataConfig>;
  // 缺省页列表-表格数据
  publishDefaultPageListDataSource: PublishDefaultPageListDataConfig[];
  // 查询参数
  queryParams: DefaultPageParamsConfig;
  // 获取列表数据
  getPublishDefaultPageList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 设备类型
  getDeviceType(): void;
  deviceTypeData: LookupsEntity[];
  selectDeviceList(e: string): void;
  // 删除列表单项数据
  deleteItem(record: PublishDefaultPageListDataConfig): void;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: PublishDefaultPageListDataConfig): Promise<void>;
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
