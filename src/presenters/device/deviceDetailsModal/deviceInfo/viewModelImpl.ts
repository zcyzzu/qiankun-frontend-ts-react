/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:52
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-11-26 15:17:35
 */
import { injectable } from 'inversify';
import {  makeObservable, observable } from 'mobx';
import DeviceInfoViewModel from './viewModel';

@injectable()
export default class DeviceInfoViewModelImpl implements DeviceInfoViewModel {
  public data: [];

  public constructor() {
    this.data = [];
    makeObservable(this, {
      data: observable,
    });
  }
}
