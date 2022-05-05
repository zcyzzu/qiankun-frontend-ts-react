/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:38:35
 */
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';

export default interface DeviceDetailsModalViewModel {
  // 查看设备弹窗状态
  deviceDetailsVisible: boolean;
  // 设置窗口状态
  setDeviceDetailsVisible(): void;
  // 设备列表单项数据
  deviceListItemData: DeviceRecordListItemConfig;
  // 请求快码数据
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;
  // 是否支持特征广告快码数据
  supportedFeatureData: LookupsEntity[];
  // 广告等级类型快码数据
  advertisementLevelTypeCode: LookupsEntity[];
  // 播放状态快码数据
  playStatusCode: LookupsEntity[];
}
