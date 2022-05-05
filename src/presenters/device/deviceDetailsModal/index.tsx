/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:43:08
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Tabs } from 'antd';
import style from './style.less';

import DI from '../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import DeviceDetailsModalViewModel from './viewModel';
import DeviceInfo from './deviceInfo/index';
import PlayPlan from './playPlan/index';

import closeIcon from '../../../assets/images/close_icon_normal.svg';

@observer
export default class DeviceDetailsModal extends React.Component {
  private deviceDetailsModalViewModel = DI.DIContainer.get<DeviceDetailsModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_DETAILS_MODEL_VIEW_MODEL,
  );

  public render(): JSX.Element {
    const {
      deviceDetailsVisible,
      setDeviceDetailsVisible,
    } = this.deviceDetailsModalViewModel;
    return (
      <Modal
        visible={deviceDetailsVisible}
        width={1006}
        closable={false}
        footer={null}
        wrapClassName={style.deviceDetailsContainer}
        destroyOnClose
        onCancel={(): void => setDeviceDetailsVisible()}
      >
        <div className={style.deviceDetailsContent}>
          <div className={style.modalHeader}>
            查看设备
            <Button type="text" onClick={(): void => setDeviceDetailsVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.tabsContainer}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="设备信息" key="1">
                <DeviceInfo />
              </Tabs.TabPane>
              <Tabs.TabPane tab="播放计划" key="2">
                <PlayPlan />
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => setDeviceDetailsVisible()}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
