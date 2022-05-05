/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:43:46
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Row, Col } from 'antd';
import DI from '../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import PatrolModalViewModel from './viewModel';
import style from './style.less';
import MinEcharts from '../../../common/components/minEcharts/index';
import FormItemTitle from '../../../common/components/formItemTitle/index';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import { DeviceType } from '../../../common/config/commonConfig';

@observer
export default class PatrolModal extends React.Component {
  private patrolModalViewModel = DI.DIContainer.get<PatrolModalViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_PATROL_VIEW_MODEL,
  );

  componentDidMount(): void {
    //
  }

  public render(): JSX.Element {
    const {
      patrolModalVisible,
      setPatrolModalVisible,
      netWorkOptions,
      patrolData,
      deviceType,
    } = this.patrolModalViewModel;
    return (
      <Modal
        visible={patrolModalVisible}
        width={600}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setPatrolModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            巡查
            <Button type="text" onClick={(): void => setPatrolModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div>
            <FormItemTitle title="设备运行报告" className={style.paddingBottomSpace} />
            <Row className={style.rowMar}>
              <Col span={24}>
                <Row>
                  {deviceType === DeviceType.Cashier ? (
                    <Col span={12}>
                      点位品牌名称 : <span className={style.spanMar}>{patrolData.pointBrandName || '- -'}</span>
                    </Col>
                  ) : (
                    <Col span={12}>
                      设备名称 : <span className={style.spanMar}>{patrolData.name || '- -'}</span>
                    </Col>
                  )}

                  <Col span={12}>
                    最后在线时间 : <span className={style.spanMar}>{patrolData.lastOnlineDate || '- -'}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className={style.rowMar}>
              <Col span={24}>
                <Row>
                  <Col span={12}>
                    设备状态 :{' '}
                    <span className={style.spanMar}>
                      {patrolData.online ? '在线' : '离线'} / {patrolData.status ? '启用' : '禁用'}
                    </span>
                  </Col>
                  <Col span={12}>
                    应用版本号 : <span className={style.spanMar}>{patrolData.clientVersionNumber || ' - -'}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Col span={24} className={style.trendChart}>
              <MinEcharts options={netWorkOptions} boxShadow={false} />
            </Col>
          </div>
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => setPatrolModalVisible()}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
