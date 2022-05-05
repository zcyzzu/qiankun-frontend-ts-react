/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 14:36:43
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-16 09:33:44
 */
import { Moment } from 'moment';
import { CommonResponseDTO } from '../../common/config/commonConfig';

export interface DeviceRecordListItemConfig extends CommonResponseDTO {
  id?: number;
  storeName?: string; // 所属门店/项目
  floor?: string; // 楼层
  status?: string; // 状态
  ipAddress?: string; // id地址
  macAddress?: string; // mac地址
  type?: string; // 设备类型
  tenantId?: number; // 租户id
  supportedFeature?: boolean; // 是否支持特征广告
  subMask?: string; // 子网掩码
  resolution?: string; // 分辨率
  projectStoreId?: number; // 门店id
  pointBrandName?: string; // 点位品牌名称
  photo?: string; // 设备图片
  os?: string; // 操作系统
  organizationId?: number; // 组织id
  organization?: string; // 所属组织
  name?: string; // 设备名称
  groupNameList?: GroupNameListEntity[]; // 分组列表
  departmentId?: number; // 部门id
  brandFormat?: string; // 业态
  bootTime?: string; // 开机时间
  shutdownTime?: string; // 关机时间
  lastOnlineTime?: string; // 最后一次在线时间
  offOn?: string;
  deviceBrand?: string;
  unitId?: number;
  unitName?: string; // 组织名称
  managerDepartmentName?: string; // 分管部门名称
  managerDepartmentList?: ManagerDepartmentEntity[];
  managerDepartmentId?: number[];
  deviceUuid?: number;
  clientVersionNumber?: string;// 应用版本号
}

export interface ManagerDepartmentEntity {
  id?: number;
  managerDepartmentId?: number;
  managerDepartmentName?: string;
}

export interface GroupNameListEntity {
  id?: number;
  groupName?: string;
}

// 当前设备楼层分布Entity
export interface DeviceFloorDistributionEntity {
  floor?: string;
  deviceStatisticsList?: DeviceStatisticsListEntity[];
}

export interface DeviceStatisticsListEntity {
  code?: string;
  value?: number;
}

// 设备类型及数量
export interface DeviceTypeNumberEntity {
  ADMACHINE?: number;
  CASHIER?: number;
  LED?: number;
  RASPBERRYPI?: number;
}

// 今日设备在线情况
export interface DeviceOnlineStatusEntity {
  localTime?: string;
  parseLocalTime?: string;
  deviceStatisticsList?: DeviceStatisticsListEntity[];
}

// 历史设备在线率Entity
export interface DeviceHistoryOnlineRateEntity {
  localDate?: string;
  parseLocalDate?: string;
  deviceStatisticsList?: DeviceStatisticsListEntity[];
}

// 分组配置-分组列表
export interface GroupListEntity extends CommonResponseDTO {
  id: number; // 分组id
  groupName?: string; //分组名称
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
  tenantId?: number; //所属组织id
}

//分组配置-设备列表-带分页
export interface DeviceListEntity {
  id?: number; // 分组id
  tenantId?: number; //所属组织id
  storeName?: string; //项目门店
  storeId?: number; //门店id
  deviceName?: string; //设备名称
  deviceId?: number; //设备id
  floor?: string; //楼层
  pointBrandName?: string; //品牌液态
}

// 日志下载列表
export interface DownLogListEntity extends CommonResponseDTO {
  id?: number; // 分组id
  tenantId?: number; //所属组织id
  deviceId?: number; //设备id
  deviceUuid?: string;
  size?: number;
  fileHash?: string;
  fileKey?: string;
  expireDate?: string;
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
  fileName?: string;
}

//设备截屏-截图记录
export interface ScreenListEntity extends CommonResponseDTO {
  id?: number; // id
  tenantId?: number; //所属组织id
  deviceId?: number; //设备id
  url?: string; //url
  name?: string; //截屏文件名称
  fileKey: string;
}

//设备巡查 - 信息
export interface PatrolEntity {
  name?: string; // 设备名称
  os?: string; //应用版本号
  lastOnlineDate?: string; //最后在线时间
  status?: boolean; //启用
  online?: boolean; //在线
  deviceStatisticsList?: PatrolStatistEntity[]; //截屏文件名称
  pointBrandName?: string; // 点位品牌
  clientVersionNumber?: string;
}

//设备巡查 - 统计
export interface PatrolStatistEntity extends PatrolEntity {
  code?: string;
  value?: number;
}

// 项目门店列表
export interface StoreListItemConfig extends CommonResponseDTO {
  id?: number;
  name?: string; //项目/门店名称
  type?: string; //类型
  category?: string; //种类
  categoryCode?: string; //种类编码
  city?: string; //城市
  cityCode?: string; //城市编码
  status?: boolean; //状态
  address?: string; //地址/门牌号
  runningTime?: Moment[] | undefined; //运营时间
  beginBusinessHours?: string; //运营时间 - 开始
  endBusinessHours?: string; //运营时间 - 结束
  description?: string; //描述
  latitude?: string; //纬度
  longitude?: string; //经度
  county?: string; //区县
  countyCode?: string; //区县编码
  deleteDate?: string; //删除时间
  deleted?: boolean; //是否删除
  deletedBy?: string; //删除人
  organization?: string; //组织名称
  organizationId?: string; //组织id
  tenantId?: string; //租户id
  unitId?: string; //组织id
  unitName?: string; //组织id
}

// 设备通知播放计划
export interface NoticePlayPlanEntity extends CommonResponseDTO {
  id?: number;
  content?: string;
  creationDateDesc?: string;
  duration?: string;
  number?: number;
  deviceList?: DeviceListEntity[];
  statusCode?: string;
  approveStatus?: string;
  endTime?: string;
  endDate?: number;
  remainTime?: string; //剩余时间
}

// 选择设备
export interface AdvertisementDeviceListEntity {
  city?: string; // 城市
  deviceName?: string; // 设备名称
  floor?: string; // 楼层
  fileKey?: string; // 素材文件key
  groupName?: string; // 分组名称
  id: number; // 设备id,
  pointBrandName?: string; // 点位品牌名称
  resolution: string; // 分辨率
  storeName?: string; // 门店名称
  brandFormat?: string; // 品牌液态
  groupStr?: string;
  groupNames?: GroupNamesEntity[];
  deviceId?: number;
  storeId: number;// 门店id
  groupId?: number;
}

export interface GroupNamesEntity extends CommonResponseDTO {
  id?: number;
  tenantId?: number;
  groupName?: string;
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
}
