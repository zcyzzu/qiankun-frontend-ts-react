/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 13:58:53
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-01-11 11:20:15
 */
import { inject, injectable } from 'inversify';
import { DEFAULT_IDENTIFIER } from '../../constants/identifiers';
import DefaultpageRepository from '../repositories/defaultPageRepository';
import {
  PublishDefaultPageListItemConfig,
  DefaultPageListItemConfig,
  CreateDefaultEntity,
} from '../entities/defaultPageEntities';
import {
  CreateMaterialEntity,
  MaterialHistoryRecordEntity,
} from '../entities/advertisementEntities';
import { CommonPagesGeneric } from '../../common/config/commonConfig';

@injectable()
export default class DefaultPageUseCase {
  @inject(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_REPOSITORY)
  private defaultPageRepository!: DefaultpageRepository;

  //获取上屏发布-缺省列表
  public async getPublishDefaultPageList(
    page: number,
    size: number,
    unitId?: number,
    deviceType?: string,
  ): Promise<CommonPagesGeneric<PublishDefaultPageListItemConfig>> {
    return this.defaultPageRepository.requestPublishDefaultPageList(page, size, unitId, deviceType);
  }

  // 删除上屏发布-缺省列表单条数据
  public async deletePublishDefaultItem(id?: number): Promise<void> {
    return this.defaultPageRepository.requestDelPublishItem(id);
  }

  //获取缺省管理-缺省列表
  public async getDefaultPageList(
    page: number,
    size: number,
    deviceType?: string,
  ): Promise<CommonPagesGeneric<DefaultPageListItemConfig>> {
    return this.defaultPageRepository.requestDefaultPageList(page, size, deviceType);
  }

  // 删除缺省管理-缺省列表单条数据
  public async deleteDefaultPageItem(id?: number): Promise<void> {
    return this.defaultPageRepository.requestDelItem(id);
  }

  // 上屏发布 创建缺省
  public setCreateDefault(param: CreateDefaultEntity): Promise<void> {
    return this.defaultPageRepository.requestCreateDefault(param);
  }

  // 上屏发布 更新缺省
  public setPutDefault(param: CreateDefaultEntity): Promise<void> {
    return this.defaultPageRepository.requestPutDefault(param);
  }

  // 上屏发布 缺省详情
  public async getDetailDefault(id: number): Promise<PublishDefaultPageListItemConfig> {
    return this.defaultPageRepository.requestDetailDefault(id);
  }

  // 上屏发布 创建缺省
  public setPlatformCreateDefault(param: CreateDefaultEntity): Promise<void> {
    return this.defaultPageRepository.requestPlatformCreateDefault(param);
  }

  // 上屏发布 更新缺省
  public setPlatformPutDefault(param: CreateDefaultEntity): Promise<void> {
    return this.defaultPageRepository.requestPlatformPutDefault(param);
  }

  // 上屏发布 缺省详情
  public async getPlatformDetailDefault(id: number): Promise<PublishDefaultPageListItemConfig> {
    return this.defaultPageRepository.requestPlatformDetailDefault(id);
  }

  // 创建素材
  public setCreateMaterial(param: CreateMaterialEntity): Promise<number> {
    return this.defaultPageRepository.requestCreateMaterial(param);
  }

  //删除素材
  public async delMaterial(materialId?: number): Promise<void> {
    await this.defaultPageRepository.requestDelMaterial(materialId).catch((err) => {
      console.log(err);
    });
  }

  // 历史素材列表-平台级
  public getMaterialHistoryRecord(
    page: number,
    size: number,
  ): Promise<CommonPagesGeneric<MaterialHistoryRecordEntity>> {
    return this.defaultPageRepository.requestMaterialHistoryRecordList(page, size);
  }
}
