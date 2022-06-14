/*
 * @Author: zhangchenyang
 * @Date: 2022-06-13 14:16:55
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:33:51
 */
import { inject, injectable } from "inversify";
import { makeObservable, observable, action, runInAction } from "mobx";
import { DEMO_IDENTIFIER } from "../../constants/identifiers";
import { DemoEntity } from "../../domain/entities/demoEntities";
import DemoUseCase from "../../domain/useCases/demoUseCase";
import utils from "../../utils/index";

@injectable()
export default class DemoViewmodel {
  @inject(DEMO_IDENTIFIER.DEMO_USE_CASSE)
  private demoUseCase!: DemoUseCase;

  @observable
  count: number = 0;
  @observable
  exampleInfo: DemoEntity[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  public setCount = (): void => {
    this.count += 1;
    console.log(this.count);
  };

  @action
  public getSomething = async (): Promise<void> => {
    try {
      const data = await this.demoUseCase.getDemoResponse();
      runInAction(() => {
        this.exampleInfo.push(data);
      });
      utils.globalMessge({
        content: "请求成功!",
        type: "success",
      });
    } catch (error) {
      utils.globalMessge({
        content: (error as Error).message,
        type: "error",
      });
    }
  };
}
