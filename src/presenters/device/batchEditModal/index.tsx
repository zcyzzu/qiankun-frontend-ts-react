/*
 * @Author: zhangchenyang
 * @Date: 2021-12-07 17:45:47
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:43:01
 */
import React from 'react';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Modal, Button, Checkbox, Select, Row, Col } from 'antd';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import DI from '../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import style from './style.less';
import { DeviceType } from '../../../common/config/commonConfig';
import AdvertisementMachine, { DeviceRecordDataConfig } from '../advertisementMachine/viewModel';
import BatchEditModalViewModel from './viewModel';
import closeIcon from '../../../assets/images/close_icon_normal.svg';

const { Option } = Select;

interface BatchEditModalProps {
  selectedRowKeysList: React.Key[];
  deviceType: DeviceType;
  selectedRowItemData: DeviceRecordDataConfig[];
}

@observer
export default class BatchEditModal extends React.Component<BatchEditModalProps> {
  private viewModel = DI.DIContainer.get<BatchEditModalViewModel>(
    DEVICE_IDENTIFIER.BATCH_EDIT_MODAL_VIEW_MODEL,
  );
  private advertisementMachine = DI.DIContainer.get<AdvertisementMachine>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_VIEW_MODEL,
  );

  public render(): JSX.Element {
    const {
      batchEditModalVisible,
      setBatchEditModalVisible,
      deviceGroupStatus,
      setDeviceGroupStatus,
      storeGroupStatus,
      setStoreGroupStatus,
      deviceGroupList,
      setSelectedGroupList,
      onFinish,
      storeDataList,
      setSelectedStore,
      clearSelectedGroup,
      selectedGroupList,
    } = this.viewModel;
    const { selectedRowKeysList, deviceType, selectedRowItemData } = this.props;
    const optionsWithDisabled = cloneDeep(deviceGroupList);
    return (
      <Modal
        visible={batchEditModalVisible}
        width={512}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setBatchEditModalVisible(false)}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            批量修改属性
            <Button type="text" onClick={(): void => setBatchEditModalVisible(false)}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.operateStyle}>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                onChange={(e: CheckboxChangeEvent): void => (
                  setDeviceGroupStatus(e.target.checked)
                )}
              >
                设备分组
              </Checkbox>
              {deviceGroupStatus && (
                <Button
                  onClick={(): void => clearSelectedGroup()}
                  style={{ position: 'relative', left: '-60px' }}
                  type="link"
                >
                  清空
                </Button>
              )}
            </Row>
            <Row className={style.checkGroupStyle}>
              {deviceGroupStatus && (
                <Checkbox.Group
                  options={optionsWithDisabled as CheckboxOptionType[]}
                  value={selectedGroupList}
                  onChange={(e: CheckboxValueType[]): void => setSelectedGroupList(e)}
                />
              )}
            </Row>
            <Row className={style.selectStyle}>
              <Col span={6}>
                <Checkbox
                  onChange={(e: CheckboxChangeEvent): void => (
                    setStoreGroupStatus(e.target.checked, selectedRowItemData)
                  )}
                >
                  所属项目/门店
                </Checkbox>
              </Col>
              <Col>
                {storeGroupStatus && (
                  <Select
                    placeholder="请选择项目/门店"
                    style={{ width: 280 }}
                    onChange={(val: string): void => setSelectedStore(val)}
                  >
                    {storeDataList &&
                      storeDataList.map((ele) => {
                        if (ele.id) {
                          return <Option value={ele.id}>{ele.name}</Option>;
                        }
                        return null;
                      })}
                  </Select>
                )}
              </Col>
            </Row>
          </div>
          <div className={style.bottomButton}>
            <Button onClick={(): void => setBatchEditModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={(): void => (
                onFinish(selectedRowKeysList, this.advertisementMachine, deviceType)
              )}
            >
              确认
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
