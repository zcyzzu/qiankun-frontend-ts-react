/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:45:32
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Tabs } from 'antd';
import style from './style.less';

import DI from '../../../../inversify.config';
import { ADVERTISEMENT_IDENTIFIER } from '../../../../constants/identifiers';
import NoticeDetailsModalViewModel from './viewModel';
import NoticeDetailsTab from './noticeDetailsTab/index';
import AuditProgress from '../../advertisement/advertisementDetailsModal/auditProgress/index';
import { NoticeItemDetailsEntity } from '../../../../domain/entities/noticeEntities';
import OperationLog from '../../advertisement/advertisementDetailsModal/operationLog/index';

import closeIcon from '../../../../assets/images/close_icon_normal.svg';

interface NoticeDetailsModalProps {
  itemData?: NoticeItemDetailsEntity;
  type?: string;
}
interface NoticeDetailsModalState {}

@observer
export default class NoticeDetailsModal extends React.Component<
  NoticeDetailsModalProps,
  NoticeDetailsModalState
> {
  private viewModel = DI.DIContainer.get<NoticeDetailsModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.NOTICE_DETAILS_MODEL_VIEW_MODEL,
  );

  public constructor(props: NoticeDetailsModalProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    const { noticeDetailsVisible, setNoticeDetailsVisible, currentTab } = this.viewModel;
    const { type } = this.props;
    return (
      <Modal
        visible={noticeDetailsVisible}
        width={724}
        closable={false}
        footer={null}
        wrapClassName={style.noticeDetailsContainer}
        destroyOnClose
        onCancel={(): void => setNoticeDetailsVisible()}
      >
        <div className={style.noticeDetailsContent}>
          <div className={style.modalHeader}>
            查看
            <Button type="text" onClick={(): void => setNoticeDetailsVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.tabsContainer}>
            <Tabs defaultActiveKey={currentTab}>
              <Tabs.TabPane tab="紧急通知详情" key="1">
                <NoticeDetailsTab />
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
            <Button type="primary" onClick={(): void => setNoticeDetailsVisible()}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
