/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 13:40:41
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:33:47
 */
import React from 'react';
import { observer } from 'mobx-react';
import { reaction, runInAction } from 'mobx';
import { ColumnProps } from 'antd/lib/table';
import {
  Tooltip,
  Row,
  Col,
  Space,
  Input,
  Select,
  Button,
  Table,
  Modal,
  Form,
  FormInstance,
  Divider,
} from 'antd';
import DI from '../../../inversify.config';
import style from './style.less';
import RaspberryMachinePropsViewModel, { DeviceRecordDataConfig } from './viewModel';
import DeviceEditModal from '../deviceEditModal/index';
import DeviceEditModalViewModel from '../deviceEditModal/viewModel';
import { DeviceType, ModalStatus } from '../../../common/config/commonConfig';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import edit from '../../../assets/images/edit_icon.svg';
import deleteIcon from '../../../assets/images/delete_icon.svg';
import deleteDisableIcon from '../../../assets/images/delete_disable_icon.svg';
import addIcon from '../../../assets/images/add_icon.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';
import RootContainereViewModel from '../../rootContainer/viewModel';
import { DEVICE_IDENTIFIER, ROOT_CONTAINER_IDENTIFIER } from '../../../constants/identifiers';

const { DEVICE_LIST } = PERMISSIONS_CODES;

interface RaspberryMachineProps {
  unitIds?: number;
  storeIds?: number;
  getTabsList(): void;
}

interface RaspberryMachineState {
  // 树莓派列表表格列头
  deviceListColumn: ColumnProps<DeviceRecordDataConfig>[];
  selectedRowKeysList: React.Key[];
}

@observer
export default class RaspberryMachine extends React.Component<
  RaspberryMachineProps,
  RaspberryMachineState
> {
  private viewModel = DI.DIContainer.get<RaspberryMachinePropsViewModel>(
    DEVICE_IDENTIFIER.RASPBERRY_MACHINE_VIEW_MODEL,
  );

  private deviceEditModalViewModel = DI.DIContainer.get<DeviceEditModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_EDIT_MODEL_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private formRefCheck = React.createRef<FormInstance>();

  constructor(props: RaspberryMachineProps) {
    super(props);
    this.state = {
      deviceListColumn: [],
      selectedRowKeysList: [],
    };
    reaction(
      () => this.props,
      (data) => {
        const { getDeviceList, initDeviceListParams } = this.viewModel;
        initDeviceListParams();
        getDeviceList(data.unitIds, data.storeIds);
        data.getTabsList();
        this.setState({ selectedRowKeysList: [] });
      },
    );
  }

  async componentDidMount(): Promise<void> {
    await this.getPermissonData();
  }

  private onSelectChange = (selectedRowKeys: React.Key[]): void => {
    this.setState({ selectedRowKeysList: selectedRowKeys });
  };

  private getPermissonData = async (): Promise<void> => {
    const {
      getDeviceList,
      getLookupsValue,
      initDeviceListParams,
      getPermissionsData,
      setPermissionsData,
    } = this.viewModel;
    const { unitIds, storeIds, getTabsList } = this.props;
    const { EDIT, DELETE, RASPBERRY_PIE, SEE, RASPBERRY_DEL } = DEVICE_LIST;
    try {
      const permissionsData = await getPermissionsData([
        EDIT,
        DELETE,
        RASPBERRY_PIE,
        SEE,
        RASPBERRY_DEL,
      ]);
      runInAction(() => {
        setPermissionsData(permissionsData);
        initDeviceListParams();
        getDeviceList(unitIds, storeIds);
        getTabsList();
        getLookupsValue(LookupsCodeTypes.DEVICE_PAGE_STATUS);
        this.setState({
          selectedRowKeysList: [],
          deviceListColumn: [
            {
              title: '设备名称',
              key: 'name',
              align: 'left',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Button
                  type="link"
                  size="small"
                  className={style.columnContentShow}
                  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                  onClick={() => {
                    return permissionsData[SEE]
                      ? this.openEditModal(record, DeviceType.Raspberry, ModalStatus.View)
                      : null;
                  }}
                >
                  {record.name}
                </Button>
              ),
              width: '15%',
            },
            {
              title: 'Mac地址',
              dataIndex: 'macAddress',
              key: 'macAddress',
              align: 'left',
              width: '20%',
            },
            {
              title: 'IP地址',
              dataIndex: 'ipAddress',
              key: 'ipAddress',
              align: 'left',
              width: '20%',
            },
            {
              title: '子网掩码',
              dataIndex: 'subMask',
              key: 'subMask',
              align: 'left',
              width: '20%',
            },
            {
              title: '设备状态',
              key: 'status',
              align: 'left',
              width: '15%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <div className={style.deviceNameStyleWrapper}>
                  {record.offOn === 'ON' ? (
                    <div
                      className={style.storeStatusStyle}
                      style={{ background: 'rgba(0,203,148,0.1)', color: '#03AD8F' }}
                    >
                      <div className={style.statusDot} style={{ background: '#03AD8F' }} />
                      在线
                    </div>
                  ) : (
                    <div
                      className={style.storeStatusStyle}
                      style={{ background: 'rgba(245,34,45,0.1)', color: '#F5222D' }}
                    >
                      <div className={style.statusDot} style={{ background: '#F5222D' }} />
                      离线
                    </div>
                  )}
                  {record.status === '1' ? (
                    <div
                      className={style.storeStatusStyle}
                      style={{ background: 'rgba(0,203,148,0.1)', color: '#03AD8F' }}
                    >
                      <div className={style.statusDot} style={{ background: '#03AD8F' }} />
                      启用
                    </div>
                  ) : (
                    <div
                      className={style.storeStatusStyle}
                      style={{ background: 'rgba(245,34,45,0.1)', color: '#F5222D' }}
                    >
                      <div className={style.statusDot} style={{ background: '#F5222D' }} />
                      禁用
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: '操作',
              key: 'action',
              align: 'left',
              width: '10%',
              fixed: 'right',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <div>
                  {permissionsData[EDIT]}
                  {permissionsData[DELETE]}
                  {permissionsData[EDIT] && (
                    <Tooltip title="编辑">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => {
                          return this.openEditModal(record, DeviceType.Raspberry, ModalStatus.Edit);
                        }}
                      >
                        <img src={edit} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[DELETE] && (
                    <Tooltip title="删除">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.deleteDeviceItem(record)}
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                </div>
              ),
            },
          ],
        });
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  // 打开新增/编辑/查看弹窗
  private openEditModal = async (
    item: DeviceRecordDataConfig,
    deviceType: DeviceType,
    modalStatus?: ModalStatus,
  ): Promise<void> => {
    const { getOrganization, getManagerDepartmentData } = this.deviceEditModalViewModel;
    const { setDeviceItemData } = this.viewModel;
    Promise.all([
      getOrganization(),
      await setDeviceItemData(
        item,
        deviceType,
        this.deviceEditModalViewModel,
        modalStatus,
        this.rootContainereViewModel,
      ),
      getManagerDepartmentData(),
    ]);
  };

  // 删除单项数据
  private deleteDeviceItem = async (item: DeviceRecordDataConfig): Promise<void> => {
    const { deleteItemData, checkAdPlaying } = this.viewModel;
    const { getTabsList } = this.props;
    const deviceIdsList: string[] = [];
    deviceIdsList.push(String(item.id));
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: await checkAdPlaying(deviceIdsList),
      icon: undefined,
      // closable: true,
      onOk() {
        deleteItemData(item);
        getTabsList();
      },
    });
  };

  // 批量删除后 清空 selectedRowKeysList
  private initSelectedRowKeysList = async (): Promise<void> => {
    this.setState({ selectedRowKeysList: [] });
  };

  // 批量删除前 检查设备是否有播放中的广告
  private beforeBatchDel = async (selectedRowKeysList: React.Key[]): Promise<void> => {
    const { checkAdPlaying, batchDelete } = this.viewModel;
    const { getTabsList } = this.props;
    const { initSelectedRowKeysList } = this;
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: await checkAdPlaying(selectedRowKeysList),
      icon: undefined,
      // closable: true,
      async onOk() {
        Promise.all([
          await batchDelete(selectedRowKeysList),
          await initSelectedRowKeysList(),
          await getTabsList(),
        ]);
      },
    });
  };

  render(): JSX.Element {
    const { unitIds, storeIds } = this.props;
    const { deviceListColumn, selectedRowKeysList } = this.state;
    const {
      deviceListColumnDataSource,
      pageChange,
      getDeviceListParams,
      deviceListData,
      selectStatus,
      searchByDeviceName,
      statusListData,
      permissionsData,
    } = this.viewModel;
    const { RASPBERRY_PIE, RASPBERRY_DEL } = DEVICE_LIST;

    const stautsListItem = statusListData.map((item, index) => {
      return (
        <Select.Option key={`status_${index}`} value={item.value || ''}>
          {item.meaning}
        </Select.Option>
      );
    });

    return (
      <div className={style.raspberryMachineContainer}>
        <Row className={style.operateWrapper}>
          <Col>
            <Space>
              <Select
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
                bordered={false}
                defaultValue="all"
                style={{ width: 120 }}
                onChange={(e: string): void => selectStatus(e)}
              >
                <Select.Option value="all">全部状态</Select.Option>
                {stautsListItem}
              </Select>
              <Form
                onFinish={(e): void => searchByDeviceName(e.name, unitIds, storeIds)}
                ref={this.formRefCheck}
              >
                <Row>
                  <Form.Item name="name" style={{ marginBottom: 0 }}>
                    <Input placeholder="设备名称" style={{ width: '240px' }} />
                  </Form.Item>
                  <Button
                    // style={{ margin: '0 8px' }}
                    className={style.operateResetBtn}
                    onClick={(): void => this.formRefCheck.current?.resetFields()}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Row>
              </Form>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderTop: '1px solid #f1f4f7' }} />
        <Row>
          <Col>
            <Space className={style.buttonsContainer}>
              {permissionsData[RASPBERRY_PIE] && (
                <Button
                  onClick={(): Promise<void> => {
                    return this.openEditModal({}, DeviceType.Raspberry, ModalStatus.Creat);
                  }}
                  type="primary"
                  icon={<img src={addIcon} alt="" className={style.buttonIconStyle} />}
                >
                  新增树莓派
                </Button>
              )}
              {permissionsData[RASPBERRY_DEL] && (
                <Button
                  onClick={(): Promise<void> => this.beforeBatchDel(selectedRowKeysList)}
                  type="primary"
                  danger
                  disabled={!selectedRowKeysList.length}
                  ghost
                  icon={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <img
                      src={selectedRowKeysList.length ? deleteIcon : deleteDisableIcon}
                      alt=""
                      className={style.buttonIconStyle}
                    />
                  }
                >
                  批量删除
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        <Row className={style.tableWrapper}>
          <Table
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: deviceListData.totalElements || 0,
              pageSize: getDeviceListParams.size,
              current: getDeviceListParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              // eslint-disable-next-line max-len
              onChange: pageChange,
            }}
            rowSelection={{
              fixed: true,
              columnWidth: '50px',
              selectedRowKeys: selectedRowKeysList,
              onChange: this.onSelectChange,
              preserveSelectedRowKeys: true,
            }}
            scroll={deviceListColumnDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={deviceListColumn}
            dataSource={deviceListColumnDataSource}
          />
        </Row>
        <DeviceEditModal />
        {/* <DeviceDetailsModal /> */}
      </div>
    );
  }
}
