/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 19:40:15
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:44:50
 */
import React from 'react';
import { observer } from 'mobx-react';
import style from './style.less';

import { NoticeRollSpeed } from './noticePreviewType';

interface NoticePreviewPropsConfig {
  // 字体颜色
  fontColor?: string;
  // 背景颜色
  bgColor?: string;
  // 内容描述
  content: string;
  // 播放速度
  speed?: string;
  // 背景透明度
  opacity?: number;
}
interface NoticePreviewProps {
  noticePreviewProps: NoticePreviewPropsConfig;
}

@observer
export default class NoticePreview extends React.Component<NoticePreviewProps> {
  private renderPropsBgStyle = (value: NoticePreviewPropsConfig): {} => {
    let opacityValue = 0;
    if (value.opacity) {
      opacityValue = value?.opacity / 100;
    }
    return {
      backgroundColor: value?.bgColor || '#4096ff',
      color: value?.fontColor || '#fff',
      opacity: opacityValue || 1,
    };
  };
  private renderPropsFontStyle = (value: NoticePreviewPropsConfig): {} => {
    return {
      color: value?.fontColor,
      animationDuration: `${this.contentSpeed()}s`,
      '--form-width': `${this.byteLength(value.content)}px`,
      '--form-left': `${-this.byteLength(value.content)}px`,
    };
  };

  // 计算滚动速度
  private contentSpeed = (): number => {
    const {
      noticePreviewProps: { speed, content },
    } = this.props;
    switch (speed) {
      case NoticeRollSpeed.FAST:
        return this.byteLength(content) / 56;
      case NoticeRollSpeed.NORMLAL:
        return this.byteLength(content) / 36;
      case NoticeRollSpeed.SLOW:
        return this.byteLength(content) / 22;
      default:
        return this.byteLength(content) / 36;
    }
  };

  // 计算滚动文字width
  private byteLength = (str: string): number => {
    let length = 0;
    str.split('').map((char) => {
      if (char.charCodeAt(0) > 255) {
        length += 2;
      } else {
        length += 1;
      }
      return char;
    });
    if (length * 17 <= 390) {
      return 390;
    }
    return length * 17;
  };

  // 设置/取消动画样式
  private addAnimate = (): void => {
    const dom = document.querySelector('#animate');
    if (dom) {
      dom.classList.remove(style.animate);
      setTimeout(() => {
        dom.classList.add(style.animate);
      }, 0);
    }
  };

  public render(): JSX.Element {
    const { noticePreviewProps } = this.props;
    this.addAnimate();
    return (
      <div className={style.noticePreviewContainer}>
        <div style={this.renderPropsBgStyle(noticePreviewProps)} className={style.bgWrapper} />
        <div
          id="animate"
          className={`${style.remarksWrapper} ${style.animate}`}
          style={this.renderPropsFontStyle(noticePreviewProps)}
        >
          <div className={style.tips}>{noticePreviewProps?.content}</div>
          <div>{noticePreviewProps?.content}</div>
        </div>
      </div>
    );
  }
}
