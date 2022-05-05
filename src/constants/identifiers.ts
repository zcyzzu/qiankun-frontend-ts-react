/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:41:15
 */
// 配置页面
export const CONFIG_IDENTIFIER = {
  CONFIG_PROVIDER: Symbol.for("common/config/ConfigProvider"),
};

// 根页面
export const ROOT_CONTAINER_IDENTIFIER = {
  ROOT_CONTAINER_REPOSITORY: Symbol.for(
    "domain/repositories/RootContainerRepository"
  ),
  ROOT_CONTAINER_USE_CASE: Symbol.for("domain/useCases/RootContainerUseCase"),
  ROOT_CONTAINER_VIEW_MODEL: Symbol.for(
    "presenters/rootContainer/RootContainerViewModel"
  ),
};

//
export const USER_IDENTIFIER = {
  USER_REPOSITORY: Symbol.for("domain/repositories/UserRepository"),
  USER_USE_CASE: Symbol.for("domain/useCases/UserUseCase"),
};

// 顶部叶签
export const PAGE_TAB_IDENTIFIER = {
  PAGE_TAB_VIEW_MODEL: Symbol.for("components/pageTabs"),
};

// 文件管理
export const FILE_IDENTIFIER = {
  FILE_REPOSITORYL: Symbol.for(
    "presenters/domain/repositories/fileRepositories"
  ),
  FILE_USE_CASE: Symbol.for("domain/useCases/FileUseCase"),
};

// 权限控制
export const PERMISSIONS = {
  PERMISSIONS_REPOSITORY: Symbol.for(
    "domain/repositories/PermissionsRepository"
  ),
  PERMISSIONS_USE_CASE: Symbol.for("domain/useCases/PermissionsUseCase"),
};
