/*
 * @Author: wuhao
 * @Date: 2021-12-01 15:29:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:57:42
 */
import {
  NoticeDetailsListEntity,
  NoticeDetailsListItemEntity,
  NoticeItemDetailsEntity,
} from '../../../domain/entities/noticeEntities';
import NoticeApproveListViewModel from '../noticeApproveList/viewModel';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

// 审核状态
export enum ApproveStatus {
  // 待审核
  Pending = 'PENDING',
  // 审核中
  Approval = 'APPROVAL',
  // 已生效
  Passed = 'PASSED',
  // 已驳回
  Rejected = 'REJECTED',
  // 已过期
  Expired = 'EXPIRED',
  // 失效
  Invalid = 'INVALID',
  // 编辑中
  Editing = 'EDITING',
  // 全部
  All = 'ALL',
}

// 具体设备列表数据格式（不包含分页数据）
export interface SpecificDeviceDataConfig extends NoticeDetailsListItemEntity {
  key?: number;
  order?: number;
}

// 分页参数
export interface DeviceListParamsConfig {
  page: number;
  size: number;
}

// 表单数据格式
export interface FormDataConfig {
  approveResult: string;
  content: string;
}

export interface NoticePreviewProps {
  fontColor?: string;
  bgColor?: string;
  content: string;
  speed?: string;
  opacity?: number;
}

export default interface NoticeApproveModalViewModel {
  dataLengthAd: number;
  dataLengthCa: number;
  dataLengthLed: number;
  // 具体设备列表数据
  specificDeviceListData: NoticeDetailsListEntity;
  // 具体设备表格数据
  specificDeviceListDataSource: SpecificDeviceDataConfig[];
  // 获取设备列表数据
  getDeviceListData(id: number, type: string): Promise<void>;
  // 获取设备列表数量
  getDeviceListNum(id: number, type: string): Promise<void>;
  // 设备列表分页params
  deviceListParams: DeviceListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 具体设备内容
  deviceContent: string;
  // 切换设备
  switchDevice(value: string): void;
  //审批弹窗状态
  noticeApproveModalVisible: boolean;
  //设置审批窗口状态
  setNoticeApproveModalVisible(): void;
  //表单提交成功事件
  onFinish(
    values: FormDataConfig,
    noticeApproveListViewModel: NoticeApproveListViewModel,
  ): Promise<void>;
  // 当前id
  currentId: number;
  // 通知详情数据
  noticeDetailsData: NoticeItemDetailsEntity;
  // 获取通知详情数据
  getNoticeDetailsData(id: number, taskActorId?: number[]): Promise<void>;
  // 审批子任务id
  currentTaskActorId?: number[];
  // 初始化数据
  initialData(): void;
  // 当前审核状态
  approveStatus?: string;
  // 审核结果change
  radioChange(e: string): void;
  // 文本位置快码数据
  textPositionCode: LookupsEntity[];
  // 文本滚动速度快码数据
  rollSpeendCode: LookupsEntity[];
  // 获取快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
}
