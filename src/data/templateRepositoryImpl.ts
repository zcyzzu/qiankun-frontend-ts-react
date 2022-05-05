/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:06:11
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:23:52
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';

import TemplateRepository from '../domain/repositories/templateRepository';
import UserUseCase from '../domain/useCases/userUseCase';
import { TemplateListItemEntity, ComonPages } from '../domain/entities/templateEntities';

@injectable()
export default class TemplateRepositoryImpl implements TemplateRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 获取模板列表数据
  async requestTemplateList(
    name: string,
    page: number,
    size: number,
  ): Promise<ComonPages<TemplateListItemEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/template/page`,
      {
        params: {
          name,
          page,
          size,
        },
      },
    );
    return data;
  }

  // 编辑模板
  async editTemplate(param: TemplateListItemEntity): Promise<void> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/template/update`,
      param,
    );
    return data;
  }

  // 创建副本
  async requestCopyTemplate(param?: TemplateListItemEntity): Promise<void> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/template/create`,
      param,
    );
    return data;
  }

  // 删除单个模板
  async requestDelTemplate(id?: string): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/template/delete/${id}`,
    );
    return data;
  }

  // 批量删除模板
  async requestBatchDelTemplate(id: string[]): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/template/batch-delete`,
      {
        data: id,
      },
    );
    return data;
  }

  // 模板详情
  async requestTemplateDetails(id: string): Promise<TemplateListItemEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/template/info/${id}`,
    );
    return data;
  }
}
