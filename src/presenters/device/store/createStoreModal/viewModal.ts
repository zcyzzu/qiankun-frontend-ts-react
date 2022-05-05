/*
 * @Author: mayajing
 * @Date: 2021-11-23 17:55:08
 * @LastEditors: mayajing
 * @LastEditTime: 2022-02-18 16:32:56
 */
import { FormInstance } from 'antd';
import { EventDataNode, DataNode } from 'rc-tree/lib/interface';
import { ModalStatus } from '../../../../common/config/commonConfig';
import StoreListViewModel, { StoreListDataConfig } from '../viewModel';
import { OrganizationTreeListEntity } from '../../../../domain/entities/organizationEntities';
import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';

export interface TreeInfo {
  event: 'select';
  selected: boolean;
  node: EventDataNode;
  selectedNodes: DataNode[];
  nativeEvent: MouseEvent;
}

// 城市列表数据结构
export interface CityListEntity {
  code?: string;
  name?: string;
  provinceCode?: string;
}

export default interface CreateProjectModalViewModel {
  // 新增门店窗口类型
  createProjectModalType: ModalStatus;
  createStoresType: string;
  //新增窗口是否可见
  createProjectModalVisible: boolean;
  //设置新增项目窗口状态
  setStoreModalVisible(
    statusType: ModalStatus,
    storesType: string,
    itemData?: StoreListDataConfig,
  ): void;
  storeItemData: StoreListDataConfig;
  // 组织列表数据
  organizationData: OrganizationTreeListEntity[];
  // 获取组织列表
  getOrganization(): void;
  // 城市code
  cityCodeData: string | undefined;
  // 区县code
  countyCode: string | undefined;
  // 提交表单数据
  onFinish(
    values: StoreListItemConfig,
    storeListViewModel: StoreListViewModel,
    formRef?: React.RefObject<FormInstance<unknown>>,
  ): void;
  onCreate(add: boolean, ref?: React.RefObject<FormInstance<unknown>>): void;
  add: boolean;
  // 关闭弹窗
  close(): void;
  mapKey: number;
}
