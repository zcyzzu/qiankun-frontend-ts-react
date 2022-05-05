/*
 * @Author: liyou
 * @Date: 2021-06-29 18:11:14
 * @LastEditors: liyou
 * @LastEditTime: 2022-04-21 12:21:21
 */

import moment from 'moment';
import { message } from 'antd';
import { AntMessageProps } from '../common/config/commonConfig';
// import TemplatePageViewModel from '../presenters/contentManagement/templatePage/ViewModel';
// import MaterialPageViewModel from '../presenters/contentManagement/materialPage/ViewModel';

const utils = {
  // 获取cookie
  getCookie(name: string): string | null {
    const nameLenPlus = name.length + 1;
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => {
          return cookie.substring(0, nameLenPlus) === `${name}=`;
        })
        .map((cookie) => {
          return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || null
    );
  },
  // 全局提示框
  globalMessge(config: AntMessageProps): void {
    message.config({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getContainer: () => document.getElementById('root-container-element')!,
    });
    message.open({
      content: config.content,
      type: config.type,
      duration: 2,
      className: 'global-ant-message',
    });
  },
  async getFramesUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.width = 306;
      video.height = 204;
      video.setAttribute('crossOrigin', 'Anonymous');
      video.setAttribute('controls', 'controls');
      video.setAttribute('autoplay', 'autoplay');
      video.volume = 0;
      video.setAttribute('src', url); // 视频的链接
      video.addEventListener('loadeddata', () => {
        // 创建canvas画布
        const canvas = document.createElement('canvas');
        canvas.width = video.width; // 设置画布的长宽也就是图片的长宽
        canvas.height = video.height;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();
        resolve(dataUrl);
      });
    });
  },

  baseToBlob(baseData: string): Blob {
    let byteString;
    if (baseData.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(baseData.split(',')[1]);
    } else {
      byteString = unescape(baseData.split(',')[1]);
    }
    const mimeString = baseData
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const ia = new Uint8Array(byteString.length);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString,
    });
  },

  // 秒转时分秒
  transferTime(s: number): string {
    const d = moment.duration(s * 1000);
    const hours = Math.floor(d.asHours());
    const minutes = Math.floor(d.asMinutes()) - hours * 60;
    const seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - minutes * 60;
    return `${hours}小时${minutes}分钟${seconds}秒`;
  },

  // /**
  //  * @description 瀑布流布局
  //  * @param items dom元素组成的数组
  //  * @param containerWidth 容器的宽度
  //  * @param itemWidth 单个元素的宽度
  //  * @param horizontalGap 水平间隙
  //  * @param verticalGap 垂直间隙
  //  * @param viewModel 传入的viewModel
  //  */
  // waterFall(
  //   items: HTMLElement[],
  //   containerWidth: number,
  //   itemWidth: number,
  //   horizontalGap: number,
  //   verticalGap: number,
  //   viewModel: TemplatePageViewModel | MaterialPageViewModel,
  // ): void {
  //   if (!items || !items.length) {
  //     return;
  //   }
  //   const { setMaxHeight } = viewModel;
  //   // 首先确定列数 = 容器的宽度 / 单个元素的宽度
  //   // eslint-disable-next-line radix
  //   const columns = parseInt(String(containerWidth / (itemWidth + horizontalGap)));
  //   // 定义一个数组，用来存储每列的高度
  //   const arr: number[] = [];
  //   // 定义一个数组，用来存储每个元素的高度
  //   const heightArr: number[] = [];
  //   for (let i = 0; i < items.length; i += 1) {
  //     // 满足这个条件则说明在第一行，文章里面有提到
  //     if (i < columns) {
  //       // eslint-disable-next-line no-param-reassign
  //       (items[i] as HTMLElement).style.top = '0px';
  //       // eslint-disable-next-line no-param-reassign
  //       (items[i] as HTMLElement).style.left = `${(itemWidth + horizontalGap) * i}px`;
  //       arr.push((items[i] as HTMLElement).offsetHeight);
  //       heightArr.push((items[i] as HTMLElement).offsetHeight);
  //     } else {
  //       // 其他行，先找出最小高度列的索引
  //       const min = Math.min(...arr);
  //       const index = arr.indexOf(min);
  //       // 设置下一行的第一个盒子的位置
  //       // top值就是最小列的高度+gap
  //       // eslint-disable-next-line no-param-reassign
  //       (items[i] as HTMLElement).style.top = `${arr[index] + verticalGap}px`;
  //       // eslint-disable-next-line no-param-reassign
  //       (items[i] as HTMLElement).style.left = `${(items[index] as HTMLElement).offsetLeft}px`;
  //       heightArr.push(arr[index] + verticalGap + (items[i] as HTMLElement).offsetHeight);
  //       // 修改最小列的高度
  //       // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
  //       arr[index] = arr[index] + (items[i] as HTMLElement).offsetHeight + verticalGap;
  //     }
  //   }
  //   setMaxHeight(Math.max.apply(null, heightArr));
  // },
};
export default utils;
