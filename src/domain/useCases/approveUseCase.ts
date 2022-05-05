/*
 * @Author: tongyuqiang
 * @Date: 2021-12-14 11:25:22
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-24 12:56:46
 */
import { inject, injectable } from 'inversify';
import { APPROVE_IDENTIFIER } from '../../constants/identifiers';
import ApproveRepository from '../repositories/approveRepository';
import { CommonPagesGeneric } from '../../common/config/commonConfig';
import {
  ApproveProgressEntity,
  ApproveSettingListItemConfig,
  ApproveParamsEntity,
  ApproveRulesRequestConfig,
  UnitInfoConfig,
  AdminListDataItem,
} from '../entities/approveEnities';

@injectable()
export default class ApproveUseCase {
  @inject(APPROVE_IDENTIFIER.APPROVE_REPOSITORYL)
  private approveRepository!: ApproveRepository;

  // 获取上屏发布-通知列表-通知详情-审批进度
  public async getApproveProgressData(
    businessType?: string,
    businessId?: number,
  ): Promise<ApproveProgressEntity[]> {
    return this.approveRepository.requestApproveProgress(businessType, businessId);
  }

  // 获取审批设置列表
  public async getApproveSettingList(
    page: number,
    size: number,
    approveType?: string,
    storeId?: string,
    unitId?: string,
  ): Promise<CommonPagesGeneric<ApproveSettingListItemConfig>> {
    return this.approveRepository.requestApproveSetting(page, size, approveType, storeId, unitId);
  }

  // 判断该组织是否依然存在
  public async isExist(id?: number): Promise<number> {
    return this.approveRepository.requestIsExist(id);
  }

  // 删除审批设置列表单条数据
  public async deleteItem(id?: number): Promise<void> {
    return this.approveRepository.requestDel(id);
  }

  // 审批
  public async approveItem(params: ApproveParamsEntity): Promise<void> {
    return this.approveRepository.requestApprove(params);
  }

  // 创建审批设置
  public async createApprove(result: ApproveRulesRequestConfig): Promise<void> {
    return this.approveRepository.requestCreate(result);
  }

  // 更新审批设置
  public async updateApprove(result: ApproveRulesRequestConfig): Promise<void> {
    return this.approveRepository.requestUpdate(result);
  }

  // 获取未创建审批设置的组织
  public async getUnitInfo(): Promise<UnitInfoConfig[]> {
    return this.approveRepository.reauestUnitInfo();
  }

  // 获取审批人列表
  public async getAdminInfo(unitId?: number): Promise<AdminListDataItem[]> {
    return this.approveRepository.requestAdminInfo(unitId);
  }

  // 审批规则详情
  public async getApproveDetails(id: number): Promise<ApproveRulesRequestConfig> {
    return this.approveRepository.requestApproveDetails(id);
  }

  // 编辑设备
  public editApprove(query: ApproveRulesRequestConfig): Promise<ApproveRulesRequestConfig> {
    return this.approveRepository.requsetEditApprove(query);
  }
}
