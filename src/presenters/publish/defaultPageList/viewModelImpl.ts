import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import PublishDefaultPageListViewModel, {
  PublishDefaultPageListDataConfig,
  DefaultPageParamsConfig,
} from './viewModel';
import {
  ROOT_CONTAINER_IDENTIFIER,
  DEFAULT_IDENTIFIER,
  FILE_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import RootContainereViewModel from '../../../presenters/rootContainer/viewModel';
import DefaultPageUseCase from '../../../domain/useCases/defaultPageUseCase';
import { PublishDefaultPageListItemConfig } from '../../../domain/entities/defaultPageEntities';
import { CommonPagesGeneric, UploadType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import FileUseCase from '../../../domain/useCases/fileUseCase';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class PublishDefaultPageListViewModelImpl
  implements PublishDefaultPageListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // defaultPageUseCase
  @inject(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_USE_CASE)
  private defaultPageUseCase!: DefaultPageUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );
  public publishDefaultPageListItemData: PublishDefaultPageListItemConfig;
  public queryParams: DefaultPageParamsConfig;
  public publishDefaultPageListData: CommonPagesGeneric<PublishDefaultPageListItemConfig>;
  public publishDefaultPageListDataSource: PublishDefaultPageListDataConfig[];
  public deviceTypeData: LookupsEntity[];
  public imageSrc: string;
  public videoSrc: string;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    const { userInfo } = this.rootContainereViewModel;
    this.publishDefaultPageListItemData = {};
    this.publishDefaultPageListDataSource = [];
    this.deviceTypeData = [];
    this.queryParams = {
      page: 0,
      size: 10,
      unitId: userInfo.tenantId,
    };
    this.publishDefaultPageListData = {
      content: [],
    };
    this.imageSrc = '';
    this.videoSrc = '';
    makeObservable(this, {
      publishDefaultPageListItemData: observable,
      publishDefaultPageListDataSource: observable,
      publishDefaultPageListData: observable,
      deviceTypeData: observable,
      imageSrc: observable,
      videoSrc: observable,
      permissionsData: observable,
      getPublishDefaultPageList: action,
      pageChange: action,
      sizeChange: action,
      selectDeviceList: action,
      getDeviceType: action,
      deleteItem: action,
      getMaterialUrl: action,
      getPermissionsData: action,
      setPermissionsData: action,
      initQueryParams: action,
    });
  }

  // 初始化查询参数
  public initQueryParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
    };
  };
  // 获取设备类型快码
  public getDeviceType = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_REPEAT);
      runInAction(() => {
        this.deviceTypeData = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.deviceTypeData = [];
      });
    }
  };

  // 获取列表数据
  public getPublishDefaultPageList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: PublishDefaultPageListDataConfig[] = [];
      const { page, size, deviceType, unitId } = this.queryParams;
      try {
        const data = await this.defaultPageUseCase.getPublishDefaultPageList(
          page,
          size,
          unitId,
          deviceType,
        );
        runInAction(() => {
          this.publishDefaultPageListData = data;
          if (this.publishDefaultPageListData.content) {
            this.publishDefaultPageListData.content.forEach(
              (item: PublishDefaultPageListDataConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
        });
        this.publishDefaultPageListDataSource = listData;
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
    this.getPublishDefaultPageList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 删除列表单项数据
  public deleteItem = async (record: PublishDefaultPageListDataConfig): Promise<void> => {
    try {
      await this.defaultPageUseCase.deletePublishDefaultItem(record.id);
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
    this.getPublishDefaultPageList();
  };

  //设备下拉框选项
  public selectDeviceList = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.deviceType = e;
    } else {
      delete this.queryParams.deviceType;
    }
    this.queryParams.page = 0;
    this.getPublishDefaultPageList();
  };

  // 获取素材url
  public getMaterialUrl = async (record: PublishDefaultPageListDataConfig): Promise<void> => {
    if (record.material?.type === UploadType.JPG || record.material?.type === UploadType.PNG) {
      const imageObj = await this.fileUseCase.getPreviewUrl(record.material?.fileKey || '');
      this.imageSrc = imageObj.fileTokenUrl || '';
    }
    if (record.material?.type === UploadType.MP4) {
      const videoObj = await this.fileUseCase.getPreviewUrl(record.material?.fileKey || '');
      this.videoSrc = videoObj.fileTokenUrl || '';
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
