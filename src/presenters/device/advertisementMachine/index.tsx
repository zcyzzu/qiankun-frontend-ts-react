/*
 * @Author: zhangchenyang
 * @Date: 2021-11-24 13:00:56
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:32:53
 */
import React from 'react';
import { observer } from 'mobx-react';
import { reaction, runInAction } from 'mobx';
import { isEqual, uniqWith } from 'lodash';
import moment from 'moment';
import {
  Row,
  Dropdown,
  Button,
  Menu,
  Space,
  Col,
  Input,
  Table,
  Tooltip,
  Select,
  Popover,
  Modal,
  FormInstance,
  Form,
  Checkbox,
  TimePicker,
  Divider,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import DI from '../../../inversify.config';
import style from './style.less';
import AdvertisementMachineViewModel, { DeviceRecordDataConfig } from './viewModel';
import DeviceEditModal from '../deviceEditModal/index';
import DeviceEditModalViewModel from '../deviceEditModal/viewModel';
import DeviceDetailsModal from '../deviceDetailsModal/index';
import DeviceDetailsModalViewModel from '../deviceDetailsModal/viewModel';
import BatchEditModalViewModel from '../batchEditModal/viewModel';
import DeviceListViewModel from '../deviceList/viewModel';
import PlayPlanViewModel from '../deviceDetailsModal/playPlan/viewModel';
import BatchEditModal from '../batchEditModal';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import { DeviceType, ModalStatus } from '../../../common/config/commonConfig';

import screenShot from '../../../assets/images/device_screen_shot.svg';
import patrol from '../../../assets/images/device_patrol.svg';
import edit from '../../../assets/images/edit_icon.svg';
import deleteIcon from '../../../assets/images/delete_icon.svg';
import deleteUnCheckedIcon from '../../../assets/images/delete_unChecked_icon.svg';
import uploadIcon from '../../../assets/images/upload_icon.svg';
import exclamationUnCheckedIcon from '../../../assets/images/exclamation_unChecked_icon.svg';
import loadingUnCheckedIcon from '../../../assets/images/loading_unChecked_icon.svg';
import bootStartUnCheckedIcon from '../../../assets/images/bootStart_unChecked_icon.svg';
import bootEndUnCheckedIcon from '../../../assets/images/bootEnd_unChecked_icon.svg';
import exclamationIcon from '../../../assets/images/exclamation_icon.svg';
import loadingIcon from '../../../assets/images/loading_icon.svg';
import bootStartIcon from '../../../assets/images/bootStart_icon.svg';
import bootEndIcon from '../../../assets/images/bootEnd_icon.svg';
import settingIcon from '../../../assets/images/setting_icon.svg';
import batchIcon from '../../../assets/images/batch_ operation_icon.svg';
import arrowDown from '../../../assets/images/arrow_down_blue_icon.svg';
import groupConfiguration from '../../../assets/images/group_ configuration_icon.svg';
import markIcon from '../../../assets/images/mark_icon.svg';
import timeSwitch from '../../../assets/images/timeSwitch.svg';
import timeSwitchDisable from '../../../assets/images/timeSwitchDisable.svg';
import datePickerRightIcon from '../../../assets/images/date_picker_right.svg';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import enableIcon from '../../../assets/images/enable_icon.svg';
import enableUnCheckedIcon from '../../../assets/images/enable_unChecked_icon.svg';
import timeTooips from '../../../assets/images/time_tooips.svg';
import ellipsisIcon from '../../../assets/images/ellipsis_icon.svg';
import downLogIcon from '../../../assets/images/down_log.svg';
import disabledUnCheckedIcon from '../../../assets/images/disabled_unChecked_icon.svg';
import disabledIcon from '../../../assets/images/disabled_icon.svg';
// import downLogUnCheckedIcon from '../../../assets/images/down_log_unChecked.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';

import { DEVICE_IDENTIFIER, ROOT_CONTAINER_IDENTIFIER } from '../../../constants/identifiers';

import PatrolModalViewModel from '../patrolModal/viewModel';
import PatrolModal from '../patrolModal/index';
import ScreenModalViewModel from '../screenModal/viewModel';
import ScreenModal from '../screenModal/index';
import GroupModalViewModel from '../groupModal/viewModel';
import GroupModal from '../groupModal/index';
import DownLogModalViewModel from '../downLogModal/viewModel';
import DownLogModal from '../downLogModal/index';
import RootContainereViewModel from '../../rootContainer/viewModel';

const { DEVICE_LIST } = PERMISSIONS_CODES;

interface AdvertisementMachineProps {
  deviceType: DeviceType;
  unitIds: number | undefined;
  storeIds: number | undefined;
  getTabsList(): void;
}

interface AdvertisementMachineState {
  // 广告机列表表格列头
  deviceListColumn: ColumnProps<DeviceRecordDataConfig>[];
  selectedRowKeysList: React.Key[];
  checkedList: CheckboxValueType[];
}

@observer
export default class AdvertisementMachine extends React.Component<
  AdvertisementMachineProps,
  AdvertisementMachineState
> {
  private viewModel = DI.DIContainer.get<AdvertisementMachineViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_VIEW_MODEL,
  );

  private deviceListViewModel = DI.DIContainer.get<DeviceListViewModel>(
    DEVICE_IDENTIFIER.DEVICE_LIST_VIEW_MODEL,
  );

  private patrolModalViewModel = DI.DIContainer.get<PatrolModalViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_PATROL_VIEW_MODEL,
  );

  private screenModalViewModel = DI.DIContainer.get<ScreenModalViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_SCREEN_VIEW_MODEL,
  );

  private groupModalViewModel = DI.DIContainer.get<GroupModalViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_GROUP_VIEW_MODEL,
  );

  private downLogModalViewModel = DI.DIContainer.get<DownLogModalViewModel>(
    DEVICE_IDENTIFIER.DOWN_LOG_MODAL_VIEW_MODEL,
  );

  private deviceEditModalViewModel = DI.DIContainer.get<DeviceEditModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_EDIT_MODEL_VIEW_MODEL,
  );

  private deviceDetailsModalViewModel = DI.DIContainer.get<DeviceDetailsModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_DETAILS_MODEL_VIEW_MODEL,
  );
  private batchEditModalViewModel = DI.DIContainer.get<BatchEditModalViewModel>(
    DEVICE_IDENTIFIER.BATCH_EDIT_MODAL_VIEW_MODEL,
  );

  private playPlanViewModel = DI.DIContainer.get<PlayPlanViewModel>(DEVICE_IDENTIFIER.PLAY_PLAN);

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();
  private formRefCheck = React.createRef<FormInstance>();

  constructor(props: AdvertisementMachineProps) {
    super(props);
    this.state = {
      deviceListColumn: [],
      selectedRowKeysList: [],
      checkedList: [],
    };
    reaction(
      () => this.props,
      (data) => {
        this.switchCurrentTabs(data.deviceType, data.unitIds, data.storeIds);
      },
    );
  }

  async componentDidMount(): Promise<void> {
    const { unitId, storeId } = this.deviceListViewModel;
    const { getLookupsValue } = this.viewModel;
    const { deviceType } = this.props;
    await this.getPermissonData();
    getLookupsValue(LookupsCodeTypes.DEVICE_FLOOR);
    getLookupsValue(LookupsCodeTypes.DEVICE_PAGE_STATUS);
    this.groupModalViewModel.getGroupList(unitId);
    this.switchCurrentTabs(deviceType, unitId, storeId);
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const {
      UPDATE,
      BATCH_DELETE,
      RESTART,
      BOOT,
      SHUTDOWN,
      SWITCH,
      GROUPING,
      SCREENSHOT,
      PATROL,
      EDIT,
      DELETE,
      SEE,
      EXPORT,
      ENABLE,
      DISABLE,
      DOWN_LOG,
      ENABLE_SINGLE,
      DISABLE_SINGLE,
      RESTART_SINGLE,
      SHUTDOWN_SINGLE,
      STARTUP_SINGLE,
    } = DEVICE_LIST;
    try {
      const permissionsData = await getPermissionsData([
        UPDATE,
        BATCH_DELETE,
        RESTART,
        BOOT,
        SHUTDOWN,
        SWITCH,
        GROUPING,
        SCREENSHOT,
        PATROL,
        EDIT,
        DELETE,
        SEE,
        EXPORT,
        ENABLE,
        DISABLE,
        DOWN_LOG,
        ENABLE_SINGLE,
        DISABLE_SINGLE,
        RESTART_SINGLE,
        SHUTDOWN_SINGLE,
        STARTUP_SINGLE,
      ]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  private switchCurrentTabs = async (
    deviceTypeProps: string,
    unitIds?: number,
    storeIds?: number,
  ): Promise<void> => {
    const {
      getDeviceList,
      initDeviceListParams,
      setSelectedRowItemData,
      permissionsData,
    } = this.viewModel;
    const {
      EDIT,
      SEE,
      DELETE,
      SCREENSHOT,
      PATROL,
      // UPDATE,
      // RESTART,
      // BOOT,
      // ENABLE,
      // SHUTDOWN,
      // DISABLE,
    } = DEVICE_LIST;
    const { deviceType, getTabsList } = this.props;

    setSelectedRowItemData([]);
    initDeviceListParams();
    this.formRef.current?.resetFields();
    this.formRefCheck.current?.resetFields();
    getTabsList();
    this.setEmpty();
    switch (deviceTypeProps) {
      case DeviceType.Advertisement:
        await getDeviceList(DeviceType.Advertisement, unitIds, storeIds);
        this.setState({
          selectedRowKeysList: [],
          deviceListColumn: [
            {
              title: '设备名称',
              key: 'name',
              align: 'left',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip placement="topLeft" title={record.name}>
                  <Button
                    type="link"
                    size="small"
                    className={style.columnContentShow}
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    onClick={() => {
                      return permissionsData[SEE] ? this.openCheckModal(record, deviceType) : null;
                    }}
                  >
                    {record.name}
                  </Button>
                </Tooltip>
              ),
              width: '15%',
            },
            {
              title: '所属门店/项目',
              dataIndex: 'storeName',
              key: 'storeName',
              align: 'left',
              width: '15%',
            },
            {
              title: '楼层',
              dataIndex: 'floor',
              key: 'floor',
              align: 'left',
              width: '10%',
            },
            {
              title: '设备分组',
              key: 'groupNameList',
              align: 'left',
              width: '25%',
              ellipsis: true,
              render: (value: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  title={
                    value.groupNameList && value.groupNameList.length > 0
                      ? value.groupNameList.toString().replace(/,/g, '/')
                      : null
                  }
                >
                  <div className={style.publish_device}>
                    {value.groupNameList?.length ? (
                      value.groupNameList.map((item, index) => {
                        return item ? (
                          <div className={style.storesType} key={index}>
                            {item}
                          </div>
                        ) : (
                          ''
                        );
                      })
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '设备状态',
              key: 'status',
              align: 'left',
              width: '20%',
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
              title: 'IP地址',
              dataIndex: 'ipAddress',
              key: 'ipAddress',
              align: 'left',
              width: '15%',
            },
            {
              title: '开关机时间',
              key: 'bootTime',
              align: 'left',
              width: '15%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  placement="topLeft"
                  title={`开机 - ${record.bootTime || '无'} / 关机 - ${record.shutdownTime ||
                    '无'}`}
                >
                  <div className={style.tdCenter}>
                    <span className={style.shutdownTime}>
                      开机 - {record.bootTime ? record.bootTime : '无'} / 关机 -{' '}
                      {record.shutdownTime ? record.shutdownTime : '无'}
                    </span>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '操作系统',
              dataIndex: 'os',
              key: 'os',
              align: 'left',
              width: '10%',
              render: (record): string => {
                return record || '- -';
              },
            },
            {
              title: '最后一次在线时间',
              dataIndex: 'lastOnlineTime',
              key: 'lastOnlineTime',
              align: 'left',
              width: '20%',
              render: (record): JSX.Element => (
                <div className={style.tdCenter}>
                  <span className={style.downTime}>{record || '- -'}</span>
                </div>
              ),
            },
            {
              title: '操作',
              key: 'action',
              align: 'left',
              fixed: 'right',
              width: '19%',
              // width: '200px',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <div>
                  {permissionsData[SCREENSHOT] && (
                    <Tooltip title="截屏">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openScreenShotModal(record)}
                      >
                        <img src={screenShot} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[PATROL] && (
                    <Tooltip title="巡查">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openPatrolModal(record, deviceType)}
                      >
                        <img src={patrol} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[EDIT] && (
                    <Tooltip title="编辑">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => {
                          return this.openEditModal(record, deviceType, ModalStatus.Edit);
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
                        onClick={(): Promise<void> => this.deleteDeviceItem(record, deviceType)}
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {this.generateDropdown(record)}
                </div>
              ),
            },
          ],
        });
        break;
      case DeviceType.Cashier:
        await getDeviceList(DeviceType.Cashier, unitIds, storeIds);
        this.setState({
          selectedRowKeysList: [],
          deviceListColumn: [
            {
              title: '点位品牌名称',
              key: 'pointBrandName',
              align: 'left',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip title={record.pointBrandName}>
                  <Button
                    type="link"
                    size="small"
                    className={style.columnContentShow}
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    onClick={() => {
                      return permissionsData[SEE] ? this.openCheckModal(record, deviceType) : null;
                    }}
                  >
                    {record.pointBrandName}
                  </Button>
                </Tooltip>
              ),
              width: '15%',
            },
            {
              title: '品牌业态',
              dataIndex: 'brandFormat',
              key: 'brandFormat',
              align: 'left',
              width: '10%',
            },
            {
              title: '所属门店/项目',
              dataIndex: 'storeName',
              key: 'storeName',
              align: 'left',
              width: '15%',
              render: (record): JSX.Element => (
                <Tooltip title={record}>
                  <span className={style.shutdownTime}>{record}</span>
                </Tooltip>
              ),
            },
            {
              title: '楼层',
              dataIndex: 'floor',
              key: 'floor',
              align: 'left',
              width: '10%',
            },
            {
              title: '设备分组',
              key: 'groupNameList',
              align: 'left',
              ellipsis: true,
              width: '26%',
              render: (value: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  title={
                    value.groupNameList && value.groupNameList.length > 0
                      ? value.groupNameList.toString().replace(/,/g, '/')
                      : null
                  }
                >
                  <div className={style.publish_device}>
                    {value.groupNameList?.length ? (
                      value.groupNameList.map((item, index) => {
                        return item ? (
                          <div className={style.storesType} key={index}>
                            {item}
                          </div>
                        ) : (
                          ''
                        );
                      })
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '设备状态',
              key: 'status',
              align: 'left',
              width: '20%',
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
              title: 'IP地址',
              dataIndex: 'ipAddress',
              key: 'ipAddress',
              align: 'left',
              width: '15%',
            },
            {
              title: '开关机时间',
              key: 'bootTime',
              align: 'left',
              width: '15%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  placement="topLeft"
                  title={`开机 - ${record.bootTime || '无'} / 关机 - ${record.shutdownTime ||
                    '无'}`}
                >
                  <div className={style.tdCenter}>
                    <span className={style.shutdownTime}>
                      开机 - {record.bootTime ? record.bootTime : '无'} / 关机 -{' '}
                      {record.shutdownTime ? record.shutdownTime : '无'}
                    </span>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '操作系统',
              dataIndex: 'os',
              key: 'os',
              align: 'left',
              width: '10%',
              render: (record): string => {
                return record || '- -';
              },
            },
            {
              title: '最后一次在线时间',
              dataIndex: 'lastOnlineTime',
              key: 'lastOnlineTime',
              align: 'left',
              width: '20%',
              render: (record): JSX.Element => (
                <div className={style.tdCenter}>
                  <span className={style.downTime}>{record}</span>
                </div>
              ),
            },
            {
              title: '操作',
              key: 'action',
              align: 'left',
              fixed: 'right',
              width: '20%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <div>
                  {permissionsData[SCREENSHOT] && (
                    <Tooltip title="截屏">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openScreenShotModal(record)}
                      >
                        <img src={screenShot} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[PATROL] && (
                    <Tooltip title="巡查">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openPatrolModal(record, deviceType)}
                      >
                        <img src={patrol} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[EDIT] && (
                    <Tooltip title="编辑">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => {
                          return this.openEditModal(record, deviceType, ModalStatus.Edit);
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
                        onClick={(): Promise<void> => this.deleteDeviceItem(record, deviceType)}
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {this.generateDropdown(record)}
                </div>
              ),
            },
          ],
        });
        break;
      case DeviceType.Led:
        await getDeviceList(DeviceType.Led, unitIds, storeIds);
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
                    return permissionsData[SEE] ? this.openCheckModal(record, deviceType) : null;
                  }}
                >
                  {record.name}
                </Button>
              ),
              width: '15%',
            },
            {
              title: '所属门店/项目',
              dataIndex: 'storeName',
              key: 'storeName',
              align: 'left',
              width: '15%',
            },
            {
              title: '楼层',
              dataIndex: 'floor',
              key: 'floor',
              align: 'left',
              width: '10%',
            },
            {
              title: '设备分组',
              key: 'groupNameList',
              align: 'left',
              ellipsis: true,
              width: '26%',
              render: (value: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  title={
                    value.groupNameList && value.groupNameList.length > 0
                      ? value.groupNameList.toString().replace(/,/g, '/')
                      : null
                  }
                >
                  <div className={style.publish_device}>
                    {value.groupNameList?.length ? (
                      value.groupNameList.map((item, index) => {
                        return item ? (
                          <div className={style.storesType} key={index}>
                            {item}
                          </div>
                        ) : (
                          ''
                        );
                      })
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '设备状态',
              key: 'status',
              align: 'left',
              width: '20%',
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
              title: 'IP地址',
              dataIndex: 'ipAddress',
              key: 'ipAddress',
              align: 'left',
              width: '15%',
            },
            {
              title: '开关机时间',
              key: 'bootTime',
              align: 'left',
              width: '15%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  placement="topLeft"
                  title={`开机 - ${record.bootTime || '无'} / 关机 - ${record.shutdownTime ||
                    '无'}`}
                >
                  <div className={style.tdCenter}>
                    <span className={style.shutdownTime}>
                      开机 - {record.bootTime ? record.bootTime : '无'} / 关机 -{' '}
                      {record.shutdownTime ? record.shutdownTime : '无'}
                    </span>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '操作系统',
              dataIndex: 'os',
              key: 'os',
              align: 'left',
              width: '10%',
              render: (record): string => {
                return record || '- -';
              },
            },
            {
              title: '最后一次在线时间',
              dataIndex: 'lastOnlineTime',
              key: 'lastOnlineTime',
              align: 'left',
              width: '20%',
              render: (record): JSX.Element => (
                <div className={style.tdCenter}>
                  <span className={style.downTime}>{record}</span>
                </div>
              ),
            },
            {
              title: '操作',
              key: 'action',
              align: 'left',
              fixed: 'right',
              width: '19%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <div>
                  {permissionsData[SCREENSHOT] && (
                    <Tooltip title="截屏">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openScreenShotModal(record)}
                      >
                        <img src={screenShot} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[PATROL] && (
                    <Tooltip title="巡查">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openPatrolModal(record, deviceType)}
                      >
                        <img src={patrol} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[EDIT] && (
                    <Tooltip title="编辑">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => {
                          return this.openEditModal(record, deviceType, ModalStatus.Edit);
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
                        onClick={(): Promise<void> => this.deleteDeviceItem(record, deviceType)}
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {this.generateDropdown(record)}
                </div>
              ),
            },
          ],
        });
        break;
      default:
        await getDeviceList(DeviceType.Advertisement, unitIds, storeIds);
        this.setState({
          selectedRowKeysList: [],
          deviceListColumn: [
            {
              title: '设备名称',
              key: 'name',
              align: 'left',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip placement="topLeft" title={record.name}>
                  <Button
                    type="link"
                    size="small"
                    className={style.columnContentShow}
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    onClick={() => {
                      return permissionsData[SEE] ? this.openCheckModal(record, deviceType) : null;
                    }}
                  >
                    {record.name}
                  </Button>
                </Tooltip>
              ),
              width: '15%',
            },
            {
              title: '所属门店/项目',
              dataIndex: 'storeName',
              key: 'storeName',
              align: 'left',
              width: '15%',
            },
            {
              title: '楼层',
              dataIndex: 'floor',
              key: 'floor',
              align: 'left',
              width: '10%',
            },
            {
              title: '设备分组',
              key: 'groupNameList',
              align: 'left',
              width: '25%',
              ellipsis: true,
              render: (value: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  title={
                    value.groupNameList && value.groupNameList.length > 0
                      ? value.groupNameList.toString().replace(/,/g, '/')
                      : null
                  }
                >
                  <div className={style.publish_device}>
                    {value.groupNameList?.length ? (
                      value.groupNameList.map((item, index) => {
                        return item ? (
                          <div className={style.storesType} key={index}>
                            {item}
                          </div>
                        ) : (
                          ''
                        );
                      })
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '设备状态',
              key: 'status',
              align: 'left',
              width: '20%',
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
              title: 'IP地址',
              dataIndex: 'ipAddress',
              key: 'ipAddress',
              align: 'left',
              width: '15%',
            },
            {
              title: '开关机时间',
              key: 'bootTime',
              align: 'left',
              width: '15%',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <Tooltip
                  placement="topLeft"
                  title={`开机 - ${record.bootTime || '无'} / 关机 - ${record.shutdownTime ||
                    '无'}`}
                >
                  <div className={style.tdCenter}>
                    <span className={style.shutdownTime}>
                      开机 - {record.bootTime ? record.bootTime : '无'} / 关机 -{' '}
                      {record.shutdownTime ? record.shutdownTime : '无'}
                    </span>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '操作系统',
              dataIndex: 'os',
              key: 'os',
              align: 'left',
              width: '10%',
              render: (record): string => {
                return record || '- -';
              },
            },
            {
              title: '最后一次在线时间',
              dataIndex: 'lastOnlineTime',
              key: 'lastOnlineTime',
              align: 'left',
              width: '20%',
              render: (record): JSX.Element => (
                <div className={style.tdCenter}>
                  <span className={style.shutdownTime}>{record}</span>
                </div>
              ),
            },
            {
              title: '操作',
              key: 'action',
              align: 'left',
              fixed: 'right',
              width: '19%',
              // width: '200px',
              render: (record: DeviceRecordDataConfig): JSX.Element => (
                <div>
                  {permissionsData[SCREENSHOT] && (
                    <Tooltip title="截屏">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openScreenShotModal(record)}
                      >
                        <img src={screenShot} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[PATROL] && (
                    <Tooltip title="巡查">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openPatrolModal(record, deviceType)}
                      >
                        <img src={patrol} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[EDIT] && (
                    <Tooltip title="编辑">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => {
                          return this.openEditModal(record, deviceType, ModalStatus.Edit);
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
                        onClick={(): Promise<void> => this.deleteDeviceItem(record, deviceType)}
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {this.generateDropdown(record)}
                </div>
              ),
            },
          ],
        });
        break;
    }
  };

  private generateDropdown = (record: DeviceRecordDataConfig): JSX.Element => {
    return (
      <Dropdown
        overlay={(): JSX.Element => {
          const { reboot, bootup, enableOrDisable, shutDown, permissionsData } = this.viewModel;
          const {
            DOWN_LOG,
            RESTART_SINGLE,
            STARTUP_SINGLE,
            ENABLE_SINGLE,
            SHUTDOWN_SINGLE,
            DISABLE_SINGLE,
          } = DEVICE_LIST;
          const { deviceType } = this.props;
          return (
            <Menu>
              {permissionsData[DOWN_LOG] && (
                <Menu.Item
                  key="1"
                  style={{ color: '#666' }}
                  icon={<img src={downLogIcon} alt="" className={style.buttonIconStyle} />}
                  onClick={(): void => {
                    this.downLogModalViewModel.getLogListData(record.id || 0).then(() => {
                      this.downLogModalViewModel.setDownLogModalVisible();
                    });
                  }}
                >
                  下载日志
                </Menu.Item>
              )}
              {permissionsData[RESTART_SINGLE] && (
                <Menu.Item
                  key="2"
                  disabled={!this.hasStartDeviceSingle(record)}
                  style={
                    this.hasStartDeviceSingle(record) ? { color: '#666' } : { color: '#b8bec7' }
                  }
                  icon={
                    this.hasStartDeviceSingle(record) ? (
                      <img src={loadingIcon} alt="" className={style.buttonIconStyle} />
                    ) : (
                      <img src={loadingUnCheckedIcon} alt="" className={style.buttonIconStyle} />
                    )
                  }
                  onClick={(): Promise<void> => reboot([`${record.id}`], deviceType, true)}
                >
                  一键重启
                </Menu.Item>
              )}
              {permissionsData[STARTUP_SINGLE] && (
                <Menu.Item
                  key="3"
                  disabled={!this.hasShutDownDeviceSingle(record)}
                  style={
                    this.hasShutDownDeviceSingle(record) ? { color: '#666' } : { color: '#b8bec7' }
                  }
                  icon={
                    this.hasShutDownDeviceSingle(record) ? (
                      <img src={bootStartIcon} alt="" className={style.buttonIconStyle} />
                    ) : (
                      <img src={bootStartUnCheckedIcon} alt="" className={style.buttonIconStyle} />
                    )
                  }
                  onClick={(): Promise<void> => bootup([`${record.id}`], deviceType, true)}
                >
                  一键开机
                </Menu.Item>
              )}
              {permissionsData[ENABLE_SINGLE] && (
                <Menu.Item
                  key="4"
                  disabled={record.status === '1'}
                  style={record.status === '0' ? { color: '#666' } : { color: '#b8bec7' }}
                  icon={
                    record.status === '0' ? (
                      <img src={enableIcon} alt="" className={style.buttonIconStyle} />
                    ) : (
                      <img src={enableUnCheckedIcon} alt="" className={style.buttonIconStyle} />
                    )
                  }
                  onClick={(): Promise<void> => {
                    return enableOrDisable([`${record.id}`], deviceType, true, true);
                  }}
                >
                  一键启用
                </Menu.Item>
              )}
              {permissionsData[SHUTDOWN_SINGLE] && (
                <Menu.Item
                  key="5"
                  disabled={!this.hasStartDeviceSingle(record)}
                  style={
                    this.hasStartDeviceSingle(record) ? { color: '#666' } : { color: '#b8bec7' }
                  }
                  icon={
                    this.hasStartDeviceSingle(record) ? (
                      <img src={bootEndIcon} alt="" className={style.buttonIconStyle} />
                    ) : (
                      <img src={bootEndUnCheckedIcon} alt="" className={style.buttonIconStyle} />
                    )
                  }
                  onClick={(): Promise<void> => shutDown([`${record.id}`], deviceType, true)}
                >
                  一键关机
                </Menu.Item>
              )}
              {permissionsData[DISABLE_SINGLE] && (
                <Menu.Item
                  key="6"
                  disabled={record.status === '0'}
                  style={record.status === '1' ? { color: '#666' } : { color: '#b8bec7' }}
                  icon={
                    record.status === '1' ? (
                      <img src={disabledIcon} alt="" className={style.buttonIconStyle} />
                    ) : (
                      <img src={disabledUnCheckedIcon} alt="" className={style.buttonIconStyle} />
                    )
                  }
                  onClick={(): Promise<void> => {
                    return enableOrDisable([`${record.id}`], deviceType, false, true);
                  }}
                >
                  一键禁用
                </Menu.Item>
              )}
            </Menu>
          );
        }}
      >
        <button type="button" className={style.opertionBtn} style={{ marginRight: 0 }}>
          <img src={ellipsisIcon} alt="" />
        </button>
      </Dropdown>
    );
  };

  // 列表项多选
  private onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: DeviceRecordDataConfig[],
  ): void => {
    const { setSelectedRowItemData } = this.viewModel;
    this.setState({ selectedRowKeysList: selectedRowKeys });
    setSelectedRowItemData(selectedRows);
  };

  // 打开截屏弹窗
  private openScreenShotModal = async (item: DeviceRecordDataConfig): Promise<void> => {
    this.screenModalViewModel.setScreenModalVisible(item.id, item.offOn);
  };

  // 打开巡查弹窗
  private openPatrolModal = async (
    item: DeviceRecordDataConfig,
    deviceType: DeviceType,
  ): Promise<void> => {
    this.patrolModalViewModel.setPatrolModalVisible(item.id, deviceType);
  };

  // 打开编辑弹窗
  private openEditModal = async (
    item: DeviceRecordDataConfig,
    deviceType: DeviceType,
    modalStatus: ModalStatus,
  ): Promise<void> => {
    const { setDeviceItemData } = this.viewModel;
    const { unitIds } = this.props;
    const {
      getLookupsValue,
      getOrganization,
      getStoreList,
      getGroupList,
      getManagerDepartmentData,
    } = this.deviceEditModalViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.SUPPORTEDFEATURE_CODE),
      getLookupsValue(LookupsCodeTypes.DEVICE_FLOOR),
      getLookupsValue(LookupsCodeTypes.DEVICE_RESOLUTION_TYPE),
      getLookupsValue(LookupsCodeTypes.DEVICE_BRAND_FORMAT),
      getGroupList(unitIds),
      getOrganization(),
      await setDeviceItemData(
        item,
        deviceType,
        this.deviceEditModalViewModel,
        modalStatus,
        this.rootContainereViewModel,
      ),
      getStoreList(),
      getManagerDepartmentData(),
    ]);
  };

  // 删除
  private deleteDeviceItem = async (
    item: DeviceRecordDataConfig,
    deviceType: DeviceType,
  ): Promise<void> => {
    const { getTabsList } = this.props;
    const { deleteItemData, checkAdPlaying } = this.viewModel;
    const deviceIdsList: string[] = [];
    deviceIdsList.push(String(item.id));
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: await checkAdPlaying(deviceIdsList),
      icon: undefined,
      // closable: true,
      onOk() {
        deleteItemData(item, deviceType);
        getTabsList();
      },
    });
  };

  // 打开分组配置弹窗
  private openGroupSettingModal = async (): Promise<void> => {
    const { deviceType } = this.props;
    this.groupModalViewModel.setGroupModalVisible(deviceType, this.deviceListViewModel);
  };

  // 打开查看弹窗
  private openCheckModal = async (
    item: DeviceRecordDataConfig,
    deviceType: DeviceType,
  ): Promise<void> => {
    const { setDeviceItemData } = this.viewModel;
    const { getLookupsValue, setDeviceDetailsVisible } = this.deviceDetailsModalViewModel;
    const { getPlayPlanData, playPlanGetLookupsValue } = this.playPlanViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.SUPPORTEDFEATURE_CODE),
      getLookupsValue(LookupsCodeTypes.AD_LEVEL_TYPE_CODE),
      getLookupsValue(LookupsCodeTypes.AD_PLAY_STATE_CODE),
      playPlanGetLookupsValue(LookupsCodeTypes.AD_CYCLE_TYPE_CODE),
      setDeviceItemData(item, deviceType),
      getPlayPlanData(item.id || 0),
    ]).then(() => {
      setDeviceDetailsVisible();
    });
  };

  // 单项选择
  private onChange = (list: CheckboxValueType[]): void => {
    const { deviceType } = this.props;
    const { setCheckedList } = this.viewModel;
    const groupIdList: number[] = [];
    this.groupModalViewModel.tagData &&
      this.groupModalViewModel.tagData.forEach((item) => {
        list.forEach((i) => {
          if (item.groupName === i) {
            groupIdList.push(item.id);
          }
        });
      });
    this.setState({ checkedList: list });
    setCheckedList(groupIdList, deviceType);
  };

  // 全选
  private setAll = (groupNameList: string[]): void => {
    const { deviceType } = this.props;
    const { setCheckedList } = this.viewModel;
    const groupIdList: number[] = [];
    this.groupModalViewModel.tagData &&
      this.groupModalViewModel.tagData.forEach((item) => {
        groupNameList.forEach((i) => {
          if (item.groupName === i) {
            groupIdList.push(item.id);
          }
        });
      });
    this.setState({ checkedList: groupNameList });
    setCheckedList(groupIdList, deviceType);
  };
  // 清空
  private setEmpty = (): void => {
    const { deviceType } = this.props;
    const { setCheckedList } = this.viewModel;
    this.setState({ checkedList: [] });
    setCheckedList([], deviceType);
  };

  // 批量删除后 清空 selectedRowKeysList
  private initSelectedRowKeysList = async (): Promise<void> => {
    const { setSelectedRowItemData } = this.viewModel;
    this.setState({ selectedRowKeysList: [] });
    setSelectedRowItemData([]);
  };

  private batchOperate = async (key: string): Promise<void> => {
    const {
      checkAdPlaying,
      deleteBatch,
      shutDown,
      bootup,
      reboot,
      enableOrDisable,
    } = this.viewModel;
    const { setBatchEditModalVisible } = this.batchEditModalViewModel;
    const { selectedRowKeysList } = this.state;
    const { deviceType } = this.props;
    const { initSelectedRowKeysList } = this;
    if (selectedRowKeysList.length) {
      switch (key) {
        case '1':
          setBatchEditModalVisible(true);
          break;
        case '2':
          reboot(selectedRowKeysList, deviceType, false);
          break;
        case '3':
          bootup(selectedRowKeysList, deviceType, false);
          break;
        case '4':
          enableOrDisable(selectedRowKeysList, deviceType, true, false);
          break;
        case '5':
          Modal.confirm({
            title: '删除',
            maskClosable: true,
            content: await checkAdPlaying(selectedRowKeysList),
            icon: undefined,
            // closable: true,
            async onOk() {
              Promise.all([
                deleteBatch(selectedRowKeysList, deviceType),
                initSelectedRowKeysList(),
              ]);
            },
          });
          break;
        case '6':
          shutDown(selectedRowKeysList, deviceType, false);
          break;
        case '7':
          enableOrDisable(selectedRowKeysList, deviceType, false, false);
          break;
        default:
          break;
      }
    }
  };

  private dealWithSwitchTime(): void {
    const { setBootTime, selectedRowItemData } = this.viewModel;
    setBootTime();
    const bootTimeFake: (string | undefined)[] = [];
    const shutdownTimeFake: (string | undefined)[] = [];
    for (let i = 0; i < selectedRowItemData.length; i += 1) {
      bootTimeFake.push(selectedRowItemData[i].bootTime);
      shutdownTimeFake.push(selectedRowItemData[i].shutdownTime);
    }
    if (
      uniqWith(bootTimeFake, isEqual).length === uniqWith(shutdownTimeFake, isEqual).length &&
      uniqWith(bootTimeFake, isEqual).length === 1
    ) {
      setBootTime([bootTimeFake[0] || '', shutdownTimeFake[0] || '']);
    } else {
      setBootTime();
    }
  }

  private timingSetting = async (key: string): Promise<void> => {
    const { setIssuedVisiblle, delTimingSwitch } = this.viewModel;
    const { selectedRowKeysList } = this.state;
    const { deviceType } = this.props;
    if (key === '1') {
      setIssuedVisiblle(true);
      this.dealWithSwitchTime();
    } else {
      Modal.confirm({
        title: '删除设置',
        maskClosable: true,
        content: '删除该设置会导致已设置的设备失效，确认删除?',
        icon: undefined,
        onOk() {
          delTimingSwitch(selectedRowKeysList as number[], deviceType);
        },
      });
    }
  };
  //批量开机 选中后 检测是否有关机的
  private hasShutDownDevice = (): boolean => {
    const { selectedRowItemData } = this.viewModel;
    if (selectedRowItemData.find((ele) => ele.offOn === 'OFF')) {
      return true;
    }
    return false;
  };

  //单项开机 选中后 检测是否有关机的
  private hasShutDownDeviceSingle = (record: DeviceRecordDataConfig): boolean => {
    if (record.offOn === 'OFF') {
      return true;
    }
    return false;
  };

  //批量启用 选中后 检测是否有禁用的
  private hasDisableDevice = (): boolean => {
    const { selectedRowItemData } = this.viewModel;
    if (selectedRowItemData.find((ele) => ele.status === '0')) {
      return true;
    }
    return false;
  };

  //批量禁用 选中后 检测是否有启用的
  private hasEnableDevice = (): boolean => {
    const { selectedRowItemData } = this.viewModel;
    if (selectedRowItemData.find((ele) => ele.status === '1')) {
      return true;
    }
    return false;
  };

  // 批量关机/重启 选中后 检测是否有开机的
  private hasStartDevice = (): boolean => {
    const { selectedRowItemData } = this.viewModel;
    if (selectedRowItemData.find((ele) => ele.offOn === 'ON')) {
      return true;
    }
    return false;
  };

  // 单项关机/重启 选中后 检测是否有开机的
  private hasStartDeviceSingle = (record: DeviceRecordDataConfig): boolean => {
    if (record.offOn === 'ON') {
      return true;
    }
    return false;
  };

  // 批量修改属性 检测是否是同一个组织
  private isSameUnit = (): boolean => {
    const { selectedRowItemData } = this.viewModel;
    if (selectedRowItemData.length > 0) {
      const { unitId } = selectedRowItemData[0];
      if (selectedRowItemData.find((ele) => ele.unitId !== unitId)) {
        return false;
      }
      return true;
    }
    return false;
  };

  render(): JSX.Element {
    const { deviceListColumn, selectedRowKeysList, checkedList } = this.state;
    const { deviceType, unitIds, storeIds } = this.props;
    const {
      deviceListColumnDataSource,
      getDeviceListParams,
      deviceListData,
      pageChange,
      selectStatus,
      selectFloor,
      exportDevice,
      searchByDeviceName,
      sizeChange,
      floorListData,
      statusListData,
      issuedVisiblle,
      setIssuedVisiblle,
      setBootTime,
      onTimingSwitchFinish,
      timingSwitchData,
      selectedRowItemData,
      permissionsData,
    } = this.viewModel;
    const {
      UPDATE,
      BATCH_DELETE,
      BOOT,
      RESTART,
      SHUTDOWN,
      EXPORT,
      SWITCH,
      GROUPING,
      ENABLE,
      DISABLE,
    } = DEVICE_LIST;

    const floorListItem = floorListData.map((item, index) => {
      return (
        <Select.Option key={`floor_${index}`} value={item.value || ''}>
          {item.meaning}
        </Select.Option>
      );
    });

    const stautsListItem = statusListData.map((item, index) => {
      return (
        <Select.Option key={`status_${index}`} value={item.value || ''}>
          {item.meaning}
        </Select.Option>
      );
    });

    const batchMenu = (
      <Menu onClick={({ key }): Promise<void> => this.batchOperate(key)}>
        {permissionsData[UPDATE] && (
          <Menu.Item
            key="1"
            disabled={!this.isSameUnit()}
            style={this.isSameUnit() ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              this.isSameUnit() ? (
                <img src={exclamationIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={exclamationUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量修改属性
          </Menu.Item>
        )}
        {permissionsData[RESTART] && (
          <Menu.Item
            key="2"
            disabled={!this.hasStartDevice()}
            style={this.hasStartDevice() ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              this.hasStartDevice() ? (
                <img src={loadingIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={loadingUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量重启
          </Menu.Item>
        )}
        {permissionsData[BOOT] && (
          <Menu.Item
            key="3"
            disabled={!this.hasShutDownDevice()}
            style={this.hasShutDownDevice() ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              this.hasShutDownDevice() ? (
                <img src={bootStartIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={bootStartUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量开机
          </Menu.Item>
        )}
        {permissionsData[ENABLE] && (
          <Menu.Item
            key="4"
            disabled={!this.hasDisableDevice()}
            style={this.hasDisableDevice() ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              selectedRowKeysList.length ? (
                <img src={enableIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={enableUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量启用
          </Menu.Item>
        )}
        {permissionsData[BATCH_DELETE] && (
          <Menu.Item
            key="5"
            disabled={!selectedRowKeysList.length}
            style={selectedRowKeysList.length ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              selectedRowKeysList.length ? (
                <img src={deleteIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={deleteUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量删除
          </Menu.Item>
        )}
        {permissionsData[SHUTDOWN] && (
          <Menu.Item
            key="6"
            disabled={!this.hasStartDevice()}
            style={this.hasStartDevice() ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              this.hasStartDevice() ? (
                <img src={bootEndIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={bootEndUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量关机
          </Menu.Item>
        )}
        {permissionsData[DISABLE] && (
          <Menu.Item
            key="7"
            disabled={!this.hasEnableDevice()}
            style={this.hasEnableDevice() ? { color: '#666' } : { color: '#b8bec7' }}
            icon={
              selectedRowKeysList.length ? (
                <img src={disabledIcon} alt="" className={style.buttonIconStyle} />
              ) : (
                <img src={disabledUnCheckedIcon} alt="" className={style.buttonIconStyle} />
              )
            }
          >
            批量禁用
          </Menu.Item>
        )}
      </Menu>
    );

    const timingMenu = (
      <Menu onClick={({ key }): Promise<void> => this.timingSetting(key)}>
        <Menu.Item
          key="1"
          disabled={!selectedRowKeysList.length}
          style={selectedRowKeysList.length ? { color: '#666' } : { color: '#b8bec7' }}
          icon={
            selectedRowKeysList.length ? (
              <img src={timeSwitch} alt="" className={style.buttonIconStyle} />
            ) : (
              <img src={timeSwitchDisable} alt="" className={style.buttonIconStyle} />
            )
          }
        >
          下发设置
        </Menu.Item>
        <Menu.Item
          key="2"
          disabled={!selectedRowKeysList.length}
          style={selectedRowKeysList.length ? { color: '#666' } : { color: '#b8bec7' }}
          icon={
            selectedRowKeysList.length ? (
              <img src={deleteIcon} alt="" className={style.buttonIconStyle} />
            ) : (
              <img src={deleteUnCheckedIcon} alt="" className={style.buttonIconStyle} />
            )
          }
        >
          删除设置
        </Menu.Item>
      </Menu>
    );
    const groupNameList: string[] = [];
    this.groupModalViewModel.tagData &&
      this.groupModalViewModel.tagData.forEach((item) => {
        groupNameList.push(item.groupName || '');
      });
    const content = (
      <div>
        <Checkbox.Group
          options={groupNameList}
          value={checkedList}
          onChange={(list): void => this.onChange(list)}
        />
      </div>
    );

    const groupFilterTitle = (): JSX.Element => (
      <div className={style.groupFilterTitleWrapper}>
        <div>当前已选: {getDeviceListParams.groupIdList?.split(',').length || 0}个</div>
        <div className={style.action}>
          <div className={style.all} onClick={(): void => this.setAll(groupNameList)}>
            全选
          </div>
          <div className={style.empty} onClick={this.setEmpty}>
            清空
          </div>
        </div>
      </div>
    );

    return (
      <div className={style.advertisementMachineContainer}>
        <Row className={style.operateWrapper}>
          <Col style={{ minWidth: '405px' }}>
            <Form ref={this.formRef}>
              <Space size={16}>
                <Form.Item name="status">
                  <Select
                    // suffixIcon={<img src={selectArrowIcon} alt="" />}
                    bordered={false}
                    defaultValue="全部状态"
                    style={{ width: 120 }}
                    onChange={(e: string): void => selectStatus(e, deviceType)}
                  >
                    {stautsListItem}
                  </Select>
                </Form.Item>
                <Form.Item name="floor">
                  <Select
                    // suffixIcon={<img src={selectArrowIcon} alt="" />}
                    bordered={false}
                    defaultValue="全部楼层"
                    style={{ width: 120 }}
                    onChange={(e: string): void => selectFloor(e, deviceType)}
                  >
                    {floorListItem}
                  </Select>
                </Form.Item>
                <div className={style.btnList}>
                  <Form.Item>
                    <Popover
                      placement="bottom"
                      title={groupFilterTitle}
                      content={content}
                      trigger="click"
                    >
                      <Button type="text">分组筛选</Button>
                    </Popover>
                  </Form.Item>
                  {permissionsData[GROUPING] && <span>|</span>}
                  {permissionsData[GROUPING] && (
                    <Tooltip title="分组配置">
                      <Button
                        size="small"
                        type="text"
                        className={style.groupBtn}
                        onClick={this.openGroupSettingModal}
                      >
                        <img src={groupConfiguration} alt="" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </Space>
            </Form>
          </Col>
          <Col style={{ minWidth: '350px' }} className={style.searchArea}>
            <Form
              onFinish={(e): void => searchByDeviceName(e.name, deviceType, unitIds, storeIds)}
              ref={this.formRefCheck}
            >
              <Row>
                <Form.Item name="name">
                  <Input
                    placeholder={deviceType === DeviceType.Cashier ? '点位品牌名称' : '设备名称'}
                    style={{ minWidth: '200px' }}
                  />
                </Form.Item>
                <div className={style.buttons}>
                  <Button
                    style={{ margin: '0 16px' }}
                    onClick={(): void => this.formRefCheck.current?.resetFields()}
                  >
                    重置
                  </Button>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </div>
              </Row>
            </Form>
          </Col>
        </Row>
        <Divider style={{ borderTop: '1px solid #f1f4f7' }} />
        <Row className={style.operateWrapper}>
          <Col>
            <Space className={style.buttonsContainer}>
              {permissionsData[EXPORT] && (
                <Button
                  onClick={(): void => exportDevice(selectedRowKeysList, deviceType)}
                  type="primary"
                  ghost
                  icon={<img src={uploadIcon} alt="" className={style.buttonIconStyle} />}
                >
                  设备导出
                </Button>
              )}
              {permissionsData[SWITCH] && (
                <Dropdown overlay={timingMenu} arrow placement="bottomCenter">
                  <Button type="primary" ghost>
                    <img src={settingIcon} alt="" className={style.buttonIconStyle} />
                    定时设置
                  </Button>
                </Dropdown>
              )}
              {permissionsData[UPDATE] ||
              permissionsData[BATCH_DELETE] ||
              permissionsData[BOOT] ||
              permissionsData[RESTART] ||
              permissionsData[SHUTDOWN] ? (
                <Dropdown overlay={batchMenu}>
                  <Button type="primary" ghost>
                    <img src={batchIcon} alt="" className={style.buttonIconStyle} />
                    批量操作
                    <img src={arrowDown} alt="" className={style.buttonIconRightStyle} />
                  </Button>
                </Dropdown>
              ) : null}
            </Space>
            <Tooltip placement="top" title="开机、关机、重启功能仅限于Windows系统">
              <img src={timeTooips} alt="" />
            </Tooltip>
          </Col>
        </Row>
        <div className={style.tableWrapper}>
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
              onChange: (page: number, pageSize?: number): void => {
                pageChange(page, pageSize, deviceType);
              },
              // eslint-disable-next-line max-len
              onShowSizeChange: (current: number, size: number): void => {
                sizeChange(current, size, deviceType);
              },
            }}
            rowSelection={{
              fixed: true,
              columnWidth: '50px',
              onChange: this.onSelectChange,
              selectedRowKeys: selectedRowKeysList,
              preserveSelectedRowKeys: true,
            }}
            scroll={deviceListColumnDataSource.length === 0 ? { x: 0 } : { x: 1900 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={deviceListColumn}
            dataSource={deviceListColumnDataSource}
          />
        </div>
        <PatrolModal />
        <ScreenModal />
        <GroupModal />
        <DownLogModal />
        <DeviceEditModal unitIds={unitIds} />
        <DeviceDetailsModal />
        <BatchEditModal
          selectedRowItemData={selectedRowItemData}
          selectedRowKeysList={selectedRowKeysList}
          deviceType={deviceType}
        />
        <Modal
          visible={issuedVisiblle}
          width={520}
          closable={false}
          footer={null}
          wrapClassName={style.imagePreviewContainer}
          destroyOnClose
          onCancel={(): void => setIssuedVisiblle(false)}
        >
          <div className={style.timingContent}>
            <div className={style.modalHeader}>
              设备定时开关机设置
              <Button type="text" onClick={(): void => setIssuedVisiblle(false)}>
                <img src={closeIcon} alt="" />
              </Button>
            </div>
            <div className={style.timingSwitch}>
              <span style={{ color: '#f5222d' }}>*</span>
              <span>每天开关机时间</span>
              <Tooltip title="仅支持windows设备">
                <img src={markIcon} alt="" className={style.buttonIconStyleWaning} />
              </Tooltip>
              <TimePicker.RangePicker
                style={{ width: '320px' }}
                suffixIcon={<img src={datePickerRightIcon} alt="" />}
                defaultValue={[
                  timingSwitchData.bootTime ? moment(timingSwitchData.bootTime, 'HH:mm:ss') : null,
                  timingSwitchData.shutdownTime
                    ? moment(timingSwitchData.shutdownTime, 'HH:mm:ss')
                    : null,
                ]}
                onChange={(values, dateString: string[]): void => {
                  return setBootTime(dateString);
                }}
              />
            </div>
            <div className={style.bottomButton}>
              <Button onClick={(): void => setIssuedVisiblle(false)}>取消</Button>
              <Button
                type="primary"
                onClick={(): void => onTimingSwitchFinish(selectedRowKeysList, deviceType)}
              >
                确认
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
