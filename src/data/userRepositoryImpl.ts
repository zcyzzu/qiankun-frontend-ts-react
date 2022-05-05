/*
 * @Author: liyou
 * @Date: 2021-07-15 11:19:37
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-02-23 16:43:04
 */
import axios from 'axios';
import { injectable, inject } from 'inversify';
import ConfigProvider from '../common/config/configProvider';
import { CONFIG_IDENTIFIER } from '../constants/identifiers';
import { UserInfoEntity } from '../domain/entities/userEntities';
import UserRepository from '../domain/repositories/userRepository';

@injectable()
export default class UserRepositoryImpl implements UserRepository {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  async requestUserInfo(): Promise<UserInfoEntity> {
    const { data } = await axios.get(`${this.configProvider.apiPublicUrl}/iam/hzero/v1/users/self`);
    return data;
  }
}
