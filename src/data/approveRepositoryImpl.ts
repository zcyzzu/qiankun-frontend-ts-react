/*
 * @Author: tongyuqiang
 * @Date: 2021-12-14 11:24:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:05:23
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';
import ApproveRepository from '../domain/repositories/approveRepository';
import {
  ApproveProgressEntity,
  ApproveSettingListItemConfig,
  ApproveParamsEntity,
  ApproveRulesRequestConfig,
  UnitInfoConfig,
  AdminListDataItem,
} from '../domain/entities/approveEnities';
import { CommonPagesGeneric } from '../common/config/commonConfig';
import UserUseCase from '../domain/useCases/userUseCase';

@injectable()
export default class ApproveRepositoryImpl implements ApproveRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 获取上屏发布-通知列表-通知详情-审批进度
  async requestApproveProgress(
    businessType?: string,
    businessId?: number,
  ): Promise<ApproveProgressEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/approve/progress`,
      {
        params: { businessType, businessId },
      },
    );
    return data;
  }

  // 获取审批设置列表
  async requestApproveSetting(
    page: number,
    size: number,
    approveType?: string,
    storeId?: string,
    unitId?: string,
  ): Promise<CommonPagesGeneric<ApproveSettingListItemConfig>> {
    const { data } = await axios.get(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process`, {
      params: {
        page,
        size,
        approveType,
        storeId,
        unitId,
      },
    });
    return data;
  }

  // 判断该组织是否依然存在
  async requestIsExist(id?: number): Promise<number> {
    const { status } = await axios.get(
      `${this.configProvider.apiPublicUrl}/hpfm/v1/extension/${this.userUseCase.userInfo.tenantId}/valid-unit/${id}`,
    );
    return status;
  }
  // 删除审批设置列表单条数据
  async requestDel(id?: number): Promise<void> {
    await axios.delete(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process/delete/${id}`);
  }
  // 审批
  async requestApprove(params: ApproveParamsEntity): Promise<void> {
    await axios.post(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/approve`, params);
  }

  // 创建审批规则
  async requestCreate(result: ApproveRulesRequestConfig): Promise<void> {
    await axios.post(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process/create`, result);
  }

  // 更新审批规则
  async requestUpdate(result: ApproveRulesRequestConfig): Promise<void> {
    await axios.post(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process/update`, result);
  }

  // 获取未创建审批设置的组织
  async reauestUnitInfo(): Promise<UnitInfoConfig[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process/units`,
    );
    return data;
  }

  // 获取未创建审批设置的组织
  async requestAdminInfo(unitId?: number): Promise<AdminListDataItem[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/iam/v1/${this.userUseCase.userInfo.tenantId}/approve/users`,
      {
        params: {
          unitId,
        },
      },
    );
    return data;
  }

  // 审批规则详情
  async requestApproveDetails(id: number): Promise<ApproveRulesRequestConfig> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process/details/${id}`,
    );
    return data;
  }

  // 修改审批规则
  async requsetEditApprove(query: ApproveRulesRequestConfig): Promise<ApproveRulesRequestConfig> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/wf-process/update`,
      query,
    );
    return data;
  }
}
