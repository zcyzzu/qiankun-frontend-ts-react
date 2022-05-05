/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:18:12
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import utils from '../../../../utils/index';
import {
  NOTICE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PERMISSIONS,
} from '../../../../constants/identifiers';
import NoticeListViewModel, { NoticeListDataConfig, NoticeParamsConfig } from './viewModel';
import NoticeUseCase from '../../../../domain/useCases/noticeUseCase';
import RootContainerUseCase from '../../../../domain/useCases/rootContainerUseCase';
import {
  NoticeListItemConfig,
  NoticeItemDetailsEntity,
} from '../../../../domain/entities/noticeEntities';
import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';
import { CommonPagesGeneric } from '../../../../common/config/commonConfig';
import { DeviceStatus } from '../../../approve/advertisementApproveList/viewModel';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import PermissionsUseCase from '../../../../domain/useCases/permissionsUseCase';

@injectable()
export default class NoticeListViewModelImpl implements NoticeListViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // NoticeUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public noticeListItemData: NoticeListItemConfig;
  public queryParams: NoticeParamsConfig;
  // 发布紧急通知 查看内容单项数据
  public createNoticeModalItemData: NoticeItemDetailsEntity;
  public noticeListData: CommonPagesGeneric<NoticeListItemConfig>;
  public noticeListDataSource: NoticeListDataConfig[];
  public storesListData: StoreListItemConfig[];
  public statusData: LookupsEntity[];
  public checkStaus: string | boolean;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  public constructor() {
    this.noticeListItemData = {};
    this.noticeListDataSource = [];
    this.statusData = [];
    this.queryParams = {
      page: 0,
      size: 10,
    };
    this.storesListData = [];
    this.noticeListData = { content: [] };
    this.createNoticeModalItemData = {
      color: '#000',
      backgroundColor: '#4096ff',
      content: '效果预览示例',
    };
    this.checkStaus = '';

    makeObservable(this, {
      createNoticeModalItemData: observable,
      onFinishByCreateNotice: action,
      noticeListItemData: observable,
      noticeListDataSource: observable,
      noticeListData: observable,
      storesListData: observable,
      statusData: observable,
      checkStaus: observable,
      permissionsData: observable,
      getStoresList: action,
      getNoticeList: action,
      pageChange: action,
      sizeChange: action,
      selectStatus: action,
      selectStores: action,
      onFinish: action,
      deleteNotice: action,
      getStatus: action,
      setCreateNoticeModalItemData: action,
      initialData: action,
      getCheckDevice: action,
      getPermissionsData: action,
      setPermissionsData: action,
      initQueryParams: action,
    });
  }

  // 获取列表数据
  public getNoticeList = async (): Promise<void> => {
    const listData: NoticeListDataConfig[] = [];
    const { page, size, approveStatus, content, name, storeId } = this.queryParams;
    try {
      const data = await this.noticeUseCase.getNoticeList(
        page,
        size,
        approveStatus,
        content,
        name,
        storeId,
      );
      runInAction(() => {
        this.noticeListData = data;
        if (this.noticeListData.content) {
          this.noticeListData.content.forEach((item: NoticeListItemConfig, index: number) => {
            listData.push({
              ...item,
              key: index + 1,
            });
          });
        }
        this.noticeListDataSource = listData;
      });
    } catch (e) {
      utils.globalMessge({
        content: `获取列表失败，${e.message}`,
        type: 'error',
      });
    }
  };

  // 获取项目/门店列表数据
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
  public onFinish = (values: NoticeParamsConfig): void => {
    const { content, name } = values;
    if (content) {
      this.queryParams.content = content;
    } else {
      delete this.queryParams.content;
    }
    if (name) {
      this.queryParams.name = name;
    } else {
      delete this.queryParams.name;
    }
    this.queryParams.page = 0;
    this.getNoticeList();
  };

  // 切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.queryParams.page = page - 1;
    if (pageSize) {
      this.queryParams.size = pageSize;
    }
    this.getNoticeList();
  };

  // 改变页码大小回调
  public sizeChange = (current: number, size: number): void => {
    console.log(current, size);
  };

  // 删除列表单项数据
  public deleteNotice = async (record: NoticeListDataConfig): Promise<void> => {
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
    this.getNoticeList();
  };

  // 获取发布状态快码
  public getStatus = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.AD_QUERY_APPROVE_CODE);
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
      this.queryParams.approveStatus = e;
    } else {
      delete this.queryParams.approveStatus;
    }
    this.getNoticeList();
  };

  // 项目/门店-查询表单数据
  public selectStores = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.storeId = e;
    } else {
      delete this.queryParams.storeId;
    }
    this.getNoticeList();
  };

  // 初始化查询参数
  public initQueryParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
    };
  };

  // 设置单项数据
  public setCreateNoticeModalItemData = (value: string, type: string): void => {
    if (type === 'color') {
      Object.assign(this.createNoticeModalItemData, { color: value });
    } else {
      Object.assign(this.createNoticeModalItemData, { backgroundColor: value });
    }
  };

  // 发布紧急通知提交
  public onFinishByCreateNotice = (current: number, values: NoticeItemDetailsEntity): void => {
    Object.assign(this.createNoticeModalItemData, values);
  };

  // 初始化数据
  public initialData = (): void => {
    this.createNoticeModalItemData = {
      color: '#000',
      backgroundColor: '#4096ff',
      content: '效果预览示例',
    };
  };

  // 发布通知检查有无设备
  public getCheckDevice = async (): Promise<string | boolean> => {
    await this.noticeUseCase
      .getCheckDevice()
      .then(() => {
        this.checkStaus = true;
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

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };
}
