/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:14:10
 */
import { AdvertisementApproveListItemConfig } from '../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

// 设备状态
export enum DeviceStatus {
  // 编辑中
  Editing = 'EDITING',
  // 待审批
  Pending = 'PENDING',
  // 审批中
  Approval = 'APPROVAL',
  // 已完成/已生效
  Passed = 'PASSED',
  // 已驳回
  Rejected = 'REJECTED',
  // 已过期
  Expired = 'EXPIRED',
  // 已失效
  Invalid = 'INVALID',
}

// 项目门店列表数据格式（不包含分页数据）
export interface AdvertisementApproveListDataConfig extends AdvertisementApproveListItemConfig {
  key?: number;
}

export interface AdvertisementApproveParamsConfig {
  size: number;
  page: number;
  queryType: string;
  status?: string;
  name?: string;
  flag?: boolean;
}

export default interface AdvertisementApproveListViewModel {
  // 审批广告列表-单项数据
  advertisementApproveListItemData: AdvertisementApproveListItemConfig;
  // 审批广告列表-整体数据
  advertisementApproveListData: CommonPagesGeneric<AdvertisementApproveListDataConfig>;
  // 审批广告列表-表格数据
  advertisementApproveListDataSource: AdvertisementApproveListDataConfig[];
  // 搜索表单查询
  onFinish(values: AdvertisementApproveListDataConfig): void;
  // 查询参数
  queryParams: AdvertisementApproveParamsConfig;
  // 获取列表数据
  getAdvertisementApproveList(): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 改变页码大小回调
  sizeChange(current: number, size: number): void;
  // 状态-查询表单数据
  selectStatus(e: string): void;
  statusData: LookupsEntity[];
  getStatus(): void;
  // 获取仅自己审批的广告数据
  getApproveList(checked: boolean): void;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: AdvertisementApproveListDataConfig): Promise<void>;
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
