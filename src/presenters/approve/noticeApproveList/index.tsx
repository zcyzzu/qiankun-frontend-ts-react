/*
 * @Author: mayajing
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 14:15:20
 */
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Table, Select, Form, Row, Input, Tooltip, Button, Col, Switch } from 'antd';
import style from './style.less';

import utils from '../../../utils/index';
import { APPROVE_IDENTIFIER, ADVERTISEMENT_IDENTIFIER } from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import NoticeApproveListViewModel, { NoticeApproveListDataConfig } from './viewModel';
import NoticeApproveModal from '../../approve/noticeApproveModal/index';
import NoticeApproveModalViewModel from '../../approve/noticeApproveModal/viewModel';
import NoticeDetailsModal from '../../publish/notice/noticeDetailsModal/index';
import NoticeDetailsModalViewModel from '../../publish/notice/noticeDetailsModal/viewModel';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import NoticeDetailsTabViewModel from '../../publish/notice/noticeDetailsModal/noticeDetailsTab/viewModel';
import AuditProgressViewModel from '../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import approvelIcon from '../../../assets/images/approve_icon.svg';
import approveProgressIcon from '../../../assets/images/approve_progress_icon.svg';
import { DeviceStatus } from '../advertisementApproveList/viewModel';
import { DeviceType } from '../../../common/config/commonConfig';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

interface NoticeApproveListProps {}
interface NoticeApproveListState {
  // 广告表格列
  noticeApproveListColumns: ColumnProps<NoticeApproveListDataConfig>[];
}

const { NOTICE_APPROVE } = PERMISSIONS_CODES;

@observer
export default class NoticeApproveList extends React.Component<
  NoticeApproveListProps,
  NoticeApproveListState
> {
  private viewModel = DI.DIContainer.get<NoticeApproveListViewModel>(
    APPROVE_IDENTIFIER.NOTICE_APPROVE_LIST_VIEW_MODEL,
  );

  private noticeApproveModalViewModel = DI.DIContainer.get<NoticeApproveModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_NOTICE_APPROVE_VIEW_MODEL,
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

  constructor(props: NoticeApproveListProps) {
    super(props);
    this.state = {
      noticeApproveListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getNoticeApproveList, getStatus } = this.viewModel;
    await this.getPermissonData();
    getNoticeApproveList();
    getStatus();
    this.getNoticeApproveData();
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };
  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { SEE, OPERATION } = NOTICE_APPROVE;
    try {
      const permissionsData = await getPermissionsData([SEE, OPERATION]);
      runInAction(() => {
        setPermissionsData(permissionsData);
        this.getNoticeApproveData();
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  //发布状态
  private getNoticeApproveStatus = (status: string): JSX.Element => {
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
            已完成
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
  // 构造列表结构
  private getNoticeApproveData = (): void => {
    const { permissionsData } = this.viewModel;
    const { OPERATION, SEE } = NOTICE_APPROVE;
    this.setState({
      noticeApproveListColumns: [
        {
          title: '通知内容',
          key: 'content',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (record: NoticeApproveListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.content}>
              <Button
                type="link"
                className={style.columnContentShow}
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                onClick={() => {
                  return permissionsData[SEE] ? this.getNoticeDetails(record) : null;
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
          width: '25%',
          ellipsis: true,
          render: (record: NoticeApproveListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.deviceList?.join('/')}>
              <div className={style.publish_device}>
                {record.deviceList && record.deviceList.length > 0
                  ? record.deviceList.map((item, index) => {
                      return item ? (
                        <div className={style.storesType} key={index}>
                          {item}
                        </div>
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
          title: '审批状态',
          dataIndex: 'approveStatus',
          key: 'approveStatus',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{this.getNoticeApproveStatus(value)}</>,
        },
        {
          title: '申请人',
          dataIndex: 'username',
          key: 'username',
          align: 'left',
          width: '10%',
        },
        {
          title: '申请时间',
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
          render: (record: NoticeApproveListDataConfig): JSX.Element => (
            <>
              {permissionsData[OPERATION] && (
                <div className={style.operatorContainer}>
                  {record.approveFlag ? (
                    <Tooltip title="审批">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.onApprove(record)}
                      >
                        <img src={approvelIcon} alt="" />
                      </button>
                    </Tooltip>
                  ) : (
                    ''
                  )}
                  <Tooltip title="审批进度">
                    <button
                      type="button"
                      style={{ marginRight: 0 }}
                      className={style.opertionBtn}
                      onClick={(): Promise<void> => this.getNoticeDetails(record, 'approve')}
                    >
                      <img src={approveProgressIcon} alt="" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </>
          ),
        },
      ],
    });
  };

  // TODO
  public getCurrentSelected = (e: OrganizationListEntity): void => {
    console.log(e);
  };

  // 获取通知详情数据
  public getNoticeDetails = async (
    record: NoticeApproveListDataConfig,
    tabType?: string,
  ): Promise<void> => {
    const {
      getDeviceDetailsListData,
      getNoticeDetailsData,
      getListDataNum,
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

  // 审批按钮事件
  private onApprove = async (record: NoticeApproveListDataConfig): Promise<void> => {
    const {
      setNoticeApproveModalVisible,
      getDeviceListData,
      getDeviceListNum,
      getNoticeDetailsData,
      getLookupsValue,
    } = this.noticeApproveModalViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.TEXT_POSITION_TYPE),
      getLookupsValue(LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE),
      getNoticeDetailsData(record.id || 0, record.taskActorId),
      getDeviceListNum(record.id || 0, DeviceType.Advertisement),
      getDeviceListNum(record.id || 0, DeviceType.Cashier),
      getDeviceListNum(record.id || 0, DeviceType.Led),
      getDeviceListData(record.id || 0, DeviceType.Advertisement),
    ]).then(() => {
      setNoticeApproveModalVisible();
    });
  };

  public render(): JSX.Element {
    const {
      noticeApproveListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      noticeApproveListData,
      statusData,
      selectStatus,
      onFinish,
      getApproveList,
    } = this.viewModel;
    const { noticeApproveListColumns } = this.state;

    return (
      <div className={style.mainContainer}>
        <div className={style.noticeApproveListrootContainer}>
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
            <Col>
              <Form className={style.listTopSearch_left} ref={this.formRef} onFinish={onFinish}>
                <Row gutter={12}>
                  <Col style={{ minWidth: '200px', marginRight: '16px' }}>
                    <Form.Item name="content">
                      <Input placeholder="通知内容" />
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
            <Col className={style.listTopSearch_right}>
              <Switch
                size="small"
                defaultChecked={false}
                style={{ marginRight: '8px' }}
                onChange={(checked: boolean): void => getApproveList(checked)}
              />
              <span>只显示自己需审批的紧急通知</span>
            </Col>
          </Row>
          <Table<NoticeApproveListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: noticeApproveListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={noticeApproveListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={noticeApproveListColumns}
            dataSource={noticeApproveListDataSource}
          />
          <NoticeApproveModal />
          <NoticeDetailsModal />
        </div>
      </div>
    );
  }
}
