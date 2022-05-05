/*
 * @Author: mayajing
 * @Date: 2021-11-22 15:37:09
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-01-13 11:43:40
 */
import { CommonResponseDTO } from '../../common/config/commonConfig';

// 审批设置列表
export interface StoresItem {
  id: number;
  name?: string; //门店名称
}
export interface ApproveSettingListItemConfig extends CommonResponseDTO {
  id?: number;
  unitId?: number; //组织id
  unitName?: string; //组织名称
  stores?: StoresItem[]; //项目/门店
  approveType?: string; //审批方式
  approverName?: string; //审批人
  lastUpdateDate?: string; //最新修改时间
  instances?: ApproverEntity[]; // 审批人列表
}

// 审批进度
export interface ApproveProgressEntity {
  nodeList?: NodeListEntity[];
  nodeName?: string;
}

export interface NodeListEntity {
  organizationName?: string;
  approveTime?: string;
  approveUser?: string;
  reason?: string;
}

// 审批
export interface ApproveParamsEntity {
  businessId?: number;
  businessType?: string;
  content?: string;
  status?: string; //审批状态
  taskActorId?: number[] | number;
}
// 创建审批规则entities
export interface ApproveRulesRequestConfig extends CommonResponseDTO {
  approveType?: string;
  approverId?: number;
  approverName?: string;
  deleteDate?: string;
  deleted?: boolean;
  deletedBy?: number;
  id?: number;
  instances?: ApproverEntity[];
  processId?: number;
  sort?: number;
  storeId?: number;
  tenantId?: number;
  unitId?: number;
  unitName?: string;
  stores?: StoresEntity[];
}

export interface StoresEntity extends CommonResponseDTO {
  address?: string;
  beginBusinessHours?: BusinessHoursEntity;
  category?: string;
  categoryCode?: string;
  city?: string;
  cityCode?: string;
  county?: string;
  countyCode?: string;
  deleteDate?: string;
  deleted?: boolean;
  deletedBy?: number;
  description?: string;
  id?: number;
  latitude?: string;
  longitude?: string;
  name?: string;
  status?: boolean;
  tenantId?: number;
  type?: string;
  unitId?: number;
  unitName?: string;
  endBusinessHours?: BusinessHoursEntity;
}

export interface BusinessHoursEntity {
  hour?: string;
  minute?: string;
  nano?: number;
  second?: string;
}

export interface ApproverEntity {
  id?: number;
  processId?: number;
  approverId?: string;
  deleted?: boolean;
  deletedBy?: number;
  deleteDate?: string;
  approverName?: string;
  sort?: number;
  unitId?: number;
  unitName?: string;
  tenantId?: number;
}

// 组织ENtities
export interface UnitInfoConfig {
  unitId?: number;
  unitName?: string;
  unitCode?: string;
  levelPath?: string;
}

// 管理员
export interface AdminListDataItem {
  userId?: number;
  adminRole?: boolean;
  userName?: string;
}
