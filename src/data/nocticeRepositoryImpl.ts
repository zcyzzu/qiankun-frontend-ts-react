/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:26:33
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:07:18
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';
import { CommonPagesGeneric } from '../common/config/commonConfig';
import NoticeRepository from '../domain/repositories/noticeRepository';
import {
  NoticeListItemConfig,
  NoticeItemDetailsEntity,
  NoticeDetailsListEntity,
  NoticePlayListItemConfig,
  NoticeApproveListItemConfig,
  StoreWithCountEntity,
  OperateNoticeEntity,
} from '../domain/entities/noticeEntities';
import {
  StoreListItemConfig,
  AdvertisementDeviceListEntity,
} from '../domain/entities/deviceEntities';
import { AdvertisementOperateLogEntity } from '../domain/entities/advertisementEntities';
import UserUseCase from '../domain/useCases/userUseCase';

@injectable()
export default class NoticeRepositoryImpl implements NoticeRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 获取上屏发布-通知列表
  async requestPublishNoticeList(
    page: number,
    size: number,
    status?: string,
    content?: string,
    deviceName?: string,
    storeId?: string,
  ): Promise<CommonPagesGeneric<NoticeListItemConfig>> {
    const { data } = await axios.get(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice`, {
      params: {
        page,
        size,
        status,
        content,
        deviceName,
        storeId,
      },
    });
    return data;
  }

  // 获取上屏发布-通知列表-通知详情数据
  async requestNoticeItemDetails(noticeId: number): Promise<NoticeItemDetailsEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice/detail`,
      {
        params: {
          noticeId,
        },
      },
    );
    return data;
  }

  // 获取上屏发布-通知列表-通知详情列表数据
  async requestNoticeDetailsListData(
    type: string,
    noticeId: number,
    page: number,
    size: number,
  ): Promise<NoticeDetailsListEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice/type/device/page`,
      {
        params: {
          type,
          noticeId,
          page,
          size,
        },
      },
    );
    return data;
  }

  // 编辑中的选择设备列表
  async requestEditNoticeDeviceList(
    type?: string,
    noticeId?: number,
  ): Promise<AdvertisementDeviceListEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice/type/device`,
      {
        params: {
          type,
          noticeId,
        },
      },
    );
    return data;
  }

  // 上屏发布-通知列表-编辑通知
  async requestEditNotice(params: NoticeItemDetailsEntity): Promise<void> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice/edit`,
      params,
    );
    return data;
  }

  // 删除上屏发布-通知列表单条数据
  async requestDel(noticeId?: number): Promise<void> {
    await axios.delete(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice`, {
      params: { noticeId },
    });
  }

  // 获取播放-通知列表
  async requestPlayNoticeList(
    page: number,
    size: number,
    status?: string,
    content?: string,
    deviceName?: string,
    storeId?: string,
  ): Promise<CommonPagesGeneric<NoticePlayListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/playlist/notice`,
      {
        params: {
          page,
          size,
          status,
          content,
          deviceName,
          storeId,
        },
      },
    );
    return data;
  }
  // 获取项目/门店列表数据
  async requestStoresList(): Promise<StoreListItemConfig[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/store/list`,
    );
    return data;
  }

  // 获取审批管理-通知列表
  async requestApproveNoticeList(
    size: number,
    page: number,
    status?: string,
    content?: string,
    flag?: boolean,
  ): Promise<CommonPagesGeneric<NoticeApproveListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/approve/notice/page`,
      {
        params: {
          page,
          size,
          status,
          content,
          flag,
        },
      },
    );
    return data;
  }

  // 操作通知/开始/暂停
  async requestOperateNotice(params: OperateNoticeEntity): Promise<void> {
    await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/playlist/notice/operation`,
      params,
    );
  }

  // 获取组织列表数据
  async requestStoreWithCount(deviceType: string): Promise<StoreWithCountEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/search-by/store-with-device-count?deviceTypeEnum=${deviceType}`,
    );
    return data;
  }

  // 获取分组名称搜索设备，带数量
  async requestGroupWithCount(deviceType: string): Promise<StoreWithCountEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/search-by/group-with-device-count?deviceTypeEnum=${deviceType}`,
    );
    return data;
  }

  // 根据设备类型查询租户下所有设备列表
  async requestAllDeviceByDevicetype(deviceType: string): Promise<AdvertisementDeviceListEntity[]> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/select-all-by-type/${deviceType}`,
    );
    return data;
  }

  // 发布紧急通知
  async requestReleaseNotice(result: NoticeItemDetailsEntity): Promise<void> {
    await axios.post(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice`, result);
  }

  // 操作日志
  async requestOperateLog(noticeId: number): Promise<AdvertisementOperateLogEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/playlist/notice/operation/log`,
      {
        params: {
          noticeId,
        },
      },
    );
    return data;
  }

  // 发布通知检查有无设备
  async requestCheckDevice(): Promise<string | boolean> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/notice/publish/check/device`,
    );
    return data;
  }
}
