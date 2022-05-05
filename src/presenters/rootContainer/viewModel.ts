/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2021-11-18 18:14:22
 */

import { MenuEntity } from '../../domain/entities/menuEntities';
import { UserInfoEntity } from '../../domain/entities/userEntities';

export default interface RootContainerViewModel {
  // 菜单数据
  menuData: MenuEntity[];
  // 侧边栏收起展开状态
  collapsed: boolean;
  // 获取菜单数据
  requestMenuData(lang: string, roldId: number, unionLabel: boolean): void;
  // 设置collapsed
  setCollapsed(isCollapsed: boolean): void;
  // 用户信息
  userInfo: UserInfoEntity;
  // 获取用户信息
  requestUserInfo(): void;
  // loading状态
  isLoading: boolean;
  // 发起的loading数量
  loadingCount: number;
  // 设置loading状态
  setLoading(isLoading: boolean): void;
  // 路由是否可以开始加载
  routeLoad: boolean;
}
