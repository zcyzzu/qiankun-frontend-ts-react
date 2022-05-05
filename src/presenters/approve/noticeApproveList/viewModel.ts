/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-17 10:04:21
 */
import { NoticeApproveListItemConfig } from '../../../domain/entities/noticeEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

// 项目门店列表数据格式（不包含分页数据）
export interface NoticeApproveListDataConfig extends NoticeApproveListItemConfig {
  key?: number;
}

export interface NoticeApproveParamsConfig {
  size: number;
  page: number;
  status?: string;
  content?: string;
  flag?: boolean;
}

export default interface NoticeApproveListViewModel {
  // 审批通知列表-单项数据
  noticeApproveListItemData: NoticeApproveListItemConfig;
  // 审批通知列表-整体数据
  noticeApproveListData: CommonPagesGeneric<NoticeApproveListDataConfig>;
  // 审批通知列表-表格数据
  noticeApproveListDataSource: NoticeApproveListDataConfig[];
  // 查询参数
  queryParams: NoticeApproveParamsConfig;
  // 获取列表数据
  getNoticeApproveList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 状态-查询表单数据
  selectStatus(e: string): void;
  getStatus(): void;
  statusData: LookupsEntity[];
  // 搜索表单查询
  onFinish(values: NoticeApproveParamsConfig): void;
  // 获取仅自己审批的数据
  getApproveList(checked: boolean): void;
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
