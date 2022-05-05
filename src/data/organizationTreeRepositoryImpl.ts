/*
 * @Author: liyou
 * @Date: 2021-07-01 16:19:30
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:07:27
 */

import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';
import {
  OrganizationTreeListEntity,
  OrganizationListByUnitEntity,
  OrgListWithStore,
} from '../domain/entities/organizationEntities';
import TreeRepository from '../domain/repositories/organizationRepository';

import UserUseCase from '../domain/useCases/userUseCase';

@injectable()
export default class TreeRepositoryImpl implements TreeRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 获取全部的树形图列表数据
  async requestAllStoreTreeList(): Promise<OrganizationTreeListEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/unit/query-org-tree-with-store`,
    );
    return data;
  }

  // 获取全部的树形图列表数据 - 带门店
  async requestTreeListWithStore(): Promise<OrgListWithStore[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/unit/all-children-units-with-store`,
    );
    return data;
  }
  // 获取全部的树形图列表数据 - 不带门店
  async requestTreeListWithoutStore(): Promise<OrgListWithStore[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/unit/all-children-units`,
    );
    return data;
  }

  // 根据组织id，查询子部门列表
  async requestOrgListByUnit(unitId: number): Promise<OrganizationListByUnitEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/device/unit/query-org-list-by-unit/${unitId}`,
    );
    return data;
  }
}
