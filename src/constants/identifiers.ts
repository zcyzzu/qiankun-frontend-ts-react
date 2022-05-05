/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-09 13:32:31
 */
export const CONFIG_IDENTIFIER = {
  CONFIG_PROVIDER: Symbol.for('common/config/ConfigProvider'),
};

export const ROOT_CONTAINER_IDENTIFIER = {
  ROOT_CONTAINER_REPOSITORY: Symbol.for('domain/repositories/RootContainerRepository'),
  ROOT_CONTAINER_USE_CASE: Symbol.for('domain/useCases/RootContainerUseCase'),
  ROOT_CONTAINER_VIEW_MODEL: Symbol.for('presenters/rootContainer/RootContainerViewModel'),
};

export const PAGE_TAB_IDENTIFIER = {
  PAGE_TAB_VIEW_MODEL: Symbol.for('components/pageTabs'),
};

export const ORGANIZATION_TREE_IDENTIFIER = {
  ORGANIZATION_TREE_VIEW_MODEL: Symbol.for('components/organizationTree/viewModel'),
  ORGANIZATION_TREE_REPOSITORYL: Symbol.for('domain/repositories/organizationTreeRepository'),
  ORGANIZATION_TREE_USE_CASE: Symbol.for('domain/useCases/organizationTreeUseCase'),
};

// 缩略图组件
export const THUMBNAIL_IDENTIFIER = {
  THUMBNAIL_VIEW_MODEL: Symbol.for('components/thumbnail/viewModel'),
};

export const USER_IDENTIFIER = {
  USER_REPOSITORY: Symbol.for('domain/repositories/UserRepository'),
  USER_USE_CASE: Symbol.for('domain/useCases/UserUseCase'),
};

// 数据统计
export const DATA_STATISTICS_IDENTIFIER = {
  DEVICE_STATISTICS_VIEW_MODEL: Symbol.for('presenters/deviceStatistics/deviceStatisticsViewModel'),
  DEVICE_STATISTICS_REPOSITORYL: Symbol.for('domain/repositories/deviceRepositories'),
  DEVICE_STATISTICS_USE_CASE: Symbol.for('domain/useCases/deviceUseCase'),
  ADVERT_STATISTICS_VIEW_MODEL: Symbol.for('presenters/advertStatistics/AdvertStatisticsViewModel'),
  ADVERT_STATISTICS_EXPORT_VIEW_MODEL: Symbol.for(
    'presenters/advertStatistics/exportModal/ExportModalViewModel',
  ),
};

// 设备管理
export const DEVICE_IDENTIFIER = {
  DEVICE_LIST_VIEW_MODEL: Symbol.for('presenters/device/deviceList/deviceListViewModel'),
  ADVERTISEMENT_MACHINE_VIEW_MODEL: Symbol.for(
    'presenters/device/advertisementMachine/advertisementMachineViewModel',
  ),
  RASPBERRY_MACHINE_VIEW_MODEL: Symbol.for(
    'presenters/device/raspberryMachine/RaspberryMachineViewModel',
  ),
  ADVERTISEMENT_MACHINE_PATROL_VIEW_MODEL: Symbol.for(
    'presenters/advertisementMachine/patrolModal/PatrolModalViewModel',
  ),
  ADVERTISEMENT_MACHINE_SCREEN_VIEW_MODEL: Symbol.for(
    'presenters/advertisementMachine/screenModal/ScreenModalViewModel',
  ),
  DOWN_LOG_MODAL_VIEW_MODEL: Symbol.for('presenters/device/downLogModal/DownLogModalViewModel'),
  // 设备-分组配置
  ADVERTISEMENT_MACHINE_GROUP_VIEW_MODEL: Symbol.for(
    'presenters/advertisementMachine/groupModal/GroupModalViewModel',
  ),

  DEVICE_DETAILS_MODEL_VIEW_MODEL: Symbol.for(
    'presenters/deviceStatistics/deviceDetailsModal/deviceDetailsModalViewModel',
  ),
  DEVICE_INFO: Symbol.for(
    'presenters/deviceStatistics/deviceDetailsModal/deviceInfo/deviceInfoViewModel',
  ),
  PLAY_PLAN: Symbol.for(
    'presenters/deviceStatistics/deviceDetailsModal/playPlan/playPlanViewModel',
  ),
  DEVICE_EDIT_MODEL_VIEW_MODEL: Symbol.for(
    'presenters/deviceStatistics/deviceEditModal/deviceEditModalViewModel',
  ),
  DEVICE_USE_CASE: Symbol.for('domain/useCases/deviceUseCase'),
  DEVICE_REPOSITORY: Symbol.for('domain/repositories/deviceRepository'),
  // store
  PROJECT_STORE_VIEW_MODEL: Symbol.for('presenters/deviceMangement/prjectStore/ViewModel'),
  PROJECT_STORE_USE_CASE: Symbol.for('domain/useCases/storeUseCase'),
  PROJECT_STORE_RESPOSITORY: Symbol.for('domain/repositories/storeRepository'),
  CREATE_PROJECT_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/deviceMangement/prjectStore/createProjectModal/ViewMOdal',
  ),
  PROJECT_STORE__DETAILS_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/device/store/storeDetailsModal/storeDetailsModalViewModel',
  ),
  BATCH_EDIT_MODAL_VIEW_MODEL: Symbol.for('domain/repositories/device/batchEditModal/viewModel'),
};

// 广告
export const ADVERTISEMENT_IDENTIFIER = {
  ADVERTISEMENT_LIST_VIEW_MODEL: Symbol.for('presenters/advertise/release/releaseListVieewMOdel'),
  ADVERTISEMENT_USE_CASE: Symbol.for('domain/useCases/advertisementUseCase'),
  ADVERTISEMENT_REPOSITORY: Symbol.for('domain/repositories/advertisementRepository'),
  ADVERTISEMENT_DETAILS_MODEL_VIEW_MODEL: Symbol.for(
    'presenters/publish/advertisement/advertisementDetailsModal/advertisementDetailsModalViewModel',
  ),
  ADVERTISEMENT_DETAILS_TAB_VIEW_MODEL: Symbol.for(
    'presenters/publish/advertisement/advertisementDetailsModal/advertDetailsTab/advertDetailsTabViewModel',
  ),
  OPERATION_LOG_VIEW_MODEL: Symbol.for(
    'presenters/publish/advertisement/advertisementDetailsModal/operationLog/operationLogViewModel',
  ),
  NOTICE_DETAILS_MODEL_VIEW_MODEL: Symbol.for(
    'presenters/publish/notice/noticeDetailsModal/noticeDetailsModalViewModel',
  ),
  NOTICE_DETAILS_TAB_VIEW_MODEL: Symbol.for(
    'presenters/publish/notice/noticeDetailsModal/noticeDetailsTab/noticeDetailsTabModalViewModel',
  ),
  ADVERTISEMENT_CREATADVERTISEMENT_VIEW_MODEL: Symbol.for(
    'presenters/advertisement/creatAdvertisementModalModal/creatAdvertisementModalViewModel',
  ),
};

// 紧急通知
export const NOTICE_IDENTIFIER = {
  NOTICE_LIST_VIEW_MODEL: Symbol.for('presenters/publish/notice/noticeList'),
  CREATE_NOTICE_MODAL_VIEW_MODEL: Symbol.for('presenters/publish/notice/viewModel'),
  NOTICE_LIST_REPOSITORY: Symbol.for('domain/repositories/noticeRepoitory'),
  NOTICE_LIST_USE_CASE: Symbol.for('domain/useCases/noticeUsecase'),
};

// 缺省页 - 上屏发布
export const DEFAULT_PAGE_IDENTIFIER = {
  PUBLISH_DEFAULT_PAGE_LIST_VIEW_MODEL: Symbol.for(
    'presenters/publish/defaultPage/publishDefaultPageListViewModel',
  ),
  PUBLISH_DEFAULT_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/publish/defaultPageList/creatPublishDafaultPageModal/creatPublishDafaultPageModalViewModel',
  ),
  UPLOAD_HISTORY_RECORD_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/publish/advertisement/uploadHistoryRecordModal/uploadHistoryRecordModalViewModel',
  ),
  DEFAULT_PAGE_LIST_VIEW_MODEL: Symbol.for('presenters/defaultPage/defaultPageListViewModel'),
};

// 播放列表
export const PLAY_LIST_IDENTIFIER = {
  ADVERTISEMENT_PLAY_LIST_VIEW_MODEL: Symbol.for('presenters/playList/advertisementPlayList'),
  NOTICE_PLAY_LIST_VIEW_MODEL: Symbol.for('presenters/playList/noticePlayList'),
};

// 审批管理
export const APPROVE_IDENTIFIER = {
  APPROVE_ADVERTISEMENT_APPROVE_VIEW_MODEL: Symbol.for(
    'presenters/approve/advertisementApproveModal/advertisementApproveModalViewModel',
  ),
  APPROVE_NOTICE_APPROVE_VIEW_MODEL: Symbol.for(
    'presenters/approve/noticeApproveModal/noticeApproveModalViewModel',
  ),
  ADVERTISEMENT_APPROVE_LIST_VIEW_MODEL: Symbol.for('presenters/approve/advertisementApproveList'),
  NOTICE_APPROVE_LIST_VIEW_MODEL: Symbol.for('presenters/approve/noticeApproveList'),
  APPROVE_SETTING_VIEW_MODEL: Symbol.for('presenters/approve/approveSetting'),
  APPROVE_SETTING_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/approve/approveSetting/approveSettingModal',
  ),
  APPROVE_SETTING_CHECK_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/approve/approveSetting/approveSettingCheckModal',
  ),

  AUDIT_PROGRESS_VIEW_MODEL: Symbol.for(
    'presenters/publish/advertisement/advertisementDetailsModal/auditProgress/auditProgressViewModel',
  ),
  APPROVE_REPOSITORYL: Symbol.for('presenters/domain/repositories/approveRepositories'),
  APPROVE_USE_CASE: Symbol.for('domain/useCases/approveUseCase'),
};

// 内容管理
export const CONTENT_MANAGEMENT_IDENTIFIER = {
  TEMPLATE_REPOSITORYL: Symbol.for('presenters/domain/repositories/templateRepositories'),
  TEMPLATE_USE_CASE: Symbol.for('domain/useCases/templateUseCase'),
  TEMPLATE_PAGE_VIEW_MODEL: Symbol.for('presenters/contentManagement/templatePage/ViewModel'),
  CREATE_TEMPLATE_VIEW_MODEL: Symbol.for(
    'presenters/contentManagement/createTemplate/ViewModel',
  ),
  MATERIAL_PAGE_VIEW_MODEL: Symbol.for('presenters/contentManagement/materialPage/ViewModel'),
  MATERIAL_REPOSITORYL: Symbol.for('presenters/domain/repositories/materialRepositories'),
  MATERIAL_USE_CASE: Symbol.for('domain/useCases/materialUseCase'),
};

// 缺省页
export const DEFAULT_IDENTIFIER = {
  DEFAULT_MODAL_VIEW_MODEL: Symbol.for(
    'presenters/defaultPage/creatDefaultPageModal/creatDefaultPageModalViewModel',
  ),
  DEFAULT_PAGE_LIST_REPOSITORY: Symbol.for('domain/repositories/defaultPageRepoitory'),
  DEFAULT_PAGE_LIST_USE_CASE: Symbol.for('domain/useCases/defaultPageUsecase'),
};

// 文件管理
export const FILE_IDENTIFIER = {
  FILE_REPOSITORYL: Symbol.for('presenters/domain/repositories/fileRepositories'),
  FILE_USE_CASE: Symbol.for('domain/useCases/FileUseCase'),
};

// 权限控制
export const PERMISSIONS = {
  PERMISSIONS_REPOSITORY: Symbol.for('domain/repositories/PermissionsRepository'),
  PERMISSIONS_USE_CASE: Symbol.for('domain/useCases/PermissionsUseCase'),
}
