/*
 * @Author: liyou
 * @Date: 2021-06-07 11:30:50
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-09 13:34:22

 */

import 'reflect-metadata';
import { Container } from 'inversify';
import {
  CONFIG_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  PAGE_TAB_IDENTIFIER,
  USER_IDENTIFIER,
  ORGANIZATION_TREE_IDENTIFIER,
  DATA_STATISTICS_IDENTIFIER,
  DEVICE_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  DEFAULT_PAGE_IDENTIFIER,
  NOTICE_IDENTIFIER,
  THUMBNAIL_IDENTIFIER,
  PLAY_LIST_IDENTIFIER,
  APPROVE_IDENTIFIER,
  DEFAULT_IDENTIFIER,
  FILE_IDENTIFIER,
  PERMISSIONS,
  CONTENT_MANAGEMENT_IDENTIFIER,
} from './constants/identifiers';

// rootcontainer
import RootContainerRepository from './domain/repositories/rootContainerRepository';
import RootContainerRepositoryImpl from './data/rootContainerRepositoryImpl';
import RootContainerViewModel from './presenters/rootContainer/viewModel';
import RootContainerViewModelImpl from './presenters/rootContainer/viewModelImpl';
import RootContainerUseCase from './domain/useCases/rootContainerUseCase';

// file
import FileRepository from './domain/repositories/fileRepository';
import FileRepositoryImpl from './data/fileRepositoryImpl';
import FileUseCase from './domain/useCases/fileUseCase';

// pageTabs
import PageTabsViewModel from './common/components/pageTabs/viewModel';
import PageTabsViewModelImpl from './common/components/pageTabs/viewModelImpl';

// organizationTree
import OrganizationTreeViewModel from './common/components/organizationTree/viewModel';
import OrganizationTreeViewModelImpl from './common/components/organizationTree/viewModelImpl';
import OrganizationTreeRepository from './domain/repositories/organizationRepository';
import OrganizationTreeRepositoryImpl from './data/organizationTreeRepositoryImpl';
import OrganizationTreeUseCase from './domain/useCases/organizationUseCase';

// thumbnail缩略图
import ThumbnailViewModel from './common/components/thumbnail/viewModel';
import ThumbnailViewModelImpl from './common/components/thumbnail/viewModelImpl';

// ConfigProvider
import ConfigProvider from './common/config/configProvider';

// user
import UserRepository from './domain/repositories/userRepository';
import UserRepositoryImpl from './data/userRepositoryImpl';
import UserUseCase from './domain/useCases/userUseCase';

// deviceStatistics
import DeviceStatisticsViewModel from './presenters/dataStatistics/device/viewModel';
import DeviceStatisticsViewModelImpl from './presenters/dataStatistics/device/viewModelImpl';

// deviceList
import DeviceListViewModel from './presenters/device/deviceList/viewModel';
import DeviceListViewModelImpl from './presenters/device/deviceList/viewModelImpl';

// deviceUseCase
import DeviceUseCase from './domain/useCases/deviceUseCase';
//
import DeviceRepository from './domain/repositories/deviceRepository';
import DeviceRepositoryImpl from './data/deviceRepositoryImpl';

// device-batchEditModal
import BatchEditModalViewModel from './presenters/device/batchEditModal/viewModel';
import BatchEditModalViewModelImpl from './presenters/device/batchEditModal/viewModelImpl';

// advertisementMachine
import AdvertisementMachineViewModel from './presenters/device/advertisementMachine/viewModel';
import AdvertisementMachineViewModelImpl from './presenters/device/advertisementMachine/viewModelImpl';

// raspberryMachineViewModel
import RaspberryMachineViewModel from './presenters/device/raspberryMachine/viewModel';
import RaspberryMachineViewModelImpl from './presenters/device/raspberryMachine/viewModelImpl';

// advertisementStatistics
import AdvertisementStatisticsViewModel from './presenters/dataStatistics/advertisement/viewModel';
import AdvertisementStatisticsViewModelImpl from './presenters/dataStatistics/advertisement/viewModelImpl';

// exportModal
import ExportModalViewModel from './presenters/dataStatistics/advertisement/exportModal/viewModel';
import ExportModalViewModelImpl from './presenters/dataStatistics/advertisement/exportModal/viewModelImpl';

// deviceDetailsModal
import DeviceDetailsModalViewModel from './presenters/device/deviceDetailsModal/viewModel';
import DeviceDetailsModalViewModelImpl from './presenters/device/deviceDetailsModal/viewModelImpl';

// deviceInfo
import DeviceInfoViewModel from './presenters/device/deviceDetailsModal/deviceInfo/viewModel';
import DeviceInfoViewModelImpl from './presenters/device/deviceDetailsModal/deviceInfo/viewModelImpl';

// playPlan
import PlayPlanViewModel from './presenters/device/deviceDetailsModal/playPlan/viewModel';
import PlayPlanViewModelImpl from './presenters/device/deviceDetailsModal/playPlan/viewModelImpl';
// deviceDetailsModal
import DeviceEditModalViewModel from './presenters/device/deviceEditModal/viewModel';
import DeviceEditModalViewModelImpl from './presenters/device/deviceEditModal/viewModelImpl';

// Store
import StoreViewModel from './presenters/device/store/viewModel';
import StoreViewModelImpl from './presenters/device/store/viewModelImpl';
// StoreDetailsModel
import StoreDetailsModalViewModel from './presenters/device/store/storeDetailsModal/viewModel';
import StoreDetailsModalViewModelImpl from './presenters/device/store/storeDetailsModal/viewModelImpl';

// createProjectModal
import CreateProjectModalViewModel from './presenters/device/store/createStoreModal/viewModal';
import CreateProjectModalViewModelImpl from './presenters/device/store/createStoreModal/viewModalImpl';
// patrolModal
import PatrolModalViewModel from './presenters/device/patrolModal/viewModel';
import PatrolModalViewModelImpl from './presenters/device/patrolModal/viewModelImpl';
// downLogModal
import DownLogModalViewModel from './presenters/device/downLogModal/viewModel';
import DownLogModalViewModelImpl from './presenters/device/downLogModal/viewModelImpl';

// screenModal
import ScreenModalViewModel from './presenters/device/screenModal/viewModel';
import ScreenModalViewModelImpl from './presenters/device/screenModal/viewModelImpl';

// groupModal
import GroupModalViewModel from './presenters/device/groupModal/viewModel';
import GroupModalViewModelImpl from './presenters/device/groupModal/viewModelImpl';

// advertisementList
import AdvertisementListViewModel from './presenters/publish/advertisement/advertisementList/viewModel';
import AdvertisementListViewModelImpl from './presenters/publish/advertisement/advertisementList/viewModelImpl';

// advertisementUseCase
import AdvertisementUseCase from './domain/useCases/advertisementUseCase';
import AdvertisementRepository from './domain/repositories/advertisementRepository';
import AdvertisementRepositoryImpl from './data/advertisementRepositoryImpl';

// AdvertisementDetailsModal
import AdvertisementDetailsModalViewModel from './presenters/publish/advertisement/advertisementDetailsModal/viewModel';
import AdvertisementDetailsModalViewModelImpl from './presenters/publish/advertisement/advertisementDetailsModal/viewModelImpl';
// AdvertisementDetailsTab
import AdvertisementDetailsTabViewModel from './presenters/publish/advertisement/advertisementDetailsModal/advertisementDetailsTab/viewModel';
import AdvertisementDetailsTabViewModelImpl from './presenters/publish/advertisement/advertisementDetailsModal/advertisementDetailsTab/viewModelImpl';
// AuditProgressViewModel
import AuditProgressViewModel from './presenters/publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import AuditProgressViewModelImpl from './presenters/publish/advertisement/advertisementDetailsModal/auditProgress/viewModelImpl';
// OperationLogViewModel
import OperationLogViewModel from './presenters/publish/advertisement/advertisementDetailsModal/operationLog/viewModel';
import OperationLogViewModelImpl from './presenters/publish/advertisement/advertisementDetailsModal/operationLog/viewModelImpl';
// NoticeDetailsModal
import NoticeDetailsModalViewModel from './presenters/publish/notice/noticeDetailsModal/viewModel';
import NoticeDetailsModalViewModelImpl from './presenters/publish/notice/noticeDetailsModal/viewModelImpl';
// NoticeDetailsTab
import NoticeDetailsTabViewModel from './presenters/publish/notice/noticeDetailsModal/noticeDetailsTab/viewModel';
import NoticeDetailsTabViewModelImpl from './presenters/publish/notice/noticeDetailsModal/noticeDetailsTab/viewModelImpl';

// publishDefaultPageList
import PublishDefaultPageListViewModel from './presenters/publish/defaultPageList/viewModel';
import PublishDefaultPageListViewModelImpl from './presenters/publish/defaultPageList/viewModelImpl';

// creatPublishDafaultPageModal
import CreatPublishDafaultPageModal from './presenters/publish/defaultPageList/creatPublishDafaultPageModal/viewModel';
import CreatPublishDafaultPageModalImpl from './presenters/publish/defaultPageList/creatPublishDafaultPageModal/viewModelImpl';

// noticeList
import NoticeListViewModel from './presenters/publish/notice/noticeList/viewModel';
import NoticeListViewModelImpl from './presenters/publish/notice/noticeList/viewModelImpl';
import NoticeListRepository from './domain/repositories/noticeRepository';
import NoticeListRepositoryImpl from './data/nocticeRepositoryImpl';
import NoticeListUseCase from './domain/useCases/noticeUseCase';
// advertise-notice
import CreateNoticeModalViewModel from './presenters/publish/notice/creatNoticeModal/viewModel';
import CreateNoticeModalViewModelImpl from './presenters/publish/notice/creatNoticeModal/viewModelImpl';
// UploadHistoryRecordModal
import UploadHistoryRecordModalViewModel from './presenters/publish/advertisement/uploadHistoryRecordModal/viewModel';
import UploadHistoryRecordModalViewModelImpl from './presenters/publish/advertisement/uploadHistoryRecordModal/viewModelImpl';

// advertisementPlayList
import AdvertisementPlayListViewModel from './presenters/playList/advertisementPlayList/viewModel';
import AdvertisementPlayListViewModelImpl from './presenters/playList/advertisementPlayList/viewModelImpl';
// creatAdvertisementModal
import CreatAdvertisementModalViewModel from './presenters/publish/advertisement/creatAdvertisementModal/viewModel';
import CreatAdvertisementModalViewModelImpl from './presenters/publish/advertisement/creatAdvertisementModal/viewModelImpl';

// approve
import ApproveRepository from './domain/repositories/approveRepository';
import ApproveRepositoryImpl from './data/approveRepositoryImpl';
import ApproveUseCase from './domain/useCases/approveUseCase';

//advertisementApproveModal
import AdvertisementApproveModalViewModel from './presenters/approve/advertisementApproveModal/viewModel';
import AdvertisementApproveModalViewModelImpl from './presenters/approve/advertisementApproveModal/viewModelImpl';

//noticeApproveModal
import NoticeApproveModalViewModel from './presenters/approve/noticeApproveModal/viewModel';
import NoticeApproveModalViewModelImpl from './presenters/approve/noticeApproveModal/viewModelImpl';

// noticePlayList
import NoticePlayListViewModel from './presenters/playList/noticePlayList/viewModel';
import NoticePlayListViewModelImpl from './presenters/playList/noticePlayList/viewModelImpl';

// 审批管理-广告列表
import AdvertisementApproveListViewModel from './presenters/approve/advertisementApproveList/viewModel';
import AdvertisementApproveListViewModelImpl from './presenters/approve/advertisementApproveList/viewModelImpl';

// 审批管理-通知列表
import NoticeApproveListViewModel from './presenters/approve/noticeApproveList/viewModel';
import NoticeApproveListViewModelImpl from './presenters/approve/noticeApproveList/viewModelImpl';

// 审批管理-审批设置列表
import ApproveSettingListViewModel from './presenters/approve/approveSettingList/viewModel';
import ApproveSettingListViewModelImpl from './presenters/approve/approveSettingList/viewModelImpl';

import TemplateUseCase from './domain/useCases/templateUseCase';
import TemplateRepository from './domain/repositories/templateRepository';
import TemplateRepositoryImpl from './data/templateRepositoryImpl';
// 我的模板
import TemplatePageViewModel from './presenters/contentManagement/templatePage/ViewModel';
import TemplatePageViewModelImpl from './presenters/contentManagement/templatePage/ViewModelImpl';
import createTemplateViewModel from './presenters/contentManagement/templatePage/createTemplate/ViewModel';
import createTemplateViewModelImpl from './presenters/contentManagement/templatePage/createTemplate/ViewModelImpl';
// 我的素材
import MaterialPageViewModel from './presenters/contentManagement/materialPage/ViewModel';
import MaterialPageViewModelImpl from './presenters/contentManagement/materialPage/ViewModelImpl';
import MaterialUseCase from './domain/useCases/materialUseCase';
import MaterialRepository from './domain/repositories/materialRepository';
import MaterialRepositoryImpl from './data/materialRepositoryImpl';

// defaultPageList
import DefaultPageListViewModel from './presenters/defaultPage/defaultPageList/viewModel';
import DefaultPageListViewModelImpl from './presenters/defaultPage/defaultPageList/viewModelImpl';

// ApproveSettingModal
import ApproveSettingModalViewModel from './presenters/approve/approveSettingList/approveSettingModal/viewModel';
import ApproveSettingModalViewModelImpl from './presenters/approve/approveSettingList/approveSettingModal/viewModelImpl';

// ApproveSettingCheckModal
import ApproveSettingCheckModalViewModel from './presenters/approve/approveSettingList/approveSettingCheckModal/viewModel';
import ApproveSettingCheckModalViewModelImpl from './presenters/approve/approveSettingList/approveSettingCheckModal/viewModelImpl';

// creatDefaultPageModal
import CreatDefaultPageModal from './presenters/defaultPage/creatDefaultPageModal/viewModel';
import CreatDefaultPageModalImpl from './presenters/defaultPage/creatDefaultPageModal/viewModelImpl';

//DefaulepageRepository
import DefaultpageRepository from './domain/repositories/defaultPageRepository';
import DefaultPageRepositoryImpl from './data/defaultPageRepositoryImpl';

// permissons
import PermissionsRepository from './domain/repositories/permissionsRepository';
import PermissionsRepositoryImpl from './data/permissionsRepositoryImpl';
import PermissionsUseCase from './domain/useCases/permissionsUseCase';

//
import DefaultPageUseCase from './domain/useCases/defaultPageUseCase';

const DIContainer = new Container();

// config provider
DIContainer.bind<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER)
  .to(ConfigProvider)
  .inSingletonScope();

// rootcontainer
DIContainer.bind<RootContainerRepository>(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_REPOSITORY).to(
  RootContainerRepositoryImpl,
);
//
DIContainer.bind<RootContainerViewModel>(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL)
  .to(RootContainerViewModelImpl)
  .inSingletonScope();
DIContainer.bind(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE).to(RootContainerUseCase);

// pageTabs
DIContainer.bind<PageTabsViewModel>(PAGE_TAB_IDENTIFIER.PAGE_TAB_VIEW_MODEL)
  .to(PageTabsViewModelImpl)
  .inSingletonScope();

// organizationTree
DIContainer.bind<OrganizationTreeViewModel>(
  ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_VIEW_MODEL,
)
  .to(OrganizationTreeViewModelImpl)
  .inSingletonScope();
DIContainer.bind<OrganizationTreeRepository>(
  ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_REPOSITORYL,
).to(OrganizationTreeRepositoryImpl);
DIContainer.bind(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_USE_CASE).to(
  OrganizationTreeUseCase,
);

// Store
DIContainer.bind<StoreViewModel>(DEVICE_IDENTIFIER.PROJECT_STORE_VIEW_MODEL)
  .to(StoreViewModelImpl)
  .inSingletonScope();
// StoreDetailsModel
DIContainer.bind<StoreDetailsModalViewModel>(
  DEVICE_IDENTIFIER.PROJECT_STORE__DETAILS_MODAL_VIEW_MODEL,
)
  .to(StoreDetailsModalViewModelImpl)
  .inSingletonScope();

// thumbnail缩略图
DIContainer.bind<ThumbnailViewModel>(THUMBNAIL_IDENTIFIER.THUMBNAIL_VIEW_MODEL).to(
  ThumbnailViewModelImpl,
);

// createProjectModal
DIContainer.bind<CreateProjectModalViewModel>(DEVICE_IDENTIFIER.CREATE_PROJECT_MODAL_VIEW_MODEL)
  .to(CreateProjectModalViewModelImpl)
  .inSingletonScope();

// advertisementList
DIContainer.bind<AdvertisementListViewModel>(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_LIST_VIEW_MODEL)
  .to(AdvertisementListViewModelImpl)
  .inSingletonScope();
// advertisementUseCases
DIContainer.bind(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE).to(AdvertisementUseCase);
DIContainer.bind<AdvertisementRepository>(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_REPOSITORY).to(
  AdvertisementRepositoryImpl,
);

// publishdefaultPageList
DIContainer.bind<PublishDefaultPageListViewModel>(
  DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_PAGE_LIST_VIEW_MODEL,
)
  .to(PublishDefaultPageListViewModelImpl)
  .inSingletonScope();

// creatPublishDafaultPageModal
DIContainer.bind<CreatPublishDafaultPageModal>(
  DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_MODAL_VIEW_MODEL,
)
  .to(CreatPublishDafaultPageModalImpl)
  .inSingletonScope();

// noticeList
DIContainer.bind<NoticeListViewModel>(NOTICE_IDENTIFIER.NOTICE_LIST_VIEW_MODEL)
  .to(NoticeListViewModelImpl)
  .inSingletonScope();
DIContainer.bind<NoticeListRepository>(NOTICE_IDENTIFIER.NOTICE_LIST_REPOSITORY).to(
  NoticeListRepositoryImpl,
);
DIContainer.bind(NOTICE_IDENTIFIER.NOTICE_LIST_USE_CASE).to(NoticeListUseCase);

// 审批管理-广告列表
DIContainer.bind<AdvertisementApproveListViewModel>(
  APPROVE_IDENTIFIER.ADVERTISEMENT_APPROVE_LIST_VIEW_MODEL,
)
  .to(AdvertisementApproveListViewModelImpl)
  .inSingletonScope();

// 审批管理-通知列表
DIContainer.bind<NoticeApproveListViewModel>(APPROVE_IDENTIFIER.NOTICE_APPROVE_LIST_VIEW_MODEL)
  .to(NoticeApproveListViewModelImpl)
  .inSingletonScope();

// 审批管理-审批设置列表
DIContainer.bind<ApproveSettingListViewModel>(APPROVE_IDENTIFIER.APPROVE_SETTING_VIEW_MODEL)
  .to(ApproveSettingListViewModelImpl)
  .inSingletonScope();

// TemplateUseCase
DIContainer.bind(CONTENT_MANAGEMENT_IDENTIFIER.TEMPLATE_USE_CASE).to(TemplateUseCase);
//TemplateRepository
DIContainer.bind<TemplateRepository>(CONTENT_MANAGEMENT_IDENTIFIER.TEMPLATE_REPOSITORYL).to(
  TemplateRepositoryImpl,
);
// 我的模板
DIContainer.bind<TemplatePageViewModel>(CONTENT_MANAGEMENT_IDENTIFIER.TEMPLATE_PAGE_VIEW_MODEL)
  .to(TemplatePageViewModelImpl)
  .inSingletonScope();
DIContainer.bind<createTemplateViewModel>(CONTENT_MANAGEMENT_IDENTIFIER.CREATE_TEMPLATE_VIEW_MODEL)
  .to(createTemplateViewModelImpl)
  .inSingletonScope();
// 我的素材
DIContainer.bind<MaterialPageViewModel>(CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_PAGE_VIEW_MODEL)
  .to(MaterialPageViewModelImpl)
  .inSingletonScope();
// MaterialUseCase
DIContainer.bind(CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_USE_CASE).to(MaterialUseCase);
//MaterialRepository
DIContainer.bind<MaterialRepository>(CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_REPOSITORYL).to(
  MaterialRepositoryImpl,
);

// 缺省管理-缺省页列表
DIContainer.bind<DefaultPageListViewModel>(DEFAULT_PAGE_IDENTIFIER.DEFAULT_PAGE_LIST_VIEW_MODEL)
  .to(DefaultPageListViewModelImpl)
  .inSingletonScope();

// defaultPage
DIContainer.bind<DefaultpageRepository>(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_REPOSITORY).to(
  DefaultPageRepositoryImpl,
);
DIContainer.bind(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_USE_CASE).to(DefaultPageUseCase);

// user
DIContainer.bind<UserRepository>(USER_IDENTIFIER.USER_REPOSITORY).to(UserRepositoryImpl);
DIContainer.bind(USER_IDENTIFIER.USER_USE_CASE)
  .to(UserUseCase)
  .inSingletonScope();

// deviceStatistics
DIContainer.bind<DeviceStatisticsViewModel>(
  DATA_STATISTICS_IDENTIFIER.DEVICE_STATISTICS_VIEW_MODEL,
).to(DeviceStatisticsViewModelImpl);

// deviceList
DIContainer.bind<AdvertisementMachineViewModel>(DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_VIEW_MODEL)
  .to(AdvertisementMachineViewModelImpl)
  .inSingletonScope();

// deviceUseCases
DIContainer.bind(DEVICE_IDENTIFIER.DEVICE_USE_CASE).to(DeviceUseCase);

// deviceRepository
DIContainer.bind<DeviceRepository>(DEVICE_IDENTIFIER.DEVICE_REPOSITORY).to(DeviceRepositoryImpl);

// advertisementMachine
DIContainer.bind<DeviceListViewModel>(DEVICE_IDENTIFIER.DEVICE_LIST_VIEW_MODEL)
  .to(DeviceListViewModelImpl)
  .inSingletonScope();

// raspberryMachineViewModel
DIContainer.bind<RaspberryMachineViewModel>(DEVICE_IDENTIFIER.RASPBERRY_MACHINE_VIEW_MODEL)
  .to(RaspberryMachineViewModelImpl)
  .inSingletonScope();

// advertisementPlayList
DIContainer.bind<AdvertisementPlayListViewModel>(
  PLAY_LIST_IDENTIFIER.ADVERTISEMENT_PLAY_LIST_VIEW_MODEL,
).to(AdvertisementPlayListViewModelImpl);

// NoticePlayList
DIContainer.bind<NoticePlayListViewModel>(PLAY_LIST_IDENTIFIER.NOTICE_PLAY_LIST_VIEW_MODEL).to(
  NoticePlayListViewModelImpl,
);

// advertStatistics
DIContainer.bind<AdvertisementStatisticsViewModel>(
  DATA_STATISTICS_IDENTIFIER.ADVERT_STATISTICS_VIEW_MODEL,
).to(AdvertisementStatisticsViewModelImpl);

// exportModal
DIContainer.bind<ExportModalViewModel>(
  DATA_STATISTICS_IDENTIFIER.ADVERT_STATISTICS_EXPORT_VIEW_MODEL,
)
  .to(ExportModalViewModelImpl)
  .inSingletonScope();

// deviceDetailsModal
DIContainer.bind<DeviceDetailsModalViewModel>(DEVICE_IDENTIFIER.DEVICE_DETAILS_MODEL_VIEW_MODEL)
  .to(DeviceDetailsModalViewModelImpl)
  .inSingletonScope();

// deviceInfo
DIContainer.bind<DeviceInfoViewModel>(DEVICE_IDENTIFIER.DEVICE_INFO)
  .to(DeviceInfoViewModelImpl)
  .inSingletonScope();

// playPlan
DIContainer.bind<PlayPlanViewModel>(DEVICE_IDENTIFIER.PLAY_PLAN)
  .to(PlayPlanViewModelImpl)
  .inSingletonScope();

// deviceEditModal
DIContainer.bind<DeviceEditModalViewModel>(DEVICE_IDENTIFIER.DEVICE_EDIT_MODEL_VIEW_MODEL)
  .to(DeviceEditModalViewModelImpl)
  .inSingletonScope();

// patrolModal
DIContainer.bind<PatrolModalViewModel>(DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_PATROL_VIEW_MODEL)
  .to(PatrolModalViewModelImpl)
  .inSingletonScope();

// downLoglModal
DIContainer.bind<DownLogModalViewModel>(DEVICE_IDENTIFIER.DOWN_LOG_MODAL_VIEW_MODEL)
  .to(DownLogModalViewModelImpl)
  .inSingletonScope();

// screenModal
DIContainer.bind<ScreenModalViewModel>(DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_SCREEN_VIEW_MODEL)
  .to(ScreenModalViewModelImpl)
  .inSingletonScope();

// groupModal
DIContainer.bind<GroupModalViewModel>(DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_GROUP_VIEW_MODEL)
  .to(GroupModalViewModelImpl)
  .inSingletonScope();

// CreateNoticeModal
DIContainer.bind<CreateNoticeModalViewModel>(NOTICE_IDENTIFIER.CREATE_NOTICE_MODAL_VIEW_MODEL)
  .to(CreateNoticeModalViewModelImpl)
  .inSingletonScope();

// advertisementDetailsModal
DIContainer.bind<AdvertisementDetailsModalViewModel>(
  ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_MODEL_VIEW_MODEL,
)
  .to(AdvertisementDetailsModalViewModelImpl)
  .inSingletonScope();
// advertisementDetailsTab
DIContainer.bind<AdvertisementDetailsTabViewModel>(
  ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_TAB_VIEW_MODEL,
)
  .to(AdvertisementDetailsTabViewModelImpl)
  .inSingletonScope();
// AuditProgressTab
DIContainer.bind<AuditProgressViewModel>(APPROVE_IDENTIFIER.AUDIT_PROGRESS_VIEW_MODEL)
  .to(AuditProgressViewModelImpl)
  .inSingletonScope();
// OperationLog
DIContainer.bind<OperationLogViewModel>(ADVERTISEMENT_IDENTIFIER.OPERATION_LOG_VIEW_MODEL)
  .to(OperationLogViewModelImpl)
  .inSingletonScope();

// NoticeDetailsModal
DIContainer.bind<NoticeDetailsModalViewModel>(
  ADVERTISEMENT_IDENTIFIER.NOTICE_DETAILS_MODEL_VIEW_MODEL,
)
  .to(NoticeDetailsModalViewModelImpl)
  .inSingletonScope();
// NoticeDetailsTab
DIContainer.bind<NoticeDetailsTabViewModel>(ADVERTISEMENT_IDENTIFIER.NOTICE_DETAILS_TAB_VIEW_MODEL)
  .to(NoticeDetailsTabViewModelImpl)
  .inSingletonScope();

// UploadHistoryRecordModal
DIContainer.bind<UploadHistoryRecordModalViewModel>(
  DEFAULT_PAGE_IDENTIFIER.UPLOAD_HISTORY_RECORD_MODAL_VIEW_MODEL,
)
  .to(UploadHistoryRecordModalViewModelImpl)
  .inSingletonScope();
//creatAdvertisementModal
DIContainer.bind<CreatAdvertisementModalViewModel>(
  ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_CREATADVERTISEMENT_VIEW_MODEL,
)
  .to(CreatAdvertisementModalViewModelImpl)
  .inSingletonScope();

//advertisementApproveModal
DIContainer.bind<AdvertisementApproveModalViewModel>(
  APPROVE_IDENTIFIER.APPROVE_ADVERTISEMENT_APPROVE_VIEW_MODEL,
)
  .to(AdvertisementApproveModalViewModelImpl)
  .inSingletonScope();

//noticeApproveModal
DIContainer.bind<NoticeApproveModalViewModel>(APPROVE_IDENTIFIER.APPROVE_NOTICE_APPROVE_VIEW_MODEL)
  .to(NoticeApproveModalViewModelImpl)
  .inSingletonScope();

// approve
DIContainer.bind<ApproveRepository>(APPROVE_IDENTIFIER.APPROVE_REPOSITORYL).to(
  ApproveRepositoryImpl,
);
DIContainer.bind(APPROVE_IDENTIFIER.APPROVE_USE_CASE).to(ApproveUseCase);

// ApproveSettingModal
DIContainer.bind<ApproveSettingModalViewModel>(APPROVE_IDENTIFIER.APPROVE_SETTING_MODAL_VIEW_MODEL)
  .to(ApproveSettingModalViewModelImpl)
  .inSingletonScope();

// ApproveSettingCheckModal
DIContainer.bind<ApproveSettingCheckModalViewModel>(
  APPROVE_IDENTIFIER.APPROVE_SETTING_CHECK_MODAL_VIEW_MODEL,
)
  .to(ApproveSettingCheckModalViewModelImpl)
  .inSingletonScope();
//noticeApproveModal
DIContainer.bind<CreatDefaultPageModal>(DEFAULT_IDENTIFIER.DEFAULT_MODAL_VIEW_MODEL)
  .to(CreatDefaultPageModalImpl)
  .inSingletonScope();

//BatchEditModalViewModel
DIContainer.bind<BatchEditModalViewModel>(DEVICE_IDENTIFIER.BATCH_EDIT_MODAL_VIEW_MODEL)
  .to(BatchEditModalViewModelImpl)
  .inSingletonScope();

// file
DIContainer.bind<FileRepository>(FILE_IDENTIFIER.FILE_REPOSITORYL).to(FileRepositoryImpl);
DIContainer.bind(FILE_IDENTIFIER.FILE_USE_CASE).to(FileUseCase);

// permissons
DIContainer.bind<PermissionsRepository>(PERMISSIONS.PERMISSIONS_REPOSITORY).to(
  PermissionsRepositoryImpl,
);
DIContainer.bind(PERMISSIONS.PERMISSIONS_USE_CASE).to(PermissionsUseCase);

export default { DIContainer };
