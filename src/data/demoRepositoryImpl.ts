/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 17:08:35
 */

import axios from "axios";
import { injectable, inject } from "inversify";
import ConfigProvider from "../common/config/configProvider";
import { CONFIG_IDENTIFIER } from "../constants/identifiers";
import { DemoEntity } from "../domain/entities/demoEntities";
import DemoRepositories from "../domain/repositories/demoRepositories";

@injectable()
export default class DemoRepositoriesImpl implements DemoRepositories {
  @inject(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  private configProvider!: ConfigProvider;

  async requestDemoResponse(): Promise<DemoEntity> {
    const { data } = await axios.get(
      `${this.configProvider.apiPublicUrl}/get`
    );
    return data;
  }
}
