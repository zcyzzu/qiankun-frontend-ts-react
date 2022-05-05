/*
 * @Author: liyou
 * @Date: 2021-11-30 10:56:25
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 11:36:49
 */
import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { ColumnProps } from 'antd/lib/table';
import { Table, Tooltip, Modal, Row, Select, Button, Col } from 'antd';
import style from './style.less';

import { DEFAULT_PAGE_IDENTIFIER, ROOT_CONTAINER_IDENTIFIER } from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import PublishDefaultPageListViewModel, { PublishDefaultPageListDataConfig } from './viewModel';
import UploadHistoryRecordModal from '../../publish/advertisement/uploadHistoryRecordModal/index';
import UploadHistoryRecordModalViewModel from '../../publish/advertisement/uploadHistoryRecordModal/viewModel';
import userlistEditInfo from '../../../assets/images/edit_info_icon.svg';
import userlistDelIfo from '../../../assets/images/del_info_icon.svg';
import AddIcon from '../../../assets/images/project_icon_add.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';
import CreatPublishDafaultPageModalViewModel from './creatPublishDafaultPageModal/viewModel';
import CreatPublishDafaultPageModal from './creatPublishDafaultPageModal/index';
import { ModalStatus, UploadType } from '../../../common/config/commonConfig';

import RootContainereViewModel from '../../rootContainer/viewModel';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';
import utils from '../../../utils/index';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';

interface PublishDefaultPageListProps {}
interface PublishDefaultPageListState {
  // 缺省页表格列
  publishDefaultPageListColumns: ColumnProps<PublishDefaultPageListDataConfig>[];
}
const { DEFAULT } = PERMISSIONS_CODES;

@observer
export default class PublishDefaultPageList extends React.Component<
  PublishDefaultPageListProps,
  PublishDefaultPageListState
> {
  private viewModel = DI.DIContainer.get<PublishDefaultPageListViewModel>(
    DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_PAGE_LIST_VIEW_MODEL,
  );

  private uploadHistoryRecordModalViewModel = DI.DIContainer.get<UploadHistoryRecordModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.UPLOAD_HISTORY_RECORD_MODAL_VIEW_MODEL,
  );

  private defaultModalViewModel = DI.DIContainer.get<CreatPublishDafaultPageModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_MODAL_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();

  constructor(props: PublishDefaultPageListProps) {
    super(props);
    this.state = {
      publishDefaultPageListColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getPublishDefaultPageList, getDeviceType } = this.viewModel;
    await this.getPermissonData();
    getPublishDefaultPageList();
    getDeviceType();
    this.getPublishDefaultPageListData();
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { NEW, EDIT, DELETE, SEE } = DEFAULT;
    try {
      const permissionsData = await getPermissionsData([NEW, EDIT, DELETE, SEE]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  // 删除列表单条数据
  private deleteModal(record: PublishDefaultPageListDataConfig): void {
    const { viewModel } = this;
    Modal.confirm({
      title: '删除',
      maskClosable: true,
      content: '删除该缺省页的话对应设备类型的分辨率设备缺省页将默认播放时耘招商广告，确认删除?',
      icon: undefined,
      onOk() {
        viewModel.deleteItem(record);
      },
    });
  }
  // 编辑弹窗
  public editModal = (record: PublishDefaultPageListDataConfig): void => {
    const {
      getLookupsValue,
      setPublishDefaultModalVisible,
      getOrganization,
      getDetailDefault,
    } = this.defaultModalViewModel;
    getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.DEVICE_RESOLUTION_TYPE);
    getOrganization();
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
  private previewMaterial = async (record: PublishDefaultPageListDataConfig): Promise<void> => {
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
  private getPublishDefaultPageListData = (): void => {
    const { permissionsData } = this.viewModel;
    const { DELETE, EDIT } = DEFAULT;
    this.setState({
      publishDefaultPageListColumns: [
        {
          title: '组织名称',
          dataIndex: 'unitName',
          key: 'unitName',
          align: 'left',
          width: '20%',
        },
        {
          title: '缺省素材',
          key: 'name',
          align: 'left',
          width: '20%',
          render: (record: PublishDefaultPageListDataConfig): JSX.Element => (
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
          width: '15%',
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
          width: '6%',
          render: (record: PublishDefaultPageListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>
              {permissionsData[EDIT] && (
                <Tooltip title="编辑">
                  <button
                    type="button"
                    className={style.opertionBtn}
                    onClick={(): void => this.editModal(record)}
                  >
                    <img src={userlistEditInfo} alt="" />
                  </button>
                </Tooltip>
              )}
              {permissionsData[DELETE] && (
                <Tooltip title="删除">
                  <button
                    type="button"
                    style={{ marginRight: 0 }}
                    className={style.opertionBtn}
                    onClick={(): void => this.deleteModal(record)}
                  >
                    <img src={userlistDelIfo} alt="" />
                  </button>
                </Tooltip>
              )}
            </div>
          ),
        },
      ],
    });
  };

  // 打开新增弹框
  public addModal = (): void => {
    const {
      getLookupsValue,
      setPublishDefaultModalVisible,
      getOrganization,
    } = this.defaultModalViewModel;
    getLookupsValue(LookupsCodeTypes.DEVICE_TYPE_CODE);
    getLookupsValue(LookupsCodeTypes.DEVICE_RESOLUTION_TYPE);
    setPublishDefaultModalVisible(ModalStatus.Creat, this.rootContainereViewModel);
    getOrganization();
  };
  public render(): JSX.Element {
    const {
      publishDefaultPageListDataSource,
      queryParams,
      pageChange,
      selectDeviceList,
      publishDefaultPageListData,
      sizeChange,
      deviceTypeData,
      imageSrc,
      videoSrc,
      permissionsData,
    } = this.viewModel;
    const { publishDefaultPageListColumns } = this.state;
    const { NEW } = DEFAULT;
    return (
      <div className={style.mainContainer}>
        <div className={style.defaultListrootContainer}>
          <Row className={style.searchArea}>
            <Col style={{ minWidth: '106px' }}>
              <Select
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
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
            {permissionsData[NEW] && (
              <Button type="primary" onClick={(): void => this.addModal()}>
                <img src={AddIcon} alt="" />
                <span>新增缺省</span>
              </Button>
            )}
          </div>
          <Table<PublishDefaultPageListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: publishDefaultPageListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={publishDefaultPageListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={publishDefaultPageListColumns}
            dataSource={publishDefaultPageListDataSource}
          />
          <UploadHistoryRecordModal />
          <CreatPublishDafaultPageModal />
          <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
          <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
        </div>
      </div>
    );
  }
}
