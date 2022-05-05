/* eslint-disable no-unreachable */
/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:11:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-25 15:59:49
 */
import React from 'react';
import { injectable, inject } from 'inversify';
import { cloneDeep } from 'lodash';
import { RadioChangeEvent, message, Modal, Upload } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { UploadFile } from 'antd/lib/upload/interface';
import { RangeValue } from 'rc-picker/lib/interface';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';
import { RcFile } from 'rc-upload/lib/interface';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import moment, { Moment } from 'moment';
import CreatAdvertisementModalViewModel, {
  OptionsType,
  FormData,
  CheckOption,
  DeviceEntity,
  BatchData,
  DeviceScope,
} from './viewModel';
import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import {
  ADVERTISEMENT_IDENTIFIER,
  FILE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../../constants/identifiers';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import FileUseCase from '../../../../domain/useCases/fileUseCase';

import RootContainerUseCase from '../../../../domain/useCases/rootContainerUseCase';
import {
  CreateParamsEntity,
  CreateMaterialEntity,
  PlayTimeList,
  AdvertisementDeviceListEntity,
  AdvertisementDetailEntity,
  MaterialList,
  MaterialHistoryRecordEntity,
  Devices,
  MaterialIdData,
} from '../../../../domain/entities/advertisementEntities';
import utils from '../../../../utils/index';
import AdvertisementListViewModel from '../advertisementList/viewModel';
import { ModalStatus, UploadType, DeviceType } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import RootContainereViewModel from '../../../rootContainer/viewModel';

@injectable()
export default class CreatAdvertisementModalViewModelImpl
  implements CreatAdvertisementModalViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;
  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  //发布广告弹窗状态
  public advertisingModalVisible: boolean;
  //步骤
  public current: number;
  //周期
  public weeks: string;
  //每周天数
  public optionsCheck: CheckOption[];
  // 条件配置数据
  public configConditions: FormData;
  // 播放时段
  public timeSlot: string[];
  // 播放日期
  public playTimeDate: string[];

  //上传类型
  public uploadType: string[];
  // 上传内容
  public fileList: UploadFile[][];
  //上传时长
  public uploadTime: (number | undefined)[];
  //上传组件pros
  public uploadFormProps: UploadProps;
  // 预览素材url
  public imgUrl: string[];
  // 预览上传类型
  public previewType: string;
  // 视频时长
  public videoTime: number;
  // 素材id
  public materialIdList: MaterialIdData[];
  //modalindex
  public modalIndex: number;
  public batchModalIndex: number;

  // 设备id
  public deviceIdList: number[];
  // 设备范围
  public device: string;
  // 选择方式
  public wayTypeAd: string;
  public wayTypeCa: string;
  public wayTypeLed: string;
  // 具体设备内容
  public deviceContent: string;
  // 具体设备
  public specificDevice: SingleValueType[];
  // 具体设备删除回显
  public specificDeviceData: React.Key[][];
  // 设备删除
  public removeEq: number; //1代表用删除之后的数据组成级联标签的值
  //选择设备数据
  public optionsDevice: OptionsType[];
  // 列表单项的数据
  public advertingListDataSource: AdvertisementDeviceListEntity[];
  public cashierListDataSource: AdvertisementDeviceListEntity[];
  public ledListDataSource: AdvertisementDeviceListEntity[];
  // 全部设备列表数据总数
  public advertingListDataLenght: number;
  public cashierListDataLenght: number;
  public ledListDataLenght: number;
  // 创建广告参数
  public createParams: CreateParamsEntity;
  // 过滤后的设备列表
  public resolutionList: AdvertisementDeviceListEntity[];
  // 过滤后的门店
  public storeNameList: AdvertisementDeviceListEntity[];
  public storeNameCashierList: AdvertisementDeviceListEntity[];
  public storeNameLedList: AdvertisementDeviceListEntity[];
  // 详情数据
  public DetailData: AdvertisementDetailEntity;
  // modal状态
  public modalType: string;
  // 素材占位
  public unshift: number;
  public cycleCode: LookupsEntity[];
  public advertisementLevelCode: LookupsEntity[];

  // 历史素材传过来的数据
  public materialData: MaterialHistoryRecordEntity;
  public materialIndex: number | undefined;

  public batchMaterialData: MaterialHistoryRecordEntity;
  public batchMaterialIndex: number | undefined;

  // 素材第一次进入渲染位置
  public defaultMaterial: number;

  public orgId: number;
  public tendId: number;
  public emptyFile: number;
  // 播放时段校验
  public timeRules: boolean;
  // 播放时段是否相同
  public timeRulesPlay: boolean;
  // 保存或者下一步的区分
  public nextRules: boolean;
  // 素材分辨率
  public materialResolution: string;
  // 素材列表长度
  public resolutionListLenght: number;
  // 素材列表的数据（添加或者删除进入第三步时用）
  public resolutionListData: AdvertisementDeviceListEntity[];
  //
  public isChange: boolean = false;
  public adName: string;
  public batchData: BatchData[];
  public copy: string;
  public banTime: boolean;

  public constructor() {
    this.cycleCode = [];
    this.advertisementLevelCode = [];
    this.advertingListDataLenght = 0;
    this.cashierListDataLenght = 0;
    this.ledListDataLenght = 0;
    this.modalType = '';
    this.DetailData = { timeList: [] };
    this.storeNameList = [];
    this.storeNameCashierList = [];
    this.storeNameLedList = [];
    this.resolutionList = [];
    this.createParams = {};
    this.setImagePreview = this.setImagePreview.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.advertisingModalVisible = false;
    this.current = 0;
    this.weeks = '';
    this.optionsCheck = [
      { label: '周一', value: '1' },
      { label: '周二', value: '2' },
      { label: '周三', value: '3' },
      { label: '周四', value: '4' },
      { label: '周五', value: '5' },
      { label: '周六', value: '6' },
      { label: '周日', value: '7' },
    ];
    this.configConditions = {
      advert: 'DAY',
      screen: 'COMMON',
    };
    this.timeSlot = ['00:00:00', '23:59:59'];

    this.uploadType = [];
    this.fileList = [];
    this.uploadTime = [];
    this.adName = '';
    this.batchData = [];
    this.videoTime = 0; // 视频时长
    this.modalIndex = 0; // modalindex
    this.batchModalIndex = 0;
    this.imgUrl = [];
    this.previewType = '';
    this.uploadFormProps = {
      name: 'file',
      method: 'POST',
      headers: {
        authorization: window.authorization,
      },
      listType: 'picture-card',
      defaultFileList: [],
    };
    this.materialIdList = [];
    this.deviceIdList = [];

    this.device = 'part';
    this.wayTypeAd = 'project';
    this.wayTypeCa = 'project';
    this.wayTypeLed = 'project';
    this.specificDevice = [];
    this.specificDeviceData = [];
    this.removeEq = 0;
    this.deviceContent = 'ADMACHINE';
    this.optionsDevice = [];
    this.advertingListDataSource = [];
    this.cashierListDataSource = [];
    this.ledListDataSource = [];
    this.unshift = 1; // 0 代表编辑， 1代表创建  2 都不能进入
    this.defaultMaterial = 0;
    this.materialData = {};
    this.materialIndex = undefined;
    this.batchMaterialData = {};
    this.batchMaterialIndex = undefined;
    this.emptyFile = 0; //0代表可以赋值， 1不能赋值

    this.orgId = 0;
    this.tendId = 0;
    this.timeRules = false;
    this.timeRulesPlay = false;
    this.nextRules = false;
    this.materialResolution = '';
    this.resolutionListLenght = 0;
    this.resolutionListData = [];
    this.banTime = false;

    this.playTimeDate = [];
    this.copy = '';
    makeObservable(this, {
      banTime: observable,
      copy: observable,
      adName: observable,
      batchData: observable,
      playTimeDate: observable,
      resolutionListData: observable,
      resolutionListLenght: observable,
      materialResolution: observable,
      nextRules: observable,
      timeRules: observable,
      timeRulesPlay: observable,
      orgId: observable,
      emptyFile: observable,
      tendId: observable,
      defaultMaterial: observable,
      materialData: observable,
      materialIndex: observable,
      batchMaterialData: observable,
      batchMaterialIndex: observable,
      cycleCode: observable,
      advertisementLevelCode: observable,
      advertingListDataLenght: observable,
      cashierListDataLenght: observable,
      ledListDataLenght: observable,
      modalType: observable,
      DetailData: observable,
      modalIndex: observable,
      batchModalIndex: observable,
      materialIdList: observable,
      fileList: observable,
      storeNameList: observable,
      storeNameCashierList: observable,
      storeNameLedList: observable,
      wayTypeAd: observable,
      wayTypeCa: observable,
      wayTypeLed: observable,
      specificDevice: observable,
      specificDeviceData: observable,
      removeEq: observable,
      timeSlot: observable,
      configConditions: observable,
      advertingListDataSource: observable,
      cashierListDataSource: observable,
      ledListDataSource: observable,
      optionsDevice: observable,
      deviceContent: observable,
      device: observable,
      imgUrl: observable,
      uploadType: observable,
      uploadTime: observable,
      uploadFormProps: observable,
      advertisingModalVisible: observable,
      current: observable,
      weeks: observable,
      optionsCheck: observable,
      formOnFinish: action,
      setAdvertisingModalVisible: action,
      setCurrent: action,
      cycleChange: action,
      setTimeSlot: action,
      setUploadType: action,
      setUploadTime: action,
      setImagePreview: action,
      deviceChange: action,
      switchDevice: action,
      setWayType: action,
      setDevice: action,
      saveRelease: action,
      setSelectAllByTenantId: action,
      initBackgroundItem: action,
      deleteDevice: action,
      getAdvertisementDetail: action,
      beforeUpload: action,
      getLookupsValue: action,
      getMaterialData: action,
      getSpecificGroupDevices: action,
      playTime: action,
      nameChange: action,
      dynamicData: action,
      dynamicName: action,
      isChange: observable,
    });
  }

  //批量广告展示
  public dynamicData = (type: string, index: number): void => {
    if (type === 'add') {
      // eslint-disable-next-line no-shadow
      const type = cloneDeep(this.uploadType);
      type.forEach((v, i) => {
        type[i] = '';
      });
      const time = cloneDeep(this.uploadTime);
      time.forEach((v, i) => {
        time[i] = undefined;
      });
      const list = cloneDeep(this.fileList);
      list.forEach((v, i) => {
        list[i] = [];
      });
      const imgUrl = cloneDeep(this.imgUrl);
      imgUrl.forEach((v, i) => {
        imgUrl[i] = '';
      });
      const idList = cloneDeep(this.materialIdList);
      idList.forEach((v, i) => {
        idList[i] = { id: 0, duration: 0 };
      });
      this.batchData.push({
        uploadType: type,
        fileList: list,
        uploadTime: time,
        adName: '',
        imgUrl,
        materialIdList: idList,
      });
    } else {
      console.log(JSON.parse(JSON.stringify(this.batchData)));
      this.batchData.splice(index, 1);
      console.log(JSON.parse(JSON.stringify(this.batchData)));
    }
  };

  //批量广告名称
  public dynamicName = (e: React.SyntheticEvent, index: number): void => {
    this.batchData[index].adName = (e.target as HTMLInputElement).value;
  };

  //设置广告名称
  public nameChange = (e: React.SyntheticEvent): void => {
    this.adName = (e.target as HTMLInputElement).value;
    this.createParams.adName = this.adName;
  };

  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 获取周期快码数据
        if (code === LookupsCodeTypes.AD_CYCLE_TYPE_CODE) {
          this.cycleCode = [...this.rootContainerUseCase.lookupsValue];
        }
        // 广告等级快码数据
        if (code === LookupsCodeTypes.AD_LEVEL_TYPE_CODE) {
          this.advertisementLevelCode = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.cycleCode = [];
        this.advertisementLevelCode = [];
      });
    }
  };

  // 第一步跳转第二步 保存和下一步的区分
  public setNextRules = (rules: boolean): void => {
    this.nextRules = rules;
  };
  //配置条件表单提交
  public formOnFinish = (
    values: FormData,
    advertisementListViewModel?: AdvertisementListViewModel,
  ): void => {
    if (this.timeSlot[0] === '' || this.timeSlot.length === 0) {
      this.timeRules = true;
      return;
    }

    if (this.timeRulesPlay) {
      return;
    }
    const { playTime, advert, weeks, doublePointsRulesFormList, screen } = values;
    this.configConditions = {
      advertisement: this.adName,
      playTime,
      advert,
      weeks,
      doublePointsRulesFormList,
      screen,
    };
    const pointsRulesParam: CreateParamsEntity = {};
    // 组装参数
    // 广告名称
    pointsRulesParam.adName = this.adName;
    // 播放日期
    if (playTime) {
      pointsRulesParam.cycleStartDate = playTime[0].format('YYYY-MM-DD');
      pointsRulesParam.cycleEndDate = playTime[1].format('YYYY-MM-DD');
    }
    // 具体广告
    pointsRulesParam.cycleType = advert;
    // 每周天数
    pointsRulesParam.cycleWeekDay = weeks?.join(',');
    // 播放时段
    let data: PlayTimeList[] | undefined = [];
    data =
      doublePointsRulesFormList?.map((item) => {
        return {
          cycleStartTime: item[0].format('HH:mm:ss'),
          cycleEndTime: item[1].format('HH:mm:ss'),
        };
      }) || [];

    // 播放时段第一条数据，因无法放进form，所以需要手动添加
    data.unshift({ cycleStartTime: this.timeSlot[0], cycleEndTime: this.timeSlot[1] });
    pointsRulesParam.playTimeList = data[0].cycleEndTime ? data : undefined;
    // 霸屏情况
    pointsRulesParam.levelType = screen;
    // 发布或者保存
    pointsRulesParam.publishOrSave = 0;
    //部分设备还是全部设备
    pointsRulesParam.partOrAll = this.device === DeviceScope.Part ? 0 : 1;
    // 如果全部设备有被删除过， 那么partOrAll传0
    if (
      this.advertingListDataLenght !== this.advertingListDataSource.length ||
      this.cashierListDataLenght !== this.cashierListDataSource.length ||
      this.ledListDataLenght !== this.ledListDataSource.length
    ) {
      pointsRulesParam.partOrAll = 0;
    }
    // 获取选中设备id集合
    this.advertingListDataSource.forEach((item) => {
      this.deviceIdList.push(item.id);
    });
    this.cashierListDataSource.forEach((item) => {
      this.deviceIdList.push(item.id);
    });
    this.ledListDataSource.forEach((item) => {
      this.deviceIdList.push(item.id);
    });
    const deviceIds = Array.from(new Set(this.deviceIdList));
    // 设备id列表
    pointsRulesParam.deviceIdList = deviceIds;
    // 素材id列表
    const resolutionArr: string[] = [];
    this.resolutionList.forEach((item) => {
      resolutionArr.push(item.resolution);
    });
    this.materialIdList.forEach((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.deviceResolution = resolutionArr[index];
    });
    // 过滤掉id为0多余的数据
    const fil = this.materialIdList.filter((item) => {
      return item.id !== 0;
    });
    // console.log(JSON.parse(JSON.stringify(this.materialIdList)), JSON.parse(JSON.stringify(fil)))
    pointsRulesParam.materialList = fil;

    this.createParams = pointsRulesParam;

    //判断下一步还是保存
    if (this.nextRules) {
      this.setCurrent('next');
    } else {
      // 判断编辑还是新增
      if (this.modalType === ModalStatus.Creat) {
        // 组织id
        pointsRulesParam.unitId = this.orgId;
        this.addNewAdvert(pointsRulesParam, advertisementListViewModel);
      } else {
        // 广告id
        pointsRulesParam.id = this.DetailData.adId;
        this.putNewAdvert(pointsRulesParam, advertisementListViewModel);
      }
    }
  };

  // 更新创建或者保存广告
  public putNewAdvert = (
    param: CreateParamsEntity,
    advertisementListViewModel?: AdvertisementListViewModel,
    publishOrSave?: string,
  ): void => {
    this.AdvertisementUseCase.setPutAdvertisement(param)
      .then((res) => {
        this.setAdvertisingModalVisible();
        if (publishOrSave) {
          utils.globalMessge({
            content: '发布成功',
            type: 'success',
          });
        } else {
          utils.globalMessge({
            content: '保存成功',
            type: 'success',
          });
        }
        if (advertisementListViewModel && res) {
          const { getAdvertisementList } = advertisementListViewModel;
          getAdvertisementList();
        }
      })
      .catch((error) => {
        if (error.failed) {
          utils.globalMessge({
            content: error.message,
            type: 'error',
          });
        }
      });
  };

  // 创建或者保存广告
  public addNewAdvert = (
    param: CreateParamsEntity,
    advertisementListViewModel?: AdvertisementListViewModel,
    publishOrSave?: string,
  ): void => {
    const data: CreateParamsEntity[] = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.batchData.length + 1; i++) {
      const cloneData = JSON.parse(JSON.stringify(param));
      data.push(cloneData);
    }
    if (this.batchData.length > 0) {
      this.batchData.forEach((item, index) => {
        data[index + 1].adName = this.batchData[index].adName;
        data[index + 1].materialList = this.batchData[index].materialIdList;
      });
    }

    this.AdvertisementUseCase.setCreateAdvertisement(data)
      .then((res) => {
        this.setAdvertisingModalVisible();
        if (publishOrSave) {
          utils.globalMessge({
            content: '发布成功',
            type: 'success',
          });
        } else {
          utils.globalMessge({
            content: '保存成功',
            type: 'success',
          });
        }
        if (advertisementListViewModel && res) {
          const { getAdvertisementList } = advertisementListViewModel;
          getAdvertisementList();
        }
      })
      .catch((error) => {
        if (error.failed) {
          utils.globalMessge({
            content: error.message,
            type: 'error',
          });
        }
      });
  };

  // 获取详情
  public getAdvertisementDetail = async (id?: number): Promise<boolean> => {
    const data = await this.AdvertisementUseCase.getAdvertisementDetail(id);
    runInAction(() => {
      this.DetailData = { ...data };
      // 判断部分还是全部调用不同的列表
      if (data.partOrAll === 1) {
        this.setSelectAllByTenantId(DeviceType.Advertisement);
        this.setSelectAllByTenantId(DeviceType.Cashier);
        this.setSelectAllByTenantId(DeviceType.Led);
      } else {
        this.getEditDeviceList(DeviceType.Advertisement, data.adId);
        this.getEditDeviceList(DeviceType.Cashier, data.adId);
        this.getEditDeviceList(DeviceType.Led, data.adId);
      }
      this.unshift = 0;
      // 回显播放时段
      if (data.timeList.length > 0) {
        this.timeSlot = [data.timeList[0].cycleStartTime, data.timeList[0].cycleEndTime];
      }

      // 处理formlist里面的播放时段格式
      let timeList: PlayTimeList[] = [];
      timeList = data.timeList;
      timeList.splice(0, 1);
      const arr = timeList.map((item) => {
        return [moment(item.cycleStartTime, 'HH:mm:ss'), moment(item.cycleEndTime, 'HH:mm:ss')];
      });
      this.weeks = data.cycleType || 'DAY';
      this.adName = data.adName || '';
      this.configConditions = {
        advertisement: data.adName,
        playTime: [moment(data.startDate, 'YYYY-MM-DD'), moment(data.endDate, 'YYYY-MM-DD')],
        advert: data.cycleType,
        weeks: data.cycleWeekDay?.split(','),
        doublePointsRulesFormList: arr,
        screen: data.levelType,
      };
      this.device = data.partOrAll === 0 ? 'part' : 'all';
      if (data.materialList && data.materialList.length > 0) {
        // data.materialList
        // 过滤掉id为0多余的数据
        const fil = data.materialList.filter((item) => {
          return String(item.id) !== 'null';
        });
        fil.forEach(async (item, index) => {
          this.uploadTime.push(undefined);
          this.uploadType.push('');
          this.fileList.push([]);
          this.imgUrl.push('');
          this.materialIdList.push({ id: 0, duration: 0 });
          // 拿到素材的id集合
          this.materialIdList[index].id = item.id;
          this.materialIdList[index].duration = item.duration;
          // 拿到素材的上传类型集合
          this.uploadType[index] =
            // eslint-disable-next-line no-nested-ternary
            (fil as MaterialList[])[index].type === UploadType.JPG ||
            (fil as MaterialList[])[index].type === UploadType.PNG
              ? 'image'
              : (fil as MaterialList[])[index].type === UploadType.MP4
              ? 'video'
              : '';
          console.log(JSON.parse(JSON.stringify(this.uploadType)));
          // 拿到素材的上传时间集合
          this.uploadTime[index] = (fil as MaterialList[])[index].duration || undefined;

          // 素材视频的地址filekey请求url
          if ((fil as MaterialList[])[index].fileKey) {
            const url = await this.fileUseCase.getPreviewUrl(
              (fil as MaterialList[])[index].fileKey || '',
            );
            if (
              (fil as MaterialList[])[index].type === UploadType.MP4
            ) {
              utils.getFramesUrl(url.fileTokenUrl || '').then((res) => {
                this.fileList[index] = [
                  {
                    uid: '-1',
                    name: 'iconUrl',
                    status: 'done',
                    url: url.fileTokenUrl || '',
                    thumbUrl: res,
                  },
                ];
              });
            } else {
              // 拿到素材图片的上传地址集合
              this.fileList[index] = [
                {
                  uid: '-1',
                  name: 'iconUrl',
                  status: 'done',
                  url: url.fileTokenUrl || '',
                  thumbUrl: url.fileTokenUrl || '',
                },
              ];
            }

            this.imgUrl[index] = url.fileTokenUrl || '';
          }

          // this.imgUrl[index] = (data.materialList as MaterialList[])[index].fileKey || '';
        });
      }
    });
    return true;
  };

  // 获取详情列表
  public getEditDeviceList = async (
    deviceType?: string,
    id?: number,
  ): Promise<AdvertisementDeviceListEntity[]> => {
    try {
      const data = await this.AdvertisementUseCase.getEditDeviceList(deviceType, id);
      runInAction(() => {
        data.forEach((item) => {
          this.deviceIdList.push(item.id);
        });
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
        // // 过滤有几个门店
        // this.storeNameList = data.filter((item, index) => {
        //   this.deviceIdList.push(item.id);
        //   const idx = data.findIndex((i) => {
        //     return item.storeName === i.storeName;
        //   });
        //   return index === idx;
        // });
        // this.advertingListDataSource = data;
      });
    } catch (e) {
      runInAction(() => {
        this.advertingListDataSource = [];
      });
    }
    return this.advertingListDataSource;
  };

  // 获取具体设备 -项目门店
  public getSpecificDevices = async (deviceTypeEnum: string): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getSpecificDevices(deviceTypeEnum);
      runInAction(() => {
        let resData = JSON.stringify(data);
        resData = resData
          .replace(new RegExp('floors', 'gm'), 'children')
          .replace(new RegExp('projectName', 'gm'), 'label')
          .replace(new RegExp('projectId', 'gm'), 'value')
          .replace(new RegExp('devices', 'gm'), 'children')
          .replace(new RegExp('floorName', 'gm'), 'label')
          .replace(new RegExp('floorCode', 'gm'), 'value')
          .replace(new RegExp('deviceName', 'gm'), 'label')
          .replace(new RegExp('deviceId', 'gm'), 'value');
        this.optionsDevice = JSON.parse(resData);
      });
    } catch (e) {
      runInAction(() => {
        this.optionsDevice = [];
      });
    }
  };

  // 获取具体设备 -项目门店-收银机
  public getGcashierDevices = async (deviceTypeEnum: string): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getGcashierDevices(deviceTypeEnum);
      runInAction(() => {
        let resData = JSON.stringify(data);
        resData = resData
          .replace(new RegExp('brandFormatList', 'gm'), 'children')
          .replace(new RegExp('projectId', 'gm'), 'value')
          .replace(new RegExp('projectName', 'gm'), 'label')
          .replace(new RegExp('deviceList', 'gm'), 'children')
          .replace(new RegExp('pointBrandName', 'gm'), 'label')
          .replace(new RegExp('pointBrandCode', 'gm'), 'value')
          .replace(new RegExp('pointBrandName', 'gm'), 'label')
          .replace(new RegExp('deviceId', 'gm'), 'value');
        this.optionsDevice = JSON.parse(resData);
      });
    } catch (e) {
      runInAction(() => {
        this.optionsDevice = [];
      });
    }
  };

  // 获取具体设备-分组
  public getSpecificGroupDevices = async (deviceTypeEnum: string): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.getSpecificGroupDevices(deviceTypeEnum);
      runInAction(() => {
        let resData = JSON.stringify(data);
        resData = resData
          .replace(new RegExp('floors', 'gm'), 'children')
          .replace(new RegExp('projectName', 'gm'), 'label')
          .replace(new RegExp('projectId', 'gm'), 'value')
          .replace(new RegExp('devices', 'gm'), 'children')
          .replace(new RegExp('floorName', 'gm'), 'label')
          .replace(new RegExp('floorCode', 'gm'), 'value')
          .replace(new RegExp('deviceName', 'gm'), 'label')
          .replace(new RegExp('id', 'gm'), 'value');
        if (deviceTypeEnum === DeviceType.Cashier) {
          resData = resData.replace(new RegExp('pointBrandName', 'gm'), 'label');
        } else {
          resData = resData.replace(new RegExp('deviceName', 'gm'), 'label');
        }
        this.optionsDevice = JSON.parse(resData);
      });
    } catch (e) {
      runInAction(() => {
        this.optionsDevice = [];
      });
    }
  };
  //设置发布广告model显示隐藏
  public setAdvertisingModalVisible = (
    type?: string,
    rootContainereViewModel?: RootContainereViewModel,
    copy?: string,
  ): void => {
    if (rootContainereViewModel) {
      this.orgId = rootContainereViewModel.userInfo.organizationId || 0;
      this.tendId = rootContainereViewModel.userInfo.tenantId || 0;
    }
    if (copy === 'copy') {
      this.copy = 'copy';
      // 清除配置条件所有数据
      // this.configConditions = {
      //   advert: 'DAY',
      //   // screen: 'COMMON',
      // };
      this.configConditions.playTime = [];
      this.configConditions.advert = 'DAY';
      this.configConditions.doublePointsRulesFormList = [];
      // 清除播放时段
      this.timeSlot = [];
      // 周
      this.weeks = '';
      this.adName = '';
    }
    // 新增的时候清除
    if (type === ModalStatus.Creat) {
      this.fileList = [];
      this.materialIdList = [];
      // 清除配置条件所有数据
      this.configConditions = {
        advert: 'DAY',
        screen: 'COMMON',
      };
      // 清除播放时段
      this.timeSlot = ['00:00:00', '23:59:59'];
      // 周
      this.weeks = '';
    }

    this.nextRules = false;
    this.timeRules = false;
    this.timeRulesPlay = false;
    this.modalType = type || '';
    // tabs
    this.current = 0;

    this.advertisingModalVisible = !this.advertisingModalVisible;

    // 具体设备内容
    this.deviceContent = 'ADMACHINE';
    // 设备id集合
    this.deviceIdList = [];
    // 只在关闭得时候清空设备列表数据
    if (!type) {
      this.copy = '';
      this.adName = '';
      this.batchData = [];
      this.defaultMaterial = 0;
      this.unshift = 1;
      // 发送范围
      this.device = 'part';
      this.wayTypeAd = 'project';
      this.wayTypeCa = 'project';
      this.wayTypeLed = 'project';
      this.advertingListDataSource = [];
      this.cashierListDataSource = [];
      this.ledListDataSource = [];
      this.storeNameList = [];
      this.storeNameCashierList = [];
      this.storeNameLedList = [];
      this.uploadType = [];
      this.fileList = [];
      this.uploadTime = [];
      this.banTime = false;
      // this.materialIdList = [];
    }
  };

  //改变步骤
  public setCurrent = (type: string): void => {
    if (type === 'next') {
      // 所有设备下已选择投放的设备
      const data = this.advertingListDataSource
        .concat(this.cashierListDataSource)
        .concat(this.ledListDataSource);
      if (this.current === 1 && data.length === 0) {
        utils.globalMessge({
          content: '请选择需投放广告的设备',
          type: 'error',
        });
        return;
      }
      this.current += 1;
      // 进入上传素材
      if (this.current === 2) {
        // 筛选分辨率
        this.resolutionList = data.filter((item, index) => {
          const idx = data.findIndex((i) => {
            return item.resolution === i.resolution;
          });
          return index === idx;
        });
        // 创建时候第一次进入第三步  此方法只执行一次
        if (this.unshift === 1 && this.defaultMaterial === 0) {
          // 第一次进入第三步设备列表的长度
          this.resolutionListLenght = this.resolutionList.length;
          // 第一次进入第三步设备列表的数据 添加或者删除的时候要用（用作判断删除素材的index为多少的数据）
          this.resolutionListData = this.resolutionList;
          // 先给素材数据添加有多少个
          this.resolutionList.forEach(() => {
            this.uploadType.push('');
            this.uploadTime.push(undefined);
            this.materialIdList.push({ id: 0, duration: 0 });
            this.fileList.push([]);
            this.imgUrl.push('');
          });
          this.defaultMaterial = 1;
        }
        // 如果设备列表有添加或者删除的话
        if (this.unshift === 2 && this.defaultMaterial === 1) {
          // 设备列表有添加新的分辨率设备
          if (this.resolutionListLenght < this.resolutionList.length) {
            for (let i = 0; i < this.resolutionList.length - this.resolutionListLenght; i += 1) {
              this.uploadType.push('');
              this.uploadTime.push(undefined);
              this.materialIdList.push({ id: 0, duration: 0 });
              this.fileList.push([]);
              this.imgUrl.push('');
              if (this.batchData.length > 0) {
                this.batchData.forEach((item) => {
                  item.uploadType.push('');
                  item.uploadTime.push(undefined);
                  item.materialIdList.push({ id: 0, duration: 0 });
                  item.fileList.push([]);
                  item.imgUrl.push('');
                });
              }
            }
          }
          // 设备列表删除了分辨率设备  需要删除之前填写的数据
          if (this.resolutionListLenght > this.resolutionList.length) {
            const subset = [];
            // 求出两个数组的差集
            // eslint-disable-next-line no-restricted-syntax
            for (const item of this.resolutionListData) {
              if (!this.resolutionList.includes(item)) {
                subset.push(item);
              }
            }
            const inList: number[] = [];
            // 求出是原始数据下标为多少的数据
            subset.forEach((item) => {
              const v1 = this.resolutionListData.findIndex((value) => value === item);
              inList.push(v1);
            });
            // 删除素材里对应的数据
            inList.forEach((item) => {
              this.uploadType.splice(item, 1);
              this.uploadTime.splice(item, 1);
              this.materialIdList.splice(item, 1);
              this.fileList.splice(item, 1);
              this.imgUrl.splice(item, 1);
              if (this.batchData.length > 0) {
                this.batchData.forEach((i) => {
                  i.uploadType.splice(item, 1);
                  i.uploadTime.splice(item, 1);
                  i.materialIdList.splice(item, 1);
                  i.fileList.splice(item, 1);
                  i.imgUrl.splice(item, 1);
                });
              }
            });
          }
        }
        // 编辑时候第一次进入第三步  此方法只执行一次
        if (this.unshift === 0) {
          if (this.DetailData.materialList?.length === 0) {
            this.resolutionList.forEach(() => {
              this.uploadType.push('');
              this.uploadTime.push(undefined);
              this.materialIdList.push({ id: 0, duration: 0 });
              this.fileList.push([]);
              this.imgUrl.push('');
            });
          } else {
            // 通过双循环拿到设备列表具体分辨率的index，通过index循环往素材数据开始push多少项，以此占主应有的位置
            // this.resolutionList.forEach((ite, index) => {
            //   this.DetailData.materialList?.forEach((k) => {
            //     if (k.resolution === ite.resolution) {
            //       for (let i = 0; i < index; i += 1) {
            //         this.materialIdList.unshift({
            //           id: 0,
            //           duration: 0,
            //         });
            //         this.uploadTime.unshift(undefined);
            //         this.uploadType.unshift('');
            //         this.fileList.unshift([]);
            //         this.imgUrl.unshift('');
            //       }
            //     }
            //   });
            // });
          }
        }
        this.unshift = 2;
      }
    } else {
      this.current -= 1;
      // 第一步区分保存或者下一步
      this.nextRules = false;
    }
  };

  //改变周期
  public cycleChange = (e: RadioChangeEvent): void => {
    this.weeks = e.target.value;
  };

  //设置播放时段
  public setTimeSlot = (dates: RangeValue<Moment>, dateStrings: string[]): void => {
    if (this.playTimeDate[0] === this.playTimeDate[1]) {
      if (dateStrings[0] === dateStrings[1]) {
        if (dateStrings[0]) {
          this.timeRulesPlay = true;
        } else {
          this.timeRulesPlay = false;
        }
      } else {
        this.timeRulesPlay = false;
      }
    }
    this.timeSlot = dateStrings;
    if (this.timeSlot[0] !== '') {
      this.timeRules = false;
    } else {
      this.timeRules = true;
    }
  };

  // 播放日期选择
  public playTime = (dates: RangeValue<Moment>, dateStrings: string[]): void => {
    this.playTimeDate = dateStrings;
    const date = new Date();
    const MonthYear = date.getFullYear();
    const Month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const Today = date.getDate();
    console.log(dateStrings[0], `${MonthYear}-${Month}-${Today}`);
    if (
      dateStrings[0] === `${MonthYear}-${Month}-${Today}` &&
      dateStrings[1] === `${MonthYear}-${Month}-${Today}`
    ) {
      this.banTime = true;
    } else {
      this.banTime = false;
    }
  };

  //设置上传类型
  public setUploadType = (e: string, index: number, i?: number): void => {
    this.isChange = false;
    // 不进入历史回填的type判断里
    this.materialIndex = undefined;
    if (i || i === 0) {
      this.batchData[i].uploadType[index] = e;
      if (e === UploadType.IMAGE) {
        this.batchData[i].fileList[index] = [];
        this.batchData[i].materialIdList[index].id = 0;
        // 保留播放时长
        // this.batchData[i].materialIdList[index].duration = 0;
        // this.batchData[i].uploadTime[index] = undefined;
      } else {
        // this.uploadTime[index] = undefined;
        // this.batchData[i].materialIdList[index].duration = 0;
        this.batchData[i].fileList[index] = [];
        this.batchData[i].materialIdList[index].id = 0;
      }
    } else {
      this.uploadType[index] = e;
      if (e === UploadType.IMAGE) {
        this.fileList[index] = [];
        this.materialIdList[index].id = 0;
        // this.materialIdList[index].duration = 0;
        // this.uploadTime[index] = undefined;
      } else {
        // this.uploadTime[index] = undefined;
        // this.materialIdList[index].duration = 0;
        this.fileList[index] = [];
        this.materialIdList[index].id = 0;
      }
    }
  };

  // 设置上传时长
  public setUploadTime = (e: number, index: number, i?: number): void => {
    if (i || i === 0) {
      this.batchData[i].uploadTime[index] = e;
      this.batchData[i].materialIdList[index].duration = e;
    } else {
      this.uploadTime[index] = e;
      this.materialIdList[index].duration = e;
    }
  };

  // 背景图上传回调
  public uploadChange = async (
    info: UploadChangeParam,
    index: number,
    resolution?: string,
    i?: number,
  ): Promise<void> => {
    console.log(resolution);
    const { status } = info.file;
    if (status === 'done') {
      const data = await this.fileUseCase.getPreviewUrl(info.file.response.fileKey);
      runInAction(() => {
        if (i || i === 0) {
          this.batchData[i].imgUrl[index] = data.fileTokenUrl || '';
        } else {
          this.imgUrl[index] = data.fileTokenUrl || '';
        }
      });

      // 创建素材
      const urlParam: CreateMaterialEntity = {};
      urlParam.name = info.file.name;
      urlParam.description = '';
      urlParam.duration =
        info.file.type?.split('/')[0] === UploadType.VIDEO
          ? this.videoTime
          : this.uploadTime[index];
      urlParam.fileHash = data.md5;
      urlParam.fileKey = info.file.response.fileKey; //data.fileTokenUrl;
      urlParam.unitId = this.orgId;
      urlParam.resolution = this.materialResolution;
      urlParam.size = String(info.file.size);
      urlParam.tenantId = this.tendId;
      urlParam.type = info.file.name?.split('.').reverse()[0];
      const id = await this.AdvertisementUseCase.setCreateMaterial(urlParam);

      // 存id，保存或者发布需要
      if (this.emptyFile === 0) {
        if (i || i === 0) {
          this.batchData[i].materialIdList[index].id = id;
        } else {
          this.materialIdList[index].id = id;
        }
      }
      this.isChange = true;
    } else if (status === 'error') {
      this.isChange = false;
      utils.globalMessge({
        content: '素材上传失败!',
        type: 'error',
      });
    }
    runInAction(() => {
      if (this.emptyFile === 0) {
        if (i || i === 0) {
          this.batchData[i].fileList[index] = info.fileList;
        } else {
          this.fileList[index] = info.fileList;
        }
      }
    });
  };

  public setImagePreview(
    file: UploadFile<unknown>,
    ref: React.RefObject<MaterialPreviewModal>,
    index: number,
    i?: number,
  ): void {
    ref.current?.setIsModalVisible();
    if (i || i === 0) {
      this.batchModalIndex = i;
    }
    this.modalIndex = index;
  }

  public beforeUpload(
    file: RcFile,
    fileType: RcFile[],
    resolution: string,
    index: number,
    i?: number,
  ): Promise<boolean | string> {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      // 批量
      if (i || i === 0) {
        if (
          this.batchData[i].uploadType[index] === UploadType.IMAGE &&
          file.name.split('.').reverse()[0] !== UploadType.JPG &&
          file.name.split('.').reverse()[0] !== UploadType.PNG
        ) {
          message.error('上传图片类型不符,请重新上传');
          return Upload.LIST_IGNORE;
        }
        if (
          this.batchData[i].uploadType[index] === UploadType.VIDEO &&
          file.name.split('.').reverse()[0] !== UploadType.MP4
        ) {
          message.error('上传视频类型不符，请重新上传');
          return Upload.LIST_IGNORE;
        }
      } else {
        if (
          this.uploadType[index] === UploadType.IMAGE &&
          file.name.split('.').reverse()[0] !== UploadType.JPG &&
          file.name.split('.').reverse()[0] !== UploadType.PNG
        ) {
          message.error('上传图片类型不符,请重新上传');
          return Upload.LIST_IGNORE;
        }
        if (
          this.uploadType[index] === UploadType.VIDEO &&
          file.name.split('.').reverse()[0] !== UploadType.MP4
        ) {
          message.error('上传视频类型不符，请重新上传');
          return Upload.LIST_IGNORE;
        }
      }

      this.emptyFile = 0;
      const isLt = [];

      if (file.type.split('/')[0] === UploadType.VIDEO) {
        const isLt20M = file.size / 1024 / 1024 > 20;
        if (isLt20M) {
          message.error('请上传20M内的视频格式');
          // isLt.push(1);
          return Upload.LIST_IGNORE;
        }
      }
      if (file.type.split('/')[0] === UploadType.IMAGE) {
        const isLt2M = file.size / 1024 / 1024 > 2;
        if (isLt2M) {
          message.error('请上传2M内图片格式');
          // isLt.push(2);
          return Upload.LIST_IGNORE;
        }
      }

      // 拿到视频的时长
      const videoUrl = URL.createObjectURL(file);
      const videoObj = document.createElement('video');
      videoObj.preload = 'metadata';
      videoObj.src = videoUrl;
      videoObj.onloadedmetadata = (): string | void => {
        URL.revokeObjectURL(videoUrl);
        const times = Math.round(videoObj.duration);
        this.videoTime = times;
        if (times < 5 || times > 20) {
          message.error('请上传5-20秒内的视频素材');
          if (i || i === 0) {
            this.batchData[i].fileList[index] = [];
            this.batchData[i].materialIdList[index].id = 0;
          } else {
            this.fileList[index] = [];
            this.materialIdList[index].id = 0;
          }

          return Upload.LIST_IGNORE;
        }
        if (i || i === 0) {
          this.batchData[i].materialIdList[index].duration = times;
        } else {
          this.materialIdList[index].duration = times;
        }
        // 拿到视频的分辨率
        this.materialResolution = `${videoObj.videoWidth}*${videoObj.videoHeight}`;
        if (resolution !== `${videoObj.videoWidth}*${videoObj.videoHeight}`) {
          if (isLt.length === 0) {
            Modal.confirm({
              title: '提示',
              maskClosable: true,
              content: '当前上传的素材分辨率与设备分辨率不符，是否继续上传?',
              icon: undefined,
              onOk: () => {
                return resolve(true);
              },
              onCancel: () => {
                if (i || i === 0) {
                  this.batchData[i].fileList[index] = [];
                  this.batchData[i].materialIdList[index].id = 0;
                  this.batchData[i].materialIdList[index].duration = 0;
                } else {
                  this.fileList[index] = [];
                  this.materialIdList[index].id = 0;
                  this.materialIdList[index].duration = 0;
                }

                this.emptyFile = 1;
                isLt.push(2);
              },
            });
          }
        } else {
          return resolve(true);
        }
      };
      // 拿到图片分辨率
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        const image = new Image();
        image.src = (reader.result as string) || '';
        image.onload = (): void => {
          this.materialResolution = `${image.width}*${image.height}`;
          if (resolution !== `${image.width}*${image.height}`) {
            if (isLt.length === 0) {
              Modal.confirm({
                title: '提示',
                maskClosable: true,
                content: '当前上传的素材分辨率与设备分辨率不符，是否继续上传?',
                icon: undefined,
                onOk: () => {
                  return resolve(true);
                },
                onCancel: () => {
                  if (i || i === 0) {
                    this.batchData[i].fileList[index] = [];
                    this.batchData[i].materialIdList[index].id = 0;
                  } else {
                    this.fileList[index] = [];
                    this.materialIdList[index].id = 0;
                  }
                  this.emptyFile = 1;
                  isLt.push(2);
                },
              });
            }
          } else {
            return resolve(true);
          }
        };
      };
    });
  }
  public initBackgroundItem = async (index: number, i?: number): Promise<void> => {
    this.isChange = false;
    if (i || i === 0) {
      this.batchData[i].materialIdList[index].id = 0;
      // this.batchData[i].materialIdList[index].duration = 0;
    } else {
      this.materialIdList[index].id = 0;
      // this.materialIdList[index].duration = 0;
    }
  };

  // 切换设备
  public switchDevice = (value: string): void => {
    this.deviceContent = value;
    this.specificDevice = [];
    this.specificDeviceData = [];

    if (value === DeviceType.Advertisement) {
      if (this.wayTypeAd === 'project') {
        this.getSpecificDevices(value);
      } else {
        this.getSpecificGroupDevices(value);
      }
    }

    if (value === DeviceType.Cashier) {
      if (this.wayTypeCa === 'project') {
        this.getGcashierDevices(value);
      } else {
        this.getSpecificGroupDevices(value);
      }
    }

    if (value === DeviceType.Led) {
      if (this.wayTypeLed === 'project') {
        this.getSpecificDevices(value);
      } else {
        this.getSpecificGroupDevices(value);
      }
    }

    // 创建 和编辑的时候全部设备调用接口
    if (this.device === DeviceScope.All) {
      // this.setSelectAllByTenantId(value);
    }

    // 编辑的时候 部分设备和调用这个列表
    if (this.device === DeviceScope.Part && this.modalType === ModalStatus.Edit) {
      // this.getEditDeviceList(value, this.DetailData.adId);
    }
  };

  // 切换设备范围
  public deviceChange = (e: RadioChangeEvent): void => {
    this.specificDevice = [];
    this.specificDeviceData = [];
    this.device = e.target.value;
    this.deviceContent = 'ADMACHINE';
    this.advertingListDataSource = [];
    this.cashierListDataSource = [];
    this.ledListDataSource = [];
    this.storeNameList = [];
    this.storeNameCashierList = [];
    this.storeNameLedList = [];
    this.deviceIdList = [];
    // this.wayType = 'project';
    // 点全部设备的时候调用接口（不论是新增或者编辑）
    if (e.target.value === DeviceScope.All) {
      // 请求所有设备列表
      this.setSelectAllByTenantId(DeviceType.Advertisement);
      this.setSelectAllByTenantId(DeviceType.Cashier);
      this.setSelectAllByTenantId(DeviceType.Led);
    }

    // 点部分设备并且是创建的时候，清除数据
    if (e.target.value === DeviceScope.Part && this.modalType === ModalStatus.Creat) {
      // this.advertingListDataSource = [];
    }
    // 点部分设备并且是编辑的时候调用接口
    if (e.target.value === DeviceScope.Part && this.modalType === ModalStatus.Edit) {
      this.getEditDeviceList(DeviceType.Advertisement, this.DetailData.adId);
      this.getEditDeviceList(DeviceType.Cashier, this.DetailData.adId);
      this.getEditDeviceList(DeviceType.Led, this.DetailData.adId);
    }
  };

  // 切换选择方式
  public setWayType = (e: string): void => {
    this.specificDevice = [];
    this.specificDeviceData = [];
    if (this.deviceContent === DeviceType.Advertisement) {
      this.wayTypeAd = e;
    } else if (this.deviceContent === DeviceType.Cashier) {
      this.wayTypeCa = e;
    } else if (this.deviceContent === DeviceType.Led) {
      this.wayTypeLed = e;
    }
    if (e === 'project') {
      if (this.deviceContent === DeviceType.Cashier) {
        this.getGcashierDevices(this.deviceContent);
      } else {
        this.getSpecificDevices(this.deviceContent);
      }
    } else {
      this.getSpecificGroupDevices(this.deviceContent);
    }
  };

  // 获取列表数据
  public setSelectAllByTenantId = async (deviceType?: string): Promise<void> => {
    try {
      const data = await this.AdvertisementUseCase.setSelectAllByTenantId(deviceType);
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
      // this.switchSetDataSource(this.deviceContent, data);
      // this.getStoreCount();
      // runInAction(() => {
      //   // 过滤有几个门店
      //   this.storeNameList = data.filter((item, index) => {
      //     const idx = data.findIndex((i) => {
      //       return item.storeName === i.storeName;
      //     });
      //     return index === idx;
      //   });
      //   this.advertingListDataSource = data;
      //   this.advertingListDataLenght = data.length;
      // });
    } catch (e) {
      runInAction(() => {
        this.advertingListDataSource = [];
      });
    }
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
              .replace(new RegExp('label', 'gm'), 'pointBrandName')
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
    this.switchSetDataSource(this.deviceContent, undefined, middleArr);
    // // 拿到门店数量
    this.getStoreCount();
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
        // if(this.modalType === ModalStatus.Edit){
        // console.log(data)
        // this.advertingListDataSource = this.advertingListDataSource.concat(source || [])
        // }else{
        this.advertingListDataSource = source;
        // }
        if (data?.length) {
          this.advertingListDataLenght = data?.length;
        }
        break;
      case DeviceType.Cashier:
        this.cashierListDataSource = source;
        if (data?.length) {
          this.cashierListDataLenght = data.length;
        }
        break;
      case DeviceType.Led:
        this.ledListDataSource = source; //this.ledListDataSource.concat(data);
        if (data?.length) {
          this.ledListDataLenght = data.length;
        }
        break;
      default:
        this.advertingListDataSource.concat(source);
        break;
    }
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

  // 删除单项列表数据
  public deleteDevice = (record: AdvertisementDeviceListEntity): void => {
    this.removeEq = 1;
    if (this.deviceContent === DeviceType.Advertisement) {
      const newArr = this.advertingListDataSource.filter((obj) => {
        return record.id !== obj.id;
      });
      this.advertingListDataSource = newArr;
      const deviceData: React.Key[][] = [];
      if (this.wayTypeAd === 'project') {
        newArr.forEach((item) => {
          deviceData.push([item.storeId, item.floor, item.id]);
        });
      } else {
        newArr.forEach((item) => {
          deviceData.push([item.groupId || 0, item.floor, item.id]);
        });
      }

      this.specificDeviceData = deviceData;
    }
    if (this.deviceContent === DeviceType.Cashier) {
      const newArr = this.cashierListDataSource.filter((obj) => {
        return record.id !== obj.id;
      });
      this.cashierListDataSource = newArr;
      const deviceData: React.Key[][] = [];
      if (this.wayTypeCa === 'project') {
        newArr.forEach((item) => {
          deviceData.push([item.storeId, item.brandFormat || '', item.id]);
        });
      } else {
        newArr.forEach((item) => {
          deviceData.push([item.groupId || 0, item.floor || '', item.id]);
        });
      }
      this.specificDeviceData = deviceData;
    }
    if (this.deviceContent === DeviceType.Led) {
      const newArr = this.ledListDataSource.filter((obj) => {
        return record.id !== obj.id;
      });
      this.ledListDataSource = newArr;
      const deviceData: React.Key[][] = [];
      if (this.wayTypeLed === 'project') {
        newArr.forEach((item) => {
          deviceData.push([item.storeId, item.floor || '', item.id]);
        });
      } else {
        newArr.forEach((item) => {
          deviceData.push([item.groupId || 0, item.floor || '', item.id]);
        });
      }
      this.specificDeviceData = deviceData;
    }
    this.getStoreCount();
    // 从设备id列表中删除
    const deviceIds = Array.from(new Set(this.deviceIdList));
    const index = deviceIds.indexOf(record.id);
    deviceIds.splice(index, 1);
    this.deviceIdList = deviceIds;
    // 编辑的时候 删除需要解绑设备
    if (this.modalType === ModalStatus.Edit) {
      this.AdvertisementUseCase.requestunBindAdDevice(this.DetailData.adId, [record.id]);
    }
  };

  // 保存或者发布
  public saveRelease = (
    type?: string,
    publishOrSave?: string,
    advertisementListViewModel?: AdvertisementListViewModel,
  ): void => {
    // 去重
    const dataSource = this.advertingListDataSource.filter((item, index) => {
      const idx = this.advertingListDataSource.findIndex((i) => {
        return item.id === i.id;
      });
      return index === idx;
    });
    dataSource.forEach((item) => {
      this.deviceIdList.push(item.id);
    });

    const cashierDataSource = this.cashierListDataSource.filter((item, index) => {
      const idx = this.cashierListDataSource.findIndex((i) => {
        return item.id === i.id;
      });
      return index === idx;
    });
    cashierDataSource.forEach((item) => {
      this.deviceIdList.push(item.id);
    });

    const ledDataSource = this.ledListDataSource.filter((item, index) => {
      const idx = this.ledListDataSource.findIndex((i) => {
        return item.id === i.id;
      });
      return index === idx;
    });
    ledDataSource.forEach((item) => {
      this.deviceIdList.push(item.id);
    });
    if (this.deviceIdList.length === 0) {
      utils.globalMessge({
        content: '请选择需投放广告的设备',
        type: 'error',
      });
      return;
    }
    const deviceIds = Array.from(new Set(this.deviceIdList));

    this.createParams.unitId = this.orgId;
    this.createParams.deviceIdList = deviceIds;
    const resolutionArr: string[] = [];
    this.resolutionList.forEach((item) => {
      resolutionArr.push(item.resolution);
    });
    this.materialIdList.forEach((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.deviceResolution = resolutionArr[index];
    });

    if (this.batchData.length > 0) {
      this.batchData.forEach((i) => {
        i.materialIdList.forEach((item, index) => {
          // eslint-disable-next-line no-param-reassign
          item.deviceResolution = resolutionArr[index];
        });
      });
    }

    // 过滤掉id为0多余的数据
    const fil = this.materialIdList.filter((item) => {
      return item.id !== 0;
    });
    this.createParams.materialList = fil;

    // 如果全部设备有被删除过， 那么partOrAll传0
    if (this.device === DeviceScope.Part) {
      this.createParams.partOrAll = 0;
    }
    if (
      this.device === DeviceScope.All &&
      // 请求之后的长度               //  操作之后的长度
      (this.advertingListDataLenght !== this.advertingListDataSource.length ||
        this.cashierListDataLenght !== this.cashierListDataSource.length ||
        this.ledListDataLenght !== this.ledListDataSource.length)
    ) {
      this.createParams.partOrAll = 0;
    } else if (this.device === DeviceScope.All) {
      // 如果没有删除并且点击了全部partOrAll传1
      this.createParams.partOrAll = 1;
    }

    // 校验素材
    let required = true;
    if (type === 'material') {
      // 批量校验
      if (this.batchData.length > 0) {
        this.batchData.forEach((i) => {
          let filterUploadType = [];
          let filterUploadTime = [];
          i.uploadType.forEach((item, index) => {
            if (item === '' || i.materialIdList[index].id === 0) {
              filterUploadType = [''];
            } else {
              filterUploadType = [];
            }

            if (
              item === UploadType.IMAGE &&
              (i.uploadTime[index] === undefined || JSON.stringify(i.uploadTime[index]) === 'null')
            ) {
              filterUploadTime = ['IMAGE'];
            } else {
              filterUploadTime = [];
            }
          });

          if (filterUploadTime?.length > 0) {
            utils.globalMessge({
              content: '请输入播放时长',
              type: 'error',
            });
            required = false;
            return;
          }
          if (filterUploadType?.length > 0 && !i.adName && required) {
            utils.globalMessge({
              content: '请对新增的广告名称进行填写和素材上传，如果不填写和上传请进行删除',
              type: 'error',
            });
            required = false;
            return;
          }
          if (filterUploadType?.length > 0 && required) {
            utils.globalMessge({
              content: '请上传对应广告名称的素材内容',
              type: 'error',
            });
            required = false;
            return;
          }
          if (!i.adName && required) {
            utils.globalMessge({
              content: '请输入广告名称',
              type: 'error',
            });
            required = false;
            // return;
          }
        });
      }
      if (required === true) {
        let filterUploadType = [];
        let filterUploadTime = [];
        this.uploadType.forEach((item, index) => {
          if (item === '' || this.materialIdList[index].id === 0) {
            filterUploadType = [''];
          } else {
            filterUploadType = [];
          }

          if (
            item === UploadType.IMAGE &&
            (this.uploadTime[index] === undefined ||
              JSON.stringify(this.uploadTime[index]) === 'null')
          ) {
            filterUploadTime = ['IMAGE'];
          } else {
            filterUploadTime = [];
          }
        });
        // const filterUploadType = this.uploadType.filter((item, index) => {
        //   return item === '' || this.materialIdList[index].id === 0;
        // });
        // const filterUploadTime = this.uploadType.filter((item, index) => {
        //   return (
        //     item === UploadType.IMAGE &&
        //     (this.uploadTime[index] === undefined ||
        //       JSON.stringify(this.uploadTime[index]) === 'null')
        //   );
        // });

        if (filterUploadType?.length > 0 && !this.adName) {
          utils.globalMessge({
            content: '请对新增的广告名称进行填写和素材上传，如果不填写和上传请进行删除',
            type: 'error',
          });
          required = false;
          return;
        }
        if (filterUploadType?.length > 0) {
          utils.globalMessge({
            content: '请上传对应广告名称的素材内容',
            type: 'error',
          });
          required = false;
          return;
        }
        if (!this.adName) {
          utils.globalMessge({
            content: '请输入广告名称',
            type: 'error',
          });
          required = false;
          return;
        }
        if (filterUploadTime?.length > 0) {
          utils.globalMessge({
            content: '请输入播放时长',
            type: 'error',
          });
          required = false;
          return;
        }
      }
    }
    if (type === 'material' && !publishOrSave) {
      this.createParams.publishOrSave = 0;
    }

    if (type === 'material' && publishOrSave === 'publish') {
      this.createParams.publishOrSave = 1;
    }
    if (required) {
      // 新增还是编辑
      if (this.copy === 'copy') {
        this.createParams.unitId = this.orgId;
        this.addNewAdvert(this.createParams, advertisementListViewModel, publishOrSave);
      } else {
        if (this.modalType === ModalStatus.Creat) {
          // 组织id
          this.createParams.unitId = this.orgId;
          this.addNewAdvert(this.createParams, advertisementListViewModel, publishOrSave);
        } else {
          // 广告id
          this.createParams.id = this.DetailData.adId;
          this.createParams.objectVersionNumber = this.DetailData.objectVersionNumber;
          this.putNewAdvert(this.createParams, advertisementListViewModel, publishOrSave);
        }
      }
    }
  };
  // 获取选中的素材数据
  public getMaterialData = async (
    data: MaterialHistoryRecordEntity,
    index: number,
    i?: number | undefined,
  ): Promise<void> => {
    if (i || i === 0) {
      this.batchMaterialData = data;
      this.batchMaterialIndex = index;
      console.log(JSON.parse(JSON.stringify(this.batchData)), i, index);
      this.batchData[i].materialIdList[index].id = data.id;
      // 拿到素材的上传类型集合
      this.batchData[i].uploadType[index] =
        data.type === UploadType.JPG || data.type === UploadType.PNG ? 'image' : 'video';
      // 拿到素材的上传时间集合
      // this.uploadTime[index] = data.duration || undefined;
      const url = await this.fileUseCase.getPreviewUrl(data.fileKey || '');
      if (data.type === UploadType.MP4) {
        this.batchData[i].materialIdList[index].duration = data.duration;
        utils.getFramesUrl(url.fileTokenUrl || '').then((res) => {
          this.batchData[i].fileList[index] = [
            {
              uid: '-1',
              name: 'iconUrl',
              status: 'done',
              url: url.fileTokenUrl || '',
              thumbUrl: res,
            },
          ];
        });
      } else {
        // 拿到素材图片的上传地址集合
        this.batchData[i].fileList[index] = [
          {
            uid: '-1',
            name: 'iconUrl',
            status: 'done',
            url: url.fileTokenUrl || '',
            thumbUrl: url.fileTokenUrl || '',
          },
        ];
      }
      this.batchData[i].imgUrl[index] = url.fileTokenUrl || '';
    } else {
      this.materialData = data;
      this.materialIndex = index;
      this.materialIdList[index].id = data.id;
      // 拿到素材的上传类型集合
      this.uploadType[index] =
        data.type === UploadType.JPG || data.type === UploadType.PNG ? 'image' : 'video';
      // 拿到素材的上传时间集合
      // this.uploadTime[index] = data.duration || undefined;
      const url = await this.fileUseCase.getPreviewUrl(data.fileKey || '');
      if (data.type === UploadType.MP4) {
        this.materialIdList[index].duration = data.duration;
        utils.getFramesUrl(url.fileTokenUrl || '').then((res) => {
          this.fileList[index] = [
            {
              uid: '-1',
              name: 'iconUrl',
              status: 'done',
              url: url.fileTokenUrl || '',
              thumbUrl: res,
            },
          ];
        });
      } else {
        // 拿到素材图片的上传地址集合
        this.fileList[index] = [
          {
            uid: '-1',
            name: 'iconUrl',
            status: 'done',
            url: url.fileTokenUrl || '',
            thumbUrl: url.fileTokenUrl || '',
          },
        ];
      }
      this.imgUrl[index] = url.fileTokenUrl || '';
    }
  };
}
