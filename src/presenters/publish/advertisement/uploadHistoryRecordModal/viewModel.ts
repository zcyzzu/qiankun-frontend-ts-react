/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-14 11:46:16
 */
import { MaterialHistoryRecordEntity } from '../../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric } from '../../../../common/config/commonConfig';


// 具体设备列表数据格式（不包含分页数据）
export interface UploadRecordDataConfig extends MaterialHistoryRecordEntity {
  key?: number;
}

// 分页参数
export interface UploadRecordListParamsConfig {
  page: number;
  size: number;
}

export default interface UploadHistoryRecordModalViewModel {
  // 上传历史记录列表数据
  uploadRecordListData: CommonPagesGeneric<MaterialHistoryRecordEntity>;
  // 上传历史记录表格数据
  uploadRecordListDataSource: UploadRecordDataConfig[];
  // 查看设备弹窗状态
  uploadHistoryRecoedModalVisible: boolean;
  // 设置窗口状态
  setUploadHistoryRecordModalVisible(
    type?: string,
    index?: number,
    i?: number,
  ): void;
  // 获取上传记录列表数据
  getUploadRecordListData(type?: string): Promise<void>;
  // 分页params
  uploadRecordListParams: UploadRecordListParamsConfig;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 删除素材
  delMaterial(id: number): Promise<void>;
  // image src
  imageSrc: string;
  // video src
  videoSrc: string;
  // 获取素材url
  getMaterialUrl(record: UploadRecordDataConfig): Promise<void>;
  // 关闭窗口
  closeModal(): void;
  // 当前选中的素材数据
  currentMaterialData: MaterialHistoryRecordEntity;
  // radio事件
  radioChange(selectedRowKeys: React.Key[], selectedRows: UploadRecordDataConfig[]): void;
  // 确认事件
  // onConfirm(): void;
  type: string;
  indexData: number;
  batchIndexData: number | undefined;
  // 平台类型
  platformType?: string;
}
