/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:08:30
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-27 11:16:01
 */
import { injectable, inject } from 'inversify';
import { CONTENT_MANAGEMENT_IDENTIFIER } from '../../constants/identifiers';

import MaterialRepository from '../repositories/templateRepository';
import { TemplateListItemEntity, ComonPages } from '../entities/templateEntities';

@injectable()
export default class TemplateUseCase {
  @inject(CONTENT_MANAGEMENT_IDENTIFIER.TEMPLATE_REPOSITORYL)
  private materialRepository!: MaterialRepository;

  // 获取模板列表数据
  public async getTemplateList(
    name?: string,
    page?: number,
    size?: number,
  ): Promise<ComonPages<TemplateListItemEntity>> {
    return this.materialRepository.requestTemplateList(name, page, size);
  }

  // 编辑模板
  public editTemplate(param: TemplateListItemEntity): Promise<void> {
    return this.materialRepository.editTemplate(param);
  }

  // 创建副本
  public async copyTemplate(param?: TemplateListItemEntity): Promise<void> {
    return this.materialRepository.requestCopyTemplate(param);
  }

  // 删除单个模板
  public async delTemplate(id?: string): Promise<void> {
    await this.materialRepository.requestDelTemplate(id);
  }

  // 批量删除模板
  public async batchDelTemplate(id?: string[]): Promise<void> {
    await this.materialRepository.requestBatchDelTemplate(id);
  }

  // 模板详情
  public async templateDetails(id?: string): Promise<TemplateListItemEntity> {
    return this.materialRepository.requestTemplateDetails(id);
  }
}
