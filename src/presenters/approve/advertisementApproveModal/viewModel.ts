/*
 * @Author: wuhao
 * @Date: 2021-12-01 15:19:58
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:34:38
 */
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

import {
  AdvertisementDetailsEntity,
  AdvertisementDetailsDeviceListEntity,
} from '../../../domain/entities/advertisementEntities';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import AdvertisementApproveListViewModel from '../advertisementApproveList/viewModel';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';

// 具体设备列表数据格式（不包含分页数据）
export interface SpecificDeviceDataConfig extends AdvertisementDetailsDeviceListEntity {
  key?: number;
  order?: number;
}

// 分页参数
export interface DeviceListParamsConfig {
  page: number;
  size: number;
}

export default interface AdvertisementApproveModalViewModel {
  dataLengthAd: number;
  dataLengthCa: number;
  dataLengthLed: number;
  // 具体设备列表数据
  specificDeviceListData: AdvertisementDetailsDeviceListEntity;
  // 具体设备表格数据
  specificDeviceListDataSource: SpecificDeviceDataConfig[];
  // 设备列表分页params
  deviceListParams: DeviceListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 具体设备内容
  deviceContent: string;
  // 切换设备
  switchDevice(value: string): void;
  // 广告详情数据
  advertisementDetailsData: AdvertisementDetailsEntity;
  // 获取广告详情数据
  getAdvertisementDetails(advertisementId: number): Promise<void>;
  // 获取列表数量
  getDeviceListNum(id: number, deviceType: string): Promise<void>;
  // 广告详情-设备列表数据
  advertisementDetailsDeviceList: AdvertisementDetailsEntity;
  // 获取广告详情-设备列表数据
  getAdvertisementDetailsDeviceList(id: number, deviceType: string): Promise<void>;
  // 当前id
  currentId: number;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 周期快码数据
  cycleCode: LookupsEntity[];
  // 广告等级快码数据
  advertisementLevelCode: LookupsEntity[];
  // 请求快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 初始化数据
  initialData(): void;

  //审批弹窗状态
  advertisementApproveModalVisible: boolean;
  //设置审批窗口状态
  setAdvertisementApproveModalVisible(id?: number, taskId?: number[]): void;
  formOnFinish(
    values: FormData,
    advertisementApproveListViewModel: AdvertisementApproveListViewModel,
  ): void;
  // 当前审核状态
  approveStatus?: string;
  // 审核结果change
  radioChange(e: string): void;
  // srcList
  srcList: string[];
  // 素材类型
  materialType: string[];
  // modalindex
  modalIndex: number;
  // 设置素材预览
  setMaterialPreview(materialRef: React.RefObject<MaterialPreviewModal>, index: number): void;
}

// 表单数据格式
export interface FormData {
  results: string;
  cause: string;
}
