/*
 * @Author: tongyuqiang
 * @Date: 2021-11-22 09:42:40
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:10:00
 */

import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import _ from 'lodash';
import { RadioChangeEvent } from 'antd';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { PieSeriesOption, LineSeriesOption, BarSeriesOption } from 'echarts/charts';

import DeviceStatisticsViewModel, {
  DeviceExportFormConfig,
  SearchParamsConfig,
  trendChartTypeConfig,
} from './viewModel';
import { DeviceType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { ECOptions } from '../../../utils/echartsOptionsType';
import { pie, vertical_bar, line, barOptionsShadow } from '../../../common/config/echartsConfig';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import {
  DATA_STATISTICS_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import { DeviceStatisticsListEntity } from '../../../domain/entities/deviceEntities';
import utils from '../../../utils/index';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

// 设备统计-今日设备在线情况
export enum DeviceOnlineStatus {
  // 总设备数
  DEVICE_ALL = 'DEVICE_ALL',
  // 设备在线率
  DEVICE_ONLINE = 'DEVICE_ONLINE',
  // 设备在线数量
  DEVICE_ONLINE_COUNT = 'DEVICE_ONLINE_COUNT',
}

@injectable()
export default class DeviceStatisticsViewModelImpl implements DeviceStatisticsViewModel {
  @inject(DATA_STATISTICS_IDENTIFIER.DEVICE_STATISTICS_USE_CASE)
  private deviceUseCase!: DeviceUseCase;

  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public deviceTypeOptions: ECOptions;
  public devicePlayOptions: ECOptions;
  public deviceFloorOptions: ECOptions;
  public deviceOnlineStatusOptions: ECOptions;
  public deviceOnlineRateOptions: ECOptions;
  public deviceOnlineChartType: trendChartTypeConfig;
  public deviceHistoryOptions: ECOptions;
  public deviceHistoryChartType: trendChartTypeConfig;
  // public deviceHistoryTime: number;
  public pageNum: number;
  public sizeNum: number;
  public totalPage: number;
  public goValue: number;
  public deviceTypeCode: LookupsEntity[];
  public exportModalVisible: boolean;
  public deviceOnlineStatusData: DeviceStatisticsListEntity[];
  public deviceOnlineStatisticsCode: LookupsEntity[];
  public devicePlayRateCode: LookupsEntity[];
  public deviceHistorySearchParams: SearchParamsConfig;
  public unitId?: number;
  public storeId?: number;
  public isDevicePlay: boolean;
  public playRateSelectType: string;
  public historyDeviceOnlineSelectType: string;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.unitId = undefined;
    this.storeId = undefined;
    this.deviceTypeOptions = _.cloneDeep(pie as ECOptions);
    (this.deviceTypeOptions.title as ECOptions).text = '当前设备类型分布';
    // (this.deviceTypeOptions.title as ECOptions).subtext = '(单位：人)';

    this.devicePlayOptions = _.cloneDeep(pie as ECOptions);
    // (this.devicePlayOptions.title as ECOptions).text = '当前设备广告播放利用率';

    this.deviceFloorOptions = _.cloneDeep(vertical_bar as ECOptions);
    (this.deviceFloorOptions.title as ECOptions).text = '当前设备楼层分布（台）';

    this.deviceOnlineStatusOptions = _.cloneDeep(line as ECOptions);
    (this.deviceOnlineStatusOptions.title as ECOptions).text = '今日设备在线情况（台）';

    this.deviceOnlineRateOptions = _.cloneDeep(line as ECOptions);
    // (this.deviceOnlineRateOptions.title as ECOptions).text = '今日设备在线率';

    this.deviceHistoryOptions = _.cloneDeep(line as ECOptions);
    // (this.deviceHistoryOptions.title as ECOptions).text = '今日设备在线率';

    this.deviceOnlineChartType = 'line';
    this.deviceHistoryChartType = 'line';
    // this.deviceHistoryTime = 30;
    this.exportModalVisible = false;
    // 当前页数
    this.pageNum = 1;
    // 每页条数
    this.sizeNum = 4;
    // 总页数
    this.totalPage = 4;
    //要去的条数index
    this.goValue = 0;
    this.deviceTypeCode = [];
    this.deviceOnlineStatusData = [];
    this.deviceOnlineStatisticsCode = [];
    this.devicePlayRateCode = [];
    this.deviceHistorySearchParams = {
      dayType: 30,
    };
    this.isDevicePlay = false;
    this.playRateSelectType = 'all';
    this.historyDeviceOnlineSelectType = 'all';

    makeObservable(this, {
      unitId: observable,
      storeId: observable,
      deviceTypeOptions: observable,
      devicePlayOptions: observable,
      deviceFloorOptions: observable,
      deviceOnlineStatusOptions: observable,
      deviceOnlineRateOptions: observable,
      deviceOnlineChartType: observable,
      deviceHistoryChartType: observable,
      // deviceHistoryTime: observable,
      exportModalVisible: observable,
      deviceHistoryOptions: observable,
      pageNum: observable,
      sizeNum: observable,
      totalPage: observable,
      goValue: observable,
      deviceTypeCode: observable,
      deviceOnlineStatusData: observable,
      deviceOnlineStatisticsCode: observable,
      devicePlayRateCode: observable,
      deviceHistorySearchParams: observable,
      isDevicePlay: observable,
      permissionsData: observable,
      playRateSelectType: observable,
      historyDeviceOnlineSelectType: observable,
      getDeviceTodayOnlineData: action,
      deviceHistoryTimeChange: action,
      datePickerChange: action,
      selectTypeChange: action,
      chartTypeChange: action,
      exportData: action,
      setExportModalVisible: action,
      formOnFinish: action,
      getCurrentSelected: action,
      setNext: action,
      setUp: action,
      getDeviceFloorDistributionData: action,
      getDeviceDistributionData: action,
      getDeviceHistoryOnlineRate: action,
      getLookupsValue: action,
      getDeviceOnlineStatus: action,
      getDevicePlayRateData: action,
      getPermissionsData: action,
      setPermissionsData: action,
      getId: action,
      initialData: action,
    });
  }

  // 获取Id
  public getId = async (unitId?: number, storeId?: number): Promise<void> => {
    this.unitId = unitId;
    this.storeId = storeId;
    this.getDeviceOnlineStatus();
    this.getDevicePlayRateData();
    this.getDeviceTodayOnlineData();
    this.getDeviceDistributionData();
    this.getDeviceFloorDistributionData();
    this.getDeviceHistoryOnlineRate();
  };

  // 获取今日设备在线数据
  public getDeviceTodayOnlineData = async (): Promise<void> => {
    try {
      const data = await this.deviceUseCase.getDeviceTodayOnlineData(this.unitId, this.storeId);
      runInAction(() => {
        (this.deviceOnlineStatusOptions.xAxis as ECOptions).data = data.map((item) => {
          return item.parseLocalTime;
        });

        let onlineData: number[] = []; //在线设备数据
        const allData: number[] = []; //设备总数据
        data.map((dataItem) => {
          return dataItem.deviceStatisticsList?.map((item) => {
            if (item.code === DeviceOnlineStatus.DEVICE_ONLINE_COUNT) {
              onlineData.push(item.value || 0);
            }
            if (item.code === DeviceOnlineStatus.DEVICE_ALL) {
              allData.push(item.value || 0);
            }
          });
        });
        let offlineData: number[] = []; //离线设备数据
        onlineData.map((arrItem, arrIndex) => {
          return allData.map((arr1Item, arr1Index) => {
            if (arrIndex === arr1Index) {
              return offlineData.push(arr1Item - arrItem);
            }
            return 0;
          });
        });
        const hours = moment().hours() === 0 ? 24 : moment().hours();
        onlineData = onlineData.slice(0, hours);
        offlineData = offlineData.slice(0, hours);
        this.deviceOnlineStatusOptions.series = [
          {
            name: '在线',
            type: 'line',
            data: onlineData,
            smooth: true,
            itemStyle: {
              shadowBlur: 8,
              shadowColor: barOptionsShadow[0],
              shadowOffsetX: 0,
              shadowOffsetY: 4,
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(127,113,255, 0.5)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(127,113,255, 0)',
                  },
                ],
                global: false,
              },
            },
          },
          {
            name: '离线',
            type: 'line',
            data: offlineData,
            smooth: true,
            itemStyle: {
              shadowBlur: 8,
              shadowColor: barOptionsShadow[1],
              shadowOffsetX: 0,
              shadowOffsetY: 4,
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(50,112,255, 0.5)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(90,81,255, 0)',
                  },
                ],
                global: false,
              },
            },
          },
        ];
        this.deviceOnlineStatusOptions.legend = {
          type: 'scroll',
          bottom: 0,
          icon: 'circle',
        };
        this.deviceOnlineStatusOptions.yAxis = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
        this.deviceOnlineStatusOptions.color = [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#B3A6FF',
              },
              {
                offset: 1,
                color: '#7F71FF',
              },
            ],
            global: false,
          },
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#73B2FF',
              },
              {
                offset: 1,
                color: '#0074FF',
              },
            ],
            global: false,
          },
        ];

        (this.deviceOnlineStatusOptions.xAxis as ECOptions).axisLabel = {
          interval: 1,
          color: '#666666',
          rotate: 40,
        };

        (this.deviceOnlineStatusOptions.tooltip as ECOptions).formatter =
          '{b}<br/>{a0}：{c0}台<br/>{a1}：{c1}台';
        this.deviceOnlineStatusOptions = { ...this.deviceOnlineStatusOptions };

        (this.deviceOnlineRateOptions.xAxis as LineSeriesOption).data = data.map((item) => {
          return item.parseLocalTime || '';
        });
        (this.deviceOnlineRateOptions.xAxis as ECOptions).axisLabel = {
          interval: 1,
          rotate: 40,
          color: '666666',
        };
        let arrRate: number[] = [];
        data.map((dataItem) => {
          return dataItem.deviceStatisticsList?.map((item) => {
            if (item.code === DeviceOnlineStatus.DEVICE_ONLINE) {
              arrRate.push(item.value || 0);
            }
            return 0;
          });
        });
        (this.deviceOnlineRateOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
        arrRate = arrRate.slice(0, moment().hours() === 0 ? 24 : moment().hours());
        (this.deviceOnlineRateOptions.series as LineSeriesOption).data = arrRate;
        (this.deviceOnlineRateOptions.yAxis as ECOptions).axisLabel = { formatter: '{value}%' };
        (this.deviceOnlineRateOptions.tooltip as ECOptions).formatter = '{b}：{c}%';
        this.deviceOnlineRateOptions = { ...this.deviceOnlineRateOptions };
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 通用图表类型（折线图/柱状图）change
  public chartTypeChange = (e: RadioChangeEvent, type: string): void => {
    if (type === 'today') {
      this.deviceOnlineChartType = (e.target as HTMLInputElement).value as trendChartTypeConfig;

      if (this.deviceOnlineChartType === 'line') {
        (this.deviceOnlineRateOptions.series as LineSeriesOption).type = 'line';
        (this.deviceOnlineRateOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
      }
      if (this.deviceOnlineChartType === 'bar') {
        (this.deviceOnlineRateOptions.series as BarSeriesOption).type = 'bar';
        (this.deviceOnlineRateOptions.series as BarSeriesOption).barWidth = 16;
        (this.deviceOnlineRateOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
        (this.deviceOnlineRateOptions.series as BarSeriesOption).itemStyle = {
          shadowBlur: 10,
          shadowColor: 'rgba(64, 150, 255, 0.2)',
          borderRadius: 4,
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#85CEFF',
              },
              {
                offset: 1,
                color: '#4096ff',
              },
            ],
            global: false,
          },
        };
      }
      this.setTrendOptions(this.deviceOnlineRateOptions);
    }

    if (type === 'history') {
      this.deviceHistoryChartType = (e.target as HTMLInputElement).value as trendChartTypeConfig;

      if (this.deviceHistoryChartType === 'line') {
        (this.deviceHistoryOptions.series as LineSeriesOption).type = 'line';
        (this.deviceHistoryOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
      }
      if (this.deviceHistoryChartType === 'bar') {
        (this.deviceHistoryOptions.series as BarSeriesOption).type = 'bar';
        (this.deviceHistoryOptions.series as BarSeriesOption).barWidth = 16;
        (this.deviceHistoryOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
        (this.deviceHistoryOptions.series as BarSeriesOption).itemStyle = {
          shadowBlur: 10,
          shadowColor: 'rgba(64, 150, 255, 0.2)',
          borderRadius: 4,
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#85CEFF',
              },
              {
                offset: 1,
                color: '#4096ff',
              },
            ],
            global: false,
          },
        };
      }
      this.setDeviceHistoryOnlineTrendOptions(this.deviceHistoryOptions);
    }
  };

  // 设置今日设备趋势options
  public setTrendOptions = (deviceOnlineRateOptions: ECOptions): void => {
    Object.assign(this.deviceOnlineRateOptions, { ...deviceOnlineRateOptions });
  };
  // 设置历史设备趋势options
  public setDeviceHistoryOnlineTrendOptions = (deviceHistoryOptions: ECOptions): void => {
    Object.assign(this.deviceHistoryOptions, { ...deviceHistoryOptions });
  };

  // 历史设备近30天/近7天Change
  public deviceHistoryTimeChange = (value: number): void => {
    this.deviceHistorySearchParams.dayType = value;
    if (this.deviceHistorySearchParams.beginDate || this.deviceHistorySearchParams.endDate) {
      delete this.deviceHistorySearchParams.beginDate;
      delete this.deviceHistorySearchParams.endDate;
    }
    this.getDeviceHistoryOnlineRate();
  };

  // 历史设备datePickerChange
  public datePickerChange = (date: RangeValue<Moment>): void => {
    if (date) {
      const beginDate = date[0]?.format('YYYY-MM-DD');
      const endDate = date[1]?.format('YYYY-MM-DD');
      this.deviceHistorySearchParams.beginDate = beginDate;
      this.deviceHistorySearchParams.endDate = endDate;
      if (this.deviceHistorySearchParams.dayType) {
        delete this.deviceHistorySearchParams.dayType;
      }
      this.getDeviceHistoryOnlineRate();
    }
  };

  // 通用下拉选择框change
  public selectTypeChange = (value: string, type: string): void => {
    if (type === 'play') {
      this.playRateSelectType = value;
      if (value === 'all') {
        this.getDevicePlayRateData();
        return;
      }
      this.getDevicePlayRateData(value);
    }
    if (type === 'history') {
      this.deviceHistorySearchParams.deviceType = value;
      this.historyDeviceOnlineSelectType = value;
      if (value === 'all') {
        delete this.deviceHistorySearchParams.deviceType;
      }
      this.getDeviceHistoryOnlineRate();
    }
  };

  // 设备在线导出
  public exportData = async (): Promise<void> => {
    const { dayType, beginDate, endDate, deviceType } = this.deviceHistorySearchParams;
    let now: string | null;
    let past: string | null;
    await this.deviceUseCase
      .deviceOnlineExport(dayType, beginDate, endDate, deviceType, this.unitId, this.storeId)
      .then((res) => {
        const eleLink = document.createElement('a');
        if (dayType === 7) {
          now = moment()
            .day(0)
            .format('YYYYMMDD');
          past = moment()
            .day(-6)
            .format('YYYYMMDD');
        }
        if (dayType === 30) {
          now = moment()
            .day(0)
            .format('YYYYMMDD');
          past = moment()
            .day(-29)
            .format('YYYYMMDD');
        }
        eleLink.download = `设备在线率${
          beginDate ? beginDate.replace(new RegExp('-', 'gm'), '') : ''
        }${past || ''}-${endDate ? endDate.replace(new RegExp('-', 'gm'), '') : ''}${now ||
          ''}.xlsx`;
        eleLink.style.display = 'none';
        eleLink.href = URL.createObjectURL(res);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
        utils.globalMessge({
          content: '导出成功!',
          type: 'success',
        });
      })
      .catch((err) => {
        utils.globalMessge({
          content: `导出失败${err.message}!`,
          type: 'error',
        });
      });
  };

  // 设置导出窗口状态
  public setExportModalVisible = (): void => {
    this.exportModalVisible = !this.exportModalVisible;
  };

  // 表单提交成功事件
  public formOnFinish = async (values: DeviceExportFormConfig): Promise<void> => {
    const startDate = values.time[0].format('YYYY-MM-DD');
    const endDate = values.time[1].format('YYYY-MM-DD');
    await this.deviceUseCase
      .deviceOfflineExport(values.hours, startDate, endDate, this.unitId, this.storeId)
      .then((res) => {
        const eleLink = document.createElement('a');
        eleLink.download = `离线设备详单-${startDate.replace(
          new RegExp('-', 'gm'),
          '',
        )}-${endDate.replace(new RegExp('-', 'gm'), '')}超${values.hours}小时.xlsx`;
        eleLink.style.display = 'none';
        eleLink.href = URL.createObjectURL(res);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
        utils.globalMessge({
          content: '导出成功!',
          type: 'success',
        });
        this.setExportModalVisible();
      })
      .catch((err) => {
        utils.globalMessge({
          content: `导出失败${err.message}!`,
          type: 'error',
        });
      });
  };

  // 获取当前树所选择的项
  public getCurrentSelected = (data: OrganizationListEntity): void => {
    console.log('data', JSON.parse(JSON.stringify(data)));
  };

  // 上一页
  public setUp = (): void => {
    if (this.pageNum > 1) {
      this.pageNum -= 1;
      this.goValue -= this.sizeNum;
      this.getDeviceFloorDistributionData();
    }
  };

  // 下一页
  public setNext = (): void => {
    if (this.pageNum < this.totalPage) {
      this.pageNum += 1;
      this.goValue += this.sizeNum;
      this.getDeviceFloorDistributionData();
    }
  };

  // 获取设备楼层分布数据
  public getDeviceFloorDistributionData = async (): Promise<void> => {
    try {
      const data = await this.deviceUseCase.getDeviceFloorDistributionData(
        this.unitId,
        this.storeId,
      );
      if (data.length > 0) {
        // 设置总页数
        this.totalPage = Math.ceil(data.length / this.sizeNum);
        // 当前页展示的数据
        const dataPage = data.slice(this.goValue, this.goValue + this.sizeNum);

        (this.deviceFloorOptions.xAxis as ECOptions).data = dataPage.map((item) => {
          return item.floor;
        });

        const arr: number[] = [];
        const arr1: number[] = [];
        const arr2: number[] = [];
        dataPage.map((item) => {
          return item.deviceStatisticsList?.map((listItem) => {
            if (listItem.code === DeviceType.Advertisement) {
              arr.push(listItem.value || 0);
            }
            if (listItem.code === DeviceType.Cashier) {
              arr1.push(listItem.value || 0);
            }
            if (listItem.code === DeviceType.Led) {
              arr2.push(listItem.value || 0);
            }
          });
        });

        const seriesData = [
          !arr.every((x) => x === 0)
            ? {
                name: '广告机',
                type: 'bar',
                data: arr,
                barWidth: 10,
                itemStyle: {
                  shadowBlur: 8,
                  shadowColor: barOptionsShadow[0],
                  shadowOffsetX: 0,
                  shadowOffsetY: 4,
                  borderRadius: 2,
                },
              }
            : {},
          !arr1.every((x) => x === 0)
            ? {
                name: '收银机',
                type: 'bar',
                data: arr1,
                barWidth: 10,
                itemStyle: {
                  shadowBlur: 8,
                  shadowColor: barOptionsShadow[1],
                  shadowOffsetX: 0,
                  shadowOffsetY: 4,
                  borderRadius: 2,
                },
              }
            : {},
          !arr2.every((x) => x === 0)
            ? {
                name: 'LED',
                type: 'bar',
                data: arr2,
                barWidth: 10,
                itemStyle: {
                  shadowBlur: 8,
                  shadowColor: barOptionsShadow[2],
                  shadowOffsetX: 0,
                  shadowOffsetY: 4,
                  borderRadius: 2,
                },
              }
            : {},
        ];
        this.deviceFloorOptions.series = [];
        seriesData.forEach((item) => {
          if (!_.isEmpty(item)) {
            (this.deviceFloorOptions.series as BarSeriesOption[]).push(item as BarSeriesOption);
          }
        });
        if ((this.deviceFloorOptions.series as BarSeriesOption[]).length === 1) {
          (this.deviceFloorOptions.tooltip as ECOptions).formatter = '{a0}：{c0}台';
        }
        if ((this.deviceFloorOptions.series as BarSeriesOption[]).length === 2) {
          (this.deviceFloorOptions.tooltip as ECOptions).formatter =
            '{a0}：{c0}台<br/>{a1}：{c1}台';
        }
        if ((this.deviceFloorOptions.series as BarSeriesOption[]).length === 3) {
          (this.deviceFloorOptions.tooltip as ECOptions).formatter =
            '{a0}：{c0}台<br/>{a1}：{c1}台<br/>{a2}：{c2}台';
        }
        this.deviceFloorOptions = { ...this.deviceFloorOptions };
      } else {
        this.deviceFloorOptions.series = [];
        this.deviceFloorOptions = _.cloneDeep(vertical_bar as ECOptions);
        (this.deviceFloorOptions.title as ECOptions).text = '当前设备楼层分布（台）';
        this.totalPage = 0;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取当前设备类型分布
  public getDeviceDistributionData = async (): Promise<void> => {
    try {
      const data = await this.deviceUseCase.getDeviceDistributionData(this.unitId, this.storeId);
      runInAction(() => {
        (this.deviceTypeOptions.series as PieSeriesOption).data = data.map((item, index) => {
          const deviceType = this.deviceTypeCode.find((deviceItem) => {
            return deviceItem.value === item.code;
          });
          return {
            name: deviceType?.meaning,
            value: item.value,
            itemStyle: { shadowColor: barOptionsShadow[index] },
          };
        });
        (this.deviceTypeOptions.tooltip as ECOptions).formatter = '{b}：{c}%';
        this.deviceTypeOptions = { ...this.deviceTypeOptions };
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 获取当前设备广告播放利用率
  public getDevicePlayRateData = async (deviceType?: string): Promise<void> => {
    try {
      const data = await this.deviceUseCase.getDevicePlayRateData(
        deviceType,
        this.unitId,
        this.storeId,
      );
      runInAction(() => {
        if (data.length > 0) {
          (this.devicePlayOptions.series as PieSeriesOption).data = data.map((item, index) => {
            const devicePlayRate = this.devicePlayRateCode.find((deviceItem) => {
              return deviceItem.value === item.code;
            });
            return {
              name: devicePlayRate?.meaning,
              value: Number(item.value),
              itemStyle: { shadowColor: barOptionsShadow[index] },
            };
          });
          this.isDevicePlay = true;
          (this.devicePlayOptions.tooltip as ECOptions).formatter = '{b}：{c}%';
          this.devicePlayOptions = { ...this.devicePlayOptions };
        } else {
          this.isDevicePlay = false;
          this.devicePlayOptions = _.cloneDeep(pie as ECOptions);
          // (this.devicePlayOptions.title as ECOptions).text = '当前设备广告播放利用率';
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 获取历史设备在线率
  public getDeviceHistoryOnlineRate = async (): Promise<void> => {
    try {
      const { dayType, beginDate, endDate, deviceType } = this.deviceHistorySearchParams;
      const data = await this.deviceUseCase.getDeviceHistoryOnlineRate(
        dayType,
        beginDate,
        endDate,
        deviceType,
        this.unitId,
        this.storeId,
      );
      runInAction(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const arr: any = [];
        data.map((item) => {
          return item.deviceStatisticsList?.map((listItem) => {
            if (listItem.code === DeviceOnlineStatus.DEVICE_ONLINE) {
              arr.push(listItem.value);
            }
          });
        });
        (this.deviceHistoryOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
        (this.deviceHistoryOptions.series as LineSeriesOption).data = arr;
        (this.deviceHistoryOptions.xAxis as LineSeriesOption).data = data.map((item) => {
          return `${item.parseLocalDate}`;
        });
        (this.deviceHistoryOptions.yAxis as ECOptions).axisLabel = { formatter: '{value}%' };
        (this.deviceHistoryOptions.tooltip as ECOptions).formatter = '{b}：{c}%';
        this.deviceHistoryOptions = { ...this.deviceHistoryOptions };
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取设备类型快码数据
        if (code === LookupsCodeTypes.DEVICE_TYPE_CODE) {
          this.deviceTypeCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 获取设备在线统计快码数据
        if (code === LookupsCodeTypes.DEVICE_STATISTICS_CODE) {
          this.deviceOnlineStatisticsCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 获取设备广告播放利用率快码数据
        if (code === LookupsCodeTypes.DEVICE_PLAY_RATE_CODE) {
          this.devicePlayRateCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.deviceTypeCode = [];
        this.deviceOnlineStatisticsCode = [];
        this.devicePlayRateCode = [];
      });
    }
  };

  // 获取在线/离线设备及在线率
  public getDeviceOnlineStatus = async (): Promise<void> => {
    try {
      const data = await this.deviceUseCase.getDeviceOnlineStatusData(this.unitId, this.storeId);
      runInAction(() => {
        this.deviceOnlineStatusData = data;
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };

  // 初始化数据
  public initialData = (): void => {
    this.playRateSelectType = 'all';
    this.historyDeviceOnlineSelectType = 'all';
  };
}
