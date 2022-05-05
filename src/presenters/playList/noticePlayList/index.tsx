/* eslint-disable radix */
/*
 * @Author: mayajing
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:17:54
 */
import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { FormInstance } from 'antd/lib/form';
import { ColumnProps } from 'antd/lib/table';
import { Table, Select, Form, Row, Input, Tooltip, Col, Button, Modal, Statistic } from 'antd';
import style from './style.less';
import {
  PLAY_LIST_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  APPROVE_IDENTIFIER,
} from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import NoticePlayListViewModel, { NoticePlayListDataConfig } from './viewModel';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import NoticeDetailsModal from '../../publish/notice/noticeDetailsModal/index';
import NoticeDetailsModalViewModel from '../../publish/notice/noticeDetailsModal/viewModel';
import NoticeDetailsTabViewModel from '../../publish/notice/noticeDetailsModal/noticeDetailsTab/viewModel';
import AuditProgressViewModel from '../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import OperationLogViewModel from '../../publish/advertisement/advertisementDetailsModal/operationLog/viewModel';
import { PlayStatus } from '../advertisementPlayList/viewModel';
import TextAreaModal from '../../../common/components/textAreaModal/index';
import { DeviceType } from '../../../common/config/commonConfig';

import utils from '../../../utils/index';
import userlistDelIfo from '../../../assets/images/del_info_icon.svg';
import plauseIcon from '../../../assets/images/adverise_plause_icon.svg';
import playIcon from '../../../assets/images/adverise_play_icon.svg';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

const { NOTICE_LIST } = PERMISSIONS_CODES;
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';

interface NoticePlayListProps {}
interface NoticePlayListState {
  // 广告表格列
  noticePlayListColumns: ColumnProps<NoticePlayListDataConfig>[];
}

@observer
export default class NoticePlayList extends React.Component<
  NoticePlayListProps,
  NoticePlayListState
> {
  private viewModel = DI.DIContainer.get<NoticePlayListViewModel>(
    PLAY_LIST_IDENTIFIER.NOTICE_PLAY_LIST_VIEW_MODEL,
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

  private operationLogViewModel = DI.DIContainer.get<OperationLogViewModel>(
    ADVERTISEMENT_IDENTIFIER.OPERATION_LOG_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();

  public timer: any;

  // 暂停播放
  private stopPlayRef = React.createRef<TextAreaModal>();
  // 启动播放
  private beginPlayRef = React.createRef<TextAreaModal>();

  constructor(props: NoticePlayListProps) {
    super(props);
    this.state = {
      noticePlayListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getNoticePlayList, getStoresList, getStatus } = this.viewModel;
    await this.getPermissonData();
    getNoticePlayList();
    getStoresList();
    getStatus();
    this.getNoticePlayData();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { SEE, START, STOP, DELETE } = NOTICE_LIST;
    try {
      const permissionsData = await getPermissionsData([SEE, START, STOP, DELETE]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };

  // 删除列表单条数据
  private deleteNotice(record: NoticePlayListDataConfig): void {
    const { viewModel } = this;
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: '删除通知将失效并无法恢复，确认删除?',
      icon: undefined,
      onOk() {
        viewModel.delItem(record);
      },
    });
  }

  //发布状态
  private getNoticePlayStatus = (status: string): JSX.Element => {
    switch (status) {
      case PlayStatus.NotStart:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(255, 146, 48, 0.1)', color: '#FF9230' }}
          >
            <b className={style.openStatus} style={{ background: '#FF9230' }} />
            未开始
          </div>
        );
      case PlayStatus.Playing:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(64, 150, 255, 0.1)', color: '#4096FF' }}
          >
            <b className={style.openStatus} style={{ background: '#4096FF' }} />
            播放中
          </div>
        );
      case PlayStatus.Completed:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(0, 203, 148, 0.1)', color: '#00CB94' }}
          >
            <b className={style.openStatus} style={{ background: '#00CB94' }} />
            已完成
          </div>
        );

      case PlayStatus.Stop:
        return (
          <div
            className={style.stopStatusStyle}
            style={{ background: 'rgba(102, 102, 102, 0.1)', color: '#666666' }}
          >
            <b className={style.openStatus} style={{ background: '#666666' }} />
            停止播放
          </div>
        );
      case PlayStatus.NotCompleted:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(102, 102, 102, 0.1)', color: '#666666' }}
          >
            <b className={style.openStatus} style={{ background: '#666666' }} />
            未完成
          </div>
        );
      default:
        return <span>--</span>;
    }
  };

  public itemId: number = 0;
  public itemType: string = '';

  // 暂停点击事件
  private onStop = async (record: NoticePlayListDataConfig, status: string): Promise<void> => {
    this.stopPlayRef.current?.switchVisible();
    this.itemId = record.id || 0;
    this.itemType = status || '';
  };

  // 开始点击事件
  private onStart = async (record: NoticePlayListDataConfig, status: string): Promise<void> => {
    this.beginPlayRef.current?.switchVisible();
    this.itemId = record.id || 0;
    this.itemType = status || '';
  };

  public getContent = async (e: string): Promise<void> => {
    const { onOperate, getNoticePlayList } = this.viewModel;
    const params = {
      id: this.itemId,
      reason: e,
      type: this.itemType,
    };
    await onOperate(params)
      .then(() => {
        utils.globalMessge({
          content: '修改成功',
          type: 'success',
        });
        getNoticePlayList();
        if (this.itemType === 'START') {
          this.beginPlayRef.current?.switchVisible();
        }
        if (this.itemType === 'STOP') {
          this.stopPlayRef.current?.switchVisible();
        }
      })
      .catch((err) => {
        utils.globalMessge({
          content: `修改失败${err.message}!`,
          type: 'error',
        });
      });
  };

  // table操作选项
  private getOperation = (record: NoticePlayListDataConfig): JSX.Element => {
    const { permissionsData } = this.viewModel;
    const { STOP, START, DELETE } = NOTICE_LIST;
    if (record.statusCode === PlayStatus.Stop && permissionsData[START]) {
      return (
        <Tooltip title="开始">
          <button
            type="button"
            className={style.opertionBtn}
            onClick={(): Promise<void> => this.onStart(record, 'START')}
          >
            <img src={plauseIcon} alt="" />
          </button>
        </Tooltip>
      );
    }
    if (record.statusCode === PlayStatus.NotStart || record.statusCode === PlayStatus.Playing) {
      return (
        <>
          {permissionsData[STOP] && (
            <Tooltip title="暂停">
              <button
                type="button"
                className={style.opertionBtn}
                onClick={(): Promise<void> => this.onStop(record, 'STOP')}
              >
                <img src={playIcon} alt="" />
              </button>
            </Tooltip>
          )}
        </>
      );
    }
    if (
      record.statusCode === PlayStatus.Completed ||
      record.statusCode === PlayStatus.NotCompleted
    ) {
      return (
        <>
          {permissionsData[DELETE] && (
            <Tooltip title="删除">
              <button
                type="button"
                className={style.opertionBtn}
                onClick={(): void => this.deleteNotice(record)}
              >
                <img src={userlistDelIfo} alt="" />
              </button>
            </Tooltip>
          )}
        </>
      );
    }
    return <></>;
  };

  private deviceListTooltip = (record: NoticePlayListDataConfig): string => {
    if (record.deviceList) {
      let tooltip: any;
      // eslint-disable-next-line prefer-const
      tooltip = [];
      record.deviceList.forEach((item) => {
        item.deviceName ? tooltip.push(item.deviceName) : '';
      });
      return tooltip.join('/');
    }
    return '';
  };

  // 构造列表结构
  private getNoticePlayData = (): void => {
    const { permissionsData } = this.viewModel;
    const { SEE } = NOTICE_LIST;
    this.setState({
      noticePlayListColumns: [
        {
          title: '通知内容',
          key: 'content',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (record: NoticePlayListDataConfig): JSX.Element => (
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
          title: '计划展示时长',
          dataIndex: 'duration',
          key: 'duration',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{utils.transferTime(Number(value))}</>,
        },
        {
          title: '当前剩余时长',
          key: 'endDate',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (record: NoticePlayListDataConfig): JSX.Element => (
            <Statistic.Countdown
              value={Number(record?.endDate) + 10 * 1000}
              format="HH小时mm分ss秒"
            />
          ),
        },
        {
          title: '通知设备',
          key: 'deviceList',
          align: 'left',
          width: '25%',
          ellipsis: true,
          render: (record: NoticePlayListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.deviceListTooltip(record)}>
              <div className={style.publish_device}>
                {record.deviceList && record.deviceList.length > 0
                  ? record.deviceList.map((item, index) => {
                      return item.deviceName ? (
                        <div className={style.storesType} key={index}>
                          {item.deviceName}
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
          title: '通知状态',
          dataIndex: 'statusCode',
          key: 'statusCode',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{this.getNoticePlayStatus(value)}</>,
        },
        {
          title: '通知生效时间',
          dataIndex: 'lastUpdateDate',
          key: 'lastUpdateDate',
          align: 'left',
          width: '15%',
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '4%',
          render: (record: NoticePlayListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>{this.getOperation(record)}</div>
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
  public openNoticeDetails = async (record: NoticePlayListDataConfig): Promise<void> => {
    const {
      getDeviceDetailsListData,
      getNoticeDetailsData,
      getLookupsValue,
      getListDataNum,
    } = this.noticeDetailsTabViewModel;
    const { getApproveProgressData } = this.auditProgressViewModel;
    const { getOperateLog, operationPageGetLookupsValue } = this.operationLogViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.TEXT_POSITION_TYPE),
      getLookupsValue(LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE),
      operationPageGetLookupsValue(LookupsCodeTypes.AD_OPERATE_STATE_CODE),
      operationPageGetLookupsValue(LookupsCodeTypes.OPERATION_TYPE_CODE),
      getNoticeDetailsData(record.id || 0),
      getListDataNum(record.id || 0, DeviceType.Advertisement),
      getListDataNum(record.id || 0, DeviceType.Cashier),
      getListDataNum(record.id || 0, DeviceType.Led),
      getDeviceDetailsListData(record.id || 0, DeviceType.Advertisement),
      getApproveProgressData('NOTICE', record.id || 0, record.content || ''),
      getOperateLog(record.id || 0, 'NOTICE'),
    ]).then(() => {
      this.noticeDetailsModalViewModel.setNoticeDetailsVisible();
    });
  };

  public render(): JSX.Element {
    const {
      noticePlayListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      noticePlayListData,
      storesListData,
      statusData,
      selectStatus,
      selectStores,
      onFinish,
    } = this.viewModel;
    const { noticePlayListColumns } = this.state;

    return (
      <div className={style.mainContainer}>
        <div className={style.noticePlayListrootContainer}>
          <Row className={style.searchArea}>
            <Col>
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
            <Col style={{ minWidth: '106px', margin: '0 16px' }}>
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
                    <Form.Item name="deviceName">
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
          <Table<NoticePlayListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: noticePlayListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={noticePlayListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={noticePlayListColumns}
            dataSource={noticePlayListDataSource}
          />
          <NoticeDetailsModal type="playList" />
          <TextAreaModal
            ref={this.stopPlayRef}
            title="暂停播放"
            maxLength={50}
            describe="请填写暂停该紧急通知的原因或理由："
            getContent={this.getContent}
          />
          <TextAreaModal
            ref={this.beginPlayRef}
            title="启动播放"
            maxLength={50}
            describe="请填写启动该紧急通知的原因或理由："
            getContent={this.getContent}
          />
        </div>
      </div>
    );
  }
}
