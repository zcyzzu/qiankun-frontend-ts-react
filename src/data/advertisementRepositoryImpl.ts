/*
 * @Author: wuhao
 * @Date: 2021-12-09 11:37:30
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-14 14:21:14
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';

import AdvertisementRepository from '../domain/repositories/advertisementRepository';
import { CommonPagesGeneric } from '../common/config/commonConfig';

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
} from '../domain/entities/advertisementEntities';
import UserUseCase from '../domain/useCases/userUseCase';

@injectable()
export default class AdvertisementRepositoryImpl implements AdvertisementRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 检查是否可以发布广告
  async requestTenantStatus(): Promise<string | boolean> {
    console.log(this.userUseCase.userInfo, 'userInfo')
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/check-tenant-status`,
    );
    return data;
  }
  // 创建或者保存广告
  async requestCreateAdvertisement(params?: CreateParamsEntity[]): Promise<CreateParamsEntity> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/batchCreate`,
      params,
    );
    return data;
  }

  // 创建素材
  async requestCreateMaterial(params?: CreateMaterialEntity): Promise<number> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material`,
      params,
    );
    return data;
  }

  //  获取上屏发布-广告列表
  async requestPublishAdvertisementList(
    page: number,
    size: number,
    queryType: string,
    status?: string,
    approvalStatus?: string,
    storeIdList?: string,
    adName?: string,
    deviceName?: string,
  ): Promise<CommonPagesGeneric<AdvertisementListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement`,
      {
        params: {
          page,
          size,
          queryType,
          status,
          approvalStatus,
          storeIdList,
          adName,
          deviceName,
        },
      },
    );
    return data;
  }

  // 删除素材
  async requestDelMaterial(materialId?: number): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material/${materialId}`,
    );
    return data;
  }

  // 获取上屏发布-发布列表-广告详情
  async requestAdvertisementDetails(advertisementId: number): Promise<AdvertisementDetailsEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/${advertisementId}`,
    );
    return data;
  }

  // 获取上屏发布-发布列表-广告详情-设备列表
  async requestAdvertisementDetailsDeviceList(
    id: number,
    deviceType: string,
    page: number,
    size: number,
  ): Promise<AdvertisementDetailsDeviceListEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/page-ad-device-list`,
      {
        params: {
          id,
          deviceType,
          page,
          size,
        },
      },
    );
    return data;
  }

  // 删除上屏发布-广告列表单条数据
  async requestPublishDel(advertisementId?: number): Promise<void> {
    await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/${advertisementId}`,
    );
  }

  // 删除播放列表-广告列表单条数据
  async requestPlayDel(adId?: number): Promise<void> {
    await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/deleteAdByStatus`,
      {
        params: {
          adId,
        },
      },
    );
  }

  // 选择设备-全部设备
  async requestSelectAllByTenantId(deviceType?: string): Promise<AdvertisementDeviceListEntity[]> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/select-all-by-type/${deviceType}`,
    );
    return data;
  }

  // 获取广告详情
  async requestAdvertisementDetail(advertisementId?: number): Promise<AdvertisementDetailEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/${advertisementId}`,
    );
    return data;
  }

  // 编辑中的选择设备列表
  async requestEditDeviceList(
    deviceType?: string,
    id?: number,
  ): Promise<AdvertisementDeviceListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/select-ad-device-list`,
      {
        params: {
          deviceType,
          id,
          deviceStatus: true,
          deviceUnitScope: true,
        },
      },
    );
    return data;
  }
  //  获取审批管理-广告列表
  async requestApprovelAdvertisementList(
    page: number,
    size: number,
    queryType: string,
    status?: string,
    name?: string,
    flag?: boolean,
  ): Promise<CommonPagesGeneric<AdvertisementApproveListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/approve/ad/page`,
      {
        params: {
          page,
          size,
          queryType,
          status,
          name,
          flag,
        },
      },
    );
    return data;
  }
  // 解绑设备
  async requestunBindAdDevice(advertisementId?: number, deviceIdList?: number[]): Promise<void> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/unbind-ad-device/${advertisementId}`,
      deviceIdList,
    );
    return data;
  }

  // 更新 发布或者保存广告
  async requestPutAdvertisement(params?: CreateParamsEntity): Promise<CreateParamsEntity> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement`,
      params,
    );
    return data;
  }
  // 历史素材列表
  async requestMaterialHistoryRecordList(
    page: number,
    size: number,
  ): Promise<CommonPagesGeneric<MaterialHistoryRecordEntity>> {
    const { data } = await axios.get(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material`, {
      params: {
        page,
        size,
      },
    });
    return data;
  }

  // 操作广告/开始/暂停/续播
  async requestOperateAdvertisement(params: OperateAdvertisementEntity): Promise<void> {
    await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/operate-ad`,
      params,
    );
  }

  // 操作日志
  async requestOperateLog(advertisementId: number): Promise<AdvertisementOperateLogEntity[]> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/select-operation-log/${advertisementId}`,
    );
    return data;
  }

  //  选择具体设备 - 项目门店
  async requestSpecificDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/search-by/store-with-device-count`,
      {
        params: {
          deviceTypeEnum,
        },
      },
    );
    return data;
  }

  //  选择具体设备 - 项目门店- 收银机
  async requestGcashierDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/search-by/cashier-device-with-device-count`,
      {
        params: {
          deviceTypeEnum,
        },
      },
    );
    return data;
  }

  //  选择具体设备 -分组
  async requestSpecificGroupDevices(deviceTypeEnum: string): Promise<SpecificDevicesEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/search-by/group-with-device-count`,
      {
        params: {
          deviceTypeEnum,
        },
      },
    );
    return data;
  }

  // 广告播放计划
  async requestAdvertisementPlayPlan(
    queryType: string,
    deviceId: number,
    page: number,
    size: number,
    status?: string,
    adName?: string,
  ): Promise<CommonPagesGeneric<AdvertisementPlayPlanEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement`,
      {
        params: {
          queryType,
          deviceId,
          page,
          size,
          status,
          adName,
        },
      },
    );
    return data;
  }
  // 本周数据统计
  async requestWeekStatistics(
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<WeekStatisticsEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/week`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 当天播放次数统计
  async requestStatisticsPlayDay(
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<StatisticsPlayDayEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/play/day`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 历史播放次数统计
  async requestStatisticsPlayHistory(
    unitId: number | undefined,
    storeId: number | undefined,
    startDate?: string,
    endDate?: string,
  ): Promise<StatisticsPlayDayEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/play/history`,
      {
        params: {
          unitId,
          storeId,
          startDate,
          endDate,
        },
      },
    );
    return data;
  }

  // 历史任务次数统计
  async requestStatisticsTaskHistory(
    unitId: number | undefined,
    storeId: number | undefined,
    startDate?: string,
    endDate?: string,
  ): Promise<StatisticsPlayDayEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/ad/task`,
      {
        params: {
          unitId,
          storeId,
          startDate,
          endDate,
        },
      },
    );
    return data;
  }

  // 详单导出 广告
  async requestAdvertismentExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    startDate: string,
    endDate: string,
    adIds?: string,
    ids?: string,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/export/by/ad`,
      {
        params: {
          fillerType,
          exportType,
          unitId,
          storeId,
          startDate,
          endDate,
          adIds,
          ids,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 详单导出 设备
  async requestDeviceExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    startDate: string,
    endDate: string,
    deviceIds?: string,
    ids?: string,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/export/by/device`,
      {
        params: {
          fillerType,
          exportType,
          unitId,
          storeId,
          startDate,
          endDate,
          deviceIds,
          ids,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 今日播放导出
  async requestDayPlayExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/export/by/play/day`,
      {
        params: {
          fillerType,
          exportType,
          unitId,
          storeId,
          ids,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 历史播放导出
  async requestHistoryPlayExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/export/by/play/history`,
      {
        params: {
          fillerType,
          exportType,
          unitId,
          storeId,
          ids,
          startDate,
          endDate,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 历史任务导出
  async requestHistoryTaskExport(
    fillerType: string,
    exportType: string,
    unitId: number | undefined,
    storeId: number | undefined,
    ids?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/statistics/export/by/task`,
      {
        params: {
          fillerType,
          exportType,
          unitId,
          storeId,
          ids,
          startDate,
          endDate,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 具体广告
  async requestSpecificAd(
    startDate: string,
    endDate: string,
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<AdvertisementPlayListItemConfig[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/play/cycle/list`,
      {
        params: {
          startDate,
          endDate,
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 具体广告
  async requestSpecificDevice(
    startDate: string,
    endDate: string,
    unitId: number | undefined,
    storeId: number | undefined,
  ): Promise<SpecificDevicesEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/ad/play/cycle/device/list`,
      {
        params: {
          startDate,
          endDate,
          unitId,
          storeId,
        },
      },
    );
    return data;
  }
}
