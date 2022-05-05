/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-07 14:43:12
 */
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { DownLogListEntity } from '../../../domain/entities/deviceEntities';

export interface DownLogListDataConfig extends DownLogListEntity {
  key?: number;
}

// 分页参数
export interface LogListParamsConfig {
  page: number;
  size: number;
}

export default interface DownLogModalViewModel {
  // 标签弹窗状态
  downLogModalVisible: boolean;
  // 下载日志弹窗状态
  setDownLogModalVisible(): void;
  // 类型
  deviceType: string;
  // 列表数据
  logListData: CommonPagesGeneric<DownLogListDataConfig>;
  // 日志表格数据
  logListDataSource: DownLogListDataConfig[];
  // 获取日志列表数据
  getLogListData(id: number): Promise<void>;
  // 下载日志
  downLog(record: DownLogListDataConfig): void;
  // 上传设备日志
  uploadLog(): void;
  // 当前设备id
  currentDeviceId: number;
  // 日志列表分页params
  logListParams: LogListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 刷新
  onRefresh(): void;
}
