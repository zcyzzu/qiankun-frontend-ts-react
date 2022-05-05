import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import AdvertisementPlayListViewModel, {
  AdvertisementPlayListDataConfig,
  AdvertisementPlayParamsConfig,
} from './viewModel';
import {
  ROOT_CONTAINER_IDENTIFIER,
  NOTICE_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  FILE_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import NoticeUseCase from '../../../domain/useCases/noticeUseCase';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import AdvertisementUseCase from '../../../domain/useCases/advertisementUseCase';
import {
  AdvertisementPlayListItemConfig,
  OperateAdvertisementEntity,
} from '../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric, UploadType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import FileUseCase from '../../../domain/useCases/fileUseCase';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class AdvertisementPlayListViewModelImpl implements AdvertisementPlayListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // NoticeUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private advertisementUseCase!: AdvertisementUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public advertisementPlayListItemData: AdvertisementPlayListItemConfig;
  public queryParams: AdvertisementPlayParamsConfig;
  public selectedStore: AdvertisementPlayListDataConfig;
  public advertisementPlayListData: CommonPagesGeneric<AdvertisementPlayListItemConfig>;
  public advertisementPlayListDataSource: AdvertisementPlayListDataConfig[];
  public statusData: LookupsEntity[];
  public storesListData: StoreListItemConfig[];
  public imageSrc: string;
  public videoSrc: string;
  public continuePlayName?: string;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.advertisementPlayListItemData = {};
    this.advertisementPlayListDataSource = [];
    this.queryParams = {
      page: 0,
      size: 10,
      queryType: 'PLAY_LIST',
    };
    this.advertisementPlayListData = {
      content: [],
    };
    this.selectedStore = {};
    this.statusData = [];
    this.storesListData = [];
    this.imageSrc = '';
    this.videoSrc = '';
    this.continuePlayName = undefined;

    makeObservable(this, {
      advertisementPlayListItemData: observable,
      advertisementPlayListDataSource: observable,
      advertisementPlayListData: observable,
      statusData: observable,
      storesListData: observable,
      imageSrc: observable,
      videoSrc: observable,
      continuePlayName: observable,
      permissionsData: observable,
      getAdvertisementPlayList: action,
      pageChange: action,
      onFinish: action,
      sizeChange: action,
      selectStatus: action,
      selectStores: action,
      onOperate: action,
      deleteItem: action,
      getMaterialUrl: action,
      setContinuePlayName: action,
      getPermissionsData: action,
      setPermissionsData: action,
    });
  }

  // 获取播放状态快码
  public getStatus = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.AD_PLAY_STATE_CODE);
      runInAction(() => {
        this.statusData = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.statusData = [];
      });
    }
  };
  //获取项目/门店列表数据
  public getStoresList = async (): Promise<void> => {
    try {
      await this.noticeUseCase.getStoresList();
      runInAction(() => {
        this.storesListData = this.noticeUseCase.storesListData;
      });
    } catch (e) {
      runInAction(() => {
        this.storesListData = [];
      });
    }
  };

  // 发布状态-查询表单数据
  public selectStatus = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.status = e;
    } else {
      delete this.queryParams.status;
    }
    this.queryParams.page = 0;
    this.getAdvertisementPlayList();
  };

  // 项目/广告发布种类-查询表单数据
  public selectStores = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.storeIdList = e;
    } else {
      delete this.queryParams.storeIdList;
    }
    this.queryParams.page = 0;
    this.getAdvertisementPlayList();
  };

  //表单搜索
  public onFinish = (values: AdvertisementPlayParamsConfig): void => {
    const { adName, deviceName } = values;
    if (adName) {
      this.queryParams.adName = adName;
    } else {
      delete this.queryParams.adName;
    }
    if (deviceName) {
      this.queryParams.deviceName = deviceName;
    } else {
      delete this.queryParams.deviceName;
    }
    this.queryParams.page = 0;
    this.getAdvertisementPlayList();
  };

  // 获取列表数据
  public getAdvertisementPlayList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: AdvertisementPlayListDataConfig[] = [];
      const {
        page,
        size,
        queryType,
        status,
        approvalStatus,
        storeIdList,
        adName,
        deviceName,
      } = this.queryParams;
      try {
        const data = await this.advertisementUseCase.getPublishAdvertisementList(
          page,
          size,
          queryType,
          status,
          approvalStatus,
          storeIdList,
          adName,
          deviceName,
        );
        runInAction(() => {
          this.advertisementPlayListData = data;
          if (this.advertisementPlayListData.content) {
            this.advertisementPlayListData.content.forEach(
              (item: AdvertisementPlayListItemConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
          this.advertisementPlayListDataSource = listData;
        });
      } catch (e) {
        utils.globalMessge({
          content: `获取列表失败，${e.message}`,
          type: 'error',
        });
      }
    });
  };

  // 删除列表单项数据
  public deleteItem = async (record: AdvertisementPlayListDataConfig): Promise<void> => {
    try {
      await this.advertisementUseCase.deletePlayItem(record.adId);
      utils.globalMessge({
        content: '删除成功!',
        type: 'success',
      });
    } catch (err) {
      utils.globalMessge({
        content: `删除失败，${err.message}`,
        type: 'error',
      });
    }
    this.getAdvertisementPlayList();
  };
  // 切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.queryParams.page = page - 1;
    if (pageSize) {
      this.queryParams.size = pageSize;
    }
    this.getAdvertisementPlayList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 初始化查询参数
  public initQueryParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
      queryType: 'PLAY_LIST',
    };
  };

  // 操作事件
  public onOperate = async (params: OperateAdvertisementEntity): Promise<void> => {
    await this.advertisementUseCase.getOperateAdvertisement(params);
  };

  // 获取素材url
  public getMaterialUrl = async (record: AdvertisementPlayListDataConfig): Promise<void> => {
    if (record.materialList) {
      if (
        record.materialList[0]?.type === UploadType.JPG ||
        record.materialList[0]?.type === UploadType.PNG
      ) {
        const imageObj = await this.fileUseCase.getPreviewUrl(
          record.materialList[0]?.fileKey || '',
        );
        this.imageSrc = imageObj.fileTokenUrl || '';
      }
      if (record.materialList[0]?.type === UploadType.MP4) {
        const videoObj = await this.fileUseCase.getPreviewUrl(
          record.materialList[0]?.fileKey || '',
        );
        this.videoSrc = videoObj.fileTokenUrl || '';
      }
    }
  };
  // 设置续播广告名称
  public setContinuePlayName = (e: string): void => {
    this.continuePlayName = e;
  };

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };
}
