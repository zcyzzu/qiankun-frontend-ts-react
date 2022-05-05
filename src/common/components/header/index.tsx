/*
 * @Author: liyou
 * @Date: 2021-06-08 15:17:10
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-02-23 16:50:49
 */
import React from 'react';
import { Menu, Dropdown } from 'antd';
import Cookies from 'js-cookie';
import style from './style.less';
import DI from '../../../inversify.config';
import { CONFIG_IDENTIFIER } from '../../../constants/identifiers';
import ConfigProvider from '../../../common/config/configProvider';
import logo from '../../../assets/images/logo.svg';
import arrowDown from '../../../assets/images/arrow_down.svg';
import { version } from '../../../../package.json';

interface HeaderOwnProps {
  realName?: string;
}

const configProvider = DI.DIContainer.get<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER);

const logOut = (): void => {
  Cookies.remove('access_token');
  window.location.href = `${configProvider.apiPublicUrl}/oauth/login`;
};

export default (props: HeaderOwnProps): JSX.Element => {
  const { realName } = props;

  const infoMenu = (
    <Menu className={style.customHeaderMenu}>
      <Menu.SubMenu title="关于系统" popupOffset={[-3, -8]}>
        <Menu.Item>版本号：V{version}</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item onClick={(): void => logOut()}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div className={`${style.customHeaderConatiner} customHeaderDarkTheme`}>
      <div className={style.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={style.tabContainer}>
        <span className={style.tmisBtn}>
          <a>时耘TMIS</a>
        </span>
      </div>
      <div className={`${style.avatar} avatarThemeClass`}>
        <Dropdown overlay={infoMenu} trigger={['click']}>
          <button type="button">
            <div>{realName ? realName.substring(0, 1) : ''}</div>
            <img src={arrowDown} alt="" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};
