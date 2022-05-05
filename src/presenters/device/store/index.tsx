import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { isEmpty, throttle } from 'lodash';
import { ColumnProps } from 'antd/lib/table';
import { FormInstance } from 'antd/lib/form';
import { Table, Select, Button, Form, Row, Input, Tooltip, Modal, Col } from 'antd';
import OrganizationTree from '../../../common/components/organizationTree';
import style from './style.less';
import { DEVICE_IDENTIFIER, ORGANIZATION_TREE_IDENTIFIER } from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import StoreListViewModel, { StoreListDataConfig, StoreType } from './viewModel';
import StoreListAdd from '../../../assets/images/project_icon_add.svg';
import CreateProjectModalViewModel from './createStoreModal/viewModal';
import StoreDetailsModalViewModel from './storeDetailsModal/viewModel';
import { ModalStatus } from '../../../common/config/commonConfig';
import CreateProjectModal from './createStoreModal/index';
import StoreDetailsModal from './storeDetailsModal/index';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import userlistEditInfo from '../../../assets/images/edit_info_icon.svg';
import userlistDelIfo from '../../../assets/images/del_info_icon.svg';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';
import OrganizationTreeViewModel from '../../../common/components/organizationTree/viewModel';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';

interface StoreListProps {}
interface StoreListState {
  // 项目门店表格列
  StoreListColumns: ColumnProps<StoreListDataConfig>[];
}

const { STORE_PROJECT } = PERMISSIONS_CODES;

@observer
export default class StoreList extends React.Component<StoreListProps, StoreListState> {
  private viewModel = DI.DIContainer.get<StoreListViewModel>(
    DEVICE_IDENTIFIER.PROJECT_STORE_VIEW_MODEL,
  );
  private createProjectModalViewModel = DI.DIContainer.get<CreateProjectModalViewModel>(
    DEVICE_IDENTIFIER.CREATE_PROJECT_MODAL_VIEW_MODEL,
  );
  private organizationTreeViewModel = DI.DIContainer.get<OrganizationTreeViewModel>(
    ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_VIEW_MODEL,
  );
  private storeDetailsModalViewModel = DI.DIContainer.get<StoreDetailsModalViewModel>(
    DEVICE_IDENTIFIER.PROJECT_STORE__DETAILS_MODAL_VIEW_MODEL,
  );

  private formRef = React.createRef<FormInstance>();
  private treeWrapperRef = React.createRef<HTMLDivElement>();
  private orgTreeDom = React.createRef<HTMLDivElement>();

  constructor(props: StoreListProps) {
    super(props);
    this.state = {
      StoreListColumns: [],
    };
  }
  private handleresize = throttle((): void => {
    if (this.orgTreeDom.current) {
      this.orgTreeDom.current.style.height = `${this.treeWrapperRef.current?.clientHeight}px`;
    }
  }, 1000);
  async componentDidMount(): Promise<void> {
    const { getStoreList, getCategory, getType, initParams } = this.viewModel;
    await this.getPermissonData();
    this.getStoreData();
    initParams();
    getStoreList();
    getCategory();
    getType();
    window.addEventListener('resize', this.handleresize.bind(this));
    // window.onresize = throttle((): void => {
    //   if (this.orgTreeDom.current) {
    //     this.orgTreeDom.current.style.height = `${this.treeWrapperRef.current?.clientHeight}px`;
    //   }
    // }, 1000);
  }

  componentWillUnmount(): void {
    // window.onresize = null;
    window.removeEventListener('resize', this.handleresize.bind(this));
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const {
      PROJECT_SEE,
      PROJECT_NEW,
      PROJECT_EDIT,
      PROJECT_DELETE,
      STORE_SEE,
      STORE_NEW,
      STORE_EDIT,
      STORE_DELETE,
      STORE_DETAILS,
    } = STORE_PROJECT;
    try {
      const permissionsData = await getPermissionsData([
        PROJECT_SEE,
        PROJECT_NEW,
        PROJECT_EDIT,
        PROJECT_DELETE,
        STORE_SEE,
        STORE_NEW,
        STORE_EDIT,
        STORE_DELETE,
        STORE_DETAILS,
      ]);
      runInAction(() => {
        setPermissionsData(permissionsData);
      });
    } catch (error) {
      runInAction(() => {
        setPermissionsData({});
      });
    }
  };

  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };

  // 删除列表单条数据
  private deleteStore = async (data: StoreListDataConfig): Promise<void> => {
    const { isRelate, deleteStore } = this.viewModel;
    // const orgViewModal = this.organizationTreeViewModel;
    await isRelate(data)
      .then(() => {
        Modal.confirm({
          title: '删除',
          maskClosable: true,
          content: '删除项目/门店将失效并无法恢复，确认删除?',
          icon: undefined,
          onOk() {
            deleteStore(data);
          },
        });
      })
      .catch(() => {
        Modal.info({
          title: '删除',
          content:
            '该项目/门店下已关联了设备无法删除，请将该项目/门店下的设备进行转移到其他项目/门店下，才能删除。',
          icon: undefined,
          okText: '确定',
        });
      });
  };

  // 打开新增/编辑弹窗
  private openModal = async (
    statusType: ModalStatus,
    storesType: string,
    itemData?: StoreListDataConfig,
  ): Promise<void> => {
    const { setStoreItemData } = this.viewModel;
    setStoreItemData(statusType, storesType, itemData, this.createProjectModalViewModel);
  };
  // 构造列表结构
  private getStoreData = (): void => {
    const { permissionsData } = this.viewModel;
    const { PROJECT_EDIT, PROJECT_DELETE, STORE_EDIT, STORE_DELETE, STORE_DETAILS } = STORE_PROJECT;
    this.setState({
      StoreListColumns: [
        {
          title: '名称',
          key: 'name',
          align: 'left',
          width: '15%',
          render: (record: StoreListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.name}>
              <Button
                type="link"
                className={style.columnContentShow}
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                onClick={() => {
                  return permissionsData[STORE_DETAILS]
                    ? this.storeDetailsModalViewModel.setStoreDetailsModalVisible(true, record)
                    : null;
                }}
              >
                {record.name}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => (value === StoreType.Project ? (
            <div className={style.projectType}>项目</div>
            ) : (
              <div className={style.storesType}>门店</div>
            )),
        },
        {
          title: '种类',
          dataIndex: 'category',
          key: 'category',
          align: 'left',
          width: '10%',
          ellipsis: true,
          render: (value: string): JSX.Element => (value ? <div>{value}</div> : <div>--</div>),
        },
        {
          title: '城市',
          dataIndex: 'city',
          key: 'city',
          align: 'left',
          width: '10%',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          align: 'left',
          width: '10%',
          render: (value: string): JSX.Element => (
            <div>
              {value ? (
                <div
                  className={style.storeStatusStyle}
                  style={{ background: 'rgba(0,203,148,0.1)', color: '#03AD8F' }}
                >
                  <b className={style.statusDot} style={{ background: '#03AD8F' }} />
                  启用
                </div>
              ) : (
                <div
                  className={style.storeStatusStyle}
                  style={{ background: 'rgba(245,34,45,0.1)', color: '#F5222D' }}
                >
                  <b className={style.statusDot} style={{ background: '#F5222D' }} />
                  禁用
                </div>
              )}
            </div>
          ),
        },
        {
          title: '地址/门牌号',
          dataIndex: 'address',
          key: 'address',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (value: string): JSX.Element => (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          ),
        },
        {
          title: '营业时间',
          key: 'runningtime',
          align: 'left',
          ellipsis: true,
          width: '15%',
          render: (record: StoreListDataConfig): JSX.Element => (
            <div>{`${record.beginBusinessHours}-${record.endBusinessHours}`}</div>
          ),
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '6%',
          render: (record: StoreListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>
              {record.type === StoreType.Project &&
                (permissionsData[PROJECT_EDIT] ? (
                  <Tooltip title="编辑">
                    <button
                      type="button"
                      className={style.opertionBtn}
                      onClick={(): Promise<void> => (
                        this.openModal(
                          ModalStatus.Edit,
                          record.type === StoreType.Project ? StoreType.Project : StoreType.Store,
                          record,
                        )
                      )}
                    >
                      <img src={userlistEditInfo} alt="" />
                    </button>
                  </Tooltip>
                ) : null)}
              {record.type === StoreType.Store &&
                (permissionsData[STORE_EDIT] ? (
                  <Tooltip title="编辑">
                    <button
                      type="button"
                      className={style.opertionBtn}
                      onClick={(): Promise<void> => (
                        this.openModal(
                          ModalStatus.Edit,
                          record.type === StoreType.Project ? StoreType.Project : StoreType.Store,
                          record,
                        )
                      )}
                    >
                      <img src={userlistEditInfo} alt="" />
                    </button>
                  </Tooltip>
                ) : null)}
              {record.type === StoreType.Project &&
                (permissionsData[PROJECT_DELETE] ? (
                  <Tooltip title="删除">
                    <button
                      type="button"
                      style={{ marginRight: 0 }}
                      className={style.opertionBtn}
                      onClick={(): Promise<void> => this.deleteStore(record)}
                    >
                      <img src={userlistDelIfo} alt="" />
                    </button>
                  </Tooltip>
                ) : null)}
              {record.type === StoreType.Store &&
                (permissionsData[STORE_DELETE] ? (
                  <Tooltip title="删除">
                    <button
                      type="button"
                      style={{ marginRight: 0 }}
                      className={style.opertionBtn}
                      onClick={(): Promise<void> => this.deleteStore(record)}
                    >
                      <img src={userlistDelIfo} alt="" />
                    </button>
                  </Tooltip>
                ) : null)}
            </div>
          ),
        },
      ],
    });
  };

  public getCurrentSelected = (e: OrganizationListEntity): void => {
    const { setUnitId, setStoreId } = this.viewModel;
    if (!isEmpty(e)) {
      if (e.unitId) {
        setUnitId(e.unitId);
      } else if (e.storeId) {
        setStoreId(e.storeId);
      }
    }
  };

  public render(): JSX.Element {
    const {
      storeListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      selectType,
      selectCategory,
      onFinish,
      storeListData,
      categoryData,
      typeData,
      permissionsData,
    } = this.viewModel;
    const { StoreListColumns } = this.state;
    const { PROJECT_NEW, STORE_NEW } = STORE_PROJECT;

    return (
      <div className={style.projectListrootContainer}>
        <div
          className={style.deviceNav}
          ref={this.orgTreeDom}
          style={{ height: this.treeWrapperRef.current?.clientHeight }}
        >
          <OrganizationTree
            noStore
            treeWrapper={style.treeWrapper}
            showLine={{ showLeafIcon: false }}
            getCurrentSelectedInfo={(e: OrganizationListEntity): void => {
              this.getCurrentSelected(e);
            }}
          />
        </div>
        <div className={style.tableContainer} ref={this.treeWrapperRef}>
          <Row className={style.searchArea}>
            <Col style={{ minWidth: '106px', marginRight: '16px' }}>
              <Form.Item name="type">
                <Select
                  bordered={false}
                  defaultValue="all"
                  onChange={(e: string): void => selectType(e)}
                >
                  <Select.Option value="all">全部类型</Select.Option>
                  {typeData &&
                    typeData.map((item, index) => (
                      <Select.Option value={item.value || ''} key={index}>
                        {item.meaning}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ minWidth: '106px', marginRight: '16px' }}>
              <Form.Item name="categoryCode">
                <Select
                  // suffixIcon={<img src={selectArrowIcon} alt="" />}
                  bordered={false}
                  defaultValue="all"
                  onChange={(e: string): void => selectCategory(e)}
                >
                  <Select.Option value="all">全部种类</Select.Option>
                  {categoryData &&
                    categoryData.map((item, index) => (
                      <Select.Option value={item.value || ''} key={index}>
                        {item.meaning}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form onFinish={onFinish} ref={this.formRef}>
                <Row>
                  <Col style={{ minWidth: '200px', marginRight: '16px' }}>
                    <Form.Item name="name">
                      <Input placeholder="项目/ 门店名称" />
                    </Form.Item>
                  </Col>
                  <Col style={{ minWidth: '200px', marginRight: '16px' }}>
                    <Form.Item name="city">
                      <Input placeholder="城市名称" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <div className={style.buttons}>
                      <Button onClick={this.resetForm}>重置</Button>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <div className={style.buttonsContainer}>
            {permissionsData[PROJECT_NEW] && (
              <Button
                type="primary"
                onClick={(): Promise<void> => (
                  this.openModal(ModalStatus.Creat, StoreType.Project, { status: true })
                )}
              >
                <img src={StoreListAdd} alt="" />
                <span>新增项目</span>
              </Button>
            )}
            {permissionsData[STORE_NEW] && (
              <Button
                type="primary"
                onClick={(): Promise<void> => (
                  this.openModal(ModalStatus.Creat, StoreType.Store, { status: true })
                )}
              >
                <img src={StoreListAdd} alt="" />
                <span>新增门店</span>
              </Button>
            )}
          </div>

          <Table<StoreListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: storeListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={StoreListColumns}
            dataSource={storeListDataSource}
            scroll={storeListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
          />
        </div>
        <CreateProjectModal />
        <StoreDetailsModal />
      </div>
    );
  }
}
