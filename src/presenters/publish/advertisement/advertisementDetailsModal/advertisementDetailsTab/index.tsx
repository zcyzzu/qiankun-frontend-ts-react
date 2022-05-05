/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:15
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-08 10:27:17
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Table, Tabs, Tooltip } from 'antd';
import style from './style.less';

import DI from '../../../../../inversify.config';
import { ADVERTISEMENT_IDENTIFIER } from '../../../../../constants/identifiers';
import AdvertDetailsTabViewModel, { SpecificDeviceDataConfig } from './viewModel';
import Thumbnail from '../../../../../common/components/thumbnail/index';
import { DeviceType, UploadType } from '../../../../../common/config/commonConfig';
import MaterialPreviewModal from '../../../../../common/components/materialPreviewModal/index';
import advertDetailsIcon from '../../../../../assets/images/advert_details_icon.svg';
import AdvertisementDetailsModalViewModel from '../viewModel';

interface AdvertDetailsTabProps {}
interface AdvertDetailsTabState {
  //具体设备列表表格头
  specificDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
  cashierDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
}

@observer
export default class AdvertDetailsTab extends React.Component<
  AdvertDetailsTabProps,
  AdvertDetailsTabState
> {
  private viewModel = DI.DIContainer.get<AdvertDetailsTabViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_TAB_VIEW_MODEL,
  );

  private advertDetailsModalViewModel = DI.DIContainer.get<AdvertisementDetailsModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_MODEL_VIEW_MODEL,
  );

  private materialRef = React.createRef<MaterialPreviewModal>();

  // private imgRef = React.createRef<MaterialPreviewModal>();

  // eslint-disable-next-line no-useless-constructor
  constructor(props: AdvertDetailsTabProps) {
    super(props);
    this.state = {
      specificDeviceListColums: [],
      cashierDeviceListColums: [],
    };
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
          dataIndex: 'groupName',
          key: 'groupName',
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
          dataIndex: 'groupName',
          key: 'groupName',
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

  componentWillUnmount(): void {
    const { initialData } = this.viewModel;
    initialData();
  }

  public render(): JSX.Element {
    const {
      switchDevice,
      advertisementDetailsData,
      srcList,
      setMaterialPreview,
      modalIndex,
      materialType,
      dataLengthAd,
      dataLengthCa,
      dataLengthLed,
    } = this.viewModel;
    const { name } = this.advertDetailsModalViewModel;
    return (
      <div className={style.advertDetailsTabContainer}>
        <Row>
          <Col span={24} className={style.bigTitle}>
            1、配置条件
          </Col>
          <Col span={12} className={style.title}>
            广告名称：<span>{advertisementDetailsData.adName}</span>
          </Col>
          <Col span={12} className={style.title}>
            播放日期：
            <span>
              {advertisementDetailsData.startDate}-{advertisementDetailsData.endDate}
            </span>
          </Col>
          <Col span={12} className={style.title}>
            广告周期：
            <span>{this.generateCycle()}</span>
          </Col>
          <Col span={12} className={style.title}>
            霸屏情况：<span>{this.generateLevelType(advertisementDetailsData.levelType)}</span>
          </Col>
          <Col span={24} className={style.title}>
            播放时段：<span>{this.generateTimeList()}</span>
          </Col>
        </Row>
        <div className={style.bigTitle}>2、{name}</div>
        <div className={style.deviceContainer}>
          <Tabs defaultActiveKey="1" onChange={switchDevice}>
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
        <div className={style.bigTitle}>3、素材内容</div>
        {advertisementDetailsData.materialList?.map((item, index) => {
          return (
            <Thumbnail
              type={item.type || UploadType.JPG}
              className={style.thumbnailMargin}
              sourceSrc={srcList[index]}
              title={this.generateField('title', index)}
              resolution={this.generateField('resolution', index)}
              interval={this.generateField('interval', index)}
              onPreview={(): void => {
                setMaterialPreview(this.materialRef, index);
              }}
            />
          );
        })}
        <MaterialPreviewModal
          url={srcList[modalIndex]}
          ref={this.materialRef}
          type={materialType[modalIndex] === UploadType.MP4 ? 'video' : 'image'}
        />
      </div>
    );
  }

  private generateCycle = (): string => {
    const { cycleCode, advertisementDetailsData } = this.viewModel;
    const data = cycleCode.find((item) => {
      return item.value === advertisementDetailsData.cycleType;
    });
    const weekDay = ['每周一', '每周二', '每周三', '每周四', '每周五', '每周六', '每周日'];
    const text: string[] = [];
    if (advertisementDetailsData.cycleWeekDay) {
      const arr = advertisementDetailsData.cycleWeekDay.split(',');
      arr.map((item: string): string[] => {
        text.push(weekDay[Number(item) - 1]);
        return text;
      });
    }
    return text.length > 1 ? `${text.join('/')}` : data?.meaning || '';
  };

  private generateLevelType = (record: string | undefined): string => {
    const { advertisementLevelCode } = this.viewModel;
    const data = advertisementLevelCode.find((item) => {
      return item.value === record;
    });
    return data?.meaning || '';
  };

  private generateTimeList = (): string => {
    const { advertisementDetailsData } = this.viewModel;
    let str = '';
    advertisementDetailsData.timeList?.forEach((item) => {
      str += `${item.cycleStartTime}-${item.cycleEndTime} / `;
    });
    str = str.substring(0, str.length - 2);
    return str;
  };

  private generateField = (type: string, indexProps: number): string => {
    const { advertisementDetailsData } = this.viewModel;
    let str = '';
    if (advertisementDetailsData.materialList && advertisementDetailsData.materialList.length > 0) {
      advertisementDetailsData.materialList.map((item, index) => {
        if (type === 'title' && indexProps === index) {
          str = item.name || '';
        }
        if (type === 'resolution' && indexProps === index) {
          str = item.resolution ? `${item.resolution}px` : '';
        }
        if (type === 'interval' && indexProps === index) {
          str = item.duration ? `${item.duration}s` : '0s';
        }
        return null;
      });
    }
    return str;
  };

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
          <img src={advertDetailsIcon} alt="" />
          <span>
            具体设备：{specificDeviceListData.storeNumber}个项目/门店，
            {specificDeviceListData.deviceNumber}台设备
          </span>
        </div>
        <Table
          pagination={{
            size: 'small',
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total): string => `共 ${total} 条`,
            total: specificDeviceListData.page?.totalElements,
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
}
