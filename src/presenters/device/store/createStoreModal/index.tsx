import React from 'react';
import { observer } from 'mobx-react';
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  Input,
  TimePicker,
  Select,
  Radio,
  FormInstance,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import DI from '../../../../inversify.config';
import CreateProjectModalViewModel from './viewModal';
import StoreListViewModel, { StoreType } from '../viewModel';
import { DEVICE_IDENTIFIER, ORGANIZATION_TREE_IDENTIFIER } from '../../../../constants/identifiers';
import { ModalStatus } from '../../../../common/config/commonConfig';
import style from './style.less';
import closeIcon from '../../../../assets/images/close_icon.svg';
import FormItemTitle from '../../../../common/components/formItemTitle/index';
import MapComponent, { LocationInfo } from '../../../../common/components/map';
import { StoreListItemConfig } from '../../../../domain/entities/deviceEntities';
import OrganizationTreeViewModel from '../../../../common/components/organizationTree/viewModel';
import datePickerRightIcon from '../../../../assets/images/date_picker_right.svg';

const { RangePicker } = TimePicker;
const { TextArea } = Input;

@observer
export default class CreateProjectModal extends React.Component {
  private createStoreViewModel = DI.DIContainer.get<CreateProjectModalViewModel>(
    DEVICE_IDENTIFIER.CREATE_PROJECT_MODAL_VIEW_MODEL,
  );
  private viewModel = DI.DIContainer.get<StoreListViewModel>(
    DEVICE_IDENTIFIER.PROJECT_STORE_VIEW_MODEL,
  );
  private organizationTreeViewModel = DI.DIContainer.get<OrganizationTreeViewModel>(
    ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_VIEW_MODEL,
  );
  private formRef = React.createRef<FormInstance>();
  // 弹窗标题
  private generateTitle(): string {
    const { createProjectModalType, createStoresType } = this.createStoreViewModel;
    if (createProjectModalType === ModalStatus.Creat) {
      return createStoresType === StoreType.Project ? '新增项目' : '新增门店';
    }
    if (createProjectModalType === ModalStatus.Edit) {
      return createStoresType === StoreType.Project ? '编辑项目' : '编辑门店';
    }
    return '新增项目';
  }

  componentDidMount(): void {
    const { getOrganization } = this.createStoreViewModel;
    const { getCategory } = this.viewModel;
    getOrganization();
    getCategory();
  }

  // 获取地图点击的地址信息
  private getCurrentLocation = (value: LocationInfo): void => {
    const { city, district, formattedAddress, lng, lat, cityCode, adcode } = value;
    this.createStoreViewModel.cityCodeData = cityCode;
    this.createStoreViewModel.countyCode = adcode;
    this.formRef.current?.setFieldsValue({
      city,
      county: district,
      address: formattedAddress,
      latitude: lat,
      longitude: lng,
    });
  };

  public render(): JSX.Element {
    const {
      createProjectModalVisible,
      close,
      createStoresType,
      organizationData,
      onFinish,
      createProjectModalType,
      onCreate,
      storeItemData,
      mapKey,
    } = this.createStoreViewModel;
    const { categoryData } = this.viewModel;
    return (
      <Modal
        visible={createProjectModalVisible}
        closable={false}
        width={765}
        footer={null}
        destroyOnClose
        wrapClassName={style.createProjectModalContainer}
        onCancel={(): void => close()}
      >
        <div className={style.createMemberModalContent}>
          <div className={style.modalHeader}>
            {this.generateTitle()}
            <Button
              type="text"
              onClick={(): void => {
                close();
              }}
            >
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            onFinish={(values: StoreListItemConfig): void => {
              onFinish(values, this.viewModel, this.formRef);
            }}
            ref={this.formRef}
          >
            <FormItemTitle title="基本信息" className={style.paddingBottomSpace} />
            <Row>
              <Col span={12}>
                {createStoresType === StoreType.Project ? (
                  <Form.Item
                    name="categoryCode"
                    label="项目种类"
                    initialValue={storeItemData?.categoryCode}
                    rules={[{ required: true }]}
                    colon={false}
                  >
                    <Select placeholder="请输入项目种类">
                      {categoryData &&
                        categoryData.map((item, index) => (
                          <Select.Option value={item.value} key={index}>
                            {item.meaning}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="门店名称"
                    name="name"
                    initialValue={storeItemData?.name}
                    colon={false}
                    rules={[
                      {
                        required: true,
                      },
                      {
                        max: 10,
                        type: 'string',
                        message: '最大长度10字符',
                      },
                    ]}
                  >
                    <Input style={{ width: '240px' }} placeholder="请输入门店名称" maxLength={30} />
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                {createStoresType === StoreType.Project ? (
                  <Form.Item
                    label="项目名称"
                    name="name"
                    initialValue={storeItemData?.name}
                    colon={false}
                    rules={[
                      {
                        required: true,
                      },
                      {
                        max: 10,
                        type: 'string',
                        message: '最大长度10字符',
                      },
                    ]}
                  >
                    <Input style={{ width: '240px' }} placeholder="请输入项目名称" maxLength={30} />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="营业时间"
                    name="runningTime"
                    colon={false}
                    rules={[{ required: true }]}
                    initialValue={
                      storeItemData.beginBusinessHours
                        ? [
                            moment(storeItemData?.beginBusinessHours, 'HH:mm:ss'),
                            moment(storeItemData?.endBusinessHours, 'HH:mm:ss'),
                          ]
                        : null
                    }
                  >
                    <RangePicker suffixIcon={<img src={datePickerRightIcon} alt="" />} />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {createStoresType === StoreType.Project ? (
                  <Form.Item
                    initialValue={
                      storeItemData.beginBusinessHours
                        ? [
                            moment(storeItemData?.beginBusinessHours, 'HH:mm:ss'),
                            moment(storeItemData?.endBusinessHours, 'HH:mm:ss'),
                          ]
                        : null
                    }
                    colon={false}
                    label="营业时间"
                    name="runningTime"
                    rules={[{ required: true }]}
                  >
                    <RangePicker suffixIcon={<img src={datePickerRightIcon} alt="" />} />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="所属组织"
                    name="organization"
                    initialValue={storeItemData?.unitName}
                    rules={[{ required: true }]}
                    colon={false}
                  >
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={organizationData}
                      placeholder="请选择组织"
                      treeDefaultExpandAll
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                {createStoresType === StoreType.Project ? (
                  <Form.Item
                    label="所属组织"
                    name="organization"
                    initialValue={storeItemData?.unitName}
                    rules={[{ required: true }]}
                    colon={false}
                  >
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={organizationData}
                      placeholder="请选择组织"
                      treeDefaultExpandAll
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="状态"
                    name="status"
                    initialValue={storeItemData?.status}
                    rules={[{ required: true }]}
                    colon={false}
                  >
                    <Radio.Group>
                      <Radio value>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {createStoresType === StoreType.Project ? (
                  <Form.Item
                    label="状态"
                    name="status"
                    initialValue={storeItemData?.status}
                    rules={[{ required: true }]}
                    colon={false}
                  >
                    <Radio.Group value="ENABLE">
                      <Radio value>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                  </Form.Item>
                ) : (
                  ''
                )}
              </Col>
            </Row>
            <FormItemTitle title="更多信息" className={style.paddingBottomSpace} />
            <Row>
              <Col span={12}>
                <Form.Item label="地图位置" name="location" colon={false}>
                  <Input
                    style={{ width: '240px' }}
                    placeholder="选择地图位置后信息自动带入"
                    maxLength={30}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="所在城市"
                  name="city"
                  initialValue={storeItemData?.city}
                  rules={[{ required: true }]}
                  colon={false}
                >
                  <Input
                    style={{ width: '240px' }}
                    placeholder="选择地图位置后信息自动带入"
                    maxLength={30}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="区 / 县址"
                  name="county"
                  initialValue={storeItemData?.county}
                  rules={[{ required: true }]}
                  colon={false}
                >
                  <Input
                    style={{ width: '240px' }}
                    placeholder="请输入区 / 县信息"
                    maxLength={30}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="详细地址"
                  name="address"
                  initialValue={storeItemData?.address}
                  rules={[{ required: true }]}
                  colon={false}
                >
                  <Input style={{ width: '240px' }} placeholder="请输入详细地址" maxLength={30} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="纬度数值"
                  name="latitude"
                  initialValue={storeItemData?.latitude}
                  rules={[{ required: true }]}
                  colon={false}
                >
                  <Input
                    style={{ width: '240px' }}
                    disabled
                    placeholder="请输入纬度"
                    maxLength={30}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="经度数值"
                  name="longitude"
                  initialValue={storeItemData?.longitude}
                  rules={[{ required: true }]}
                  colon={false}
                >
                  <Input
                    style={{ width: '240px' }}
                    disabled
                    placeholder="请输入经度"
                    maxLength={30}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  initialValue={storeItemData?.description}
                  label="内容描述"
                  name="description"
                  colon={false}
                >
                  <TextArea showCount maxLength={30} rows={4} cols={24} placeholder="请输入内容" />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <div className={style.mapWrapper}>
                <MapComponent
                  key={mapKey}
                  getCurrentLocation={(e: LocationInfo): void => this.getCurrentLocation(e)}
                />
              </div>
            </Row>
            <div className={style.bottomButton}>
              <Button type="primary" ghost onClick={close}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              {createProjectModalType === ModalStatus.Creat ? (
                <Button type="primary" onClick={(): void => onCreate(true, this.formRef)}>
                  保存并继续添加
                </Button>
              ) : (
                ''
              )}
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}
