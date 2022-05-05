/*
 * @Author: liyou
 * @Date: 2021-07-09 14:40:01
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-03-24 09:11:35
 */
import { DataNode } from 'rc-tree/lib/interface';
import { CommonResponseDTO } from '../../common/config/commonConfig';

export interface OrganizationEntity extends CommonResponseDTO {
  fullPath?: string;
  code?: string;
  hasAccess?: boolean;
  roleSolutionName?: string;
  enabled?: boolean;
  path?: string;
  id?: number;
  roleSolutionId?: number;
  sort?: number;
  parentId?: number;
  organizationType?: string;
  parentName?: string;
  leafFlag?: boolean;
  managerUserId?: number;
  userCount?: number;
  organizationTypeCode?: string;
  name?: string;
  organizationTypeId?: number;
  managerUserName?: string;
}

// 商场列表
export interface OrganizationListEntity extends CommonResponseDTO {
  address?: string;
  childes?: OrganizationListEntity[];
  city?: string;
  code?: string;
  commonPointsAccumulate?: boolean;
  currentOrgId?: number;
  disabled?: boolean;
  district?: string;
  id?: number;
  name?: string;
  parentOrgId?: number;
  province?: string;
  remarks?: string;
  storeParentName?: string;
  tenantId?: number;
  unitId?: number;

  key?: number| string;
  storeId?: number;
  storeName?: string;
  storeType?: string;
}

// 商场树列表
export interface OrganizationTreeListEntity extends DataNode {
  children?: OrganizationTreeListEntity[];
  companyId?: number;
  companyName?: string;
  costCode?: string;
  costName?: string;
  createdBy?: number;
  creationDate?: string;
  description?: string;
  enableBudgetFlag?: number;
  enabledFlag?: number;
  hasNextFlag?: number;
  lastUpdateDate?: string;
  lastUpdatedBy?: number;
  path?: string;
  nameLevelPaths?: string[];
  objectVersionNumber?: number;
  orderSeq?: number;
  parentUnitId?: number;
  parentUnitName?: string;
  phoneticize?: string;
  quickIndex?: string;
  store?: OrganizationListEntity;
  supervisorFlag?: number;
  tenantId?: number;
  unitCode?: string;
  unitCompanyId?: number;
  unitCompanyName?: string;
  unitId?: number;
  unitName?: string;
  unitTypeCode?: string;
  unitTypeMeaning?: string;
  storeOrgId?: number;
  stores?: TreeStoresEntity[];
  levelPath?: string;
  randomId?: number;

  storeId?: number;
  storeName?: string;
  storeType?: string;
}

export interface TreeStoresEntity {
  storeId?: number;
  storeName?: string;
  storeType?: string;
  randomId?: number;

}

// 某组织下的子部门列表
export interface OrganizationListByUnitEntity {
  unitId?: number;
  unitCode?: string;
  unitName?: string;
  levelPath?: string;
}

export interface OrgListWithStore {
  levelPath?: string;
  stores?: TreeStoresEntity[];
  unitCode?: string;
  unitId?: number;
  unitName?: string;
  unitResponseVO?: OrganizationTreeListEntity;
}
