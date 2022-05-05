/*
 * @Author: liyou
 * @Date: 2021-07-15 11:16:11
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2021-11-18 18:14:32
 */
import { UserInfoEntity } from '../entities/userEntities';

export default interface UserRepository {
  // 获取用户信息
  requestUserInfo(): Promise<UserInfoEntity>;
}
