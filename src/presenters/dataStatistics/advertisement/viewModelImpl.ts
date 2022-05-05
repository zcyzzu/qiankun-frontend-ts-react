/*
 * @Author: wuhao
 * @Date: 2021-11-22 11:11:36
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-21 17:13:43
 */

import _ from 'lodash';
import { RadioChangeEvent } from 'antd';
import { injectable, inject } from 'inversify';
import { LineSeriesOption, BarSeriesOption } from 'echarts/charts';
import { makeObservable, observable, action, runInAction } from 'mobx';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import AdvertStatisticsViewModel, { OverViewMemberTrendConfig } from './viewModel';
import { trendChartTypeConfig } from '../../dataStatistics/device/viewModel';
import { ECOptions } from '../../../utils/echartsOptionsType';
import utils from '../../../utils/index';
import { line } from '../../../common/config/echartsConfig';
import { ADVERTISEMENT_IDENTIFIER, PERMISSIONS } from '../../../constants/identifiers';
import AdvertisementUseCase from '../../../domain/useCases/advertisementUseCase';
import { WeekStatisticsEntity } from '../../../domain/entities/advertisementEntities';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class AdvertStatisticsViewModelImpl implements AdvertStatisticsViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;
  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public advertisementData: WeekStatisticsEntity;

  public todayPlayOptions: ECOptions;
  public todayPlayChartType: trendChartTypeConfig;

  public playOptions: ECOptions;
  public playChartType: trendChartTypeConfig;
  public playChartTime: number;
  public playChartDate: string[];

  public taskData: OverViewMemberTrendConfig[];
  public taskOptions: ECOptions;
  public taskChartType: trendChartTypeConfig;
  public taskChartTime: number;
  public taskChartDate: string[];

  public unitId: number | undefined;
  public storeId: number | undefined;

  public sumArr: (number | string)[];
  public pictureNumArr: (number | string)[];
  public videoNumArr: (number | string)[];
  public hisSumArr: number[];
  public hisPictureNumArr: number[];
  public hisVideoNumArr: number[];
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.unitId = undefined;
    this.storeId = undefined;
    this.advertisementData = {};

    this.todayPlayChartType = 'line';
    this.todayPlayOptions = _.cloneDeep(line as ECOptions);

    (this.todayPlayOptions.tooltip as ECOptions).formatter = //.formatFunction;
      '{b}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>今日播放总数：{c}次';

    this.playChartType = 'line';
    this.playChartTime = 30;
    this.playChartDate = [];
    this.playOptions = _.cloneDeep(line as ECOptions);
    (this.playOptions.tooltip as ECOptions).formatter =
      '{b}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>历史播放总数：{c}次';

    this.taskData = [];
    this.taskChartType = 'line';
    this.taskChartTime = 30;
    this.taskChartDate = [];
    this.taskOptions = _.cloneDeep(line as ECOptions);
    (this.taskOptions.tooltip as ECOptions).formatter =
      '{b}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>历史广告任务次数：{c}次';

    this.sumArr = [];
    this.pictureNumArr = [];
    this.videoNumArr = [];
    this.hisSumArr = [];
    this.hisPictureNumArr = [];
    this.hisVideoNumArr = [];
    makeObservable(this, {
      sumArr: observable,
      pictureNumArr: observable,
      videoNumArr: observable,
      hisSumArr: observable,
      hisPictureNumArr: observable,
      hisVideoNumArr: observable,
      unitId: observable,
      storeId: observable,
      advertisementData: observable,
      todayPlayOptions: observable,
      todayPlayChartType: observable,
      playOptions: observable,
      playChartType: observable,
      playChartTime: observable,
      playChartDate: observable,
      taskData: observable,
      taskOptions: observable,
      taskChartType: observable,
      taskChartTime: observable,
      taskChartDate: observable,
      permissionsData: observable,
      taskChartTypeChange: action,
      taskChartTimeChange: action,
      taskTimeScreen: action,
      getTodayPlayData: action,
      getPlayData: action,
      getTaskData: action,
      dayExportData: action,
      formatFunction: action,
      getStoreId: action,
      getUnitId: action,
      getPermissionsData: action,
      setPermissionsData: action,
      getDeviceOnlineStatus: action,
      initialize: action,
    });
  }
  // unitId
  public getUnitId = async (unitId: number | undefined): Promise<void> => {
    this.unitId = unitId;
    this.storeId = undefined;
  };

  // storeId
  public getStoreId = async (storeId: number | undefined): Promise<void> => {
    this.unitId = undefined;
    this.storeId = storeId;
  };

  //初始化
  public initialize = (): void => {
    this.playChartTime = 30;
    this.taskChartTime = 30;
    this.todayPlayChartType = 'line';
    this.playChartType = 'line';
    this.taskChartType = 'line';
  };
  // 今日播放、历史播放、历史任务options
  public formatFunction = (params: any[]): string => {
    const param = params[0];
    const date = new Date(param.value[0]);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} : ${param.value[1]}`;
  };

  // 今日播放导出
  public dayExportData = async (type?: string): Promise<void> => {
    const fillerType = 'single-sheet';
    const exportTypeData = 'DATA';
    if (type === 'dayPlay') {
      const idsValue = '1,2,3,4';
      await this.AdvertisementUseCase.dayPlayExport(
        fillerType,
        exportTypeData,
        this.unitId,
        this.storeId,
        idsValue,
      )
        .then((res) => {
          const eleLink = document.createElement('a');
          eleLink.download = `播放次数统计${moment().format('YYYYMMDD')}.xlsx`;
          eleLink.style.display = 'none';
          eleLink.href = URL.createObjectURL(res);
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
          if (res.type) {
            utils.globalMessge({
              content: '导出成功!',
              type: 'success',
            });
          } else {
            utils.globalMessge({
              content: '导出过程中发生错误，请联系管理员!',
              type: 'error',
            });
          }
        })
        .catch((err) => {
          utils.globalMessge({
            content: `导出失败${err.message}!`,
            type: 'error',
          });
        });
    }
    if (type === 'historyPlay') {
      const idsValue = '1,2,3,4';
      await this.AdvertisementUseCase.historyPlayExport(
        fillerType,
        exportTypeData,
        this.unitId,
        this.storeId,
        idsValue,
        this.playChartDate[0],
        this.playChartDate[1],
      )
        .then((res) => {
          const eleLink = document.createElement('a');
          eleLink.download = `播放次数统计${this.playChartDate[0]}-${this.playChartDate[1]}.xlsx`;
          eleLink.style.display = 'none';
          eleLink.href = URL.createObjectURL(res);
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
          if (res.type) {
            utils.globalMessge({
              content: '导出成功!',
              type: 'success',
            });
          } else {
            utils.globalMessge({
              content: '导出过程中发生错误，请联系管理员!',
              type: 'error',
            });
          }
        })
        .catch((err) => {
          utils.globalMessge({
            content: `导出失败${err.message}!`,
            type: 'error',
          });
        });
    }
    if (type === 'historyTask') {
      const idsValue = '1,2,3,4';
      await this.AdvertisementUseCase.historyTaskExport(
        fillerType,
        exportTypeData,
        this.unitId,
        this.storeId,
        idsValue,
        this.taskChartDate[0],
        this.taskChartDate[1],
      )
        .then((res) => {
          const eleLink = document.createElement('a');
          eleLink.download = `广告任务统计${this.taskChartDate[0]}-${this.taskChartDate[1]}.xlsx`;
          eleLink.style.display = 'none';
          eleLink.href = URL.createObjectURL(res);
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
          if (res.type) {
            utils.globalMessge({
              content: '导出成功!',
              type: 'success',
            });
          } else {
            utils.globalMessge({
              content: '导出过程中发生错误，请联系管理员!',
              type: 'error',
            });
          }
        })
        .catch((err) => {
          utils.globalMessge({
            content: `导出失败${err.message}!`,
            type: 'error',
          });
        });
    }
  };

  // 获取今日播放数据
  public getTodayPlayData = async (): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getStatisticsPlayDay(this.unitId, this.storeId);
      runInAction(() => {
        let sumArr: (number | string)[] = [];
        let pictureNumArr: (number | string)[] = [];
        let videoNumArr: (number | string)[] = [];

        data?.map((item) => {
          sumArr.push(item.sum || '0');
          pictureNumArr.push(item.pictureNum || '0');
          videoNumArr.push(item.videoNum || '0');
        });
        this.sumArr = sumArr;
        this.pictureNumArr = pictureNumArr;
        this.videoNumArr = videoNumArr;
        const hours = moment().hours() === 0 ? 24 : moment().hours();
        sumArr = sumArr.slice(0, hours);
        videoNumArr = videoNumArr.slice(0, hours);
        pictureNumArr = pictureNumArr.slice(0, hours);
        this.todayPlayOptions.series = [
          {
            name: '总数',
            type: 'line',
            data: sumArr,
            smooth: true,
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
          {
            name: '视频',
            type: 'line',
            data: videoNumArr,
            symbolSize: 0,
            showSymbol: false,
            lineStyle: {
              width: 0,
              color: 'rgba(0,0,0,0)',
            },
          },
          {
            name: '图片',
            type: 'line',
            data: pictureNumArr,
            symbolSize: 0,
            showSymbol: false,
            lineStyle: {
              width: 0,
              color: 'rgba(0,0,0,0)',
            },
          },
        ];
        const date = new Date();
        (this.todayPlayOptions
          .tooltip as ECOptions).formatter = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} {b}<br/></span>今日播放总数：{c}次<br/></span>视频播放数：{c1}次<br/></span>图片播放数：{c2}次`;
        if (this.todayPlayOptions.xAxis) {
          (this.todayPlayOptions.xAxis as LineSeriesOption).data = data.map((element) => {
            return element.name || '';
          });
        }
        if (this.todayPlayOptions.yAxis) {
          (this.todayPlayOptions.yAxis as ECOptions) = {
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#e9e9e9',
              },
            },
            minInterval: 1,
          };
        }
        this.todayPlayOptions = { ...this.todayPlayOptions };
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 获取日期
  public getDate = (day: number): string => {
    const MonthToday = new Date(
      new Date().getTime() - day * 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000,
    );
    const MonthYear = MonthToday.getFullYear();
    const Month =
      MonthToday.getMonth() + 1 < 10 ? `0${MonthToday.getMonth() + 1}` : MonthToday.getMonth() + 1;
    const Today = MonthToday.getDate();
    const MonthDay = Today < 10 ? `0${MonthToday.getDate()}` : MonthToday.getDate();
    const MonthKsrq = `${MonthYear}-${Month}-${MonthDay}`;
    return MonthKsrq;
  };

  // 获取历史播放数据
  public getPlayData = async (days?: number, date?: string[]): Promise<void> => {
    let startDate = '';
    let endDate = '';
    if (date) {
      // eslint-disable-next-line prefer-destructuring
      startDate = date[0];
      // eslint-disable-next-line prefer-destructuring
      endDate = date[1];
    }
    if (days === 30) {
      startDate = this.getDate(29);
      endDate = this.getDate(0);
      this.playChartDate[0] = startDate;
      this.playChartDate[1] = endDate;
    }
    if (days === 7) {
      startDate = this.getDate(6);
      endDate = this.getDate(0);
      this.playChartDate[0] = startDate;
      this.playChartDate[1] = endDate;
    }

    try {
      const data = await this.AdvertisementUseCase.getStatisticsPlayHistory(
        this.unitId,
        this.storeId,
        startDate,
        endDate,
      );
      runInAction(() => {
        const sumArr: number[] = [];
        const pictureNumArr: number[] = [];
        const videoNumArr: number[] = [];

        data?.map((item) => {
          sumArr.push(item.sum || 0);
          pictureNumArr.push(item.pictureNum || 0);
          videoNumArr.push(item.videoNum || 0);
        });
        this.hisSumArr = sumArr;
        this.hisPictureNumArr = pictureNumArr;
        this.hisVideoNumArr = videoNumArr;

        if (this.playChartType === 'line') {
          this.playOptions.series = [
            {
              name: '总数',
              type: 'line',
              data: sumArr,
              smooth: true,
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
            {
              name: '视频',
              type: 'line',
              data: videoNumArr,
              symbolSize: 0,
              showSymbol: false,
              lineStyle: {
                width: 0,
                color: 'rgba(0,0,0,0)',
              },
            },
            {
              name: '图片',
              type: 'line',
              data: pictureNumArr,
              symbolSize: 0,
              showSymbol: false,
              lineStyle: {
                width: 0,
                color: 'rgba(0,0,0,0)',
              },
            },
          ];
        } else {
          this.playOptions.series = [
            {
              name: '总数',
              type: 'bar',
              data: this.hisSumArr,
              barWidth: 16,
              itemStyle: {
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
              },
            },
            {
              name: '视频',
              type: 'bar',
              data: this.hisVideoNumArr,
              barWidth: 0,
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
            },
            {
              name: '图片',
              type: 'bar',
              data: this.hisPictureNumArr,
              barWidth: 0,
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
            },
          ];
        }
        (this.playOptions.tooltip as ECOptions).formatter =
          '{b}<br/></span>历史播放总数：{c}次<br/></span>视频播放数：{c1}次<br/></span>图片播放数：{c2}次';
        // (this.playOptions.series as LineSeriesOption).data = data.map((element) => {
        //   return element.sum || 0;
        // });
        if (this.playOptions.xAxis) {
          (this.playOptions.xAxis as LineSeriesOption).data = data.map((element) => {
            return element.name || '';
          });
        }
        if (this.playOptions.yAxis) {
          (this.playOptions.yAxis as ECOptions) = {
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#e9e9e9',
              },
            },
            minInterval: 1,
          };
        }
        this.playOptions = { ...this.playOptions };
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 获取历史任务数据
  public getTaskData = async (days?: number, date?: string[]): Promise<void> => {
    let startDate = '';
    let endDate = '';
    if (date) {
      // eslint-disable-next-line prefer-destructuring
      startDate = date[0];
      // eslint-disable-next-line prefer-destructuring
      endDate = date[1];
    }
    if (days === 30) {
      startDate = this.getDate(29);
      endDate = this.getDate(0);
      this.taskChartDate[0] = startDate;
      this.taskChartDate[1] = endDate;
    }

    if (days === 7) {
      startDate = this.getDate(6);
      endDate = this.getDate(0);
      this.taskChartDate[0] = startDate;
      this.taskChartDate[1] = endDate;
    }
    try {
      const data = await this.AdvertisementUseCase.getStatisticsTaskHistory(
        this.unitId,
        this.storeId,
        startDate,
        endDate,
      );
      runInAction(() => {
        (this.taskOptions.series as LineSeriesOption).data = data.map((element) => {
          return element.sum || 0;
        });
        if (this.taskOptions.xAxis) {
          (this.taskOptions.xAxis as LineSeriesOption).data = data.map((element) => {
            return element.name || '';
          });
        }
        if (this.taskOptions.yAxis) {
          (this.taskOptions.yAxis as ECOptions) = {
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#e9e9e9',
              },
            },
          };
        }
        this.taskOptions = { ...this.taskOptions };
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 今日播放、历史播放、历史任务options
  public setTaskOptions = (options: ECOptions, type: string): void => {
    if (type === 'todayPlay') {
      // Object.assign(this.todayPlayOptions, { ...options });
    } else if (type === 'play') {
      // Object.assign(this.playOptions, { ...options });
    } else if (type === 'task') {
      // Object.assign(this.taskOptions, { ...options });
    }
  };

  // 今日播放、历史播放、历史任务图表类型
  public taskChartTypeChange = (e: RadioChangeEvent, type: string): void => {
    if (type === 'todayPlay') {
      this.todayPlayChartType = (e.target as HTMLInputElement).value as trendChartTypeConfig;
      const hours = moment().hours() === 0 ? 24 : moment().hours();
      if (this.todayPlayChartType === 'line') {
        this.todayPlayOptions.series = [
          {
            name: '总数',
            type: 'line',
            data: this.sumArr.slice(0, hours),
            smooth: true,
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
          {
            name: '视频',
            type: 'line',
            data: this.videoNumArr.slice(0, hours),
            symbolSize: 0,
            showSymbol: false,
            lineStyle: {
              width: 0,
              color: 'rgba(0,0,0,0)',
            },
          },
          {
            name: '图片',
            type: 'line',
            data: this.pictureNumArr.slice(0, hours),
            symbolSize: 0,
            showSymbol: false,
            lineStyle: {
              width: 0,
              color: 'rgba(0,0,0,0)',
            },
          },
        ];
        (this.todayPlayOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
          minInterval: 1,
        };
      }
      if (this.todayPlayChartType === 'bar') {
        this.todayPlayOptions.series = [
          {
            name: '总数',
            type: 'bar',
            data: this.sumArr.slice(0, hours),
            barWidth: 16,
            itemStyle: {
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
            },
          },
          {
            name: '视频',
            type: 'bar',
            data: this.videoNumArr.slice(0, hours),
            barWidth: 0,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
            },
          },
          {
            name: '图片',
            type: 'bar',
            data: this.pictureNumArr.slice(0, hours),
            barWidth: 0,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
            },
          },
        ];
        (this.todayPlayOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
          minInterval: 1,
        };
      }
      this.setTaskOptions(this.todayPlayOptions, 'todayPlay');
    } else if (type === 'play') {
      this.playChartType = (e.target as HTMLInputElement).value as trendChartTypeConfig;
      if (this.playChartType === 'line') {
        this.playOptions.series = [
          {
            name: '总数',
            type: 'line',
            data: this.hisSumArr,
            smooth: true,
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
          {
            name: '视频',
            type: 'line',
            data: this.hisVideoNumArr,
            symbolSize: 0,
            showSymbol: false,
            lineStyle: {
              width: 0,
              color: 'rgba(0,0,0,0)',
            },
          },
          {
            name: '图片',
            type: 'line',
            data: this.hisPictureNumArr,
            symbolSize: 0,
            showSymbol: false,
            lineStyle: {
              width: 0,
              color: 'rgba(0,0,0,0)',
            },
          },
        ];
        (this.playOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
          minInterval: 1,
        };
      }
      if (this.playChartType === 'bar') {
        this.playOptions.series = [
          {
            name: '总数',
            type: 'bar',
            barGap: '-100%',
            data: this.hisSumArr,
            barWidth: 16,
            itemStyle: {
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
            },
          },
          {
            name: '视频',
            type: 'bar',
            barGap: '-100%',
            data: this.hisVideoNumArr,
            barWidth: 16,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
            },
          },
          {
            name: '图片',
            type: 'bar',
            barGap: '-100%',
            data: this.hisPictureNumArr,
            barWidth: 16,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
            },
          },
        ];
        (this.playOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
          minInterval: 1,
        };
      }
      this.setTaskOptions(this.playOptions, 'play');
    } else if (type === 'task') {
      this.taskChartType = (e.target as HTMLInputElement).value as trendChartTypeConfig;

      if (this.taskChartType === 'line') {
        (this.taskOptions.series as LineSeriesOption).type = 'line';
        (this.taskOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
      }
      if (this.taskChartType === 'bar') {
        (this.taskOptions.series as BarSeriesOption).type = 'bar';
        (this.taskOptions.series as BarSeriesOption).barWidth = 16;
        (this.taskOptions.yAxis as ECOptions) = {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e9e9e9',
            },
          },
        };
        (this.taskOptions.series as BarSeriesOption).itemStyle = {
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
      this.setTaskOptions(this.taskOptions, 'task');
    }
  };

  // 历史播放、历史任务天数选择
  public taskChartTimeChange = (e: RadioChangeEvent, type: string): void => {
    if (type === 'play') {
      this.getPlayData(e.target.value, undefined);
      this.playChartTime = e.target.value;
    } else if (type === 'task') {
      this.getTaskData(e.target.value, undefined);
      this.taskChartTime = e.target.value;
    }
  };

  // 历史播放、历史任务日期选择
  public taskTimeScreen = (
    dates: RangeValue<Moment>,
    dateStrings: string[],
    type: string,
  ): void => {
    if (type === 'play') {
      this.getPlayData(undefined, dateStrings);
      this.playChartDate = dateStrings;
      if (dateStrings[0]) {
        this.playChartTime = 0;
      } else {
        this.playChartTime = 30;
        this.getPlayData(30, undefined);
      }
    } else if (type === 'task') {
      this.getTaskData(undefined, dateStrings);
      this.taskChartDate = dateStrings;
      if (dateStrings[0]) {
        this.taskChartTime = 0;
      } else {
        this.taskChartTime = 30;
        this.getTaskData(30, undefined);
      }
    }
  };

  // 获取在线/离线设备及在线率
  public getDeviceOnlineStatus = async (): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getWeekStatistics(this.unitId, this.storeId);
      runInAction(() => {
        this.advertisementData = data;
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
}
