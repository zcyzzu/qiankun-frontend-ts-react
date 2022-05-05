/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:58:27
 */

import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER } from '../constants/identifiers';
import { MenuEntity } from '../domain/entities/menuEntities';
import { LookupsEntity } from '../domain/entities/lookupsEntities';
import RootContainerRepository from '../domain/repositories/rootContainerRepository';
import { LookupsCodeTypes } from '../constants/lookupsCodeTypes';

@injectable()
export default class RootContainerRepositoryImpl implements RootContainerRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  async requestMenuResponse(
    lang: string,
    roldId: number,
    unionLabel: boolean,
  ): Promise<MenuEntity[]> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/iam/hzero/v1/menus/tree`,
      {
        params: {
          lang,
          roldId,
          unionLabel,
        },
      },
    );
    return data;
  }

  async requestLookupsResponse(code: LookupsCodeTypes): Promise<LookupsEntity[]> {
    const { data } = await axios.get(`${this.configProvider.apiPublicUrl}/hpfm/v1/lovs/data`, {
      params: {
        lovCode: code,
      },
    });
    return data;
  }
}
