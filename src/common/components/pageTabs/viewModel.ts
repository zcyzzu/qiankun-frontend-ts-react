/*
 * @Author: liyou
 * @Date: 2021-06-25 15:34:22
 * @LastEditors: liyou
 * @LastEditTime: 2021-06-28 10:56:01
 */

export interface PageTabsItemConfig {
  title: string;
  path: string;
}

export default interface PageTabsViewModel {
  tabs: PageTabsItemConfig[];
  setTabs(tab: PageTabsItemConfig): void;
  tabClose(index: number): void;
}
