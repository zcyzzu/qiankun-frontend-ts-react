import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../utils/index';
import NoticeApproveListViewModel, {
  NoticeApproveListDataConfig,
  NoticeApproveParamsConfig,
} from './viewModel';
import {
  NOTICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import NoticeUseCase from '../../../domain/useCases/noticeUseCase';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';

import { NoticeApproveListItemConfig } from '../../../domain/entities/noticeEntities';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { DeviceStatus } from '../advertisementApproveList/viewModel';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';

@injectable()
export default class NoticeApproveListViewModelImpl implements NoticeApproveListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // NoticeUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public noticeApproveListItemData: NoticeApproveListItemConfig;
  public queryParams: NoticeApproveParamsConfig;
  public selectedStore: NoticeApproveListDataConfig;
  public noticeApproveListData: CommonPagesGeneric<NoticeApproveListItemConfig>;
  public noticeApproveListDataSource: NoticeApproveListDataConfig[];
  public statusData: LookupsEntity[];
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.noticeApproveListItemData = {};
    this.noticeApproveListDataSource = [];
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.noticeApproveListData = {
      content: [],
    };
    this.selectedStore = {};
    this.statusData = [];
    makeObservable(this, {
      noticeApproveListItemData: observable,
      noticeApproveListDataSource: observable,
      noticeApproveListData: observable,
      statusData: observable,
      permissionsData: observable,
      getNoticeApproveList: action,
      pageChange: action,
      sizeChange: action,
      selectStatus: action,
      getStatus: action,
      onFinish: action,
      getApproveList: action,
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
    this.getNoticeApproveList();
  };

  // 获取仅自己审批的数据
  public getApproveList = (checked: boolean): void => {
    console.log(checked, 'getApproveList');
    if (checked) {
      this.queryParams.flag = checked;
    } else {
      delete this.queryParams.flag;
    }
    this.queryParams.page = 0;
    this.getNoticeApproveList();
  };

  //表单搜索
  public onFinish = (values: NoticeApproveParamsConfig): void => {
    const { content } = values;
    if (content) {
      this.queryParams.content = content;
    } else {
      delete this.queryParams.content;
    }
    this.queryParams.page = 0;
    this.getNoticeApproveList();
  };

  // 获取列表数据
  public getNoticeApproveList = async (): Promise<void> => {
    runInAction(async () => {
      const listData: NoticeApproveListDataConfig[] = [];
      const { page, size, status, content, flag } = this.queryParams;
      try {
        const data = await this.noticeUseCase.getApproveNoticeList(
          page,
          size,
          status,
          content,
          flag,
        );
        runInAction(() => {
          this.noticeApproveListData = data;
          if (this.noticeApproveListData.content) {
            this.noticeApproveListData.content.forEach(
              (item: NoticeApproveListDataConfig, index: number) => {
                listData.push({
                  ...item,
                  key: index + 1,
                });
              },
            );
          }
          this.noticeApproveListDataSource = listData;
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
    this.getNoticeApproveList();
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
    };
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
