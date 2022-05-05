/*
 * @Author: liyou
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:37:39
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import DefaultPageListViewModel, {
  DefaultPageListDataConfig,
  DefaultPageParamsConfig,
} from './viewModel';
import {
  ROOT_CONTAINER_IDENTIFIER,
  DEFAULT_IDENTIFIER,
  FILE_IDENTIFIER,
} from '../../../constants/identifiers';
import { DefaultPageListItemConfig } from '../../../domain/entities/defaultPageEntities';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import DefaultPageUseCase from '../../../domain/useCases/defaultPageUseCase';
import { CommonPagesGeneric, UploadType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import FileUseCase from '../../../domain/useCases/fileUseCase';

@injectable()
export default class DefaultPageListViewModelImpl implements DefaultPageListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // defaultPageUseCase
  @inject(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_USE_CASE)
  private defaultPageUseCase!: DefaultPageUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  public defaultPageListItemData: DefaultPageListItemConfig;
  public queryParams: DefaultPageParamsConfig;
  public defaultPageListData: CommonPagesGeneric<DefaultPageListItemConfig>;
  public defaultPageListDataSource: DefaultPageListDataConfig[];
  public deviceTypeData: LookupsEntity[];
  public imageSrc: string;
  public videoSrc: string;
  public constructor() {
    this.defaultPageListItemData = {};
    this.defaultPageListDataSource = [];
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.defaultPageListData = {
      content: [],
    };
    this.deviceTypeData = [];
    this.imageSrc = '';
    this.videoSrc = '';
    makeObservable(this, {
      defaultPageListItemData: observable,
      defaultPageListDataSource: observable,
      defaultPageListData: observable,
      deviceTypeData: observable,
      imageSrc: observable,
      videoSrc: observable,
      getDefaultPageList: action,
      pageChange: action,
      sizeChange: action,
      selectDeviceList: action,
      getMaterialUrl: action,
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

  //设备下拉框选项
  public selectDeviceList = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.deviceType = e;
    } else {
      delete this.queryParams.deviceType;
    }
    this.queryParams.page = 0;
    this.getDefaultPageList();
  };

  // 获取列表数据
  public getDefaultPageList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: DefaultPageListDataConfig[] = [];
      const { page, size, deviceType } = this.queryParams;
      try {
        const data = await this.defaultPageUseCase.getDefaultPageList(page, size, deviceType);
        runInAction(() => {
          this.defaultPageListData = data;
          if (this.defaultPageListData.content) {
            this.defaultPageListData.content.forEach(
              (item: DefaultPageListDataConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
        });
        this.defaultPageListDataSource = listData;
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
    this.getDefaultPageList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 删除列表单项数据
  public deleteItem = async (record: DefaultPageListDataConfig): Promise<void> => {
    try {
      await this.defaultPageUseCase.deleteDefaultPageItem(record.id);
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
    this.getDefaultPageList();
  };
  // 获取素材url
  public getMaterialUrl = async (record: DefaultPageListDataConfig): Promise<void> => {
    if (record.material?.type === UploadType.JPG || record.material?.type === UploadType.PNG) {
      const imageObj = await this.fileUseCase.getPreviewUrl(record.material?.fileKey || '');
      this.imageSrc = imageObj.fileTokenUrl || '';
    }
    if (record.material?.type === UploadType.MP4) {
      const videoObj = await this.fileUseCase.getPreviewUrl(record.material?.fileKey || '');
      this.videoSrc = videoObj.fileTokenUrl || '';
    }
  };
}
