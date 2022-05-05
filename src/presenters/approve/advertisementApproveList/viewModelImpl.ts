import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import AdvertisementApproveListViewModel, {
  AdvertisementApproveListDataConfig,
  AdvertisementApproveParamsConfig,
} from './viewModel';
import {
  ADVERTISEMENT_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  FILE_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import AdvertisementUseCase from '../../../domain/useCases/advertisementUseCase';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';

import { AdvertisementApproveListItemConfig } from '../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric, UploadType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import FileUseCase from '../../../domain/useCases/fileUseCase';

@injectable()
export default class AdvertisementApproveListViewModelImpl
  implements AdvertisementApproveListViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private advertisementUseCase!: AdvertisementUseCase;

  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public advertisementApproveListItemData: AdvertisementApproveListItemConfig;
  public queryParams: AdvertisementApproveParamsConfig;
  public selectedStore: AdvertisementApproveListDataConfig;
  public advertisementApproveListData: CommonPagesGeneric<AdvertisementApproveListItemConfig>;
  public advertisementApproveListDataSource: AdvertisementApproveListDataConfig[];
  public statusData: LookupsEntity[];
  public imageSrc: string;
  public videoSrc: string;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.advertisementApproveListItemData = {};
    this.advertisementApproveListDataSource = [];
    this.queryParams = {
      page: 0,
      size: 10,
      queryType: 'AD',
    };
    this.advertisementApproveListData = {
      content: [],
    };
    this.selectedStore = {};
    this.statusData = [];
    this.imageSrc = '';
    this.videoSrc = '';
    makeObservable(this, {
      advertisementApproveListItemData: observable,
      advertisementApproveListDataSource: observable,
      advertisementApproveListData: observable,
      statusData: observable,
      imageSrc: observable,
      videoSrc: observable,
      permissionsData: observable,
      getAdvertisementApproveList: action,
      pageChange: action,
      sizeChange: action,
      selectStatus: action,
      getApproveList: action,
      getStatus: action,
      onFinish: action,
      getMaterialUrl: action,
      getPermissionsData: action,
      setPermissionsData: action,
      initQueryParams: action,
    });
  }

  // 获取发布状态快码
  public getStatus = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.APPROVE_STATUS_MANAGE);
      runInAction(() => {
        this.statusData = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.statusData = [];
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
    this.getAdvertisementApproveList();
  };

  // 获取仅自己审批的广告数据
  public getApproveList = (checked: boolean): void => {
    if (checked) {
      this.queryParams.flag = checked;
    } else {
      delete this.queryParams.flag;
    }
    this.queryParams.page = 0;
    this.getAdvertisementApproveList();
  };

  //表单搜索
  public onFinish = (values: AdvertisementApproveParamsConfig): void => {
    const { name } = values;
    if (name) {
      this.queryParams.name = name;
    } else {
      delete this.queryParams.name;
    }
    this.queryParams.page = 0;
    this.getAdvertisementApproveList();
  };

  // 获取列表数据
  public getAdvertisementApproveList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: AdvertisementApproveListDataConfig[] = [];
      const { page, size, queryType, status, name, flag } = this.queryParams;
      try {
        const data = await this.advertisementUseCase.getApprovelAdvertisementList(
          page,
          size,
          queryType,
          status,
          name,
          flag,
        );
        runInAction(() => {
          this.advertisementApproveListData = data;
          if (this.advertisementApproveListData.content) {
            this.advertisementApproveListData.content.forEach(
              (item: AdvertisementApproveListDataConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
          this.advertisementApproveListDataSource = listData;
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
    this.getAdvertisementApproveList();
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
      queryType: 'AD',
    };
  };
  // 获取素材url
  public getMaterialUrl = async (record: AdvertisementApproveListDataConfig): Promise<void> => {
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
