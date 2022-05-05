/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-17 09:57:17
 */
import {
  NoticeListItemConfig,
  NoticeItemDetailsEntity,
} from '../../../../domain/entities/noticeEntities';
import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';
import { CommonPagesGeneric } from '../../../../common/config/commonConfig';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';

// 列表数据格式（不包含分页数据）
export interface NoticeListDataConfig extends NoticeListItemConfig {
  key?: number;
  order?: number;
}

export interface NoticeParamsConfig {
  page: number;
  size: number;
  approveStatus?: string;
  content?: string;
  name?: string;
  storeId?: string;
}

export default interface NoticeListViewModel {
  // 通知列表-单项数据
  noticeListItemData: NoticeListItemConfig;
  // 通知列表-整体数据
  noticeListData: CommonPagesGeneric<NoticeListDataConfig>;
  // 通知列表-表格数据
  noticeListDataSource: NoticeListDataConfig[];
  // 查询参数
  queryParams: NoticeParamsConfig;
  // 获取列表数据
  getNoticeList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 发布紧急通知 查看内容单项数据
  createNoticeModalItemData: NoticeItemDetailsEntity;
  // 发布紧急通知提交
  onFinishByCreateNotice(current: number, values: NoticeItemDetailsEntity): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 状态-查询表单数据
  selectStatus(e: string): void;
  // 项目/门店列表数据
  storesListData: StoreListItemConfig[];
  // 项目/门店-查询表单数据
  selectStores(e: string): void;
  // 获取项目/门店列表数据
  getStoresList(): void;
  // 获取状态下拉框数据
  getStatus(): void;
  statusData: LookupsEntity[];
  // 搜索表单查询
  onFinish(values: NoticeParamsConfig): void;
  //  删除单条数据
  deleteNotice(record: NoticeListDataConfig): void;
  // 设置单项数据
  setCreateNoticeModalItemData(value: string, type: string): void;
  // 初始化数据
  initialData(): void;
  // 是否可以发布通知状态
  checkStaus: string | boolean;
  // 发布通知检查有无设备
  getCheckDevice(): Promise<string | boolean>;
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
