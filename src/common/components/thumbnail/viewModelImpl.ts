/*
 * @Author: tongyuqiang
 * @Date: 2021-11-30 15:21:34
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-11-30 15:25:27
 */
import { injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
import ThumbnailViewModel from './viewModel';
// import style from './style.less';

@injectable()
export default class ThumbnailViewModelImpl implements ThumbnailViewModel {
  public str: string;

  public constructor() {
    this.str = '11';
    makeObservable(this, {
      str: observable,
    });
  }
}
