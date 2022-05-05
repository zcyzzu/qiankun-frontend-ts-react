/*
 * @Author: wuhao
 * @Date: 2021-09-22 11:00:03
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-27 13:53:48
 */
import { TemplateListItemEntity, ComonPages } from '../../../domain/entities/templateEntities';

export interface TemplatePageFormData {
  name: string;
}

// 获取列表数据参数结构
export interface TemplateListParams {
  name?: string;
  type?: string;
  page: number;
  size: number;
}

// 模板列表单项实体构造
export interface TemplateListItemEntityConfig extends TemplateListItemEntity {
  isChecked?: boolean;
}

export default interface TemplatePageViewModel {
  // 搜索表单数据
  getTemplateListParams: TemplateListParams;
  // 搜索表单提交
  onFinish(values: TemplatePageFormData): void;
  // 模板列表源数据
  templateListDate: ComonPages<TemplateListItemEntityConfig>;
  // 模板列表数据
  templateListDateSource: TemplateListItemEntityConfig[];
  // 是否显示所有复选框
  isShowAllCheckbox: boolean;
  // 检查复选框
  queryCheckbox(): void;
  // 更新源数据
  changeDataSource(index: number): void;
  // 是否为全选
  isAllChecked: boolean;
  // 全选/反选
  onAllChecked(): void;
  // 当前选中的数据
  currentSelectedData: TemplateListItemEntityConfig[];
  // 退出
  onExit(): void;
  // 获取新标题
  getTitle(title: string, itemData: TemplateListItemEntityConfig): Promise<void>;
  // 删除单个模板
  delTemplate(id: string): Promise<void>;
  // 创建副本
  createCopy(itemData: TemplateListItemEntityConfig): Promise<void>;
  // 批量删除模板
  onBatchDelete(): Promise<void>;
  // 最大高度
  maxHeight: number;
  // 设置最大高度
  setMaxHeight(height: number): void;
  // 获取模板列表数据
  getTemplateList(): Promise<void>;
  // 改变页码
  pageChange(page: number, pageSize: number): Promise<void>;
  // 获取模板详情
  getTemplateDetails(id: string): void;
  // 初始化数据
  initialData(): void;
  // 权限数据
  permissionsData: {
    [key: string]: boolean;
  };
  // 获取权限数据
  getPermissionsData(param: string[]): Promise<{ [key: string]: boolean }>;
  // 设置权限数据
  setPermissionsData(data: { [key: string]: boolean }): void;
}
