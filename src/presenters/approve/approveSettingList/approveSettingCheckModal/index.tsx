/*
 * @Author: zhangchenyang
 * @Date: 2021-12-03 17:26:06
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:41:11
 */
import React from 'react';
import { Modal, Button, Row } from 'antd';
import { observer } from 'mobx-react';
import style from './style.less';
import FormItemTitle from '../../../../common/components/formItemTitle';
import DI from '../../../../inversify.config';
import { APPROVE_IDENTIFIER } from '../../../../constants/identifiers';
import ApproveSettingCheckModalViewModel from './viewModel';
import closeIcon from '../../../../assets/images/close_icon_normal.svg';
import { ApproveRulesRequestConfig } from '../../../../domain/entities/approveEnities';

@observer
export default class CreatNoticeModal extends React.Component {
  private viewModel = DI.DIContainer.get<ApproveSettingCheckModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_SETTING_CHECK_MODAL_VIEW_MODEL,
  );
  public render(): JSX.Element {
    const {
      approveSettingCheckModalVisible,
      setApproveSettingCheckModalVisible,
      approveSettingCheckModalItemData,
    } = this.viewModel;
    return (
      <Modal
        visible={approveSettingCheckModalVisible}
        width={534}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setApproveSettingCheckModalVisible(false)}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            查看
            <Button type="text" onClick={(): void => setApproveSettingCheckModalVisible(false)}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <FormItemTitle
            title="审批方式"
            className={style.paddingBottomSpace}
            // prompt={{ show: true, title: '多人审批时采用的审批方式' }}
          />
          <Row>
            {approveSettingCheckModalItemData.approveType === 'TURN' ? (
              <p>依次审批 （顺序值越小，越优先审批）</p>
            ) : (
              <p>或签 （一名审批人通过或驳回即可）</p>
            )}
          </Row>
          <FormItemTitle title="审批人及审批顺序" className={style.paddingBottomSpace} />
          <Row>
            <p>【{approveSettingCheckModalItemData.unitName}】</p>
          </Row>
          <Row>
            {approveSettingCheckModalItemData.approveType === 'TURN' ? (
              <p>{this.generateTurn()}</p>
            ) : (
              <p>{this.generateOr()}</p>
            )}
          </Row>
          <div
            className={style.bottomButton}
            onClick={(): void => setApproveSettingCheckModalVisible(false)}
          >
            <Button type="primary">关闭</Button>
          </div>
        </div>
      </Modal>
    );
  }

  private generateTurn = (): string => {
    const { approveSettingCheckModalItemData } = this.viewModel;
    let str = '';
    const data: ApproveRulesRequestConfig = JSON.parse(
      JSON.stringify(approveSettingCheckModalItemData),
    );
    data.instances?.sort((a, b) => {
      if (a && a.sort && b && b.sort) {
        return a.sort - b.sort;
      }
      return 0;
    });
    data.instances?.map((item, index) => {
      str += `${item.approverName}（第${index + 1}位审批）、`
    })
    str = str.substring(0, str.length - 1);
    return str;
  };

  private generateOr = (): string => {
    const { approveSettingCheckModalItemData } = this.viewModel;
    let str = '';
    approveSettingCheckModalItemData.instances?.map((item) => {
      str += `${item.approverName}、`;
    });
    str = str.substring(0, str.length - 1);
    return str;
  };
}
