/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:52
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:48:12
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { cloneDeep } from 'lodash';
import { NOTICE_IDENTIFIER, ROOT_CONTAINER_IDENTIFIER } from '../../../../../constants/identifiers';
import NoticeDetailsTabViewModel, {
  // SpecificDeviceItemEntity,
  SpecificDeviceDataConfig,
  DeviceListParamsConfig,
  // NoticePreviewProps,
} from './viewModel';
import NoticeUseCase from '../../../../../domain/useCases/noticeUseCase';
import {
  NoticeDetailsListEntity,
  NoticeItemDetailsEntity,
} from '../../../../../domain/entities/noticeEntities';
import { LookupsEntity } from '../../../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../../../domain/useCases/rootContainerUseCase';

import { DeviceType } from '../../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../../constants/lookupsCodeTypes';

@injectable()
export default class NoticeDetailsTabViewModelImpl implements NoticeDetailsTabViewModel {
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  public specificDeviceListData: NoticeDetailsListEntity;
  public specificDeviceListDataSource: SpecificDeviceDataConfig[];
  public deviceListParams: DeviceListParamsConfig;
  // 具体设备内容
  public deviceContent: DeviceType;
  public currentId: number;
  public noticeDetailsData: NoticeItemDetailsEntity;
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
    this.deviceContent = DeviceType.Advertisement;
    this.currentId = 0;
    this.noticeDetailsData = {};
    this.textPositionCode = [];
    this.rollSpeendCode = [];
    this.dataLengthAd = 0;
    this.dataLengthCa = 0;
    this.dataLengthLed = 0;

    makeObservable(this, {
      dataLengthAd: observable,
      dataLengthCa: observable,
      dataLengthLed: observable,
      specificDeviceListData: observable,
      specificDeviceListDataSource: observable,
      deviceListParams: observable,
      currentId: observable,
      noticeDetailsData: observable,
      textPositionCode: observable,
      rollSpeendCode: observable,
      getDeviceDetailsListData: action,
      getListDataNum: action,
      pageChange: action,
      switchDevice: action,
      getNoticeDetailsData: action,
      initialData: action,
      getLookupsValue: action,
    });
  }

  // 获取设备详情列表数量
  public getListDataNum = async (id: number, type: string): Promise<void> => {
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

  // 获取设备详情列表数据
  public getDeviceDetailsListData = async (id: number, type: string): Promise<void> => {
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
    this.getDeviceDetailsListData(this.currentId, this.deviceContent);
  };

  // 切换设备
  public switchDevice = (value: DeviceType): void => {
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
    this.getDeviceDetailsListData(this.currentId, value);
  };

  // 获取通知详情数据
  public getNoticeDetailsData = async (id: number): Promise<void> => {
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
    this.dataLengthAd = 0;
    this.dataLengthCa = 0;
    this.dataLengthLed = 0;
    this.specificDeviceListDataSource = [];
    this.deviceListParams = {
      page: 0,
      size: 3,
    };
    this.deviceContent = DeviceType.Advertisement;
    this.currentId = 0;
    this.noticeDetailsData = {};
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
