/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-07 18:16:21
 */

import React from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

import RootContainer from './presenters/rootContainer';
import DeviceStore from './presenters/device/store';
import DeviceList from './presenters/device/deviceList';
import AdvertisementList from './presenters/publish/advertisement/advertisementList';
import PublishDefaultPageList from './presenters/publish/defaultPageList';
import NoticeList from './presenters/publish/notice/noticeList';

import AdvertisementPlayList from './presenters/playList/advertisementPlayList';
import NoticePlayList from './presenters/playList/noticePlayList';

import AdvertisementApproveList from './presenters/approve/advertisementApproveList';
import NoticeApproveList from './presenters/approve/noticeApproveList';
import ApproveSettingList from './presenters/approve/approveSettingList';

import DefaultPageList from './presenters/defaultPage/defaultPageList';

import TemplatePage from './presenters/contentManagement/templatePage';
import MaterialPage from './presenters/contentManagement/materialPage';

import AdvertStatistics from './presenters/dataStatistics/advertisement';

import NotFound from './presenters/notFound';
import NotPass from './presenters/notPass';
import DeviceStatistics from './presenters/dataStatistics/device';

const routes: RouteConfig[] = [
  {
    component: RootContainer,
    routes: [
      {
        path: '/',
        exact: true,
        render: (): JSX.Element => <Redirect to="/overview/advertisement/statistics" />,
      },
      //403
      {
        path: '/notPass',
        component: NotPass,
      },
      //404
      {
        path: '/notFound',
        component: NotFound,
      },
      //广告统计
      {
        path: '/overview/advertisement/statistics',
        component: AdvertStatistics,
      },
      //设备统计
      {
        path: '/overview/device/statistics',
        component: DeviceStatistics,
      },
      // 设备管理-设备列表
      {
        path: '/device/list',
        component: DeviceList,
      },
      // 设备管理-项目门店
      {
        path: '/project/management',
        component: DeviceStore,
      },
      // 上屏发布-广告列表
      {
        path: '/publish/list',
        component: AdvertisementList,
      },
      // 上屏发布-缺省页列表
      {
        path: '/publish/default/list',
        component: PublishDefaultPageList,
      },
      // 上屏发布-通知管理列表
      {
        path: '/publish/notice/list',
        component: NoticeList,
      },
      // 播放列表-广告列表
      {
        path: '/play/advertisement/list',
        component: AdvertisementPlayList,
      },
      // 播放列表-通知列表
      {
        path: '/play/notice/list',
        component: NoticePlayList,
      },
      // 审批管理-广告列表
      {
        path: '/approval/advertisement/list',
        component: AdvertisementApproveList,
      },
      // 审批管理-通知列表
      {
        path: '/approval/notice/list',
        component: NoticeApproveList,
      },
      // 审批管理-审批设置
      {
        path: '/approval/setting',
        component: ApproveSettingList,
      },
      // 缺省管理-缺省列表
      {
        path: '/default/management/list',
        component: DefaultPageList,
      },
      // 我的模板
      {
        path: '/template',
        component: TemplatePage,
      },
      // 我的素材
      {
        path: '/material',
        component: MaterialPage,
      },
    ],
  },
];

export default routes;
