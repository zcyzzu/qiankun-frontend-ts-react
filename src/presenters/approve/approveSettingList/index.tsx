/*
 * @Author: liyou
 * @Date: 2021-11-30 14:31:06
 * @LastEditors: zhangchenyang
 * @LastEditTime: 2022-04-20 17:03:19
 */
import React from 'react';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { ColumnProps } from 'antd/lib/table';
import { Table, Select, Button, Row, Tooltip, Modal, Col, TreeSelect } from 'antd';
import style from './style.less';

import { APPROVE_IDENTIFIER, ROOT_CONTAINER_IDENTIFIER } from '../../../constants/identifiers';
import DI from '../../../inversify.config';
import ApproveSettingViewModel, { ApproveSettingListDataConfig, ApproveType } from './viewModel';
import ApproveSettingModal from './approveSettingModal';
import { ModalStatus } from '../../../common/config/commonConfig';
import ApproveSettingModalViewModel from './approveSettingModal/viewModel';
import ApproveSettingCheckModal from './approveSettingCheckModal';
import ApproveSettingCheckModalViewModel from './approveSettingCheckModal/viewModel';
import ApproveSettingAdd from '../../../assets/images/project_icon_add.svg';
import { OrganizationListEntity } from '../../../domain/entities/organizationEntities';
import { StoresItem } from '../../../domain/entities/approveEnities';
import RootContainereViewModel from '../../rootContainer/viewModel';

import userlistEditInfo from '../../../assets/images/edit_info_icon.svg';
import userlistDelIfo from '../../../assets/images/del_info_icon.svg';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';
// import selectArrowIcon from '../../../assets/images/select_arrow.svg';

interface ApproveSettingProps {}
interface ApproveSettingState {
  // 项目门店表格列
  ApproveSettingColumns: ColumnProps<ApproveSettingListDataConfig>[];
}
const { SETTING } = PERMISSIONS_CODES;

@observer
export default class ApproveSetting extends React.Component<
  ApproveSettingProps,
  ApproveSettingState
> {
  private viewModel = DI.DIContainer.get<ApproveSettingViewModel>(
    APPROVE_IDENTIFIER.APPROVE_SETTING_VIEW_MODEL,
  );
  private approveSettingModalViewModel = DI.DIContainer.get<ApproveSettingModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_SETTING_MODAL_VIEW_MODEL,
  );
  private approveSettingCheckModalViewModel = DI.DIContainer.get<ApproveSettingCheckModalViewModel>(
    APPROVE_IDENTIFIER.APPROVE_SETTING_CHECK_MODAL_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  constructor(props: ApproveSettingProps) {
    super(props);
    this.state = {
      ApproveSettingColumns: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { getApproveSettingList, getApprove, getStoresList, getOrganization } = this.viewModel;
    await this.getPermissonData();
    this.getStoreData();
    getApproveSettingList();
    getApprove();
    getStoresList();
    getOrganization();
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { ADD, EDIT, DELETE, SEE } = SETTING;
    try {
      const permissionsData = await getPermissionsData([ADD, EDIT, DELETE, SEE]);
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
  private deleteItem = async (record: ApproveSettingListDataConfig): Promise<void> => {
    const { deleteItem, isExist } = this.viewModel;
    const status = await isExist(record);
    if (status === 200) {
      Modal.confirm({
        title: '删除',
        maskClosable: true,
        content:
          '删除将无法恢复，如果该组织目前还存在将给该组织默认配置审批方式为或签，审批人为管理员，确定删除?',
        icon: undefined,
        onOk() {
          deleteItem(record);
        },
      });
    } else if (status === 204) {
      deleteItem(record);
    }
  };

  // 门店名称提示
  private storesToolTip = (value: StoresItem[]): string => {
    let tooltip: any;
    // eslint-disable-next-line prefer-const
    tooltip = [];
    if (value) {
      value.forEach((item) => tooltip.push(item.name));
      return tooltip.join('/');
    }
    return '';
  };
  private approveData = (value: string): string => {
    const { approveType } = this.viewModel;
    const data = approveType.find((item) => item.value === value);
    return data?.meaning || '';
  };

  private approveName = (record: ApproveSettingListDataConfig): string => {
    const tooltip: any = [];
    if (record.approveType === ApproveType.Turn) {
      const compare = record.instances?.sort((arr1, arr2) => {
        if (arr1 && arr1.sort && arr2 && arr2 && arr2.sort) {
          return arr1.sort - arr2.sort;
        }
        return 0;
      });
      compare?.map((item) => (item.approverName ? tooltip.push(item.approverName) : ''));
      return tooltip.join('-');
    }
    record.instances?.map((item) => (item.approverName ? tooltip.push(item.approverName) : ''));
    return tooltip.join('/');
  };
  // 构造列表结构
  private getStoreData = (): void => {
    const { setApproveSettingModalVisible } = this.approveSettingModalViewModel;
    const { setApproveSettingCheckModalVisible } = this.approveSettingCheckModalViewModel;
    const { permissionsData } = this.viewModel;
    const { DELETE, SEE, EDIT } = SETTING;
    this.setState({
      ApproveSettingColumns: [
        {
          title: '组织名称',
          key: 'unitName',
          align: 'left',
          width: '15%',
          render: (record: ApproveSettingListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.unitName}>
              <Button
                type="link"
                className={style.columnContentShow}
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                onClick={() => {
                  return permissionsData[SEE]
                    ? setApproveSettingCheckModalVisible(true, record)
                    : null;
                }}
              >
                {record.unitName}
              </Button>
            </Tooltip>
          ),
        },
        {
          title: '项目/门店',
          dataIndex: 'stores',
          key: 'type',
          align: 'left',
          width: '25%',
          render: (value: StoresItem[]): JSX.Element => (
            <Tooltip placement="topLeft" title={this.storesToolTip(value)}>
              <div className={style.publish_device}>
                {value && value.length > 0 ? (
                  value.map((item, index) => {
                    return item.name ? (
                      <div className={style.storesType} key={index}>
                        {item.name}
                      </div>
                    ) : (
                      '--'
                    );
                  })
                ) : (
                  <span>--</span>
                )}
              </div>
            </Tooltip>
          ),
        },
        {
          title: '审批方式',
          dataIndex: 'approveType',
          key: 'approveType',
          align: 'left',
          width: '15%',
          render: (value: string): JSX.Element => <div>{this.approveData(value)}</div>,
        },
        {
          title: '审批人',
          key: 'instances',
          align: 'left',
          width: '20%',
          ellipsis: true,
          render: (record: ApproveSettingListDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={this.approveName(record)}>
              {this.approveName(record)}
            </Tooltip>
          ),
        },
        {
          title: '最新修改时间',
          dataIndex: 'lastUpdateDate',
          key: 'lastUpdateDate',
          align: 'left',
          ellipsis: true,
          width: '15%',
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          fixed: 'right',
          width: '6%',
          render: (record: ApproveSettingListDataConfig): JSX.Element => (
            <div className={style.operatorContainer}>
              {permissionsData[EDIT] && (
                <Tooltip title="编辑">
                  <button
                    type="button"
                    className={style.opertionBtn}
                    onClick={(): Promise<void> => {
                      return setApproveSettingModalVisible(
                        true,
                        ModalStatus.Edit,
                        record,
                        this.rootContainereViewModel,
                      );
                    }}
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
                    onClick={(): Promise<void> => this.deleteItem(record)}
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

  // TODO
  public getCurrentSelected = (e: OrganizationListEntity): void => {
    console.log(e);
  };

  public render(): JSX.Element {
    const {
      ApproveSettingListDataSource,
      queryParams,
      pageChange,
      sizeChange,
      selectApprove,
      approveType,
      selectStores,
      storesListData,
      approveSettingListData,
      organizationData,
      selectOrganization,
    } = this.viewModel;
    const { ApproveSettingColumns } = this.state;
    const { setApproveSettingModalVisible } = this.approveSettingModalViewModel;
    const { permissionsData } = this.viewModel;
    const { ADD } = SETTING;
    return (
      <div className={style.mainContainer}>
        <div className={style.settingrootContainer}>
          <Row className={style.searchArea}>
            <Col style={{ marginRight: '16px' }}>
              <Select
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
                bordered={false}
                defaultValue="all"
                onChange={(e: string): void => selectApprove(e)}
              >
                <Select.Option value="all">全部方式</Select.Option>
                {approveType &&
                  approveType.map((item, index) => (
                    <Select.Option value={item.value || ''} key={index}>
                      {item.meaning}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col style={{ minWidth: '106px', marginRight: '16px' }}>
              <Select
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
                bordered={false}
                showSearch={false}
                defaultValue="all"
                onChange={(e: string): void => selectStores(e)}
              >
                <Select.Option value="all">全部项目门店</Select.Option>
                {storesListData &&
                  storesListData.map((item) => (
                    <Select.Option value={item.id || ''} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col>
              <TreeSelect
                // suffixIcon={<img src={selectArrowIcon} alt="" />}
                bordered={false}
                dropdownMatchSelectWidth={200}
                treeData={organizationData}
                defaultValue="全部组织"
                treeDefaultExpandAll
                onChange={(e: string): void => selectOrganization(e)}
              />
            </Col>
          </Row>
          <div className={style.buttonsContainer}>
            {permissionsData[ADD] && (
              <Button
                type="primary"
                onClick={(): Promise<void> => (
                  setApproveSettingModalVisible(true, ModalStatus.Creat)
                )}
              >
                <img src={ApproveSettingAdd} alt="" />
                <span>新增组织审批规则</span>
              </Button>
            )}
          </div>

          <Table<ApproveSettingListDataConfig>
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: false,
              total: approveSettingListData.totalElements || 0,
              pageSize: queryParams.size,
              current: queryParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: (page: number, pageSize?: number): void => pageChange(page, pageSize),
              onShowSizeChange: (current: number, size: number): void => sizeChange(current, size),
            }}
            scroll={ApproveSettingListDataSource.length === 0 ? { x: 0 } : { x: 1500 }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={ApproveSettingColumns}
            dataSource={ApproveSettingListDataSource}
          />
          <ApproveSettingModal />
          <ApproveSettingCheckModal />
        </div>
      </div>
    );
  }
}
