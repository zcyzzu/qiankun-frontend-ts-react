/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:59:23
 */

import { MenuEntity } from '../entities/menuEntities';
import { LookupsEntity } from '../entities/lookupsEntities';
import { LookupsCodeTypes } from '../../constants/lookupsCodeTypes';

export default interface RootContainerRepository {
  requestMenuResponse(lang: string, roldId: number, unionLabel: boolean): Promise<MenuEntity[]>;

  requestLookupsResponse(code: LookupsCodeTypes): Promise<LookupsEntity[]>;
}
