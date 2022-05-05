/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:52
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-18 18:43:56
 */
import { cloneDeep } from 'lodash';
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import AuditProgressViewModel from './viewModel';
import { ApproveProgressEntity } from '../../../../../domain/entities/approveEnities';
import { APPROVE_IDENTIFIER } from '../../../../../constants/identifiers';
import ApproveUseCase from '../../../../../domain/useCases/approveUseCase';

@injectable()
export default class AuditProgressViewModelImpl implements AuditProgressViewModel {
  @inject(APPROVE_IDENTIFIER.APPROVE_USE_CASE)
  private approveUseCase!: ApproveUseCase;

  public approveProgressData: ApproveProgressEntity[];
  public currentName: string;

  public constructor() {
    this.approveProgressData = [];
    this.currentName = '';
    makeObservable(this, {
      approveProgressData: observable,
      currentName: observable,
      getApproveProgressData: action,
      initialData: action,
    });
  }

  // 获取审核进度数据
  public getApproveProgressData = async (
    businessType: string,
    businessId: number,
    name: string,
  ): Promise<void> => {
    if (businessType === 'AD') {
      this.currentName = `广告名称：${name}`;
    }
    if (businessType === 'NOTICE') {
      this.currentName = `紧急通知名称：${name}`;
    }
    const data = await this.approveUseCase.getApproveProgressData(businessType, businessId);
    this.approveProgressData = cloneDeep(data.reverse());
  };

    // 初始化数据
    public initialData = (): void => {
      this.approveProgressData = [];
      this.currentName = '';
    };
}
