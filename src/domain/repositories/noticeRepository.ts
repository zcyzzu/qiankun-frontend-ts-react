/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:23:23
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-01-20 16:40:06
 */
import { CommonPagesGeneric } from '../../common/config/commonConfig';
import {
  NoticeListItemConfig,
  NoticeItemDetailsEntity,
  NoticeDetailsListEntity,
  NoticePlayListItemConfig,
  NoticeApproveListItemConfig,
  OperateNoticeEntity,
  StoreWithCountEntity,
} from '../entities/noticeEntities';
import { StoreListItemConfig, AdvertisementDeviceListEntity } from '../entities/deviceEntities';
import { AdvertisementOperateLogEntity } from '../entities/advertisementEntities';

export default interface NoticeRepository {
  // 获取上屏发布-紧急通知列表
  requestPublishNoticeList(
    page: number,
    size: number,
    status?: string,
    content?: string,
    deviceName?: string,
    storeId?: string,
  ): Promise<CommonPagesGeneric<NoticeListItemConfig>>;

  // 获取上屏发布-通知列表-通知详情数据
  requestNoticeItemDetails(noticeId: number): Promise<NoticeItemDetailsEntity>;

  // 获取上屏发布-通知列表-通知详情列表数据(带分页)
  requestNoticeDetailsListData(
    type: string,
    noticeId: number,
    page: number,
    size: number,
  ): Promise<NoticeDetailsListEntity>;

  // 通知编辑中的设备列表
  requestEditNoticeDeviceList(
    type?: string,
    noticeId?: number,
  ): Promise<AdvertisementDeviceListEntity[]>;

  // 上屏发布-通知列表-编辑通知
  requestEditNotice(params: NoticeItemDetailsEntity): Promise<void>;

  // 获取播放列表-通知列表
  requestPlayNoticeList(
    page: number,
    size: number,
    status?: string,
    content?: string,
    deviceName?: string,
    storeId?: string,
  ): Promise<CommonPagesGeneric<NoticePlayListItemConfig>>;

  // 删除单个设备
  requestDel(noticeId?: number): Promise<void>;

  // 获取项目/门店列表数据
  requestStoresList(): Promise<StoreListItemConfig[]>;

  // 获取审批管理-紧急通知列表
  requestApproveNoticeList(
    size: number,
    page: number,
    status?: string,
    content?: string,
    flag?: boolean,
  ): Promise<CommonPagesGeneric<NoticeApproveListItemConfig>>;

  // 操作通知/开始/暂停
  requestOperateNotice(params: OperateNoticeEntity): Promise<void>;

  // 按项目/门店搜索设备，带数量
  requestStoreWithCount(deviceType: string): Promise<StoreWithCountEntity[]>;

  // 获取分组名称搜索设备，带数量
  requestGroupWithCount(deviceType: string): Promise<StoreWithCountEntity[]>;

  // 根据设备类型查询租户下所有设备列表
  requestAllDeviceByDevicetype(deviceType: string): Promise<AdvertisementDeviceListEntity[]>;

  // 发布紧急通知
  requestReleaseNotice(result: NoticeItemDetailsEntity): Promise<void>;

  // 操作日志
  requestOperateLog(noticeId: number): Promise<AdvertisementOperateLogEntity[]>;

  // 发布通知检查有无设备
  requestCheckDevice(): Promise<string | boolean>;
}
