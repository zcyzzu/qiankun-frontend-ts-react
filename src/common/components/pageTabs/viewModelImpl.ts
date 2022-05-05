/*
 * @Author: liyou
 * @Date: 2021-06-25 15:34:32
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2021-11-18 18:11:24
 */
import { injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import PageTabsViewModel, { PageTabsItemConfig } from './viewModel';

@injectable()
export default class PageTabsViewModelImpl implements PageTabsViewModel {
  public tabs: PageTabsItemConfig[];

  public constructor() {
    this.tabs = [];

    makeObservable(this, {
      tabs: observable,
      setTabs: action,
      tabClose: action,
    });
  }

  public setTabs = (item: PageTabsItemConfig): void => {
    const tabIndex = this.tabs.findIndex((tabItem) => tabItem.path === item.path);
    if (tabIndex === -1) {
      this.tabs = [...this.tabs, item];
    }
  };

  public tabClose = (index: number): void => {
    this.tabs.splice(index, 1);
  };
}
