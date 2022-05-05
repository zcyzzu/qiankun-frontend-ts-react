/*
 * @Author: tongyuqiang
 * @Date: 2021-11-24 14:24:15
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 12:13:12
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Timeline, Row, Col, Tag } from 'antd';
import style from './style.less';

import DI from '../../../../../inversify.config';
import { ADVERTISEMENT_IDENTIFIER } from '../../../../../constants/identifiers';
import OperationLogViewModel, { NoticeOperateType, AdOperateType } from './viewModel';
import dataEmpty from '../../../../../assets/images/data_empty.svg';

@observer
export default class OperationLog extends React.Component {
  private viewModel = DI.DIContainer.get<OperationLogViewModel>(
    ADVERTISEMENT_IDENTIFIER.OPERATION_LOG_VIEW_MODEL,
  );

  componentWillUnmount(): void {
    const { initialData } = this.viewModel;
    initialData();
  }

  public render(): JSX.Element {
    const { operateLogData } = this.viewModel;
    return (
      <div className={style.operationLogContainer}>
        <Timeline className={style.timeLineContainer}>
          {operateLogData.map((item, index) => {
            return (
              <Timeline.Item
                dot={
                  index === 0 ? (
                    <div className={style.newCircle}>
                      <div className={style.circle} />
                    </div>
                  ) : (
                    <div className={style.circle} />
                  )
                }
              >
                <Row>
                  <Col span={4}>{this.generateOperationType(item.type || '')}</Col>
                  <Col span={20}>
                    <Row className={style.content}>
                      <Col span={24}>
                        {item.list?.map((listItem) => {
                          return (
                            <div>
                              {listItem.organizationName} — {listItem.username}
                            </div>
                          );
                        })}
                      </Col>
                      <Col span={24}>
                        {item.type === AdOperateType.CONTINUE_PLAYING && (
                          <span>设置结束时间：{item.cycleEndDate}</span>
                        )}
                      </Col>
                      <Col span={24}>
                        <span>{item.reason}</span>
                      </Col>
                      <Col span={24}>
                        <span>操作时间：{item.creationDate}</span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Timeline.Item>
            );
          })}
          {!operateLogData.length && (
            <div className={style.dataEmpty}>
              <img src={dataEmpty} alt="" />
              <p>暂无数据</p>
            </div>
          )}
        </Timeline>
      </div>
    );
  }

  private generateOperationType = (operationType: string): JSX.Element => {
    const { operationTypeCode, noticeOperationTypeCode, type } = this.viewModel;
    if (type === 'AD') {
      const data = operationTypeCode.find((item) => {
        return item.value === operationType;
      });
      let statusLabel: JSX.Element;
      switch (operationType) {
        case AdOperateType.START:
          statusLabel = (
            <Tag color="rgba(255, 146, 48, 0.1)">
              <span className={style.orange}>
                <b className={style.pointStatus} />
                {data?.meaning}
              </span>
            </Tag>
          );
          break;
        case AdOperateType.STOP_PLAY:
          statusLabel = (
            <Tag color="rgba(102, 102, 102, 0.1)">
              <span className={style.gray}>
                <b className={style.pointStatus} />
                {data?.meaning}
              </span>
            </Tag>
          );
          break;
        case AdOperateType.CONTINUE_PLAYING:
          statusLabel = (
            <Tag color="rgba(64, 150, 255, 0.1)">
              <span className={style.blue}>
                <b className={style.pointStatus} />
                {data?.meaning}
              </span>
            </Tag>
          );
          break;
        default:
          statusLabel = <span />;
          break;
      }
      return statusLabel;
    }
    if (type === 'NOTICE') {
      const data = noticeOperationTypeCode.find((item) => {
        return item.value === operationType;
      });
      let statusLabel: JSX.Element;
      switch (operationType) {
        case NoticeOperateType.START:
          statusLabel = (
            <Tag color="rgba(255, 146, 48, 0.1)">
              <span className={style.orange}>
                <b className={style.pointStatus} />
                {data?.meaning}
              </span>
            </Tag>
          );
          break;
        case NoticeOperateType.STOP:
          statusLabel = (
            <Tag color="rgba(102, 102, 102, 0.1)">
              <span className={style.gray}>
                <b className={style.pointStatus} />
                {data?.meaning}
              </span>
            </Tag>
          );
          break;
        default:
          statusLabel = <span />;
          break;
      }
      return statusLabel;
    }
    return <></>;
  };
}
