/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:23:23
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-07 17:19:41
 */

import { CommonPagesGeneric } from '../../common/config/commonConfig';
import {
  GroupListEntity,
  DeviceListEntity,
  ScreenListEntity,
  PatrolEntity,
  DeviceRecordListItemConfig,
  DeviceFloorDistributionEntity,
  DeviceStatisticsListEntity,
  DeviceHistoryOnlineRateEntity,
  StoreListItemConfig,
  DeviceOnlineStatusEntity,
  DeviceTypeNumberEntity,
  NoticePlayPlanEntity,
  DownLogListEntity,
} from '../entities/deviceEntities';
import {
  DeviceListParamsConfig,
  DeviceListParams,
} from '../../presenters/device/advertisementMachine/viewModel';

export default interface DeviceRepository {
  // 分组配置-分组列表
  requestGroupList(unitIds?: number): Promise<GroupListEntity[]>;
  // 分组配置-分组新增
  requestCreateGroup(groupName?: string): Promise<GroupListEntity>;
  //分组配置-删除标签
  requestDelGroup(id?: number): Promise<void>;
  // 分组配置-设备列表
  requestDeviceGroupList(
    page?: number,
    size?: number,
    unitId?: number | undefined,
    type?: string,
  ): Promise<CommonPagesGeneric<DeviceListEntity>>;
  // 分组配置-设备列表
  requestDeviceListPage(
    groupIds?: string,
    type?: string,
    deviceType?: string,
  ): Promise<DeviceListEntity[]>;
  // 分组配置-设备绑定
  requestDeviceBind(deviceIds?: number[], groupIds?: number[], type?: string): Promise<void>;
  // 设备截屏-设备截屏
  requestScreenShot(deviceId: number | undefined): Promise<void>;
  requestScreenShot(deviceId: number): Promise<void>;
  // 设备截屏-截屏记录
  requestScreenList(
    page?: number,
    size?: number,
    deviceId?: number,
  ): Promise<CommonPagesGeneric<ScreenListEntity>>;
  // 设备巡查
  requestPatrol(deviceId?: number): Promise<PatrolEntity>;

  // 设备导出
  requestExport(val: DeviceListParams, ids: string, deviceIdList?: string): Promise<File>;

  // 删除定时设置
  requestDelTimingSwitch(deviceIdList: number[]): Promise<void>;

  // 下发设置
  requestTimingSwitch(id: number[], bootTime?: string, shutdownTime?: string): Promise<void>;

  // 获取设备列表
  requestDeviceList(
    getDeviceListParams: DeviceListParamsConfig,
  ): Promise<CommonPagesGeneric<DeviceRecordListItemConfig>>;

  // 查询设备类型及数量
  requestTypeNumber(unitId?: number, storeId?: number): Promise<DeviceTypeNumberEntity>;

  // 删除单个设备
  requestDel(id?: number): Promise<void>;

  // 批量删除设备
  requestDelBatch(deviceIdList: string[]): Promise<void>;

  // 关机
  requestShutDown(deviceIdList: string[]): Promise<void>;

  // 开机
  requestBootUp(deviceIdList: string[]): Promise<void>;

  // 重启
  requestReboot(deviceIdList: string[]): Promise<void>;

  // 检查设备是否有播放中的广告
  requestCheckAdPlaying(deviceIdList: string[]): Promise<string>;

  // 修改设备信息
  requsetEdit(query: DeviceRecordListItemConfig): Promise<DeviceRecordListItemConfig>;

  // 批量修改设备信息、批量启用/禁用
  requsetBatchEdit(
    deviceIdList: string[],
    groupIdList?: string[],
    projectStoreId?: string,
    deviceStatus?: boolean,
  ): Promise<void>;

  // 根据设备id列表， 查询设备所属组织的所有门店
  requestSelectStoreListByDeviceOrgId(deviceIdList: number[]): Promise<StoreListItemConfig[]>;

  // 获取设备详情
  requestDeviceDetails(deviceId?: number): Promise<DeviceRecordListItemConfig>;

  // 新增设备
  requestCreate(query: DeviceRecordListItemConfig): Promise<DeviceRecordListItemConfig>;

  // 当前在线/离线设备及在线率统计
  requestDeviceOnlineStatus(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]>;

  // 获取当前设备类型分布
  requestDeviceDistributionData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]>;

  // 获取当前设备广告播放利用率
  requestDevicePlayRateData(
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]>;

  // 获取设备楼层分布数据
  requestDeviceFloorDistributionData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceFloorDistributionEntity[]>;

  // 获取今日设备在线情况
  requestDeviceTodayOnlineData(
    unitId: number | undefined,
    storeId?: number,
  ): Promise<DeviceOnlineStatusEntity[]>;

  // 获取历史设备在线率
  requestDeviceHistoryOnlineRate(
    dayType?: number,
    beginDate?: string,
    endDate?: string,
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceHistoryOnlineRateEntity[]>;

  // 设备离线导出
  deviceOfflineExport(
    hours?: number,
    beginDate?: string,
    endDate?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<File>;

  // 设备在线导出
  deviceOnlineExport(
    dayType?: number,
    beginDate?: string,
    endDate?: string,
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<File>;

  // 获取项目门店列表
  requestStoreList(
    page: number,
    size: number,
    name?: string,
    type?: string,
    city?: string,
    categoryCode?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<CommonPagesGeneric<StoreListItemConfig>>;

  // 删除单个项目门店数据
  requestStoreDel(id?: number): Promise<void>;

  // 是否关联设备
  requestIsRelate(id?: number): Promise<void>;

  // 新增项目门店
  addStore(createMemberParameter: StoreListItemConfig): Promise<StoreListItemConfig>;

  //编辑项目门店
  editStore(createMemberParameter: StoreListItemConfig): Promise<StoreListItemConfig>;

  // 获取项目门店详情
  requestStoreDetails(storeId?: number): Promise<StoreListItemConfig>;

  // 播放计划
  requestNoticePlayPlan(
    deviceId: number,
    page: number,
    size: number,
    status?: string,
    content?: string,
  ): Promise<CommonPagesGeneric<NoticePlayPlanEntity>>;

  // 日志列表
  requestLogList(
    deviceId: number,
    page?: number,
    size?: number,
  ): Promise<CommonPagesGeneric<DownLogListEntity>>;

  // 设备下发日志上传命令
  requestUploadLog(deviceId: number): Promise<void>;
}
