/*
 * @Author: wuhao
 * @Date: 2021-12-01 15:29:12
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:57:27
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Table, Tabs, Modal, Button, Form, Radio, Input } from 'antd';
import style from './style.less';

import DI from '../../../inversify.config';
import { APPROVE_IDENTIFIER } from '../../../constants/identifiers';
import NoticeApproveModalViewModel, {
  SpecificDeviceDataConfig,
  NoticePreviewProps,
  FormDataConfig,
  ApproveStatus,
} from './viewModel';
import NoticeApproveListViewModel from '../noticeApproveList/viewModel';
import NoticePreview from '../../../common/components/noticePreview';
import advertDetailsIcon from '../../../assets/images/results_icon.svg';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import FormItemTitle from '../../../common/components/formItemTitle/index';
import { DeviceType } from '../../../common/config/commonConfig';
import utils from '../../../utils/index';

interface NoticeApproveModalProps {}
interface NoticeApproveModalState {
  //具体设备列表表格头
  specificDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
  cashierDeviceListColums: ColumnProps<SpecificDeviceDataConfig>[];
}

@observer
export default class NoticeApproveModal extends React.Component<
  NoticeApproveModalProps,
  NoticeApproveModalState
> {
  private viewModel = DI.DIContainer.get<NoticeApproveModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_NOTICE_APPROVE_VIEW_MODEL,
  );

  private noticeApproveListViewModel = DI.DIContainer.get<NoticeApproveListViewModel>(
    APPROVE_IDENTIFIER.NOTICE_APPROVE_LIST_VIEW_MODEL,
  );

  constructor(props: NoticeApproveModalProps) {
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
          dataIndex: 'groupStr',
          key: 'groupStr',
          align: 'left',
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
          dataIndex: 'groupStr',
          key: 'groupStr',
          align: 'left',
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
      noticeDetailsData,
      noticeApproveModalVisible,
      setNoticeApproveModalVisible,
      onFinish,
      radioChange,
      approveStatus,
      dataLengthAd,
      dataLengthCa,
      dataLengthLed,
    } = this.viewModel;
    return (
      <Modal
        visible={noticeApproveModalVisible}
        width={750}
        closable={false}
        footer={null}
        wrapClassName={style.noticeApproveModalContainer}
        destroyOnClose
        onCancel={(): void => setNoticeApproveModalVisible()}
      >
        <div className={style.noticeApproveModalContent}>
          <div className={style.modalHeader}>
            审批
            <Button type="text" onClick={(): void => setNoticeApproveModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.noticeApproveContainer}>
            <FormItemTitle title="通知详情" />
            <Row>
              <Col span={24} className={style.bigTitle}>
                1、配置条件
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
                展示时长：<span>{utils.transferTime(Number(noticeDetailsData.duration))}</span>
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
          </div>
          <FormItemTitle title="审批" className={style.paddingBottomSpace} />
          <Form
            onFinish={(values: FormDataConfig): void => {
              onFinish(values, this.noticeApproveListViewModel);
            }}
          >
            <Form.Item
              label="审批结果"
              name="approveResult"
              rules={[{ required: true, message: '请选择审批结果' }]}
              className={style.cycle}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 7 }}
            >
              <Radio.Group onChange={(e): void => radioChange(e.target.value)}>
                <Radio value="PASSED">通过</Radio>
                <Radio value="REJECTED">驳回</Radio>
              </Radio.Group>
            </Form.Item>
            {approveStatus === ApproveStatus.Rejected && (
              <Form.Item name="content" className={style.cycle}>
                <Input.TextArea showCount maxLength={50} rows={4} placeholder="请输入驳回原因" />
              </Form.Item>
            )}
            <div className={style.bottomButton}>
              <Button type="primary" ghost onClick={(): void => setNoticeApproveModalVisible()}>
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
