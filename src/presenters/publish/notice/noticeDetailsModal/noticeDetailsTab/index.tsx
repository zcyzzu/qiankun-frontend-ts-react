/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:15
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-08 10:31:05
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Table, Tabs, Tooltip } from 'antd';
import style from './style.less';

import DI from '../../../../../inversify.config';
import { ADVERTISEMENT_IDENTIFIER } from '../../../../../constants/identifiers';
import NoticeDetailsTabViewModel, {
  SpecificDeviceDataConfig,
  NoticePreviewProps,
} from './viewModel';
import NoticePreview from '../../../../../common/components/noticePreview';
import { DeviceType } from '../../../../../common/config/commonConfig';
import utils from '../../../../../utils/index';
import DetailsIcon from '../../../../../assets/images/advert_details_icon.svg';

interface NoticeDetailsTabProps {}
interface NoticeDetailsTabState {
  //具体设备列表表格头
  specificDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
  cashierDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
}

@observer
export default class NoticeDetailsTab extends React.Component<
  NoticeDetailsTabProps,
  NoticeDetailsTabState
> {
  private viewModel = DI.DIContainer.get<NoticeDetailsTabViewModel>(
    ADVERTISEMENT_IDENTIFIER.NOTICE_DETAILS_TAB_VIEW_MODEL,
  );

  // eslint-disable-next-line no-useless-constructor
  constructor(props: NoticeDetailsTabProps) {
    super(props);
    this.state = {
      specificDeviceListColums: [],
      cashierDeviceListColums: [],
    };
  }

  componentWillUnmount(): void {
    const { initialData } = this.viewModel;
    initialData();
  }

  componentDidMount(): void {
    this.setState({
      specificDeviceListColums: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
        {
          title: '所在楼层',
          dataIndex: 'floor',
          key: 'floor',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
        {
          title: '组名名称',
          dataIndex: 'groupStr',
          key: 'groupStr',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
      ],
      cashierDeviceListColums: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
        {
          title: '品牌业态',
          dataIndex: 'brandFormat',
          key: 'brandFormat',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
        {
          title: '点位品牌名称',
          dataIndex: 'pointBrandName',
          key: 'pointBrandName',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
        {
          title: '组名名称',
          dataIndex: 'groupStr',
          key: 'groupStr',
          align: 'left',
          ellipsis: true,
          render: (record: string): JSX.Element => (
            <Tooltip placement="topLeft" title={record}>
              {record || '- -'}
            </Tooltip>
          ),
        },
      ],
    });
  }

  public render(): JSX.Element {
    const {
      switchDevice,
      noticeDetailsData,
      dataLengthAd,
      dataLengthCa,
      dataLengthLed,
    } = this.viewModel;
    return (
      <div className={style.noticeDetailsTabContainer}>
        <Row>
          <Col span={24} className={style.bigTitle}>
            1、设置内容
          </Col>
          <Col span={12} className={style.title}>
            通知内容：<span>{noticeDetailsData?.content}</span>
          </Col>
          <Col span={12} className={style.title}>
            展示位置：<span>{this.generatePosition()}</span>
          </Col>
          <Col span={12} className={style.title}>
            滚动速度：<span>{this.generateSpeed()}</span>
          </Col>
          <Col span={12} className={style.title}>
            展示时长：
            <span>{utils.transferTime(Number(noticeDetailsData.duration))}</span>
          </Col>
          <Col span={24} className={style.title}>
            发布时间：<span>{noticeDetailsData?.lastUpdateDate}</span>
          </Col>
          <Col span={24} style={{ display: 'flex' }} className={style.title}>
            效果预览：
            <NoticePreview noticePreviewProps={this.generatePreview()} />
          </Col>
        </Row>
        <div className={style.bigTitle}>2、通知设备</div>
        <div className={style.deviceContainer}>
          <Tabs defaultActiveKey={DeviceType.Advertisement} onChange={switchDevice}>
            <Tabs.TabPane tab={`${dataLengthAd !== 0 ? `广告机（${dataLengthAd}台）` : '广告机'}`} key={DeviceType.Advertisement}>
              {this.generateDeviceList()}
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${dataLengthCa !== 0 ? `收银机（${dataLengthCa}台）` : '收银机'}`} key={DeviceType.Cashier}>
              {this.generateDeviceList()}
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${dataLengthLed !== 0 ? `LED（${dataLengthLed}台）` : 'LED'}`} key={DeviceType.Led}>
              {this.generateDeviceList()}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  private generateDeviceList = (): JSX.Element => {
    const {
      specificDeviceListData,
      deviceListParams,
      pageChange,
      specificDeviceListDataSource,
      deviceContent,
    } = this.viewModel;
    const { specificDeviceListColums, cashierDeviceListColums } = this.state;
    return (
      <>
        <div className={style.deviceListTitle}>
          <img src={DetailsIcon} alt="" />
          <span>
            具体设备：{specificDeviceListData.storeNum}个项目/门店，
            {specificDeviceListData.deviceNum}台设备
          </span>
        </div>
        <Table
          pagination={{
            size: 'small',
            showSizeChanger: false,
            showQuickJumper: false,
            total: specificDeviceListData.page?.totalElements,
            showTotal: (total): string => `共 ${total} 条`,
            pageSize: deviceListParams.size,
            current: deviceListParams.page + 1,
            onChange: pageChange,
          }}
          className={style.table}
          rowClassName={style.tableRow}
          columns={
            deviceContent === DeviceType.Cashier
              ? cashierDeviceListColums
              : specificDeviceListColums
          }
          dataSource={specificDeviceListDataSource}
        />
      </>
    );
  };

  private generatePreview = (): NoticePreviewProps => {
    const { noticeDetailsData } = this.viewModel;
    const data: NoticePreviewProps = {
      bgColor: noticeDetailsData?.backgroundColor,
      fontColor: noticeDetailsData?.color,
      opacity: noticeDetailsData?.backgroundTransparency,
      content: noticeDetailsData?.content || '',
      speed: noticeDetailsData?.speedCode,
    };
    return data;
  };

  private generatePosition = (): string => {
    const { noticeDetailsData, textPositionCode } = this.viewModel;
    const data = textPositionCode.find((item) => {
      return item.value === noticeDetailsData.locationCode;
    });
    return data?.meaning || '';
  };

  private generateSpeed = (): string => {
    const { noticeDetailsData, rollSpeendCode } = this.viewModel;
    const data = rollSpeendCode.find((item) => {
      return item.value === noticeDetailsData.speedCode;
    });
    return data?.meaning || '';
  };
}
