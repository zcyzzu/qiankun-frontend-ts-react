/*
 * @Author: wuhao
 * @Date: 2021-11-15 15:20:13
 * @LastEditors: liyou
 * @LastEditTime: 2021-11-18 18:24:14
 */

import React from 'react';
import { observer } from 'mobx-react';
import style from './style.less';
import notFound from '../../assets/images/not_found.svg';

@observer
export default class NotFound extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={style.notFoundContainer}>
        <div className={style.content}>
          <div className={style.widCon}>
            <img className={style.bgImg} src={notFound} alt="" />
            <div className={style.title}>找不到页面～</div>
          </div>
        </div>
      </div>
    );
  }
}
