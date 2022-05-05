/* eslint-disable prefer-const */
/*
 * @Author: mayajing
 * @Date: 2021-11-22 14:26:22
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:17:43
 */
import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { FormInstance } from 'antd/lib/form';
import { ColumnProps } from 'antd/lib/table';
import { Table, Select, Button, Form, Row, Input, Tooltip, Modal, Col } from 'antd';
import style from './style.less';
import utils from '../../../../utils/index';
import AddIcon from '../../../../assets/images/project_icon_add.svg';

import {
  NOTICE_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  APPROVE_IDENTIFIER,
} from '../../../../constants/identifiers';
import DI from '../../../../inversify.config';
import NoticeListViewModel, { NoticeListDataConfig } from './viewModel';
import CreateNoticeModalViewModel from '../creatNoticeModal/viewModel';
import CreateNoticeModal from '../creatNoticeModal/index';

import NoticeDetailsModal from '../../../publish/notice/noticeDetailsModal/index';
import NoticeDetailsModalViewModel from '../../../publish/notice/noticeDetailsModal/viewModel';
import NoticeDetailsTabViewModel from '../../../publish/notice/noticeDetailsModal/noticeDetailsTab/viewModel';
import AuditProgressViewModel from '../../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import { DeviceType, ModalStatus } from '../../../../common/config/commonConfig';
import { DeviceStatus } from '../../../approve/advertisementApproveList/viewModel';
import PERMISSIONS_CODES from '../../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';

import userlistDelIfo from '../../../../assets/images/del_info_icon.svg';
import approveProgressIcon from '../../../../assets/images/approve_progress_icon.svg';

interface NoticeListProps {}
interface NoticeListState {
  noticeListColumns: ColumnProps<NoticeListDataConfig>[];
}
const { NOTICE } = PERMISSIONS_CODES;

@observer
export default class NoticeList extends React.Component<NoticeListProps, NoticeListState> {
  private viewModel = DI.DIContainer.get<NoticeListViewModel>(
    NOTICE_IDENTIFIER.NOTICE_LIST_VIEW_MODEL,
  );

  private createNoticeModalViewModel = DI.DIContainer.get<CreateNoticeModalViewModel>(
    NOTICE_IDENTIFIER.CREATE_NOTICE_MODAL_VIEW_MODEL,
  );

  private noticeDetailsModalViewModel = DI.DIContainer.get<NoticeDetailsModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.NOTICE_DETAILS_MODEL_VIEW_MODEL,
  );

  private noticeDetailsTabViewModel = DI.DIContainer.get<NoticeDetailsTabViewModel>(
    ADVERTISEMENT_IDENTIFIER.NOTICE_DETAILS_TAB_VIEW_MODEL,
  );

  private auditProgressViewModel = DI.DIContainer.get<AuditProgressViewModel>(
    APPROVE_IDENTIFIER.AUDIT_PROGRESS_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();

  constructor(props: NoticeListProps) {
    super(props);
    this.state = {
      noticeListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getNoticeList, getStoresList, getStatus } = this.viewModel;
    await this.getPermissonData();
    getNoticeList();
    getStoresList();
    getStatus();
    this.getNoticeData();
    const query = window.location.search; // '?adId=1&taskActorId=1'
    if (query) {
      const successCount = query.substring(4);
      if (successCount) {
        this.openNoticeDetails({ id: Number(successCount) });
      }
    }
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { PUBLISH, EDIT, DELETE, SEE, DETAILS } = NOTICE;
    try {
      const permissionsData = await getPermissionsData([PUBLISH, EDIT, DELETE, SEE, DETAILS]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  private publishNotice = (): void => {
    const { setCreateNoticeModalVisible } = this.createNoticeModalViewModel;
    setCreateNoticeModalVisible(true);
  };

  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };

  // 删除列表单条数据
  private deleteNotice(record: NoticeListDataConfig): void {
    const { viewModel } = this;
    Modal.confirm({
      title: '删除通知',
      maskClosable: true,
      content: '删除通知将失效并无法恢复，确认删除?',
      icon: undefined,
      onOk() {
        viewModel.deleteNotice(record);
      },
    });
  }
  //通知状态
  private getNoticeStatus = (status: string): JSX.Element => {
    switch (status) {
      case DeviceStatus.Pending:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(255, 146, 48, 0.1)', color: '#FF9230' }}
          >
            <b className={style.openStatus} style={{ background: '#FF9230' }} />
            待审批
          </div>
        );
      case DeviceStatus.Approval:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(64, 150, 255, 0.1)', color: '#4096FF' }}
          >
            <b className={style.openStatus} style={{ background: '#4096FF' }} />
            审批中
          </div>
        );
      case DeviceStatus.Passed:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(0, 203, 148, 0.1)', color: '#00CB94' }}
          >
            <b className={style.openStatus} style={{ background: '#00CB94' }} />
            已生效
          </div>
        );

      case DeviceStatus.Rejected:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(102, 102, 102, 0.1)', color: '#666666' }}
          >
            <b className={style.openStatus} style={{ background: '#666666' }} />
            已驳回
          </div>
        );
      case DeviceStatus.Expired:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(102, 102, 102, 0.1)', color: '#666666' }}
          >
            <b className={style.openStatus} style={{ background: '#666666' }} />
            已过期
          </div>
        );
      default:
        return <span>--</span>;
    }
  };

  private deviceListTooltip = (record: NoticeListDataConfig): string => {
    if (record.deviceList) {
      let tooltip: any;
      tooltip = [];
      record.deviceList.forEach((item) => {
        item.deviceName ? tooltip.push(item.deviceName) : '';
      });
      return tooltip.join('/');
    }
    return '';
  };
  // 构造列表结构
  private getNoticeData = (): void => {
    const { permissionsData } = this.viewModel;
    const { DELETE, SEE, DETAILS } = NOTICE;
    this.setState({
      noticeListColumns: [
        {
          title: '通知内容',
          key: 'content',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (record: NoticeListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.content}>
              <Button
                type="link"
                className={style.columnContentShow}
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                onClick={() => {
                  return permissionsData[SEE] ? this.openNoticeDetails(record) : null;
                }}
              >
                {record.content}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '展示时长',
          dataIndex: 'duration',
          key: 'duration',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{utils.transferTime(Number(value))}</>,
        },
        {
          title: '通知设备',
          key: 'deviceList',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: NoticeListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.deviceListTooltip(record)}>
              <div className={style.publish_device}>
                {record.deviceList && record.deviceList.length > 0
                  ? record.deviceList.map((item, index) => {
                      return item.deviceName ? (
                        <span className={style.storesType} key={index}>
                          {item.deviceName}
                        </span>
                      ) : (
                        '--'
                      );
                    })
                  : '--'}
              </div>
            </Tooltip>
          ),
        },
        {
          title: '设备总数',
          dataIndex: 'number',
          key: 'number',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{value}台</>,
        },
        {
          title: '通知状态',
          dataIndex: 'approveStatus',
          key: 'approveStatus',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{this.getNoticeStatus(value)}</>,
        },
        {
          title: '最新发布时间',
          dataIndex: 'creationDate',
          key: 'creationDate',
          align: 'left',
          width: '15%',
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '6%',
          render: (record: NoticeListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>
              {record.approveStatus === DeviceStatus.Pending ||
              record.approveStatus === DeviceStatus.Expired ? (
                <>
                  {permissionsData[DETAILS] && (
                    <Tooltip title="审批进度">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openNoticeDetails(record, 'approve')}
                      >
                        <img src={approveProgressIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                  {permissionsData[DELETE] && (
                    <Tooltip title="删除">
                      <button
                        type="button"
                        style={{ marginRight: 0 }}
                        className={style.opertionBtn}
                        onClick={(): void => this.deleteNotice(record)}
                      >
                        <img src={userlistDelIfo} alt="" />
                      </button>
                    </Tooltip>
                  )}
                </>
              ) : (
                <>
                  {permissionsData[DETAILS] && (
                    <Tooltip title="审批进度">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openNoticeDetails(record, 'approve')}
                      >
                        <img src={approveProgressIcon} alt="" />
                      </button>
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          ),
        },
      ],
    });
  };

  // 获取通知详情数据
  public openNoticeDetails = async (
    record: NoticeListDataConfig,
    tabType?: string,
  ): Promise<void> => {
    const {
      getDeviceDetailsListData,
      getListDataNum,
      getNoticeDetailsData,
      getLookupsValue,
    } = this.noticeDetailsTabViewModel;
    const { getApproveProgressData } = this.auditProgressViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.TEXT_POSITION_TYPE),
      getLookupsValue(LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE),
      getNoticeDetailsData(record.id || 0),
      getListDataNum(record.id || 0, DeviceType.Advertisement),
      getListDataNum(record.id || 0, DeviceType.Cashier),
      getListDataNum(record.id || 0, DeviceType.Led),
      getDeviceDetailsListData(record.id || 0, DeviceType.Advertisement),
      getApproveProgressData('NOTICE', record.id || 0, record.content || ''),
    ]).then(() => {
      if (tabType === 'approve') {
        this.noticeDetailsModalViewModel.setNoticeDetailsVisible('2');
      } else {
        this.noticeDetailsModalViewModel.setNoticeDetailsVisible();
      }
    });
  };

  public render(): JSX.Element {
    const {
      noticeListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      noticeListData,
      storesListData,
      statusData,
      selectStatus,
      selectStores,
      onFinish,
      permissionsData,
    } = this.viewModel;
    const { noticeListColumns } = this.state;
    const { PUBLISH } = NOTICE;

    return (
      <div className={style.mainContainer}>
        <div className={style.noticeListrootContainer}>
          <Row className={style.searchArea}>
            <Col style={{ marginRight: '16px' }}>
              <Select
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
                bordered={false}
                defaultValue="all"
                onChange={(e: string): void => selectStatus(e)}
              >
                <Select.Option value="all">全部状态</Select.Option>
                {statusData &&
                  statusData.map((item, index) => (
                    <Select.Option value={item.value || ''} key={index}>
                      {item.meaning}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col style={{ minWidth: '106px', marginRight: '16px' }}>
              <Select
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
                bordered={false}
                defaultValue="all"
                onChange={(e: string): void => selectStores(e)}
              >
                <Select.Option value="all">全部项目/门店</Select.Option>
                {storesListData &&
                  storesListData.map((item) => (
                    <Select.Option value={item.id || ''} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col>
              <Form className={style.listTopSearch_left} ref={this.formRef} onFinish={onFinish}>
                <Row>
                  <Col style={{ minWidth: '200px', marginRight: '16px' }}>
                    <Form.Item name="content">
                      <Input placeholder="通知内容" />
                    </Form.Item>
                  </Col>
                  <Col style={{ minWidth: '200px', marginRight: '16px' }}>
                    <Form.Item name="name">
                      <Input placeholder="设备名称" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <div className={style.buttons}>
                      <Button onClick={this.resetForm}>重置</Button>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <div className={style.buttonsContainer}>
            {permissionsData[PUBLISH] && (
              <Button
                type="primary"
                onClick={(): Promise<void> => this.openCreateNoticeModal(ModalStatus.Creat)}
              >
                <img src={AddIcon} alt="" />
                <span>发布紧急通知</span>
              </Button>
            )}
          </div>
          <Table<NoticeListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: noticeListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={noticeListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={noticeListColumns}
            dataSource={noticeListDataSource}
          />
          <CreateNoticeModal />
          <NoticeDetailsModal />
        </div>
      </div>
    );
  }

  private openCreateNoticeModal = async (
    modalType: string,
    record?: NoticeListDataConfig,
  ): Promise<void> => {
    const { getCheckDevice } = this.viewModel;
    const {
      getAdvertisingList,
      setCreateNoticeModalVisible,
      getNoticeDetailsData,
      getEditDeviceList,
      getLookupsValue,
    } = this.createNoticeModalViewModel;
    await getCheckDevice().then((res) => {
      if (res) {
        getLookupsValue(LookupsCodeTypes.TEXT_SIZE_TYPE);
        getLookupsValue(LookupsCodeTypes.TEXT_POSITION_TYPE);
        getLookupsValue(LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE);
        if (modalType === ModalStatus.Creat) {
          getAdvertisingList();
          setCreateNoticeModalVisible(true, ModalStatus.Creat);
        }
        if (modalType === ModalStatus.Edit) {
          getEditDeviceList('ADMACHINE', record?.id || 0);
          getNoticeDetailsData(record?.id || 0);
          setCreateNoticeModalVisible(true, ModalStatus.Edit);
        }
      }
    });
  };
}
