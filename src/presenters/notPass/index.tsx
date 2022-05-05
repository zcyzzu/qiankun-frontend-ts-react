/*
 * @Author: wuhao
 * @Date: 2021-11-15 15:20:13
 * @LastEditors: liyou
 * @LastEditTime: 2021-11-18 18:24:17
 */

import React from 'react';
import { observer } from 'mobx-react';
import style from './style.less';
import notPass from '../../assets/images/not_pass.svg';

@observer
export default class NotPass extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={style.notPassContainer}>
        <div className={style.content}>
          <div className={style.widCon}>
            <img className={style.bgImg} src={notPass} alt="" />
            <div className={style.title}>抱歉，您无权限查看～</div>
          </div>
        </div>
      </div>
    );
  }
}
