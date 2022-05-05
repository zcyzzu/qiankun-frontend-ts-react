/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-17 10:06:56
 */
import { DefaultPageListItemConfig } from '../../../domain/entities/defaultPageEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

// 缺省页列表数据格式（不包含分页数据）
export interface DefaultPageListDataConfig extends DefaultPageListItemConfig {
  key?: number;
}

export interface DefaultPageParamsConfig {
  size: number;
  page: number;
  deviceType?: string;
}

export default interface DefaultPageListViewModel {
  // 缺省页列表-单项数据
  defaultPageListItemData: DefaultPageListItemConfig;
  // 缺省页列表-整体数据
  defaultPageListData: CommonPagesGeneric<DefaultPageListDataConfig>;
  // 缺省页列表-表格数据
  defaultPageListDataSource: DefaultPageListDataConfig[];
  // 查询参数
  queryParams: DefaultPageParamsConfig;
  // 获取列表数据
  getDefaultPageList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 设备类型
  getDeviceType(): void;
  deviceTypeData: LookupsEntity[];
  selectDeviceList(e: string): void;
  // 删除单条列表数据
  deleteItem(record: DefaultPageListDataConfig): void;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: DefaultPageListDataConfig): Promise<void>;
  // 初始化筛选项
  initQueryParams(): void;
}
