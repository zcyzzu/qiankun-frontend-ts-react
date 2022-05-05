/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:37
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:48:04
 */
import { DeviceType } from '../../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../../constants/lookupsCodeTypes';
import {
  NoticeDetailsListEntity,
  NoticeDetailsListItemEntity,
  NoticeItemDetailsEntity,
} from '../../../../../domain/entities/noticeEntities';
import { LookupsEntity } from '../../../../../domain/entities/lookupsEntities';

export interface NoticePreviewProps {
  fontColor?: string;
  bgColor?: string;
  content: string;
  speed?: string;
  opacity?: number;
}

// 具体设备列表数据格式（不包含分页数据）
export interface SpecificDeviceDataConfig extends NoticeDetailsListItemEntity {
  key?: number;
}

// 分页参数
export interface DeviceListParamsConfig {
  page: number;
  size: number;
}

export default interface NoticeDetailsTabViewModel {
  dataLengthAd: number;
  dataLengthCa: number;
  dataLengthLed: number;
  // 具体设备列表数据
  specificDeviceListData: NoticeDetailsListEntity;
  // 具体设备表格数据
  specificDeviceListDataSource: SpecificDeviceDataConfig[];
  // 获取设备详情列表数据
  getDeviceDetailsListData(id: number, type: string): Promise<void>;
  // 获取列表数量
  getListDataNum(id: number, type: string): Promise<void>;
  // 设备列表分页params
  deviceListParams: DeviceListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 具体设备内容
  deviceContent: DeviceType;
  // 切换设备
  switchDevice(value: string): void;
  // 当前id
  currentId: number;
  // 通知详情数据
  noticeDetailsData: NoticeItemDetailsEntity;
  // 获取通知详情数据
  getNoticeDetailsData(id: number): Promise<void>;
  // 初始化数据
  initialData(): void;
  // 文本位置快码数据
  textPositionCode: LookupsEntity[];
  // 文本滚动速度快码数据
  rollSpeendCode: LookupsEntity[];
  // 获取快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
}
