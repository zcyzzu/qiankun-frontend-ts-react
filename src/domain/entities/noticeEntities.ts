/*
 * @Author: mayajing
 * @Date: 2021-11-29 11:53:14
 * @LastEditors: mayajing
 * @LastEditTime: 2022-01-13 10:07:05
 */
import { DeviceRecordListItemConfig } from './deviceEntities';
import { CommonResponseDTO, CommonPagesGeneric } from '../../common/config/commonConfig';

//定义设备列表
interface DevicelistObj {
  deviceName?: string;
  floor?: string;
  storeName?: string;
}
// 上屏发布-通知管理列表
export interface NoticeListItemConfig extends CommonResponseDTO {
  id?: number;
  content?: string; //通知内容
  duration?: string; //展示时长
  deviceList?: Array<DevicelistObj>; //通知设备
  number?: number; //设备总数
  approveStatus?: string; //通知状态
  creationDateDesc?: string; //最新发布时间
  status?: string; //状态
  deviceName?: string; //设备名称
  storeId?: string; //项目/门店Id
}

// 上屏发布-通知列表-通知详情
export interface NoticeItemDetailsEntity extends CommonResponseDTO {
  id?: number;
  tenantId?: number;
  organizationId?: number;
  color?: string;
  backgroundColor?: string;
  backgroundTransparency?: number;
  content?: string; //通知内容
  sizeCode?: number;
  locationCode?: string;
  speedCode?: string;
  duration?: string;
  statusCode?: string;
  number?: number;
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
  approveStatus?: string;
  taskActorId?: number;
  deviceIds?: number[];
  hour?: number;
  minute?: number;
  objectVersionNumber?: number;
  second?: number;
}

// 上屏发布-通知列表-通知详情列表
export interface NoticeDetailsListEntity extends CommonResponseDTO {
  storeNum?: number;
  deviceNum?: number;
  page?: CommonPagesGeneric<NoticeDetailsListItemEntity>;
}

// 上屏发布-通知列表-通知详情列表单个
export interface NoticeDetailsListItemEntity {
  storeId?: number;
  storeName?: string;
  floor?: string;
  deviceId?: number;
  deviceName?: string;
  pointBrandName?: string;
  brandFormat?: string;
  groupNames?: GroupNamesEntity[];
  groupStr?: string;
}

export interface GroupNamesEntity extends CommonResponseDTO {
  id?: number;
  tenantId?: number;
  groupName?: string;
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
}

// 播放列表-通知列表
interface DeviceListItem {
  deviceName?: string; //设备名称
  floor?: string;
  storeName?: string;
}
export interface NoticePlayListItemConfig extends CommonResponseDTO {
  id?: number;
  content?: string; //通知内容
  duration?: string; //计划展示时长
  endDate?: string; //当前剩余时长
  deviceList?: DeviceListItem[]; //通知设备
  statusCode?: string; //通知状态
  lastUpdateDate?: string; //通知生效时间
}

// 审批管理-通知列表
export interface NoticeApproveListItemConfig extends CommonResponseDTO {
  id?: number;
  content?: string; //通知内容
  duration?: string; //展示时长
  deviceList?: string[]; //发布设备
  total?: number; //设备总数
  approveStatus?: string; //审批状态
  username?: string; //申请人
  creationDate?: string; //申请时间
  taskActorId?: number[];
  organizationId?: number;
  tenantId?: number;
  approveFlag?: boolean;
}

// 操作通知/开始/暂停
export interface OperateNoticeEntity {
  id?: number;
  reason?: string;
  type?: string;
}

export interface StoreWithCountEntity {
  floors?: StoreWithCountFloors[];
  projectId?: number;
  projectName?: string;
}

export interface StoreWithCountFloors {
  devices?: DeviceRecordListItemConfig[];
  floorCode?: string;
  floorName?: string;
}

export interface Devices extends OptionsType{
  id: number; // 设备id
  deviceName?: string; // 设备名称
  pointBrandName?: string; //点位品牌
  storeId?: number; //门店id
  storeName?: string; //门店名称
  groupName?: string; // 分组名称
  resolution?: string; //分辨率
  brandFormat?: string; // 品牌液态
  floor?: string; // 楼层
  city?: string; // 城市
}

// 选择设备options
export interface OptionsType {
  label: string;
  value: string | number;
  children?: OptionsType[];
}
