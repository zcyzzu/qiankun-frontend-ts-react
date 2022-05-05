/*
 * @Author: zhangchenyang
 * @Date: 2022-01-25 10:10:45
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-02-23 16:43:48
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER } from '../constants/identifiers';
import { PermissionsEntity } from '../domain/entities/permissionsEntities';
import PermissionsRepository from '../domain/repositories/permissionsRepository';

@injectable()
export default class PermissionsRepositoryImpl implements PermissionsRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  public async requestPermission(permissionList: string[]): Promise<PermissionsEntity[]> {
    const { data } = await axios.post(
      `${this.configProvider.apiPublicUrl}/iam/hzero/v1/menus/check-permissions`,
      permissionList,
    );
    return data;
  }
}
