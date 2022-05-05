/*
 * @Author: zhangchenyang
 * @Date: 2021-09-30 16:04:56
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-14 17:32:03
 */
import * as echarts from 'echarts/core';

// 饼图
export const pie = {
  title: {
    text: '',
    subtext: '',
    textStyle: {
      width: 64,
      height: 22,
      lineHeight: 22,
    },
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(30, 37, 45, 1)',
    borderWidth: 0,
    textStyle: {
      color: '#fff',
    },
    // formatter:
    //'{b}<br/><span style="display:inline-block;position:relative; to
    //p:-3px;margin-right:5px;border-radius:10px;width:5px;height:
    //;background-color:#4096FF"></span>{c}台',
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    top: 'middle',
    right: '4%',
    icon: 'circle',
  },
  color: [
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
          color: '#4096FF',
        },
        {
          offset: 1,
          color: '#70B1FF',
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
          color: '#21E2EE',
        },
        {
          offset: 1,
          color: '#8AF8FF',
        },
      ],
      global: false,
    },
  ],
  series: {
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['35%', '50%'],
    data: [],
    label: {
      show: false,
    },
    itemStyle: {
      shadowBlur: 8,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowColor: 'rgba(30, 171, 180, 0.3)',
    },
  },
};
// 垂直条形图
export const vertical_bar = {
  // color: ['#4096FF'],
  title: {
    text: '',
    subtext: '',
    textStyle: '',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(30, 37, 45, 1)',
    borderWidth: 0,
    textStyle: {
      color: '#fff',
    },
  },
  color: [
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
          color: '#70B1FF',
        },
        {
          offset: 1,
          color: '#4096FF',
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
          color: '#8AF8FF',
        },
        {
          offset: 1,
          color: '#21E2EE',
        },
      ],
      global: false,
    },
  ],
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      color: '#666666',
      rotate: 40,
    },
    axisLine: {
      lineStyle: {
        color: '#E9E9E9', //左边线的颜色
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
      },
    },
    minInterval: 1,
    min: 0,
  },
  series:
    {
      data: [],
      type: 'bar',
      barWidth: 16,
      itemStyle: {
        // shadowBlur: 10,
        // shadowColor: 'rgba(64, 150, 255, 0.5)',
        borderRadius: 2,
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
    } || [],
  grid: {
    top: '30',
    left: '24',
    right: '24',
    bottom: '24',
    containLabel: true,
  },
  legend: {
    type: 'scroll',
    bottom: 0,
    icon: 'circle',
  },
};
// 水平条形图
export const horizontal_bar = {
  color: '#4096FF',
  xAxis: {
    show: false,
  },
  yAxis: {
    type: 'category',
    data: [],
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#F1F8FF', //左边线的颜色
      },
    },
    axisLabel: {
      color: '#666666', //坐标值得具体的颜色
    },
  },
  series: {
    type: 'bar',
    data: [],
    showBackground: true,
    backgroundStyle: {
      color: 'rgba(64, 150, 255, 0.08)',
      borderRadius: 2,
    },
    barWidth: 12,
    itemStyle: {
      shadowBlur: 8,
      shadowColor: 'rgba(64, 150, 255, 0.2)',
      shadowOffsetX: 0,
      shadowOffsetY: 6,
      borderRadius: 2,
      color: {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#4096ff',
          },
          {
            offset: 1,
            color: '#85CEFF',
          },
        ],
        global: false,
      },
    },
  },
  title: {
    text: '',
    subtext: '',
    textStyle: {
      width: 64,
      height: 22,
      // fontSize: 16,
      // fontFamily: 'PingFangSC-Regular, PingFang SC',
      // fontWeight: 400,
      // color: '#333333',
      lineHeight: 22,
    },
  },
  grid: {
    top: '47px',
    left: '24px',
    right: '24px',
    bottom: '24px',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: 'rgba(30, 37, 45, 1)',
    borderWidth: 0,
    textStyle: {
      color: '#fff',
    },
    formatter:
      '{b}<br/><span style="display:inline-block;position:relative; top:-3px;margin-right:5px;border-radius:10px;width:5px;height:5px;background-color:#4096FF"></span>{c}人',
  },
  itemStyle: {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#ff7500' },
      { offset: 0.5, color: '#188df0' },
      { offset: 1, color: '#188df0' },
    ]),
  },
};
// 折线图
export const line = {
  color: ['#4096FF'],
  title: {
    text: '',
    subtext: '',
    textStyle: '',
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 40,
      color: '#666666',
    },
    axisTick: {
      // show: false,
      alignWithLabel: true,
      lineStyle: {
        color: '#E9E9E9',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#E9E9E9',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {},
    minInterval: 1,
    min: 0,
  },
  series: {
    data: [],
    type: 'line',
    smooth: 0.6,
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
            color: 'rgba(64,150,255,1)',
          },
          {
            offset: 1,
            color: 'rgba(127,113,255,0)',
          },
        ],
        global: false,
      },
    },
  },
  grid: {
    top: '30',
    left: '24',
    right: '24',
    bottom: '24',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(30, 37, 45, 1)',
    borderWidth: 0,
    textStyle: {
      color: '#fff',
    },
  },
};

// 饼图阴影列表
export const barOptionsShadow = [
  'rgba(69, 54, 204, .4)',
  'rgba(35, 114, 210, .3)',
  'rgba(30, 171, 180, .3)',
]
