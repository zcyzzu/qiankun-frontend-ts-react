/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:23:23
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-01-11 11:17:13
 */
import { CommonPagesGeneric } from '../../common/config/commonConfig';
import {
  PublishDefaultPageListItemConfig,
  DefaultPageListItemConfig,
  CreateDefaultEntity,
} from '../entities/defaultPageEntities';
import {
  CreateMaterialEntity,
  MaterialHistoryRecordEntity,
} from '../entities/advertisementEntities';

export default interface DefaultpageRepository {
  //获取上屏发布-缺省列表
  requestPublishDefaultPageList(
    page: number,
    size: number,
    unitId?: number,
    deviceType?: string,
  ): Promise<CommonPagesGeneric<PublishDefaultPageListItemConfig>>;

  // 删除上屏发布-缺省列表单个设备
  requestDelPublishItem(id?: number): Promise<void>;

  //获取缺省管理-缺省列表
  requestDefaultPageList(
    page: number,
    size: number,
    deviceType?: string,
  ): Promise<CommonPagesGeneric<DefaultPageListItemConfig>>;

  // 删除缺省管理-缺省列表单个设备
  requestDelItem(id?: number): Promise<void>;

  // 上屏发布 新增缺省
  requestCreateDefault(params: CreateDefaultEntity): Promise<void>;

  // 上屏发布 更新缺省
  requestPutDefault(params: CreateDefaultEntity): Promise<void>;

  // 上屏发布 缺省详情
  requestDetailDefault(id: number): Promise<PublishDefaultPageListItemConfig>;

  //新增缺省
  requestPlatformCreateDefault(params: CreateDefaultEntity): Promise<void>;

  //更新缺省
  requestPlatformPutDefault(params: CreateDefaultEntity): Promise<void>;

  //缺省详情
  requestPlatformDetailDefault(id: number): Promise<PublishDefaultPageListItemConfig>;

  // 创建素材
  requestCreateMaterial(params?: CreateMaterialEntity): Promise<number>;

  //  删除素材
  requestDelMaterial(materialId?: number): Promise<void>;

  // 平台级-历史素材列表
  requestMaterialHistoryRecordList(
    page: number,
    size: number,
  ): Promise<CommonPagesGeneric<MaterialHistoryRecordEntity>>;
}
