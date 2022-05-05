/*
 * @Author: zhangchenyang
 * @Date: 2021-11-29 10:26:13
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 17:04:30
 */
import React from 'react';
import { observer } from 'mobx-react';
import {
  Modal,
  Steps,
  Button,
  Form,
  Row,
  Col,
  FormInstance,
  Radio,
  Slider,
  InputNumber,
  Select,
  Tabs,
  Table,
  Cascader,
  Tooltip,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { ColumnProps } from 'antd/lib/table';
import { SketchPicker, ColorResult } from 'react-color';
import style from './style.less';
import DI from '../../../../inversify.config';
import { ModalStatus, DeviceType } from '../../../../common/config/commonConfig';
import { DeviceScope } from '../../advertisement/creatAdvertisementModal/viewModel';
import { NoticeRollSpeed } from '../../../../common/components/noticePreview/noticePreviewType';
import { AdvertisementDeviceListEntity } from '../../../../domain/entities/deviceEntities';
import CreateNoticeModalViewModel from './viewModel';
import NoticeListViewModel from '../noticeList/viewModel';
import { NOTICE_IDENTIFIER } from '../../../../constants/identifiers';
import { NoticeItemDetailsEntity } from '../../../../domain/entities/noticeEntities';
import NoticePreview from '../../../../common/components/noticePreview';
import closeIcon from '../../../../assets/images/close_icon_normal.svg';
import resultsIcon from '../../../../assets/images/results_icon.svg';
import deleteTable from '../../../../assets/images/delete_icon.svg';
import warningIcon from '../../../../assets/images/time_tooips.svg';
import utils from '../../../../utils/index';

const { Step } = Steps;

interface CreateNoticeModalProps {}
interface CreateNoticeModalState {
  //列表表格列头
  advertingListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  cashierListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  //全部
  allAdvertingListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  allCashierListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
}

@observer
export default class CreateNoticeModal extends React.Component<
  CreateNoticeModalProps,
  CreateNoticeModalState
> {
  private viewModel = DI.DIContainer.get<CreateNoticeModalViewModel>(
    NOTICE_IDENTIFIER.CREATE_NOTICE_MODAL_VIEW_MODEL,
  );
  private noticeListViewModel = DI.DIContainer.get<NoticeListViewModel>(
    NOTICE_IDENTIFIER.NOTICE_LIST_VIEW_MODEL,
  );
  private cascaderRef = React.createRef<any>();
  private formRef = React.createRef<FormInstance>();
  private deviceFormRef = React.createRef<FormInstance>();

  constructor(props: CreateNoticeModalProps) {
    super(props);
    this.state = {
      advertingListColumns: [],
      cashierListColumns: [],
      allAdvertingListColumns: [],
      allCashierListColumns: [],
    };
  }

  componentDidMount(): void {
    // const { createNoticeModalItemData, onFinishByCreateNotice } = this.noticeListViewModel;
    const { deleteTableItemData } = this.viewModel;
    // const { noticePreviewProps, getAdvertisingList } = this.viewModel;
    // getAdvertisingList();
    // const { current } = this.state;
    // 如果改必填项为空 表示新建 否则为编辑
    // 若为新建 则将默认值赋给 单项数据
    // if (!createNoticeModalItemData.content) {
    //   onFinishByCreateNotice(current, noticePreviewProps);
    // }
    this.setState({
      advertingListColumns: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '所在楼层',
          dataIndex: 'floor',
          key: 'floor',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          fixed: 'right',
          width: '10%',
          render: (record): JSX.Element => (
            <div>
              <Tooltip title="删除">
                <Button
                  type="text"
                  className={style.opertionBtn}
                  onClick={(): void => deleteTableItemData(record)}
                >
                  <img src={deleteTable} alt="" />
                </Button>
              </Tooltip>
            </div>
          ),
        },
      ],
      cashierListColumns: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '品牌业态',
          dataIndex: 'brandFormat',
          key: 'brandFormat',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '点位品牌名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          width: '10%',
          fixed: 'right',
          render: (record): JSX.Element => (
            <div>
              <Tooltip title="删除">
                <Button
                  type="text"
                  className={style.opertionBtn}
                  onClick={(): void => deleteTableItemData(record)}
                >
                  <img src={deleteTable} alt="" />
                </Button>
              </Tooltip>
            </div>
          ),
        },
      ],
      allAdvertingListColumns: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '所在楼层',
          dataIndex: 'floor',
          key: 'floor',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
      ],
      allCashierListColumns: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '品牌业态',
          dataIndex: 'brandFormat',
          key: 'brandFormat',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '点位品牌名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (record: string): string => {
            return record || '- -';
          },
        },
      ],
    });
  }

  //  设置预览prop参数
  private onChange = (key: string): void => {
    const { setNoticePreviewProps } = this.viewModel;
    setNoticePreviewProps(key, this.formRef.current?.getFieldValue(key));
  };

  // 设备content
  private tabsContent(
    dataSource: AdvertisementDeviceListEntity[],
    cashierDataSource: AdvertisementDeviceListEntity[],
    ledDataSource: AdvertisementDeviceListEntity[],
  ): JSX.Element {
    const {
      setDevice,
      setWayType,
      specificDevice,
      deviceScope,
      deviceTypes,
      cascaderOptions,
      storeNameList,
      storeNameCashierList,
      storeNameLedList,
      removeEq,
      specificDeviceData,
      adSelectedType,
      cashierSelectedType,
      ledSelectedType,
    } = this.viewModel;
    const {
      advertingListColumns,
      cashierListColumns,
      allAdvertingListColumns,
      allCashierListColumns,
    } = this.state;

    if (removeEq === 1) {
      this.deviceFormRef.current?.setFieldsValue({ deviceScope: specificDeviceData });
    } else {
      this.deviceFormRef.current?.setFieldsValue({ deviceScope: specificDevice });
    }

    // 切换的时候， 设置当前的选择方式
    if (deviceTypes === 'ADMACHINE') {
      this.deviceFormRef.current?.setFieldsValue({ way: adSelectedType });
    } else if (deviceTypes === 'CASHIER') {
      this.deviceFormRef.current?.setFieldsValue({ way: cashierSelectedType });
    } else if (deviceTypes === 'LED') {
      this.deviceFormRef.current?.setFieldsValue({ way: ledSelectedType });
    }

    return (
      <div>
        {deviceScope === DeviceScope.Part && (
          <Col span={24}>
            <Row>
              <Col span={11} className={style.screening}>
                <Form.Item label="选择方式" name="way" colon={false}>
                  <Select
                    placeholder="请选择选择方式"
                    style={{ width: '100%' }}
                    onChange={setWayType}
                    defaultValue="project"
                    getPopupContainer={(triggerNode): HTMLElement => (
                      triggerNode.parentElement || triggerNode
                    )}
                  >
                    <Select.Option value="project">按项目/门店选择</Select.Option>
                    <Select.Option value="group">按分组选择</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2} />
              <Col span={11} className={style.screening}>
                <Form.Item
                  label="具体设备"
                  name="deviceScope"
                  className={style.scope}
                  colon={false}
                >
                  <Cascader
                    ref={this.cascaderRef}
                    style={{ width: '100%' }}
                    multiple
                    showSearch
                    value={specificDevice}
                    onChange={setDevice}
                    options={cascaderOptions}
                    maxTagCount="responsive"
                    placeholder="搜索或选择的具体设备"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        )}
        <div className={style.result}>
          <img src={resultsIcon} alt="" />
          <span>
            {deviceTypes === DeviceType.Advertisement &&
              `选择结果：${storeNameList.length}个项目/门店，${dataSource.length}台设备`}
            {deviceTypes === DeviceType.Cashier &&
              `选择结果：${storeNameCashierList.length}个项目/门店，${cashierDataSource.length}台设备`}
            {deviceTypes === DeviceType.Led &&
              `选择结果：${storeNameLedList.length}个项目/门店，${ledDataSource.length}台设备`}
          </span>
        </div>
        <div className={style.tableContent}>
          {deviceScope === DeviceScope.Part ? (
            <>
              {deviceTypes === DeviceType.Advertisement && (
                <Table
                  pagination={{
                    size: 'small',
                    showSizeChanger: false,
                    showQuickJumper: false,
                    pageSize: 3,
                    showTotal: (total): string => `共 ${total} 条`,
                  }}
                  scroll={{ x: dataSource.length > 0 ? 900 : 0 }}
                  className={style.table}
                  rowClassName={style.tableRow}
                  columns={advertingListColumns}
                  dataSource={this.switchDataSource(deviceTypes)}
                />
              )}
              {deviceTypes === DeviceType.Cashier && (
                <Table
                  pagination={{
                    size: 'small',
                    showSizeChanger: false,
                    showQuickJumper: false,
                    pageSize: 3,
                    showTotal: (total): string => `共 ${total} 条`,
                  }}
                  scroll={{ x: cashierDataSource.length > 0 ? 900 : 0 }}
                  className={style.table}
                  rowClassName={style.tableRow}
                  columns={
                    deviceTypes === DeviceType.Cashier ? cashierListColumns : advertingListColumns
                  }
                  dataSource={this.switchDataSource(deviceTypes)}
                />
              )}
              {deviceTypes === DeviceType.Led && (
                <Table
                  pagination={{
                    size: 'small',
                    showSizeChanger: false,
                    showQuickJumper: false,
                    pageSize: 3,
                    showTotal: (total): string => `共 ${total} 条`,
                  }}
                  scroll={{ x: ledDataSource.length > 0 ? 900 : 0 }}
                  className={style.table}
                  rowClassName={style.tableRow}
                  columns={advertingListColumns}
                  dataSource={this.switchDataSource(deviceTypes)}
                />
              )}
            </>
          ) : (
            <Table
              pagination={{
                size: 'small',
                showSizeChanger: false,
                showQuickJumper: false,
                pageSize: 3,
                showTotal: (total): string => `共 ${total} 条`,
              }}
              scroll={{ x: cashierDataSource.length > 0 ? 900 : 0 }}
              className={style.table}
              rowClassName={style.tableRow}
              columns={
                deviceTypes === DeviceType.Cashier ? allCashierListColumns : allAdvertingListColumns
              }
              dataSource={this.switchDataSource(deviceTypes)}
            />
          )}
        </div>
      </div>
    );
  }

  public switchDataSource = (deviceType: string): AdvertisementDeviceListEntity[] => {
    const { advertingListDataSource, cashierListDataSource, ledListDataSource } = this.viewModel;

    const advertingDataSource = advertingListDataSource.filter((item, index) => {
      const idx = advertingListDataSource.findIndex((i) => {
        return item.groupId === i.groupId && item.id === i.id;
      });
      return index === idx;
    });

    const cashierDataSource = cashierListDataSource.filter((item, index) => {
      const idx = cashierListDataSource.findIndex((i) => {
        return item.groupId === i.groupId && item.id === i.id;
      });
      return index === idx;
    });

    const ledDataSource = ledListDataSource.filter((item, index) => {
      const idx = ledListDataSource.findIndex((i) => {
        return item.groupId === i.groupId && item.id === i.id;
      });
      return index === idx;
    });

    switch (deviceType) {
      case DeviceType.Advertisement:
        return advertingDataSource;
      case DeviceType.Cashier:
        return cashierDataSource;
      case DeviceType.Led:
        return ledDataSource;
      default:
        return advertingListDataSource;
    }
  };
  public switchDeviceTypes = (value: string): void => {
    const {
      switchDeviceTypes,
      adSelectedType,
      cashierSelectedType,
      ledSelectedType,
    } = this.viewModel;
    if (value === DeviceType.Advertisement) {
      this.deviceFormRef.current?.setFieldsValue({
        way: adSelectedType,
      });
    }
    if (value === DeviceType.Cashier) {
      this.deviceFormRef.current?.setFieldsValue({
        way: cashierSelectedType,
      });
    }
    if (value === DeviceType.Led) {
      this.deviceFormRef.current?.setFieldsValue({
        way: ledSelectedType,
      });
    }
    switchDeviceTypes(value);
  };

  public render(): JSX.Element {
    const {
      createNoticeModalVisible,
      noticePreviewProps,
      bgColorPickerVisible,
      fontColorPickerVisible,
      setColorPickerVisible,
      setNoticePreviewProps,
      deviceScopeChange,
      modalType,
      onRelease,
      textSizeCode,
      textPositionCode,
      rollSpeendCode,
      currentPage,
      prev,
      next,
      deviceScope,
      advertingListDataSource,
      cashierListDataSource,
      ledListDataSource,
    } = this.viewModel;
    const {
      onFinishByCreateNotice,
      setCreateNoticeModalItemData,
      createNoticeModalItemData,
    } = this.noticeListViewModel;

    // 去重后展示
    const dataSource = advertingListDataSource.filter((item, index) => {
      const idx = advertingListDataSource.findIndex((i) => {
        return item.groupId === i.groupId && item.id === i.id;
      });
      return index === idx;
    });

    const cashierDataSource = cashierListDataSource.filter((item, index) => {
      const idx = cashierListDataSource.findIndex((i) => {
        return item.groupId === i.groupId && item.id === i.id;
      });
      return index === idx;
    });

    const ledDataSource = ledListDataSource.filter((item, index) => {
      const idx = ledListDataSource.findIndex((i) => {
        return item.groupId === i.groupId && item.id === i.id;
      });
      return index === idx;
    });
    return (
      <Modal
        visible={createNoticeModalVisible}
        width={950}
        closable={false}
        footer={null}
        wrapClassName={style.createNoticeModalContainer}
        destroyOnClose
        onCancel={(): void => this.closeModal()}
      >
        <div className={style.createNoticeModalContent}>
          <div className={style.modalHeader}>
            {modalType === ModalStatus.Creat ? '发布紧急通知' : '编辑紧急通知'}
            <Button type="text" onClick={(): void => this.closeModal()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div>
            <Steps current={currentPage}>
              <Step key="设置内容" title="设置内容" />
              <Step key="选择设备" title="选择设备" />
            </Steps>
            {currentPage === 0 && (
              <div className="steps-content">
                <div className={style.stepContentWrapper}>
                  <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={(values: NoticeItemDetailsEntity): void => {
                      if (!values.hour && !values.minute && !values.second) {
                        utils.globalMessge({
                          content: '请输入时分秒',
                          type: 'error',
                        });
                        return;
                      }
                      if (!values.hour && !values.minute && values.second && values.second < 15) {
                        utils.globalMessge({
                          content: '请输入≥15秒的展示时长',
                          type: 'error',
                        });
                        return;
                      }
                      next();
                      onFinishByCreateNotice(currentPage, values);
                    }}
                    initialValues={{ remember: true }}
                    ref={this.formRef}
                  >
                    <Row>
                      <Col
                        span={3}
                        style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}
                      >
                        <span
                          style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            fontSize: '14px',
                            marginRight: '4px',
                          }}
                        >
                          *
                        </span>
                        <span>颜色选择</span>
                      </Col>
                      <Col span={7} className={style.formWrapper}>
                        <div
                          className={style.swatch}
                          onClick={(): void => setColorPickerVisible('fontColor', true)}
                        >
                          <div
                            className={style.color}
                            style={{ backgroundColor: noticePreviewProps.fontColor }}
                          />
                          <span style={{ marginLeft: '4px' }}>字体颜色</span>
                        </div>
                        {fontColorPickerVisible && (
                          <div className={style.popover}>
                            <div
                              className={style.cover}
                              onClick={(): void => setColorPickerVisible('fontColor', false)}
                            />
                            <SketchPicker
                              color={noticePreviewProps.fontColor}
                              onChange={(value: ColorResult): void => {
                                setNoticePreviewProps('fontColor', value.hex);
                                setCreateNoticeModalItemData(value.hex, 'color');
                              }}
                            />
                          </div>
                        )}
                      </Col>
                      <Col span={6} className={style.formWrapper}>
                        <div
                          className={style.swatch}
                          onClick={(): void => setColorPickerVisible('bgColor', true)}
                        >
                          <div
                            className={style.color}
                            style={{ backgroundColor: noticePreviewProps.bgColor }}
                          />
                          <span style={{ marginLeft: '4px' }}>背景颜色</span>
                        </div>
                        {bgColorPickerVisible && (
                          <div className={style.popover}>
                            <div
                              className={style.cover}
                              onClick={(): void => setColorPickerVisible('bgColor', false)}
                            />
                            <SketchPicker
                              color={noticePreviewProps.bgColor}
                              onChange={(value: ColorResult): void => {
                                setNoticePreviewProps('bgColor', value.hex);
                                setCreateNoticeModalItemData(value.hex, 'backgroundColor');
                              }}
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={18}>
                        <Form.Item
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}
                          label="不透明度"
                          name="backgroundTransparency"
                          initialValue={createNoticeModalItemData.backgroundTransparency}
                          rules={[{ required: true }]}
                        >
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            onChange={(): void => this.onChange('backgroundTransparency')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          wrapperCol={{ span: 24 }}
                          name="backgroundTransparency"
                          initialValue={createNoticeModalItemData.backgroundTransparency}
                          rules={[{ required: true, message: '请输入不透明度' }]}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            style={{ margin: '0 16px' }}
                            step={1}
                            addonAfter={<span>%</span>}
                            onChange={(): void => this.onChange('backgroundTransparency')}
                            precision={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className={style.formWrapper}>
                        <Form.Item
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 21 }}
                          label="内容描述"
                          name="content"
                          initialValue={createNoticeModalItemData.content}
                          rules={[{ required: true }]}
                        >
                          <TextArea
                            onBlur={(): void => this.onChange('content')}
                            showCount
                            maxLength={100}
                            rows={4}
                            placeholder="请输入内容"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className={style.formWrapper}>
                        <Form.Item
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 21 }}
                          label="文字大小"
                          name="sizeCode"
                          initialValue={createNoticeModalItemData.sizeCode}
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="文字大小">
                            {textSizeCode.map((item, index) => {
                              return (
                                <Select.Option value={item.value} key={`size_code_${index}`}>
                                  {`${item.meaning}%`}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className={style.formWrapper}>
                        <Form.Item
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 21 }}
                          label="文字位置"
                          name="locationCode"
                          initialValue={createNoticeModalItemData.locationCode}
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="文字位置">
                            {textPositionCode.map((item, index) => {
                              return (
                                <Select.Option value={item.value} key={`location_code_${index}`}>
                                  {item.meaning}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24} className={style.formWrapper}>
                        <Form.Item
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 21 }}
                          label="滚动速度"
                          name="speedCode"
                          initialValue={
                            createNoticeModalItemData.speedCode || NoticeRollSpeed.NORMLAL
                          }
                          rules={[{ required: true }]}
                        >
                          <Radio.Group onChange={(): void => this.onChange('speedCode')}>
                            {rollSpeendCode.map((item, index) => {
                              return (
                                <Radio value={item.value} key={`speed_code_${index}`}>
                                  {item.meaning}
                                </Radio>
                              );
                            })}
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={9} className={style.formWrapper}>
                        <Form.Item
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 12 }}
                          label={(
                            <>
                              展示时长
                              <Tooltip title="下限：15秒，上限：1000小时">
                                <img className={style.tooltipWarning} src={warningIcon} alt="" />
                              </Tooltip>
                            </>
                          )}
                          initialValue={createNoticeModalItemData.hour}
                          name="hour"
                          rules={[{ required: true, message: '请输入时' }]}
                        >
                          <InputNumber
                            min={0}
                            max={1000}
                            step={1}
                            addonAfter={<span>时</span>}
                            precision={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6} className={style.formWrapper}>
                        <Form.Item
                          wrapperCol={{ span: 20 }}
                          initialValue={createNoticeModalItemData.minute}
                          name="minute"
                          rules={[{ required: true, message: '请输入分' }]}
                        >
                          <InputNumber
                            min={0}
                            max={59}
                            step={1}
                            addonAfter={<span>分</span>}
                            precision={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6} className={style.formWrapper}>
                        <Form.Item
                          wrapperCol={{ span: 20 }}
                          initialValue={createNoticeModalItemData.second}
                          name="second"
                          rules={[{ required: true, message: '请输入秒' }]}
                        >
                          <InputNumber
                            min={0}
                            max={59}
                            step={1}
                            addonAfter={<span>秒</span>}
                            precision={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3} style={{ paddingLeft: '10px' }}>
                        效果预览
                      </Col>
                      <Col span={20}>
                        <NoticePreview noticePreviewProps={noticePreviewProps} />
                      </Col>
                    </Row>
                    <div className="steps-action">
                      <Button
                        type="primary"
                        ghost
                        style={{ margin: '0 8px' }}
                        onClick={(): void => this.closeModal()}
                      >
                        取消
                      </Button>
                      <Button type="primary" htmlType="submit">
                        下一步
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            )}
            {currentPage === 1 && (
              <div>
                <Form ref={this.deviceFormRef}>
                  <div className={style.device}>
                    <Form.Item
                      label="发送范围"
                      name="advert"
                      className={style.scope}
                      initialValue={deviceScope}
                    >
                      <Radio.Group onChange={deviceScopeChange}>
                        <Radio value="part">部分设备</Radio>
                        <Radio value="all">全部设备</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className={style.tabsContainer}>
                    <Tabs
                      defaultActiveKey={DeviceType.Advertisement}
                      onChange={(e: string): void => this.switchDeviceTypes(e)}
                    >
                      <Tabs.TabPane
                        tab={`${
                          dataSource.length !== 0 ? `广告机（${dataSource.length}台）` : '广告机'
                        }`}
                        key={DeviceType.Advertisement}
                      >
                        {this.tabsContent(dataSource, cashierDataSource, ledDataSource)}
                      </Tabs.TabPane>
                      <Tabs.TabPane
                        tab={`${
                          cashierDataSource.length !== 0
                            ? `收银机（${cashierDataSource.length}台）`
                            : '收银机'
                        }`}
                        key={DeviceType.Cashier}
                      >
                        {this.tabsContent(dataSource, cashierDataSource, ledDataSource)}
                      </Tabs.TabPane>
                      <Tabs.TabPane
                        tab={`${
                          ledDataSource.length !== 0 ? `LED（${ledDataSource.length}台）` : 'LED'
                        }`}
                        key={DeviceType.Led}
                      >
                        {this.tabsContent(dataSource, cashierDataSource, ledDataSource)}
                      </Tabs.TabPane>
                    </Tabs>
                  </div>
                </Form>
                <div className="steps-action">
                  <Button
                    type="primary"
                    ghost
                    style={{ margin: '0 8px' }}
                    onClick={(): void => this.closeModal()}
                  >
                    取消
                  </Button>
                  <Button type="primary" style={{ margin: '0 8px' }} onClick={(): void => prev()}>
                    上一步
                  </Button>
                  <Button type="primary" onClick={(): void => onRelease(this.noticeListViewModel)}>
                    发布
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  private closeModal = (): void => {
    const { setCreateNoticeModalVisible, initialData } = this.viewModel;
    setCreateNoticeModalVisible(false);
    initialData(this.noticeListViewModel);
  };
}
