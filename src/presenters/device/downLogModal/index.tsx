/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-07 14:35:02
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Modal, Button, Table, Tooltip } from 'antd';
import style from './style.less';

import DI from '../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import DownLogModalViewModel, { DownLogListDataConfig } from './viewModel';
import FormItemTitle from '../../../common/components/formItemTitle';
import download from '../../../assets/images/download.svg';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import uploadLogIcon from '../../../assets/images/upload_log.svg';
import refreshIcon from '../../../assets/images/refresh.svg';

interface DownLogModalProps {}
interface DownLogModalState {
  downLogListColums: ColumnProps<DownLogListDataConfig>[];
}

@observer
export default class DownLogModal extends React.Component<DownLogModalProps, DownLogModalState> {
  private downLogModalViewModel = DI.DIContainer.get<DownLogModalViewModel>(
    DEVICE_IDENTIFIER.DOWN_LOG_MODAL_VIEW_MODEL,
  );

  constructor(props: DownLogModalProps) {
    super(props);
    this.state = {
      downLogListColums: [],
    };
  }

  componentDidMount(): void {
    this.setState({
      downLogListColums: [
        {
          title: '上报时间',
          dataIndex: 'creationDate',
          key: 'creationDate',
          align: 'left',
          width: '70%',
          ellipsis: true,
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          width: '30%',
          ellipsis: true,
          render: (record: DownLogListDataConfig): JSX.Element => (
            <Tooltip title="下载">
              <button
                type="button"
                className={style.opertionBtn}
                onClick={(): void => {
                  this.downLogModalViewModel.downLog(record);
                }}
              >
                <img src={download} alt="" />
              </button>
            </Tooltip>
          ),
        },
      ],
    });
  }

  public render(): JSX.Element {
    const {
      downLogModalVisible,
      setDownLogModalVisible,
      logListDataSource,
      uploadLog,
      logListParams,
      pageChange,
      logListData,
      onRefresh,
    } = this.downLogModalViewModel;
    const { downLogListColums } = this.state;
    return (
      <Modal
        visible={downLogModalVisible}
        width={640}
        closable={false}
        footer={null}
        wrapClassName={style.downLogModalContainer}
        destroyOnClose
        onCancel={(): void => setDownLogModalVisible()}
      >
        <div className={style.downLogModalContent}>
          <div className={style.modalHeader}>
            日志下载
            <Button type="text" onClick={(): void => setDownLogModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <FormItemTitle title="上传日志" className={style.paddingBottomSpace} />
          <div className={style.uploadLog}>
            <div
              onClick={(): void => {
                uploadLog();
              }}
            >
              <img src={uploadLogIcon} alt="" />
            </div>
            <span>上传设备日志</span>
          </div>
          <FormItemTitle title="上传记录" className={style.paddingBottomSpace} />
          <Button
            type="primary"
            ghost
            onClick={onRefresh}
          >
            <img src={refreshIcon} className={style.refresh} alt="" />
            刷新
          </Button>
          <Table
            pagination={{
              size: 'small',
              showSizeChanger: false,
              showQuickJumper: false,
              total: logListData.totalElements || 0,
              pageSize: logListParams.size,
              current: logListParams.page + 1,
              showTotal: (total): string => `共 ${total} 条`,
              onChange: pageChange,
            }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={downLogListColums}
            dataSource={logListDataSource}
          />
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => setDownLogModalVisible()}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
