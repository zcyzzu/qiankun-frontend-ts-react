/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:26:33
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-11 15:06:57
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';
import DeviceRepository from '../domain/repositories/deviceRepository';
import { CommonPagesGeneric } from '../common/config/commonConfig';
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
} from '../domain/entities/deviceEntities';
import {
  DeviceListParamsConfig,
  DeviceListParams,
} from '../presenters/device/advertisementMachine/viewModel';
import UserUseCase from '../domain/useCases/userUseCase';

@injectable()
export default class DeviceRepositoryImpl implements DeviceRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  async requestDeviceList(
    getDeviceListParams: DeviceListParamsConfig,
  ): Promise<CommonPagesGeneric<DeviceRecordListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device`,
      {
        params: {
          ...getDeviceListParams,
        },
      },
    );
    return data;
  }
  async requestDel(id?: number): Promise<void> {
    await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/${id}`,
    );
  }

  // 分组配置分组列表
  async requestGroupList(unitIds?: number): Promise<GroupListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/group`,
      {
        params: {
          unitId: unitIds,
        },
      },
    );
    return data;
  }

  // 设备导出
  async requestExport(val: DeviceListParams, ids: string, deviceIdList?: string): Promise<File> {
    const params = val;
    Object.assign(params, { ids, deviceIdList, fillerType: 'single-sheet', exportType: 'DATA' });
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/export-device`,
      {
        params,
        responseType: 'blob',
      },
    );
    return data;
  }

  // 删除定时设置
  async requestDelTimingSwitch(deviceIdList: number[]): Promise<void> {
    await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/delete-timing-switch`,
      {
        data: deviceIdList,
      },
    );
  }

  // 定时设置
  async requestTimingSwitch(id: number[], bootTime?: string, shutdownTime?: string): Promise<void> {
    await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/timer-switch`,
      {
        bootTime,
        id,
        shutdownTime,
      },
    );
  }

  // 分组配置新增
  async requestCreateGroup(groupName?: string): Promise<GroupListEntity> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/group`,
      {
        groupName,
      },
    );
    return data;
  }

  // 分组配置删除
  async requestDelGroup(id?: number): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/group/${id}`,
    );
    return data;
  }

  // 查询设备类型及数量
  async requestTypeNumber(unitId?: number, storeId?: number): Promise<DeviceTypeNumberEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/count-type-and-number`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 分组配置设备列表
  async requestDeviceGroupList(
    page?: number,
    size?: number,
    unitId?: number | undefined,
    type?: string,
  ): Promise<CommonPagesGeneric<DeviceListEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/page`,
      {
        params: {
          unitId,
          type,
          page,
          size,
        },
      },
    );
    return data;
  }

  // 分组配置设备列表
  async requestDeviceListPage(
    groupIds?: string,
    type?: string,
    deviceType?: string,
  ): Promise<DeviceListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/group/page`,
      {
        params: {
          groupIds,
          type,
          deviceType,
        },
      },
    );
    return data;
  }
  // 分组配置设备绑定
  async requestDeviceBind(deviceIds?: number[], groupIds?: number[], type?: string): Promise<void> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/group/bind`,
      {
        deviceIds,
        groupIds,
        type,
      },
    );
    return data;
  }

  // 设备截图-设备截图
  async requestScreenShot(deviceId: number | undefined): Promise<void> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/screen-shot/${deviceId}`,
    );
    return data;
  }

  // 设备截图-截屏记录
  async requestScreenList(
    page?: number,
    size?: number,
    deviceId?: number,
  ): Promise<CommonPagesGeneric<ScreenListEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/screenshot/${deviceId}/list`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return data;
  }

  // 设备巡查
  async requestPatrol(deviceId?: number): Promise<PatrolEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/broken-network-number`,
      {
        params: {
          deviceId,
        },
      },
    );
    return data;
  }

  async requestDelBatch(deviceIdList: string[]): Promise<void> {
    await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/batch-delete`,
      {
        data: deviceIdList,
      },
    );
  }

  async requestShutDown(deviceIdList: string[]): Promise<void> {
    await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/shutdown`,
      deviceIdList,
    );
  }

  async requestBootUp(deviceIdList: string[]): Promise<void> {
    await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/bootup`,
      deviceIdList,
    );
  }

  async requestReboot(deviceIdList: string[]): Promise<void> {
    await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/reboot`,
      deviceIdList,
    );
  }

  async requestCheckAdPlaying(deviceIdList: string[]): Promise<string> {
    try {
      await axios.post(
        `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/advertisement/check-ad-playing`,
        deviceIdList,
      );
      return '删除设备将失效并无法恢复，确认删除？';
    } catch (error) {
      return error.message;
    }
  }

  // 修改设备信息
  async requsetEdit(query: DeviceRecordListItemConfig): Promise<DeviceRecordListItemConfig> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device`,
      query,
    );
    return data;
  }

  // 批量修改设备信息、批量启用/禁用
  async requsetBatchEdit(
    deviceIdList: string[],
    groupIdList?: string[],
    projectStoreId?: string,
    deviceStatus?: boolean,
  ): Promise<void> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/batch-update`,
      {
        deviceIdList,
        deviceStatus,
        groupIdList,
        projectStoreId,
      },
    );
    return data;
  }

  // 根据设备id列表， 查询设备所属组织的所有门店
  async requestSelectStoreListByDeviceOrgId(
    deviceIdList: number[],
  ): Promise<StoreListItemConfig[]> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store/selectStoreListByDeviceOrgId`,
      deviceIdList,
    );
    return data;
  }

  // 获取设备详情
  async requestDeviceDetails(deviceId?: number): Promise<DeviceRecordListItemConfig> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/${deviceId}`,
    );
    return data;
  }
  // 获取项目门店列表
  async requestStoreList(
    page: number,
    size: number,
    name?: string,
    type?: string,
    city?: string,
    categoryCode?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<CommonPagesGeneric<StoreListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store/page`,
      {
        params: {
          page,
          size,
          name,
          type,
          city,
          categoryCode,
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 新增设备
  async requestCreate(query: DeviceRecordListItemConfig): Promise<DeviceRecordListItemConfig> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device`,
      query,
    );
    return data;
  }
  // 删除项目门店单条数据
  async requestStoreDel(id?: number): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store/${id}`,
    );
    return data;
  }

  // 是否关联设备
  async requestIsRelate(storeId?: number): Promise<void> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store/check-device-by-store`,
      {
        params: {
          storeId,
        },
      },
    );
    return data;
  }

  // 当前在线/离线设备及在线率统计
  async requestDeviceOnlineStatus(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/total`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 获取当前设备类型分布
  async requestDeviceDistributionData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/type`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 获取当前设备广告播放利用率
  async requestDevicePlayRateData(
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/advertising`,
      {
        params: {
          deviceType,
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 获取设备楼层分布数据
  async requestDeviceFloorDistributionData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceFloorDistributionEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/floor`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 获取今日设备在线情况
  async requestDeviceTodayOnlineData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceOnlineStatusEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/hour`,
      {
        params: {
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 获取历史设备在线率
  async requestDeviceHistoryOnlineRate(
    dayType?: number,
    beginDate?: string,
    endDate?: string,
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceHistoryOnlineRateEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/day`,
      {
        params: {
          dayType,
          beginDate,
          endDate,
          deviceType,
          unitId,
          storeId,
        },
      },
    );
    return data;
  }

  // 设备离线导出
  async deviceOfflineExport(
    hours?: number,
    beginDate?: string,
    endDate?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/off-line-export`,
      {
        params: {
          ids: '2,3,4,5,6,7,8',
          fillerType: 'single-sheet',
          exportType: 'DATA',
          hours,
          beginDate,
          endDate,
          unitId,
          storeId,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 设备在线导出
  async deviceOnlineExport(
    dayType?: number,
    beginDate?: string,
    endDate?: string,
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<File> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/statistics/online-export`,
      {
        params: {
          dayType,
          beginDate,
          endDate,
          deviceType,
          unitId,
          storeId,
        },
        responseType: 'blob',
      },
    );
    return data;
  }

  // 新增项目门店
  async addStore(params: StoreListItemConfig): Promise<StoreListItemConfig> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store`,
      params,
    );
    return data;
  }

  // 编辑项目门店
  async editStore(query: StoreListItemConfig): Promise<StoreListItemConfig> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store`,
      query,
    );
    return data;
  }

  // 获取设备详情
  async requestStoreDetails(storeId?: number): Promise<StoreListItemConfig> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store/${storeId}`,
    );
    return data;
  }

  // 通知播放计划
  async requestNoticePlayPlan(
    deviceId: number,
    page: number,
    size: number,
    status?: string,
    content?: string,
  ): Promise<CommonPagesGeneric<NoticePlayPlanEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/playlist/notice`,
      {
        params: {
          deviceId,
          page,
          size,
          status,
          content,
        },
      },
    );
    return data;
  }

  // 日志列表
  async requestLogList(
    deviceId: number,
    page?: number,
    size?: number,
  ): Promise<CommonPagesGeneric<DownLogListEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/log/list`,
      {
        params: {
          deviceId,
          page,
          size,
        },
      },
    );
    return data;
  }

  // 设备下发日志上传命令
  async requestUploadLog(deviceId: number): Promise<void> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/issue/log/upload`,
      {
        params: {
          deviceId,
        },
      },
    );
    return data;
  }
}
