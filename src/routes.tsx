/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-06-13 16:07:21
 */

import React from "react";
import { RouteConfig } from "react-router-config";
import { Redirect } from "react-router-dom";

import RootContainer from "./presenters/rootContainer";

import Demo from "./presenters/demo";

const routes: RouteConfig[] = [
  {
    component: RootContainer,
    routes: [
      {
        path: "/",
        exact: true,
        render: (): JSX.Element => <Redirect to="/demo" />,
      },
      // Demo
      {
        path: "/demo",
        component: Demo,
      },
 
    ],
  },
];

export default routes;
