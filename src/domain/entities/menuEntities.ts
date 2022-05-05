/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: liyou
 * @LastEditTime: 2021-09-02 11:53:04
 */

export interface MenuEntity {
  checkedFlag?: string;
  code?: string;
  controllerType?: string;
  controllerTypeMeaning?: string;
  createFlag?: string;
  customFlag?: number;
  default?: number;
  description?: string;
  editDetailFlag?: number;
  enName?: string;
  enabledFlag?: number;
  icon?: string;
  id?: number;
  inheritFlag?: string;
  labels?: MenuLabels[];
  level?: string;
  levelMeaning?: string;
  menuPermissions?: MenuPermissions[];
  menuTls?: MenuTls[];
  name?: string;
  newSubnodeFlag?: number;
  parentCode?: string;
  parentId?: number;
  parentName?: string;
  parentTenantId?: number;
  permissionType?: string;
  permissions?: PermissionsConfig[];
  psLeafFlag?: number;
  quickIndex?: string;
  rootNode?: boolean;
  route?: string;
  secGrpAclId?: string;
  shieldFlag?: number;
  sort?: number;
  subMenus?: MenuEntity[];
  tenantId?: number;
  tenantName?: string;
  type?: string;
  typeMeaning?: string;
  viewCode?: string;
  virtualFlag?: number;
  zhName?: string;
}

export interface MenuLabels {
  description?: string;
  enabledFlag?: number;
  fdLevel?: string;
  id?: number;
  inheritFlag?: number;
  levelMeaning?: string;
  name?: string;
  presetFlag?: number;
  tag?: string;
  tagMeaning?: string;
  type?: string;
  typeMeaning?: string;
  visibleFlag?: number;
}

export interface MenuPermissions {
  id?: number;
  menuId?: number;
  permissionCode?: string;
  tenantId?: number;
}
export interface MenuTls {
  id?: number;
  lang?: string;
  name?: string;
  tenantId?: number;
}

export interface PermissionsConfig {
  action?: string;
  code?: string;
  condition?: string;
  description?: string;
  fieldCount?: number;
  id?: number;
  labels?: MenuLabels[];
  level?: string;
  levelMeaning?: string;
  loginAccess?: boolean;
  method?: string;
  path?: string;
  permissionSetId?: number;
  publicAccess?: boolean;
  resource?: string;
  serviceName?: string;
  signAccess?: boolean;
  tag?: string;
  tags?: string[];
  tenantId?: number;
  within?: boolean;
}
