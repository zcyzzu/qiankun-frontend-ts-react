/*
 * @Author: tongyuqiang
 * @Date: 2021-12-01 18:12:51
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-20 10:09:02
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import style from './style.less';

import utils from '../../../utils';
import closeIcon from '../../../assets/images/close_icon_normal.svg';

interface DatePickerModalProps {
  title?: string;
  describe?: string;
  getContent?(e: string): void;
}
interface DatePickerModalState {
  datePickerModalVisible: boolean;
}
@observer
export default class DatePickerModal extends React.Component<
  DatePickerModalProps,
  DatePickerModalState
> {
  public constructor(props: DatePickerModalProps) {
    super(props);
    this.state = {
      datePickerModalVisible: false,
    };
  }

  public endTime = '';

  // 弹窗打开/关闭
  public switchVisible = (): void => {
    const { datePickerModalVisible } = this.state;
    this.setState({
      datePickerModalVisible: !datePickerModalVisible,
    });
  };

  // 获取日期
  public getDate = (date: Moment): void => {
    this.endTime = date.format('YYYY-MM-DD');
  };

  // 确认事件
  public onConfirm = (): void => {
    const { getContent } = this.props;
    if (!this.endTime) {
      utils.globalMessge({
        content: '请选择时间',
        type: 'error',
      });
      return;
    }
    if (getContent) {
      getContent(this.endTime);
    }
  };

  // 关闭事件
  public onClose = (): void => {
    this.endTime = '';
    this.switchVisible();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public range = (start: any, end: any): any => {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public disabledDateTime = (current: any): any => {
    if (current && current.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      const hours = moment().format('HH');
      const minutes = moment().format('mm');
      // const seconds = moment().format('ss');
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        disabledHours: (): any => this.range(0, 24).splice(0, hours),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        disabledMinutes: (): any => this.range(0, Number(minutes) + 1),
        // disabledSeconds: (): any => [55, seconds],
      };
    }
    return null;
  };

  public render(): JSX.Element {
    const { title, describe } = this.props;
    const { datePickerModalVisible } = this.state;

    return (
      <Modal
        visible={datePickerModalVisible}
        width={520}
        closable={false}
        footer={null}
        wrapClassName={style.datePickerModalContainer}
        destroyOnClose
      >
        <div className={style.datePickerModalContent}>
          <div className={style.modalHeader}>
            {title}
            <Button
              type="text"
              onClick={(): void => {
                this.onClose();
              }}
            >
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          {describe}
          <br />
          <span className={style.spanLabel}>*</span><span>结束日期 </span>
          <DatePicker
            // showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={(date): void => {
              if (date) {
                this.getDate(date);
              }
            }}
            style={{ width: '320px', marginTop: '24px' }}
            disabledDate={(current): boolean => {
              return current && current < moment().subtract(1, 'day');
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            disabledTime={(current): any => {
              return this.disabledDateTime(current);
            }}
            showNow={false}
          />
          <div className={style.bottomButton}>
            <Button
              type="primary"
              ghost
              onClick={(): void => {
                this.onClose();
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={(): void => {
                this.onConfirm();
              }}
            >
              确定
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
