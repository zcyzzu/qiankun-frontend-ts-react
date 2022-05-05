/*
 * @Author: tongyuqiang
 * @Date: 2022-04-06 16:02:42
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-13 09:51:09
 */
import { MaterialItemEntity, CreateMaterialEntity } from '../entities/materialEntities';
import { CommonPagesGeneric } from '../../common/config/commonConfig';

export default interface MaterialRepository {
  // 获取素材列表数据
  requestMaterialList(
    page: number,
    size: number,
    name?: string,
    searchSourceType?: string,
  ): Promise<CommonPagesGeneric<MaterialItemEntity>>;

  // 创建素材
  requestCreateMaterial(params?: CreateMaterialEntity): Promise<number>;

  // 编辑素材
  requestEditMaterial(param: MaterialItemEntity): Promise<void>;

  // 删除单个素材
  requestDeleteItem(id?: number): Promise<void>;

  // 批量删除素材
  requestDeleteAll(id?: number[]): Promise<void>;
}
