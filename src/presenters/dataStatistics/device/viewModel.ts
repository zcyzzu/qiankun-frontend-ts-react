/*
 * @Author: tongyuqiang
 * @Date: 2021-11-22 09:42:27
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:09:43
 */
import { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import { RadioChangeEvent } from 'antd';

import { ECOptions } from '../../../utils/echartsOptionsType';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { DeviceStatisticsListEntity } from '../../../domain/entities/deviceEntities';

export type trendChartTypeConfig = 'line' | 'bar';

export interface DeviceExportFormConfig {
  hours: number;
  time: Moment[];
}

// 搜索筛选数据结构
export interface SearchParamsConfig {
  dayType?: number;
  beginDate?: string;
  endDate?: string;
  deviceType?: string;
}

export default interface DeviceStatisticsViewModel {
  // 设备类型分布options
  deviceTypeOptions: ECOptions;
  // 设备广告播放利用率options
  devicePlayOptions: ECOptions;
  // 设备楼层分布options
  deviceFloorOptions: ECOptions;
  // 获取当前设备广告播放利用率
  getDevicePlayRateData(deviceType?: string): Promise<void>;
  // 设备在线情况（台）options
  deviceOnlineStatusOptions: ECOptions;
  // 设备在线率options
  deviceOnlineRateOptions: ECOptions;
  // 获取设备在线数据
  getDeviceTodayOnlineData(): Promise<void>;
  // 今日设备在线率趋势图表类型
  deviceOnlineChartType: trendChartTypeConfig;
  // 通用图表类型（折线图/柱状图）change
  chartTypeChange(e: RadioChangeEvent, type: string): void;
  // 历史设备在线率options
  deviceHistoryOptions: ECOptions;
  // 历史设备在线率图表类型
  deviceHistoryChartType: trendChartTypeConfig;
  // 历史设备近30天/近7天
  // deviceHistoryTime: number;
  // 历史设备近30天/近7天Change
  deviceHistoryTimeChange(value: number): void;
  // 历史设备datePickerChange
  datePickerChange(date: RangeValue<Moment>): void;
  // 历史设备搜索数据
  deviceHistorySearchParams: SearchParamsConfig;
  // 通用下拉选择框change
  selectTypeChange(value: string, type: string): void;
  // 导出数据
  exportData(): Promise<void>;
  // 标签弹窗状态
  exportModalVisible: boolean;
  // 设置标签窗口状态
  setExportModalVisible(): void;
  // 表单提交成功事件
  formOnFinish(values: DeviceExportFormConfig): Promise<void>;
  // unitId
  unitId?: number;
  // storeId
  storeId?: number;
  // 获取Id
  getId(unitId?: number, storeId?: number): void;
  // 当前页数
  pageNum: number;
  // 当前条数
  sizeNum: number;
  // 总页数
  totalPage: number;
  // 要去的条数index
  goValue: number;
  // 下一页
  setNext(): void;
  // 上一页
  setUp(): void;
  // 获取设备楼层分布数据
  getDeviceFloorDistributionData(): void;
  // 获取当前设备类型分布
  getDeviceDistributionData(): void;
  // 获取历史设备在线率
  getDeviceHistoryOnlineRate(): void;
  // 在线/离线设备及在线率数据
  deviceOnlineStatusData: DeviceStatisticsListEntity[];
  // 获取在线/离线设备及在线率
  getDeviceOnlineStatus(): Promise<void>;
  // 请求快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 设备类型快码数据
  deviceTypeCode: LookupsEntity[];
  // 设备在线统计快码数据
  deviceOnlineStatisticsCode: LookupsEntity[];
  // 设备广告播放利率快码数据
  devicePlayRateCode: LookupsEntity[];
  // 设备广告播放利用率数据是否存在
  isDevicePlay: boolean;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
  // 当前设备广告播放利用率下拉框
  playRateSelectType: string;
  // 历史设备在线率下拉框
  historyDeviceOnlineSelectType: string;
  // 初始化数据
  initialData(): void;
}
