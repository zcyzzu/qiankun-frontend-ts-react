/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: wuhao
 * @Date: 2021-12-02 17:00:19
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-28 11:26:57
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button } from 'antd';
import style from './style.less';
import closeIcon from '../../../../assets/images/close_icon.svg';
import MaterialPageViewModel, { MaterialItemEntityParam } from '../ViewModel';
import DI from '../../../../inversify.config';
import { CONTENT_MANAGEMENT_IDENTIFIER } from '../../../../constants/identifiers';

interface MaterialPreviewModalProps {
  url?: string;
  type?: string;
}

interface MaterialPreviewModalState {
  modalVisible: boolean;
  item?: MaterialItemEntityParam;
}

@observer
export default class MaterialPreviewModal extends React.Component<
  MaterialPreviewModalProps,
  MaterialPreviewModalState
> {
  private materialViewModel = DI.DIContainer.get<MaterialPageViewModel>(
    CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_PAGE_VIEW_MODEL,
  );
  constructor(props: MaterialPreviewModalProps) {
    super(props);
    this.state = {
      modalVisible: false,
      item: { id: 1 },
    };
  }
  private videoRef = React.createRef<HTMLVideoElement>();
  // 弹窗打开/关闭
  public setIsModalVisible = (item?: MaterialItemEntityParam): void => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      item,
    });
  };

  public render(): JSX.Element {
    const { url, type } = this.props;
    const { modalVisible, item } = this.state;
    const { renderType } = this.materialViewModel;
    return (
      <Modal
        visible={modalVisible}
        width={720}
        closable={false}
        footer={null}
        wrapClassName={style.modalContainer}
        destroyOnClose
        onCancel={(): void => this.setIsModalVisible()}
      >
        <div className={style.modalContent}>
          <div className={style.modalHeader}>
            {item?.name}
            <Button type="text" onClick={(): void => this.setIsModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.contentWrapper}>
            <div className={style.previewImage}>
              {type === 'video' ? (
                <video
                  className={style.video}
                  controls
                  autoPlay
                  ref={this.videoRef}
                  onLoadedData={(): void => {
                    this.videoRef.current?.play();
                  }}
                >
                  <source src={url} type="video/mp4" />
                  <source src={url} type="video/wav" />
                </video>
              ) : (
                <img
                  alt=""
                  style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
                  src={url}
                />
              )}
            </div>
            <div className={style.previewDescribe}>
              <p className={style.title}>基本信息</p>
              <p>名称: {item?.name?.split('.')[0]} </p>
              <p>类型: {renderType(item?.sourceType || '')}</p>
              <p>格式: {item?.type?.toUpperCase()}</p>
              <p>尺寸: {item?.resolution ? `${item.resolution}px` : null}</p>
              <p>大小: {`${(Number(item?.size) / 1024).toFixed(2)}KB` || null}</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
