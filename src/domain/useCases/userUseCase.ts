/*
 * @Author: liyou
 * @Date: 2021-07-15 11:22:44
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:17:09
 */
import { inject, injectable } from 'inversify';
import { USER_IDENTIFIER } from '../../constants/identifiers';
import UserRepository from '../repositories/userRepository';
import { UserInfoEntity } from '../entities/userEntities';

@injectable()
export default class UserUseCase {
  @inject(USER_IDENTIFIER.USER_REPOSITORY)
  private userRepository!: UserRepository;

  public userInfo: UserInfoEntity;

  public constructor() {
    this.userInfo = {};
  }

  // 获取用户信息
  public async getUserInfo(): Promise<void> {
    const data = await this.userRepository.requestUserInfo();
    this.userInfo = { ...data };
  }
}
