/*
 * @Author: zhangchenyang
 * @Date: 2021-11-22 15:49:26
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-03-24 09:24:58
 */
import React from 'react';
import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, runInAction } from 'mobx';
import { Key } from 'rc-tree/lib/interface';
import OrganizationTreeViewModel, { TreeInfo } from './viewModel';
import {
  OrganizationListEntity,
  OrganizationTreeListEntity,
} from '../../../domain/entities/organizationEntities';
import StoreUseCase from '../../../domain/useCases/organizationUseCase';
import style from './style.less';

import { ORGANIZATION_TREE_IDENTIFIER } from '../../../constants/identifiers';
import storeTree from '../../../assets/images/store_tree_icon.svg';
import storeTreeSelected from '../../../assets/images/store_tree_selected_icon.svg';
import organizationTree from '../../../assets/images/organization_tree_icon.svg';
import organizationTreeSelected from '../../../assets/images/organization_tree_selected_icon.svg';

@injectable()
export default class OrganizationTreeViewModelImpl implements OrganizationTreeViewModel {
  @inject(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_USE_CASE)
  private storeUseCase!: StoreUseCase;

  public TreeData: OrganizationTreeListEntity[];
  public selectedStoreTreeData: OrganizationListEntity;
  public selectedOrgTreeData: OrganizationTreeListEntity;
  public expandedKeys: Key[];
  public autoExpandParent: boolean;
  public isStore: boolean;
  // 判断当前节点是否是第一个
  private isFirstElement: boolean;
  private treeOriginalData: OrganizationTreeListEntity[];
  public isOpen: boolean;

  public constructor() {
    this.TreeData = [];
    this.selectedStoreTreeData = {};
    this.selectedOrgTreeData = {
      key: '',
    };
    this.isFirstElement = false;
    this.treeOriginalData = [];
    this.expandedKeys = [];
    this.autoExpandParent = true;
    this.isStore = true;
    this.isOpen = true;

    makeObservable(this, {
      TreeData: observable,
      selectedStoreTreeData: observable,
      selectedOrgTreeData: observable,
      expandedKeys: observable,
      autoExpandParent: observable,
      isStore: observable,
      isOpen: observable,
      getTreeData: action,
      treeSelect: action,
      setSelectedStoreData: action,
      generateTreeData: action,
      onExpand: action,
      setIsStore: action,
      setTreeVisible: action,
    });
  }

  public generateTreeData = (treeDataItem: OrganizationTreeListEntity[]): void => {
    this.TreeData = treeDataItem.map((item) => {
      if (!item.storeId) {
        const newItem = item;
        // 用id做key
        newItem.key = item.unitId || 0;
        this.expandedKeys.push(newItem.key);
        // 默认选中第一项组织
        if (!this.isFirstElement) {
          this.isFirstElement = true;
          this.setSelectedOrgData(newItem);
          this.setIsStore(false);
        }
        const title = item.unitName;
        // 组织
        newItem.title = title;
        // eslint-disable-next-line react/prop-types
        newItem.icon = ({ selected }): JSX.Element => (selected ? (
          <img className={style.treeNodeIcon} src={organizationTreeSelected} alt="" />
          ) : (
            <img className={style.treeNodeIcon} src={organizationTree} alt="" />
          ));
        // 添加门店
        if (newItem.stores && newItem.stores?.length > 0) {
          newItem.stores.map((ele) => {
            if (newItem.children) {
              newItem.children.push({
                ...ele,
                key: ele.randomId || 0,
                title: ele.storeName,
                // eslint-disable-next-line react/prop-types
                icon: ({ selected }) => (selected ? (
                  <img className={style.treeNodeIcon} src={storeTreeSelected} alt="" />
                  ) : (
                    <img className={style.treeNodeIcon} src={storeTree} alt="" />
                  )),
              });
            } else {
              newItem.children = []
              newItem.children.push({
                ...ele,
                key: ele.randomId || 0,
                title: ele.storeName,
                // eslint-disable-next-line react/prop-types
                icon: ({ selected }) => (selected ? (
                  <img className={style.treeNodeIcon} src={storeTreeSelected} alt="" />
                  ) : (
                    <img className={style.treeNodeIcon} src={storeTree} alt="" />
                  )),
              })
            }
            return ele;
          });
          delete newItem.stores
        }

        if (newItem.children && newItem.children.length > 0) {
          this.generateTreeData(newItem.children);
        }
        return newItem;
      }
      return item;
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getTreeData = async (noStore?: boolean, getCurrentSelectedInfo?: any): Promise<void> => {
    if (noStore) {
      await this.storeUseCase.getAllStoreTreeListWithoutStore();
    } else {
      await this.storeUseCase.getAllStoreTreeListWithStore();
    }
    runInAction(() => {
      this.treeOriginalData = [...this.storeUseCase.storeTreeListData];
      this.setSelectedStoreData({})
      this.setSelectedOrgData({
        key: 1,
      })
      this.isFirstElement = false;
      this.isOpen = true;
      this.generateTreeData(this.treeOriginalData);
      setTimeout(() => {
        if (this.selectedOrgTreeData.key) {
          getCurrentSelectedInfo(this.selectedOrgTreeData);
        } else {
          getCurrentSelectedInfo(this.selectedStoreTreeData);
        }
      }, 0);
    });
  };

  public setSelectedStoreData = (store: OrganizationListEntity): void => {
    this.selectedStoreTreeData = { ...store };
  };

  public setSelectedOrgData = (store: OrganizationTreeListEntity): void => {
    this.selectedOrgTreeData = { ...store };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public treeSelect = (selectedKeys: Key[], info: TreeInfo, getCurrentSelectedInfo: any): void => {
    if (selectedKeys.length > 0) {
      // 存store数据
      if (info.selectedNodes[0] && (info.selectedNodes[0] as OrganizationTreeListEntity).storeId) {
        this.setSelectedStoreData((info.selectedNodes[0] as OrganizationTreeListEntity) || {});
        this.setIsStore(true)
        getCurrentSelectedInfo(this.selectedStoreTreeData)
      } else {
        // 存组织数据
        this.setSelectedOrgData((info.selectedNodes[0] as OrganizationTreeListEntity) || {});
        this.setIsStore(false)
        getCurrentSelectedInfo(this.selectedOrgTreeData)
      }
    }
  };

  public onExpand = (expandedKeys: Key[]): void => {
    this.expandedKeys = [...expandedKeys];
    this.autoExpandParent = false;
  };

  public setIsStore = (isStore: boolean): void => {
    this.isStore = isStore;
  };

  public setTreeVisible = (): void => {
    this.isOpen = !this.isOpen;
  };
}
