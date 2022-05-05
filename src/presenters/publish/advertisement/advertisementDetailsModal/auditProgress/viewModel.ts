/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:37
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2021-12-17 11:29:13
 */
import { ApproveProgressEntity } from '../../../../../domain/entities/approveEnities';

export default interface AuditProgressViewModel {
  // 审核进度数据
  approveProgressData: ApproveProgressEntity[];
  // 获取审核进度数据
  getApproveProgressData(businessType: string, businessId: number, name: string): Promise<void>;
  // 广告名称
  currentName: string;
  // 初始化数据
  initialData(): void;
}
