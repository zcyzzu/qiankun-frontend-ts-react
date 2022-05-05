/*
 * @Author: liyou
 * @Date: 2021-11-30 14:32:06
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:41:28
 */
// 审批管理-审批设置弹窗
import React from 'react';
import {
  Modal,
  Button,
  Form,
  Radio,
  Select,
  Space,
  Checkbox,
  Row,
  Col,
  FormInstance,
  RadioChangeEvent,
  InputNumber,
  Tooltip,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { observer } from 'mobx-react';
import style from './style.less';
import FormItemTitle from '../../../../common/components/formItemTitle';
import DI from '../../../../inversify.config';
import { APPROVE_IDENTIFIER } from '../../../../constants/identifiers';
import ApproveSettingModalViewModel from './viewModel';
import ApproveSettingListViewModel from '../viewModel';
import { ApproveSettingListItemConfig } from '../../../../domain/entities/approveEnities';
import { ModalStatus } from '../../../../common/config/commonConfig';

import closeIcon from '../../../../assets/images/close_icon_normal.svg';

const { Option } = Select;
@observer
export default class ApproveSettingModal extends React.Component {
  private viewModel = DI.DIContainer.get<ApproveSettingModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_SETTING_MODAL_VIEW_MODEL,
  );
  private approveSettingListViewModel = DI.DIContainer.get<ApproveSettingListViewModel>(
    APPROVE_IDENTIFIER.APPROVE_SETTING_VIEW_MODEL,
  );
  private formRef = React.createRef<FormInstance>();

  public render(): JSX.Element {
    const {
      approveSettingModalVisible,
      setApproveSettingModalVisible,
      approveSettingModalItemData,
      selectMode,
      selectModeChange,
      onFinish,
      defaultCheckboxDataList,
      defaultCheckboxDataListChange,
      approveOrderChange,
      isSelectedUnitName,
      setIsSelectedUnitName,
      unitList,
      modalTyle,
    } = this.viewModel;

    return (
      <Modal
        visible={approveSettingModalVisible}
        width={534}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): Promise<void> => setApproveSettingModalVisible(false)}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            {modalTyle === ModalStatus.Creat ? '新增审批设置' : '编辑审批设置'}
            <Button type="text" onClick={(): Promise<void> => setApproveSettingModalVisible(false)}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <Form
            ref={this.formRef}
            onFinish={(e: ApproveSettingListItemConfig): void => (
              onFinish(e, this.approveSettingListViewModel)
            )}
          >
            <FormItemTitle title="选择组织" className={style.paddingBottomSpace} />
            <Form.Item
              label="所属组织"
              rules={[{ required: true, message: '请选择所属组织' }]}
              className={style.cycle}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              name="unitName"
              initialValue={approveSettingModalItemData.unitName}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="请选择所属组织"
                onChange={(e: string): void => setIsSelectedUnitName(true, e)}
              >
                {unitList.map((ele) => (
                  ele.unitName ? (<Option value={ele.unitName}>{ele.unitName}</Option>) : null
                ))}
              </Select>
            </Form.Item>
            <FormItemTitle
              title="选择方式"
              className={style.paddingBottomSpace}
              // prompt={{ show: true, title: '多人审批时采用的审批方式' }}
            />
            <Form.Item
              className={style.cycle}
              wrapperCol={{ span: 24 }}
              name="approveType"
              initialValue={approveSettingModalItemData.approveType}
            >
              <Radio.Group
                defaultValue="OR"
                onChange={(e: RadioChangeEvent): void => selectModeChange(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value="TURN" style={{ marginBottom: '20px' }}>
                    依次审批 （选择后需设置审批人审批顺序，顺序值越小，越优先审批）
                  </Radio>
                  <Radio value="OR" style={{ marginBottom: '20px' }}>
                    或签 （一名审批人通过或驳回即可）
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {isSelectedUnitName && selectMode === 'OR' && (
              <div>
                <FormItemTitle title="设置审批人" className={style.paddingBottomSpace} />
                {defaultCheckboxDataList &&
                  defaultCheckboxDataList.map(
                    (ele, index): JSX.Element => (
                      <Row className={style.rowBottomOr}>
                        <Col span={24}>
                          <Checkbox
                            style={{ width: '100%' }}
                            value={ele.userId}
                            checked={ele.checked}
                            onChange={(e: CheckboxChangeEvent): void => (
                              defaultCheckboxDataListChange(e.target.checked, index)
                            )}
                          >
                            <Tooltip title={ele.userName}>
                              {ele.userName}
                            </Tooltip>
                          </Checkbox>
                        </Col>
                      </Row>
                    ),
                  )}
              </div>
            )}
            {isSelectedUnitName && selectMode === 'TURN' && (
              <div>
                <FormItemTitle title="设置审批人及审批顺序" className={style.paddingBottomSpace} />
                {defaultCheckboxDataList &&
                  defaultCheckboxDataList.map(
                    (ele, index): JSX.Element => (
                      <Row className={style.rowBottomTurn}>
                        <Col span={12}>
                          <Checkbox
                            value={ele.userId}
                            checked={ele.checked}
                            onChange={(e: CheckboxChangeEvent): void => (
                              defaultCheckboxDataListChange(e.target.checked, index)
                            )}
                          >
                            <Tooltip title={ele.userName}>
                              {ele.userName}
                            </Tooltip>
                          </Checkbox>
                        </Col>
                        <Col span={12}>
                          (第
                          <InputNumber
                            min={1}
                            max={10}
                            disabled={!defaultCheckboxDataList[index].checked}
                            value={ele.sort && ele.sort > 0 ? ele.sort : undefined}
                            onChange={(e: number): void => approveOrderChange(e, index)}
                          />
                          位审批)
                        </Col>
                      </Row>
                    ),
                  )}
              </div>
            )}
            <div className={style.bottomButton}>
              <Button type="primary" ghost onClick={(): Promise<void> => setApproveSettingModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}
