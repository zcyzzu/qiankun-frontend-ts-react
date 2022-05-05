/*
 * @Author: liyou
 * @Date: 2021-07-01 16:21:13
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-23 11:08:11
 */

import { inject, injectable } from 'inversify';
import { isEmpty } from 'lodash';
import { ORGANIZATION_TREE_IDENTIFIER } from '../../constants/identifiers';
import StoreRepository from '../repositories/organizationRepository';
import {
  OrganizationTreeListEntity,
  OrganizationListEntity,
  OrganizationListByUnitEntity,
  OrgListWithStore,
} from '../entities/organizationEntities';

@injectable()
export default class StoreUseCase {
  @inject(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_REPOSITORYL)
  private storeRepository!: StoreRepository;

  public storeTreeListData: OrganizationTreeListEntity[];
  public storeTreeListDataWithStore: OrgListWithStore[] = [];
  public searchStoreDatas: OrganizationListEntity[];

  public constructor() {
    this.storeTreeListData = [];
    this.searchStoreDatas = [];
  }

  // 获取全部的树形图列表数据
  public async getAllStoreTreeList(): Promise<void> {
    await this.storeRepository
      .requestAllStoreTreeList()
      .then((res) => {
        this.storeTreeListData = [res];
      })
      .catch(() => {
        this.storeTreeListData = [];
      });
  }

  // 获取全部的树形图列表数据 - 带门店
  public async getAllStoreTreeListWithStore(): Promise<void> {
    await this.storeRepository
      .requestTreeListWithStore()
      .then((res) => {
        this.storeTreeListData = []
        res.map((ele) => {
          if (!isEmpty(ele.unitResponseVO) && ele.unitResponseVO) {
            this.storeTreeListData.push(ele.unitResponseVO);
          }
          return ele.unitResponseVO;
        });
      })
      .catch(() => {
        this.storeTreeListData = [];
      });
  }

  // 获取全部的树形图列表数据 - 不带门店
  public async getAllStoreTreeListWithoutStore(): Promise<void> {
    await this.storeRepository
      .requestTreeListWithoutStore()
      .then((res) => {
        this.storeTreeListData = []
        res.map((ele) => {
          if (!isEmpty(ele.unitResponseVO) && ele.unitResponseVO) {
            this.storeTreeListData.push(ele.unitResponseVO);
          }
          return ele.unitResponseVO;
        });
      })
      .catch(() => {
        this.storeTreeListData = [];
      });
  }

  // 根据组织id，查询子部门列表
  public async getOrgListByUnit(unitId: number): Promise<OrganizationListByUnitEntity[]> {
    return this.storeRepository.requestOrgListByUnit(unitId);
  }
}
