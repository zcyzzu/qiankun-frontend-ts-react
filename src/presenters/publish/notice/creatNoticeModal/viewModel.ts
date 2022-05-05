/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 10:26:13
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:47:35
 */
import { RadioChangeEvent } from 'antd';
import { SingleValueType, DefaultOptionType } from 'rc-cascader/lib/Cascader';
import NoticeListViewModel from '../noticeList/viewModel';
import { AdvertisementDeviceListEntity } from '../../../../domain/entities/deviceEntities';
import {
  StoreWithCountEntity,
  NoticeItemDetailsEntity,
} from '../../../../domain/entities/noticeEntities';
import { CommonPagesGeneric, ModalStatus } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';

export interface NoticePreviewProps {
  fontColor?: string;
  bgColor?: string;
  content: string;
  speed?: string;
  opacity?: number;
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

export default interface CreateNoticeModalViewModel {
  //发布紧急通知弹窗状态
  createNoticeModalVisible: boolean;
  //设置发布紧急通知弹窗状态
  setCreateNoticeModalVisible(createNoticeModalVisible: boolean, type?: ModalStatus): void;
  // 预览props
  noticePreviewProps: NoticePreviewProps;
  // 设置预览props
  setNoticePreviewProps(key: string, value: string): void;
  // 背景颜色选择器状态
  bgColorPickerVisible: boolean;
  // 字体颜色选择器状态
  fontColorPickerVisible: boolean;
  // 设置颜色选择器状态
  setColorPickerVisible(key: string, value: boolean): void;
  // 弹窗类型
  modalType: ModalStatus;
  // 发送范围
  deviceScope: string;
  // 切换设备发送范围
  deviceScopeChange(e: RadioChangeEvent): void;
  // 设备类型
  deviceTypes: string;
  // 切换设备类型
  switchDeviceTypes(value: string): void;
  // 切换选择方式
  setWayType(e: string): void;
  // 具体设备
  // specificDevice: string[] | React.Key[];
  specificDevice: SingleValueType[];
  specificDeviceData: React.Key[][];
  removeEq: number;
  // 选择设备
  setDevice(value: SingleValueType[], selectOptions: DefaultOptionType[][]): void;
  // 选择设备数据
  cascaderOptions: OptionsType[];
  // 标签列表整体数据
  advertingListData: CommonPagesGeneric<AdvertisementDeviceListEntity>;
  // 标签列表表格数据
  advertingListDataSource: AdvertisementDeviceListEntity[];
  // 收银机表格数据
  cashierListDataSource: AdvertisementDeviceListEntity[];
  // led表格数据
  ledListDataSource: AdvertisementDeviceListEntity[];
  // 搜索表单数据
  getAdvertingListParams: AdvertingListParams;
  // 切换页码
  // pageChange(page: number, pageSize?: number): void;
  // 获取列表数据
  getAdvertisingList(): Promise<void>;
  // 过滤后的门店
  storeNameList: AdvertisementDeviceListEntity[];
  storeNameCashierList: AdvertisementDeviceListEntity[];
  storeNameLedList: AdvertisementDeviceListEntity[];
  //  删除表格单项数据
  deleteTableItemData(record: AdvertisementDeviceListEntity): void;
  // tree原始数据
  treeData: StoreWithCountEntity[];
  // 发布通知
  onRelease(noticeListViewModel: NoticeListViewModel): void;
  // 当前的选择方式项目门店/分组
  adSelectedType: string;
  // 当前的选择方式项目门店/分组
  cashierSelectedType: string;
  // 当前的选择方式项目门店/分组
  ledSelectedType: string;
  // 通知详情数据
  noticeDetailsData: NoticeItemDetailsEntity;
  // 获取通知详情数据
  getNoticeDetailsData(id: number): Promise<void>;
  // 详情列表
  getEditDeviceList(deviceType?: string, id?: number): Promise<AdvertisementDeviceListEntity[]>;
  // 设备id
  deviceIdList: number[];
  // 文本大小快码数据
  textSizeCode: LookupsEntity[];
  // 文本位置快码数据
  textPositionCode: LookupsEntity[];
  // 文本滚动速度快码数据
  rollSpeendCode: LookupsEntity[];
  // 获取快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 初始化数据
  initialData(noticeListViewModel?: NoticeListViewModel): void;
  // 当前页
  currentPage: number;
  // 上一页
  prev(): void;
  // 下一页
  next(): void;
}

// 选择设备options
export interface OptionsType {
  label: string;
  value: string | number;
  children?: OptionsType[];
}

// 标签列表数据格式（不包含分页数据）
export interface AdvertingListData extends AdvertisementDeviceListEntity {
  key: number;
}

// 获取列表数据参数结构
export interface AdvertingListParams {
  page: number;
  size: number;
}
