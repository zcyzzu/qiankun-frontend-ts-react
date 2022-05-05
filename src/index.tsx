/*
 * @Author: liyou
 * @Date: 2021-06-04 17:27:43
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2021-11-18 18:31:53
 */
import './publicPath';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import Cookies from 'js-cookie';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import './global.less';
import routes from './routes';
import * as serviceWorker from './serviceWorker';
import ConfigProvider from './common/config/configProvider';
import setupInterceptorsTo from './utils/interceptors';
import DI from './inversify.config';

// import 'antd/dist/antd.less';
// import './common/styles/twTheme.less';

import 'moment/locale/zh-cn';
import { CONFIG_IDENTIFIER } from './constants/identifiers';

moment.locale('zh-cn');

window.__FE_CONF_PROV__ = DI.DIContainer.get<ConfigProvider>(
  CONFIG_IDENTIFIER.CONFIG_PROVIDER,
)

// register axios interceptors
setupInterceptorsTo(axios);

// override Date toJSON
/*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
Date.prototype.toJSON = function toJSON(): string {
  return moment(this).format('YYYY-MM-DD HH:mm:ss');
};

// oauth login callback token process
const loginRedirect = window.location.href.split('&redirectFlag#');
if (loginRedirect && loginRedirect.length >= 2) {
  const redirectPath = loginRedirect[0];
  const tokenData = qs.parse(loginRedirect[1]);
  console.log('receive redirect path: ', redirectPath);
  console.log('receive token str: ', tokenData);
  Cookies.set('access_token', tokenData.access_token as string);
  Cookies.set('token_type', tokenData.token_type as string);
  window.history.pushState({}, '', redirectPath);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function render(props: any): void {
  const { container } = props;
  ReactDOM.render(
    <BrowserRouter basename="/tmis">
      <React.StrictMode>{renderRoutes(routes)}</React.StrictMode>
    </BrowserRouter>,
    container ? container.querySelector('#rootReactElement') : document.querySelector('#rootReactElement'),
  );
}

// run without qiankun micro frontend e.g. dev
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

serviceWorker.unregister();

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(): Promise<void> {
  console.log('react tmis app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mount(props: any): Promise<void> {
  console.log('props from qiankun mount: ', props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function unmount(props: any): Promise<void> {
  console.log('props from qiankun unmount: ', props);
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#rootReactElement') : document.querySelector('#rootReactElement'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function update(props: any): Promise<void> {
  console.log('update tmis props', props);
}