/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:33:38
 */

import { inject, injectable } from 'inversify';
import { ROOT_CONTAINER_IDENTIFIER } from '../../constants/identifiers';
import RootContainerRepository from '../repositories/rootContainerRepository';
import { MenuEntity } from '../entities/menuEntities';
import { LookupsEntity } from '../entities/lookupsEntities';
import { LookupsCodeTypes } from '../../constants/lookupsCodeTypes';

@injectable()
export default class RootContainerUseCase {
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_REPOSITORY)
  private rootContainerRepository!: RootContainerRepository;

  public lookupsValue: LookupsEntity[];
  public menuData: MenuEntity[];

  public constructor() {
    this.lookupsValue = [];
    this.menuData = [];
  }

  public async getMenuResponse(lang: string, roldId: number, unionLabel: boolean): Promise<void> {
    try {
      const data = await this.rootContainerRepository.requestMenuResponse(lang, roldId, unionLabel);
      this.menuData = [...data];
    } catch (error) {
      this.menuData = [];
    }
  }

  // 根据code获取快码
  public async getLookupsValue(code: LookupsCodeTypes): Promise<LookupsEntity[]> {
    const data = await this.rootContainerRepository.requestLookupsResponse(code);
    this.lookupsValue = [...data];
    return data;
  }
}
