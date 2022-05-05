/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:49
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-02-08 11:01:21
 */
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import { ScreenListEntity } from '../../../domain/entities/deviceEntities';

export default interface ScreenModalViewModel {
  //标签弹窗状态
  screenModalVisible: boolean;
  //设置标签窗口状态
  setScreenModalVisible(id?: number, offOn?: string): void;
  // 标签列表整体数据
  screenListData: CommonPagesGeneric<ScreenListEntity>;
  // 标签列表表格数据
  screenListDataSource: ScreenListData[];
  // 搜索表单数据
  getscreenListParams: ScreenListParams;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 获取列表数据
  getScreenList(id?: number, refresh?: string): void;
  // 设备截屏
  getScreenShot(): void;
  // 设备id
  deviceId: number | undefined;
  // 获取下载url
  getDownLoadUrl(fileKey: string): Promise<string>;
}

// 获取列表数据参数结构
export interface ScreenListParams {
  page: number;
  size: number;
}

// 标签列表数据格式（不包含分页数据）
export interface ScreenListData extends ScreenListEntity {
  key: number;
}
