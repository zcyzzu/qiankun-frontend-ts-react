/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: wuhao
 * @Date: 2021-12-02 17:00:19
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-17 15:22:23
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button } from 'antd';
import style from './style.less';
import closeIcon from '../../../assets/images/close_preview.svg';

interface MaterialPreviewModalProps {
  url?: string;
  type?: string;
}

interface MaterialPreviewModalState {
  modalVisible: boolean;
}

@observer
export default class MaterialPreviewModal extends React.Component<
  MaterialPreviewModalProps,
  MaterialPreviewModalState
> {
  constructor(props: MaterialPreviewModalProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  // 弹窗打开/关闭
  public setIsModalVisible = (): void => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  public render(): JSX.Element {
    const { url, type } = this.props;
    const { modalVisible } = this.state;
    return (
      <Modal
        visible={modalVisible}
        width={850}
        closable={false}
        footer={null}
        wrapClassName={style.modalContainer}
        destroyOnClose
        onCancel={(): void => this.setIsModalVisible()}
      >
        <div className={style.modalContent}>
          <div className={style.modalHeader}>
            <Button type="text" onClick={(): void => this.setIsModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          {type === 'video' ? (
            <div>
              <video preload="metadata" className={style.video} controls>
                <source src={url} type="video/mp4" />
                <source src={url} type="video/wav" />
              </video>
            </div>
          ) : (
            <img alt="" style={{ width: '100%', backgroundSize: 'cover' }} src={url} />
          )}
        </div>
      </Modal>
    );
  }
}
