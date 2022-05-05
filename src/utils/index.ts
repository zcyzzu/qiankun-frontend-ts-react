/*
 * @Author: liyou
 * @Date: 2021-06-29 18:11:14
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:46:49
 */

import moment from "moment";
import { message } from "antd";
import { AntMessageProps } from "../common/config/commonConfig";
// import TemplatePageViewModel from '../presenters/contentManagement/templatePage/ViewModel';
// import MaterialPageViewModel from '../presenters/contentManagement/materialPage/ViewModel';

const utils = {
  // 获取cookie
  getCookie(name: string): string | null {
    const nameLenPlus = name.length + 1;
    return (
      document.cookie
        .split(";")
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
      getContainer: () => document.getElementById("root-container-element")!,
    });
    message.open({
      content: config.content,
      type: config.type,
      duration: 2,
      className: "global-ant-message",
    });
  },

  // 获取视频第一帧图片
  async getFramesUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.width = 306;
      video.height = 204;
      video.setAttribute("crossOrigin", "Anonymous");
      video.setAttribute("controls", "controls");
      video.setAttribute("autoplay", "autoplay");
      video.volume = 0;
      video.setAttribute("src", url); // 视频的链接
      video.addEventListener("loadeddata", () => {
        // 创建canvas画布
        const canvas = document.createElement("canvas");
        canvas.width = video.width; // 设置画布的长宽也就是图片的长宽
        canvas.height = video.height;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();
        resolve(dataUrl);
      });
    });
  },

  // base64 转 blob
  baseToBlob(baseData: string): Blob {
    let byteString;
    if (baseData.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(baseData.split(",")[1]);
    } else {
      byteString = unescape(baseData.split(",")[1]);
    }
    const mimeString = baseData
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
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
};
export default utils;
