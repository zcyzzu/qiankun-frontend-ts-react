/*
 * @Author: liyou
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 10:37:30
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Table, Tooltip, Modal, Row, Select, Button, Col } from 'antd';
import style from './style.less';

import {
  DEFAULT_PAGE_IDENTIFIER,
  DEFAULT_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import DefaultPageListViewModel, { DefaultPageListDataConfig } from './viewModel';
import UploadHistoryRecordModal from '../../publish/advertisement/uploadHistoryRecordModal/index';
import UploadHistoryRecordModalViewModel from '../../publish/advertisement/uploadHistoryRecordModal/viewModel';
import userlistEditInfo from '../../../assets/images/edit_info_icon.svg';
import userlistDelIfo from '../../../assets/images/del_info_icon.svg';
import AddIcon from '../../../assets/images/project_icon_add.svg';
import CreatDefaultPageModalViewModel from '../creatDefaultPageModal/viewModel';
import CreatDefaultPageModal from '../creatDefaultPageModal/index';
import RootContainereViewModel from '../../rootContainer/viewModel';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';
import { ModalStatus, UploadType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

import utils from '../../../utils/index';

interface DefaultPageListProps {}
interface DefaultPageListProps {
  // 缺省页表格列
  defaultPageListColumns: ColumnProps<DefaultPageListDataConfig>[];
}

@observer
export default class DefaultPageList extends React.Component<
  DefaultPageListProps,
  DefaultPageListProps
> {
  private viewModel = DI.DIContainer.get<DefaultPageListViewModel>(
    DEFAULT_PAGE_IDENTIFIER.DEFAULT_PAGE_LIST_VIEW_MODEL,
  );

  private uploadHistoryRecordModalViewModel = DI.DIContainer.get<UploadHistoryRecordModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.DEFAULT_PAGE_LIST_VIEW_MODEL,
  );

  private defaultModalViewModel = DI.DIContainer.get<CreatDefaultPageModalViewModel>(
    DEFAULT_IDENTIFIER.DEFAULT_MODAL_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();
  constructor(props: DefaultPageListProps) {
    super(props);
    this.state = {
      defaultPageListColumns: [],
    };
  }

  componentDidMount(): void {
    const { getDefaultPageList, getDeviceType } = this.viewModel;
    getDefaultPageList();
    getDeviceType();
    this.getDefaultPageListData();
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  // 删除列表单条数据
  private deleteModal(record: DefaultPageListDataConfig): void {
    const { viewModel } = this;
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: '确认删除?删除该缺省页的话客户端的缺省页为空画面，请谨慎删除',
      icon: undefined,
      onOk() {
        viewModel.deleteItem(record);
      },
    });
  }
  // 编辑弹窗
  public editModal = (record: DefaultPageListDataConfig): void => {
    const {
      getLookupsValue,
      setPublishDefaultModalVisible,
      getDetailDefault,
    } = this.defaultModalViewModel;
    getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.DEVICE_RESOLUTION_TYPE);
    getDetailDefault(record.id || 0).then((res) => {
      if (res) {
        setPublishDefaultModalVisible(ModalStatus.Edit, this.rootContainereViewModel);
      }
    });
  };

  private uploadHistoryRecord(): void {
    this.uploadHistoryRecordModalViewModel.setUploadHistoryRecordModalVisible();
  }

  // 打开缺省素材窗口
  private previewMaterial = async (record: DefaultPageListDataConfig): Promise<void> => {
    const { getMaterialUrl } = this.viewModel;
    await getMaterialUrl(record)
      .then(() => {
        if (record.material?.type === UploadType.JPG || record.material?.type === UploadType.PNG) {
          this.imgRef.current?.setIsModalVisible();
        }
        if (record.material?.type === UploadType.MP4) {
          this.videoRef.current?.setIsModalVisible();
        }
      })
      .catch((err) => {
        utils.globalMessge({
          content: `查看素材失败，${err.message}`,
          type: 'error',
        });
      });
  };

  private renderDeviceType = (value: string): string => {
    const { deviceTypeData } = this.viewModel;
    const obj = deviceTypeData.find((item) => item.value === value);
    if (obj) {
      return obj.meaning;
    }
    return value;
  };
  // 构造列表结构
  private getDefaultPageListData = (): void => {
    this.setState({
      defaultPageListColumns: [
        {
          title: '缺省素材',
          key: 'name',
          align: 'left',
          width: '20%',
          render: (record: DefaultPageListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.material ? record.material.name : ''}>
              <Button
                type="link"
                className={style.columnContentShow}
                onClick={(): Promise<void> => this.previewMaterial(record)}
              >
                {record.material ? record.material.name : '--'}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '分辨率',
          dataIndex: 'resolution',
          key: 'resolution',
          align: 'left',
          width: '20%',
        },
        {
          title: '设备类型',
          dataIndex: 'deviceType',
          key: 'deviceType',
          align: 'left',
          width: '20%',
          render: (value: string): JSX.Element => <div>{this.renderDeviceType(value)}</div>,
        },
        {
          title: '最新修改时间',
          dataIndex: 'lastUpdateDate',
          key: 'lastUpdateDate',
          align: 'left',
          width: '20%',
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '20%',
          render: (record: DefaultPageListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>
              <Tooltip title="编辑">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.editModal(record)}
                >
                  <img src={userlistEditInfo} alt="" />
                </button>
              </Tooltip>
              <Tooltip title="删除">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): void => this.deleteModal(record)}
                >
                  <img src={userlistDelIfo} alt="" />
                </button>
              </Tooltip>
            </div>
          ),
        },
      ],
    });
  };

  // 打开新增弹框
  public addModal = (): void => {
    const { getLookupsValue, setPublishDefaultModalVisible } = this.defaultModalViewModel;
    getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.DEVICE_RESOLUTION_TYPE);
    setPublishDefaultModalVisible(ModalStatus.Creat, this.rootContainereViewModel);
  };
  public render(): JSX.Element {
    const {
      defaultPageListDataSource,
      queryParams,
      pageChange,
      selectDeviceList,
      deviceTypeData,
      defaultPageListData,
      sizeChange,
      imageSrc,
      videoSrc,
    } = this.viewModel;
    const { defaultPageListColumns } = this.state;
    return (
      <div className={style.mainContainer}>
        <div className={style.defaultListrootContainer}>
          <Row className={style.searchArea} gutter={24}>
            <Col span={4}>
              <Select
                style={{ marginRight: '16px', width: 100 }}
                bordered={false}
                defaultValue="all"
                onChange={(e: string): void => selectDeviceList(e)}
              >
                <Select.Option value="all">全部设备</Select.Option>
                {deviceTypeData &&
                  deviceTypeData.map((item, index) => (
                    <Select.Option value={item.value || ''} key={index}>
                      {item.meaning}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <div className={style.buttonsContainer}>
            <Button type="primary" style={{ marginRight: '16px' }} onClick={() => this.addModal()}>
              <img src={AddIcon} alt="" />
              <span>新增缺省</span>
            </Button>
          </div>
          <Table<DefaultPageListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: defaultPageListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={defaultPageListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={defaultPageListColumns}
            dataSource={defaultPageListDataSource}
          />
          <UploadHistoryRecordModal />
          <CreatDefaultPageModal />
          <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
          <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
        </div>
      </div>
    );
  }
}
