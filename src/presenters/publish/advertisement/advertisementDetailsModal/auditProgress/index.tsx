/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:15
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-02-18 18:45:12
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Timeline } from 'antd';
import style from './style.less';

import DI from '../../../../../inversify.config';
import { APPROVE_IDENTIFIER } from '../../../../../constants/identifiers';
import AuditProgressViewModel from './viewModel';
import ArrowRight from '../../../../../assets/images/arrow_right.svg';
import dataEmpty from '../../../../../assets/images/data_empty.svg';

@observer
export default class AuditProgress extends React.Component {
  private viewModel = DI.DIContainer.get<AuditProgressViewModel>(
    APPROVE_IDENTIFIER.AUDIT_PROGRESS_VIEW_MODEL,
  );

  componentWillUnmount(): void {
    const { initialData } = this.viewModel;
    initialData();
  }

  public render(): JSX.Element {
    const { approveProgressData, currentName } = this.viewModel;
    return (
      <div className={style.auditProgressContainer}>
        <Row>
          <Col className={style.title}>{currentName}</Col>
        </Row>
        <Timeline className={style.timeLineContainer}>
          {approveProgressData.map((item, index) => {
            return (
              <Timeline.Item
                dot={
                  index === 0 ? (
                    <img src={ArrowRight} alt="" />
                  ) : (
                    <div className={style.circle} />
                  )
                }
              >
                <Row>
                  <Col span={5}>【{item.nodeName}】</Col>
                  <Col span={19}>
                    <Row>
                      {item.nodeList?.map((nodeItem) => {
                        return (
                          <>
                            <Col span={24}>
                              {nodeItem.organizationName || '集团'} -{' '}
                              {nodeItem.approveUser || '管理员'}
                            </Col>
                            <Col span={24}>{nodeItem.approveTime}</Col>
                            {nodeItem.reason ? (
                              <Col span={24} className={style.approvalReason}>
                                原因：{nodeItem.reason}
                              </Col>
                            ) : null}
                          </>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              </Timeline.Item>
            );
          })}
          {!approveProgressData.length && (
            <div className={style.dataEmpty}>
              <img src={dataEmpty} alt="" />
              <p>暂无数据</p>
            </div>
          )}
        </Timeline>
      </div>
    );
  }
}
