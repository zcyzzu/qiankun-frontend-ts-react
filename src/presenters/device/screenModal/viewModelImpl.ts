/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-02-08 11:01:24
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import ScreenModalViewModel, { ScreenListParams, ScreenListData } from './viewModel';
import { DEVICE_IDENTIFIER, FILE_IDENTIFIER } from '../../../constants/identifiers';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import FileUseCase from '../../../domain/useCases/fileUseCase';
import { ScreenListEntity } from '../../../domain/entities/deviceEntities';
import utils from '../../../utils/index';

@injectable()
export default class ScreenModalViewModelImpl implements ScreenModalViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private DeviceUseCase!: DeviceUseCase;
  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private FileUseCase!: FileUseCase;
  // 标签弹窗状态
  public screenModalVisible: boolean;
  // 列表单项的数据
  public screenListData: CommonPagesGeneric<ScreenListEntity>;
  public screenListDataSource: ScreenListData[];
  public getscreenListParams: ScreenListParams;
  // 设备id
  public deviceId: number | undefined;
  public offOn: string;
  public constructor() {
    this.screenModalVisible = false;
    this.screenListData = { content: [] };
    this.screenListDataSource = [];
    this.getscreenListParams = {
      page: 0,
      size: 2,
    };
    this.deviceId = undefined;
    this.offOn = '';
    makeObservable(this, {
      screenListDataSource: observable,
      deviceId: observable,
      offOn: observable,
      pageChange: action,
      getScreenList: action,
      screenModalVisible: observable,
      setScreenModalVisible: action,
      getDownLoadUrl: action,
    });
  }

  // 获取下载url
  public getDownLoadUrl = async (fileKey: string): Promise<string> => {
    const { fileTokenUrl } = await this.FileUseCase.getPreviewUrl(fileKey);
    return fileTokenUrl || '';
  };

  // 获取列表数据
  public getScreenList = async (id?: number, refresh?: string): Promise<void> => {
    const listData: ScreenListData[] = [];
    const { page, size } = this.getscreenListParams;
    if (refresh === 'refresh') {
      this.getscreenListParams.page = 0;
      this.getscreenListParams.size = 3;
    }
    try {
      await this.DeviceUseCase.getScreenList(
        refresh === 'refresh' ? 0 : page,
        refresh === 'refresh' ? 3 : size,
        id,
      );
      runInAction(() => {
        this.screenListData = { ...this.DeviceUseCase.screenListData };
        if (this.screenListData.content) {
          this.screenListData.content.forEach((item: ScreenListEntity, index: number) => {
            listData.push({
              ...item,
              key: index + 1,
            });
          });
        }
        this.screenListDataSource = listData;
      });
    } catch (e) {
      runInAction(() => {
        this.screenListDataSource = [];
      });
    }
  };

  //设备截屏
  public getScreenShot = async (): Promise<void> => {
    try {
      if (this.offOn === 'ON') {
        await this.DeviceUseCase.getScreenShot(this.deviceId);
        utils.globalMessge({
          content: '截屏指令已发送给设备端，请查看截屏记录～',
          type: 'success',
        });
        this.getScreenList(this.deviceId, 'refresh');
      } else {
        utils.globalMessge({
          content: '无法发送截屏指令，当前设备离线中，请检查设备状态',
          type: 'error',
        });
      }
    } catch (error) {
      utils.globalMessge({
        content: (error as Error).message,
        type: 'error',
      });
    }
  };

  // 切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.getscreenListParams.page = page - 1;
    if (pageSize) {
      this.getscreenListParams.size = pageSize;
    }
    this.getScreenList(this.deviceId);
  };

  //设置标签model显示隐藏
  public setScreenModalVisible = (id?: number, offOn?: string): void => {
    if (id) {
      this.deviceId = id;
      this.getScreenList(this.deviceId);
      // this.getScreenShot(this.deviceId)
    }
    if (offOn) {
      this.offOn = offOn;
    }
    this.screenModalVisible = !this.screenModalVisible;
  };
}
