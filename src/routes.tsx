/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-05-05 14:50:09
 */

import React from "react";
import { RouteConfig } from "react-router-config";
import { Redirect } from "react-router-dom";

import RootContainer from "./presenters/rootContainer";

import NotFound from "./presenters/notFound";
import NotPass from "./presenters/notPass";

const routes: RouteConfig[] = [
  {
    component: RootContainer,
    routes: [
      {
        path: "/",
        exact: true,
        render: (): JSX.Element => <Redirect to="/notPass" />,
      },
      //403
      {
        path: "/notPass",
        component: NotPass,
      },
      //404
      {
        path: "/notFound",
        component: NotFound,
      },
    ],
  },
];

export default routes;
