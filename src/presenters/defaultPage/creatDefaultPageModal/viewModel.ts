/*
 * @Author: wuhao
 * @Date: 2021-12-03 09:33:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:37:08
 */
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { RcFile } from 'rc-upload/lib/interface';
import { UploadFile } from 'antd/lib/upload/interface';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import DefaultPageListViewModel from '../defaultPageList/viewModel';
import { MaterialHistoryRecordEntity } from '../../../domain/entities/advertisementEntities';
import RootContainereViewModel from '../../rootContainer/viewModel';

export default interface CreatDafaultPageModalViewModel {
  //表单提交成功事件
  formOnFinish(values: FormData, defaultPageListViewModel: DefaultPageListViewModel): void;
  //标签弹窗状态
  publishDefaultModalVisible: boolean;
  //设置标签窗口状态
  setPublishDefaultModalVisible(
    type?: string,
    rootContainereViewModel?: RootContainereViewModel,
  ): void;

  // 分辨率快码
  resolutionList: LookupsEntity[];
  // 设备类型快码
  deviceTypeList: LookupsEntity[];

  // 上传素材
  uploadFormProps: UploadProps;
  // 设置上传类型
  setUploadType(e: string): void;
  // 设置设备类型
  setDeviceType(e: string): void;
  // 设置分辨率
  setResolution(e: string): void;
  // 分辨率类型
  resolutionType: string;
  // 设备类型
  deviceType: string;
  // 上传类型
  uploadType: string;
  // 上传内容
  fileList: UploadFile[];
  // uploadChange
  uploadChange(e: UploadChangeParam): void;
  // 上传时长
  uploadTime: number | undefined;
  // 设置上传时长
  setUploadTime(e: number): void;
  // 删除素材
  initBackgroundItem(): void;
  // 预览素材url
  imgUrl: string;
  //预览类型
  previewType: string;
  // 预览素材
  setImagePreview(file: UploadFile<unknown>, ref: React.RefObject<MaterialPreviewModal>): void;
  // 上传素材
  beforeUpload(file: RcFile, fileType: RcFile[]): boolean | string;
  getLookupsValue(code: LookupsCodeTypes): Promise<void>;

  // 获取选中的素材数据
  getMaterialDataDefaultPlatform(data: MaterialHistoryRecordEntity): void;
  materialData: MaterialHistoryRecordEntity;
  // 详情
  getDetailDefault(id: number): Promise<boolean>;
  modalType: string;
  isChange: boolean;
}

// 表单数据格式
export interface FormData {
  organizationType: string;
  deviceType: string;
  resolution: string;
  type: string;
  time: string;
}

// 表单数据格式
export interface OrganizationListData {
  title: string | undefined;
  value: number;
}

// 表单数据格式
export interface OrganizationOption {
  key?: number | undefined;
  value?: number;
  children?: string;
}
