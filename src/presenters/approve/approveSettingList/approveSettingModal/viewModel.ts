/*
 * @Author: zhangchenyang
 * @Date: 2021-12-03 11:56:30
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-24 21:03:42
 */
import { ModalStatus } from '../../../../common/config/commonConfig';
import {
  ApproveSettingListItemConfig,
  UnitInfoConfig,
  AdminListDataItem,
  ApproveRulesRequestConfig,
} from '../../../../domain/entities/approveEnities';
import ApproveSettingListViewModel from '../viewModel';
import RootContainereViewModel from '../../../rootContainer/viewModel';

export interface DefaultCheckboxDataListConfig extends AdminListDataItem {
  checked: boolean;
  sort?: number;
}

export default interface ApproveSettingModalViewModel {
  // 弹窗类型
  modalTyle: ModalStatus;
  // 审批设置弹窗状态
  approveSettingModalVisible: boolean;
  // 设置审批设置弹窗状态
  setApproveSettingModalVisible(
    value: boolean,
    type?: ModalStatus,
    record?: ApproveSettingListItemConfig,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void>;
  // 查看内容单项数据
  approveSettingModalItemData: ApproveSettingListItemConfig;
  // 查看内容单项数据赋值
  setApproveSettingModalItemData(item?: ApproveSettingListItemConfig): void;
  // 选择方式
  selectMode: string;
  // 设置选择方式
  selectModeChange(e: string): void;
  // 表单提交
  onFinish(
    e: ApproveSettingListItemConfig,
    approveSettingListViewModel: ApproveSettingListViewModel,
  ): void;
  // 或签时 审批人数据
  defaultCheckboxDataList: DefaultCheckboxDataListConfig[];
  // 或签时 设置审批人
  defaultCheckboxDataListChange(e: boolean, index: number): void;
  // 设置审批顺序
  approveOrderChange(e: number, index: number): void;
  // 是否选择组织状态
  isSelectedUnitName: boolean;
  // 设置是否选择组织状态
  setIsSelectedUnitName(val: boolean, e?: string): void;
  // 未创建审批设置的组织列表
  unitList: UnitInfoConfig[];
  // 获取未创建审批设置的组织列表
  getUnitList(): void;
  // 获取管理员列表
  getAdminList(): void;
  // 管理员列表
  adminListData: AdminListDataItem[];
  // 编辑时当前的组织id
  currentUnitId: number;
  // 编辑页面所属组织是否变过
  unitIsChange: boolean;
  // 审批设置列表单选数据
  approveSettingItemData: ApproveRulesRequestConfig;
  tenantId: number;
}
