/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: tongyuqiang
 * @Date: 2021-11-30 15:14:52
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-18 18:17:06
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Image, Tooltip } from 'antd';
import style from './style.less';

import { UploadType } from '../../../common/config/commonConfig';
import mediaShadow from '../../../assets/images/media_shadow.svg';
import clockIcon from '../../../assets/images/clock_icon.svg';

interface ThumbnailProps {
  type: UploadType.JPG | UploadType.PNG | UploadType.MP4 | string;
  // 传入组件根标签的classname
  className?: string;
  // 图片/视频地址
  sourceSrc?: string;
  // 标题
  title?: string;
  // 分辨率
  resolution?: string;
  // 时间
  interval?: string;
  // 视频预览点击事件
  onPreview?(): void;
}
interface ThumbnailState {}

@observer
export default class Thumbnail extends React.Component<ThumbnailProps, ThumbnailState> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(props: ThumbnailProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { type, className, sourceSrc, title, interval, resolution, onPreview } = this.props;
    return (
      <div className={`${style.thumbnailContainer} ${className}`}>
        {type === UploadType.MP4 ? (
          <div
            className={style.videoContainer}
            onClick={onPreview ? (): void => onPreview() : undefined}
          >
            <video preload="metadata" className={style.video}>
              <source src={sourceSrc} type="video/mp4" />
              {/* <source src={sourceSrc} type="video/webm" /> */}
            </video>
            <Tooltip placement="top" title={title}>
              <div className={style.titlePosition}>{this.generateTitle(title || '')}</div>
            </Tooltip>
            <div className={style.resolutionPosition}>{resolution}</div>
            <div className={style.timeStrPosition}>
              <img src={clockIcon} alt="" />
              {interval}
            </div>
            <img className={style.videoShadow} src={mediaShadow} alt="" />
          </div>
        ) : (
          <div
            className={style.imageContainer}
            onClick={onPreview ? (): void => onPreview() : undefined}
          >
            <Image className={style.img} src={sourceSrc} preview={false} />
            <Tooltip placement="top" title={title}>
              <div className={style.titlePosition}>{this.generateTitle(title || '')}</div>
            </Tooltip>
            <div className={style.resolutionPosition}>{resolution}</div>
            <div className={style.timeStrPosition}>
              <img src={clockIcon} alt="" />
              {interval}
            </div>
            <img className={style.imageShadow} src={mediaShadow} alt="" />
          </div>
        )}
      </div>
    );
  }

  private generateTitle = (title: string): string => {
    if (!title) {
      return title;
    }
    let strLength = 0;// 字符串字节长度
    let maxLength = 0;// 最大长度处的索引
    title.split('').map((item: string, index: number): string => {
      const data = item.charCodeAt(0);
      if (data > 255) {
        strLength += 2;
      } else {
        strLength += 1;
      }
      if (strLength <= 25) {
        maxLength = index
      }
      return item;
    });
    if (strLength > 29) {
      const res = title.slice(0, maxLength);
      return `${res}....${title.slice(title.length - 3)}`;
    }
      return title;
  };
}
