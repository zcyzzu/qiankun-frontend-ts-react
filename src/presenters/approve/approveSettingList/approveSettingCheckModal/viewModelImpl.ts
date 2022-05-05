/*
 * @Author: zhangchenyang
 * @Date: 2021-12-03 11:56:38
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-12-24 14:41:13
 */
import { cloneDeep } from 'lodash';
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import ApproveSettingModalViewModel from './viewModel';
import { ApproveSettingListItemConfig, ApproveRulesRequestConfig } from '../../../../domain/entities/approveEnities';
import { APPROVE_IDENTIFIER } from '../../../../constants/identifiers';
import ApproveUseCase from '../../../../domain/useCases/approveUseCase';

@injectable()
export default class ApproveSettingModalViewModelImpl implements ApproveSettingModalViewModel {
  @inject(APPROVE_IDENTIFIER.APPROVE_USE_CASE)
  private approveUseCase!: ApproveUseCase;

  public approveSettingCheckModalVisible: boolean;
  public approveSettingCheckModalItemData: ApproveRulesRequestConfig;
  public constructor() {
    this.approveSettingCheckModalVisible = false;
    this.approveSettingCheckModalItemData = {};
    makeObservable(this, {
      approveSettingCheckModalVisible: observable,
      approveSettingCheckModalItemData: observable,
      setApproveSettingCheckModalVisible: action,
      getApproveDetails: action,
    });
  }

  // 设置审批设置弹窗状态
  public setApproveSettingCheckModalVisible = (
    value: boolean,
    record?: ApproveSettingListItemConfig,
  ): void => {
    if (record) {
      this.getApproveDetails(record.id || 0)
    }
    this.approveSettingCheckModalVisible = value;
  };

  // 获取审核规则详情
  public getApproveDetails = async (id: number): Promise<void> => {
    const data = await this.approveUseCase.getApproveDetails(id);
    runInAction(() => {
      this.approveSettingCheckModalItemData = cloneDeep(data);
    });
  };
}
