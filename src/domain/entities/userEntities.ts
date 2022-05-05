/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:18:32
 * @LastEditors: mayajing
 * @LastEditTime: 2021-11-30 18:26:53
 */

import { CommonResponseDTO } from '../../common/config/commonConfig';

export interface UserInfoEntity extends CommonResponseDTO {
  changePasswordFlag?: number;
  currentRoleCode?: string;
  currentRoleId?: number;
  currentRoleLevel?: string;
  currentRoleName?: string;
  dataHierarchyFlag?: number;
  dateFormat?: string;
  dateTimeFormat?: string;
  emailCheckFlag?: number;
  favicon?: string;
  id?: number;
  internationalTelCode?: string;
  language?: string;
  languageName?: string;
  lastPasswordUpdatedAt?: string;
  loginName?: string;
  logo?: string;
  menuLayout?: string;
  menuLayoutTheme?: string;
  passwordResetFlag?: number;
  phone?: string;
  phoneCheckFlag?: number;
  realName?: string;
  recentAccessTenantList?: string[];
  roleMergeFlag?: number;
  tenantId?: number;
  tenantName?: string;
  tenantNum?: string;
  timeFormat?: string;
  timeZone?: string;
  title?: string;
  organizationId?: number;
}

export interface UserPermissionsEmtity extends CommonResponseDTO {
  permissionType: string;
  controller: string;
  code: string;
  method: string;
  serviceCode: string;
  within: boolean;
  publicAccess: boolean;
  resourceLevel: string;
  description: string;
  path: string;
  scopeType: string;
  scope: string;
  action: string;
  operationType: string;
  id: number;
  loginAccess: boolean;
}

export interface UserRolesEmtity extends CommonResponseDTO {
  code: string; //角色编码/必填
  organizationName: string; //组织名称
  builtIn: boolean; //是否内置角色/非必填
  description: string; //角色描述/非必填
  sort: number; //角色排序/非必填/默认：0
  orgFullPath: string; //组织全路径
  enabled: boolean; //是否启用/非必填
  orgId: number; //组织主键
  users: string[];
  roleIds: number[];
  userCount: number; //已分配用户数量/非必填
  permissions: UserPermissionsEmtity[];
  name: string; //角色名/必填
  isManager: boolean;
  id: number;
}
