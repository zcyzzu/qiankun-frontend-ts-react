/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */
/*
 * @Author: mayajing
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 16:57:16
 */
import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { ColumnProps } from 'antd/lib/table';
import { FormInstance } from 'antd/lib/form';
import { Table, Select, Button, Form, Row, Input, Tooltip, Modal, Col } from 'antd';
import style from './style.less';
import {
  ADVERTISEMENT_IDENTIFIER,
  APPROVE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../../constants/identifiers';
import DI from '../../../../inversify.config';

import AdvertisementListViewModel, { AdvertisementListDataConfig } from './viewModel';
import AdvertisementDetailsModal from '../../../publish/advertisement/advertisementDetailsModal/index';
import AdvertDetailsModalViewModel from '../../../publish/advertisement/advertisementDetailsModal/viewModel';
import AdvertDetailsTabViewModel from '../../../publish/advertisement/advertisementDetailsModal/advertisementDetailsTab/viewModel';
import AuditProgressViewModel from '../../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import { DeviceType, ModalStatus, UploadType } from '../../../../common/config/commonConfig';
import { DeviceStatus } from '../../../approve/advertisementApproveList/viewModel';
import PERMISSIONS_CODES from '../../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import publishAdvertise from '../../../../assets/images/publish_advertise_icon.svg';
import userlistEditInfo from '../../../../assets/images/edit_info_icon.svg';
import userlistDelIfo from '../../../../assets/images/del_info_icon.svg';
import approveProgressIcon from '../../../../assets/images/approve_progress_icon.svg';
import copyIcon from '../../../../assets/images/copy_icon.svg';

import CreatAdvertisementModalViewModel from '../creatAdvertisementModal/viewModel';
import CreatAdvertisementModal from '../creatAdvertisementModal/index';
import RootContainereViewModel from '../../../rootContainer/viewModel';

import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import utils from '../../../../utils/index';

interface AdvertisementListProps {}
interface AdvertisementListState {
  // 广告表格列
  advertisementListColumns: ColumnProps<AdvertisementListDataConfig>[];
}
const { AD_MANAGEMENT } = PERMISSIONS_CODES;

@observer
export default class AdvertisementList extends React.Component<
  AdvertisementListProps,
  AdvertisementListState
> {
  private viewModel = DI.DIContainer.get<AdvertisementListViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_LIST_VIEW_MODEL,
  );

  private creatAdvertisementModalViewModel = DI.DIContainer.get<CreatAdvertisementModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_CREATADVERTISEMENT_VIEW_MODEL,
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

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();

  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();

  constructor(props: AdvertisementListProps) {
    super(props);
    this.state = {
      advertisementListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getAdvertisementList, getStatus, getStoresList } = this.viewModel;
    await this.getPermissonData();
    getAdvertisementList();
    getStatus();
    getStoresList();
    this.getAdvertisementData();
    const query = window.location.search; // '?adId=1&adName=1'
    if (query) {
      const successCount = query.substring(4);
      if (successCount) {
        this.openAdvertisementDetailsModal({ adId: Number(successCount) });
      }
    }
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { PUBLISH, EDIT, DELETE, SEE, DETAILS, COPY } = AD_MANAGEMENT;
    try {
      const permissionsData = await getPermissionsData([PUBLISH, EDIT, DELETE, SEE, DETAILS, COPY]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  // 删除列表单条数据
  private deleteAdvertisement(record: AdvertisementListDataConfig): void {
    const { viewModel } = this;
    Modal.confirm({
      title: '删除广告',
      maskClosable: true,
      content: '删除该广告无法恢复，确认删除?',
      icon: undefined,
      onOk() {
        viewModel.deleteItem(record);
      },
    });
  }
  //发布状态
  private getAdvertisementStatus = (approvalStatus: string): JSX.Element => {
    switch (approvalStatus) {
      case DeviceStatus.Editing:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(64, 150, 255, 0.1)', color: '#4096FF' }}
          >
            <b className={style.openStatus} style={{ background: '#4096FF' }} />
            编辑中
          </div>
        );
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

  // 预览素材弹窗
  public previewMaterial = async (record: AdvertisementListDataConfig): Promise<void> => {
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

  // 新增编辑弹窗
  public openModal = (record: AdvertisementListDataConfig, copy?: string): void => {
    const {
      setAdvertisingModalVisible,
      getAdvertisementDetail,
      // getEditDeviceList,
      getLookupsValue,
      getSpecificDevices,
    } = this.creatAdvertisementModalViewModel;
    getLookupsValue(LookupsCodeTypes.AD_CYCLE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.AD_LEVEL_TYPE_CODE);
    getSpecificDevices(DeviceType.Advertisement);
    // getEditDeviceList(DeviceType.Advertisement, record.adId);
    // getEditDeviceList(DeviceType.Cashier, record.adId);
    // getEditDeviceList(DeviceType.Led, record.adId);
    getAdvertisementDetail(record.adId).then((res) => {
      if (res) {
        if (copy === 'copy') {
          setAdvertisingModalVisible(ModalStatus.Edit, this.rootContainereViewModel, 'copy');
        } else {
          setAdvertisingModalVisible(ModalStatus.Edit, this.rootContainereViewModel);
        }
      }
    });
  };

  // table操作选项
  public getOperation = (record: AdvertisementListDataConfig): JSX.Element => {
    const { permissionsData } = this.viewModel;
    const { EDIT, DELETE, DETAILS, COPY } = AD_MANAGEMENT;
    switch (record.approvalStatus) {
      case DeviceStatus.Editing:
        return (
          <>
            {permissionsData[EDIT] && (
              <Tooltip title="编辑">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.openModal(record)}
                >
                  <img src={userlistEditInfo} alt="" />
                </button>
              </Tooltip>
            )}
            {permissionsData[DELETE] && (
              <Tooltip title="删除">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.deleteAdvertisement(record)}
                >
                  <img src={userlistDelIfo} alt="" />
                </button>
              </Tooltip>
            )}
          </>
        );
      case DeviceStatus.Pending:
        return (
          <>
            {permissionsData[EDIT] && (
              <Tooltip title="编辑">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.openModal(record)}
                >
                  <img src={userlistEditInfo} alt="" />
                </button>
              </Tooltip>
            )}
            {permissionsData[COPY] && (
              <Tooltip title="复制">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.openModal(record, 'copy')}
                >
                  <img src={copyIcon} alt="" />
                </button>
              </Tooltip>
            )}
            {permissionsData[DETAILS] && (
              <Tooltip title="审批进度">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): Promise<void> => (
                    this.openAdvertisementDetailsModal(record, 'approve')
                  )}
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
                  onClick={(): void => this.deleteAdvertisement(record)}
                >
                  <img src={userlistDelIfo} alt="" />
                </button>
              </Tooltip>
            )}
          </>
        );
      case DeviceStatus.Expired:
        return (
          <>
            {permissionsData[DETAILS] && (
              <Tooltip title="审批进度">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): Promise<void> => (
                    this.openAdvertisementDetailsModal(record, 'approve')
                  )}
                >
                  <img src={approveProgressIcon} alt="" />
                </button>
              </Tooltip>
            )}
            {permissionsData[COPY] && (
              <Tooltip title="复制">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.openModal(record, 'copy')}
                >
                  <img src={copyIcon} alt="" />
                </button>
              </Tooltip>
            )}
            {permissionsData[DELETE] && (
              <Tooltip title="删除">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.deleteAdvertisement(record)}
                >
                  <img src={userlistDelIfo} alt="" />
                </button>
              </Tooltip>
            )}
          </>
        );
      default:
        return (
          <>
            {permissionsData[DETAILS] && (
              <Tooltip title="审批进度">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): Promise<void> => (
                    this.openAdvertisementDetailsModal(record, 'approve')
                  )}
                >
                  <img src={approveProgressIcon} alt="" />
                </button>
              </Tooltip>
            )}
            {permissionsData[COPY] && (
              <Tooltip title="复制">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.openModal(record, 'copy')}
                >
                  <img src={copyIcon} alt="" />
                </button>
              </Tooltip>
            )}
          </>
        );
    }
  };

  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };

  private deviceListTooltip = (record: AdvertisementListDataConfig): string => {
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
  private cycleTooltip = (record: AdvertisementListDataConfig): string => {
    if (record.timeList) {
      let str = '';
      const times = record.timeList.map((item) => `${item.cycleStartTime}~${item.cycleEndTime} `);
      if (record.cycleType === 'DAY') {
        str = `${record.startDate}-${record.endDate}/每天${times}`;
      } else {
        str = `${record.startDate}-${record.endDate}/${this.getWeekday(
          record.cycleWeekDay,
        )}${times}`;
      }
      return str;
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

  // 构造列表结构
  private getAdvertisementData = (): void => {
    const { permissionsData } = this.viewModel;
    const { SEE } = AD_MANAGEMENT;
    this.setState({
      advertisementListColumns: [
        {
          title: '广告名称',
          key: 'adName',
          align: 'left',
          width: '15%',
          ellipsis: true,
          render: (record: AdvertisementListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.adName}>
              <Button
                type="link"
                size="small"
                className={style.columnContentShow}
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                onClick={() => {
                  return permissionsData[SEE] ? this.openAdvertisementDetailsModal(record) : null;
                }}
              >
                {record.adName ? record.adName : '--'}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '广告素材',
          key: 'name',
          align: 'left',
          width: '15%',
          render: (record: AdvertisementListDataConfig): JSX.Element => (
            <Tooltip
              placement="topLeft"
              title={
                record.materialList && record.materialList.length > 0
                  ? record.materialList[0].name
                  : ''
              }
            >
              <Button
                type="link"
                size="small"
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
          key: 'publishDevice',
          align: 'left',
          width: '20%',
          render: (record: AdvertisementListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.deviceListTooltip(record)}>
              <div className={style.publish_device}>
                {record.deviceList
                  ? record.deviceList.length > 0
                    ? record.deviceList.map((item, index) => {
                        return item.deviceName ? (
                          <div className={style.storesType} key={index}>
                            {item.deviceName}
                          </div>
                        ) : (
                          '--'
                        );
                      })
                    : '--'
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
          ellipsis: true,
          render: (record: AdvertisementListDataConfig): JSX.Element => (
            <div>{record.deviceList ? record.deviceList.length : 0}台</div>
          ),
        },
        {
          title: '广告周期',
          key: 'cycle',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: AdvertisementListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.cycleTooltip(record)}>
              {this.cycleTooltip(record)}
            </Tooltip>
          ),
        },
        {
          title: '发布状态',
          dataIndex: 'approvalStatus',
          key: 'approvalStatus',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{this.getAdvertisementStatus(value)}</>,
        },
        {
          title: '最新发布时间',
          dataIndex: 'publishDate',
          key: 'publishDate',
          align: 'left',
          width: '18%',
          render: (value: string): string => (value || '--'),
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '15%',
          render: (record: AdvertisementListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>{this.getOperation(record)}</div>
          ),
        },
      ],
    });
  };

  // 打开广告详情弹窗/审批进度弹窗
  public openAdvertisementDetailsModal = async (
    record: AdvertisementListDataConfig,
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
      getAdvertisementDetails(record.adId || 0),
      getAdvertisementDetailsDeviceList(record.adId || 0, DeviceType.Advertisement),
      getListNum(record.adId || 0, DeviceType.Advertisement),
      getListNum(record.adId || 0, DeviceType.Cashier),
      getListNum(record.adId || 0, DeviceType.Led),
      getApproveProgressData('AD', record.adId || 0, record.adName || ''),
    ]).then(() => {
      if (tabType === 'approve') {
        this.advertDetailsModalViewModel.setAdvertDetailsVisible('2', '发布设备');
      } else {
        this.advertDetailsModalViewModel.setAdvertDetailsVisible('', '发布设备');
      }
    });
  };

  // 打开审批进度modal

  private advertisement = (): void => {
    const { getTenantStatus } = this.viewModel;
    const {
      setAdvertisingModalVisible,
      getLookupsValue,
      getSpecificDevices,
    } = this.creatAdvertisementModalViewModel;
    getLookupsValue(LookupsCodeTypes.AD_CYCLE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.AD_LEVEL_TYPE_CODE);
    getSpecificDevices(DeviceType.Advertisement);
    getTenantStatus().then((res) => {
      if (res) {
        setAdvertisingModalVisible(ModalStatus.Creat, this.rootContainereViewModel);
      }
    });
  };

  public render(): JSX.Element {
    const {
      advertisementListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      selectStatus,
      statusData,
      storesListData,
      selectStores,
      onFinish,
      advertisementListData,
      imageSrc,
      videoSrc,
      permissionsData,
    } = this.viewModel;
    const { advertisementListColumns } = this.state;
    const { PUBLISH } = AD_MANAGEMENT;

    return (
      <div className={style.mainContainer}>
        <div className={style.advertisementListrootContainer}>
          <Row className={style.searchArea}>
            <Col style={{ minWidth: '106px', marginRight: '16px' }}>
              <Select
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
                    <Form.Item name="adName">
                      <Input placeholder="广告名称" />
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
          <div className={style.buttonsContainer}>
            {permissionsData[PUBLISH] && (
              <Button type="primary" onClick={this.advertisement}>
                <img src={publishAdvertise} alt="" />
                <span>发布广告</span>
              </Button>
            )}
          </div>
          <Table<AdvertisementListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: advertisementListData.totalElements || 0,
              showTotal: (total): string => `共 ${total} 条`,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={advertisementListColumns}
            dataSource={advertisementListDataSource}
            scroll={advertisementListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
          />
          <CreatAdvertisementModal />
          <AdvertisementDetailsModal />
          <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
          <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
        </div>
      </div>
    );
  }
}
