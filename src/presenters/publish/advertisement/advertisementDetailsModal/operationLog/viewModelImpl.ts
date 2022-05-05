/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:52
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:43:30
 */
import { cloneDeep } from 'lodash';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import {
  ADVERTISEMENT_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  NOTICE_IDENTIFIER,
} from '../../../../../constants/identifiers';
import OperationLogViewModel from './viewModel';
import { AdvertisementOperateLogEntity } from '../../../../../domain/entities/advertisementEntities';
import AdvertisementUseCase from '../../../../../domain/useCases/advertisementUseCase';
import { LookupsEntity } from '../../../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../../../domain/useCases/rootContainerUseCase';
import NoticeUseCase from '../../../../../domain/useCases/noticeUseCase';
import { LookupsCodeTypes } from '../../../../../constants/lookupsCodeTypes';

@injectable()
export default class OperationLogViewModelImpl implements OperationLogViewModel {
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private advertisementUseCase!: AdvertisementUseCase;

  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  public operateLogData: AdvertisementOperateLogEntity[];
  public operationTypeCode: LookupsEntity[];
  public noticeOperationTypeCode: LookupsEntity[];
  public type?: string;

  public constructor() {
    this.operateLogData = [];
    this.operationTypeCode = [];
    this.noticeOperationTypeCode = [];
    this.type = undefined;
    makeObservable(this, {
      operateLogData: observable,
      operationTypeCode: observable,
      noticeOperationTypeCode: observable,
      type: observable,
      getOperateLog: action,
      operationPageGetLookupsValue: action,
      initialData: action,
    });
  }

  // 获取操作日志数据
  public getOperateLog = async (id: number, type?: string): Promise<void> => {
    this.type = type;
    if (type === 'AD') {
      const data = await this.advertisementUseCase.getOperateLog(id);
      this.operateLogData = cloneDeep(data.reverse());
    }
    if (type === 'NOTICE') {
      const data = await this.noticeUseCase.getOperateLog(id);
      this.operateLogData = cloneDeep(data);
    }
  };

  // 请求快码数据
  public operationPageGetLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取广告操作类型快码数据
        if (code === LookupsCodeTypes.AD_OPERATE_STATE_CODE) {
          this.operationTypeCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 获取通知操作类型快码数据
        if (code === LookupsCodeTypes.OPERATION_TYPE_CODE) {
          this.noticeOperationTypeCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.operationTypeCode = [];
        this.noticeOperationTypeCode = [];
      });
    }
  };

  // 初始化数据
  public initialData = (): void => {
    this.operateLogData = [];
  };
}
