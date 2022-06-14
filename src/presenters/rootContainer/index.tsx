/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 18:30:45
 */

import React from "react";
import { ConfigProvider, Layout } from "antd";
import { observer } from "mobx-react";
import zhCN from "antd/lib/locale/zh_CN";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";

import style from "./style.less";
import dataEmpty from "../../assets/images/data_empty.svg";

const { Content } = Layout;

export default observer(({ route }: RouteConfigComponentProps) => {
  
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
        <Layout className={style.sectionContainer}>
          <Layout className={style.contentContainer}>
            <Content className={style.content}>
              {route && renderRoutes(route.routes, null, {})}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
});
