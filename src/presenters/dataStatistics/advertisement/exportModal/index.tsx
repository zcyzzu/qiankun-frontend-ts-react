/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-21 09:35:24
 */
import React from 'react';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import { observer } from 'mobx-react';
import { Modal, Form, Button, Select, DatePicker, Cascader, Tooltip, FormInstance } from 'antd';
import DI from '../../../../inversify.config';
import { DATA_STATISTICS_IDENTIFIER } from '../../../../constants/identifiers';
import ExportModalViewModel from './viewModel';
import style from './style.less';
import timeTooips from '../../../../assets/images/time_tooips.svg';
import closeIcon from '../../../../assets/images/close_icon_normal.svg';
import datePickerIcon from '../../../../assets/images/date_picker.svg';
import datePickerRightIcon from '../../../../assets/images/date_picker_right.svg';

interface StatisticsProps {}

interface StatisticsState {
  dates: any | RangeValue<Moment>[];
}
@observer
export default class ExportModal extends React.Component<StatisticsProps, StatisticsState> {
  private exportModalViewModel = DI.DIContainer.get<ExportModalViewModel>(
    DATA_STATISTICS_IDENTIFIER.ADVERT_STATISTICS_EXPORT_VIEW_MODEL,
  );

  private adRef = React.createRef<FormInstance>();

  constructor(props: StatisticsProps) {
    super(props);
    this.state = {
      dates: [],
    };
  }

  // 弹出日历和关闭日历的回调
  private onOpenChange = (): void => {
    // this.setState({
    //   dates: [],
    // })
  };
  private generateDisabledDate = (current: Moment): boolean => {
    const { dates } = this.state;
    if (!dates || dates.length === 0) {
      return current && current > moment().subtract(1, 'day');
    }

    const tooLate = dates[0] && current.diff(dates[0], 'days') > 90;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 90;
    return current > moment().subtract(1, 'day') || tooEarly || tooLate;
  };
  public render(): JSX.Element {
    const {
      formOnFinish,
      exportModalVisible,
      setExportModalVisible,
      options,
      optionsAd,
      queryChange,
      query,
      setDevice,
      deviceValue,
      setAdvertisement,
      advertismentValue,
      dateChange,
    } = this.exportModalViewModel;

    this.adRef.current?.setFieldsValue({ advert: advertismentValue, device: deviceValue });

    return (
      <Modal
        visible={exportModalVisible}
        width={500}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setExportModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            详单导出
            <Button type="text" onClick={(): void => setExportModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <Form
            onFinish={formOnFinish}
            ref={this.adRef}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 21 }}
          >
            <div>
              <Form.Item
                label="查询方式"
                name="way"
                rules={[{ required: true }]}
                initialValue={query}
              >
                <Select
                  placeholder="请选择查询方式"
                  onChange={queryChange}
                >
                  <Select.Option value="advertising">按广告查询</Select.Option>
                  <Select.Option value="equipment">按设备查询</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={(
                  <div>
                    日期区间
                    <Tooltip placement="top" title="提示：选择的日期区间需小于3个月内">
                      <img className={style.timeImg} src={timeTooips} alt="" />
                    </Tooltip>
                  </div>
                )}
                name="time"
                rules={[{ required: true, message: '请选择日期区间' }]}
              >
                <DatePicker.RangePicker
                  nextIcon={<img src={datePickerIcon} alt="" />}
                  prevIcon={<img src={datePickerIcon} alt="" />}
                  suffixIcon={<img src={datePickerRightIcon} alt="" />}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  onChange={dateChange}
                  onCalendarChange={(val: RangeValue<Moment>): void => {
                    this.setState({
                      dates: val,
                    });
                  }}
                  onOpenChange={this.onOpenChange}
                  disabledDate={(current): boolean => this.generateDisabledDate(current)}
                />
              </Form.Item>
              {query === 'advertising' ? (
                <Form.Item
                  label="具体广告"
                  name="advert"
                  rules={[{ required: true }]}
                  initialValue={advertismentValue}
                >
                  <Cascader
                    multiple
                    onChange={setAdvertisement}
                    options={optionsAd}
                    maxTagCount="responsive"
                    placeholder="请选择具体的广告"
                  />
                </Form.Item>
              ) : (
                ''
              )}
              {query === 'equipment' ? (
                <Form.Item
                  label="具体设备"
                  name="device"
                  rules={[{ required: true }]}
                  initialValue={deviceValue}
                >
                  <Cascader
                    multiple
                    onChange={setDevice}
                    options={options}
                    maxTagCount="responsive"
                    placeholder="请选择具体的设备"
                  />
                </Form.Item>
              ) : (
                ''
              )}
            </div>
            <div className={style.bottomButton}>
              <Button type="primary" ghost onClick={(): void => setExportModalVisible()}>取消</Button>
              <Button type="primary" htmlType="submit">
                导出
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}
