/* eslint-disable no-nested-ternary */
/*
 * @Author: mayajing
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-21 11:03:55
 */
import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { FormInstance } from 'antd/lib/form';
import { ColumnProps } from 'antd/lib/table';
import { Table, Select, Form, Row, Input, Tooltip, Button, Col, Modal } from 'antd';
import style from './style.less';

import {
  PLAY_LIST_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  APPROVE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import AdvertisementPlayListViewModel, {
  AdvertisementPlayListDataConfig,
  PlayStatus,
} from './viewModel';
import AdvertisementDetailsModal from '../../publish/advertisement/advertisementDetailsModal/index';
import AdvertDetailsModalViewModel from '../../publish/advertisement/advertisementDetailsModal/viewModel';
import TextAreaModal from '../../../common/components/textAreaModal/index';
import DatePickerModal from '../../../common/components/datePickerModal/index';
import {
  // DeviceListItem,
  OperateAdvertisementEntity,
} from '../../../domain/entities/advertisementEntities';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import AuditProgressViewModel from '../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import OperationLogViewModel from '../../publish/advertisement/advertisementDetailsModal/operationLog/viewModel';
import AdvertDetailsTabViewModel from '../../publish/advertisement/advertisementDetailsModal/advertisementDetailsTab/viewModel';
import { DeviceType, UploadType } from '../../../common/config/commonConfig';

import RootContainereViewModel from '../../rootContainer/viewModel';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import plauseIcon from '../../../assets/images/adverise_plause_icon.svg';
import playIcon from '../../../assets/images/adverise_play_icon.svg';
import userlistDelIfo from '../../../assets/images/del_info_icon.svg';
import continueIcon from '../../../assets/images/advertise_continue_icon.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';
import utils from '../../../utils/index';

interface AdvertisementPlayListProps {}
interface AdvertisementPlayListState {
  // 广告表格列
  advertisementPlayListColumns: ColumnProps<AdvertisementPlayListDataConfig>[];
}

const { AD_LIST } = PERMISSIONS_CODES;

// const { Search } = Input;

@observer
export default class AdvertisementPlayList extends React.Component<
  AdvertisementPlayListProps,
  AdvertisementPlayListState
> {
  private viewModel = DI.DIContainer.get<AdvertisementPlayListViewModel>(
    PLAY_LIST_IDENTIFIER.ADVERTISEMENT_PLAY_LIST_VIEW_MODEL,
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

  private operationLogViewModel = DI.DIContainer.get<OperationLogViewModel>(
    ADVERTISEMENT_IDENTIFIER.OPERATION_LOG_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();
  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();
  //启动播放
  private startPlayRef = React.createRef<TextAreaModal>();
  //续播广告
  private continuePlayRef = React.createRef<DatePickerModal>();
  //暂停播放
  private stopPlayRef = React.createRef<TextAreaModal>();

  constructor(props: AdvertisementPlayListProps) {
    super(props);
    this.state = {
      advertisementPlayListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getAdvertisementPlayList, getStatus, getStoresList } = this.viewModel;
    await this.getPermissonData();
    getAdvertisementPlayList();
    getStatus();
    getStoresList();
    this.getAdvertisementPlayData();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { STOP, START, CONTINUE, SEE, DELETE } = AD_LIST;
    try {
      const permissionsData = await getPermissionsData([STOP, START, CONTINUE, SEE, DELETE]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };
  //发布状态
  private getAdvertisementPlayStatus = (status: string): JSX.Element => {
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
      case PlayStatus.Abnormal:
        return (
          <div
            className={style.statusStyle}
            style={{ background: 'rgba(245,34,45, 0.1)', color: '#F5222D' }}
          >
            <b className={style.openStatus} style={{ background: '#F5222D' }} />
            异常
          </div>
        );
      default:
        return <span>--</span>;
    }
  };

  public advertisementId: number = 0;

  public operationType: string = '';

  // 开始点击事件
  private onBegin = async (record: AdvertisementPlayListDataConfig): Promise<void> => {
    this.advertisementId = record.adId || 0;
    this.operationType = 'START';
    this.startPlayRef.current?.switchVisible();
  };

  // 续播点击事件
  private onUnstraing = async (record: AdvertisementPlayListDataConfig): Promise<void> => {
    const { setContinuePlayName } = this.viewModel;
    setContinuePlayName(record.adName || '');
    this.advertisementId = record.adId || 0;
    this.operationType = 'CONTINUE_PLAYING';
    this.continuePlayRef.current?.switchVisible();
  };

  // 暂停点击事件
  private onStop = async (record: AdvertisementPlayListDataConfig): Promise<void> => {
    this.advertisementId = record.adId || 0;
    this.operationType = 'STOP_PLAY';
    this.stopPlayRef.current?.switchVisible();
  };

  // 操作弹窗确认事件回调
  public getContent = async (e: string): Promise<void> => {
    const { onOperate, getAdvertisementPlayList } = this.viewModel;
    const { userInfo } = this.rootContainereViewModel;
    const params: OperateAdvertisementEntity = {
      adId: this.advertisementId,
      cycleEndDate: e,
      operationType: this.operationType,
      reason: e,
      tenantId: userInfo.tenantId,
    };
    if (this.operationType === 'CONTINUE_PLAYING') {
      delete params.reason;
    } else {
      delete params.cycleEndDate;
    }
    await onOperate(params)
      .then(() => {
        utils.globalMessge({
          content: '修改成功',
          type: 'success',
        });
        if (this.operationType === 'START') {
          this.startPlayRef.current?.switchVisible();
        }
        if (this.operationType === 'CONTINUE_PLAYING') {
          this.continuePlayRef.current?.switchVisible();
        }
        if (this.operationType === 'STOP_PLAY') {
          this.stopPlayRef.current?.switchVisible();
        }
        getAdvertisementPlayList();
      })
      .catch((err) => {
        utils.globalMessge({
          content: `修改失败${err.message}!`,
          type: 'error',
        });
      });
  };

  // 删除列表单条数据
  private deleteItem(record: AdvertisementPlayListDataConfig): void {
    const { viewModel } = this;
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: '删除该广告播放信息将无法恢复，确认删除?',
      icon: undefined,
      onOk() {
        viewModel.deleteItem(record);
      },
    });
  }
  // table操作选项
  private getOperation = (record: AdvertisementPlayListDataConfig): JSX.Element => {
    const { permissionsData } = this.viewModel;
    const { STOP, START, CONTINUE, DELETE } = AD_LIST;
    if (record.status === PlayStatus.Stop && permissionsData[START]) {
      return (
        <Tooltip title="开始">
          <button
            type="button"
            className={style.opertionBtn}
            onClick={(): Promise<void> => this.onBegin(record)}
          >
            <img src={plauseIcon} alt="" />
          </button>
        </Tooltip>
      );
    }
    if (record.status === PlayStatus.NotCompleted && permissionsData[CONTINUE]) {
      return (
        <Tooltip title="续播">
          <button
            type="button"
            className={style.opertionBtn}
            onClick={(): Promise<void> => this.onUnstraing(record)}
          >
            <img src={continueIcon} alt="" />
          </button>
        </Tooltip>
      );
    }
    if (record.status === PlayStatus.Completed && permissionsData[DELETE]) {
      return (
        <Tooltip title="删除">
          <button
            type="button"
            className={style.opertionBtn}
            onClick={(): void => this.deleteItem(record)}
          >
            <img src={userlistDelIfo} alt="" />
          </button>
        </Tooltip>
      );
    }
    if (record.status === PlayStatus.NotStart || record.status === PlayStatus.Playing) {
      return (
        <>
          {permissionsData[STOP] && (
            <Tooltip title="暂停">
              <button
                type="button"
                className={style.opertionBtn}
                onClick={(): Promise<void> => this.onStop(record)}
              >
                <img src={playIcon} alt="" />
              </button>
            </Tooltip>
          )}
        </>
      );
    }
    return <></>;
  };

  // 预览素材弹窗
  public previewMaterial = async (record: AdvertisementPlayListDataConfig): Promise<void> => {
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

  private deviceListTooltip = (record: AdvertisementPlayListDataConfig): string => {
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

  private cycleTooltip = (record: AdvertisementPlayListDataConfig): string => {
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

  // 构造列表结构
  private getAdvertisementPlayData = (): void => {
    const { permissionsData } = this.viewModel;
    const { SEE } = AD_LIST;
    this.setState({
      advertisementPlayListColumns: [
        {
          title: '广告名称',
          key: 'adName',
          align: 'left',
          width: '10%',
          render: (record: AdvertisementPlayListDataConfig): JSX.Element => (
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
          key: 'name',
          align: 'left',
          width: '10%',
          render: (record: AdvertisementPlayListDataConfig): JSX.Element => (
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
          title: '实际曝光量',
          dataIndex: 'expose',
          key: 'expose',
          align: 'left',
          width: '10%',
        },
        {
          title: '发布设备',
          key: 'publishDevice',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: AdvertisementPlayListDataConfig): JSX.Element => (
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
          render: (record: AdvertisementPlayListDataConfig): JSX.Element => (
            <div>{record.deviceList ? record.deviceList.length : 0}台</div>
          ),
        },
        {
          title: '播放状态',
          dataIndex: 'status',
          key: 'status',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => <>{this.getAdvertisementPlayStatus(value)}</>,
        },
        {
          title: '广告周期',
          key: 'cycle',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (record: AdvertisementPlayListDataConfig): JSX.Element => (
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
          width: '4%',
          render: (record: AdvertisementPlayListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>{this.getOperation(record)}</div>
          ),
        },
      ],
    });
  };

  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };
  // TODO
  public getCurrentSelected = (e: OrganizationListEntity): void => {
    console.log(e);
  };

  // 打开广告详情弹窗
  public openAdvertisementDetailsModal = async (
    record: AdvertisementPlayListDataConfig,
  ): Promise<void> => {
    const {
      getAdvertisementDetails,
      getAdvertisementDetailsDeviceList,
      getLookupsValue,
      getListNum,
    } = this.advertDetailsTabViewModel;
    const { getApproveProgressData } = this.auditProgressViewModel;
    const { getOperateLog, operationPageGetLookupsValue } = this.operationLogViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.AD_CYCLE_TYPE_CODE),
      getLookupsValue(LookupsCodeTypes.AD_LEVEL_TYPE_CODE),
      operationPageGetLookupsValue(LookupsCodeTypes.AD_OPERATE_STATE_CODE),
      operationPageGetLookupsValue(LookupsCodeTypes.OPERATION_TYPE_CODE),
      getAdvertisementDetails(record.adId || 0),
      getAdvertisementDetailsDeviceList(record.adId || 0, DeviceType.Advertisement),
      getListNum(record.adId || 0, DeviceType.Advertisement),
      getListNum(record.adId || 0, DeviceType.Cashier),
      getListNum(record.adId || 0, DeviceType.Led),
      getApproveProgressData('AD', record.adId || 0, record.adName || ''),
      getOperateLog(record.adId || 0, 'AD'),
    ]).then(() => {
      this.advertDetailsModalViewModel.setAdvertDetailsVisible();
    });
  };

  public render(): JSX.Element {
    const {
      advertisementPlayListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      advertisementPlayListData,
      selectStatus,
      selectStores,
      statusData,
      storesListData,
      onFinish,
      imageSrc,
      videoSrc,
      continuePlayName,
    } = this.viewModel;
    const { advertisementPlayListColumns } = this.state;

    return (
      <div className={style.mainContainer}>
        <div className={style.advertisementPlayListrootContainer}>
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
          <Table<AdvertisementPlayListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: advertisementPlayListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={advertisementPlayListColumns}
            dataSource={advertisementPlayListDataSource}
            scroll={advertisementPlayListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
          />
          {/* <CreateProjectModal /> */}
          <AdvertisementDetailsModal type="playList" />
          <TextAreaModal
            ref={this.startPlayRef}
            title="启动播放"
            describe="请填写启动该广告的原因或理由："
            maxLength={50}
            getContent={this.getContent}
          />
          <DatePickerModal
            ref={this.continuePlayRef}
            title="续播广告"
            describe={`请选择【${continuePlayName}】续播结束日期~`}
            getContent={this.getContent}
          />
          <TextAreaModal
            ref={this.stopPlayRef}
            title="暂停播放"
            maxLength={50}
            describe="如果中途暂停广告，该广告位可能将会被其他广告占用，确定请输入
          暂停的原因或理由："
            getContent={this.getContent}
          />
          <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
          <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
        </div>
      </div>
    );
  }
}
