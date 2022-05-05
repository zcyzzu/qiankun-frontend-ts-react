/*
 * @Author: wuhao
 * @Date: 2021-11-22 09:40:55
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 17:02:42
 */

import React from 'react';
import { observer } from 'mobx-react';
import { isEmpty, throttle } from 'lodash';
import { runInAction } from 'mobx';
import { Row, Col, Radio, DatePicker, Tooltip } from 'antd';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import style from './style.less';

import MinEcharts from '../../../common/components/minEcharts/index';
import weekTask from '../../../assets/images/week_task.svg';
import weekNotice from '../../../assets/images/week_notice.svg';
import weekPlay from '../../../assets/images/week_play.svg';
import lastWeekPlay from '../../../assets/images/last_week_play.svg';
import barChart from '../../../assets/images/bar_chart.svg';
import lineChart from '../../../assets/images/line_chart.svg';
import barChartSele from '../../../assets/images/bar_chart_selected.svg';
import lineChartSele from '../../../assets/images/line_chart_selected.svg';
import exportStatistics from '../../../assets/images/export_statistics.svg';
import datePickerRightIcon from '../../../assets/images/date_picker_right.svg';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';

import DI from '../../../inversify.config';
import { DATA_STATISTICS_IDENTIFIER } from '../../../constants/identifiers';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import OrganizationTree from '../../../common/components/organizationTree/index';
import AdvertStatisticsViewModel from './viewModel';
import ExportModalViewModel from './exportModal/viewModel';
import ExportModal from './exportModal/index';

const { RangePicker } = DatePicker;

interface StatisticsProps {}

interface StatisticsState {
  dates: any | RangeValue<Moment>[];
  times: any | RangeValue<Moment>[];
}
const { AD_STATISTICS } = PERMISSIONS_CODES;

@observer
export default class AdvertStatistics extends React.Component<StatisticsProps, StatisticsState> {
  private viewModel = DI.DIContainer.get<AdvertStatisticsViewModel>(
    DATA_STATISTICS_IDENTIFIER.ADVERT_STATISTICS_VIEW_MODEL,
  );

  private exportModalViewModel = DI.DIContainer.get<ExportModalViewModel>(
    DATA_STATISTICS_IDENTIFIER.ADVERT_STATISTICS_EXPORT_VIEW_MODEL,
  );
  private treeWrapperRef = React.createRef<HTMLDivElement>();
  private orgTreeDom = React.createRef<HTMLDivElement>();

  constructor(props: StatisticsProps) {
    super(props);
    this.state = {
      dates: [],
      times: [],
    };
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const {
      AD_TASK,
      NOTICE_TASK,
      AD_PLAY,
      WEEK_AD_PLAY,
      TODAY_DATA,
      HISTORY_DATA,
      EXPORT,
    } = AD_STATISTICS;
    try {
      const permissionsData = await getPermissionsData([
        AD_TASK,
        NOTICE_TASK,
        AD_PLAY,
        WEEK_AD_PLAY,
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
    // window.onresize = throttle((): void => {
    //   if (this.orgTreeDom.current) {
    //     this.orgTreeDom.current.style.height = `${this.treeWrapperRef.current?.clientHeight}px`;
    //   }
    // }, 1000);
    window.addEventListener('resize', this.handleresize.bind(this));
    const { getTaskData, getPlayData, getTodayPlayData, getDeviceOnlineStatus } = this.viewModel;
    await this.getPermissonData();
    getDeviceOnlineStatus();
    getTodayPlayData();
    getPlayData(30, undefined);
    getTaskData(30, undefined);
  }
  componentWillUnmount(): void {
    // window.onresize = null;
    window.removeEventListener('resize', this.handleresize.bind(this));
  }

  // 弹出日历和关闭日历的回调
  private onOpenChange = (): void => {
    // this.setState({
    // dates: [],
    // })
  };
  private generateDisabledDate = (current: Moment): boolean => {
    const { dates } = this.state;
    if (!dates || dates.length === 0) {
      return current && current > moment().subtract(1, 'day');
    }

    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return current > moment().subtract(1, 'day') || tooEarly || tooLate;
  };

  private getCurrentSelected(e: OrganizationListEntity): void {
    const {
      getUnitId,
      getStoreId,
      getTaskData,
      getPlayData,
      getTodayPlayData,
      getDeviceOnlineStatus,
      initialize,
    } = this.viewModel;
    if (!isEmpty(e)) {
      if (e.unitId) {
        getUnitId(e.unitId);
      } else if (e.storeId) {
        getStoreId(e.storeId);
      }
    }
    // getUnitId(e.unitId || undefined);
    getDeviceOnlineStatus();
    getTodayPlayData();
    getPlayData(30, undefined);
    getTaskData(30, undefined);
    initialize();
    this.setState({
      dates: [],
      times: [],
    });
  }

  private noticeExport(): void {
    const { unitId, storeId } = this.viewModel;
    const { setExportModalVisible } = this.exportModalViewModel;
    setExportModalVisible(unitId, storeId);
  }

  private countTimes(count: number): string {
    if (count > 10000) {
      return `${(count / 10000).toFixed(2)}万`;
    }
    return count.toString();
  }
  public render(): JSX.Element {
    const {
      advertisementData,
      todayPlayOptions,
      todayPlayChartType,
      playOptions,
      playChartTime,
      playChartType,
      taskOptions,
      taskChartType,
      taskChartTime,
      taskChartTypeChange,
      taskChartTimeChange,
      taskTimeScreen,
      dayExportData,
      permissionsData,
    } = this.viewModel;
    const {
      AD_TASK,
      NOTICE_TASK,
      AD_PLAY,
      WEEK_AD_PLAY,
      TODAY_DATA,
      HISTORY_DATA,
      EXPORT,
    } = AD_STATISTICS;
    const { dates, times } = this.state;
    return (
      <div className={style.advertStatisticsContainer}>
        <div
          className={style.tree}
          ref={this.orgTreeDom}
          // style={{ height: this.treeWrapperRef.current?.clientHeight }}
        >
          <OrganizationTree
            treeWrapper={style.warrper}
            showLine={{ showLeafIcon: false }}
            getCurrentSelectedInfo={(e: OrganizationListEntity): void => this.getCurrentSelected(e)}
          />
        </div>
        <div className={style.statistics} ref={this.treeWrapperRef}>
          <Row gutter={24} className={style.dataOverview}>
            {permissionsData[AD_TASK] && (
              <Col span={6}>
                <Tooltip
                  placement="right"
                  title={`本周广告任务${advertisementData.thisWeekAdNum}条`}
                  color="#1e252d"
                >
                  <div className={`${style.task} ${style.bgColorTask}`}>
                    <img className={style.bgImg} src={weekTask} alt="" />
                    <div className={style.taskContent}>
                      <Row>
                        <Col className={style.title}>本周广告任务</Col>
                      </Row>
                      <Row>
                        <Col className={style.number}>
                          <span>
                            {advertisementData.thisWeekAdNum
                              ? this.countTimes(Number(advertisementData.thisWeekAdNum))
                              : '0'}
                          </span>
                          条
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tooltip>
              </Col>
            )}
            {permissionsData[NOTICE_TASK] && (
              <Col span={6}>
                <Tooltip
                  placement="right"
                  title={`本周紧急通知${advertisementData.thisWeekNoticeNum}条`}
                  color="#1e252d"
                >
                  <div className={`${style.task} ${style.bgColorNotice}`}>
                    <img className={style.bgImg} src={weekNotice} alt="" />
                    <div className={style.taskContent}>
                      <Row>
                        <Col className={style.title}>本周紧急通知</Col>
                      </Row>
                      <Row>
                        <Col className={style.number}>
                          <span>
                            {advertisementData.thisWeekNoticeNum
                              ? this.countTimes(Number(advertisementData.thisWeekNoticeNum))
                              : '0'}
                          </span>
                          条
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tooltip>
              </Col>
            )}
            {permissionsData[AD_PLAY] && (
              <Col span={6}>
                <Tooltip
                  placement="right"
                  title={`本周广告播放次数${advertisementData.thisWeekAdPlayNum}次`}
                  color="#1e252d"
                >
                  <div className={`${style.task} ${style.bgColorPlay}`}>
                    <img className={style.bgImg} src={weekPlay} alt="" />
                    <div className={style.taskContent}>
                      <Row>
                        <Col className={style.title}>本周广告播放次数</Col>
                      </Row>
                      <Row>
                        <Col className={style.number}>
                          <span>
                            {advertisementData.thisWeekAdPlayNum
                              ? this.countTimes(Number(advertisementData.thisWeekAdPlayNum))
                              : '0'}
                          </span>
                          次
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tooltip>
              </Col>
            )}
            {permissionsData[WEEK_AD_PLAY] && (
              <Col span={6}>
                <Tooltip
                  placement="right"
                  title={`上周广告播放次数${advertisementData.lastWeekAdPlayNum}次`}
                  color="#1e252d"
                >
                  <div className={`${style.task} ${style.bgColorLastPlay}`}>
                    <img className={style.bgImg} src={lastWeekPlay} alt="" />
                    <div className={style.taskContent}>
                      <Row>
                        <Col className={style.title}>上周广告播放次数</Col>
                      </Row>
                      <Row>
                        <Col className={style.number}>
                          <span>
                            {advertisementData.lastWeekAdPlayNum
                              ? this.countTimes(Number(advertisementData.lastWeekAdPlayNum))
                              : '0'}
                          </span>
                          次
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tooltip>
              </Col>
            )}
          </Row>
          {permissionsData[TODAY_DATA] && (
            <Row className={style.trend}>
              <Col span={24} className={style.trendTitle}>
                <Row>
                  <Col span={5}>
                    <div className={style.chartsTitle}>今日播放次数统计（次）</div>
                  </Col>
                  <Col span={19} className={style.trendTitleBtn}>
                    <Tooltip title="导出">
                      <span onClick={(): void => dayExportData('dayPlay')}>
                        <img className={style.bgImgExport} src={exportStatistics} alt="" />
                      </span>
                    </Tooltip>
                    <Radio.Group
                      value={todayPlayChartType}
                      onChange={(e): void => taskChartTypeChange(e, 'todayPlay')}
                    >
                      <Radio.Button value="line">
                        {todayPlayChartType === 'line' ? (
                          <img className={style.bgImg} src={lineChartSele} alt="" />
                        ) : (
                          <img className={style.bgImg} src={lineChart} alt="" />
                        )}
                      </Radio.Button>
                      <Radio.Button value="bar">
                        {todayPlayChartType === 'bar' ? (
                          <img className={style.bgImg} src={barChartSele} alt="" />
                        ) : (
                          <img className={style.bgImg} src={barChart} alt="" />
                        )}
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
              <Col span={24} className={style.trendChart}>
                <MinEcharts options={todayPlayOptions} boxShadow={false} />
              </Col>
            </Row>
          )}
          {permissionsData[HISTORY_DATA] && (
            <>
              <Row className={style.trend}>
                <Col span={24} className={style.trendTitle}>
                  <Row>
                    <Col span={5}>
                      <div className={style.chartsTitle}>历史播放次数统计（次）</div>
                    </Col>
                    <Col span={19} className={style.trendTitleBtn}>
                      <Radio.Group
                        value={playChartTime}
                        onChange={(e): void => {
                          this.setState({
                            dates: [],
                          });
                          taskChartTimeChange(e, 'play');
                        }}
                        className={style.timeBtn}
                        defaultValue={30}
                      >
                        <Radio.Button value={30}>近30天</Radio.Button>
                        <Radio.Button value={7}>近7天</Radio.Button>
                      </Radio.Group>
                      <RangePicker
                        value={dates}
                        suffixIcon={<img src={datePickerRightIcon} alt="" />}
                        className={style.range}
                        format="YYYY-MM-DD"
                        placeholder={['开始时间', '结束时间']}
                        onChange={(time, dateStrings): void => (
                          taskTimeScreen(time, dateStrings, 'play')
                        )}
                        getPopupContainer={(triggerNode): HTMLElement => (
                          triggerNode.parentElement || triggerNode
                        )}
                        onCalendarChange={(val: RangeValue<Moment>): void => {
                          this.setState({
                            dates: val,
                          });
                        }}
                        onOpenChange={this.onOpenChange}
                        disabledDate={(current): boolean => this.generateDisabledDate(current)}
                      />
                      <Tooltip title="导出">
                        <span onClick={(): void => dayExportData('historyPlay')}>
                          <img className={style.bgImgExport} src={exportStatistics} alt="" />
                        </span>
                      </Tooltip>
                      <Radio.Group
                        value={playChartType}
                        onChange={(e): void => taskChartTypeChange(e, 'play')}
                      >
                        <Radio.Button value="line">
                          {playChartType === 'line' ? (
                            <img className={style.bgImg} src={lineChartSele} alt="" />
                          ) : (
                            <img className={style.bgImg} src={lineChart} alt="" />
                          )}
                        </Radio.Button>
                        <Radio.Button value="bar">
                          {playChartType === 'bar' ? (
                            <img className={style.bgImg} src={barChartSele} alt="" />
                          ) : (
                            <img className={style.bgImg} src={barChart} alt="" />
                          )}
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={style.trendChart}>
                  <MinEcharts options={playOptions} boxShadow={false} />
                </Col>
              </Row>

              <Row className={style.trend}>
                <Col span={24} className={style.trendTitle}>
                  <Row>
                    <Col span={5}>
                      <div className={style.chartsTitle}>历史广告任务统计（次）</div>
                    </Col>
                    <Col span={19} className={style.trendTitleBtn}>
                      <Radio.Group
                        value={taskChartTime}
                        onChange={(e): void => {
                          this.setState({
                            times: [],
                          });
                          taskChartTimeChange(e, 'task');
                        }}
                        className={style.timeBtn}
                        defaultValue={30}
                      >
                        <Radio.Button value={30}>近30天</Radio.Button>
                        <Radio.Button value={7}>近7天</Radio.Button>
                      </Radio.Group>
                      <RangePicker
                        value={times}
                        suffixIcon={<img src={datePickerRightIcon} alt="" />}
                        className={style.range}
                        format="YYYY-MM-DD"
                        placeholder={['开始时间', '结束时间']}
                        onChange={(time, dateStrings): void => (
                          taskTimeScreen(time, dateStrings, 'task')
                        )}
                        getPopupContainer={(triggerNode): HTMLElement => (
                          triggerNode.parentElement || triggerNode
                        )}
                        onCalendarChange={(val: RangeValue<Moment>): void => {
                          this.setState({
                            times: val,
                          });
                        }}
                        onOpenChange={this.onOpenChange}
                        disabledDate={(current): boolean => this.generateDisabledDate(current)}
                      />
                      <Tooltip title="导出">
                        <span onClick={(): void => dayExportData('historyTask')}>
                          <img className={style.bgImgExport} src={exportStatistics} alt="" />
                        </span>
                      </Tooltip>
                      <Radio.Group
                        value={taskChartType}
                        onChange={(e): void => taskChartTypeChange(e, 'task')}
                      >
                        <Radio.Button value="line">
                          {taskChartType === 'line' ? (
                            <img className={style.bgImg} src={lineChartSele} alt="" />
                          ) : (
                            <img className={style.bgImg} src={lineChart} alt="" />
                          )}
                        </Radio.Button>
                        <Radio.Button value="bar">
                          {taskChartType === 'bar' ? (
                            <img className={style.bgImg} src={barChartSele} alt="" />
                          ) : (
                            <img className={style.bgImg} src={barChart} alt="" />
                          )}
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Col>
                <Col span={24} className={style.trendChart}>
                  <MinEcharts options={taskOptions} boxShadow={false} />
                </Col>
              </Row>
            </>
          )}
          {permissionsData[EXPORT] && (
            <div className={style.details}>
              播放记录详单
              <span onClick={(): void => this.noticeExport()}>详单导出</span>
            </div>
          )}
          <ExportModal />
        </div>
      </div>
    );
  }
}
