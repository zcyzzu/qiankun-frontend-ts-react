/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-21 15:40:24
 */
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import GroupModalViewModel, { DeviceListData, DeviceListParams } from './viewModel';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import DeviceUseCase from '../../../domain/useCases/deviceUseCase';
import { GroupListEntity, DeviceListEntity } from '../../../domain/entities/deviceEntities';
import utils from '../../../utils/index';
import { DeviceType } from '../../../common/config/commonConfig';
import AdvertisementMachineViewModel from '../advertisementMachine/viewModel';
import DeviceListViewModel from '../deviceList/viewModel';

@injectable()
export default class GroupModalViewModelImpl implements GroupModalViewModel {
  // deviceUseCase
  @inject(DEVICE_IDENTIFIER.DEVICE_USE_CASE)
  private DeviceUseCase!: DeviceUseCase;
  // 标签弹窗状态
  public groupModalVisible: boolean;
  // 设备类型
  deviceType: DeviceType;

  // tag是否可以的删除状态
  public tagVisible: boolean;
  // tag是否可以的新增状态
  public addTagVisible: boolean;
  // tag新增值
  public addTagData: string;
  // 所有tag值
  public tagData: GroupListEntity[];
  // 分组id
  public groupId: number[];

  // 设备列表参数
  public deviceListParams: DeviceListParams;
  // 设备列表数据
  public deviceListData: DeviceListEntity[];
  // 设备列表数据
  public deviceListDataSource: DeviceListData[];
  // 设备列表数据 - 已绑定
  public deviceBindList: DeviceListEntity[];
  // 左边穿梭狂值

  // 右边穿梭框的key值cc
  public targetKeys: string[];
  public ids: number[];

  public constructor() {
    this.deviceType = DeviceType.Advertisement;
    this.groupModalVisible = false;
    this.tagVisible = false;
    this.addTagVisible = false;
    this.addTagData = '';
    this.tagData = [];
    this.groupId = [];

    this.deviceListParams = {
      type: DeviceType.Advertisement,
    };
    this.deviceListData = [];
    this.deviceBindList = [];
    this.deviceListDataSource = [];
    this.targetKeys = [];
    this.ids = [];
    makeObservable(this, {
      tagClick: action,
      setDevice: action,
      getGroupList: action,
      setTarKeys: action,
      setEmpty: action,
      setGroupModalVisible: action,
      deleteTagVisible: action,
      deleteTag: action,
      setAddTagVisible: action,
      setAddTag: action,
      tagOnchange: action,
      tagVisible: observable,
      tagData: observable,
      addTagData: observable,
      addTagVisible: observable,
      groupModalVisible: observable,
      targetKeys: observable,
      deviceListParams: observable,
      deviceListData: observable,
      deviceListDataSource: observable,
      deviceBindList: observable,
      groupId: observable,
      deviceType: observable,
      ids: observable,
    });
  }

  // 获取设备列表
  public getDeviceList = async (id: number | undefined, deviceType: string): Promise<void> => {
    const listData: DeviceListData[] = [];
    try {
      // await this.DeviceUseCase.getDeviceGroupList(page, size, id, deviceType);
      await this.DeviceUseCase.getDeviceListPage(undefined, 'all', deviceType);
      runInAction(() => {
        this.deviceListData = [...this.DeviceUseCase.deviceListData];
        // this.deviceListData = { ...this.DeviceUseCase.deviceListGroupData };
        if (this.deviceListData) {
          let resData = JSON.stringify(this.deviceListData);
          resData = resData
            .replace(new RegExp('projectStoreName', 'gm'), 'storeName')
            .replace(new RegExp('name', 'gm'), 'deviceName')
            .replace(new RegExp('id', 'gm'), 'deviceId');
          const data = JSON.parse(resData);
          data.forEach((item: DeviceListEntity, index: number) => {
            listData.push({
              ...item,
              key: String(index + 1),
            });
          });
        }
        this.deviceListDataSource = listData;
      });
    } catch (e) {
      runInAction(() => {
        this.deviceListDataSource = [];
      });
    }
  };

  //选择组
  public tagClick = async (id?: number): Promise<void> => {
    if (id) {
      // 反选
      if (this.groupId.includes(id)) {
        const index = this.groupId.indexOf(id);
        this.groupId.splice(index, 1);
      } else {
        this.groupId.push(id);
      }
    }
    const ids = this.groupId.join(',');

    try {
      if (ids) {
        await this.DeviceUseCase.getDeviceListPage(ids, 'bind', this.deviceType);
        runInAction(() => {
          this.deviceBindList = [...this.DeviceUseCase.deviceListData];
          const keys: string[] = [];
          const idsArr: number[] = [];
          const idArr: (number | undefined)[] = [];
          this.deviceListDataSource.forEach((item) => {
            if (this.deviceBindList) {
              this.deviceBindList.forEach((i) => {
                if (item.deviceId === i.deviceId) {
                  idArr.push(i.deviceId);
                  keys.push(item.key);
                } else {
                  idsArr.push(i.deviceId || 0);
                }
              });
            }
          });
          let deviceIds = Array.from(new Set(idsArr));
          if (idArr.length > 0) {
            // const index = deviceIds.indexOf(id);
            // deviceIds.splice(index, 1)
            deviceIds = deviceIds.filter((a) => {
              return !idArr.some((c) => c === a);
            });
          }
          this.ids = deviceIds;
          this.targetKeys = keys;
        });
      } else {
        this.targetKeys = [];
      }
    } catch (e) {
      runInAction(() => {
        this.targetKeys = [];
        // this.deviceListDataSource = [];
      });
    }
  };

  //保存设备
  public setDevice = async (
    advertisementMachineViewModel: AdvertisementMachineViewModel,
  ): Promise<void> => {
    if (this.groupId.length === 0) {
      utils.globalMessge({
        content: '请选择分组',
        type: 'error',
      });
      return;
    }
    const deviceIds: number[] = [];
    this.deviceListDataSource.map((item) => {
      this.targetKeys.map((key) => {
        if (item.key === key && item.deviceId) {
          deviceIds.push(item.deviceId);
        }
        return null;
      });
      return null;
    });
    let idsSum: number[] = [];
    idsSum = deviceIds.concat(this.ids);
    const ids = Array.from(new Set(idsSum));
    try {
      await this.DeviceUseCase.bindDevice(ids, this.groupId, 'bind');
      utils.globalMessge({
        content: '分组配置保存成功',
        type: 'success',
      });
      this.groupModalVisible = false;
      advertisementMachineViewModel.getDeviceList(this.deviceType);
    } catch (error) {
      utils.globalMessge({
        content: (error as Error).message,
        type: 'error',
      });
    }
    //targetKeys
  };

  // 请求tag列表
  public getGroupList = async (): Promise<void> => {
    try {
      await this.DeviceUseCase.getGroupList();
      runInAction(() => {
        this.tagData = [...this.DeviceUseCase.groupListData];
      });
    } catch (e) {
      runInAction(() => {
        this.tagData = [];
      });
    }
  };

  //是否删除tag
  public deleteTagVisible = (): void => {
    this.tagVisible = !this.tagVisible;
  };

  //删除tag
  public deleteTag = async (e: React.MouseEvent<HTMLElement>, id?: number): Promise<void> => {
    e.preventDefault();
    //(删除单个tag的逻辑)
    try {
      await this.DeviceUseCase.delGroup(id);
      this.getGroupList();
      utils.globalMessge({
        content: '更新分组成功！',
        type: 'success',
      });
    } catch (error) {
      utils.globalMessge({
        content: (error as Error).message,
        type: 'error',
      });
    }
  };

  //是否新增tag
  public setAddTagVisible = (): void => {
    this.addTagVisible = !this.addTagVisible;
  };

  //新增tag
  public setAddTag = async (): Promise<void> => {
    // 输入框没有内容 禁止点击
    if (this.addTagData.length === 0) {
      return;
    }
    //(新增单个tag的逻辑)
    await this.DeviceUseCase.createGroup(this.addTagData)
      .then(() => {
        this.getGroupList();
        this.addTagVisible = false;
        utils.globalMessge({
          content: '新增分组成功！',
          type: 'success',
        });
      })
      .catch((error) => {
        utils.globalMessge({
          content: `新增分组失败！${error.message}`,
          type: 'error',
        });
      });

    // 输入框内容清除（避免下次新增可以点击）
    this.addTagData = '';
  };

  //设置tag新增值
  public tagOnchange = (e: React.SyntheticEvent): void => {
    this.addTagData = (e.target as HTMLInputElement).value;
  };

  //设置标签model显示隐藏
  public setGroupModalVisible = (
    deviceType?: DeviceType,
    deviceListViewModel?: DeviceListViewModel,
  ): void => {
    if (deviceType && deviceListViewModel) {
      this.deviceType = deviceType;
      this.getGroupList();
      this.getDeviceList(deviceListViewModel.unitId, deviceType);
    }

    this.groupModalVisible = !this.groupModalVisible;
    //关闭的时候将所有状态关闭
    this.tagVisible = false;
    this.addTagVisible = false;
    this.groupId = [];
    this.targetKeys = [];
  };

  //设置右边穿梭框的key值
  public setTarKeys = (nextTargetKeys: string[]): void => {
    this.targetKeys = nextTargetKeys;
  };

  //清空右边穿梭框的key值
  public setEmpty = (): void => {
    this.targetKeys = [];
  };
}
