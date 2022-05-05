/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:52
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:42:38
 */
import { cloneDeep } from 'lodash';
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import AdvertDetailsTabViewModel, {
  SpecificDeviceDataConfig,
  DeviceListParamsConfig,
} from './viewModel';
import {
  AdvertisementDetailsEntity,
  AdvertisementDetailsDeviceListEntity,
  MaterialListEntity,
} from '../../../../../domain/entities/advertisementEntities';
import {
  ADVERTISEMENT_IDENTIFIER,
  FILE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../../../constants/identifiers';
import AdvertisementUseCase from '../../../../../domain/useCases/advertisementUseCase';
import FileUseCase from '../../../../../domain/useCases/fileUseCase';
import { LookupsEntity } from '../../../../../domain/entities/lookupsEntities';
import RootContainerUseCase from '../../../../../domain/useCases/rootContainerUseCase';
import MaterialPreviewModal from '../../../../../common/components/materialPreviewModal/index';
import { DeviceType } from '../../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../../constants/lookupsCodeTypes';

@injectable()
export default class AdvertDetailsTabViewModelImpl implements AdvertDetailsTabViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;
  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  public specificDeviceListData: AdvertisementDetailsDeviceListEntity;
  public specificDeviceListDataSource: SpecificDeviceDataConfig[];
  public deviceListParams: DeviceListParamsConfig;
  public advertisementDetailsData: AdvertisementDetailsEntity;
  // 具体设备内容
  public deviceContent: string;
  public advertisementDetailsDeviceList: AdvertisementDetailsEntity;
  public currentId: number;
  public imageSrc: string;
  public videoSrc: string;
  public cycleCode: LookupsEntity[];
  public advertisementLevelCode: LookupsEntity[];
  public srcList: string[];
  public materialType: string[];
  public modalIndex: number;
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
    this.deviceContent = 'ADMACHINE';
    this.advertisementDetailsData = {};
    this.advertisementDetailsDeviceList = {};
    this.currentId = 0;
    this.imageSrc = '';
    this.videoSrc = '';
    this.cycleCode = [];
    this.advertisementLevelCode = [];
    this.srcList = [];
    this.materialType = [];
    this.modalIndex = 0;
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
      deviceContent: observable,
      advertisementDetailsData: observable,
      advertisementDetailsDeviceList: observable,
      currentId: observable,
      imageSrc: observable,
      videoSrc: observable,
      cycleCode: observable,
      advertisementLevelCode: observable,
      srcList: observable,
      materialType: observable,
      modalIndex: observable,
      pageChange: action,
      switchDevice: action,
      getAdvertisementDetails: action,
      getAdvertisementDetailsDeviceList: action,
      getListNum: action,
      getLookupsValue: action,
      initialData: action,
      setMaterialPreview: action,
    });
  }

  // 获取设备列表数据
  public getListNum = async (id: number, deviceType: string): Promise<void> => {
    const { page, size } = this.deviceListParams;
    const data = await this.AdvertisementUseCase.getAdvertisementDetailsDeviceList(
      id,
      deviceType,
      page,
      size,
    );
    runInAction(() => {
      if (deviceType === DeviceType.Advertisement) {
        this.dataLengthAd = data.page?.totalElements || 0;
      } else if (deviceType === DeviceType.Cashier) {
        this.dataLengthCa = data.page?.totalElements || 0;
      } else if (deviceType === DeviceType.Led) {
        this.dataLengthLed = data.page?.totalElements || 0;
      }
    });
  };
  public getAdvertisementDetailsDeviceList = async (
    id: number,
    deviceType: string,
  ): Promise<void> => {
    this.currentId = id;
    const { page, size } = this.deviceListParams;
    const data = await this.AdvertisementUseCase.getAdvertisementDetailsDeviceList(
      id,
      deviceType,
      page,
      size,
    );
    runInAction(() => {
      this.specificDeviceListData = cloneDeep(data);
      const listData: SpecificDeviceDataConfig[] = [];
      this.specificDeviceListData.page?.content.forEach((item, index) => {
        listData.push({
          ...item,
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
    this.getAdvertisementDetailsDeviceList(this.currentId, this.deviceContent);
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
    this.getAdvertisementDetailsDeviceList(this.currentId, this.deviceContent);
  };

  // 获取广告详情数据
  public getAdvertisementDetails = async (advertisementId: number): Promise<void> => {
    const data = await this.AdvertisementUseCase.getAdvertisementDetails(advertisementId);
    this.advertisementDetailsData = cloneDeep(data);
    if (
      this.advertisementDetailsData.materialList &&
      this.advertisementDetailsData.materialList.length > 0
    ) {
      this.advertisementDetailsData.materialList.forEach(async (item, index) => {
        this.srcList.push('');
        this.materialType.push('');
        this.materialType[index] =
          (this.advertisementDetailsData.materialList as MaterialListEntity[])[index].type || '';
        const srcObj = await this.fileUseCase.getPreviewUrl(
          (this.advertisementDetailsData.materialList as MaterialListEntity[])[index].fileKey || '',
        );
        this.srcList[index] = srcObj.fileTokenUrl || '';
      });
    }
  };

  // 初始化数据
  public setMaterialPreview = (
    materialRef: React.RefObject<MaterialPreviewModal>,
    index: number,
  ): void => {
    this.modalIndex = index;
    materialRef.current?.setIsModalVisible();
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取周期快码数据
        if (code === LookupsCodeTypes.AD_CYCLE_TYPE_CODE) {
          this.cycleCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 广告等级快码数据
        if (code === LookupsCodeTypes.AD_LEVEL_TYPE_CODE) {
          this.advertisementLevelCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.cycleCode = [];
        this.advertisementLevelCode = [];
      });
    }
  };

  // 初始化数据
  public initialData = (): void => {
    this.deviceContent = '';
    this.advertisementDetailsData = {};
    this.advertisementDetailsDeviceList = {};
    this.currentId = 0;
    this.imageSrc = '';
    this.videoSrc = '';
    this.srcList = [];
    this.materialType = [];
    this.modalIndex = 0;
  };
}
