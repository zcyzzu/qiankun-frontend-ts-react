/*
 * @Author: tongyuqiang
 * @Date: 2021-12-01 18:12:51
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-27 15:08:58
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Input } from 'antd';
import style from './style.less';

import utils from '../../../utils';
import closeIcon from '../../../assets/images/close_icon_normal.svg';

interface TextAreaModalModalProps {
  title?: string;
  describe?: string;
  maxLength?: number;
  getContent?(e: string): Promise<void>;
}
interface TextAreaModalModalState {
  textAreaModalVisible: boolean;
}
@observer
export default class TextAreaModal extends React.Component<
  TextAreaModalModalProps,
  TextAreaModalModalState
> {
  public constructor(props: TextAreaModalModalProps) {
    super(props);
    this.state = {
      textAreaModalVisible: false,
    };
  }

  public textAreaStr = '';

  // 弹窗打开/关闭
  public switchVisible = (): void => {
    const { textAreaModalVisible } = this.state;
    this.textAreaStr = '';
    this.setState({
      textAreaModalVisible: !textAreaModalVisible,
    });
  };

  // 获取input内容
  public getInputValue = (e: string): void => {
    this.textAreaStr = e;
  };

  // 确认事件
  public onConfirm = (): void => {
    const { getContent } = this.props;
    if (!this.textAreaStr) {
      utils.globalMessge({
        content: '请输入内容',
        type: 'error',
      });
      return;
    }
    if (getContent) {
      getContent(this.textAreaStr);
    }
  };

  // 关闭事件
  public onClose = (): void => {
    this.textAreaStr = '';
    this.switchVisible();
  }

  public render(): JSX.Element {
    const { title, describe, maxLength } = this.props;
    const { textAreaModalVisible } = this.state;

    return (
      <Modal
        visible={textAreaModalVisible}
        width={520}
        closable={false}
        footer={null}
        wrapClassName={style.textAreaModalContainer}
        destroyOnClose
      >
        <div className={style.textAreaModalContent}>
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
          <Input.TextArea
            showCount
            maxLength={maxLength || 50}
            rows={4}
            placeholder="请输入内容"
            style={{ marginTop: '12px' }}
            onChange={(e): void => {
              this.getInputValue(e.target.value);
            }}
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
