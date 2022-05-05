/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 18:26:33
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-15 16:20:55
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER, USER_IDENTIFIER } from '../constants/identifiers';
import { CommonPagesGeneric } from '../common/config/commonConfig';
import DefaultPageRepository from '../domain/repositories/defaultPageRepository';
import {
  PublishDefaultPageListItemConfig,
  DefaultPageListItemConfig,
  CreateDefaultEntity,
} from '../domain/entities/defaultPageEntities';
import UserUseCase from '../domain/useCases/userUseCase';

import { CreateMaterialEntity, MaterialHistoryRecordEntity } from '../domain/entities/advertisementEntities';
@injectable()
export default class DefaultPageRepositoryImpl implements DefaultPageRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // 获取上屏发布-通知列表
  async requestPublishDefaultPageList(
    page: number,
    size: number,
    unitId?: number,
    deviceType?: string,
  ): Promise<CommonPagesGeneric<PublishDefaultPageListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/default/advertise`,
      {
        params: {
          page,
          size,
          unitId,
          deviceType,
        },
      },
    );
    return data;
  }

  // 删除上屏发布-通知列表单条数据
  async requestDelPublishItem(id?: number): Promise<void> {
    await axios.delete(`${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/default/advertise/${id}`);
  }

  // 获取缺省管理-通知列表
  async requestDefaultPageList(
    page: number,
    size: number,
    deviceType?: string,
  ): Promise<CommonPagesGeneric<DefaultPageListItemConfig>> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/default/advertise`,
      {
        params: {
          page,
          size,
          deviceType,
        },
      },
    );
    return data;
  }

  // 删除缺省管理-通知列表单条数据
  async requestDelItem(id?: number): Promise<void> {
    await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/default//advertise/${id}`,
    );
  }
  // 上屏 - 新增缺省
  async requestCreateDefault(params: CreateDefaultEntity): Promise<void> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/default/advertise`,
      params,
    );
    return data;
  }

  // 上屏 - 更新缺省
  async requestPutDefault(params: CreateDefaultEntity): Promise<void> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/default/advertise`,
      params,
    );
    return data;
  }

  // 上屏 -  缺省详情
  async requestDetailDefault(id: number): Promise<PublishDefaultPageListItemConfig> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/${this.userUseCase.userInfo.tenantId}/default/advertise/${id}`,
    );
    return data;
  }

  // 新增缺省
  async requestPlatformCreateDefault(params: CreateDefaultEntity): Promise<void> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/default/advertise`,
      params,
    );
    return data;
  }

  //更新缺省
  async requestPlatformPutDefault(params: CreateDefaultEntity): Promise<void> {
    const { data } = await axios.put(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/default/advertise`,
      params,
    );
    return data;
  }

  // 缺省详情
  async requestPlatformDetailDefault(id: number): Promise<PublishDefaultPageListItemConfig> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/default/advertise/${id}`,
    );
    return data;
  }

  // 创建素材
  async requestCreateMaterial(params?: CreateMaterialEntity): Promise<number> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/material`,
      params,
    );
    return data;
  }

  // 删除素材
  async requestDelMaterial(materialId?: number): Promise<void> {
    const { data } = await axios.delete(
      `${this.configProvider.apiPublicUrl}/tmis/v1/site/material/${materialId}`,
    );
    return data;
  }

  // 平台级-历史素材列表
  async requestMaterialHistoryRecordList(
    page: number,
    size: number,
  ): Promise<CommonPagesGeneric<MaterialHistoryRecordEntity>> {
    const { data } = await axios.get(`${this.configProvider.apiPublicUrl}/tmis/v1/site/material`, {
      params: {
        page,
        size,
      },
    });
    return data;
  }
}
