/*
 * @Author: zhangchenyang
 * @Date: 2022-01-25 10:12:27
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-25 10:12:28
 */
import { PermissionsEntity } from '../entities/permissionsEntities';

export default interface PermissionsRepository {
  // 获取权限数据
  requestPermission(permissionList: string[]): Promise<PermissionsEntity[]>;
}
