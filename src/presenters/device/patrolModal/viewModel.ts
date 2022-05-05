/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: wuhao
 * @LastEditTime: 2021-12-08 16:25:52
 */
import { ECOptions } from '../../../utils/echartsOptionsType';
import { PatrolEntity } from '../../../domain/entities/deviceEntities';

export default interface PatrolModalViewModel {
  //标签弹窗状态
  patrolModalVisible: boolean;
  //设置标签窗口状态
  setPatrolModalVisible(id?: number, deviceType?: string): void;
  // 设备断网options
  netWorkOptions: ECOptions;
  //获取设备断网数据
  getNetWorkData(id?: number): void;
  // 类型
  deviceType: string;
  //设备断网数据
  patrolData: PatrolEntity;
}
