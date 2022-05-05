/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:19:49
 */
import { Moment } from 'moment';
import { RadioChangeEvent } from 'antd';
import { RangeValue } from 'rc-picker/lib/interface';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { RcFile } from 'rc-upload/lib/interface';
import { UploadFile } from 'antd/lib/upload/interface';
import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import {
  AdvertisementDeviceListEntity,
  MaterialHistoryRecordEntity,
  MaterialIdData,
} from '../../../../domain/entities/advertisementEntities';
import AdvertisementListViewModel from '../advertisementList/viewModel';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import RootContainereViewModel from '../../../rootContainer/viewModel';

// 设备范围
export enum DeviceScope {
  Part = 'part',
  All = 'all',
}

export interface DeviceEntity {
  city?: string; // 城市
  deviceName?: string; // 设备名称
  floor?: string; // 楼层
  fileKey?: string; // 素材文件key
  groupName?: string; // 分组名称
  groupId?: number;
  id?: number; // 设备id,
  pointBrandName?: string; // 点位品牌名称
  resolution?: string; // 分辨率
  storeName?: string; // 门店名称
  brandFormat?: string; // 品牌液态
  storeId?: number; // 门店id
  children: AdvertisementDeviceListEntity[];
}

export default interface CreatAdvertisementModalViewModel {
  // modal状态
  modalType: string;
  // 条件配置
  //表单提交成功事件
  formOnFinish(values: FormData, advertisementListViewModel?: AdvertisementListViewModel): void;
  // 条件配置数据
  configConditions: FormData;
  //发布广告弹窗状态
  advertisingModalVisible: boolean;
  //设置发布广告窗口状态
  setAdvertisingModalVisible(
    type?: string,
    rootContainereViewModel?: RootContainereViewModel,
    copy?: string,
  ): void;
  // 步骤
  current: number;
  // 改变步骤
  setCurrent(type: string): void;
  // 周期
  weeks: string;
  // 改变周期
  cycleChange(e: RadioChangeEvent): void;
  // 每周天数
  optionsCheck: CheckOption[];
  // 播放时段
  timeSlot: string[];
  // 设置播放时段
  setTimeSlot(dates: RangeValue<Moment>, dateStrings: string[]): void;
  // 播放时段校验
  timeRules: boolean;
  timeRulesPlay: boolean;
  // 播放日期
  playTime(dates: RangeValue<Moment>, dateStrings: string[]): void;

  // 上传素材
  // 上传组件pros
  uploadFormProps: UploadProps;
  // 设置上传类型
  setUploadType(e: string, index: number, i?: number): void;
  // 上传类型
  uploadType: string[];
  // 上传内容
  fileList: UploadFile[][];
  // uploadChange
  uploadChange(e: UploadChangeParam, index: number, resolution: string, i?: number): void;
  // 上传时长
  uploadTime: (number | undefined)[];
  // 设置上传时长
  setUploadTime(e: number, index: number, i?: number): void;
  // 删除素材
  initBackgroundItem(index: number, i?: number): void;
  // 预览素材url
  imgUrl: string[];
  //预览类型
  previewType: string;
  // 预览素材
  setImagePreview(
    file: UploadFile<unknown>,
    ref: React.RefObject<MaterialPreviewModal>,
    index: number,
    i?: number,
  ): void;
  // 上传素材
  beforeUpload(
    file: RcFile,
    fileType: RcFile[],
    resolution: string,
    index: number,
    i?: number,
  ): Promise<boolean | string>;
  // modalindex
  modalIndex: number;
  batchModalIndex: number;

  // 选择设备
  // 删除设备
  deleteDevice(record: AdvertisementDeviceListEntity): void;
  // 设备范围
  device: string;
  // 选择方式
  wayTypeAd: string;
  wayTypeCa: string;
  wayTypeLed: string;
  // 切换设备范围
  deviceChange(e: RadioChangeEvent): void;
  // 具体设备内容
  deviceContent: string;
  // 切换设备
  switchDevice(value: string): void;
  // 切换选择方式
  setWayType(e: string): void;
  // 具体设备
  specificDevice: SingleValueType[];
  specificDeviceData: React.Key[][];
  removeEq: number;
  // 选择设备
  setDevice: (value: SingleValueType[], selectOptions: DefaultOptionType[][]) => void;
  //选择设备数据
  optionsDevice: OptionsType[];
  // 标签列表表格数据
  advertingListDataSource: AdvertisementDeviceListEntity[];
  // 收银机表格数据
  cashierListDataSource: AdvertisementDeviceListEntity[];
  // led表格数据
  ledListDataSource: AdvertisementDeviceListEntity[];
  // 保存或者发布
  saveRelease(
    type?: string,
    publishOrSave?: string,
    advertisementListViewModel?: AdvertisementListViewModel,
  ): void;
  setNextRules(rules: boolean): void;

  // 过滤后的设备列表
  resolutionList: AdvertisementDeviceListEntity[];
  // 过滤后的门店
  storeNameList: AdvertisementDeviceListEntity[];
  storeNameCashierList: AdvertisementDeviceListEntity[];
  storeNameLedList: AdvertisementDeviceListEntity[];
  // 详情
  getAdvertisementDetail(id?: number): Promise<boolean>;
  // 详情列表
  getEditDeviceList(deviceType?: string, id?: number): void;
  // 周期快码数据
  cycleCode: LookupsEntity[];
  // 广告等级快码数据
  advertisementLevelCode: LookupsEntity[];
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 获取选中的素材数据
  getMaterialData(data: MaterialHistoryRecordEntity, index: number, i?: number | undefined): void;
  // 获取具体设备
  getSpecificDevices(deviceTypeEnum: string): void;
  // 历史素材传过来的数据
  materialData: MaterialHistoryRecordEntity;
  materialIndex: number | undefined;

  batchMaterialData: MaterialHistoryRecordEntity;
  batchMaterialIndex: number | undefined;
  //
  isChange: boolean;

  adName: string;
  nameChange(e: React.SyntheticEvent): void;
  batchData: BatchData[];
  dynamicData(type: string, index?: number): void;
  dynamicName(e: React.SyntheticEvent, index: number): void;
  copy: string;
  banTime: boolean;
}

// 周几参数结构
export interface CheckOption {
  label: string;
  value: string;
}

// 批量参数结构
export interface BatchData {
  uploadType: string[];
  fileList: UploadFile[][];
  uploadTime: (number | undefined)[];
  imgUrl: string[];
  materialIdList: MaterialIdData[];
  adName: string;
}

// 选择设备options
export interface OptionsType {
  label: string;
  value: string | number;
  children?: OptionsType[];
}

// 表单数据格式
export interface FormData {
  advertisement?: string;
  playTime?: Moment[];
  advert?: string;
  weeks?: string[];
  doublePointsRulesFormList?: Moment[][];
  screen?: string;
}
