/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:16:47
 */
import { inject, injectable } from 'inversify';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { ROOT_CONTAINER_IDENTIFIER, USER_IDENTIFIER } from '../../constants/identifiers';
import RootContainerViewModel from './viewModel';
import RootContainerUseCase from '../../domain/useCases/rootContainerUseCase';
import UserUseCase from '../../domain/useCases/userUseCase';
import { MenuEntity } from '../../domain/entities/menuEntities';
import { UserInfoEntity } from '../../domain/entities/userEntities';
import utils from '../../utils';

@injectable()
export default class RootContainerViewModelImpl implements RootContainerViewModel {
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;
  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  public menuData: MenuEntity[];
  public collapsed: boolean;
  public userInfo: UserInfoEntity;
  public isLoading: boolean;
  public loadingCount: number;
  public routeLoad: boolean;

  public constructor() {
    const tokenStatic = 'bearer 7e09793f-85aa-4510-8e61-984a6fbeee3e';
    const tokenFromCookie = utils.getCookie('access_token');
    if (tokenFromCookie) {
      window.authorization = `${utils.getCookie('token_type')} ${tokenFromCookie}`;
    } else {
      window.authorization = tokenStatic;
      console.warn(`set static token '${tokenStatic}'. make sure current is local develop env.`);
    }
    this.menuData = [];
    this.collapsed = false;
    this.userInfo = {};
    this.isLoading = false;
    this.loadingCount = 0;
    this.routeLoad = false;

    makeObservable(this, {
      menuData: observable,
      collapsed: observable,
      userInfo: observable,
      isLoading: observable,
      routeLoad: observable,
      requestMenuData: action,
      setCollapsed: action,
      requestUserInfo: action,
      setLoading: action,
    });
  }

  public requestMenuData = async (
    lang: string,
    roldId: number,
    unionLabel: boolean,
  ): Promise<void> => {
    try {
      await this.rootContainerUseCase.getMenuResponse(lang, roldId, unionLabel);
      runInAction(() => {
        this.menuData = [...this.rootContainerUseCase.menuData];
      });
    } catch (e) {
      runInAction(() => {
        this.menuData = [];
      });
    }
  };

  public requestUserInfo = async (): Promise<void> => {
    try {
      await this.userUseCase.getUserInfo();
      runInAction(() => {
        this.userInfo = { ...this.userUseCase.userInfo };
        this.requestMenuData('zh_CN', this.userInfo.currentRoleId || 0, false);
        this.routeLoad = true;
      });
      this.routeLoad = true;
    } catch (e) {
      runInAction(() => {
        this.userInfo = {};
        this.routeLoad = false;
      });
    }
  };

  public setCollapsed = (isCollapsed: boolean): void => {
    this.collapsed = isCollapsed;
  };

  public setLoading = (loading: boolean): void => {
    if (loading) {
      this.loadingCount += 1;
      this.isLoading = true;
    } else {
      this.loadingCount -= 1;
      if (this.loadingCount < 0) {
        return;
      }
      if (this.loadingCount === 0) {
        this.isLoading = false;
      }
    }
  };
}
