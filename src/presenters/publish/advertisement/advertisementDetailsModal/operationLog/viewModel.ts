/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:37
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:13:04
 */
import { AdvertisementOperateLogEntity } from '../../../../../domain/entities/advertisementEntities';
import { LookupsEntity } from '../../../../../domain/entities/lookupsEntities';
import { LookupsCodeTypes } from '../../../../../constants/lookupsCodeTypes';

// 通知操作类型
export enum NoticeOperateType {
  // 开始播放
  START = 'START',
  // 停止播放
  STOP = 'STOP',
}

// 广告操作类型
export enum AdOperateType {
  // 开始播放
  START = 'START',
  // 停止播放
  STOP_PLAY = 'STOP_PLAY',
  // 续播
  CONTINUE_PLAYING = 'CONTINUE_PLAYING',
}

export default interface OperationLogViewModel {
  // 操作日志数据
  operateLogData: AdvertisementOperateLogEntity[];
  // 获取操作日志数据
  getOperateLog(id: number, type: string): Promise<void>;
  // 广告操作类型快码数据
  operationTypeCode: LookupsEntity[];
  // 通知操作类型快码数据
  noticeOperationTypeCode: LookupsEntity[];
  // 请求快码数据
  operationPageGetLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 初始化数据
  initialData(): void;
  // 当前类型广告/通知
  type?: string;
}
