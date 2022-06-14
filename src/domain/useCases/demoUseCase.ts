/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:34:10
 */

import { inject, injectable } from "inversify";
import { DEMO_IDENTIFIER } from "../../constants/identifiers";
import DemoRepositories from "../repositories/demoRepositories";
import { DemoEntity } from "../entities/demoEntities";
import utils from "../../utils/index";

@injectable()
export default class RootContainerUseCase {
  @inject(DEMO_IDENTIFIER.DEMO_REPOSITORY)
  private demoRepositories!: DemoRepositories;

  public async getDemoResponse(): Promise<DemoEntity> {
    try {
      const data = await this.demoRepositories.requestDemoResponse();
      // 数据进行处理
      if (data.url === "http://httpbin.org/get") {
        return data;
      } else {
        return {};
      }
    } catch (error) {
      utils.globalMessge({
        content: (error as Error).message,
        type: "error",
      });
      return {};
    }
  }
}
