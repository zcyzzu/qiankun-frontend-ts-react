/*
 * @Author: liyou
 * @Date: 2021-06-07 11:30:50
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:44:32
 */

import "reflect-metadata";
import { Container } from "inversify";
import {
  CONFIG_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PAGE_TAB_IDENTIFIER,
  USER_IDENTIFIER,
  FILE_IDENTIFIER,
  PERMISSIONS,
} from "./constants/identifiers";

// rootcontainer
import RootContainerRepository from "./domain/repositories/rootContainerRepository";
import RootContainerRepositoryImpl from "./data/rootContainerRepositoryImpl";
import RootContainerViewModel from "./presenters/rootContainer/viewModel";
import RootContainerViewModelImpl from "./presenters/rootContainer/viewModelImpl";
import RootContainerUseCase from "./domain/useCases/rootContainerUseCase";

// file
import FileRepository from "./domain/repositories/fileRepository";
import FileRepositoryImpl from "./data/fileRepositoryImpl";
import FileUseCase from "./domain/useCases/fileUseCase";

// pageTabs
import PageTabsViewModel from "./common/components/pageTabs/viewModel";
import PageTabsViewModelImpl from "./common/components/pageTabs/viewModelImpl";

// ConfigProvider
import ConfigProvider from "./common/config/configProvider";

// user
import UserRepository from "./domain/repositories/userRepository";
import UserRepositoryImpl from "./data/userRepositoryImpl";
import UserUseCase from "./domain/useCases/userUseCase";

// permissons
import PermissionsRepository from "./domain/repositories/permissionsRepository";
import PermissionsRepositoryImpl from "./data/permissionsRepositoryImpl";
import PermissionsUseCase from "./domain/useCases/permissionsUseCase";

const DIContainer = new Container();

// config provider
DIContainer.bind<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  .to(ConfigProvider)
  .inSingletonScope();

// rootcontainer
DIContainer.bind<RootContainerRepository>(
  ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_REPOSITORY
).to(RootContainerRepositoryImpl);
//
DIContainer.bind<RootContainerViewModel>(
  ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL
)
  .to(RootContainerViewModelImpl)
  .inSingletonScope();
DIContainer.bind(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE).to(
  RootContainerUseCase
);

// pageTabs
DIContainer.bind<PageTabsViewModel>(PAGE_TAB_IDENTIFIER.PAGE_TAB_VIEW_MODEL)
  .to(PageTabsViewModelImpl)
  .inSingletonScope();

// user
DIContainer.bind<UserRepository>(USER_IDENTIFIER.USER_REPOSITORY).to(
  UserRepositoryImpl
);
DIContainer.bind(USER_IDENTIFIER.USER_USE_CASE)
  .to(UserUseCase)
  .inSingletonScope();

// file
DIContainer.bind<FileRepository>(FILE_IDENTIFIER.FILE_REPOSITORYL).to(
  FileRepositoryImpl
);
DIContainer.bind(FILE_IDENTIFIER.FILE_USE_CASE).to(FileUseCase);

// permissons
DIContainer.bind<PermissionsRepository>(PERMISSIONS.PERMISSIONS_REPOSITORY).to(
  PermissionsRepositoryImpl
);
DIContainer.bind(PERMISSIONS.PERMISSIONS_USE_CASE).to(PermissionsUseCase);

export default { DIContainer };
