import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import NoticePlayListViewModel, {
  NoticePlayListDataConfig,
  NoticePlayParamsConfig,
} from './viewModel';
import {
  NOTICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import NoticeUseCase from '../../../domain/useCases/noticeUseCase';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import {
  NoticePlayListItemConfig,
  OperateNoticeEntity,
} from '../../../domain/entities/noticeEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { DeviceStatus } from '../../approve/advertisementApproveList/viewModel';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

import { StoreListItemConfig } from '../../../domain/entities/deviceEntities';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class NoticePlayListViewModelImpl implements NoticePlayListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // NoticeUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public noticePlayListItemData: NoticePlayListItemConfig;
  public queryParams: NoticePlayParamsConfig;
  public selectedStore: NoticePlayListDataConfig;
  public noticePlayListData: CommonPagesGeneric<NoticePlayListItemConfig>;
  public noticePlayListDataSource: NoticePlayListDataConfig[];
  public storesListData: StoreListItemConfig[];
  public statusData: LookupsEntity[];
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.noticePlayListItemData = {};
    this.noticePlayListDataSource = [];
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.noticePlayListData = {
      content: [],
    };
    this.selectedStore = {};
    this.storesListData = [];
    this.statusData = [];
    makeObservable(this, {
      noticePlayListItemData: observable,
      noticePlayListDataSource: observable,
      noticePlayListData: observable,
      storesListData: observable,
      statusData: observable,
      permissionsData: observable,
      getNoticePlayList: action,
      pageChange: action,
      sizeChange: action,
      getStoresList: action,
      onFinish: action,
      getStatus: action,
      onOperate: action,
      delItem: action,
      getPermissionsData: action,
      setPermissionsData: action,
    });
  }

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

  //表单搜索
  public onFinish = (values: NoticePlayParamsConfig): void => {
    const { content, deviceName } = values;
    if (content) {
      this.queryParams.content = content;
    } else {
      delete this.queryParams.content;
    }
    if (deviceName) {
      this.queryParams.deviceName = deviceName;
    } else {
      delete this.queryParams.deviceName;
    }
    this.queryParams.page = 0;
    this.getNoticePlayList();
  };
  // 获取列表数据
  public getNoticePlayList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: NoticePlayListDataConfig[] = [];
      const { page, size, status, content, deviceName, storeId } = this.queryParams;
      try {
        const data = await this.noticeUseCase.getNoticePlayList(
          page,
          size,
          status,
          content,
          deviceName,
          storeId,
        );
        runInAction(() => {
          this.noticePlayListData = data;
          if (this.noticePlayListData.content) {
            this.noticePlayListData.content.forEach(
              (item: NoticePlayListItemConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
          this.noticePlayListDataSource = listData;
        });
      } catch (e) {
        utils.globalMessge({
          content: `获取列表失败，${e.message}`,
          type: 'error',
        });
      }
    });
  };

  // 获取播放状态快码
  public getStatus = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.NOTICE_STATUS_CODE);
      runInAction(() => {
        this.statusData = [...this.rootContainerUseCase.lookupsValue];
        this.statusData = this.statusData.filter((item) => item.value !== DeviceStatus.Editing);
      });
    } catch (error) {
      runInAction(() => {
        this.statusData = [];
      });
    }
  };
  // 状态-查询表单数据
  public selectStatus = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.status = e;
    } else {
      delete this.queryParams.status;
    }
    this.queryParams.page = 0;
    this.getNoticePlayList();
  };

  // 项目/门店-查询表单数据
  public selectStores = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.storeId = e;
    } else {
      delete this.queryParams.storeId;
    }
    this.queryParams.page = 0;
    this.getNoticePlayList();
  };
  // 切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.queryParams.page = page - 1;
    if (pageSize) {
      this.queryParams.size = pageSize;
    }
    this.getNoticePlayList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 删除列表单项数据
  public delItem = async (record: NoticePlayListDataConfig): Promise<void> => {
    try {
      await this.noticeUseCase.deleteNotice(record.id);
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
    this.getNoticePlayList();
  };

  // 操作事件
  public onOperate = async (params: OperateNoticeEntity): Promise<void> => {
    await this.noticeUseCase.getOperateNotice(params);
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
