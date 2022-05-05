/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-21 15:19:18
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import DownLogModalViewModel, { DownLogListDataConfig, LogListParamsConfig } from './viewModel';
import { DEVICE_IDENTIFIER, FILE_IDENTIFIER } from '../../../constants/identifiers';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import FileUseCase from '../../../domain/useCases/fileUseCase';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import utils from '../../../utils/index';

@injectable()
export default class DownLogModalViewModelImpl implements DownLogModalViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private DeviceUseCase!: DeviceUseCase;
  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  // 下载日志弹窗状态
  public downLogModalVisible: boolean;
  public deviceType: string;
  public logListData: CommonPagesGeneric<DownLogListDataConfig>;
  public logListDataSource: DownLogListDataConfig[];
  public currentDeviceId: number;
  public logListParams: LogListParamsConfig;

  public constructor() {
    this.deviceType = '';
    this.downLogModalVisible = false;
    this.logListData = {
      content: [],
    };
    this.logListDataSource = [];
    this.currentDeviceId = 0;
    this.logListParams = {
      page: 0,
      size: 3,
    };

    makeObservable(this, {
      downLogModalVisible: observable,
      deviceType: observable,
      logListData: observable,
      logListDataSource: observable,
      currentDeviceId: observable,
      logListParams: observable,
      setDownLogModalVisible: action,
      getLogListData: action,
      downLog: action,
      uploadLog: action,
      pageChange: action,
      onRefresh: action,
    });
  }

  //设置标签model显示隐藏
  public setDownLogModalVisible = (): void => {
    this.downLogModalVisible = !this.downLogModalVisible;
    if (!this.downLogModalVisible) {
      this.logListParams = {
        page: 0,
        size: 3,
      };
    }
  };

  // 获取日志列表数据
  public getLogListData = async (id: number): Promise<void> => {
    try {
      const { page, size } = this.logListParams;
      this.currentDeviceId = id;
      const data = await this.DeviceUseCase.getLogList(this.currentDeviceId, page, size);
      runInAction(() => {
        const listData: DownLogListDataConfig[] = [];
        this.logListData = data;
        if (this.logListData.content) {
          this.logListData.content.forEach((item) => {
            listData.push({
              ...item,
              key: item.id,
            });
          });
        }
        this.logListDataSource = listData;
      });
    } catch (error) {
      utils.globalMessge({
        content: `日志列表获取失败，${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 下载日志
  public downLog = (record: DownLogListDataConfig): void => {
    this.fileUseCase
      .downloadByKey(record.fileKey || '')
      .then((res) => {
        const eleLink = document.createElement('a');
        eleLink.download = `${(record.creationDate as string).replace(
          new RegExp(':', 'gm'),
          '.',
        )}${record.fileName?.substring(record.fileName.indexOf('.'), record.fileName.length)}`;
        eleLink.style.display = 'none';
        eleLink.href = URL.createObjectURL(res);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      })
      .catch((err) => {
        console.log(err);
        utils.globalMessge({
          content: `下载日志失败，${(err as Error).message}`,
          type: 'error',
        });
      });
  };

  // 上传设备日志
  public uploadLog = (): void => {
    this.DeviceUseCase.getUploadLog(this.currentDeviceId)
      .then(() => {
        utils.globalMessge({
          content: '上传设备日志指令已发送给设备端，请刷新查看上传记录～',
          type: 'success',
        });
      })
      .catch((err) => {
        utils.globalMessge({
          content: `${(err as Error).message}`,
          type: 'error',
        });
      });
  };

  // 分页切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.logListParams.page = page - 1;
    if (pageSize) {
      this.logListParams.size = pageSize;
    }
    this.getLogListData(this.currentDeviceId);
  };

  // 刷新
  public onRefresh = (): void => {
    this.logListParams.page = 0;
    this.getLogListData(this.currentDeviceId);
  };
}
