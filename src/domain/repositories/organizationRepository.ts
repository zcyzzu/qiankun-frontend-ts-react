/*
 * @Author: liyou
 * @Date: 2021-07-01 16:17:51
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-23 11:00:10
 */
import {
  OrganizationTreeListEntity,
  OrganizationListByUnitEntity,
  OrgListWithStore,
} from '../entities/organizationEntities';

export default interface StoreRepository {
  // 获取全部商场树形图列表
  requestAllStoreTreeList(): Promise<OrganizationTreeListEntity>;

  // 查询我和我的下级组织树 - 带项目门店
  requestTreeListWithStore(): Promise<OrgListWithStore[]>;

  // 查询我和我的下级组织树 - 不带带项目门店
  requestTreeListWithoutStore(): Promise<OrgListWithStore[]>;

  // 根据组织id，查询子部门列表
  requestOrgListByUnit(unitId: number): Promise<OrganizationListByUnitEntity[]>;
}
