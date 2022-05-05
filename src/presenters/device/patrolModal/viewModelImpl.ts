/* eslint-disable func-names */
/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-21 14:08:13
 */
import _ from 'lodash';
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { LineSeriesOption } from 'echarts/charts';
import PatrolModalViewModel from './viewModel';
import { ECOptions } from '../../../utils/echartsOptionsType';
import { line } from '../../../common/config/echartsConfig';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import { PatrolEntity } from '../../../domain/entities/deviceEntities';

@injectable()
export default class PatrolModalViewModelImpl implements PatrolModalViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private DeviceUseCase!: DeviceUseCase;
  //标签弹窗状态
  public patrolModalVisible: boolean;
  //设备断网options
  public netWorkOptions: ECOptions;
  // 设备断网
  public patrolData: PatrolEntity;
  public deviceType: string;

  public constructor() {
    this.deviceType = '';
    this.patrolData = {};
    this.patrolModalVisible = false;
    this.netWorkOptions = _.cloneDeep(line as ECOptions);
    (this.netWorkOptions.tooltip as ECOptions).formatter =
      '{b}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>设备断网次数：{c}次';
    (this.netWorkOptions.title as ECOptions).text = '设备最近7天断网次数（次）';
    (this.netWorkOptions.xAxis as ECOptions).axisLabel = {
      interval: 0,
      rotate: 0,
      color: '#666666',
    };
    makeObservable(this, {
      patrolData: observable,
      // netWorkOptions: observable,
      patrolModalVisible: observable,
      deviceType: observable,
      setPatrolModalVisible: action,
    });
  }

  // 获取设备断网数据
  public getNetWorkData = async (id?: number): Promise<void> => {
    try {
      const data = await this.DeviceUseCase.getPatrol(id);
      runInAction(() => {
        this.patrolData = data;
        (this.netWorkOptions.series as LineSeriesOption).data = data.deviceStatisticsList?.map(
          (element) => {
            return element.value || 0;
          },
        );
        if (this.netWorkOptions.xAxis) {
          (this.netWorkOptions.xAxis as LineSeriesOption).data = data.deviceStatisticsList?.map(
            (element) => {
              return element.code || '';
            },
          );
        }

        (this.netWorkOptions.tooltip as ECOptions).formatter =
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          function(params: { data: number; axisValue: string; dataIndex: number }[]) {
            const str = '';
            console.log(params);
            // eslint-disable-next-line consistent-return
            if (params[0].data === -1) {
              return `${params[0].axisValue}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>设备无联网`;
            }

            if (params[0].data !== -1) {
              return `${params[0].axisValue}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>设备断网次数：${params[0].data}次`;
            }
            return str;
          };

        if (this.netWorkOptions.yAxis) {
          (this.netWorkOptions.yAxis as ECOptions) = {
            axisLabel: {
              // eslint-disable-next-line object-shorthand
              formatter: function(value: number): string {
                let texts: string = '';
                console.log(value)
                if (value === -1) {
                  texts = '无联网';
                } else {
                   texts = String(value)
                }
                return texts;
              },
            },

            minInterval: 1,
            inverse: false,
            type: 'value',
            min: -1,
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#e9e9e9',
              },
            },
          };
        }
        this.netWorkOptions = { ...this.netWorkOptions };
      });
    } catch (e) {
      console.log(e);
    }
  };

  //设置标签model显示隐藏
  public setPatrolModalVisible = (id?: number, deviceType?: string): void => {
    if (id) {
      this.getNetWorkData(id);
    }
    if (deviceType) {
      this.deviceType = deviceType;
    } else {
      this.patrolData = {};
      // this.netWorkOptions = _.cloneDeep(line as ECOptions);
    }
    this.patrolModalVisible = !this.patrolModalVisible;
  };
}
