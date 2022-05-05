/*
 * @Author: zhangchenyang
 * @Date: 2021-12-03 11:56:30
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-12-24 14:34:24
 */
import { ApproveSettingListItemConfig, ApproveRulesRequestConfig } from '../../../../domain/entities/approveEnities';


export default interface ApproveSettingModalViewModel {
  // 审批设置查看弹窗状态
  approveSettingCheckModalVisible: boolean;
  // 设置审批设置查看弹窗状态
  setApproveSettingCheckModalVisible(value: boolean, record?: ApproveSettingListItemConfig): void;
  // 单项数据
  approveSettingCheckModalItemData: ApproveRulesRequestConfig;
  // 获取审核规则详情
  getApproveDetails(id: number): Promise<void>;
}
