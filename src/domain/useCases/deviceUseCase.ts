/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:24:50
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-07 17:19:38
 */
import { injectable, inject } from 'inversify';
import { DEVICE_IDENTIFIER } from '../../constants/identifiers';
import DeviceRepository from '../repositories/deviceRepository';
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
import { CommonPagesGeneric } from '../../common/config/commonConfig';
import { OrganizationTreeListEntity } from '../../domain/entities/organizationEntities';

@injectable()
export default class DeviceUseCase {
  @inject(DEVICE_IDENTIFIER.DEVICE_REPOSITORY)
  private deviceRepository!: DeviceRepository;

  public groupListData: GroupListEntity[];
  public deviceListData: DeviceListEntity[];
  public deviceListGroupData: CommonPagesGeneric<DeviceListEntity>;
  public screenListData: CommonPagesGeneric<ScreenListEntity>;
  public storeListData: CommonPagesGeneric<StoreListItemConfig>;
  public organizationData: OrganizationTreeListEntity[];

  public constructor() {
    this.groupListData = [];
    this.deviceListData = [];
    this.deviceListGroupData = {
      content: [],
    };
    this.screenListData = {
      content: [],
    };
    this.storeListData = {
      content: [],
    };
    this.organizationData = [{ key: 'sd' }];
  }

  //删除标签
  public async delGroup(id?: number): Promise<void> {
    await this.deviceRepository.requestDelGroup(id).catch((err) => {
      console.log(err);
    });
  }

  // 设备导出
  public async deviceExport(
    val: DeviceListParams,
    ids: string,
    deviceIdList?: string,
  ): Promise<File> {
    return this.deviceRepository.requestExport(val, ids, deviceIdList);
  }

  // 删除定时设置
  public async delTimingSwitch(deviceIdList: number[]): Promise<void> {
    return this.deviceRepository.requestDelTimingSwitch(deviceIdList);
  }

  // 定时设置
  public async timingSwitch(id: number[], bootTime?: string, shutdownTime?: string): Promise<void> {
    return this.deviceRepository.requestTimingSwitch(id, bootTime, shutdownTime);
  }

  //分组配置-新增
  public async createGroup(createParams: string): Promise<GroupListEntity> {
    return this.deviceRepository.requestCreateGroup(createParams);
  }

  //分组配置-新增
  public async getTypeAndNumber(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceTypeNumberEntity> {
    return this.deviceRepository.requestTypeNumber(unitId, storeId);
  }

  // 分组配置-分组列表
  public async getGroupList(unitIds?: number): Promise<void> {
    await this.deviceRepository
      .requestGroupList(unitIds)
      .then((res) => {
        this.groupListData = [...res];
      })
      .catch((err) => {
        console.log(err);
        this.groupListData = [];
      });
  }

  //分组配置-设备列表
  public async getDeviceGroupList(
    page?: number,
    size?: number,
    unitId?: number | undefined,
    type?: string,
  ): Promise<void> {
    await this.deviceRepository
      .requestDeviceGroupList(page, size, unitId, type)
      .then((res) => {
        this.deviceListGroupData = { ...res };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //分组配置-设备列表
  public async getDeviceListPage(
    groupIds?: string,
    type?: string,
    deviceType?: string,
  ): Promise<void> {
    await this.deviceRepository
      .requestDeviceListPage(groupIds, type, deviceType)
      .then((res) => {
        this.deviceListData = [...res];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //分组配置-设备绑定
  public async bindDevice(deviceIds?: number[], groupIds?: number[], type?: string): Promise<void> {
    await this.deviceRepository.requestDeviceBind(deviceIds, groupIds, type);
  }

  // 设备截屏-设备截屏
  public async getScreenShot(deviceId: number | undefined): Promise<void> {
    await this.deviceRepository.requestScreenShot(deviceId).catch((err) => {
      console.log(err);
    });
  }

  // 设备截屏-截屏记录
  public async getScreenList(page?: number, size?: number, deviceId?: number): Promise<void> {
    await this.deviceRepository
      .requestScreenList(page, size, deviceId)
      .then((res) => {
        this.screenListData = { ...res };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 设备巡查
  public async getPatrol(deviceId?: number): Promise<PatrolEntity> {
    return this.deviceRepository.requestPatrol(deviceId);
  }

  //获取设备列表
  public async getDeviceList(
    getDeviceListParams: DeviceListParamsConfig,
  ): Promise<CommonPagesGeneric<DeviceRecordListItemConfig>> {
    return this.deviceRepository.requestDeviceList(getDeviceListParams);
  }

  //删除单个设备
  public async deleteDevice(id?: number): Promise<void> {
    await this.deviceRepository.requestDel(id);
  }

  //批量删除设备
  public async deleteBatchDevice(deviceIdList: string[]): Promise<void> {
    await this.deviceRepository.requestDelBatch(deviceIdList);
  }

  //关机
  public async shutDownDevice(deviceIdList: string[]): Promise<void> {
    await this.deviceRepository.requestShutDown(deviceIdList);
  }

  //开机
  public async bootUpDevice(deviceIdList: string[]): Promise<void> {
    await this.deviceRepository.requestBootUp(deviceIdList);
  }

  //重启
  public async rebootDevice(deviceIdList: string[]): Promise<void> {
    await this.deviceRepository.requestReboot(deviceIdList);
  }

  //检查设备是否有播放中的广告
  public async requestCheckAdPlaying(deviceIdList: string[]): Promise<string> {
    return this.deviceRepository.requestCheckAdPlaying(deviceIdList);
  }

  // 编辑设备
  public editDevice(query: DeviceRecordListItemConfig): Promise<DeviceRecordListItemConfig> {
    return this.deviceRepository.requsetEdit(query);
  }

  // 批量修改设备信息、批量启用/禁用
  public batchUpdate(
    deviceIdList: string[],
    groupIdList?: string[],
    projectStoreId?: string,
    deviceStatus?: boolean,
  ): Promise<void> {
    return this.deviceRepository.requsetBatchEdit(
      deviceIdList,
      groupIdList,
      projectStoreId,
      deviceStatus,
    );
  }

  // 根据设备id列表， 查询设备所属组织的所有门店
  public async getSelectStoreListByDeviceOrgId(
    deviceIdList: number[],
  ): Promise<StoreListItemConfig[]> {
    return this.deviceRepository.requestSelectStoreListByDeviceOrgId(deviceIdList);
  }

  // 获取设备详情
  public getDeviceDetails(deviceId?: number): Promise<DeviceRecordListItemConfig> {
    return this.deviceRepository.requestDeviceDetails(deviceId);
  }

  // 新增设备
  public createDevice(query: DeviceRecordListItemConfig): Promise<DeviceRecordListItemConfig> {
    return this.deviceRepository.requestCreate(query);
  }

  // 获取当前设备类型分布
  public async getDeviceDistributionData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]> {
    return this.deviceRepository.requestDeviceDistributionData(unitId, storeId);
  }

  // 获取今日设备在线情况
  public async getDeviceTodayOnlineData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceOnlineStatusEntity[]> {
    return this.deviceRepository.requestDeviceTodayOnlineData(unitId, storeId);
  }

  // 获取当前设备广告播放利用率
  public async getDevicePlayRateData(
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]> {
    return this.deviceRepository.requestDevicePlayRateData(deviceType, unitId, storeId);
  }

  // 当前在线/离线设备及在线率统计
  public async getDeviceOnlineStatusData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceStatisticsListEntity[]> {
    return this.deviceRepository.requestDeviceOnlineStatus(unitId, storeId);
  }

  // 获取设备楼层分布数据
  public async getDeviceFloorDistributionData(
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceFloorDistributionEntity[]> {
    return this.deviceRepository.requestDeviceFloorDistributionData(unitId, storeId);
  }

  // 获取历史设备在线率
  public async getDeviceHistoryOnlineRate(
    dayType?: number,
    beginDate?: string,
    endDate?: string,
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<DeviceHistoryOnlineRateEntity[]> {
    return this.deviceRepository.requestDeviceHistoryOnlineRate(
      dayType,
      beginDate,
      endDate,
      deviceType,
      unitId,
      storeId,
    );
  }

  // 设备离线导出
  public deviceOfflineExport(
    hours?: number,
    beginDate?: string,
    endDate?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<File> {
    return this.deviceRepository.deviceOfflineExport(hours, beginDate, endDate, unitId, storeId);
  }

  // 设备在线导出
  public deviceOnlineExport(
    dayType?: number,
    beginDate?: string,
    endDate?: string,
    deviceType?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<File> {
    return this.deviceRepository.deviceOnlineExport(
      dayType,
      beginDate,
      endDate,
      deviceType,
      unitId,
      storeId,
    );
  }

  // 获取项目门店列表
  public async getStoreList(
    page: number,
    size: number,
    name?: string,
    type?: string,
    city?: string,
    categoryCode?: string,
    unitId?: number,
    storeId?: number,
  ): Promise<CommonPagesGeneric<StoreListItemConfig>> {
    return this.deviceRepository.requestStoreList(
      page,
      size,
      name,
      type,
      city,
      categoryCode,
      unitId,
      storeId,
    );
  }

  //删除单个项目门店数据
  public async deleteStore(id?: number): Promise<void> {
    return this.deviceRepository.requestStoreDel(id);
  }

  //是否关联设备
  public async isRelate(id?: number): Promise<void> {
    return this.deviceRepository.requestIsRelate(id);
  }

  // 新增项目门店
  public addStore(createStoreParameter: StoreListItemConfig): Promise<StoreListItemConfig> {
    return this.deviceRepository.addStore(createStoreParameter);
  }

  // 编辑项目门店
  public editStore(query: StoreListItemConfig): Promise<StoreListItemConfig> {
    return this.deviceRepository.editStore(query);
  }

  // 获取项目门店详情
  public async getStoreDetails(storeId?: number): Promise<StoreListItemConfig> {
    return this.deviceRepository.requestStoreDetails(storeId);
  }

  // 通知播放计划
  public getNoticePlayPlan(
    deviceId: number,
    page: number,
    size: number,
    status?: string,
    content?: string,
  ): Promise<CommonPagesGeneric<NoticePlayPlanEntity>> {
    return this.deviceRepository.requestNoticePlayPlan(deviceId, page, size, status, content);
  }

  // 日志列表
  public getLogList(
    deviceId: number,
    page?: number,
    size?: number,
  ): Promise<CommonPagesGeneric<DownLogListEntity>> {
    return this.deviceRepository.requestLogList(deviceId, page, size);
  }

  // 设备下发日志上传命令
  public async getUploadLog(deviceId: number): Promise<void> {
    return this.deviceRepository.requestUploadLog(deviceId);
  }
}
