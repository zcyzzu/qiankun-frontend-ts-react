/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:43:30
 */
import React from 'react';
import difference from 'lodash/difference';
import { observer } from 'mobx-react';
import { Modal, Button, Tag, Transfer, Table, Col, Row, Input, Form } from 'antd';
import DI from '../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import GroupModalViewModel, { DeviceListData } from './viewModel';
import style from './style.less';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import groupCloseIcon from '../../../assets/images/close.svg';
import AdvertisementMachineViewModel from '../advertisementMachine/viewModel';
import { DeviceType } from '../../../common/config/commonConfig';

@observer
export default class GroupModal extends React.Component {
  private groupModalViewModel = DI.DIContainer.get<GroupModalViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_GROUP_VIEW_MODEL,
  );

  private advertisementMachineViewModel = DI.DIContainer.get<AdvertisementMachineViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_VIEW_MODEL,
  );

  componentDidMount(): void {
    // 调取数据
  }

  public render(): JSX.Element {
    const {
      groupModalVisible,
      setGroupModalVisible,
      //tag数组新增删除
      tagData,
      tagVisible,
      addTagVisible,
      addTagData,
      deleteTagVisible,
      deleteTag,
      setAddTagVisible,
      setAddTag,
      tagOnchange,
      groupId,
      //穿梭框
      targetKeys,
      setTarKeys,
      // setEmpty,
      // deviceListData,
      deviceListDataSource,
      tagClick,
      setDevice,
      deviceType,
    } = this.groupModalViewModel;

    const leftTableColumns = [
      {
        dataIndex: 'storeName',
        title: '项目/门店名称',
      },
      {
        dataIndex: 'floor',
        title: '所在楼层',
      },
      {
        dataIndex: deviceType === DeviceType.Cashier ? 'pointBrandName' : 'deviceName',
        title: deviceType === DeviceType.Cashier ? '点位品牌名称' : '设备名称',
      },
    ];
    const rightTableColumns = [
      {
        dataIndex: 'storeName',
        title: '项目/门店名称',
      },
      {
        dataIndex: 'floor',
        title: '所在楼层',
      },
      {
        dataIndex: deviceType === DeviceType.Cashier ? 'pointBrandName' : 'deviceName',
        title: deviceType === DeviceType.Cashier ? '点位品牌名称' : '设备名称',
      },
    ];
    return (
      <Modal
        visible={groupModalVisible}
        width={950}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setGroupModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            分组配置
            <Button type="text" onClick={(): void => setGroupModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div>
            <div className={style.screening}>
              1、组别筛选 <span onClick={deleteTagVisible}>{tagVisible ? '取消' : '删除'}</span>
            </div>
            <div className={style.group}>
              <div className={style.groupContent}>
                {tagData &&
                  tagData.map((item) => {
                    return (
                      <Tag
                        closable={tagVisible}
                        closeIcon={<img src={groupCloseIcon} alt="" />}
                        onClose={(e): void => deleteTag(e, item.id)}
                        key={item.id}
                        className={`${groupId.includes(item.id) && style.bgTr}`}
                        onClick={(): void => tagClick(item.id)}
                      >
                        {item.groupName}
                      </Tag>
                    );
                  })}
              </div>
              <div className={style.add}>
                没有您想要的组？立即添加
                {addTagVisible ? (
                  <div className={style.addTag}>
                    <Form>
                      <Form.Item
                        label=""
                        name="advertisement"
                        rules={[
                          {
                            required: true,
                          },
                          {
                            max: 10,
                            type: 'string',
                            message: '最大长度10字符',
                          },
                        ]}
                      >
                        <Input onChange={tagOnchange} />
                      </Form.Item>
                    </Form>
                    <Button
                      type="primary"
                      className={`${addTagData.length === 0 && style.confirm}`}
                      onClick={setAddTag}
                    >
                      确认
                    </Button>
                  </div>
                ) : (
                  <Button type="primary" onClick={setAddTagVisible}>
                    新的组名
                  </Button>
                )}
              </div>
            </div>
            <div className={style.equipment}>2、选择需要添加该组的设备</div>
            <Row className={style.transferTitle}>
              <Col span={12}>设备列表</Col>
              <Col className={style.transferSelected} span={12}>
                已选设备
                {/* 已选设备 <span onClick={setEmpty}>清空</span> */}
              </Col>
            </Row>
            <div className={style.transfer}>
              <Transfer
                showSelectAll={false}
                dataSource={deviceListDataSource}
                targetKeys={targetKeys}
                onChange={(nextTargetKeys: string[]): void => setTarKeys(nextTargetKeys)}
              >
                {({
                  direction,
                  filteredItems,
                  onItemSelectAll,
                  onItemSelect,
                  selectedKeys: listSelectedKeys,
                }): React.ReactNode => {
                  const columns = direction === 'left' ? leftTableColumns : rightTableColumns;

                  const rowSelection = {
                    getCheckboxProps: (item: DeviceListData): object => ({
                      disabled: item.disabled,
                    }),
                    onSelectAll(selected: boolean, selectedRows: DeviceListData[]): void {
                      const treeSelectedKeys = selectedRows
                        .filter((item: DeviceListData) => !item.disabled)
                        .map(({ key }: DeviceListData) => key);
                      const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                      onItemSelectAll(diffKeys, selected);
                    },
                    onSelect({ key }: DeviceListData, selected: boolean): void {
                      onItemSelect(key, selected);
                    },
                    selectedRowKeys: listSelectedKeys,
                  };

                  return (
                    <Table
                      className={style.table}
                      rowClassName={style.tableRow}
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={filteredItems}
                      pagination={{
                        size: 'small',
                        showSizeChanger: false,
                        showQuickJumper: false,
                        showTotal: (total): string => `共 ${total} 条`,
                        // total: deviceListData.totalElements || 0,
                        pageSize: 3,
                        // current: deviceListParams.page + 1,
                      }}
                      size="small"
                      onRow={({ key, disabled: itemDisabled }): object => ({
                        onClick: (): void => {
                          if (itemDisabled) return;
                          onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                      })}
                    />
                  );
                }}
              </Transfer>
            </div>
          </div>
          <div className={style.bottomButton}>
            <Button onClick={(): void => setGroupModalVisible()}>取消</Button>
            <Button
              type="primary"
              onClick={(): void => setDevice(this.advertisementMachineViewModel)}
            >
              保存
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
