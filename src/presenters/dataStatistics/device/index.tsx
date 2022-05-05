/*
 * @Author: tongyuqiang
 * @Date: 2021-11-22 09:42:27
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 17:02:05
 */

import React from 'react';
import { runInAction } from 'mobx';
import { throttle } from 'lodash';
import { observer } from 'mobx-react';
import {
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  RadioChangeEvent,
  Button,
  Tooltip,
  Modal,
  Form,
  InputNumber,
} from 'antd';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import style from './style.less';

import DI from '../../../inversify.config';
import { DATA_STATISTICS_IDENTIFIER } from '../../../constants/identifiers';
import DeviceStatisticsViewModel from './viewModel';
import OrganizationTree from '../../../common/components/organizationTree/index';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import { DeviceType } from '../../../common/config/commonConfig';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import MinEcharts from '../../../common/components/minEcharts/index';
import DeviceEditModal from '../../device/deviceEditModal/index';
import DeviceStatisticsOneIcon from '../../../assets/images/device_statistics_one_icon.svg';
import DeviceStatisticsTwoIcon from '../../../assets/images/device_statistics_two_icon.svg';
import LineIcon from '../../../assets/images/line_icon.svg';
import LineIconActivity from '../../../assets/images/line_icon_activity.svg';
import BarIcon from '../../../assets/images/bar_icon.svg';
import BarIconActivity from '../../../assets/images/bar_icon_activity.svg';
import ExportIcon from '../../../assets/images/export_icon.svg';
import TimeTooips from '../../../assets/images/time_tooips.svg';
import CloseIcon from '../../../assets/images/close_icon_normal.svg';
import datePickerRightIcon from '../../../assets/images/date_picker_right.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';

interface DeviceStatisticsProps {}

interface DeviceStatisticsState {
  dates: any | RangeValue<Moment>[];
  exportDates: any | RangeValue<Moment>[];
}
const { DEVICE_STATISTICS } = PERMISSIONS_CODES;

@observer
export default class DeviceStatistics extends React.Component<
  DeviceStatisticsProps,
  DeviceStatisticsState
> {
  private viewModel = DI.DIContainer.get<DeviceStatisticsViewModel>(
    DATA_STATISTICS_IDENTIFIER.DEVICE_STATISTICS_VIEW_MODEL,
  );
  private treeWrapperRef = React.createRef<HTMLDivElement>();
  private orgTreeDom = React.createRef<HTMLDivElement>();

  constructor(props: DeviceStatisticsProps) {
    super(props);
    this.state = {
      dates: [],
      exportDates: [],
    };
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { OVERVIEW, TODAY_DATA, HISTORY_DATA, EXPORT } = DEVICE_STATISTICS;
    try {
      const permissionsData = await getPermissionsData([
        OVERVIEW,
        TODAY_DATA,
        HISTORY_DATA,
        EXPORT,
      ]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };
  private handleresize = throttle((): void => {
    if (this.orgTreeDom.current) {
      this.orgTreeDom.current.style.height = `${this.treeWrapperRef.current?.clientHeight}px`;
    }
  }, 1000);
  async componentDidMount(): Promise<void> {
    const {
      getDeviceTodayOnlineData,
      getDeviceDistributionData,
      getDeviceFloorDistributionData,
      getDeviceHistoryOnlineRate,
      getLookupsValue,
      getDeviceOnlineStatus,
      getDevicePlayRateData,
    } = this.viewModel;
    await this.getPermissonData();
    getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.DEVICE_STATISTICS_CODE);
    getLookupsValue(LookupsCodeTypes.DEVICE_PLAY_RATE_CODE);
    getDeviceOnlineStatus();
    getDevicePlayRateData();
    getDeviceTodayOnlineData();
    getDeviceDistributionData();
    getDeviceFloorDistributionData();
    getDeviceHistoryOnlineRate();
    window.addEventListener('resize', this.handleresize.bind(this));
    // window.onresize = throttle((): void => {
    //   if (this.orgTreeDom.current) {
    //     this.orgTreeDom.current.style.height = `${this.treeWrapperRef.current?.clientHeight}px`;
    //   }
    // }, 1000);
  }
  componentWillUnmount(): void {
    // window.onresize = null;
    window.removeEventListener('resize', this.handleresize.bind(this));
  }
  private getCurrentSelected(e: OrganizationListEntity): void {
    const { getId, deviceHistoryTimeChange, initialData } = this.viewModel;
    getId(e.unitId, e.storeId);
    this.setState({
      dates: [],
      exportDates: [],
    });
    deviceHistoryTimeChange(30);
    initialData();
  }

  public render(): JSX.Element {
    const {
      deviceTypeOptions,
      devicePlayOptions,
      deviceFloorOptions,
      deviceOnlineStatusOptions,
      deviceOnlineRateOptions,
      deviceOnlineChartType,
      chartTypeChange,
      deviceHistoryOptions,
      deviceHistoryChartType,
      deviceHistoryTimeChange,
      datePickerChange,
      selectTypeChange,
      exportData,
      exportModalVisible,
      setExportModalVisible,
      formOnFinish,
      pageNum,
      totalPage,
      setUp,
      setNext,
      deviceOnlineStatusData,
      deviceOnlineStatisticsCode,
      deviceHistorySearchParams,
      deviceTypeCode,
      // isDevicePlay,
      permissionsData,
      playRateSelectType,
      historyDeviceOnlineSelectType,
    } = this.viewModel;
    const { OVERVIEW, TODAY_DATA, HISTORY_DATA, EXPORT } = DEVICE_STATISTICS;
    const { dates } = this.state;

    return (
      <div className={style.adStatisticsContainer}>
        <div
          className={style.adStatisticsLeftPage}
          ref={this.orgTreeDom}
          // style={{ height: this.treeWrapperRef.current?.clientHeight }}
        >
          <OrganizationTree
            treeWrapper={style.treeWrapper}
            showLine={{ showLeafIcon: false }}
            getCurrentSelectedInfo={(TreeData: OrganizationListEntity): void => {
              this.getCurrentSelected(TreeData);
            }}
          />
        </div>
        <div className={style.adStatisticsPage} ref={this.treeWrapperRef}>
          {permissionsData[OVERVIEW] && (
            <>
              <Row gutter={24}>
                {deviceOnlineStatusData.map((item, index) => {
                  const codeData = deviceOnlineStatisticsCode.find((codeItem) => {
                    return codeItem.value === item.code;
                  });
                  return (
                    <Col span={6}>
                      <Tooltip
                        placement="right"
                        title={`${codeData?.meaning}${
                          typeof item.value === 'string'
                            ? `${this.countTimes(Number(item.value))}台`
                            : `${item.value}%`
                        }`}
                        color="#1e252d"
                      >
                        <div className={this.generateClass(index)}>
                          <img
                            className={style.bgImg}
                            src={
                              index === 0 || index === 1
                                ? DeviceStatisticsOneIcon
                                : DeviceStatisticsTwoIcon
                            }
                            alt=""
                          />
                          <div className={style.content}>
                            <Row>
                              <Col className={style.chartTitle}>{codeData?.meaning}</Col>
                            </Row>
                            <Row>
                              <Col className={style.number}>
                                <span>
                                  {typeof item.value === 'string'
                                    ? `${this.countTimes(Number(item.value))}`
                                    : `${item.value}%`}
                                </span>
                                {typeof item.value === 'string' && '台'}
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Tooltip>
                    </Col>
                  );
                })}
              </Row>
              <Row gutter={24} className={style.topCharts}>
                <Col span={8} className={style.trendChartLeft}>
                  <MinEcharts options={deviceTypeOptions} />
                </Col>
                <Col span={8} className={style.trendChart}>
                  <div className={style.deviceFloorContainer}>
                    <Row className={style.trendTitle}>
                      <Col span={14} className={style.playRateTitle}>
                        <span style={{ fontSize: '16px', margin: 0, color: '#333333' }}>
                          当前设备广告播放利用率
                        </span>
                      </Col>
                      <Col span={10} className={style.trendTitleBtn}>
                        <Select
                          // suffixIcon={<img src={selectArrowIcon} alt="" />}
                          // bordered={false}
                          value={playRateSelectType}
                          style={{ width: '100px', textAlign: 'left' }}
                          onChange={(value: string): void => selectTypeChange(value, 'play')}
                          getPopupContainer={(triggerNode): HTMLElement => (
                            triggerNode.parentElement || triggerNode
                          )}
                        >
                          <Select.Option value="all">全部类型</Select.Option>
                          {deviceTypeCode.map((item, index) => {
                            if (item.value === DeviceType.Raspberry) {
                              return null;
                            }
                            return (
                              <Select.Option value={item.value} key={`device_type_${index}`}>
                                {item.meaning}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                    <Row className={style.devicePlay}>
                      <Col span={24}>
                        <MinEcharts options={devicePlayOptions} boxShadow={false} />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col span={8} className={style.trendChartRight}>
                  <div className={style.deviceFloorContainer}>
                    <div
                      className={`${style.changePage} ${1 < 0 &&
                        style.changeOpacity} ${!totalPage && style.hidden}`}
                    >
                      <span
                        onClick={setUp}
                        className={`${style.changePageSet} ${pageNum === 1 && style.changeDisable}`}
                      >
                        {'<'}
                      </span>
                      <span className={style.changePageNum}>
                        {pageNum}/ {totalPage}
                      </span>
                      <span
                        onClick={setNext}
                        className={`${style.changePageSet} ${pageNum === totalPage &&
                          style.changeDisable}`}
                      >
                        {'>'}
                      </span>
                    </div>
                    <MinEcharts options={deviceFloorOptions} />
                  </div>
                </Col>
              </Row>
            </>
          )}
          {permissionsData[TODAY_DATA] && (
            <Row gutter={24} className={style.deviceOnlineTrend}>
              <Col span={12} className={style.deviceOnlineStatus}>
                <MinEcharts options={deviceOnlineStatusOptions} />
              </Col>
              <Col span={12} className={style.trendChartRight}>
                <Row className={style.trendTitle}>
                  <Col span={10}>
                    <span style={{ fontSize: '16px', margin: 0, color: '#333333' }}>
                      今日设备在线率
                    </span>
                  </Col>
                  <Col span={14} className={style.trendTitleBtn}>
                    <Radio.Group
                      value={deviceOnlineChartType}
                      onChange={(e: RadioChangeEvent): void => chartTypeChange(e, 'today')}
                    >
                      <Radio.Button value="line">
                        {deviceOnlineChartType === 'line' ? (
                          <img src={LineIconActivity} alt="" />
                        ) : (
                          <img src={LineIcon} alt="" />
                        )}
                      </Radio.Button>
                      <Radio.Button value="bar">
                        {deviceOnlineChartType === 'bar' ? (
                          <img src={BarIconActivity} alt="" />
                        ) : (
                          <img src={BarIcon} alt="" />
                        )}
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
                <Row className={style.deviceOnline}>
                  <Col span={24}>
                    <MinEcharts options={deviceOnlineRateOptions} boxShadow={false} />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          {permissionsData[HISTORY_DATA] && (
            <Row className={style.deviceHistoryOnlineTrend}>
              <Col span={24} className={style.trendTitle}>
                <Row>
                  <Col span={4}>
                    <span style={{ fontSize: '16px', margin: 0, color: '#333333' }}>
                      历史设备在线率
                    </span>
                  </Col>
                  <Col span={20} className={style.trendTitleBtn}>
                    <Select
                      value={historyDeviceOnlineSelectType}
                      style={{ width: '100px' }}
                      onChange={(value: string): void => selectTypeChange(value, 'history')}
                      getPopupContainer={(triggerNode): HTMLElement => (
                        triggerNode.parentElement || triggerNode
                      )}
                    >
                      <Select.Option value="all">全部类型</Select.Option>
                      {deviceTypeCode.map((item, index) => {
                        if (item.value === DeviceType.Raspberry) {
                          return null;
                        }
                        return (
                          <Select.Option value={item.value} key={`device_type_${index}`}>
                            {item.meaning}
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <Radio.Group
                      value={deviceHistorySearchParams.dayType}
                      onChange={(e): void => {
                        this.setState({
                          dates: [],
                        });
                        deviceHistoryTimeChange(e.target.value);
                      }}
                      className={style.timeBtn}
                      defaultValue={30}
                    >
                      <Radio.Button value={30}>近30天 </Radio.Button>
                      <Radio.Button value={7}>近7天</Radio.Button>
                    </Radio.Group>
                    <DatePicker.RangePicker
                      suffixIcon={<img src={datePickerRightIcon} alt="" />}
                      className={style.timeBtn}
                      format="YYYY-MM-DD"
                      placeholder={['开始时间', '结束时间']}
                      onChange={(date: RangeValue<moment.Moment>): void => {
                        datePickerChange(date);
                        if (!date) {
                          deviceHistoryTimeChange(30);
                        }
                      }}
                      getPopupContainer={(triggerNode): HTMLElement => (
                        triggerNode.parentElement || triggerNode
                      )}
                      value={dates}
                      disabledDate={(current): boolean => this.generateDisabledDate(current)}
                      onCalendarChange={(val: RangeValue<Moment>): void => {
                        this.setState({
                          dates: val,
                        });
                      }}
                      // onOpenChange={this.onOpenChange}
                    />
                    <Tooltip title="导出">
                      <Button
                        type="text"
                        shape="circle"
                        className={style.exportBtn}
                        onClick={exportData}
                      >
                        <img className={style.bgImgExport} src={ExportIcon} alt="" />
                      </Button>
                    </Tooltip>
                    <Radio.Group
                      value={deviceHistoryChartType}
                      onChange={(e: RadioChangeEvent): void => chartTypeChange(e, 'history')}
                    >
                      <Radio.Button value="line">
                        {deviceHistoryChartType === 'line' ? (
                          <img src={LineIconActivity} alt="" />
                        ) : (
                          <img src={LineIcon} alt="" />
                        )}
                      </Radio.Button>
                      <Radio.Button value="bar">
                        {deviceHistoryChartType === 'bar' ? (
                          <img src={BarIconActivity} alt="" />
                        ) : (
                          <img src={BarIcon} alt="" />
                        )}
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className={style.trendChart}>
                <MinEcharts options={deviceHistoryOptions} boxShadow={false} />
              </Col>
            </Row>
          )}
          {permissionsData[EXPORT] && (
            <div className={style.details}>
              离线设备信息详单
              <span onClick={(): void => setExportModalVisible()}>详单导出</span>
            </div>
          )}
        </div>
        <Modal
          visible={exportModalVisible}
          width={477}
          closable={false}
          footer={null}
          wrapClassName={style.exportModalContainer}
          destroyOnClose
          onCancel={(): void => setExportModalVisible()}
        >
          <div className={style.exportModalContent}>
            <div className={style.modalHeader}>
              详单导出
              <Button
                className={style.cancelBtn}
                type="text"
                onClick={(): void => setExportModalVisible()}
              >
                <img src={CloseIcon} alt="" />
              </Button>
            </div>
            <Form onFinish={formOnFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Form.Item
                label={(
                  <div>
                    日期区间
                    <Tooltip placement="top" title="提示：选择的日期区间需小于3个月内">
                      <img className={style.timeImg} src={TimeTooips} alt="" />
                    </Tooltip>
                  </div>
                )}
                name="time"
                rules={[{ required: true, message: '请选择日期区间' }]}
              >
                <DatePicker.RangePicker
                  suffixIcon={<img src={datePickerRightIcon} alt="" />}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  disabledDate={(current): boolean => this.generateExportDisabledDate(current)}
                  onCalendarChange={(val: RangeValue<Moment>): void => {
                    this.setState({
                      exportDates: val,
                    });
                  }}
                  // onOpenChange={this.onOpenChange}
                />
              </Form.Item>
              <div className={style.position}>
                <Form.Item
                  label={(
                    <div>
                      离线超过
                      <div className={style.timeoutLabel} />
                    </div>
                  )}
                  name="hours"
                  rules={[{ required: true, message: '请输入时间' }]}
                  initialValue={1}
                >
                  <InputNumber
                    placeholder="请输入数字"
                    defaultValue={1}
                    style={{ width: '100%' }}
                    min={1}
                    max={1000}
                    precision={0}
                    addonAfter={<span>小时</span>}
                  />
                </Form.Item>
              </div>
              <div className={style.bottomButton}>
                <Button type="primary" ghost onClick={(): void => setExportModalVisible()}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  导出
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
        <DeviceEditModal />
      </div>
    );
  }

  private generateClass = (index: number): string => {
    if (index === 0) {
      return style.bgColor0;
    }
    if (index === 1) {
      return style.bgColor1;
    }
    if (index === 2) {
      return style.bgColor2;
    }
    if (index === 3) {
      return style.bgColor3;
    }
    return style.bgColor0;
  };

  private generateDisabledDate = (current: Moment): boolean => {
    const { dates } = this.state;
    if (!dates || dates.length === 0) {
      return current && current > moment().subtract(1, 'day');
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 29;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 29;
    return current > moment().subtract(1, 'day') || tooEarly || tooLate;
  };

  // 详单导出禁用时间
  private generateExportDisabledDate = (current: Moment): boolean => {
    const { exportDates } = this.state;
    if (!exportDates || exportDates.length === 0) {
      return current && current > moment().subtract(1, 'day');
    }
    const tooLate = exportDates[0] && current.diff(exportDates[0], 'days') > 89;
    const tooEarly = exportDates[1] && exportDates[1].diff(current, 'days') > 89;
    return current > moment().subtract(1, 'day') || tooEarly || tooLate;
  };

  private countTimes(count: number): string {
    if (count > 10000) {
      return `${(count / 10000).toFixed(2)}万`;
    }
    return count.toString();
  }

  // 弹出日历和关闭日历的回调
  // private onOpenChange = (): void => {
  //   this.setState({
  //     dates: [],
  //   })
  // };
}
