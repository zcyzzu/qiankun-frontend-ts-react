/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:00:31
 */
// 配置页面
export const CONFIG_IDENTIFIER = {
  CONFIG_PROVIDER: Symbol.for("common/config/ConfigProvider"),
};

// DEMO
export const DEMO_IDENTIFIER = {
  DEMO_VIEW_MODEL: Symbol.for("presenters/demo/viewmodel"),
  DEMO_USE_CASSE: Symbol.for("domain/useCases/demoUseCases"),
  DEMO_REPOSITORY: Symbol.for("domain/repositories/demoRepository"),
};
