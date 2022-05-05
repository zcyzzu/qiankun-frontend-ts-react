/* eslint-disable no-nested-ternary */
/*
 * @Author: mayajing
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 17:03:49
 */
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { ColumnProps } from 'antd/lib/table';
import { Table, Select, Form, Row, Input, Tooltip, Col, Button, Switch } from 'antd';
import style from './style.less';
import { APPROVE_IDENTIFIER, ADVERTISEMENT_IDENTIFIER } from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import AdvertisementApproveListViewModel, {
  AdvertisementApproveListDataConfig,
  DeviceStatus,
} from './viewModel';
import approvelIcon from '../../../assets/images/approve_icon.svg';
import approveProgressIcon from '../../../assets/images/approve_progress_icon.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';
import { DeviceType, UploadType } from '../../../common/config/commonConfig';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import AdvertisementApproveModalViewModel from '../advertisementApproveModal/viewModel';
import AdvertisementApproveModal from '../advertisementApproveModal/index';
import AdvertisementDetailsModal from '../../publish/advertisement/advertisementDetailsModal/index';
import AdvertDetailsModalViewModel from '../../publish/advertisement/advertisementDetailsModal/viewModel';
import AdvertDetailsTabViewModel from '../../publish/advertisement/advertisementDetailsModal/advertisementDetailsTab/viewModel';
import AuditProgressViewModel from '../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';
import utils from '../../../utils/index';

interface AdvertisementApproveListProps {
  match: any;
}
interface AdvertisementApproveListState {
  // 广告表格列
  AdvertisementApproveListColumns: ColumnProps<AdvertisementApproveListDataConfig>[];
}
const { AD_APPROVE } = PERMISSIONS_CODES;

@observer
export default class AdvertisementApproveList extends React.Component<
  AdvertisementApproveListProps,
  AdvertisementApproveListState
> {
  private viewModel = DI.DIContainer.get<AdvertisementApproveListViewModel>(
    APPROVE_IDENTIFIER.ADVERTISEMENT_APPROVE_LIST_VIEW_MODEL,
  );

  private advertisementApproveModal = DI.DIContainer.get<AdvertisementApproveModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_ADVERTISEMENT_APPROVE_VIEW_MODEL,
  );

  private advertDetailsModalViewModel = DI.DIContainer.get<AdvertDetailsModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_MODEL_VIEW_MODEL,
  );

  private advertDetailsTabViewModel = DI.DIContainer.get<AdvertDetailsTabViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_TAB_VIEW_MODEL,
  );

  private auditProgressViewModel = DI.DIContainer.get<AuditProgressViewModel>(
    APPROVE_IDENTIFIER.AUDIT_PROGRESS_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();

  constructor(props: AdvertisementApproveListProps) {
    super(props);
    this.state = {
      AdvertisementApproveListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getAdvertisementApproveList, getStatus } = this.viewModel;
    await this.getPermissonData();
    getAdvertisementApproveList();
    getStatus();
    this.getAdvertisementApproveData();
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { SEE, OPERATION } = AD_APPROVE;
    try {
      const permissionsData = await getPermissionsData([SEE, OPERATION]);
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

  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();

  // 打开审批弹窗
  private openApproveModal = async (item: AdvertisementApproveListDataConfig): Promise<void> => {
    const {
      setAdvertisementApproveModalVisible,
      getAdvertisementDetails,
      getAdvertisementDetailsDeviceList,
      getDeviceListNum,
      getLookupsValue,
    } = this.advertisementApproveModal;
    Promise.all([
      await getLookupsValue(LookupsCodeTypes.AD_CYCLE_TYPE_CODE),
      await getLookupsValue(LookupsCodeTypes.AD_LEVEL_TYPE_CODE),
      await getAdvertisementDetails(item.id || 0),
      await getAdvertisementDetailsDeviceList(item.id || 0, DeviceType.Advertisement),
      await getDeviceListNum(item.id || 0, DeviceType.Advertisement),
      await getDeviceListNum(item.id || 0, DeviceType.Cashier),
      await getDeviceListNum(item.id || 0, DeviceType.Led),
    ]).then(() => {
      setAdvertisementApproveModalVisible(item.id, item.taskActorId);
    });
  };

  //发布状态
  private getAdvertisementStatus = (approvalStatus: string): JSX.Element => {
    switch (approvalStatus) {
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

  // 预览素材弹窗
  public previewMaterial = async (record: AdvertisementApproveListDataConfig): Promise<void> => {
    const { getMaterialUrl } = this.viewModel;
    await getMaterialUrl(record)
      .then(() => {
        if (record.materialList) {
          if (
            record.materialList[0]?.type === UploadType.JPG ||
            record.materialList[0]?.type === UploadType.PNG
          ) {
            this.imgRef.current?.setIsModalVisible();
          }
          if (record.materialList[0]?.type === UploadType.MP4) {
            this.videoRef.current?.setIsModalVisible();
          }
        }
      })
      .catch((err) => {
        utils.globalMessge({
          content: `查看素材失败，${err.message}`,
          type: 'error',
        });
      });
  };
  private deviceListTooltip = (record: AdvertisementApproveListDataConfig): string => {
    if (record.devices) {
      let tooltip: any;
      // eslint-disable-next-line prefer-const
      tooltip = [];
      record.devices.forEach((item) => {
        item.name ? tooltip.push(item.name) : '';
      });
      return tooltip.join('/');
    }
    return '';
  };

  // 获取周天数
  private getWeekday = (week: string | undefined): string => {
    const weekDay = ['每周一', '每周二', '每周三', '每周四', '每周五', '每周六', '每周日'];
    const text: string[] = [];
    if (week) {
      const arr = week.split(',');
      arr.map((item: string): string[] => {
        text.push(weekDay[Number(item) - 1]);
        return text;
      });
    }
    return text.join(' ');
  };

  private cycleTooltip = (record: AdvertisementApproveListDataConfig): string => {
    if (record.timeList) {
      let str = '';
      const times = record.timeList.map((item) => `${item.cycleStartTime}~${item.cycleEndTime} `);
      if (record.cycleType === 'DAY') {
        str = `${record.startDateString}-${record.endDateString}/每天${times}`;
      } else {
        str = `${record.startDateString}-${record.endDateString}/${this.getWeekday(
          record.cycleWeekDay,
        )}${times}`;
      }
      return str;
    }
    return '';
  };

  // 打开广告详情弹窗
  public openAdvertisementDetailsModal = async (
    record: AdvertisementApproveListDataConfig,
    tabType?: string,
  ): Promise<void> => {
    const {
      getAdvertisementDetails,
      getAdvertisementDetailsDeviceList,
      getListNum,
      getLookupsValue,
    } = this.advertDetailsTabViewModel;
    const { getApproveProgressData } = this.auditProgressViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.AD_CYCLE_TYPE_CODE),
      getLookupsValue(LookupsCodeTypes.AD_LEVEL_TYPE_CODE),
      getAdvertisementDetails(record.id || 0),
      getListNum(record.id || 0, DeviceType.Advertisement),
      getListNum(record.id || 0, DeviceType.Cashier),
      getListNum(record.id || 0, DeviceType.Led),
      getAdvertisementDetailsDeviceList(record.id || 0, DeviceType.Advertisement),
      getApproveProgressData('AD', record.id || 0, record.adName || ''),
    ]).then(() => {
      if (tabType === 'approve') {
        this.advertDetailsModalViewModel.setAdvertDetailsVisible('2', '发布设备');
      } else {
        this.advertDetailsModalViewModel.setAdvertDetailsVisible('', '发布设备');
      }
    });
  };

  // 构造列表结构
  private getAdvertisementApproveData = (): void => {
    const { permissionsData } = this.viewModel;
    const { SEE, OPERATION } = AD_APPROVE;
    this.setState({
      AdvertisementApproveListColumns: [
        {
          title: '广告名称',
          key: 'adName',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (record: AdvertisementApproveListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.adName}>
              <Button
                type="link"
                className={style.columnContentShow}
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                onClick={() => {
                  return permissionsData[SEE] ? this.openAdvertisementDetailsModal(record) : null;
                }}
              >
                {record.adName}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '广告素材',
          key: 'list',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (record: AdvertisementApproveListDataConfig): JSX.Element => (
            <Tooltip
              placement="topLeft"
              title={
                record.materialList && record.materialList.length > 0
                  ? record.materialList[0].name
                  : '--'
              }
            >
              <Button
                type="link"
                className={style.columnContentShow}
                onClick={(): Promise<void> => this.previewMaterial(record)}
              >
                {record.materialList && record.materialList.length > 0
                  ? record.materialList[0].name
                  : '--'}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '霸屏情况',
          dataIndex: 'levelType',
          key: 'levelType',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <div>{value === 'ONLY' ? '霸屏' : '不霸屏'}</div>,
        },
        {
          title: '发布设备',
          key: 'deviceList',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: AdvertisementApproveListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.deviceListTooltip(record)}>
              <div className={style.publish_device}>
                {record.devices && record.devices.length > 0
                  ? record.devices.map((item, index) => {
                      return item.name ? (
                        <div className={style.storesType} key={index}>
                          {item.name}
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
          title: '设备总数',
          key: 'total',
          align: 'left',
          width: '10%',
          render: (record: AdvertisementApproveListDataConfig): JSX.Element => (
            <div>{record.devices ? record.devices.length : 0}台</div>
          ),
        },
        {
          title: '审批状态',
          dataIndex: 'approveStatus',
          key: 'approveStatus',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{this.getAdvertisementStatus(value)}</>,
        },
        {
          title: '申请时间',
          dataIndex: 'publishDate',
          key: 'publishDate',
          align: 'left',
          width: '15%',
        },
        {
          title: '广告周期',
          key: 'cycle',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (record: AdvertisementApproveListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.cycleTooltip(record)}>
              {this.cycleTooltip(record)}
            </Tooltip>
          ),
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '6%',
          render: (record: AdvertisementApproveListDataConfig): JSX.Element => (
            <>
              {permissionsData[OPERATION] && (
                <div className={style.operatorContainer}>
                  {record.approveFlag ? (
                    <Tooltip title="审批">
                      <button
                        type="button"
                        className={style.opertionBtn}
                        onClick={(): Promise<void> => this.openApproveModal(record)}
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
                      onClick={(): Promise<void> => (
                        this.openAdvertisementDetailsModal(record, 'approve')
                      )}
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
  public render(): JSX.Element {
    const {
      advertisementApproveListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      advertisementApproveListData,
      selectStatus,
      statusData,
      getApproveList,
      onFinish,
      imageSrc,
      videoSrc,
    } = this.viewModel;
    const { AdvertisementApproveListColumns } = this.state;

    return (
      <div className={style.mainContainer}>
        <div className={style.advertisementApproveListrootContainer}>
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
                <Row>
                  <Col style={{ minWidth: '200px', marginRight: '16px' }}>
                    <Form.Item name="name">
                      <Input placeholder="广告名称" />
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
                style={{ marginRight: '8px' }}
                defaultChecked={false}
                onChange={(checked: boolean): void => getApproveList(checked)}
              />
              <span className={style.listTopSearch_right_text}>只显示自己需审批的广告</span>
            </Col>
          </Row>
          <Table<AdvertisementApproveListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: advertisementApproveListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={advertisementApproveListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={AdvertisementApproveListColumns}
            dataSource={advertisementApproveListDataSource}
          />
          <AdvertisementApproveModal />
          <AdvertisementDetailsModal />
          <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
          <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
        </div>
      </div>
    );
  }
}
