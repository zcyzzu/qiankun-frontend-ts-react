/*
 * @Author: tongyuqiang
 * @Date: 2021-11-25 15:00:23
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-21 15:05:38
 */
import React from 'react';
import { observer } from 'mobx-react';
import {
  Modal,
  Button,
  Input,
  Form,
  Row,
  Col,
  Select,
  Radio,
  FormInstance,
  TreeSelect,
  Tooltip,
} from 'antd';
import style from './style.less';

import DI from '../../../inversify.config';
import AdvertisementMachineViewModel from '../advertisementMachine/viewModel';
import RaspberryMachinePropsViewModel from '../raspberryMachine/viewModel';
import DeviceListViewModel from '../deviceList/viewModel';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import DeviceEditModalViewModel from './viewModel';
import { DeviceType, ModalStatus } from '../../../common/config/commonConfig';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import { DeviceRecordListItemConfig } from '../../../domain/entities/deviceEntities';
import timeTooips from '../../../assets/images/time_tooips.svg';

interface DeviceEditModalProps {
  unitIds?: number;
}
@observer
export default class DeviceEditModal extends React.Component<DeviceEditModalProps> {
  private formRef = React.createRef<FormInstance>();
  private raspberryFormRef = React.createRef<FormInstance>();
  private viewModel = DI.DIContainer.get<DeviceEditModalViewModel>(
    DEVICE_IDENTIFIER.DEVICE_EDIT_MODEL_VIEW_MODEL,
  );

  private advertisementMachineViewModel = DI.DIContainer.get<AdvertisementMachineViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_VIEW_MODEL,
  );

  private raspberryMachinePropsViewModel = DI.DIContainer.get<RaspberryMachinePropsViewModel>(
    DEVICE_IDENTIFIER.RASPBERRY_MACHINE_VIEW_MODEL,
  );

  private deviceListViewModel = DI.DIContainer.get<DeviceListViewModel>(
    DEVICE_IDENTIFIER.DEVICE_LIST_VIEW_MODEL,
  );

  public render(): JSX.Element {
    const {
      deviceEditVisible,
      onFinish,
      selectedDeviceType,
      selectedDeviceDate,
      deviceEditModalSwitch,
      modalType,
      supportedFeatureData,
      floorData,
      resolutionData,
      organizationData,
      deviceBrandFormatData,
      storeListData,
      deviceTypeChange,
      groupListData,
      submitFailed,
      selectOrganization,
      managerDepartmentData,
    } = this.viewModel;

    const { deviceTypeData } = this.deviceListViewModel;

    const supportedFeature = supportedFeatureData.map((item, index) => {
      return (
        <Radio key={`supported_feature${index}`} value={item.value === '1' ? 1 : 0}>
          {item.meaning}
        </Radio>
      );
    });

    return (
      <Modal
        visible={deviceEditVisible}
        width={729}
        closable={false}
        footer={null}
        wrapClassName={style.deviceEditContainer}
        destroyOnClose
        onCancel={(): void => deviceEditModalSwitch()}
      >
        <div className={style.deviceEditContent}>
          <div className={style.modalHeader}>
            {this.generateTitle()}
            <Button type="text" onClick={(): void => deviceEditModalSwitch()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.formContainer}>
            {selectedDeviceType !== DeviceType.Raspberry ? (
              <Form
                onFinish={(values: DeviceRecordListItemConfig): void => {
                  onFinish(
                    values,
                    this.advertisementMachineViewModel,
                    undefined,
                    this.deviceListViewModel,
                  );
                }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                ref={this.formRef}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="组织名称"
                      name="unitName"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.unitName}
                    >
                      <TreeSelect
                        getPopupContainer={(triggerNode): HTMLElement => (
                          triggerNode.parentElement || triggerNode
                        )}
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={organizationData}
                        placeholder="请选择组织"
                        treeDefaultExpandAll
                        onChange={(e: string): void => selectOrganization(e, this.formRef)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="设备类型"
                      name="type"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.type}
                    >
                      <Select
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                        onChange={(e: DeviceType): void => {
                          deviceTypeChange(e)
                        }}
                      >
                        {deviceTypeData.map((item, index) => {
                          if (item.value === DeviceType.Raspberry) {
                            return null;
                          }
                          return (
                            <Select.Option value={item.value} key={`device_type_${index}`}>
                              {item.meaning}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  {(selectedDeviceType === DeviceType.Advertisement ||
                    selectedDeviceType === DeviceType.Led) && (
                    <Col span={12}>
                      <Form.Item
                        label="设备名称"
                        name="name"
                        rules={[{ required: true }]}
                        initialValue={selectedDeviceDate.name}
                      >
                        <Input maxLength={10} />
                      </Form.Item>
                    </Col>
                  )}
                  {selectedDeviceType === DeviceType.Cashier && (
                    <Col span={12}>
                      <Form.Item
                        label="点位品牌名称"
                        name="pointBrandName"
                        rules={[{ required: true }]}
                        initialValue={selectedDeviceDate.pointBrandName}
                      >
                        <Input maxLength={10} />
                      </Form.Item>
                    </Col>
                  )}
                  {selectedDeviceType === DeviceType.Cashier && (
                    <Col span={12}>
                      <Form.Item
                        label="品牌业态"
                        name="brandFormat"
                        rules={[{ required: true }]}
                        initialValue={selectedDeviceDate.brandFormat}
                      >
                        <Select
                          getPopupContainer={
                            (triggerNode): HTMLElement => triggerNode.parentElement
                          }
                        >
                          {deviceBrandFormatData.map((item, index) => {
                            return (
                              <Select.Option value={item.value} key={`device_type_${index}`}>
                                {item.meaning}
                              </Select.Option>
                            );
                        })}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={12}>
                    <Form.Item
                      label="所属项目/门店"
                      name="projectStoreId"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.projectStoreId}
                    >
                      <Select
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                      >
                        {storeListData.map((item, index) => {
                            return (
                              <Select.Option value={item.id || 0} key={`project_store_id_${index}`}>
                                {item.name}
                              </Select.Option>
                            );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="所在楼层"
                      name="floor"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.floor}
                    >
                      <Select
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                      >
                        {floorData.map((item, index) => {
                          return (
                            <Select.Option value={item.value} key={`floor_data_${index}`}>
                              {item.meaning}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={this.labelTooips()}
                      name="resolution"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.resolution}
                    >
                      <Select
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                      >
                        {resolutionData.map((item, index) => {
                          return (
                            <Select.Option value={item.value} key={`resolution_data_${index}`}>
                              {item.meaning}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="IP地址"
                      name="ipAddress"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.ipAddress}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="设备状态"
                      name="status"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.status === '0' ? 0 : 1}
                    >
                      <Radio.Group>
                        <Radio value={1}>启用</Radio>
                        <Radio value={0}>禁用</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="设备分组"
                      name="groupNameList"
                      initialValue={selectedDeviceDate.groupNameList?.map((item) => {
                        return item.id;
                      })}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="请选择设备分组"
                        onChange={this.deviceGroupChange}
                        maxTagCount="responsive"
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                      >
                        {groupListData.map((item, index) => {
                          return (
                            <Select.Option value={item.id || 0} key={`group_list_data_${index}`}>
                              {item.groupName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="分管部门"
                      name="managerDepartmentList"
                      initialValue={selectedDeviceDate.managerDepartmentList?.map((item) => {
                        return item.managerDepartmentId;
                      })}
                    >
                      <Select
                        mode="multiple"
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                        allowClear
                        disabled={managerDepartmentData.length === 0}
                        placeholder={managerDepartmentData.length === 0 ? '' : '请选择分管部门'}
                        maxTagCount="responsive"
                      >
                        {managerDepartmentData.map((item, index) => {
                            return (
                              <Select.Option value={item.unitId || 0} key={`manager_department_data_${index}`}>
                                {item.unitName}
                              </Select.Option>
                            );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} className={style.supportedFeature}>
                    <Form.Item
                      label={(
                        <div>
                          特征广告
                          <Tooltip placement="top" title="指设备能进行特征识别抓取到年龄性别等特征信息。">
                            <img className={style.timeImg} src={timeTooips} alt="" />
                          </Tooltip>
                        </div>
                      )}
                      name="supportedFeature"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.supportedFeature ? 1 : 0}
                    >
                      <Radio.Group>{supportedFeature}</Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8} className={style.margin}>Mac地址：</Col>
                      <Col span={14}>
                        {selectedDeviceDate.macAddress || '- -'}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8} className={style.margin}>操作系统：</Col>
                      <Col span={14}>
                        {selectedDeviceDate.os ? selectedDeviceDate.os : '- -'}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8} className={style.margin}>UUID：</Col>
                      <Col span={14}>
                        {selectedDeviceDate.deviceUuid || '- -'}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8} className={style.margin}>应用版本号：</Col>
                      <Col span={14}>
                        {selectedDeviceDate.clientVersionNumber || '- -'}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div className={style.bottomButton}>
                  <Button type="primary" ghost onClick={(): void => deviceEditModalSwitch()}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </div>
              </Form>
            ) : (
              <Form
                onFinish={(values: DeviceRecordListItemConfig): void => {
                  onFinish(
                    values,
                    undefined,
                    this.raspberryMachinePropsViewModel,
                    this.deviceListViewModel,
                    );
                }}
                onFinishFailed={(): void => {
                  submitFailed()
                }}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                ref={this.raspberryFormRef}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="组织名称"
                      name="unitName"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.unitName}
                    >
                      <TreeSelect
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={organizationData}
                        placeholder="请选择组织"
                        treeDefaultExpandAll
                        disabled={modalType === ModalStatus.View}
                        getPopupContainer={(triggerNode): HTMLElement => (
                          triggerNode.parentElement || triggerNode
                        )}
                        onChange={(e: string): void => selectOrganization(e, this.raspberryFormRef)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="设备名称"
                      name="name"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.name}
                    >
                      <Input disabled={modalType === ModalStatus.View} maxLength={10} placeholder="请选择设备名称" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Mac地址"
                      name="macAddress"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.macAddress?.toLocaleLowerCase()}
                    >
                      <Input disabled={modalType === ModalStatus.View} maxLength={30} placeholder="请输入Mac名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="IP地址"
                      name="ipAddress"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.ipAddress}
                    >
                      <Input disabled={modalType === ModalStatus.View} placeholder="请输入IP地址" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="子网掩码"
                      name="subMask"
                      rules={[{ required: true }]}
                      initialValue={selectedDeviceDate.subMask}
                    >
                      <Input disabled={modalType === ModalStatus.View} placeholder="请输入子网掩码" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="设备状态"
                      name="status"
                      rules={[{ required: true }]}
                      initialValue={
                        selectedDeviceDate.status === '0' ? 0 : 1
                      }
                    >
                      <Radio.Group disabled={modalType === ModalStatus.View}>
                        <Radio value={1}>启用</Radio>
                        <Radio value={0}>禁用</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="设备品牌"
                      name="deviceBrand"
                      initialValue={selectedDeviceDate.deviceBrand}
                    >
                      <Input disabled={modalType === ModalStatus.View} maxLength={10} placeholder="请输入设备品牌" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="分管部门"
                      name="managerDepartmentList"
                      initialValue={selectedDeviceDate.managerDepartmentList?.map((item) => {
                        return item.managerDepartmentId;
                      })}
                    >
                      <Select
                        mode="multiple"
                        getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement}
                        allowClear
                        disabled={
                          modalType === ModalStatus.View || managerDepartmentData.length === 0
                        }
                        placeholder={(modalType === ModalStatus.View || managerDepartmentData.length === 0) ? '' : '请选择分管部门'}
                        maxTagCount="responsive"
                      >
                        {managerDepartmentData.map((item, index) => {
                            return (
                              <Select.Option value={item.unitId || 0} key={`manager_department_data_${index}`}>
                                {item.unitName}
                              </Select.Option>
                            );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {modalType === ModalStatus.View ? (
                  <div className={style.bottomButton}>
                    <Button type="primary" onClick={(): void => deviceEditModalSwitch()}>
                      关闭
                    </Button>
                  </div>
                ) : (
                  <div className={style.bottomButtonMar}>
                    <Button type="primary" ghost onClick={(): void => deviceEditModalSwitch()}>取消</Button>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                    {modalType === ModalStatus.Creat && (
                      <Button type="primary" onClick={this.submitForm}>
                        保存并继续添加
                      </Button>
                    )}
                  </div>
                )}
              </Form>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  private labelTooips(): JSX.Element {
    return (
      <div className={style.labelTooips}>
        分辨率值
        <Tooltip placement="top" title="修改分辨率后该设备之前的广告任务将无法播放，需重新发布，请谨慎修改。">
          <img className={style.timeImg} src={timeTooips} alt="" />
        </Tooltip>
      </div>
    );
  }

  private generateTitle = (): string => {
    const { selectedDeviceType, modalType } = this.viewModel;
    if (selectedDeviceType === DeviceType.Raspberry) {
      if (modalType === ModalStatus.Edit) {
        return '编辑树莓派';
      }
      if (modalType === ModalStatus.Creat) {
        return '新增树莓派';
      }
      if (modalType === ModalStatus.View) {
        return '查看设备';
      }
    }
    return '编辑设备';
  };

  private submitForm = (): void => {
    const { onCreate } = this.viewModel;
    onCreate(this.raspberryFormRef);
    this.raspberryFormRef.current?.submit();
  };

  private deviceGroupChange = (e: number): void => {
    console.log(e)
  }
}
