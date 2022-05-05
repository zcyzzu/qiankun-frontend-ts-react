/*
 * @Author: zhangchenyang
 * @Date: 2021-11-22 15:48:46
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-07 14:42:35
 */
import React from 'react';
import { Key } from 'rc-tree/lib/interface';
import { observer } from 'mobx-react';
import { Tree } from 'antd';
import style from './style.less';
import DI from '../../../inversify.config';
import { ORGANIZATION_TREE_IDENTIFIER } from '../../../constants/identifiers';
import OrganizationTreeViewModel, { TreeInfo } from './viewModel';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import TreeOpenIcon from '../../../assets/images/tree_open_icon.svg';
import TreeCloseIcon from '../../../assets/images/tree_close_icon.svg';

interface OrganizationTreeProps {
  // 传入组件的classname
  treeWrapper?: string;
  // 获取当前选中的组织信息
  getCurrentSelectedInfo(TreeData: OrganizationListEntity): void;
  // 是否展示连接线
  showLine?: boolean | { showLeafIcon: boolean };
  // 是否带门店
  noStore?: boolean;
}

@observer
export default class OrganizationTree extends React.Component<OrganizationTreeProps> {
  private viewModel = DI.DIContainer.get<OrganizationTreeViewModel>(
    ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_VIEW_MODEL,
  );

  componentDidMount(): void {
    const { getTreeData } = this.viewModel;
    const { noStore, getCurrentSelectedInfo } = this.props;
    getTreeData(noStore, getCurrentSelectedInfo);
  }

  public render(): JSX.Element {
    const {
      TreeData,
      treeSelect,
      expandedKeys,
      onExpand,
      autoExpandParent,
      isStore,
      selectedStoreTreeData,
      selectedOrgTreeData,
      isOpen,
      setTreeVisible,
    } = this.viewModel;
    const { treeWrapper, showLine, getCurrentSelectedInfo } = this.props;
    return (
      <>
        <div className={`${treeWrapper} ${!isOpen && style.hiddenTree}`}>
          <div className={style.storeManagementRootContainer}>
            {TreeData.length > 0 && (
              <Tree
                showIcon
                treeData={TreeData}
                onSelect={(selectedKeys: Key[], info: TreeInfo): void => {
                  treeSelect(selectedKeys, info, getCurrentSelectedInfo)
                }}
                selectedKeys={
                  isStore ? [selectedStoreTreeData.key || 0] : [selectedOrgTreeData.unitId || 0]
                }
                showLine={showLine}
                className={style.treeContainer}
                expandedKeys={expandedKeys}
                onExpand={onExpand}
                autoExpandParent={autoExpandParent}
              />
            )}
          </div>
        </div>
        <div className={`${isOpen ? style.openImage : style.closeImage}`} onClick={(): void => setTreeVisible()}>
          {isOpen ? <img src={TreeCloseIcon} alt="" /> : <img src={TreeOpenIcon} alt="" />}
        </div>
      </>
    );
  }
}
