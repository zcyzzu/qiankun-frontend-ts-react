/*
 * @Author: tongyuqiang
 * @Date: 2021-12-14 11:24:01
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-24 12:56:43
 */
import {
  ApproveProgressEntity,
  ApproveSettingListItemConfig,
  ApproveRulesRequestConfig,
  UnitInfoConfig,
  AdminListDataItem,
  ApproveParamsEntity,
} from '../entities/approveEnities';
import { CommonPagesGeneric } from '../../common/config/commonConfig';

export default interface ApproveRepository {
  // 获取上屏发布-通知列表-通知详情-审批进度
  requestApproveProgress(
    businessType?: string,
    businessId?: number,
  ): Promise<ApproveProgressEntity[]>;

  // 获取审批设置列表
  requestApproveSetting(
    page: number,
    size: number,
    approveType?: string,
    storeId?: string,
    unitId?: string,
  ): Promise<CommonPagesGeneric<ApproveSettingListItemConfig>>;

  //判断该组织是否依然存在
  requestIsExist(id?: number): Promise<number>;
  // 删除审批设置-单个数据
  requestDel(id?: number): Promise<void>;
  // 审批
  requestApprove(params: ApproveParamsEntity): Promise<void>;

  // 创建审批规则
  requestCreate(result: ApproveRulesRequestConfig): Promise<void>;

  // 更新审批规则
  requestUpdate(result: ApproveRulesRequestConfig): Promise<void>;

  // 获取未创建审批设置的组织
  reauestUnitInfo(): Promise<UnitInfoConfig[]>;

  // 获取审批人列表
  requestAdminInfo(unitId?: number): Promise<AdminListDataItem[]>;

  // 审批规则详情
  requestApproveDetails(id: number): Promise<ApproveRulesRequestConfig>;

  // 修改审批规则
  requsetEditApprove(query: ApproveRulesRequestConfig): Promise<ApproveRulesRequestConfig>;
}
