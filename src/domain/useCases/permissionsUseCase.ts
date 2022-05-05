/*
 * @Author: zhangchenyang
 * @Date: 2022-01-25 10:13:09
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-01-25 10:26:46
 */
import { inject, injectable } from 'inversify';
import { PERMISSIONS } from '../../constants/identifiers';
import PermissionsRepository from '../repositories/permissionsRepository';

@injectable()
export default class PermissionsUseCase {
  @inject(PERMISSIONS.PERMISSIONS_REPOSITORY)
  private permissionsRepository!: PermissionsRepository;

  // 获取权限数据
  public async getPermission(
    permissionList: string[],
  ): Promise<{
    [key: string]: boolean;
  }> {
    const newData: {
      [key: string]: boolean;
    } = {};
    try {
      const data = await this.permissionsRepository.requestPermission(permissionList);
      data.forEach(({ code, approve }) => {
        newData[code] = approve;
      });
    } catch (e) {
      console.log(e);
    }
    return newData;
  }
}
