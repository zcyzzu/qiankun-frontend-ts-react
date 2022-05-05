/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:45:25
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Tabs } from 'antd';
import style from './style.less';

import DI from '../../../../inversify.config';
import { ADVERTISEMENT_IDENTIFIER } from '../../../../constants/identifiers';
import AdvertisementDetailsModalViewModel from './viewModel';
import AdvertDetailsTab from './advertisementDetailsTab/index';
import AuditProgress from './auditProgress/index';
import OperationLog from './operationLog/index';

import closeIcon from '../../../../assets/images/close_icon_normal.svg';

interface AdvertisementDetailsModalProps {
  type?: string;
}

interface AdvertisementDetailsModalState {}

@observer
export default class AdvertisementDetailsModal extends React.Component<
  AdvertisementDetailsModalProps,
  AdvertisementDetailsModalState
> {
  private advertDetailsModalViewModel = DI.DIContainer.get<AdvertisementDetailsModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_DETAILS_MODEL_VIEW_MODEL,
  );

  // eslint-disable-next-line no-useless-constructor
  public constructor(props: AdvertisementDetailsModalProps) {
    super(props);
  }

  public render(): JSX.Element {
    const {
      advertDetailsVisible,
      setAdvertDetailsVisible,
      currentTab,
    } = this.advertDetailsModalViewModel;
    const { type } = this.props;
    return (
      <Modal
        visible={advertDetailsVisible}
        width={724}
        closable={false}
        footer={null}
        wrapClassName={style.advertDetailsContainer}
        destroyOnClose
        onCancel={(): void => setAdvertDetailsVisible()}
      >
        <div className={style.advertDetailsContent}>
          <div className={style.modalHeader}>
            查看
            <Button type="text" onClick={(): void => setAdvertDetailsVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.tabsContainer}>
            <Tabs defaultActiveKey={currentTab}>
              <Tabs.TabPane tab="广告详情" key="1">
                <AdvertDetailsTab />
              </Tabs.TabPane>
              <Tabs.TabPane tab="审批进度" key="2">
                <AuditProgress />
              </Tabs.TabPane>
              {type === 'playList' && (
                <Tabs.TabPane tab="操作日志" key="3">
                  <OperationLog />
                </Tabs.TabPane>
              )}
            </Tabs>
          </div>
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => setAdvertDetailsVisible()}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
