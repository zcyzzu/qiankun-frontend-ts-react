/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-12-17 17:00:17
 */
import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import NoticeDetailsModalViewModel from './viewModel';

@injectable()
export default class NoticeDetailsModalViewModelImpl implements NoticeDetailsModalViewModel {
  // 查看设备弹窗状态
  public noticeDetailsVisible: boolean;
  public currentTab: string;
  public constructor() {
    this.noticeDetailsVisible = false;
    this.currentTab = '1';
    makeObservable(this, {
      noticeDetailsVisible: observable,
      currentTab: observable,
      setNoticeDetailsVisible: action,
    });
  }

  //设置标签model显示隐藏以及新增还是修改详情
  public setNoticeDetailsVisible = (tab?: string): void => {
    this.currentTab = tab || '1';
    this.noticeDetailsVisible = !this.noticeDetailsVisible;
  };
}
