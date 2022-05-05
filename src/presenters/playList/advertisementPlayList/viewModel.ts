/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:17:10
 */
import {
  AdvertisementPlayListItemConfig,
  OperateAdvertisementEntity,
} from '../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';

// 播放状态
export enum PlayStatus {
  // 未开始
  NotStart = 'NOT_STARTED',
  // 播放中
  Playing = 'PLAYING',
  // 已完成
  Completed = 'COMPLETED',
  // 停止播放
  Stop = 'STOP',
  // 未完成
  NotCompleted = 'NOT_COMPLETED',
  // 异常
  Abnormal = 'ABNORMAL',
}

// 列表数据格式（不包含分页数据）
export interface AdvertisementPlayListDataConfig extends AdvertisementPlayListItemConfig {
  key?: number;
}

export interface AdvertisementPlayParamsConfig {
  size: number;
  page: number;
  queryType: string;
  status?: string;
  approvalStatus?: string;
  storeIdList?: string;
  adName?: string;
  deviceName?: string;
}

export default interface AdvertisementPlayListViewModel {
  // 播放广告列表-单项数据
  advertisementPlayListItemData: AdvertisementPlayListItemConfig;
  // 播放广告列表-整体数据
  advertisementPlayListData: CommonPagesGeneric<AdvertisementPlayListDataConfig>;
  // 播放广告列表-表格数据
  advertisementPlayListDataSource: AdvertisementPlayListDataConfig[];
  // 查询参数
  queryParams: AdvertisementPlayParamsConfig;
  // 获取列表数据
  getAdvertisementPlayList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 搜索表单查询
  onFinish(values: AdvertisementPlayParamsConfig): void;
  // 发布状态-查询表单数据
  selectStatus(e: string): void;
  statusData: LookupsEntity[];
  getStatus(): void;
  // 项目/门店列表数据
  storesListData: StoreListItemConfig[];
  selectStores(e: string): void;
  getStoresList(): void;
  // 操作事件
  onOperate(params: OperateAdvertisementEntity): Promise<void>;
  // 删除单条数据
  deleteItem(record: AdvertisementPlayListDataConfig): void;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: AdvertisementPlayListDataConfig): Promise<void>;
  // 续播广告名称
  continuePlayName?: string;
  // 设置续播广告名称
  setContinuePlayName(e: string): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
}
