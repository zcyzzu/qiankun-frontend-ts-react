/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:37
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:08:12
 */
import { AdvertisementPlayPlanEntity } from '../../../../domain/entities/advertisementEntities';
import { NoticePlayPlanEntity } from '../../../../domain/entities/deviceEntities';
import { CommonPagesGeneric } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';

// 广告播放状态
export enum advertPlayStatus {
  PLAYING = 'PLAYING', //播放中
  NOT_STARTED = 'NOT_STARTED', //未开始
  STOP = 'STOP', //停止播放
  COMPLETED = 'COMPLETED', //已完成
  NOT_COMPLETED = 'NOT_COMPLETED', //未完成
}

// 广告列表数据格式（不包含分页数据）
export interface PlayPlanAdvertDataConfig extends AdvertisementPlayPlanEntity {
  key?: number;
}

// 紧急广告列表数据格式（不包含分页数据）
export interface PlayPlanNoticeDataConfig extends NoticePlayPlanEntity {
  key?: number;
}

// 分页参数
export interface AdvertListParamsConfig {
  page: number;
  size: number;
}

export default interface PlayPlanViewModel {
  // 广告列表数据
  advertListData: CommonPagesGeneric<AdvertisementPlayPlanEntity>;
  // 广告表格数据
  advertListDataSource: PlayPlanAdvertDataConfig[];
  // 紧急通知列表数据
  noticeListData: CommonPagesGeneric<NoticePlayPlanEntity>;
  // 紧急通知表格数据
  noticeListDataSource: PlayPlanNoticeDataConfig[];
  // 获取广告列表数据
  getPlayPlanData(id: number): Promise<void>;
  // 下拉选择框广告/紧急通知change
  selectChange(value: string): void;
  // 下拉框广告状态change
  selectStatusChange(value: string): void;
  // 广告分页params
  advertListParams: AdvertListParamsConfig;
  // 紧急广告分页params
  noticeListParams: AdvertListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 紧急广告分页切换页码
  urgentPageChange(page: number, pageSize?: number): void;
  // 当前设备id
  currentId: number;
  // 当前类型广告/紧急通知
  currentType: string;
  // 当前播放状态
  currentStatus: string;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: PlayPlanAdvertDataConfig): Promise<void>;
  // 周期快码数据
  cycleCode: LookupsEntity[];
  // 请求快码数据
  playPlanGetLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 初始化数据
  initialData(): void;
  // 搜索
  onSearch(e: string): void;
  // 当前广告名称/通知名称
  currentName?: string;
}
