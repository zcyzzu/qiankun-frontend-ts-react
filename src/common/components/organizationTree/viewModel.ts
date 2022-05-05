/*
 * @Author: zhangchenyang
 * @Date: 2021-11-22 15:49:11
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-04 14:34:38
 */
import { EventDataNode, DataNode, Key } from 'rc-tree/lib/interface';
import { OrganizationListEntity, OrganizationTreeListEntity } from '../../../domain/entities/organizationEntities';

export interface TreeInfo {
  event: 'select';
  selected: boolean;
  node: EventDataNode;
  selectedNodes: DataNode[];
  nativeEvent: MouseEvent;
}

export default interface OrganizationTreeViewModel {
  // 商场树数据
  TreeData: OrganizationTreeListEntity[];
  // 获取商场树形图数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTreeData(noStore?: boolean, getCurrentSelectedInfo?: any): void;
  // 当前选中的商场
  selectedStoreTreeData: OrganizationListEntity;
  // 当前选中商场赋值
  setSelectedStoreData(store: OrganizationListEntity): void;
  // 当前选中的组织
  selectedOrgTreeData: OrganizationTreeListEntity;
  // 当前选中组织赋值
  setSelectedOrgData(store: OrganizationTreeListEntity): void;
  // 树选中
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treeSelect(selectedKeys: Key[], info: TreeInfo, getCurrentSelectedInfo: any): void;
  // 需要展开的key
  expandedKeys: Key[];
  // 树展开
  onExpand(expandedKeys: Key[]): void;
  // 自动展开父级树
  autoExpandParent: boolean;
  // 是否有门店
  isStore: boolean;
  // 
  setIsStore(isStore: boolean): void;
  // 组织树是否打开
  isOpen: boolean;
  // 打开/隐藏组织树
  setTreeVisible(): void;
}
