/*
 * @Author: tongyuqiang
 * @Date: 2022-03-04 09:30:56
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:16:12
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Row, Col } from 'antd';
import style from './style.less';

import DI from '../../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../../constants/identifiers';
import StoreDetailsModalViewModel from './viewModel';
import { StoreType } from '../viewModel';
import closeIcon from '../../../../assets/images/close_icon_normal.svg';

@observer
export default class StoreDetailsModal extends React.Component {
  private storeDetailsModalViewModel = DI.DIContainer.get<StoreDetailsModalViewModel>(
    DEVICE_IDENTIFIER.PROJECT_STORE__DETAILS_MODAL_VIEW_MODEL,
  );

  public render(): JSX.Element {
    const {
      listItemData,
      storeDetailsModalVisible,
      setStoreDetailsModalVisible,
    } = this.storeDetailsModalViewModel;
    return (
      <Modal
        visible={storeDetailsModalVisible}
        width={648}
        closable={false}
        footer={null}
        wrapClassName={style.storeDetailsModalContainer}
        destroyOnClose
        onCancel={(): void => setStoreDetailsModalVisible(false)}
      >
        <div className={style.storeDetailsModalContent}>
          <div className={style.modalHeader}>
            {listItemData.type === StoreType.Store ? '查看门店' : '查看项目'}
            <Button type="text" onClick={(): void => setStoreDetailsModalVisible(false)}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          {listItemData.type === StoreType.Store ? (
            <Row>
              <Col span={12} className={style.title}>
                门店名称：<span>{listItemData.name || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                营业时间：
                <span>{`${listItemData.beginBusinessHours}-${listItemData.endBusinessHours}`}</span>
              </Col>
              <Col span={12} className={style.title}>
                所属组织：
                <span>{listItemData.unitName || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                状 态：
                <span>{listItemData.status ? '启用' : '禁用'}</span>
              </Col>
              <Col span={12} className={style.title}>
                所在城市：
                <span>{listItemData.city || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                区/县址：
                <span>{listItemData.county || '- -'}</span>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={12} className={style.title}>
                项目种类：<span>{listItemData.category || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                项目名称：
                <span>{listItemData.name || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                营业时间：
                <span>{`${listItemData.beginBusinessHours}-${listItemData.endBusinessHours}`}</span>
              </Col>
              <Col span={12} className={style.title}>
                所属组织：
                <span>{listItemData.unitName || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                状 态：
                <span>{listItemData.status ? '启用' : '禁用'}</span>
              </Col>
              <Col span={12} className={style.title}>
                所在城市：
                <span>{listItemData.city || '- -'}</span>
              </Col>
              <Col span={12} className={style.title}>
                区/县址：
                <span>{listItemData.county || '- -'}</span>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24} className={style.title}>
              详细地址：
              <span>{listItemData.address || '- -'}</span>
            </Col>
            <Col span={24} className={style.title}>
              内容描述：
              <span>{listItemData.description || '- -'}</span>
            </Col>
          </Row>
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => setStoreDetailsModalVisible(false)}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
