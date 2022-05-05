/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:02:42
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:24:01
 */
import { TemplateListItemEntity, ComonPages } from '../entities/templateEntities';

export default interface TemplateRepository {
  // 获取模板列表数据
  requestTemplateList(
    name?: string,
    page?: number,
    size?: number,
  ): Promise<ComonPages<TemplateListItemEntity>>;

  // 编辑模板
  editTemplate(param: TemplateListItemEntity): Promise<void>;

  // 创建副本
  requestCopyTemplate(param?: TemplateListItemEntity): Promise<void>;

  // 删除单个模板
  requestDelTemplate(id?: string): Promise<void>;

  // 批量删除模板
  requestBatchDelTemplate(id?: string[]): Promise<void>;

  // 模板详情
  requestTemplateDetails(id?: string): Promise<TemplateListItemEntity>;
}
