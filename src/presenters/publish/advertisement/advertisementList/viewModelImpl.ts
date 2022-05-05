/*
 * @Author: mayajing
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:45:40
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { AdvertisementListItemConfig } from '../../../../domain/entities/advertisementEntities';
import AdvertisementListViewModel, {
  AdvertisementListDataConfig,
  AdvertisementParamsConfig,
} from './viewModel';
import NoticeUseCase from '../../../../domain/useCases/noticeUseCase';
import { CommonPagesGeneric, UploadType } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import {
  ADVERTISEMENT_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  NOTICE_IDENTIFIER,
  FILE_IDENTIFIER,
  PERMISSIONS,
} from '../../../../constants/identifiers';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import RootContainerUseCase from '../../../../domain/useCases/rootContainerUseCase';
import utils from '../../../../utils/index';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';
import FileUseCase from '../../../../domain/useCases/fileUseCase';
import PermissionsUseCase from '../../../../domain/useCases/permissionsUseCase';

@injectable()
export default class AdvertisementListViewModellImpl implements AdvertisementListViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;

  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // NoticeUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public advertisementListItemData: AdvertisementListItemConfig;
  public queryParams: AdvertisementParamsConfig;
  public advertisementListData: CommonPagesGeneric<AdvertisementListDataConfig>;
  public advertisementListDataSource: AdvertisementListDataConfig[];
  public checkStaus: string | boolean;
  public statusData: LookupsEntity[];
  public storesListData: StoreListItemConfig[];
  public imageSrc: string;
  public videoSrc: string;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.advertisementListItemData = {};
    this.advertisementListDataSource = [];
    this.storesListData = [];
    this.statusData = [];
    this.queryParams = {
      page: 0,
      size: 10,
      queryType: 'AD',
    };
    this.advertisementListData = {
      content: [],
    };
    this.checkStaus = '';
    this.imageSrc = '';
    this.videoSrc = '';
    makeObservable(this, {
      checkStaus: observable,
      advertisementListItemData: observable,
      advertisementListDataSource: observable,
      statusData: observable,
      storesListData: observable,
      imageSrc: observable,
      videoSrc: observable,
      permissionsData: observable,
      getAdvertisementList: action,
      getStatus: action,
      pageChange: action,
      sizeChange: action,
      onFinish: action,
      selectStatus: action,
      selectStores: action,
      getTenantStatus: action,
      deleteItem: action,
      getMaterialUrl: action,
      getPermissionsData: action,
      setPermissionsData: action,
      initQueryParams: action,
    });
  }

  // 查询是否可发布广告
  public getTenantStatus = async (): Promise<string | boolean> => {
    await this.AdvertisementUseCase.getTenantStatus()
      .then((res) => {
        this.checkStaus = res;
      })
      .catch((error) => {
        if (error.failed) {
          utils.globalMessge({
            content: error.message,
            type: 'error',
          });
        }
      });
    return this.checkStaus;
  };
  // 获取发布状态快码
  public getStatus = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.AD_QUERY_APPROVE_CODE);
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

  // 获取列表数据
  public getAdvertisementList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: AdvertisementListDataConfig[] = [];
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
        const data = await this.AdvertisementUseCase.getPublishAdvertisementList(
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
          this.advertisementListData = data;
          if (this.advertisementListData.content) {
            this.advertisementListData.content.forEach(
              (item: AdvertisementListDataConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
          this.advertisementListDataSource = listData;
        });
      } catch (e) {
        utils.globalMessge({
          content: `获取列表失败，${e.message}`,
          type: 'error',
        });
      }
    });
  };

  // 切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.queryParams.page = page - 1;
    if (pageSize) {
      this.queryParams.size = pageSize;
    }
    this.getAdvertisementList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 删除列表单项数据
  public deleteItem = async (record: AdvertisementListDataConfig): Promise<void> => {
    try {
      await this.AdvertisementUseCase.deletePublishItem(record.adId);
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
    this.getAdvertisementList();
  };

  // 发布状态-查询表单数据
  public selectStatus = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.approvalStatus = e;
    } else {
      delete this.queryParams.approvalStatus;
    }
    this.queryParams.page = 0;
    this.getAdvertisementList();
  };

  // 项目/广告发布种类-查询表单数据
  public selectStores = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.storeIdList = e;
    } else {
      delete this.queryParams.storeIdList;
    }
    this.queryParams.page = 0;
    this.getAdvertisementList();
  };

  //表单搜索
  public onFinish = (values: AdvertisementParamsConfig): void => {
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
    this.getAdvertisementList();
  };

  // 初始化查询参数
  public initQueryParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
      queryType: 'AD',
    };
  };

  // 获取素材url
  public getMaterialUrl = async (record: AdvertisementListDataConfig): Promise<void> => {
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

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };
}
