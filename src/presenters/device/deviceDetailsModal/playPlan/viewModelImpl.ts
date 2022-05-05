/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:52
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:39:47
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { cloneDeep } from 'lodash';

import PlayPlanViewModel, {
  PlayPlanAdvertDataConfig,
  PlayPlanNoticeDataConfig,
  AdvertListParamsConfig,
} from './viewModel';
import { NoticePlayPlanEntity } from '../../../../domain/entities/deviceEntities';
import FileUseCase from '../../../../domain/useCases/fileUseCase';
import {
  ADVERTISEMENT_IDENTIFIER,
  FILE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  DATA_STATISTICS_IDENTIFIER,
} from '../../../../constants/identifiers';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import { CommonPagesGeneric, UploadType } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import {
  AdvertisementPlayPlanEntity,
  MaterialListEntity,
} from '../../../../domain/entities/advertisementEntities';
import DeviceUseCase from '../../../../domain/useCases/deviceUseCase';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../../domain/useCases/rootContainerUseCase';

@injectable()
export default class PlayPlanViewModelImpl implements PlayPlanViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private advertisementUseCase!: AdvertisementUseCase;
  // deviceUseCase
  @inject(DATA_STATISTICS_IDENTIFIER.DEVICE_STATISTICS_USE_CASE)
  private deviceUseCase!: DeviceUseCase;
  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  public advertListData: CommonPagesGeneric<AdvertisementPlayPlanEntity>;
  public advertListDataSource: PlayPlanAdvertDataConfig[];
  public noticeListData: CommonPagesGeneric<NoticePlayPlanEntity>;
  public noticeListDataSource: PlayPlanNoticeDataConfig[];
  public advertListParams: AdvertListParamsConfig;
  public noticeListParams: AdvertListParamsConfig;
  public imageSrc: string;
  public videoSrc: string;
  public currentId: number;
  public cycleCode: LookupsEntity[];
  public currentStatus: string;
  public currentType: string;
  public currentName?: string;

  public constructor() {
    this.advertListData = {
      content: [],
      // totalElements: 5, //共多少项
    };
    this.noticeListData = {
      content: [],
      // totalElements: 5, //共多少项
    };
    this.advertListDataSource = [];
    this.noticeListDataSource = [];
    this.advertListParams = {
      page: 0,
      size: 5,
    };
    this.noticeListParams = {
      page: 0,
      size: 5,
    };
    this.imageSrc = '';
    this.videoSrc = '';
    this.currentId = 0;
    this.cycleCode = [];
    this.currentType = 'AD';
    this.currentStatus = 'ALL';
    this.currentName = undefined;

    makeObservable(this, {
      advertListData: observable,
      advertListDataSource: observable,
      noticeListData: observable,
      noticeListDataSource: observable,
      advertListParams: observable,
      noticeListParams: observable,
      imageSrc: observable,
      videoSrc: observable,
      currentId: observable,
      cycleCode: observable,
      currentType: observable,
      currentStatus: observable,
      currentName: observable,
      getPlayPlanData: action,
      selectChange: action,
      selectStatusChange: action,
      pageChange: action,
      urgentPageChange: action,
      getMaterialUrl: action,
      initialData: action,
      onSearch: action,
    });
  }

  public getPlayPlanData = async (id: number): Promise<void> => {
    this.currentId = id;
    let status: string | undefined;
    status = this.currentStatus;
    if (this.currentStatus === 'ALL') {
      status = undefined;
    }

    if (this.currentType === 'AD') {
      const { page, size } = this.advertListParams;
      const data = await this.advertisementUseCase.getAdvertisementPlayPlan(
        'PLAY_PLAN',
        id,
        page,
        size,
        status,
        this.currentName,
      );
      const listData: PlayPlanAdvertDataConfig[] = [];
      let materialObj: MaterialListEntity = {};
      runInAction(() => {
        this.advertListData = cloneDeep(data);
        this.advertListData.content.forEach((item, index) => {
          item.materialList?.forEach((materialItem, materialIndex) => {
            if (materialIndex === 0) {
              materialObj = materialItem;
            }
          });

          // const dataCode = this.cycleCode.find((itemCode) => {
          //   return itemCode.value === item.cycleType;
          // });

          // let cycleTime = '';
          // if (item.cycleType === 'WEEK') {
          // cycleTime = `${item.cycleWeekDay ? item.cycleWeekDay : ''} `;
          // if (item.timeList && item.timeList.length > 0) {
          //   item.timeList.forEach((timeItem) => {
          //     cycleTime += `${timeItem.cycleStartTime}~${timeItem.cycleEndTime} / `;
          //   });
          // }
          // } else {
          //   cycleTime = `${item.cycleWeekDay ? item.cycleWeekDay : ''} `;
          //   if (item.timeList && item.timeList.length > 0) {
          //     item.timeList.forEach((timeItem) => {
          //       cycleTime += `${timeItem.cycleStartTime}~${timeItem.cycleEndTime} / `;
          //     });
          //   }
          // }
          // cycleTime = cycleTime.substring(0, cycleTime.length - 2);

          listData.push({
            ...item,
            // cycleType: `${item.startDate}~${item.endDate} / ${dataCode?.meaning}${cycleTime}`,
            material: Object.keys(materialObj).length ? materialObj.name : '',
            key: index + 1,
          });
          materialObj = {};
        });
        this.advertListDataSource = listData;
      });
    }

    if (this.currentType === 'NOTICE') {
      const { page, size } = this.noticeListParams;
      const data = await this.deviceUseCase.getNoticePlayPlan(
        id,
        page,
        size,
        status,
        this.currentName,
      );
      const noticeData: PlayPlanNoticeDataConfig[] = [];

      runInAction(() => {
        this.noticeListData = cloneDeep(data);
        this.noticeListData.content.forEach((item, index) => {
          noticeData.push({
            ...item,
            key: index + 1,
          });
        });
        this.noticeListDataSource = noticeData;
      });
    }
  };

  // 下拉选择框广告/紧急通知change
  public selectChange = (value: string): void => {
    this.currentType = value;
    this.currentStatus = 'ALL';
    this.advertListParams = {
      page: 0,
      size: 5,
    };
    this.noticeListParams = {
      page: 0,
      size: 5,
    };
    this.getPlayPlanData(this.currentId);
  };

  // 下拉选择框广告状态change
  public selectStatusChange = (value: string): void => {
    this.currentStatus = value;
    this.advertListParams = {
      page: 0,
      size: 5,
    };
    this.getPlayPlanData(this.currentId);
  };

  // 广告分页切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.advertListParams.page = page - 1;
    if (pageSize) {
      this.advertListParams.size = pageSize;
    }
    this.getPlayPlanData(this.currentId);
  };

  // 紧急广告分页切换页码
  public urgentPageChange = (page: number, pageSize?: number): void => {
    this.noticeListParams.page = page - 1;
    if (pageSize) {
      this.noticeListParams.size = pageSize;
    }
    this.getPlayPlanData(this.currentId);
  };

  // 获取广告详情数据
  public getMaterialUrl = async (record: PlayPlanAdvertDataConfig): Promise<void> => {
    if (record.materialList && record.materialList.length > 0) {
      if (record.materialList[0].type === UploadType.MP4) {
        const videoObj = await this.fileUseCase.getPreviewUrl(record.materialList[0].fileKey || '');
        this.videoSrc = videoObj.fileTokenUrl || '';
      } else {
        const imageObj = await this.fileUseCase.getPreviewUrl(record.materialList[0].fileKey || '');
        this.imageSrc = imageObj.fileTokenUrl || '';
      }
    }
  };

  // 请求快码数据
  public playPlanGetLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取周期快码数据
        if (code === LookupsCodeTypes.AD_CYCLE_TYPE_CODE) {
          this.cycleCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.cycleCode = [];
      });
    }
  };

  // 初始化数据
  public initialData = (): void => {
    this.advertListParams = {
      page: 0,
      size: 5,
    };
    this.noticeListParams = {
      page: 0,
      size: 5,
    };
    this.advertListDataSource = [];
    this.noticeListDataSource = [];
    this.imageSrc = '';
    this.videoSrc = '';
    this.currentId = 0;
    this.currentType = 'AD';
    this.currentStatus = 'ALL';
  };

  // 搜索
  public onSearch = (e: string): void => {
    if (e) {
      this.currentName = e;
    } else {
      this.currentName = undefined;
    }
    this.getPlayPlanData(this.currentId);
  };
}
