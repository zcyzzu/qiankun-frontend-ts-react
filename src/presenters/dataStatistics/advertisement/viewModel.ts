/*
 * @Author: wuhao
 * @Date: 2021-11-22 11:11:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:10:56
 */
import { RadioChangeEvent } from 'antd';
import { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import { ECOptions } from '../../../utils/echartsOptionsType';
import { WeekStatisticsEntity } from '../../../domain/entities/advertisementEntities';
import { trendChartTypeConfig } from '../../dataStatistics/device/viewModel';

export default interface AdvertStatisticsViewModel {
  advertisementData: WeekStatisticsEntity;
  getDeviceOnlineStatus(): void;
  // 今日播放options
  todayPlayOptions: ECOptions;
  // 今日播放图表类型
  todayPlayChartType: trendChartTypeConfig;
  //获取今日播放数据
  getTodayPlayData(): void;

  // 历史播放options
  playOptions: ECOptions;
  // 历史播放时间范围
  playChartTime: number;
  playChartDate: string[];
  // 历史播放图表类型
  playChartType: trendChartTypeConfig;
  //获取历史播放数据
  getPlayData(days?: number, date?: string[]): void;
  // 历史任务options
  taskOptions: ECOptions;
  // 历史任务时间范围
  taskChartTime: number;
  taskChartDate: string[];
  // 历史任务图表类型
  taskChartType: trendChartTypeConfig;
  //获取历史任务数据
  getTaskData(days?: number, date?: string[]): void;
  // 今日播放、历史播放、历史任务options
  setTaskOptions(options: ECOptions, type: string): void;
  // 今日播放、历史播放、历史任务图表类型
  taskChartTypeChange(e: RadioChangeEvent, type: string): void;
  // 历史播放、历史任务天数选择
  taskChartTimeChange(e: RadioChangeEvent, type: string): void;
  // 历史播放、历史任务日期选择
  taskTimeScreen(dates: RangeValue<Moment>, dateStrings: string[], type: string): void;
  // 导出
  dayExportData(type?: string): void;
  // unitId
  unitId: number | undefined;
  storeId: number | undefined;
  getUnitId(unitId?: number | undefined): void;
  getStoreId(storeId?: number | undefined): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
  initialize(): void;
}

export interface OverViewMemberTrendConfig {
  item?: string; //时间
  value?: number; //值
}
