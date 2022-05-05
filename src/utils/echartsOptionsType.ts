/*
 * @Author: liyou
 * @Date: 2021-06-11 14:35:14
 * @LastEditors: liyou
 * @LastEditTime: 2021-06-11 14:36:46
 */
import * as echarts from 'echarts/core';
import { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts';
import {
  TitleComponentOption,
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components';

export type ECOptions = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | LegendComponentOption
  | TooltipComponentOption
>;
