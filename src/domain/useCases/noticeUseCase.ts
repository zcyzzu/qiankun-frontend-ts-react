/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 13:58:53
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-18 16:41:00
 */
import { inject, injectable } from 'inversify';
import { NOTICE_IDENTIFIER } from '../../constants/identifiers';
import NoticeRepository from '../repositories/noticeRepository';
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
import { CommonPagesGeneric } from '../../common/config/commonConfig';
import { LookupsEntity } from '../entities/lookupsEntities';
import { AdvertisementOperateLogEntity } from '../entities/advertisementEntities';

@injectable()
export default class NoticeUseCase {
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_REPOSITORY)
  private noticeRepository!: NoticeRepository;
  public storesListData: StoreListItemConfig[];
  public lookupsValue: LookupsEntity[];

  public constructor() {
    this.storesListData = [];
    this.lookupsValue = [];
  }

  //获取上屏发布-通知列表
  public async getNoticeList(
    page: number,
    size: number,
    approveStatus?: string,
    content?: string,
    deviceName?: string,
    storeId?: string,
  ): Promise<CommonPagesGeneric<NoticeListItemConfig>> {
    return this.noticeRepository.requestPublishNoticeList(
      page,
      size,
      approveStatus,
      content,
      deviceName,
      storeId,
    );
  }

  // 获取上屏发布-通知列表-通知详情数据
  public async getNoticeItemDetails(noticeId: number): Promise<NoticeItemDetailsEntity> {
    return this.noticeRepository.requestNoticeItemDetails(noticeId);
  }

  // 获取上屏发布-通知列表-通知详情列表数据
  public async getNoticeDetailsListData(
    type: string,
    noticeId: number,
    page: number,
    size: number,
  ): Promise<NoticeDetailsListEntity> {
    return this.noticeRepository.requestNoticeDetailsListData(type, noticeId, page, size);
  }

  // 编辑中的选择设备列表
  public getEditDeviceList(
    type?: string,
    noticeId?: number,
  ): Promise<AdvertisementDeviceListEntity[]> {
    return this.noticeRepository.requestEditNoticeDeviceList(type, noticeId);
  }

  // 删除列表单条数据
  public async deleteNotice(noticeId?: number): Promise<void> {
    return this.noticeRepository.requestDel(noticeId);
  }

  //获取播放-通知列表
  public async getNoticePlayList(
    page: number,
    size: number,
    status?: string,
    content?: string,
    deviceName?: string,
    storeId?: string,
  ): Promise<CommonPagesGeneric<NoticePlayListItemConfig>> {
    return this.noticeRepository.requestPlayNoticeList(
      page,
      size,
      status,
      content,
      deviceName,
      storeId,
    );
  }

  // 获取项目/门店列表数据
  public async getStoresList(): Promise<void> {
    await this.noticeRepository
      .requestStoresList()
      .then((res) => {
        this.storesListData = res;
      })
      .catch(() => {
        this.storesListData = [];
      });
  }

  //获取审批-通知列表
  public async getApproveNoticeList(
    size: number,
    page: number,
    status?: string,
    content?: string,
    flag?: boolean,
  ): Promise<CommonPagesGeneric<NoticeApproveListItemConfig>> {
    return this.noticeRepository.requestApproveNoticeList(page, size, status, content, flag);
  }

  // 操作通知/开始/暂停
  public getOperateNotice(params: OperateNoticeEntity): Promise<void> {
    return this.noticeRepository.requestOperateNotice(params);
  }


  //获取上屏发布-通知列表
  public async getStoreWithCount(deviceType: string): Promise<StoreWithCountEntity[]> {
    return this.noticeRepository.requestStoreWithCount(deviceType);
  }

  //获取分组名称搜索设备，带数量
  public async getGroupStoreWithCount(deviceType: string): Promise<StoreWithCountEntity[]> {
    return this.noticeRepository.requestGroupWithCount(deviceType);
  }

  // 根据设备类型查询租户下所有设备列表
  public async getAllDeviceByType(deviceType: string): Promise<AdvertisementDeviceListEntity[]> {
    return this.noticeRepository.requestAllDeviceByDevicetype(deviceType);
  }

  // 发布紧急通知
  public async createNotice(result: NoticeItemDetailsEntity): Promise<void> {
    return this.noticeRepository.requestReleaseNotice(result);
  }

  // 上屏发布-通知列表-编辑通知
  public editNotice(query: NoticeItemDetailsEntity): Promise<void> {
    return this.noticeRepository.requestEditNotice(query);
  }

  // 操作日志
  public getOperateLog(noticeId: number): Promise<AdvertisementOperateLogEntity[]> {
    return this.noticeRepository.requestOperateLog(noticeId);
  }

  // 发布通知检查有无设备
  public getCheckDevice(): Promise<string | boolean> {
    return this.noticeRepository.requestCheckDevice();
  }
}
