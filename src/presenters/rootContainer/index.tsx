/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:51:37
 */

import React from "react";
import { ConfigProvider, Layout, Spin } from "antd";
import { observer } from "mobx-react";
import zhCN from "antd/lib/locale/zh_CN";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import style from "./style.less";
import DI from "../../inversify.config";
import { ROOT_CONTAINER_IDENTIFIER } from "../../constants/identifiers";
import RootContainereViewModel from "./viewModel";
import CustomHeader from "../../common/components/header";
import CustomMenu from "../../common/components/menu";
import PageTabs from "../../common/components/pageTabs";

import menuOpenIcon from "../../assets/images/menu_open_btn_icon.svg";
import menuCloseIcon from "../../assets/images/menu_close_btn_icon.svg";
import dataEmpty from "../../assets/images/data_empty.svg";

const { Content, Sider } = Layout;

interface RootContainerState {}

@observer
export default class RootContainer extends React.Component<
  RouteConfigComponentProps,
  RootContainerState
> {
  constructor(props: RouteConfigComponentProps) {
    super(props);
    this.state = {};
  }

  private viewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL
  );

  componentDidMount(): void {
    this.viewModel.requestUserInfo();
  }

  render(): JSX.Element {
    const { route, location, history } = this.props;
    const {
      menuData,
      collapsed,
      setCollapsed,
      isLoading,
      routeLoad,
    } = this.viewModel;

    // 全局统一数据为空样式
    const customizeRenderEmpty = (): JSX.Element => (
      <div className={style.tmisGlobalEmpty}>
        <img src={dataEmpty} alt="" />
        <p>暂无数据</p>
      </div>
    );

    return (
      <ConfigProvider locale={zhCN} renderEmpty={customizeRenderEmpty}>
        <Layout className={style.rootContainer} id="root-container-element">
          {!window.__POWERED_BY_QIANKUN__ && <CustomHeader />}
          <Layout className={style.sectionContainer}>
            {/* {!window.__POWERED_BY_QIANKUN__ && (
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width="204"
                collapsedWidth="68"
                trigger={
                  <button type="button" className={style.triggerBtn}>
                    <img
                      src={collapsed ? menuCloseIcon : menuOpenIcon}
                      alt=""
                    />
                  </button>
                }
              >
                <div className={`${style.menuHeader} menuHeaderThemeColor`}>
                  {!collapsed && <span>时耘TMIS</span>}
                </div>
                <CustomMenu
                  dataSource={menuData}
                  pathName={location.pathname}
                />
              </Sider>
            )} */}
            <Layout className={style.contentContainer}>
              <Spin tip="Loading..." size="large" spinning={isLoading}>
                <Content className={style.content}>
                  {!window.__POWERED_BY_QIANKUN__ && (
                    <PageTabs pathName={location.pathname} history={history} />
                  )}
                  {routeLoad && route && renderRoutes(route.routes, null, {})}
                </Content>
              </Spin>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}
