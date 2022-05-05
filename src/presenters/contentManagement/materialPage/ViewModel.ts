/*
 * @Author: wuhao
 * @Date: 2021-09-22 11:00:03
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-21 14:17:32
 */
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { RcFile } from 'rc-upload/lib/interface';
import { MaterialItemEntity } from '../../../domain/entities/materialEntities';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import { CommonPagesGeneric } from '../../../common/config/commonConfig';
import RootContainereViewModel from '../../rootContainer/viewModel';

// 获取列表数据参数结构
export interface MaterialListParams {
  page: number;
  size: number;
  name?: string;
  searchSourceType?: string;
}

export interface MaterialItemEntityParam extends MaterialItemEntity {
  url?: string;
  isChecked?: boolean;
}

export default interface MaterialPageViewModel {
  // 获取列表数据
  getMaterialList(val?: boolean): void;
  // 搜索表单提交
  onFinish(values: MaterialListParams): void;
  // 图片素材
  materialList: MaterialItemEntityParam[];
  // 素材类型快码
  materialTypeCode: LookupsEntity[];
  // 快码请求
  getLookupsValue(): void;
  // 类型--查询列表
  selectType(e: string): void;
  // 切换页码
  pageChange(page: number, pageSize?: number): void;
  // 每页条数
  sizeChange(current: number, pageSize: number): Promise<void>;
  // 是否显示所有复选框
  isShowAllCheckbox: boolean;
  // 是否为全选
  isAllChecked: boolean;
  // 全选/反选
  onAllChecked(): void;
  // 退出
  onExit(): void;
  // 检查复选框
  queryCheckbox(): void;
  // 当前选中的数据
  currentSelectedData: MaterialItemEntity[];
  // 设置最大高度
  setMaxHeight(height: number): void;
  // 删除素材
  deleteItem(ids: number): void;
  deleteAll(ids: number[]): void;
  // 下载素材
  downMaterial(item: MaterialItemEntity): void;
  // 获取新标题
  getTitle(title: string, itemData: MaterialItemEntity): void;
  // 最大高度
  maxHeight: number;
  // 更新源数据
  changeDataSource(index: number): void;
  // 初始化查询参数
  initQueryParams(): void;
  // 上传素材
  beforeUpload(
    file: RcFile,
    rootContainereViewModel: RootContainereViewModel,
  ): Promise<boolean | string>;
  // uploadChange
  uploadChange(
    e: UploadChangeParam,
    rootContainereViewModel: RootContainereViewModel,
  ): Promise<void>;
  uploadFormProps: UploadProps;
  // 上传类型
  uploadType: string;
  // 列表整体数据
  materialListData: CommonPagesGeneric<MaterialItemEntity>;
  // 查询参数
  queryParams: MaterialListParams;
  //判断无素材状态
  flag: boolean;
  // 获取素材url
  getPreviewModalInfo(record: MaterialItemEntityParam): Promise<void>;
  // 素材预览弹窗类型与src
  previewImageSrc: string;
  previewImageType: string;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
  //素材类型
  renderType(sourceType: string): string;
}
