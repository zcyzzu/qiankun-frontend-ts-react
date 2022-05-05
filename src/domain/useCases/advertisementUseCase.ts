/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 13:58:53
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-08 17:17:45
 */

import { injectable, inject } from 'inversify';
import { ADVERTISEMENT_IDENTIFIER } from '../../constants/identifiers';
import AdvertisementRepository from '../repositories/advertisementRepository';
import { CommonPagesGeneric } from '../../common/config/commonConfig';
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

@injectable()
export default class AdvertiseUseCase {
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_REPOSITORY)
  private advertisementRepository!: AdvertisementRepository;

  public checkStaus: string | boolean;
  public constructor() {
    this.checkStaus = '';
  }

  //检查设备是否有播放中的广告
  public getTenantStatus(): Promise<string | boolean> {
    return this.advertisementRepository.requestTenantStatus();
  }

  // 创建或者保存广告
  public setCreateAdvertisement(param: CreateParamsEntity[]): Promise<CreateParamsEntity> {
    return this.advertisementRepository.requestCreateAdvertisement(param);
  }

  // 创建素材
  public setCreateMaterial(param: CreateMaterialEntity): Promise<number> {
    return this.advertisementRepository.requestCreateMaterial(param);
  }

  // 获取上屏发布-广告列表
  public async getPublishAdvertisementList(
    page: number,
    size: number,
    queryType: string,
    status?: string,
    approvalStatus?: string,
    storeIdList?: string,
    adName?: string,
    deviceName?: string,
  ): Promise<CommonPagesGeneric<AdvertisementListItemConfig>> {
    return this.advertisementRepository.requestPublishAdvertisementList(
      page,
      size,
      queryType,
      status,
      approvalStatus,
      storeIdList,
      adName,
      deviceName,
    );
  }

  // 获取上屏发布-发布列表-广告详情
  public async getAdvertisementDetails(
    advertisementId: number,
  ): Promise<AdvertisementDetailsEntity> {
    return this.advertisementRepository.requestAdvertisementDetails(advertisementId);
  }

  // 获取上屏发布-发布列表-广告详情-设备列表
  public async getAdvertisementDetailsDeviceList(
    id: number,
    deviceType: string,
    page: number,
    size: number,
  ): Promise<AdvertisementDetailsDeviceListEntity> {
    return this.advertisementRepository.requestAdvertisementDetailsDeviceList(
      id,
      deviceType,
      page,
      size,
    );
  }

  // 删除上屏发布-广告列表单条数据
  public async deletePublishItem(advertisementId?: number): Promise<void> {
    return this.advertisementRepository.requestPublishDel(advertisementId);
  }

  // 删除播放列表-广告列表单条数据
  public async deletePlayItem(advertisementId?: number): Promise<void> {
    return this.advertisementRepository.requestPlayDel(advertisementId);
  }

  //删除素材
  public async delMaterial(materialId?: number): Promise<void> {
    await this.advertisementRepository.requestDelMaterial(materialId).catch((err) => {
      console.log(err);
    });
  }

  // 选择设备-全部设备
  public setSelectAllByTenantId(deviceType?: string): Promise<AdvertisementDeviceListEntity[]> {
    return this.advertisementRepository.requestSelectAllByTenantId(deviceType);
  }

  // 广告详情
  public getAdvertisementDetail(advertisementId?: number): Promise<AdvertisementDetailEntity> {
    return this.advertisementRepository.requestAdvertisementDetail(advertisementId);
  }

  // 编辑中的选择设备列表
  public getEditDeviceList(
    deviceType?: string,
    id?: number,
  ): Promise<AdvertisementDeviceListEntity[]> {
    return this.advertisementRepository.requestEditDeviceList(deviceType, id);
  }

  // 解绑设备
  public requestunBindAdDevice(advertisementId?: number, deviceIdList?: number[]): Promise<void> {
    return this.advertisementRepository.requestunBindAdDevice(advertisementId, deviceIdList);
  }

  // 选择具体设备-项目门店
  public getSpecificDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]> {
    return this.advertisementRepository.requestSpecificDevices(deviceTypeEnum);
  }
  // 选择具体设备-项目门店-收银机
  public getGcashierDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]> {
    return this.advertisementRepository.requestGcashierDevices(deviceTypeEnum);
  }

  // 选择具体设备-分组
  public getSpecificGroupDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]> {
    return this.advertisementRepository.requestSpecificGroupDevices(deviceTypeEnum);
  }

  // 更新 发布或者保存广告
  public setPutAdvertisement(param: CreateParamsEntity): Promise<CreateParamsEntity> {
    return this.advertisementRepository.requestPutAdvertisement(param);
  }
  // 获取审批管理-广告列表
  public async getApprovelAdvertisementList(
    page: number,
    size: number,
    queryType: string,
    status?: string,
    name?: string,
    flag?: boolean,
  ): Promise<CommonPagesGeneric<AdvertisementApproveListItemConfig>> {
    return this.advertisementRepository.requestApprovelAdvertisementList(
      page,
      size,
      queryType,
      status,
      name,
      flag,
    );
  }
  // 历史素材列表
  public getMaterialHistoryRecord(
    page: number,
    size: number,
  ): Promise<CommonPagesGeneric<MaterialHistoryRecordEntity>> {
    return this.advertisementRepository.requestMaterialHistoryRecordList(page, size);
  }

  // 操作广告/开始/暂停/续播
  public getOperateAdvertisement(params: OperateAdvertisementEntity): Promise<void> {
    return this.advertisementRepository.requestOperateAdvertisement(params);
  }

  // 操作日志
  public getOperateLog(advertisementId: number): Promise<AdvertisementOperateLogEntity[]> {
    return this.advertisementRepository.requestOperateLog(advertisementId);
  }

  // 广告播放计划
  public getAdvertisementPlayPlan(
    queryType: string,
    deviceId: number,
    page: number,
    size: number,
    status?: string,
    adName?: string,
  ): Promise<CommonPagesGeneric<AdvertisementPlayPlanEntity>> {
    return this.advertisementRepository.requestAdvertisementPlayPlan(
      queryType,
      deviceId,
      page,
      size,
      status,
      adName,
    );
  }
  // 本周统计
  public async getWeekStatistics(
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<WeekStatisticsEntity> {
    return this.advertisementRepository.requestWeekStatistics(unitId, storeId);
  }

  // 当天播放次数
  public async getStatisticsPlayDay(
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<StatisticsPlayDayEntity[]> {
    return this.advertisementRepository.requestStatisticsPlayDay(unitId, storeId);
  }

  // 历史播放次数
  public async getStatisticsPlayHistory(
    unitId: number | undefined,
    storeId: number | undefined,
    startDate?: string,
    endDate?: string,
  ): Promise<StatisticsPlayDayEntity[]> {
    return this.advertisementRepository.requestStatisticsPlayHistory(
      unitId,
      storeId,
      startDate,
      endDate,
    );
  }
  // 历史任务次数
  public async getStatisticsTaskHistory(
    unitId: number | undefined,
    storeId: number | undefined,
    startDate?: string,
    endDate?: string,
  ): Promise<StatisticsPlayDayEntity[]> {
    return this.advertisementRepository.requestStatisticsTaskHistory(
      unitId,
      storeId,
      startDate,
      endDate,
    );
  }

  // 具体广告
  public async getSpecificAd(
    startDate: string,
    endDate: string,
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<AdvertisementPlayListItemConfig[]> {
    return this.advertisementRepository.requestSpecificAd(startDate, endDate, unitId, storeId);
  }
  // 具体设备
  public async getSpecificDevice(
    startDate: string,
    endDate: string,
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<SpecificDevicesEntity[]> {
    return this.advertisementRepository.requestSpecificDevice(startDate, endDate, unitId, storeId);
  }
  // 详单导出 广告
  public advertismentExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    startDate: string,
    endDate: string,
    adIds?: string,
    ids?: string,
  ): Promise<File> {
    return this.advertisementRepository.requestAdvertismentExport(
      fillerType,
      exportType,
      unitId,
      storeId,
      startDate,
      endDate,
      adIds,
      ids,
    );
  }

  // 详单导出 设备
  public deviceExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    startDate: string,
    endDate: string,
    deviceId?: string,
    ids?: string,
  ): Promise<File> {
    return this.advertisementRepository.requestDeviceExport(
      fillerType,
      exportType,
      unitId,
      storeId,
      startDate,
      endDate,
      deviceId,
      ids,
    );
  }

  // 今日播放导出
  public dayPlayExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
  ): Promise<File> {
    return this.advertisementRepository.requestDayPlayExport(
      fillerType,
      exportType,
      unitId,
      storeId,
      ids,
    );
  }

  // 历史播放导出
  public historyPlayExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<File> {
    return this.advertisementRepository.requestHistoryPlayExport(
      fillerType,
      exportType,
      unitId,
      storeId,
      ids,
      startDate,
      endDate,
    );
  }

  // 历史任务导出
  public historyTaskExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<File> {
    return this.advertisementRepository.requestHistoryTaskExport(
      fillerType,
      exportType,
      unitId,
      storeId,
      ids,
      startDate,
      endDate,
    );
  }
}
