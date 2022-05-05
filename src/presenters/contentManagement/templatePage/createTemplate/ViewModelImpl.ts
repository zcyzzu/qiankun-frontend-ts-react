/*
 * @Author: wuhao
 * @Date: 2021-09-22 11:00:03
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-29 10:11:26
 */
import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import { message } from 'antd';
import CreateTemplateViewModel from './ViewModel';
import history from '../../../../history';

@injectable()
export default class CreateTemplateViewModelImpl implements CreateTemplateViewModel {
  public visible: boolean = false;
  public width: number = 1920;
  public height: number = 1080;
  public constructor() {
    makeObservable(this, {
      visible: observable,
      width: observable,
      height: observable,
      setIsVisible: action,
      changeValue: action,
      onWidthChange: action,
      onHeightChange: action,
      openEditor: action,
      onWidthLock: action,
      onHeightLock: action,
    });
  }
  public setIsVisible = (val: boolean): void => {
    this.visible = val;
  };
  public changeValue = (width: number, height: number): void => {
    this.width = width;
    this.height = height;
  };
  public onWidthChange = (width: number): void => {
    this.width = width;
  };
  public onHeightChange = (height: number): void => {
    this.height = height;
  };
  public openEditor = (): void => {
    if (this.width < 20 || this.height < 20) {
      message.error('最小尺寸为20px X 20px，请重新设置');
      return;
    }
    if (this.width > 5000 || this.height > 5000) {
      message.error('超出尺寸上限：5000px X 5000px，请重新设置');
      return;
    }
    history.push(`/design/editor?width=${this.width}&height=${this.height}`);
    // const url = `https://tmis.timework.cn/design/editor?width=${this.width}&height=${this.height}`;
    // const a = window.document.createElement('a');
    // a.setAttribute('href', url);
    // a.setAttribute('target', '_blank');
    // a.setAttribute('id', url);
    // // 防止反复添加
    // if (!window.document.getElementById(url)) {
    //   window.document.body.appendChild(a);
    // }
    // a.click();
    this.setIsVisible(false);
  };
  public onWidthLock = (): void => {
    this.height = 2 * this.width;
  };
  public onHeightLock = (): void => {
    if (this.height % 2 !== 0) {
      this.height += 1;
    }
    this.width = this.height / 2;
  };
}
