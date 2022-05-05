/*
 * @Author: mayajing
 * @Date: 2021-11-29 11:53:14
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-22 16:14:43
 */
import { CommonResponseDTO, CommonPagesGeneric } from '../../common/config/commonConfig';
// 上屏广告-广告列表
export interface MaterialListItem {
  id?: number;
  name?: string;
  type?: string;
  duration?: string;
  fileKey?: string;
}

export interface DeviceListItem {
  id?: number;
  deviceName?: string;
}
interface TimeListItem {
  id?: number;
  cycleStartTime?: string;
  cycleEndTime?: string;
}

// 上屏广告-发布列表-广告详情
export interface AdvertisementDetailsEntity {
  adId?: number;
  adName?: string;
  expose?: number;
  cycleType?: string;
  startDate?: string;
  endDate?: string;
  cycleWeekDay?: string;
  levelType?: string;
  partOrAll?: number;
  materialList?: MaterialListEntity[];
  timeList?: TimeListEntity[];
}

export interface MaterialListEntity {
  id?: number;
  name?: string;
  type?: string;
  resolution?: string;
  duration?: number;
  fileKey?: string;
}

export interface TimeListEntity {
  id?: number;
  cycleStartTime?: string;
  cycleEndTime?: string;
}

export interface AdvertisementListItemConfig extends CommonResponseDTO {
  id?: number;
  adId?: number;
  adName?: string;
  name?: string; //广告名称
  material?: string; //广告素材
  screen?: string; //霸屏情况
  publishDevice?: string; //发布设备
  total?: number; //设备总数
  cycle?: string; //广告周期
  status?: string; //发布状态
  approvalStatus?: string; //审批状态
  publishDate?: string; //最新发布时间
  materialList?: MaterialListItem[]; //素材列表
  deviceList?: DeviceListItem[]; //设备列表
  startDate?: string; //开始日期
  endDate?: string; //结束日期
  timeList?: TimeListItem[]; //周期时间
  cycleType?: string; //周期时间
  cycleWeekDay?: string; // 每周周几播放广告
}

// 播放-广告列表
export interface AdvertisementPlayListItemConfig extends CommonResponseDTO {
  id?: number;
  adId?: number;
  adName?: string; //广告名称
  material?: string; //广告素材
  screen?: string; //霸屏情况
  publishDevice?: string; //发布设备
  total?: number; //设备总数
  cycle?: string; //广告周期
  status?: string; //发布状态
  publishDate?: string; //最新发布时间
  materialList?: MaterialListItem[]; //素材列表
  deviceList?: DeviceListItem[]; //设备列表
  startDate?: string; //开始日期
  endDate?: string; //结束日期
  timeList?: TimeListItem[]; //周期时间
  cycleType?: string; //周期时间
  cycleWeekDay?: string; // 每周周几播放广告
  expose?: string; // 曝光量
}

// 审批-广告列表
export interface ApprovelDeviceListItem {
  id?: number;
  name?: string;
}
export interface AdvertisementApproveListItemConfig extends CommonResponseDTO {
  id?: number;
  adName?: string; //广告名称
  materialList?: MaterialListItem[]; //广告素材
  screen?: string; //霸屏情况
  devices?: ApprovelDeviceListItem[]; //发布设备
  total?: number; //设备总数
  status?: string; //播放状态
  approveStatus?: string; //发布状态
  publishDate?: string; //申请时间
  cycle?: string; //广告周期
  stores?: string;
  startDateString?: string; //开始日期
  endDateString?: string; //结束日期
  timeList?: TimeListItem[]; //周期时间
  cycleType?: string; //周期时间
  cycleWeekDay?: string; // 每周周几播放广告
  taskActorId?: number[];
  approveFlag?: boolean; //审批标识
}

// 创建广告
export interface CreateParamsEntity {
  id?: number; //广告id
  adName?: string; // 广告名称
  cycleEndDate?: string; // 广告周期结束时间
  cycleStartDate?: string; // 广告周期开始时间
  cycleType?: string; // 广告周期类型
  cycleWeekDay?: string; // 每周周几播放广告
  deviceIdList?: number[]; // 设备id列表,
  levelType?: string; // 广告等级类型
  materialList?: MaterialIdData[]; // 广告关联素材列表
  playTimeList?: PlayTimeList[]; // 播放时间段
  publishOrSave?: number; // 保存/发布
  unitId?: number; //组织id
  partOrAll?: number;
  objectVersionNumber?: number;
}

// 提交的素材合集
export interface MaterialIdData {
  id: number | undefined;
  duration: number | undefined;
  deviceResolution?: string | undefined;
}

export interface PlayTimeList {
  cycleEndTime: string; // 广告播放结束时间
  cycleStartTime: string; // 广告播放开始时间
}

// 创建素材
export interface CreateMaterialEntity {
  description?: string; // 描述
  duration?: number; // 素材时长
  fileHash?: string; // 文件hash值
  fileKey?: string; // 素材文件key
  name?: string; // 素材名称
  organization?: string; // 组织名称,
  unitId?: number; // 组织id
  resolution?: string; // 分辨率
  size?: string; // 素材大小，单位byte
  tenantId?: number; //租户id
  type?: string; // 素材类型
}

// 选择设备
export interface AdvertisementDeviceListEntity {
  city?: string; // 城市
  deviceName?: string; // 设备名称
  floor: string; // 楼层
  fileKey?: string; // 素材文件key
  groupName?: string; // 分组名称
  groupId?: number;
  id: number; // 设备id,
  pointBrandName?: string; // 点位品牌名称
  resolution: string; // 分辨率
  storeName?: string; // 门店名称
  brandFormat?: string; // 品牌液态
  storeId: number;// 门店id
}

// 广告详情
export interface AdvertisementDetailEntity {
  adId?: number; // 主键id
  adName?: string; // 广告名称
  endDate?: string; // 广告周期结束时间
  startDate?: string; // 广告周期开始时间
  cycleType?: string; // 广告周期类型
  cycleWeekDay?: string; // 每周周几播放广告
  levelType?: string; // 广告等级类型
  materialList?: MaterialList[]; // 广告关联素材列表
  timeList: PlayTimeList[]; // 播放时间段
  partOrAll?: number; // 部分设备全部设备
  expose?: number; // 曝光量
  objectVersionNumber?: number;
}

export interface MaterialList {
  duration?: number; //素材时长 ,
  fileKey?: string; //素材key ,
  id?: number; //素材id ,
  name?: string; //素材名称 ,
  resolution?: string; //素材分辨率 ,
  type?: string; //素材类型
}

// 广告详情-设备列表
export interface AdvertisementDetailsDeviceListEntity {
  storeNumber?: number;
  deviceNumber?: number;
  page?: CommonPagesGeneric<AdvertisementDetailsDeviceItemEntity>;
}

// 广告详情-设备列表-单项数据
export interface AdvertisementDetailsDeviceItemEntity {
  id: number;
  deviceName?: string; // 设备名称
  pointBrandName?: string; // 点位品牌名称
  storeName?: string; // 门店名称
  groupName?: string; // 分组名称
  resolution: string; // 分辨率
  brandFormat?: string; // 品牌液态
  floor?: string; // 楼层
  city?: string; // 城市
}

// 素材历史上传记录
export interface MaterialHistoryRecordEntity extends CommonResponseDTO {
  id?: number;
  tenantId?: number; //租户id
  unitId?: number;
  unitName?: string;
  unitPath?: string; //
  name?: string; //素材名称
  type?: string; //素材类型
  size?: string; //素材大小，单位byte
  fileHash?: string; //文件hash值
  duration?: number; //素材时长
  fileKey?: string; //素材文件key
  resolution?: string; //分辨率
  description?: string; //描述
}

// 操作广告/开始/暂停/续播
export interface OperateAdvertisementEntity {
  adId?: number;
  cycleEndDate?: string;
  operationType?: string;
  reason?: string;
  tenantId?: number;
}

// 广告操作日志
export interface AdvertisementOperateLogEntity extends CommonResponseDTO {
  type?: string;
  reason?: string;
  cycleEndDate?: string;
  creationDate?: string;
  list?: ListEntity[];
}

export interface ListEntity {
  organizationName?: string;
  username?: string;
}

// 选择具体设备
export interface SpecificDevicesEntity {
  projectId: number;
  projectIdName?: string; // 商场名称
  floors?: Floors[]; // 楼层
}

export interface Floors {
  floorCode: string;
  floorName?: string; // 商场名称
  devices?: Devices[]; // 楼层
}

export interface Devices extends OptionsType {
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
  groupId?: number;
}

export interface OptionsType {
  label?: string;
  value?: string | number;
  children?: OptionsType[];
}

// 播放计划
export interface AdvertisementPlayPlanEntity {
  adId?: number;
  adName?: string;
  expose?: number;
  levelType?: string;
  materialList?: MaterialListEntity[];
  timeList?: TimeListEntity[];
  deviceList?: Devices[];
  publishDate?: string;
  cycleType?: string;
  cycleWeekDay?: string;
  startDate?: string;
  endDate?: string;
  approvalStatus?: string;
  status?: string;
  material?: string;
}

// 本周统计
export interface WeekStatisticsEntity {
  thisWeekAdPlayNum?: number;
  thisWeekAdNum?: number;
  thisWeekNoticeNum?: number;
  lastWeekAdPlayNum?: number;
}

// 当日播放次数
export interface StatisticsPlayDayEntity {
  key?: string;
  value?: number;
  name?: string;
  pictureNum?: number;
  sum?: number;
  videoNum?: number;
  date?: string;
}
