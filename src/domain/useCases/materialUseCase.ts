/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:08:30
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-13 09:50:50
 */
import { injectable, inject } from 'inversify';
import { CONTENT_MANAGEMENT_IDENTIFIER } from '../../constants/identifiers';

import MaterialRepository from '../repositories/materialRepository';
import { MaterialItemEntity, CreateMaterialEntity } from '../entities/materialEntities';
import { CommonPagesGeneric } from '../../common/config/commonConfig';

@injectable()
export default class MaterialUseCase {
  @inject(CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_REPOSITORYL)
  private materialRepository!: MaterialRepository;

  // 获取素材列表数据
  public async getMaterialList(
    page: number,
    size: number,
    name?: string,
    searchSourceType?: string,
  ): Promise<CommonPagesGeneric<MaterialItemEntity>> {
    return this.materialRepository.requestMaterialList(page, size, name, searchSourceType);
  }

  // 创建素材
  public setCreateMaterial(param: CreateMaterialEntity): Promise<number> {
    return this.materialRepository.requestCreateMaterial(param);
  }

  // 编辑素材
  public editMaterial(param: MaterialItemEntity): Promise<void> {
    return this.materialRepository.requestEditMaterial(param);
  }

  // 删除单个素材
  public async deleteItem(id?: number): Promise<void> {
    await this.materialRepository.requestDeleteItem(id);
  }

  // 批量删除素材
  public async deleteAll(ids?: number[]): Promise<void> {
    await this.materialRepository.requestDeleteAll(ids);
  }
}
