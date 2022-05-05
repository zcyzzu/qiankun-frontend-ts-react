/*
 * @Author: wuhao
 * @Date: 2021-12-01 15:17:52
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 17:03:36
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Table, Tabs, Modal, Button, Form, Radio, Input, Tooltip } from 'antd';
import style from './style.less';

import DI from '../../../inversify.config';
import { APPROVE_IDENTIFIER } from '../../../constants/identifiers';
import AdvertisementApproveModalViewModel, { SpecificDeviceDataConfig } from './viewModel';
import Thumbnail from '../../../common/components/thumbnail/index';
import { DeviceType, UploadType } from '../../../common/config/commonConfig';
import { ApproveStatus } from '../noticeApproveModal/viewModel';
import advertDetailsIcon from '../../../assets/images/results_icon.svg';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import FormItemTitle from '../../../common/components/formItemTitle/index';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';
import AdvertisementApproveListViewModel from '../advertisementApproveList/viewModel';

interface AdvertisementApproveProps {}
interface AdvertisementApproveState {
  //具体设备列表表格头
  specificDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
  cashierDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
}

@observer
export default class AdvertisementApproveModal extends React.Component<
  AdvertisementApproveProps,
  AdvertisementApproveState
> {
  private viewModel = DI.DIContainer.get<AdvertisementApproveModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_ADVERTISEMENT_APPROVE_VIEW_MODEL,
  );

  private advertisementApproveListViewModel = DI.DIContainer.get<AdvertisementApproveListViewModel>(
    APPROVE_IDENTIFIER.ADVERTISEMENT_APPROVE_LIST_VIEW_MODEL,
  );

  private materialRef = React.createRef<MaterialPreviewModal>();

  // eslint-disable-next-line no-useless-constructor
  constructor(props: AdvertisementApproveProps) {
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
        },
        {
          title: '所在楼层',
          dataIndex: 'floor',
          key: 'floor',
          align: 'left',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          render: (record): JSX.Element => (
            <Tooltip title={record}>
              <span className={style.groupName}>{record}</span>
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
        },
        {
          title: '品牌业态',
          dataIndex: 'brandFormat',
          key: 'brandFormat',
          align: 'left',
        },
        {
          title: '点位品牌名称',
          dataIndex: 'pointBrandName',
          key: 'pointBrandName',
          align: 'left',
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          render: (record): JSX.Element => (
            <Tooltip title={record}>
              <span className={style.groupName}>{record}</span>
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

  public render(): JSX.Element {
    const {
      switchDevice,
      advertisementApproveModalVisible,
      setAdvertisementApproveModalVisible,
      formOnFinish,
      advertisementDetailsData,
      radioChange,
      approveStatus,
      srcList,
      setMaterialPreview,
      modalIndex,
      materialType,
      dataLengthAd,
      dataLengthCa,
      dataLengthLed,
    } = this.viewModel;
    return (
      <Modal
        visible={advertisementApproveModalVisible}
        width={650}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setAdvertisementApproveModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            审批
            <Button type="text" onClick={(): void => setAdvertisementApproveModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.advertDetailsTabContainer}>
            <FormItemTitle title="广告详情" />
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
                广告周期：<span>{this.generateCycle()}</span>
              </Col>
              <Col span={12} className={style.title}>
                霸屏情况：<span>{this.generateLevelType(advertisementDetailsData.levelType)}</span>
              </Col>
              <Col span={24} className={style.title}>
                播放时段：<span>{this.generateTimeList()}</span>
              </Col>
            </Row>
            <div className={style.bigTitle}>2、发布设备</div>
            <div className={style.deviceContainer}>
              <Tabs defaultActiveKey="1" onChange={switchDevice}>
                <Tabs.TabPane
                  tab={`${dataLengthAd !== 0 ? `广告机（${dataLengthAd}台）` : '广告机'}`}
                  key={DeviceType.Advertisement}
                >
                  {this.generateDeviceList()}
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={`${dataLengthCa !== 0 ? `收银机（${dataLengthCa}台）` : '收银机'}`}
                  key={DeviceType.Cashier}
                >
                  {this.generateDeviceList()}
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={`${dataLengthLed !== 0 ? `LED（${dataLengthLed}台）` : 'LED'}`}
                  key={DeviceType.Led}
                >
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
          <FormItemTitle title="审批" className={style.paddingBottomSpace} />
          <Form
            onFinish={(values): void => (
              formOnFinish(values, this.advertisementApproveListViewModel)
            )}
          >
            <Form.Item
              label="审批结果"
              name="results"
              rules={[{ required: true, message: '请选择审批结果' }]}
              className={style.cycle}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 21 }}
            >
              <Radio.Group onChange={(e): void => radioChange(e.target.value)}>
                <Radio value="PASSED">通过</Radio>
                <Radio value="REJECTED">驳回</Radio>
              </Radio.Group>
            </Form.Item>
            {approveStatus === ApproveStatus.Rejected && (
              <Form.Item name="cause" className={style.cycle}>
                <Input.TextArea showCount maxLength={50} rows={4} placeholder="请输入驳回原因" />
              </Form.Item>
            )}
            <div className={style.bottomButton}>
              <Button
                type="primary"
                ghost
                onClick={(): void => setAdvertisementApproveModalVisible()}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}
