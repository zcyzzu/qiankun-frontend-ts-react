/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:06:11
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-13 09:51:18
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';

import MaterialRepository from '../domain/repositories/materialRepository';
import UserUseCase from '../domain/useCases/userUseCase';
import { MaterialItemEntity, CreateMaterialEntity } from '../domain/entities/materialEntities';
import { CommonPagesGeneric } from '../common/config/commonConfig';

@injectable()
export default class MaterialRepositoryImpl implements MaterialRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 获取素材列表数据
  async requestMaterialList(
    page: number,
    size: number,
    name?: string,
    searchSourceType?: string,
  ): Promise<CommonPagesGeneric<MaterialItemEntity>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material`,
      {
        params: {
          page,
          size,
          name,
          searchSourceType,
        },
      },
    );
    return data;
  }

  // 创建素材
  async requestCreateMaterial(params?: CreateMaterialEntity): Promise<number> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material`,
      params,
    );
    return data;
  }
  // 编辑素材
  async requestEditMaterial(param: MaterialItemEntity): Promise<void> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material`,
      param,
    );
    return data;
  }

  // 删除单个素材
  async requestDeleteItem(id?: number): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material/${id}`,
    );
    return data;
  }

  // 批量删除素材
  async requestDeleteAll(materialIdList: number[]): Promise<void> {
    const {
      data,
    } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/material/batch-delete`,
      { data: materialIdList },
    );
    return data;
  }
}
