/*
 * @Author: liyou
 * @Date: 2021-06-07 11:30:50
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:34:45
 */

import "reflect-metadata";
import { Container } from "inversify";
import { CONFIG_IDENTIFIER, DEMO_IDENTIFIER } from "./constants/identifiers";

// demo
import DemoViewModel from "./presenters/demo/viewmodel";
import DemoRepository from "./domain/repositories/demoRepositories";
import DemoRepositoryImpl from "./data/demoRepositoryImpl";
import DemoUseCase from "./domain/useCases/demoUseCase";

// ConfigProvider
import ConfigProvider from "./common/config/configProvider";

const DIContainer = new Container();

// config provider
DIContainer.bind<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  .to(ConfigProvider)
  .inSingletonScope();

// demo
DIContainer.bind(DEMO_IDENTIFIER.DEMO_VIEW_MODEL).to(DemoViewModel);
DIContainer.bind<DemoRepository>(DEMO_IDENTIFIER.DEMO_REPOSITORY).to(
  DemoRepositoryImpl
);
DIContainer.bind(DEMO_IDENTIFIER.DEMO_USE_CASSE).to(DemoUseCase);

export default { DIContainer };
