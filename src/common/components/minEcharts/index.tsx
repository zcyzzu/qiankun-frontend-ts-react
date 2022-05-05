/*
 * @Author: liyou
 * @Date: 2021-06-10 20:09:09
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-10 14:08:11
 */
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {
  BarChart,
  LineChart,
  PieChart,
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption,
} from 'echarts/charts';
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ECOptions } from '../../../utils/echartsOptionsType';
import style from './style.less';
import dataEmpty from '../../../assets/images/data_empty.svg';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
]);

interface MinEchartsProps {
  options: ECOptions;
  boxShadow?: boolean;
}

const defaultProps: MinEchartsProps = {
  options: {},
  boxShadow: true,
};

const MinEcharts: React.FC<MinEchartsProps> = ({ options, boxShadow }: MinEchartsProps) => {
  const chartInstance = useRef<ReactEChartsCore>(null);

   // 序列化
  const serialization = (key: string, val: string): string => {
    if (typeof val === 'function') {
      return `${val}`;
    }
    return val;
  };

  // 反序列化
  const deserialization = (k: string, v: string): string => {
    if (v.indexOf && v.indexOf('function') > -1) {
      // eslint-disable-next-line no-eval
      return eval(`(function(){return ${v} })()`);
    }
    return v;
  };

  // 序列化函数
  const optionsValue = JSON.parse(
    JSON.stringify(options, (key, val) => serialization(key, val)),
    (k, v) => deserialization(k, v),
  );
  optionsValue.title.text = '';
  // string options
  const strOptions = JSON.stringify(optionsValue, (key, val) => serialization(key, val));

  // title
  const optionsD = JSON.parse(
    JSON.stringify(options, (key, val) => serialization(key, val)),
    (k, v) => deserialization(k, v),
  );
  const optionsTitle = optionsD.title.text;

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.getEchartsInstance().setOption(
        JSON.parse(strOptions, (k, v) => deserialization(k, v)),
        true,
      );
    }
  }, [strOptions]);

  const getOption = (): ECOptions => {
    return JSON.parse(strOptions, (k, v) => deserialization(k, v));
  };

  return (
    <div
      className={style.commonChartsContainer}
      style={{ boxShadow: boxShadow ? '0px 1px 4px 0px rgb(0 18 41 / 12%)' : '' }}
    >
      <div className={style.chartsTitle}>{optionsTitle}</div>
      {(options.series as LineSeriesOption | PieSeriesOption | BarSeriesOption).data?.length ===
      0 ? (
        <div className={style.dataEmpty}>
          <img src={dataEmpty} alt="" />
          <p>暂无数据</p>
        </div>
      ) : (
        <ReactEChartsCore ref={chartInstance} echarts={echarts} option={getOption()} />
      )}
    </div>
  );
};

MinEcharts.defaultProps = defaultProps;

export default MinEcharts;
