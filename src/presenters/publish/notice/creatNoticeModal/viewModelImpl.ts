/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 10:26:13
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:21:15
 */
import moment from 'moment';
import { injectable, inject } from 'inversify';
import { RadioChangeEvent } from 'antd';
import { cloneDeep } from 'lodash';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';
import { makeObservable, action, observable, runInAction } from 'mobx';
import NoticeListViewModel from '../noticeList/viewModel';
import CreateNoticeModalViewModel, {
  NoticePreviewProps,
  OptionsType,
  AdvertingListParams,
  DeviceEntity,
} from './viewModel';
import { AdvertisementDeviceListEntity } from '../../../../domain/entities/deviceEntities';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import {
  Devices,
  StoreWithCountEntity,
  NoticeItemDetailsEntity,
} from '../../../../domain/entities/noticeEntities';
import NoticeUseCase from '../../../../domain/useCases/noticeUseCase';
import RootContainerUseCase from '../../../../domain/useCases/rootContainerUseCase';
import {
  NOTICE_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../../constants/identifiers';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import {
  CommonPagesGeneric,
  ModalStatus,
  DeviceType,
} from '../../../../common/config/commonConfig';
import { DeviceScope } from '../../advertisement/creatAdvertisementModal/viewModel';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import utils from '../../../../utils/index';

@injectable()
export default class CreateNoticeModalViewModelImpl implements CreateNoticeModalViewModel {
  // advertisementUseCase
  @inject(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE)
  private noticeUseCase!: NoticeUseCase;
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase; // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  // 发布紧急通知弹窗状态
  public createNoticeModalVisible: boolean;
  // 预览props
  public noticePreviewProps: NoticePreviewProps;
  // 背景颜色选择器状态
  public bgColorPickerVisible: boolean;
  // 字体颜色选择器状态
  public fontColorPickerVisible: boolean;

  // 设备范围
  public deviceScope: string;
  // 具体设备内容
  public deviceTypes: string;
  // 具体设备
  public specificDevice: SingleValueType[];
  // 具体设备删除回显
  public specificDeviceData: React.Key[][];
  // 设备删除
  public removeEq: number; //1代表用删除之后的数据组成级联标签的值
  //选择设备数据
  public cascaderOptions: OptionsType[];
  // 列表单项的数据
  public advertingListData: CommonPagesGeneric<AdvertisementDeviceListEntity>;
  public advertingListDataSource: AdvertisementDeviceListEntity[];
  public cashierListDataSource: AdvertisementDeviceListEntity[];
  public ledListDataSource: AdvertisementDeviceListEntity[];
  public getAdvertingListParams: AdvertingListParams;
  public modalType: ModalStatus;
  public storeNameList: AdvertisementDeviceListEntity[];
  public storeNameCashierList: AdvertisementDeviceListEntity[];
  public storeNameLedList: AdvertisementDeviceListEntity[];
  public treeData: StoreWithCountEntity[];
  public adSelectedType: string;
  public cashierSelectedType: string;
  public ledSelectedType: string;
  public noticeDetailsData: NoticeItemDetailsEntity;
  public deviceIdList: number[];
  public textSizeCode: LookupsEntity[];
  public textPositionCode: LookupsEntity[];
  public rollSpeendCode: LookupsEntity[];
  public currentPage: number;

  public constructor() {
    this.createNoticeModalVisible = false;
    this.noticePreviewProps = {
      fontColor: '#000',
      bgColor: '#4096ff',
      content: '效果预览示例',
    };
    this.bgColorPickerVisible = false;
    this.fontColorPickerVisible = false;

    this.deviceScope = DeviceScope.Part;
    this.specificDevice = [];
    this.deviceTypes = DeviceType.Advertisement;
    this.modalType = ModalStatus.Creat;
    this.cascaderOptions = [];
    this.advertingListData = { content: [] };
    this.advertingListDataSource = [];
    this.cashierListDataSource = [];
    this.ledListDataSource = [];
    this.getAdvertingListParams = {
      page: 0,
      size: 3,
    };
    this.storeNameList = [];
    this.storeNameCashierList = [];
    this.storeNameLedList = [];
    this.treeData = [];
    this.adSelectedType = 'project';
    this.cashierSelectedType = 'project';
    this.ledSelectedType = 'project';
    this.noticeDetailsData = {};
    this.deviceIdList = [];
    this.textSizeCode = [];
    this.textPositionCode = [];
    this.rollSpeendCode = [];
    this.currentPage = 0;
    this.specificDeviceData = [];
    this.removeEq = 0;

    makeObservable(this, {
      createNoticeModalVisible: observable,
      noticePreviewProps: observable,
      bgColorPickerVisible: observable,
      fontColorPickerVisible: observable,
      cascaderOptions: observable,
      deviceTypes: observable,
      deviceScope: observable,
      advertingListDataSource: observable,
      cashierListDataSource: observable,
      ledListDataSource: observable,
      specificDevice: observable,
      storeNameList: observable,
      storeNameCashierList: observable,
      storeNameLedList: observable,
      treeData: observable,
      adSelectedType: observable,
      cashierSelectedType: observable,
      ledSelectedType: observable,
      noticeDetailsData: observable,
      deviceIdList: observable,
      textSizeCode: observable,
      textPositionCode: observable,
      rollSpeendCode: observable,
      currentPage: observable,
      specificDeviceData: observable,
      removeEq: observable,
      setCreateNoticeModalVisible: action,
      setNoticePreviewProps: action,
      setColorPickerVisible: action,
      deviceScopeChange: action,
      switchDeviceTypes: action,
      setWayType: action,
      setDevice: action,
      getAdvertisingList: action,
      deleteTableItemData: action,
      onRelease: action,
      getNoticeDetailsData: action,
      getEditDeviceList: action,
      getLookupsValue: action,
      prev: action,
      next: action,
      initialData: action,
    });
  }

  //设置发布紧急通知弹窗状态
  public setCreateNoticeModalVisible = (
    createNoticeModalVisible: boolean,
    type?: ModalStatus,
  ): void => {
    switch (type) {
      case ModalStatus.Creat:
        this.modalType = ModalStatus.Creat;
        break;
      case ModalStatus.Edit:
        this.modalType = ModalStatus.Edit;
        break;
      default:
        this.modalType = ModalStatus.Creat;
        break;
    }
    if (!createNoticeModalVisible) {
      this.noticeDetailsData = {};
      this.storeNameList = [];
      this.storeNameCashierList = [];
      this.storeNameLedList = [];
      this.advertingListDataSource = [];
      this.cashierListDataSource = [];
      this.ledListDataSource = [];
    }
    this.createNoticeModalVisible = createNoticeModalVisible;
  };

  // 设置预览props
  public setNoticePreviewProps = (key: string, value: string): void => {
    if (key === 'speedCode') {
      Object.assign(this.noticePreviewProps, { speed: value });
    } else if (key === 'backgroundTransparency') {
      Object.assign(this.noticePreviewProps, { opacity: value });
    } else {
      Object.assign(this.noticePreviewProps, { [key]: value });
    }
  };

  // 设置颜色选择器状态
  public setColorPickerVisible = (key: string, value: boolean): void => {
    if (key === 'fontColor') {
      this.fontColorPickerVisible = value;
    } else {
      this.bgColorPickerVisible = value;
    }
  };

  // 切换设备范围
  public deviceScopeChange = (e: RadioChangeEvent): void => {
    // 每次切换设备范围时  将表格已选数据清空 （新建的情况）
    this.specificDevice = [];
    this.specificDeviceData = [];
    this.advertingListDataSource = [];
    this.cashierListDataSource = [];
    this.ledListDataSource = [];
    this.storeNameList = [];
    this.storeNameCashierList = [];
    this.storeNameLedList = [];
    this.deviceScope = e.target.value;
    if (this.deviceScope === DeviceScope.All) {
      this.getAllDeviceList(DeviceType.Advertisement);
      this.getAllDeviceList(DeviceType.Cashier);
      this.getAllDeviceList(DeviceType.Led);
    } else if (this.deviceScope === DeviceScope.Part) {
      this.getAdvertisingList();
    }
  };

  // 切换设备
  public switchDeviceTypes = (value: string): void => {
    this.specificDevice = [];
    this.specificDeviceData = [];
    this.deviceTypes = value;
    this.getAdvertingListParams = {
      page: 0,
      size: 3,
    };

    if (this.deviceScope === DeviceScope.All) {
      // this.getAllDeviceList();
    } else if (this.deviceScope === DeviceScope.Part) {
      this.getAdvertisingList();
    }
    // 编辑的时候 部分设备和调用这个列表
    // if (this.deviceScope === DeviceScope.Part && this.modalType === ModalStatus.Edit) {
    //   this.getEditDeviceList(value, this.noticeDetailsData.id);
    // }
  };

  // 切换选择方式
  public setWayType = (e: string): void => {
    this.specificDevice = [];
    this.specificDeviceData = [];
    if (this.deviceTypes === DeviceType.Advertisement) {
      this.adSelectedType = e;
    }
    if (this.deviceTypes === DeviceType.Cashier) {
      this.cashierSelectedType = e;
    }
    if (this.deviceTypes === DeviceType.Led) {
      this.ledSelectedType = e;
    }
    this.getAdvertisingList(e);
  };

  // 选择设备
  public setDevice = (value: SingleValueType[], selectOptions: DefaultOptionType[][]): void => {
    this.removeEq = 0;
    this.specificDevice = value;
    const middleArr: DeviceEntity[] = [];
    selectOptions.forEach((item) => {
      // 如果等于3的话，选择了第3级的数据
      if (((item as unknown) as Devices[]).length === 3) {
        // 字段名转换
        let data = JSON.stringify(((item as unknown) as Devices[])[2]);
        data = data
          .replace(new RegExp('label', 'gm'), 'deviceName')
          .replace(new RegExp('value', 'gm'), 'id');
        const replaceData = JSON.parse(data);
        if (middleArr.every((x) => x.id !== replaceData.id)) {
          middleArr.push({
            ...replaceData,
            children: [replaceData],
          });
        } else {
          const dataIndex = middleArr.findIndex((findItem) => {
            return findItem.id === replaceData.id;
          });
          middleArr[dataIndex].children.push(replaceData);
        }
      }
      // 如果等于2的话，选择了某个楼层下的所有的数据
      if (((item as unknown) as Devices[]).length === 2) {
        ((item as unknown) as Devices[])[1].children?.forEach((floors) => {
          let data = JSON.stringify(floors);
          data = data
            .replace(new RegExp('label', 'gm'), 'deviceName')
            .replace(new RegExp('value', 'gm'), 'id');
          const replaceData = JSON.parse(data);
          if (middleArr.every((x) => x.id !== replaceData.id)) {
            middleArr.push({
              ...replaceData,
              children: [replaceData],
            });
          } else {
            const dataIndex = middleArr.findIndex((findItem) => {
              return findItem.id === replaceData.id;
            });
            middleArr[dataIndex].children.push(replaceData);
          }
        });
      }

      // 如果等于1的话，选择了某个门店下的所有的数据
      if (((item as unknown) as Devices[]).length === 1) {
        ((item as unknown) as Devices[])[0].children?.forEach((project) => {
          project.children?.forEach((projectAll) => {
            let data = JSON.stringify(projectAll);
            data = data
              .replace(new RegExp('label', 'gm'), 'deviceName')
              .replace(new RegExp('value', 'gm'), 'id');
            const replaceData = JSON.parse(data);
            if (middleArr.every((x) => x.id !== replaceData.id)) {
              middleArr.push({
                ...replaceData,
                children: [replaceData],
              });
            } else {
              const dataIndex = middleArr.findIndex((findItem) => {
                return findItem.id === replaceData.id;
              });
              middleArr[dataIndex].children.push(replaceData);
            }
          });
        });
      }
    });
    this.switchSetDataSource(this.deviceTypes, undefined, middleArr);
    // 拿到门店数量
    this.getStoreCount();
  };

  // 删除表格单项数据
  public deleteTableItemData = (record: AdvertisementDeviceListEntity): void => {
    this.removeEq = 1;
    if (this.deviceTypes === DeviceType.Advertisement) {
      const newArr = this.advertingListDataSource.filter((obj) => {
        return record.id !== obj.id;
      });
      this.advertingListDataSource = newArr;
      const deviceData: React.Key[][] = [];
      newArr.forEach((item) => {
        deviceData.push([item.storeId, item.floor || '', item.id]);
      });
      this.specificDeviceData = deviceData;
    }
    if (this.deviceTypes === DeviceType.Cashier) {
      const newArr = this.cashierListDataSource.filter((obj) => {
        return record.id !== obj.id;
      });
      this.cashierListDataSource = newArr;
      const deviceData: React.Key[][] = [];
      newArr.forEach((item) => {
        deviceData.push([item.storeId, item.brandFormat || '', item.id]);
      });
      this.specificDeviceData = deviceData;
    }
    if (this.deviceTypes === DeviceType.Led) {
      const newArr = this.ledListDataSource.filter((obj) => {
        return record.id !== obj.id;
      });
      this.ledListDataSource = newArr;
      const deviceData: React.Key[][] = [];
      newArr.forEach((item) => {
        deviceData.push([item.storeId, item.floor || '', item.id]);
      });
      this.specificDeviceData = deviceData;
    }
    this.getStoreCount();
  };

  // 计算门店/项目数量
  private getStoreCount = (): void => {
    this.storeNameList = [];
    this.storeNameCashierList = [];
    this.storeNameLedList = [];
    let adStoreList: AdvertisementDeviceListEntity[] = [];
    let cashierStoreList: AdvertisementDeviceListEntity[] = [];
    let ledStoreList: AdvertisementDeviceListEntity[] = [];
    // 拿到广告机门店数量
    if (this.advertingListDataSource.length) {
      adStoreList = this.advertingListDataSource.filter((k, index) => {
        const idx = this.advertingListDataSource.findIndex((i) => {
          return k.storeName === i.storeName;
        });
        return index === idx;
      });
    }
    // 拿到收银机门店数量
    if (this.cashierListDataSource.length) {
      cashierStoreList = this.cashierListDataSource.filter((k, index) => {
        const idx = this.cashierListDataSource.findIndex((i) => {
          return k.storeName === i.storeName;
        });
        return index === idx;
      });
    }
    // 拿到led门店数量
    if (this.ledListDataSource) {
      ledStoreList = this.ledListDataSource.filter((k, index) => {
        const idx = this.ledListDataSource.findIndex((i) => {
          return k.storeName === i.storeName;
        });
        return index === idx;
      });
    }

    this.storeNameList = adStoreList.filter((k, index) => {
      const idx = adStoreList.findIndex((i) => {
        return k.storeName === i.storeName;
      });
      return index === idx;
    });

    this.storeNameCashierList = cashierStoreList.filter((k, index) => {
      const idx = cashierStoreList.findIndex((i) => {
        return k.storeName === i.storeName;
      });
      return index === idx;
    });

    this.storeNameLedList = ledStoreList.filter((k, index) => {
      const idx = ledStoreList.findIndex((i) => {
        return k.storeName === i.storeName;
      });
      return index === idx;
    });

    // 拿到所有的门店 下期要用
    // this.storeNameList = this.storeNameList.concat(
    //   concat(adStoreList, cashierStoreList, ledStoreList),
    // );

    // this.storeNameList = this.storeNameList.filter((k, index) => {
    //   const idx = this.storeNameList.findIndex((i) => {
    //     return k.storeName === i.storeName;
    //   });
    //   return index === idx;
    // });
  };

  // 获取全部设备列表
  public getAllDeviceList = async (deviceType?: string): Promise<void> => {
    try {
      const data = await this.noticeUseCase.getAllDeviceByType(deviceType || '');
      if (deviceType) {
        if (deviceType === DeviceType.Cashier) {
          const newData = data.map((item) => {
            return {
              ...item,
              deviceName: item.pointBrandName,
            };
          });
          this.switchSetDataSource(deviceType, newData);
        } else {
          this.switchSetDataSource(deviceType, data);
        }
      }
      this.getStoreCount();
    } catch (error) {
      console.log(error);
    }
  };

  // 根据设备类型 对相应的表格数据赋值
  private switchSetDataSource = (
    deviceType: string,
    data?: AdvertisementDeviceListEntity[],
    middleArrData?: DeviceEntity[],
  ): void => {
    let source: AdvertisementDeviceListEntity[] = [];
    if (data) {
      source = data;
    }
    middleArrData?.forEach((item) => {
      let str = '';
      (item as DeviceEntity).children.forEach((deviceItem, deviceIndex) => {
        str += `${deviceItem.groupName}/` || '';
        if (deviceIndex === (item as DeviceEntity).children.length - 1) {
          str = str.substring(0, str.length - 1);
          source.push({
            ...deviceItem,
            groupName: str === 'null' ? '- -' : str,
          });
        }
      });
    });
    switch (deviceType) {
      case DeviceType.Advertisement:
        this.advertingListDataSource = source;
        break;
      case DeviceType.Cashier:
        this.cashierListDataSource = source;
        console.log('cashierListDataSource', this.cashierListDataSource);
        break;
      case DeviceType.Led:
        this.ledListDataSource = source;
        break;
      default:
        this.advertingListDataSource = source;
        break;
    }
  };

  // 获取树列表数据(选择部分设备时调用)
  public getAdvertisingList = async (e?: string): Promise<void> => {
    try {
      let data: StoreWithCountEntity[] = [];
      if (this.deviceTypes === DeviceType.Advertisement) {
        if (this.adSelectedType === 'project') {
          data = await this.noticeUseCase.getStoreWithCount(this.deviceTypes);
        }
        if (this.adSelectedType === 'group') {
          data = await this.noticeUseCase.getGroupStoreWithCount(this.deviceTypes);
        }
      }
      if (this.deviceTypes === DeviceType.Cashier) {
        if (this.cashierSelectedType === 'project') {
          data = await this.noticeUseCase.getStoreWithCount(this.deviceTypes);
        }
        if (this.cashierSelectedType === 'group') {
          data = await this.noticeUseCase.getGroupStoreWithCount(this.deviceTypes);
        }
      }
      if (this.deviceTypes === DeviceType.Led) {
        if (this.ledSelectedType === 'project') {
          data = await this.noticeUseCase.getStoreWithCount(this.deviceTypes);
        }
        if (this.ledSelectedType === 'group') {
          data = await this.noticeUseCase.getGroupStoreWithCount(this.deviceTypes);
        }
      }
      this.treeData = data;

      runInAction(() => {
        let resData = JSON.stringify(data);
        let selectWay = 'project';
        if (e) {
          selectWay = e;
        }
        if (selectWay === 'project') {
          if (this.deviceTypes === DeviceType.Cashier) {
            resData = resData
              .replace(new RegExp('floors', 'gm'), 'children')
              .replace(new RegExp('projectName', 'gm'), 'label')
              .replace(new RegExp('projectId', 'gm'), 'value')
              .replace(new RegExp('devices', 'gm'), 'children')
              .replace(new RegExp('floorName', 'gm'), 'label')
              .replace(new RegExp('floorCode', 'gm'), 'value')
              .replace(new RegExp('pointBrandName', 'gm'), 'label')
              .replace(new RegExp('deviceId', 'gm'), 'value');
            this.cascaderOptions = JSON.parse(resData);
          } else {
            resData = resData
              .replace(new RegExp('floors', 'gm'), 'children')
              .replace(new RegExp('projectName', 'gm'), 'label')
              .replace(new RegExp('projectId', 'gm'), 'value')
              .replace(new RegExp('devices', 'gm'), 'children')
              .replace(new RegExp('floorName', 'gm'), 'label')
              .replace(new RegExp('floorCode', 'gm'), 'value')
              .replace(new RegExp('deviceName', 'gm'), 'label')
              .replace(new RegExp('deviceId', 'gm'), 'value');
            this.cascaderOptions = JSON.parse(resData);
          }
        } else {
          resData = resData
            .replace(new RegExp('floors', 'gm'), 'children')
            .replace(new RegExp('projectName', 'gm'), 'label')
            .replace(new RegExp('projectId', 'gm'), 'value')
            .replace(new RegExp('device', 'gm'), 'children')
            .replace(new RegExp('floorName', 'gm'), 'label')
            .replace(new RegExp('floorCode', 'gm'), 'value')
            .replace(new RegExp('deviceName', 'gm'), 'label')
            .replace(new RegExp('id', 'gm'), 'value')
            .replace(new RegExp('childrens', 'gm'), 'children')
            .replace(new RegExp('childrenName', 'gm'), 'label');
          if (this.deviceTypes === DeviceType.Cashier) {
            resData = resData.replace(new RegExp('pointBrandName', 'gm'), 'label');
          } else {
            resData = resData.replace(new RegExp('deviceName', 'gm'), 'label');
          }
          this.cascaderOptions = JSON.parse(resData);
          console.log('this.cascaderOptions', JSON.parse(JSON.stringify(this.cascaderOptions)));
        }
      });
    } catch (error) {
      runInAction(() => {
        this.cascaderOptions = [];
      });
    }
  };

  // 发布新通知
  public onRelease = async (noticeListViewModel: NoticeListViewModel): Promise<void> => {
    const { createNoticeModalItemData, getNoticeList, initialData } = noticeListViewModel;
    createNoticeModalItemData.deviceIds = [];

    if (this.modalType === ModalStatus.Creat) {
      createNoticeModalItemData.deviceIds = createNoticeModalItemData.deviceIds
        .concat(this.advertingListDataSource.map((ele) => ele.id || 0))
        .concat(this.cashierListDataSource.map((ele) => ele.id || 0))
        .concat(this.ledListDataSource.map((ele) => ele.id || 0));
      if (createNoticeModalItemData.deviceIds.length === 0) {
        utils.globalMessge({
          content: '请选择需投放紧急通知的设备',
          type: 'error',
        });
        return;
      }
      this.noticeUseCase
        .createNotice(createNoticeModalItemData)
        .then(() => {
          utils.globalMessge({
            content: '发布成功！',
            type: 'success',
          });
          this.setCreateNoticeModalVisible(false);
          initialData();
          this.initialData();
          getNoticeList();
        })
        .catch((error) => {
          utils.globalMessge({
            content: `发布失败，${error.message}!`,
            type: 'error',
          });
        });
    }
    // if (this.modalType === ModalStatus.Edit) {
    //   createNoticeModalItemData.deviceIds = createNoticeModalItemData.deviceIds
    //     .concat(this.advertingListDataSource.map((ele) => ele.deviceId || 0))
    //     .concat(this.cashierListDataSource.map((ele) => ele.deviceId || 0))
    //     .concat(this.ledListDataSource.map((ele) => ele.deviceId || 0));
    //   Object.assign(createNoticeModalItemData, {
    //     id: this.noticeDetailsData.id,
    //     objectVersionNumber: this.noticeDetailsData.objectVersionNumber,
    //   });
    //   this.noticeUseCase
    //     .editNotice(createNoticeModalItemData)
    //     .then(() => {
    //       utils.globalMessge({
    //         content: '编辑成功！',
    //         type: 'success',
    //       });
    //       this.setCreateNoticeModalVisible(false);
    //       getNoticeList();
    //     })
    //     .catch((error) => {
    //       utils.globalMessge({
    //         content: `编辑失败，${error.message}!`,
    //         type: 'error',
    //       });
    //     });
    // }
  };

  // 切换页码
  // public pageChange = (page: number, pageSize?: number): void => {
  //   this.getAdvertingListParams.page = page - 1;
  //   if (pageSize) {
  //     this.getAdvertingListParams.size = pageSize;
  //   }
  //   if (this.deviceScope === DeviceScope.All) {
  //     this.getAllDeviceList();
  //   } else if (this.deviceScope === DeviceScope.Part) {
  //     this.getAdvertisingList();
  //   }
  // };

  // 获取通知详情数据
  public getNoticeDetailsData = async (id: number): Promise<void> => {
    const data = await this.noticeUseCase.getNoticeItemDetails(id);
    runInAction(() => {
      this.noticeDetailsData = cloneDeep(data);
      const { duration } = this.noticeDetailsData;
      const time = moment.duration(Number(duration), 'seconds');
      const hour = time.hours();
      const minute = time.minutes();
      const second = time.seconds();
      Object.assign(this.noticeDetailsData, {
        hour,
        minute,
        second,
      });
    });
  };

  // 获取详情设备列表
  public getEditDeviceList = async (
    deviceType?: string,
    id?: number,
  ): Promise<AdvertisementDeviceListEntity[]> => {
    try {
      const listData: AdvertisementDeviceListEntity[] = [];
      const data = await this.noticeUseCase.getEditDeviceList(deviceType, id);
      runInAction(() => {
        data.forEach((item) => {
          let str = '';
          if (item.groupNames && item.groupNames.length > 0) {
            item.groupNames?.forEach((nameItem) => {
              str += `${nameItem.groupName}/`;
            });
            str = str.substring(0, str.length - 1);
          } else {
            str = '';
          }
          this.deviceIdList.push(item.id);
          listData.push({
            ...item,
            groupStr: str,
          });
        });
        this.switchSetDataSource(this.deviceTypes, listData);
        this.getStoreCount();
      });
    } catch (e) {
      runInAction(() => {
        this.advertingListDataSource = [];
      });
    }
    return this.advertingListDataSource;
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 文本大小快码数据
        if (code === LookupsCodeTypes.TEXT_SIZE_TYPE) {
          this.textSizeCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 文本位置快码数据
        if (code === LookupsCodeTypes.TEXT_POSITION_TYPE) {
          this.textPositionCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 文本滚动速度快码数据
        if (code === LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE) {
          this.rollSpeendCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.textSizeCode = [];
        this.textPositionCode = [];
        this.rollSpeendCode = [];
      });
    }
  };

  // 上一页
  public prev = (): void => {
    this.currentPage -= 1;
  };

  // 下一页
  public next = (): void => {
    this.currentPage += 1;
  };

  // 初始化数据
  public initialData = (noticeListViewModel?: NoticeListViewModel): void => {
    this.currentPage = 0;
    this.noticePreviewProps = {
      fontColor: '#000',
      bgColor: '#4096ff',
      content: '效果预览示例',
    };
    this.deviceScope = DeviceScope.Part;
    this.deviceTypes = DeviceType.Advertisement;
    if (noticeListViewModel) {
      noticeListViewModel.initialData();
    }
  };
}
