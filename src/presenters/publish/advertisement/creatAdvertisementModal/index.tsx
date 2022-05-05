/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-25 15:46:15
 */
import React from 'react';
import { observer } from 'mobx-react';
import {
  Modal,
  Form,
  Button,
  Input,
  DatePicker,
  Radio,
  Tooltip,
  Steps,
  Checkbox,
  Row,
  Col,
  Select,
  Upload,
  Tabs,
  Cascader,
  Table,
  TimePicker,
  FormInstance,
  InputNumber,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import DI from '../../../../inversify.config';
import {
  ADVERTISEMENT_IDENTIFIER,
  DEFAULT_PAGE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  CONFIG_IDENTIFIER,
} from '../../../../constants/identifiers';
import CreatAdvertisementModalViewModel, { DeviceScope } from './viewModel';
import { AdvertisementDeviceListEntity } from '../../../../domain/entities/advertisementEntities';
import ConfigProvider from '../../../../common/config/configProvider';
import style from './style.less';
import timeTooips from '../../../../assets/images/time_tooips.svg';
import closeIcon from '../../../../assets/images/close_icon_normal.svg';
import addIcon from '../../../../assets/images/circle_add_icon.svg';
import deleteIcon from '../../../../assets/images/circle_delete_icon.svg';
import uploadIcon from '../../../../assets/images/upload.svg';
import uploadRecord from '../../../../assets/images/upload_record.svg';
import resultsIcon from '../../../../assets/images/results_icon.svg';
import deleteTable from '../../../../assets/images/delete_icon.svg';
import datePickerRightIcon from '../../../../assets/images/date_picker_right.svg';
import timePickerIcon from '../../../../assets/images/time_picker.svg';

import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import AdvertisementListViewModel from '../advertisementList/viewModel';
import UploadHistoryRecordModal from '../../advertisement/uploadHistoryRecordModal/index';
import UploadHistoryRecordModalViewModel from '../../advertisement/uploadHistoryRecordModal/viewModel';
import utils from '../../../../utils/index';
import RootContainereViewModel from '../../../rootContainer/viewModel';
import { ModalStatus, UploadType, DeviceType } from '../../../../common/config/commonConfig';

const { Step } = Steps;

interface AdvertingProps {}
interface AdvertingState {
  //列表表格列头
  advertingListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  cashierListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  // 全部
  allAdvertingListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  allCashierListColumns: ColumnProps<AdvertisementDeviceListEntity>[];
  startTime: string;
}

@observer
export default class CreatAdvertisementModal extends React.Component<
  AdvertingProps,
  AdvertingState
> {
  private creatAdvertisementModalViewModel = DI.DIContainer.get<CreatAdvertisementModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_CREATADVERTISEMENT_VIEW_MODEL,
  );

  private advertisementListViewModel = DI.DIContainer.get<AdvertisementListViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_LIST_VIEW_MODEL,
  );

  private uploadHistoryRecordModalViewModel = DI.DIContainer.get<UploadHistoryRecordModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.UPLOAD_HISTORY_RECORD_MODAL_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private configProvider = DI.DIContainer.get<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER);

  private formRef = React.createRef<MaterialPreviewModal>();
  private getRef = React.createRef<FormInstance>();
  private adRef = React.createRef<FormInstance>();
  private deviceRef = React.createRef<FormInstance>();

  constructor(props: AdvertingProps) {
    super(props);
    this.state = {
      advertingListColumns: [],
      cashierListColumns: [],
      allAdvertingListColumns: [],
      allCashierListColumns: [],
      startTime: new Date(+new Date() + 8 * 3600 * 1000)
        .toISOString()
        .split('T')[1]
        .split('.')[0],
    };
  }

  componentDidMount(): void {
    const { deleteDevice } = this.creatAdvertisementModalViewModel;
    // getAdvertisingList();
    this.setState({
      advertingListColumns: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
        },
        {
          title: '所在楼层',
          dataIndex: 'floor',
          key: 'floor',
          align: 'left',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (record): JSX.Element => (
            <Tooltip title={record}>
              <span className={style.groupName}>{record}</span>
            </Tooltip>
          ),
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          fixed: 'right',
          width: '8%',
          render: (record): JSX.Element => (
            <div>
              <Tooltip title="删除">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => deleteDevice(record)}
                >
                  <img src={deleteTable} alt="" />
                </button>
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
        },
        {
          title: '品牌业态',
          dataIndex: 'brandFormat',
          key: 'brandFormat',
          align: 'left',
        },
        {
          title: '点位品牌名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (record): JSX.Element => (
            <Tooltip title={record}>
              <span className={style.groupName}>{record}</span>
            </Tooltip>
          ),
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          width: '8%',
          fixed: 'right',
          render: (record): JSX.Element => (
            <div>
              <Tooltip title="删除">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => deleteDevice(record)}
                >
                  <img src={deleteTable} alt="" />
                </button>
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
        },
        {
          title: '所在楼层',
          dataIndex: 'floor',
          key: 'floor',
          align: 'left',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (value: string): JSX.Element => (
            <Tooltip title={value}>
              <span>{value}</span>
            </Tooltip>
          ),
        },
      ],
      allCashierListColumns: [
        {
          title: '项目/门店名称',
          dataIndex: 'storeName',
          key: 'storeName',
          align: 'left',
        },
        {
          title: '品牌业态',
          dataIndex: 'brandFormat',
          key: 'brandFormat',
          align: 'left',
        },
        {
          title: '点位品牌名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'left',
        },
        {
          title: '组名名称',
          dataIndex: 'groupName',
          key: 'groupName',
          align: 'left',
          ellipsis: true,
          render: (value: string): JSX.Element => (
            <Tooltip title={value}>
              <span>{value}</span>
            </Tooltip>
          ),
        },
      ],
    });
  }
  // 打开历史上传记录modal
  private historyUpload = async (type?: string, index?: number, i?: number): Promise<void> => {
    const {
      getUploadRecordListData,
      setUploadHistoryRecordModalVisible,
    } = this.uploadHistoryRecordModalViewModel;
    await getUploadRecordListData();
    setUploadHistoryRecordModalVisible(type, index, i);
  };

  private labelTooips(): JSX.Element {
    return (
      <div className={style.labelTooips}>
        霸屏情况
        <Tooltip
          placement="top"
          title="提示：若选择霸屏则已选时间段的不霸屏广告将暂停播放，优先播放霸屏的广告内容。"
        >
          <img className={style.timeImg} src={timeTooips} alt="" />
        </Tooltip>
      </div>
    );
  }

  private labelRequired(): JSX.Element {
    return (
      <div>
        <span className={style.required}>*</span>
        播放时段
      </div>
    );
  }
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
      specificDeviceData,
      removeEq,
      device,
      wayTypeAd,
      wayTypeCa,
      wayTypeLed,
      deviceContent,
      optionsDevice,
      storeNameList,
      storeNameCashierList,
      storeNameLedList,
    } = this.creatAdvertisementModalViewModel;
    const {
      advertingListColumns,
      cashierListColumns,
      allCashierListColumns,
      allAdvertingListColumns,
    } = this.state;

    if (removeEq === 1) {
      this.deviceRef.current?.setFieldsValue({ device: specificDeviceData });
    } else {
      this.deviceRef.current?.setFieldsValue({ device: specificDevice });
    }

    // 切换的时候， 设置当前的选择方式
    if (deviceContent === 'ADMACHINE') {
      this.deviceRef.current?.setFieldsValue({ way: wayTypeAd });
    } else if (deviceContent === 'CASHIER') {
      this.deviceRef.current?.setFieldsValue({ way: wayTypeCa });
    } else if (deviceContent === 'LED') {
      this.deviceRef.current?.setFieldsValue({ way: wayTypeLed });
    }
    return (
      <div>
        {device === 'part' && (
          <Col span={24}>
            <Row>
              <Col span={11} className={style.screening}>
                <Form.Item label="选择方式" name="way" initialValue={wayTypeAd}>
                  <Select
                    // suffixIcon={<img src={selectIcon} alt="" />}
                    placeholder="请选择选择方式"
                    style={{ width: '235px' }}
                    onChange={setWayType}
                    getPopupContainer={(triggerNode): HTMLElement => {
                      return triggerNode.parentElement || triggerNode;
                    }}
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
                  name="device"
                  className={style.scope}
                  // initialValue={specificDevice}
                >
                  <Cascader
                    style={{ width: '235px' }}
                    multiple
                    showSearch
                    value={specificDevice}
                    onChange={setDevice}
                    options={optionsDevice}
                    maxTagCount="responsive"
                    placeholder="搜索或选择的具体设备"
                    // getPopupContainer={(triggerNode): HTMLElement => (
                    //   triggerNode.parentElement || triggerNode
                    // )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        )}
        <div className={style.result}>
          <img src={resultsIcon} alt="" />
          <span>
            {deviceContent === DeviceType.Advertisement &&
              `选择结果：${storeNameList.length}个项目/门店，${dataSource.length}台设备`}
            {deviceContent === DeviceType.Cashier &&
              `选择结果：${storeNameCashierList.length}个项目/门店，${cashierDataSource.length}台设备`}
            {deviceContent === DeviceType.Led &&
              `选择结果：${storeNameLedList.length}个项目/门店，${ledDataSource.length}台设备`}
          </span>
        </div>
        <div className={style.tableContent}>
          {device === DeviceScope.Part ? (
            <div>
              {deviceContent === DeviceType.Advertisement && (
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
                  dataSource={this.switchDataSource(deviceContent)}
                />
              )}
              {deviceContent === DeviceType.Cashier && (
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
                  columns={deviceContent === 'CASHIER' ? cashierListColumns : advertingListColumns}
                  dataSource={this.switchDataSource(deviceContent)}
                />
              )}
              {deviceContent === DeviceType.Led && (
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
                  dataSource={this.switchDataSource(deviceContent)}
                />
              )}
            </div>
          ) : (
            <Table
              pagination={{
                size: 'small',
                showSizeChanger: false,
                showQuickJumper: false,
                pageSize: 3,
                showTotal: (total): string => `共 ${total} 条`,
              }}
              className={style.table}
              rowClassName={style.tableRow}
              columns={
                deviceContent === 'CASHIER' ? allCashierListColumns : allAdvertingListColumns
              }
              dataSource={this.switchDataSource(deviceContent)}
            />
          )}
        </div>
      </div>
    );
  }

  public switchDataSource = (deviceType: string): AdvertisementDeviceListEntity[] => {
    const {
      advertingListDataSource,
      cashierListDataSource,
      ledListDataSource,
    } = this.creatAdvertisementModalViewModel;

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
  // 只能输入整数
  private limitNumber = (value: string | number | undefined): string => {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      // eslint-disable-next-line no-restricted-globals
      return !isNaN(Number(value)) ? String(parseInt(String(value), 10)) : '';
    }
    if (typeof value === 'number') {
      // eslint-disable-next-line no-restricted-globals
      return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : '';
    }
    return '';
  };

  private submitForm = (): void => {
    const {
      // setCurrent,
      setNextRules,
    } = this.creatAdvertisementModalViewModel;
    // setCurrent('next')
    setNextRules(true);
    this.getRef.current?.submit();
  };
  private disabledHours = (): number[] => {
    const hours = [];
    // eslint-disable-next-line react/destructuring-assignment
    const time = this.state.startTime;
    const timeArr = time.split(':');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < parseInt(timeArr[0], 10); i++) {
      hours.push(i);
    }
    return hours;
  };

  private disabledMinutes = (selectedHour: number): number[] => {
    const { startTime } = this.state;
    const timeArr = startTime.split(':');
    const minutes = [];
    if (selectedHour === parseInt(timeArr[0], 10)) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < parseInt(timeArr[1], 10); i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };
  private disabledSeconds = (selectedHour: number, selectedMinute: number): number[] => {
    const { startTime } = this.state;
    const timeArr = startTime.split(':');
    const second = [];
    if (selectedHour === parseInt(timeArr[0], 10) && selectedMinute === parseInt(timeArr[1], 10)) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= parseInt(timeArr[2], 10); i++) {
        second.push(i);
      }
    }
    return second;
  };
  private handlePreviewFile = (file: File | Blob): PromiseLike<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        const url = URL.createObjectURL(file);
        if (file.type.split('/')[0] === 'video') {
          utils.getFramesUrl(url).then((res) => {
            resolve(res);
          });
        } else {
          resolve(url);
        }
      };
    });
  };

  public render(): JSX.Element {
    const {
      copy,
      modalType,
      banTime,
      //条件配置
      formOnFinish,
      configConditions,
      advertisingModalVisible,
      setAdvertisingModalVisible,
      current,
      setCurrent,
      weeks,
      cycleChange,
      optionsCheck,
      timeSlot,
      setTimeSlot,
      timeRules,
      timeRulesPlay,
      playTime,
      //上传素材
      adName,
      dynamicName,
      dynamicData,
      batchData,
      nameChange,
      uploadFormProps,
      setUploadType,
      uploadType,
      fileList,
      uploadChange,
      setUploadTime,
      setImagePreview,
      initBackgroundItem,
      imgUrl,
      uploadTime,
      modalIndex,
      batchModalIndex,
      beforeUpload,
      // getfileUrl,
      //选择设备
      device,
      deviceChange,
      switchDevice,
      saveRelease,
      resolutionList,
      deviceContent,
      //快码
      cycleCode,
      advertisementLevelCode,
      materialData,
      materialIndex,
      batchMaterialData,
      batchMaterialIndex,
      isChange,

      advertingListDataSource,
      cashierListDataSource,
      ledListDataSource,
    } = this.creatAdvertisementModalViewModel;
    const { userInfo } = this.rootContainereViewModel;

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
    const steps = [
      {
        title: '配置条件',
        content: 'First-content',
      },
      {
        title: '选择设备',
        content: 'Second-content',
      },
      {
        title: '上传素材',
        content: 'Last-content',
      },
    ];

    if (batchMaterialIndex !== undefined) {
      const data =
        batchMaterialData.type === UploadType.JPG || batchMaterialData.type === UploadType.PNG
          ? 'image'
          : 'video';
      this.adRef.current?.setFieldsValue({ [`batchType${batchMaterialIndex}`]: data });
    }

    if (materialIndex !== undefined) {
      const data =
        materialData.type === UploadType.JPG || materialData.type === UploadType.PNG
          ? 'image'
          : 'video';
      this.adRef.current?.setFieldsValue({ [`type${materialIndex}`]: data });
    }

    return (
      <Modal
        visible={advertisingModalVisible}
        width={750}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setAdvertisingModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            {modalType === ModalStatus.Edit
              ? `${copy === 'copy' ? '发布广告' : '编辑广告'}`
              : '发布广告'}
            <Button type="text" onClick={(): void => setAdvertisingModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div>
            {current === 0 && (
              <div className={style.stepsContent}>
                <Form
                  onFinish={(values): void => {
                    formOnFinish(values, this.advertisementListViewModel);
                  }}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 21 }}
                  ref={this.getRef}
                >
                  <div>
                    {/* <Form.Item
                      label="广告名称"
                      name="advertisement"
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
                      initialValue={configConditions.advertisement}
                    >
                      <Input placeholder="请输入广告名称" />
                    </Form.Item> */}
                    <Form.Item
                      label="播放日期"
                      name="playTime"
                      rules={[{ required: true, message: '请选择日期区间' }]}
                      initialValue={configConditions.playTime}
                    >
                      <DatePicker.RangePicker
                        suffixIcon={<img src={datePickerRightIcon} alt="" />}
                        onChange={(dates, dateStrings): void => playTime(dates, dateStrings)}
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                        // eslint-disable-next-line no-shadow
                        disabledDate={(current): boolean => {
                          return current && current < moment().subtract(1, 'day');
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="广告周期"
                      name="advert"
                      rules={[{ required: true, message: '请选择广告周期' }]}
                      className={style.cycle}
                      initialValue={configConditions.advert}
                    >
                      <Radio.Group onChange={cycleChange}>
                        {cycleCode.map((item) => {
                          return <Radio value={item.value}>{item.meaning}</Radio>;
                        })}
                      </Radio.Group>
                    </Form.Item>
                    {weeks === 'WEEK' && (
                      <div className={style.weeks}>
                        <Form.Item
                          name="weeks"
                          wrapperCol={{ span: 24 }}
                          rules={[{ required: true, message: '请选择每周的具体周值' }]}
                          initialValue={configConditions.weeks}
                        >
                          <Checkbox.Group options={optionsCheck} />
                        </Form.Item>
                      </div>
                    )}
                    <Form.List
                      name="doublePointsRulesFormList"
                      initialValue={configConditions.doublePointsRulesFormList}
                    >
                      {(fields, { add, remove }): JSX.Element => (
                        <>
                          <Row className={style.ruleList} align="middle" gutter={8}>
                            <Col
                              span={24}
                              className={timeRules || timeRulesPlay ? style.rulesTime : ''}
                            >
                              <Form.Item
                                label={this.labelRequired()}
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 21 }}
                                // name="timeOn"
                                rules={[{ required: true, message: '请选择播放时段' }]}
                              >
                                <TimePicker.RangePicker
                                  suffixIcon={<img src={timePickerIcon} alt="" />}
                                  value={
                                    JSON.parse(JSON.stringify(timeSlot))[0]
                                      ? [
                                          moment(timeSlot[0], 'HH:mm:ss'),
                                          moment(timeSlot[1], 'HH:mm:ss'),
                                        ]
                                      : undefined
                                  }
                                  disabledHours={banTime ? this.disabledHours : undefined}
                                  disabledMinutes={banTime ? this.disabledMinutes : undefined}
                                  disabledSeconds={banTime ? this.disabledSeconds : undefined}
                                  onChange={setTimeSlot}
                                  style={{ width: '100%' }}
                                  format="HH:mm:ss"
                                  placeholder={['开始时间', '结束时间']}
                                  getPopupContainer={(triggerNode): HTMLElement => {
                                    return triggerNode.parentElement || triggerNode;
                                  }}
                                />
                              </Form.Item>
                              {timeRulesPlay ? (
                                <div className={style.timeSlot}>开始和结束时间相同，请重新设置</div>
                              ) : (
                                ''
                              )}
                              {timeRules ? (
                                <div className={style.timeSlot}>请选择播放时段</div>
                              ) : (
                                ''
                              )}
                            </Col>
                            {fields.length < 2 ? (
                              <Col span={3} className={style.btn}>
                                <Button
                                  type="text"
                                  onClick={(): void => {
                                    add();
                                  }}
                                >
                                  <img src={addIcon} alt="" />
                                </Button>
                              </Col>
                            ) : (
                              ''
                            )}
                          </Row>
                          {fields.map((filed) => (
                            <Row
                              key={filed.key}
                              className={style.ruleList}
                              align="middle"
                              gutter={8}
                            >
                              <Col span={5} />
                              <Col span={19}>
                                <Form.Item
                                  {...filed}
                                  // name={[name, 'time']}
                                  // fieldKey={[fieldKey, 'time']}
                                  rules={[{ required: true, message: '请选择播放时段' }]}
                                >
                                  <TimePicker.RangePicker
                                    disabledHours={banTime ? this.disabledHours : undefined}
                                    disabledMinutes={banTime ? this.disabledMinutes : undefined}
                                    disabledSeconds={banTime ? this.disabledSeconds : undefined}
                                    suffixIcon={<img src={timePickerIcon} alt="" />}
                                    style={{ width: '393px' }}
                                    format="HH:mm:ss"
                                    placeholder={['开始时间', '结束时间']}
                                    getPopupContainer={(triggerNode): HTMLElement => {
                                      return triggerNode.parentElement || triggerNode;
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={3} className={style.btn}>
                                <Button
                                  type="text"
                                  onClick={(): void => {
                                    remove(filed.name);
                                  }}
                                >
                                  <img src={deleteIcon} alt="" />
                                </Button>
                              </Col>
                            </Row>
                          ))}
                        </>
                      )}
                    </Form.List>

                    <Form.Item
                      label={this.labelTooips()}
                      name="screen"
                      className={style.cycle}
                      initialValue={configConditions.screen}
                    >
                      <Radio.Group>
                        {advertisementLevelCode.map((item) => {
                          return <Radio value={item.value}>{item.meaning}</Radio>;
                        })}
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className={style.bottomButton}>
                    <Button
                      type="primary"
                      ghost
                      style={{ marginRight: '24px' }}
                      onClick={(): void => setAdvertisingModalVisible()}
                    >
                      取消
                    </Button>
                    {current < steps.length - 1 && (
                      <Button
                        type="primary"
                        onClick={this.submitForm}
                        style={{ marginRight: '24px' }}
                      >
                        下一步
                      </Button>
                    )}
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {current === 1 && (
              <div>
                <Form ref={this.deviceRef}>
                  <div className={style.device}>
                    <Form.Item
                      label="发送范围"
                      name="advert"
                      className={style.scope}
                      initialValue={device}
                    >
                      <Radio.Group onChange={deviceChange}>
                        <Radio value={DeviceScope.Part}>部分设备</Radio>
                        <Radio value={DeviceScope.All}>全部设备</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className={style.tabsContainer}>
                    <Tabs
                      defaultActiveKey="ADMACHINE"
                      onChange={switchDevice}
                      activeKey={deviceContent}
                    >
                      <Tabs.TabPane
                        tab={`${
                          dataSource.length !== 0 ? `广告机（${dataSource.length}台）` : '广告机'
                        }`}
                        key="ADMACHINE"
                      >
                        {this.tabsContent(dataSource, cashierDataSource, ledDataSource)}
                      </Tabs.TabPane>
                      <Tabs.TabPane
                        tab={`${
                          cashierDataSource.length !== 0
                            ? `收银机（${cashierDataSource.length}台）`
                            : '收银机'
                        }`}
                        key="CASHIER"
                      >
                        {this.tabsContent(dataSource, cashierDataSource, ledDataSource)}
                      </Tabs.TabPane>
                      <Tabs.TabPane
                        tab={`${
                          ledDataSource.length !== 0 ? `LED（${ledDataSource.length}台）` : 'LED'
                        }`}
                        key="LED"
                      >
                        {this.tabsContent(dataSource, cashierDataSource, ledDataSource)}
                      </Tabs.TabPane>
                    </Tabs>
                  </div>
                  <div className={style.bottomButton}>
                    <Button
                      type="primary"
                      ghost
                      style={{ marginRight: '24px' }}
                      onClick={(): void => setAdvertisingModalVisible()}
                    >
                      取消
                    </Button>
                    {current > 0 && (
                      <Button
                        type="primary"
                        style={{ marginRight: '24px' }}
                        onClick={(): void => setCurrent('prev')}
                      >
                        上一步
                      </Button>
                    )}
                    {current < steps.length - 1 && (
                      <Button
                        type="primary"
                        onClick={(): void => setCurrent('next')}
                        style={{ marginRight: '24px' }}
                      >
                        下一步
                      </Button>
                    )}
                    <Button
                      type="primary"
                      onClick={(): void => (
                        saveRelease('device', '', this.advertisementListViewModel)
                      )}
                    >
                      保存
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {current === 2 && (
              <div className={style.uploadContent}>
                <div className={style.uploadTitle}>
                  <div>1、支持图片、视频格式上传，包括不限于：MP4、PNG、JPG等。</div>
                  <div>2、视频格式大小在20M内，图片格式大小在2M内。</div>
                  <div>3、可上传5-20秒内的素材。</div>
                  <div>4、为了更好的播放效果，请选择分辨率与设备分辨率相同的素材。</div>
                </div>
                <div style={{ display: 'flex' }}>
                  <Form labelCol={{ span: 7 }} wrapperCol={{ span: 18 }} style={{ width: '320px' }}>
                    <Form.Item
                      label="01广告名称"
                      name="advertisement"
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
                      initialValue={adName}
                    >
                      <Input
                        onChange={nameChange}
                        placeholder="请输入广告名称"
                        style={{ width: '220px' }}
                      />
                    </Form.Item>
                  </Form>
                  {batchData.length !== 5 && modalType === ModalStatus.Creat ? (
                    <div onClick={(): void => dynamicData('add')}>
                      <img src={addIcon} style={{ marginLeft: '10px' }} alt="" />
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <Row>
                  {resolutionList.map((item, index) => {
                    return (
                      <Col span={11} className={style.upload}>
                        <Form ref={this.adRef}>
                          <Form.Item
                            label="上传类型"
                            name={`type${index}`}
                            rules={[{ required: true }]}
                            initialValue={uploadType[index] || undefined}
                          >
                            <Select
                              placeholder="请选择上传类型"
                              style={{ width: '200px' }}
                              onChange={(e: string): void => setUploadType(e, index)}
                            >
                              <Select.Option value={UploadType.IMAGE}>图片</Select.Option>
                              <Select.Option value={UploadType.VIDEO}>视频</Select.Option>
                            </Select>
                          </Form.Item>
                          {uploadType[index] === UploadType.IMAGE && (
                            <Form.Item
                              label="播放时长"
                              name="time"
                              initialValue={uploadTime[index]}
                            >
                              <InputNumber
                                placeholder="可输入5-20秒"
                                formatter={this.limitNumber}
                                min={5}
                                max={20}
                                style={{ width: '200px' }}
                                addonAfter="秒"
                                onChange={(e): void => setUploadTime(e, index)}
                              />
                            </Form.Item>
                          )}
                          {isChange}
                          <Upload.Dragger
                            key={item.id}
                            disabled={
                              uploadType[index] === ''
                              // ||
                              // (uploadType[index] === UploadType.IMAGE
                              //   && uploadTime[index] === undefined)
                            }
                            {...uploadFormProps}
                            accept={
                              uploadType[index] === UploadType.IMAGE ? '.jpg, .png' : '.mp4'
                            }
                            beforeUpload={(file, fileType): Promise<boolean | string> => {
                              return beforeUpload(file, fileType, item.resolution, index);
                            }}
                            fileList={fileList[index]}
                            onChange={(e): void => uploadChange(e, index, item.resolution)}
                            onPreview={(file): void => setImagePreview(file, this.formRef, index)}
                            onRemove={(): boolean => {
                              initBackgroundItem(index);
                              return true;
                            }}
                            previewFile={isChange ? this.handlePreviewFile : undefined}
                            action={(file): string => {
                              return `${this.configProvider.apiPublicUrl}/hfle/v1/${
                                userInfo.tenantId
                              }/files/secret-multipart?bucketName=${
                                file.name.split('.').reverse()[0]
                              }&fileName=${file.name}`;
                            }}
                            className={style.uploadContainer}
                            style={{ display: fileList[index]?.length ? 'none' : 'block' }}
                            maxCount={1}
                          >
                            <img src={uploadIcon} alt="" />
                            <div className={style.uploadDescribe}>{item.resolution}px</div>
                          </Upload.Dragger>
                          <div
                            className={style.record}
                            onClick={(): Promise<void> => this.historyUpload('advert', index)}
                          >
                            <img src={uploadRecord} alt="" />
                            历史上传记录
                          </div>
                        </Form>
                      </Col>
                    );
                  })}
                </Row>
                {batchData.map((v, i) => {
                  return (
                    <div>
                      <div style={{ display: 'flex' }}>
                        <Form
                          labelCol={{ span: 7 }}
                          wrapperCol={{ span: 18 }}
                          style={{ width: '320px' }}
                        >
                          <Form.Item
                            label={`0${i + 2}广告名称`}
                            name="advertisement"
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
                            initialValue={batchData[i].adName}
                          >
                            <Input
                              onChange={(e): void => dynamicName(e, i)}
                              placeholder="请输入广告名称"
                              style={{ width: '220px' }}
                            />
                          </Form.Item>
                        </Form>
                        <div onClick={(): void => dynamicData('detele', i)}>
                          <img src={deleteIcon} style={{ marginLeft: '10px' }} alt="" />
                        </div>
                      </div>

                      <Row>
                        {resolutionList.map((item, index) => {
                          return (
                            <Col span={11} className={style.upload}>
                              <Form ref={this.adRef}>
                                <Form.Item
                                  label="上传类型"
                                  name={`batchType${index}`}
                                  rules={[{ required: true }]}
                                  initialValue={batchData[i].uploadType[index] || undefined}
                                >
                                  <Select
                                    placeholder="请选择上传类型"
                                    style={{ width: '200px' }}
                                    onChange={(e: string): void => setUploadType(e, index, i)}
                                  >
                                    <Select.Option value={UploadType.IMAGE}>图片</Select.Option>
                                    <Select.Option value={UploadType.VIDEO}>视频</Select.Option>
                                  </Select>
                                </Form.Item>
                                {batchData[i].uploadType[index] === UploadType.IMAGE && (
                                  <Form.Item
                                    label="播放时长"
                                    name="time"
                                    initialValue={batchData[i].uploadTime[index]}
                                  >
                                    <InputNumber
                                      placeholder="可输入5-20秒"
                                      formatter={this.limitNumber}
                                      min={5}
                                      max={20}
                                      style={{ width: '200px' }}
                                      addonAfter="秒"
                                      onChange={(e): void => setUploadTime(e, index, i)}
                                    />
                                  </Form.Item>
                                )}
                                {isChange}
                                <Upload.Dragger
                                  key={item.id}
                                  disabled={
                                    batchData[i].uploadType[index] === ''
                                    // ||
                                    // (batchData[i].uploadType[index] === UploadType.IMAGE)
                                    // && batchData[i].uploadTime[index] === undefined)
                                  }
                                  {...uploadFormProps}
                                  accept={
                                    batchData[i].uploadType[index] === UploadType.IMAGE
                                      ? '.jpg, .png'
                                      : '.mp4'
                                  }
                                  beforeUpload={(file, fileType): Promise<boolean | string> => {
                                    return beforeUpload(file, fileType, item.resolution, index, i);
                                  }}
                                  fileList={batchData[i].fileList[index]}
                                  onChange={(e): void => uploadChange(e, index, item.resolution, i)}
                                  onPreview={(file): void => {
                                    return setImagePreview(file, this.formRef, index, i);
                                  }}
                                  onRemove={(): boolean => {
                                    initBackgroundItem(index, i);
                                    return true;
                                  }}
                                  previewFile={isChange ? this.handlePreviewFile : undefined}
                                  action={(file): string => {
                                    return `${this.configProvider.apiPublicUrl}/hfle/v1/${
                                      userInfo.tenantId
                                    }/files/secret-multipart?bucketName=${
                                      file.name.split('.').reverse()[0]
                                    }&fileName=${file.name}`;
                                  }}
                                  className={style.uploadContainer}
                                  style={{
                                    display: batchData[i].fileList[index]?.length
                                      ? 'none'
                                      : 'block',
                                  }}
                                  maxCount={1}
                                >
                                  <img src={uploadIcon} alt="" />
                                  <div className={style.uploadDescribe}>{item.resolution}px</div>
                                </Upload.Dragger>
                                <div
                                  className={style.record}
                                  onClick={(): Promise<void> => {
                                    return this.historyUpload('advert', index, i);
                                  }}
                                >
                                  <img src={uploadRecord} alt="" />
                                  历史上传记录
                                </div>
                              </Form>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  );
                })}
                {batchData.length > 0 ? (
                  <MaterialPreviewModal
                    url={batchData[batchModalIndex].imgUrl[modalIndex]}
                    ref={this.formRef}
                    type={batchData[batchModalIndex].uploadType[modalIndex]}
                  />
                ) : (
                  ''
                )}
                <MaterialPreviewModal
                  url={imgUrl[modalIndex]}
                  ref={this.formRef}
                  type={uploadType[modalIndex]}
                />
                <div className={style.bottomButton}>
                  <Button
                    type="primary"
                    ghost
                    style={{ marginRight: '24px' }}
                    onClick={(): void => setAdvertisingModalVisible()}
                  >
                    取消
                  </Button>
                  {current > 0 && (
                    <Button
                      type="primary"
                      style={{ marginRight: '24px' }}
                      onClick={(): void => setCurrent('prev')}
                    >
                      上一步
                    </Button>
                  )}
                  <Button
                    type="primary"
                    onClick={(): void => {
                      return saveRelease('material', '', this.advertisementListViewModel);
                    }}
                  >
                    保存
                  </Button>
                  <Button
                    type="primary"
                    onClick={(): void => {
                      return saveRelease('material', 'publish', this.advertisementListViewModel);
                    }}
                    style={{ marginLeft: '24px' }}
                  >
                    发布
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <UploadHistoryRecordModal />
      </Modal>
    );
  }
}
