/*
 * @Author: liyou
 * @Date: 2021-06-08 14:44:08
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-21 18:12:46
 */
import React from 'react';
import { Menu } from 'antd';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import style from './style.less';
import DI from '../../../inversify.config';
import { PAGE_TAB_IDENTIFIER } from '../../../constants/identifiers';
import PageTabsViewModel from '../pageTabs/viewModel';
import { MenuEntity } from '../../../domain/entities/menuEntities';

const { SubMenu } = Menu;

interface MenuOwnProps {
  dataSource: MenuEntity[];
  pathName: string;
}

interface MenuState {
  menuElements: JSX.Element[];
}

@observer
export default class CustomMenu extends React.Component<MenuOwnProps, MenuState> {
  private pageTabViewModel = DI.DIContainer.get<PageTabsViewModel>(
    PAGE_TAB_IDENTIFIER.PAGE_TAB_VIEW_MODEL,
  );

  constructor(props: MenuOwnProps) {
    super(props);
    this.state = {
      menuElements: [],
    };
  }

  componentDidUpdate(prevProps: MenuOwnProps): void {
    const { dataSource } = this.props;
    if (dataSource !== prevProps.dataSource) {
      // TODO 构造菜单
      this.setState({
        menuElements: this.generateMenuGroupElement([dataSource[1]]),
      });
    }
  }

  // generate Menu.ItemGroup element
  generateMenuGroupElement = (menuData: MenuEntity[]): JSX.Element[] => {
    return menuData.map((subMenuData, index) => {
      return (
        <Menu.ItemGroup key={`menu-group-${index}`} title={subMenuData.name}>
          {this.generateSubElement(subMenuData)}
        </Menu.ItemGroup>
      );
    });
  };

  // generate SubMenu & Menu.Item element
  generateSubElement = (menuData: MenuEntity): JSX.Element[] => {
    if (menuData.subMenus) {
      return menuData.subMenus.map((subMenuData) => {
        if (subMenuData.subMenus && subMenuData.subMenus.length !== 0) {
          return (
            <SubMenu
              key={`sub-menu-${subMenuData.id}`}
              title={subMenuData.name}
              // icon={
              //   subMenuData.icon?.includes('menu') && (
              //     <img
              //       src={require(`../../../assets/images/menu/${subMenuData.icon}.svg`)}
              //       alt=""
              //     />
              //   )
              // }
            >
              {this.generateSubElement(subMenuData)}
            </SubMenu>
          );
        }
        // 根据页面加载时默认的pathName，构造pageTab组件的初始值
        const { pathName } = this.props;
        if (subMenuData.route === pathName) {
          this.menuSelect(subMenuData);
        }
        return (
          <Menu.Item
            key={subMenuData.route}
            title={subMenuData.name}
            icon={
              subMenuData.icon?.includes('menu')
            }
            onClick={(): void => this.menuSelect(subMenuData)}
          >
            {subMenuData.route && <Link to={subMenuData.route}>{subMenuData.name}</Link>}
          </Menu.Item>
        );
      });
    }
    return [];
  };

  // 菜单选择
  private menuSelect = ({ name, route }: MenuEntity): void => {
    // pageTab组件赋值
    const { setTabs } = this.pageTabViewModel;
    setTabs({
      title: name || '',
      path: route || '',
    });
  };

  render(): JSX.Element {
    const { pathName } = this.props;
    const { menuElements } = this.state;

    return (
      <Menu
        mode="inline"
        theme="dark"
        className={`${style.customMenuContainer} customMenuDarkTheme`}
        selectedKeys={[pathName]}
      >
        {menuElements}
      </Menu>
    );
  }
}
