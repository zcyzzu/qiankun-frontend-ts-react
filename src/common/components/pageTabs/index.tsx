/*
 * @Author: liyou
 * @Date: 2021-06-25 15:34:22
 * @LastEditors: liyou
 * @LastEditTime: 2021-11-18 18:24:07
 */
import React from 'react';
import { Tag } from 'antd';
import * as H from 'history';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import style from './style.less';

import DI from '../../../inversify.config';
import { PAGE_TAB_IDENTIFIER } from '../../../constants/identifiers';
import PageTabsViewModel from './viewModel';

interface PageTabsProps {
  pathName: string;
  history: H.History;
}

const viewModel = DI.DIContainer.get<PageTabsViewModel>(PAGE_TAB_IDENTIFIER.PAGE_TAB_VIEW_MODEL);

const PageTabs: React.FC<PageTabsProps> = observer(({ pathName, history }: PageTabsProps) => {
  const { tabs, tabClose } = viewModel;

  return (
    <div className={style.pageTabsContainer}>
      {tabs.map((item, index) => {
        return (
          <Tag
            key={`page_tab_${index}`}
            closable
            onClose={(e: React.MouseEvent<HTMLElement>): void => {
              e.preventDefault();
              if (tabs.length > 1) {
                tabClose(index);
                if (item.path === pathName) {
                  // 关闭当前标签，跳转到前一个标签的页面
                  history.push(tabs[index - 1].path);
                }
              }
            }}
            className={`${style.tabTag} ${pathName === item.path && style.tabTagActive}`}
          >
            <Link to={item.path}>{item.title}</Link>
          </Tag>
        );
      })}
    </div>
  );
});

export default PageTabs;
