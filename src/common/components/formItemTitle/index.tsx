/*
 * @Author: liyou
 * @Date: 2021-06-08 15:17:10
 * @LastEditors: wuhao
 * @LastEditTime: 2021-11-24 17:57:15
 */
import React from 'react';
import { Tooltip } from 'antd';
import style from './style.less';
import timeTooips from '../../../assets/images/time_tooips.svg';

interface FormItemTitleOwnProps {
  title: string;
  description?: string;
  className?: string;
  prompt?: PromptProps;
}

interface PromptProps {
  show: boolean;
  title: string;
}

export default (props: FormItemTitleOwnProps): JSX.Element => {
  const { title, description, className, prompt } = props;
  return (
    <div className={`${style.itemTitle} ${className}`}>
      <b />
      <span>{title}</span>
      {description && <span className={style.titleDescribe}>{description}</span>}
      {prompt && prompt.show && (
        <Tooltip placement="top" title={prompt.title}>
          <img className={style.timeImg} src={timeTooips} alt="" />
        </Tooltip>
      )}
    </div>
  );
};
