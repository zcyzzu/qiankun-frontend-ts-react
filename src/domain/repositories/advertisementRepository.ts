/*
 * @Author: wuhao
 * @Date: 2021-12-09 11:35:19
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-08 17:17:42
 */

import {
  CreateParamsEntity,
  CreateMaterialEntity,
  AdvertisementListItemConfig,
  AdvertisementDeviceListEntity,
  AdvertisementDetailEntity,
  AdvertisementApproveListItemConfig,
  AdvertisementDetailsEntity,
  AdvertisementDetailsDeviceListEntity,
  MaterialHistoryRecordEntity,
  OperateAdvertisementEntity,
  AdvertisementOperateLogEntity,
  SpecificDevicesEntity,
  AdvertisementPlayPlanEntity,
  WeekStatisticsEntity,
  StatisticsPlayDayEntity,
  AdvertisementPlayListItemConfig,
} from '../entities/advertisementEntities';
import { CommonPagesGeneric } from '../../common/config/commonConfig';

export default interface AdvertisementRepository {
  // 检查是否可以发布广告
  requestTenantStatus(): Promise<string | boolean>;

  // 创建或者保存广告
  requestCreateAdvertisement(params?: CreateParamsEntity[]): Promise<CreateParamsEntity>;
  // 创建素材
  requestCreateMaterial(params?: CreateMaterialEntity): Promise<number>;

  // 获取上屏发布-广告列表
  requestPublishAdvertisementList(
    page: number,
    size: number,
    queryType: string,
    status?: string,
    approvalStatus?: string,
    storeIdList?: string,
    adName?: string,
    deviceName?: string,
  ): Promise<CommonPagesGeneric<AdvertisementListItemConfig>>;

  // 获取上屏发布-发布列表-广告详情
  requestAdvertisementDetails(advertisementId: number): Promise<AdvertisementDetailsEntity>;

  // 获取上屏发布-发布列表-广告详情-设备列表
  requestAdvertisementDetailsDeviceList(
    id: number,
    deviceType: string,
    page: number,
    size: number,
  ): Promise<AdvertisementDetailsDeviceListEntity>;

  // 删除上屏发布-广告单个设备
  requestPublishDel(advertisementId?: number): Promise<void>;

  // 删除播放列表-广告单个设备
  requestPlayDel(advertisementId?: number): Promise<void>;

  //  删除素材
  requestDelMaterial(materialId?: number): Promise<void>;
  // 选择设备-全部设备
  requestSelectAllByTenantId(deviceType?: string): Promise<AdvertisementDeviceListEntity[]>;

  // 广告详情
  requestAdvertisementDetail(advertisementId?: number): Promise<AdvertisementDetailEntity>;

  // 编辑中的选择设备列表
  requestEditDeviceList(deviceType?: string, id?: number): Promise<AdvertisementDeviceListEntity[]>;

  // 解绑设备
  requestunBindAdDevice(advertisementId?: number, deviceIdList?: number[]): Promise<void>;

  // 更新 发布或者保存广告
  requestPutAdvertisement(params?: CreateParamsEntity): Promise<CreateParamsEntity>;

  // 选择具体设备-项目门店
  requestSpecificDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]>;
  // 选择具体设备-项目门店-收银机
  requestGcashierDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]>;

  // 选择具体设备-分组
  requestSpecificGroupDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]>;

  // 获取审批管理-广告列表
  requestApprovelAdvertisementList(
    page: number,
    size: number,
    queryType: string,
    status?: string,
    name?: string,
    flag?: boolean,
  ): Promise<CommonPagesGeneric<AdvertisementApproveListItemConfig>>;

  // 历史素材列表
  requestMaterialHistoryRecordList(
    page: number,
    size: number,
  ): Promise<CommonPagesGeneric<MaterialHistoryRecordEntity>>;

  // 操作广告/开始/暂停/续播
  requestOperateAdvertisement(params: OperateAdvertisementEntity): Promise<void>;

  // 操作日志
  requestOperateLog(advertisementId: number): Promise<AdvertisementOperateLogEntity[]>;

  // 广告播放计划
  requestAdvertisementPlayPlan(
    queryType: string,
    deviceId: number,
    page: number,
    size: number,
    status?: string,
    adName?: string,
  ): Promise<CommonPagesGeneric<AdvertisementPlayPlanEntity>>;
  // 本周统计
  requestWeekStatistics(
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<WeekStatisticsEntity>;
  // 当天播放次数
  requestStatisticsPlayDay(
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<StatisticsPlayDayEntity[]>;
  // 历史播放次数
  requestStatisticsPlayHistory(
    unitId: number | undefined,
    storeId: number | undefined,
    startDate?: string,
    endDate?: string,
  ): Promise<StatisticsPlayDayEntity[]>;
  // 历史任务次数
  requestStatisticsTaskHistory(
    unitId: number | undefined,
    storeId: number | undefined,
    startDate?: string,
    endDate?: string,
  ): Promise<StatisticsPlayDayEntity[]>;
  // 具体广告
  requestSpecificAd(
    startDate: string,
    endDate: string,
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<AdvertisementPlayListItemConfig[]>;
  //具体设备
  requestSpecificDevice(
    startDate: string,
    endDate: string,
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<SpecificDevicesEntity[]>;
  // 详单导出 广告
  requestAdvertismentExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    startDate: string,
    endDate: string,
    adIds?: string,
    ids?: string,
  ): Promise<File>;

  // 详单导出 广告
  requestDeviceExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    startDate: string,
    endDate: string,
    deviceId?: string,
    ids?: string,
  ): Promise<File>;

  // 今日播放导出
  requestDayPlayExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
  ): Promise<File>;

  // 历史播放导出
  requestHistoryPlayExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<File>;

  // 历史任务导出
  requestHistoryTaskExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<File>;
}
