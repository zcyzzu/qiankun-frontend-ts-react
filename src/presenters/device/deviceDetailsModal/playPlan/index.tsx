/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:15
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:08:28
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Select, Table, Tag, Button, Statistic, Tooltip, Input } from 'antd';
import style from './style.less';

import DI from '../../../../inversify.config';
import {
  DEVICE_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  APPROVE_IDENTIFIER,
} from '../../../../constants/identifiers';
import PlayPlanViewModel, {
  PlayPlanAdvertDataConfig,
  PlayPlanNoticeDataConfig,
  advertPlayStatus,
} from './viewModel';
import { DeviceType, UploadType } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import DeviceDetailsModalViewModel from '../../deviceDetailsModal/viewModel';
import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import NoticeDetailsModal from '../../../publish/notice/noticeDetailsModal/index';
import NoticeDetailsModalViewModel from '../../../publish/notice/noticeDetailsModal/viewModel';
import NoticeDetailsTabViewModel from '../../../publish/notice/noticeDetailsModal/noticeDetailsTab/viewModel';
import AuditProgressViewModel from '../../../publish/advertisement/advertisementDetailsModal/auditProgress/viewModel';
import OperationLogViewModel from '../../../publish/advertisement/advertisementDetailsModal/operationLog/viewModel';
import AdvertisementDetailsModal from '../../../publish/advertisement/advertisementDetailsModal/index';
import AdvertDetailsModalViewModel from '../../../publish/advertisement/advertisementDetailsModal/viewModel';
import AdvertDetailsTabViewModel from '../../../publish/advertisement/advertisementDetailsModal/advertisementDetailsTab/viewModel';
import utils from '../../../../utils/index';

interface PlayPlanProps {}

interface PlayPlanState {
  // 播放计划广告列表表格头
  advertListColums: ColumnProps<PlayPlanAdvertDataConfig>[];
  // 播放计划通知列表表格头
  noticeListColums: ColumnProps<PlayPlanNoticeDataConfig>[];
}

const { Countdown } = Statistic;

@observer
export default class PlayPlan extends React.Component<PlayPlanProps, PlayPlanState> {
  private viewModel = DI.DIContainer.get<PlayPlanViewModel>(DEVICE_IDENTIFIER.PLAY_PLAN);

  private deviceDetailsModalViewModel = DI.DIContainer.get<DeviceDetailsModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_DETAILS_MODEL_VIEW_MODEL,
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

  private advertDetailsModalViewModel = DI.DIContainer.get<AdvertDetailsModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_MODEL_VIEW_MODEL,
  );

  private advertDetailsTabViewModel = DI.DIContainer.get<AdvertDetailsTabViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_TAB_VIEW_MODEL,
  );

  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();

  constructor(props: PlayPlanProps) {
    super(props);
    this.state = {
      advertListColums: [],
      noticeListColums: [],
    };
  }

  componentDidMount(): void {
    this.setState({
      advertListColums: [
        {
          title: '广告名称',
          key: 'adName',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: PlayPlanAdvertDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.adName}>
              <Button
                type="link"
                size="small"
                onClick={(): Promise<void> => this.openAdvertisement(record)}
              >
                {record.adName}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '广告素材',
          key: 'material',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: PlayPlanAdvertDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.material}>
              <Button
                type="link"
                size="small"
                onClick={(): Promise<void> => this.openMaterial(record)}
              >
                {record.material}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '是否霸屏',
          dataIndex: 'levelType',
          key: 'levelType',
          align: 'left',
          ellipsis: true,
          render: (record): string => this.generateAdvertisementLevelType(record),
        },
        {
          title: '实际曝光量',
          dataIndex: 'expose',
          key: 'expose',
          align: 'left',
          ellipsis: true,
        },
        {
          title: '广告状态',
          dataIndex: 'status',
          key: 'status',
          align: 'left',
          ellipsis: true,
          render: (record): JSX.Element => this.generateStatus(record),
        },
        {
          title: '广告周期',
          key: 'cycle',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: PlayPlanAdvertDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.cycleTooltip(record)}>
              {this.cycleTooltip(record)}
            </Tooltip>
          ),
        },
      ],
      noticeListColums: [
        {
          title: '内容',
          key: 'content',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: PlayPlanNoticeDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.content}>
              <Button
                type="link"
                size="small"
                onClick={(): Promise<void> => this.openNotice(record)}
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
          ellipsis: true,
          render: (record: string): string => utils.transferTime(Number(record)),
        },
        {
          title: '当前剩余时长',
          key: 'endDate',
          align: 'left',
          ellipsis: true,
          render: (record): JSX.Element => (
            <Countdown value={Number(record?.endDate) + 10 * 1000} format="HH小时mm分ss秒" />
          ),
        },
        {
          title: '通知状态',
          dataIndex: 'statusCode',
          key: 'statusCode',
          align: 'left',
          ellipsis: true,
          render: (record): JSX.Element => this.generateStatus(record),
        },
        {
          title: '通知生效时间',
          dataIndex: 'lastUpdateDate',
          key: 'lastUpdateDate',
          align: 'left',
          ellipsis: true,
        },
      ],
    });
  }

  componentWillUnmount(): void {
    const { initialData } = this.viewModel;
    initialData();
  }

  public render(): JSX.Element {
    const {
      advertListData,
      advertListDataSource,
      selectChange,
      selectStatusChange,
      noticeListData,
      noticeListDataSource,
      advertListParams,
      noticeListParams,
      pageChange,
      urgentPageChange,
      imageSrc,
      videoSrc,
      currentType,
      currentStatus,
      onSearch,
    } = this.viewModel;
    const { playStatusCode } = this.deviceDetailsModalViewModel;
    const { advertListColums, noticeListColums } = this.state;
    return (
      <div className={style.playPlanContainer}>
        <Row>
          <Col>
            <Select
              value={currentType}
              onChange={(value: string): void => selectChange(value)}
              className={style.selectStyle}
              style={{ width: '100px' }}
            >
              <Select.Option value="AD">广告</Select.Option>
              <Select.Option value="NOTICE">紧急通知</Select.Option>
            </Select>
            <Select
              value={currentStatus}
              onChange={(value: string): void => selectStatusChange(value)}
              className={style.selectStyle}
              style={{ width: '100px' }}
            >
              <Select.Option value="ALL">全部状态</Select.Option>
              {playStatusCode.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={`ad_play_status_${index}`}>
                    {item.meaning}
                  </Select.Option>
                );
              })}
            </Select>
            <Input.Search
              style={{ width: '200px' }}
              className={style.searchStyle}
              placeholder={`${currentType === 'AD' ? '广告名称' : '通知名称'}`}
              allowClear
              enterButton="查询"
              onSearch={onSearch}
            />
          </Col>
        </Row>
        <Table<PlayPlanAdvertDataConfig | PlayPlanNoticeDataConfig | any>
          pagination={{
            size: 'small',
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total): string => `共 ${total} 条`,
            total:
              currentType === 'AD' ? advertListData.totalElements : noticeListData.totalElements,
            pageSize: currentType === 'AD' ? advertListParams.size : noticeListParams.size,
            current: currentType === 'AD' ? advertListParams.page + 1 : noticeListParams.page + 1,
            onChange: currentType === 'AD' ? pageChange : urgentPageChange,
          }}
          className={style.table}
          rowClassName={style.tableRow}
          columns={currentType === 'AD' ? advertListColums : noticeListColums}
          dataSource={currentType === 'AD' ? advertListDataSource : noticeListDataSource}
        />
        <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
        <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
        <NoticeDetailsModal type="playList" />
        <AdvertisementDetailsModal type="playList" />
      </div>
    );
  }

  // 打开广告详情
  private openAdvertisement = async (record: PlayPlanAdvertDataConfig): Promise<void> => {
    const {
      getAdvertisementDetails,
      getAdvertisementDetailsDeviceList,
      getLookupsValue,
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
      getApproveProgressData('AD', record.adId || 0, record.adName || ''),
      getOperateLog(record.adId || 0, 'AD'),
    ]).then(() => {
      this.advertDetailsModalViewModel.setAdvertDetailsVisible();
    });
  };

  // 打开素材
  private openMaterial = async (record: PlayPlanAdvertDataConfig): Promise<void> => {
    const { getMaterialUrl } = this.viewModel;
    await getMaterialUrl(record)
      .then(() => {
        if (record.materialList && record.materialList.length > 0) {
          if (record.materialList[0].type === UploadType.MP4) {
            this.videoRef.current?.setIsModalVisible();
          } else {
            this.imgRef.current?.setIsModalVisible();
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

  // 通知内容事件
  private openNotice = async (record: PlayPlanNoticeDataConfig): Promise<void> => {
    const {
      getDeviceDetailsListData,
      getNoticeDetailsData,
      getLookupsValue,
    } = this.noticeDetailsTabViewModel;
    const { getApproveProgressData } = this.auditProgressViewModel;
    const { operationPageGetLookupsValue, getOperateLog } = this.operationLogViewModel;
    Promise.all([
      getLookupsValue(LookupsCodeTypes.TEXT_POSITION_TYPE),
      getLookupsValue(LookupsCodeTypes.NOTICE_ROLL_SPEED_TYPE),
      operationPageGetLookupsValue(LookupsCodeTypes.AD_OPERATE_STATE_CODE),
      operationPageGetLookupsValue(LookupsCodeTypes.OPERATION_TYPE_CODE),
      getNoticeDetailsData(record.id || 0),
      getDeviceDetailsListData(record.id || 0, DeviceType.Advertisement),
      getApproveProgressData('NOTICE', record.id || 0, record.content || ''),
      getOperateLog(record.id || 0, 'NOTICE'),
    ]).then(() => {
      this.noticeDetailsModalViewModel.setNoticeDetailsVisible();
    });
  };

  // 渲染是否霸屏
  private generateAdvertisementLevelType = (record: string): string => {
    const { advertisementLevelTypeCode } = this.deviceDetailsModalViewModel;
    const data = advertisementLevelTypeCode.find((item) => {
      return item.value === record;
    });
    return data?.meaning || '';
  };

  // 渲染广告/通知状态
  private generateStatus = (status: string): JSX.Element => {
    const { playStatusCode } = this.deviceDetailsModalViewModel;
    const data = playStatusCode.find((item) => {
      return item.value === status;
    });
    let statusLabel: JSX.Element;
    switch (status) {
      case advertPlayStatus.NOT_STARTED:
        statusLabel = (
          <Tag color="rgba(255, 146, 48, 0.1)">
            <span className={style.orange}>
              <b className={style.pointStatus} />
              {data?.meaning}
            </span>
          </Tag>
        );
        break;
      case advertPlayStatus.PLAYING:
        statusLabel = (
          <Tag color="rgba(64, 150, 255, 0.1)">
            <span className={style.blue}>
              <b className={style.pointStatus} />
              {data?.meaning}
            </span>
          </Tag>
        );
        break;
      case advertPlayStatus.STOP:
        statusLabel = (
          <Tag color="rgba(102, 102, 102, 0.1)">
            <span className={style.gray}>
              <b className={style.pointStatus} />
              {data?.meaning}
            </span>
          </Tag>
        );
        break;
      case advertPlayStatus.COMPLETED:
        statusLabel = (
          <Tag color="rgba(0, 203, 148, 0.1)">
            <span className={style.green}>
              <b className={style.pointStatus} />
              {data?.meaning}
            </span>
          </Tag>
        );
        break;
      case advertPlayStatus.NOT_COMPLETED:
        statusLabel = (
          <Tag color="rgba(245, 34, 45, 0.1)">
            <span className={style.red}>
              <b className={style.pointStatus} />
              {data?.meaning}
            </span>
          </Tag>
        );
        break;
      default:
        statusLabel = <span />;
        break;
    }
    return statusLabel;
  };

  private cycleTooltip = (record: PlayPlanAdvertDataConfig): string => {
    if (record.timeList) {
      let str = '';
      const times = record.timeList.map((item) => `${item.cycleStartTime}~${item.cycleEndTime} `);
      if (record.cycleType === 'DAY') {
        str = `${record.startDate}-${record.endDate} / 每天${times}`;
      } else {
        str = `${record.startDate}-${record.endDate} / ${this.getWeekday(
          record.cycleWeekDay,
        )}${times}`;
      }
      return str;
    }
    return '';
  };

  // 获取周天数
  private getWeekday = (week: string | undefined): string => {
    const weekDay = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const text: string[] = [];
    if (week) {
      const arr = week.split(',');
      arr.map((item: string): string[] => {
        text.push(weekDay[Number(item) - 1]);
        return text;
      });
    }
    return text.length > 1 ? `每${text.join(' ')}` : '';
  };
}
