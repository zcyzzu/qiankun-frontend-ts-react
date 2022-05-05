/*
 * @Author: wuhao
 * @Date: 2021-12-01 15:29:33
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:57:19
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { cloneDeep } from 'lodash';

import NoticeApproveModalViewModel, {
  SpecificDeviceDataConfig,
  DeviceListParamsConfig,
  FormDataConfig,
  ApproveStatus,
} from './viewModel';
import {
  NoticeDetailsListEntity,
  NoticeItemDetailsEntity,
} from '../../../domain/entities/noticeEntities';
import { ApproveParamsEntity } from '../../../domain/entities/approveEnities';
import NoticeUseCase from '../../../domain/useCases/noticeUseCase';
import ApproveUseCase from '../../../domain/useCases/approveUseCase';
import {
  NOTICE_IDENTIFIER,
  APPROVE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../constants/identifiers';
import { DeviceType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import utils from '../../../utils/index';
import NoticeApproveListViewModel from '../noticeApproveList/viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';

@injectable()
export default class NoticeApproveModalViewModelImpl implements NoticeApproveModalViewModel {
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;
  // ApproveUseCase
  @inject(APPROVE_IDENTIFIER.APPROVE_USE_CASE)
  private approveUseCase!: ApproveUseCase;

  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  public specificDeviceListData: NoticeDetailsListEntity;
  public specificDeviceListDataSource: SpecificDeviceDataConfig[];
  public deviceListParams: DeviceListParamsConfig;
  // 具体设备内容
  public deviceContent: string;
  //审批弹窗状态
  public noticeApproveModalVisible: boolean;
  // 预览props
  // public noticePreviewProps: NoticePreviewProps;
  public noticeDetailsData: NoticeItemDetailsEntity;
  public currentId: number;
  public currentTaskActorId?: number[];
  public approveStatus?: string;
  public textPositionCode: LookupsEntity[];
  public rollSpeendCode: LookupsEntity[];
  public dataLengthAd: number;
  public dataLengthCa: number;
  public dataLengthLed: number;

  public constructor() {
    this.specificDeviceListData = {
      page: {
        content: [],
      },
    };
    this.specificDeviceListDataSource = [];
    this.deviceListParams = {
      page: 0,
      size: 3,
    };
    this.deviceContent = '';
    this.noticeApproveModalVisible = false;
    this.noticeDetailsData = {};
    this.currentId = 0;
    this.currentTaskActorId = [];
    this.approveStatus = undefined;
    this.textPositionCode = [];
    this.rollSpeendCode = [];
    this.dataLengthAd = 0;
    this.dataLengthCa = 0;
    this.dataLengthLed = 0;

    makeObservable(this, {
      dataLengthAd: observable,
      dataLengthCa: observable,
      dataLengthLed: observable,
      noticeApproveModalVisible: observable,
      specificDeviceListData: observable,
      specificDeviceListDataSource: observable,
      deviceListParams: observable,
      deviceContent: observable,
      currentId: observable,
      noticeDetailsData: observable,
      currentTaskActorId: observable,
      approveStatus: observable,
      textPositionCode: observable,
      rollSpeendCode: observable,
      getDeviceListData: action,
      pageChange: action,
      switchDevice: action,
      setNoticeApproveModalVisible: action,
      onFinish: action,
      getNoticeDetailsData: action,
      getDeviceListNum: action,
      initialData: action,
      radioChange: action,
      getLookupsValue: action,
    });
  }

  // 获取设备列表数据
  public getDeviceListNum = async (id: number, type: string): Promise<void> => {
    const { page, size } = this.deviceListParams;

    const data = await this.noticeUseCase.getNoticeDetailsListData(type, id, page, size);

    runInAction(() => {
      if (type === DeviceType.Advertisement) {
        this.dataLengthAd = data.page?.totalElements || 0;
      } else if (type === DeviceType.Cashier) {
        this.dataLengthCa = data.page?.totalElements || 0;
      } else if (type === DeviceType.Led) {
        this.dataLengthLed = data.page?.totalElements || 0;
      }
    });
  };
  // 获取设备列表数据
  public getDeviceListData = async (id: number, type: string): Promise<void> => {
    this.currentId = id;
    const { page, size } = this.deviceListParams;

    const data = await this.noticeUseCase.getNoticeDetailsListData(type, id, page, size);

    runInAction(() => {
      this.specificDeviceListData = cloneDeep(data);
      const listData: SpecificDeviceDataConfig[] = [];
      this.specificDeviceListData.page?.content.forEach((item, index) => {
        let str = '';
        if (item.groupNames && item.groupNames.length > 0) {
          item.groupNames?.forEach((nameItem) => {
            str += `${nameItem.groupName}/`;
          });
          str = str.substring(0, str.length - 1);
        } else {
          str = '';
        }
        listData.push({
          brandFormat: item.brandFormat,
          deviceId: item.deviceId,
          deviceName: item.deviceName,
          floor: item.floor,
          pointBrandName: item.pointBrandName,
          storeId: item.storeId,
          storeName: item.storeName,
          groupStr: str,
          key: index + 1,
        });
      });
      this.specificDeviceListDataSource = listData;
    });
  };

  // 广告分页切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.deviceListParams.page = page - 1;
    if (pageSize) {
      this.deviceListParams.size = pageSize;
    }
    this.getDeviceListData(this.currentId, this.deviceContent);
  };

  // 切换设备
  public switchDevice = (value: string): void => {
    this.deviceContent = value;
    this.specificDeviceListData = {
      page: {
        content: [],
      },
    };
    this.specificDeviceListDataSource = [];
    this.deviceListParams = {
      page: 0,
      size: 3,
    };
    this.getDeviceListData(this.currentId, value);
  };

  //设置审批model显示隐藏
  public setNoticeApproveModalVisible = (): void => {
    this.noticeApproveModalVisible = !this.noticeApproveModalVisible;
  };

  //表单提交成功事件
  public onFinish = async (
    values: FormDataConfig,
    noticeApproveListViewModel: NoticeApproveListViewModel,
  ): Promise<void> => {
    const { approveResult, content } = values;
    if (approveResult === 'REJECTED' && !content) {
      utils.globalMessge({
        content: '请输入驳回原因',
        type: 'error',
      });
      return;
    }
    const { id } = this.noticeDetailsData;
    const params: ApproveParamsEntity = {
      businessId: id,
      businessType: 'NOTICE',
      content,
      status: approveResult,
      taskActorId: this.currentTaskActorId,
    };
    await this.approveUseCase
      .approveItem(params)
      .then(() => {
        if (approveResult === ApproveStatus.Passed) {
          utils.globalMessge({
            content: '审批通过成功',
            type: 'success',
          });
        } else {
          utils.globalMessge({
            content: '审批驳回成功',
            type: 'success',
          });
        }
        this.noticeApproveModalVisible = !this.noticeApproveModalVisible;
        noticeApproveListViewModel.getNoticeApproveList();
      })
      .catch((err) => {
        utils.globalMessge({
          content: `${err.message}`,
          type: 'error',
        });
      });
  };

  // 获取通知详情数据
  public getNoticeDetailsData = async (id: number, taskActorId?: number[]): Promise<void> => {
    this.currentTaskActorId = taskActorId;
    const data = await this.noticeUseCase.getNoticeItemDetails(id);
    runInAction(() => {
      this.noticeDetailsData = cloneDeep(data);
    });
  };

  // 初始化数据
  public initialData = (): void => {
    this.specificDeviceListData = {
      page: {
        content: [],
      },
    };
    this.specificDeviceListDataSource = [];
    this.deviceListParams = {
      page: 0,
      size: 3,
    };
    this.deviceContent = DeviceType.Advertisement;
    this.currentId = 0;
    this.noticeDetailsData = {};
    this.approveStatus = undefined;
  };

  // 审核结果change
  public radioChange = (e: string): void => {
    this.approveStatus = e;
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 文本位置快码数据
        if (code === LookupsCodeTypes.TEXT_POSITION_TYPE) {
          this.textPositionCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 文本滚动速度快码数据
        if (code === LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE) {
          this.rollSpeendCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.textPositionCode = [];
        this.rollSpeendCode = [];
      });
    }
  };
}
