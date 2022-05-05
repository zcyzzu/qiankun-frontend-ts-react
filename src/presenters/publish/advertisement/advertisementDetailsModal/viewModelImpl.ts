/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-01-13 10:46:48
 */
import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import AdvertisementDetailsModalViewModel from './viewModel';

@injectable()
export default class AdvertisementDetailsModalViewModelImpl
  implements AdvertisementDetailsModalViewModel {
  // 查看设备弹窗状态
  public advertDetailsVisible: boolean;
  public currentTab: string;
  public name: string;
  public constructor() {
    this.advertDetailsVisible = false;
    this.currentTab = '1';
    this.name = '';
    makeObservable(this, {
      advertDetailsVisible: observable,
      currentTab: observable,
      setAdvertDetailsVisible: action,
    });
  }

  //设置标签model显示隐藏以及新增还是修改详情
  public setAdvertDetailsVisible = (tab?: string, name?: string): void => {
    this.currentTab = tab || '1';
    this.name = name || '广告设备';
    this.advertDetailsVisible = !this.advertDetailsVisible;
  };
}
