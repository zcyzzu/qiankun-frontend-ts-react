/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-25 18:09:35
 */
import {
  NoticePlayListItemConfig,
  OperateNoticeEntity,
} from '../../../domain/entities/noticeEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

// 列表数据格式（不包含分页数据）
export interface NoticePlayListDataConfig extends NoticePlayListItemConfig {
  key?: number;
}

export interface NoticePlayParamsConfig {
  page: number;
  size: number;
  status?: string;
  content?: string;
  deviceName?: string;
  storeId?: string;
}

export default interface NoticePlayListViewModel {
  // 播放广告列表-单项数据
  noticePlayListItemData: NoticePlayListItemConfig;
  // 播放广告列表-整体数据
  noticePlayListData: CommonPagesGeneric<NoticePlayListDataConfig>;
  // 播放广告列表-表格数据
  noticePlayListDataSource: NoticePlayListDataConfig[];
  // 查询参数
  queryParams: NoticePlayParamsConfig;
  // 获取列表数据
  getNoticePlayList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 状态-查询表单数据
  selectStatus(e: string): void;
  statusData: LookupsEntity[];
  // 获取状态下拉框数据
  getStatus(): void;
  // 项目/门店列表数据
  storesListData: StoreListItemConfig[];
  // 项目/门店-查询表单数据
  selectStores(e: string): void;
  // 获取项目/门店列表数据
  getStoresList(): void;
  // 搜索表单查询
  onFinish(values: NoticePlayParamsConfig): void;
  // 操作事件
  onOperate(params: OperateNoticeEntity): Promise<void>;
  //  删除单条数据
  delItem(record: NoticePlayListDataConfig): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
}
