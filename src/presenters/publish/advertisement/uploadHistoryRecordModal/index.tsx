/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-03-08 10:29:47
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Modal, Button, Table, Tooltip } from 'antd';
import style from './style.less';

import DI from '../../../../inversify.config';
import {
  DEFAULT_PAGE_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  DEFAULT_IDENTIFIER,
} from '../../../../constants/identifiers';
import UploadHistoryRecordModalViewModel, { UploadRecordDataConfig } from './viewModel';
import utils from '../../../../utils/index';
import { UploadType } from '../../../../common/config/commonConfig';
import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import CreatAdvertisementModalViewModel from '../creatAdvertisementModal/viewModel';

import CreatPublishDafaultPageModalViewModel from '../../defaultPageList/creatPublishDafaultPageModal/viewModel';
import CreatDafaultPageModalViewModel from '../../../defaultPage/creatDefaultPageModal/viewModel';

import CloseIcon from '../../../../assets/images/close_icon_normal.svg';
// import SuccessIcon from '../../../../assets/images/success_icon.svg';
// import failIcon from '../../../../assets/images/fail_icon.svg';
import DeliteIcon from '../../../../assets/images/del_info_icon.svg';

interface UploadHistoryRecordProps {}
interface UploadHistoryRecordState {
  // 列表表格头
  uploadRecordListColums: ColumnProps<UploadRecordDataConfig>[];
}

@observer
export default class UploadHistoryRecordModal extends React.Component<
  UploadHistoryRecordProps,
  UploadHistoryRecordState
> {
  private viewModel = DI.DIContainer.get<UploadHistoryRecordModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.UPLOAD_HISTORY_RECORD_MODAL_VIEW_MODEL,
  );

  private creatAdvertisementModalViewModel = DI.DIContainer.get<CreatAdvertisementModalViewModel>(
    ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_CREATADVERTISEMENT_VIEW_MODEL,
  );

  private defaultModalViewModel = DI.DIContainer.get<CreatPublishDafaultPageModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_MODAL_VIEW_MODEL,
  );

  private defaultPlatformModalViewModel = DI.DIContainer.get<CreatDafaultPageModalViewModel>(
    DEFAULT_IDENTIFIER.DEFAULT_MODAL_VIEW_MODEL,
  );

  private videoRef = React.createRef<MaterialPreviewModal>();

  private imgRef = React.createRef<MaterialPreviewModal>();

  constructor(props: UploadHistoryRecordProps) {
    super(props);
    this.state = {
      uploadRecordListColums: [],
    };
  }

  componentDidMount(): void {
    this.setState({
      uploadRecordListColums: [
        {
          title: '素材名称',
          key: 'name',
          align: 'left',
          render: (record: UploadRecordDataConfig): JSX.Element => (
            <Tooltip placement="topLeft" title={record.name}>
              <span
                style={{ color: '#4096FF', cursor: 'pointer' }}
                onClick={(): Promise<void> => this.openMaterial(record)}
              >
                {record.name}
              </span>
            </Tooltip>
          ),
        },
        {
          title: '分辨率',
          dataIndex: 'resolution',
          key: 'resolution',
          align: 'left',
        },
        {
          title: '大小',
          dataIndex: 'size',
          key: 'size',
          align: 'left',
          render: (record: number): string => {
            return `${(record / 1024 / 1000).toFixed(2)}M`;
          },
        },
        {
          title: '时长',
          key: 'duration',
          align: 'left',
          render: (record: UploadRecordDataConfig): string => {
            return record.type === UploadType.JPG || record.type === UploadType.PNG
              ? '- -'
              : `${record.duration}秒`;
          },
        },
        {
          title: '创建时间',
          dataIndex: 'creationDate',
          key: 'creationDate',
          align: 'left',
        },
        {
          title: '操作',
          key: 'operator',
          align: 'left',
          // width: '30%',
          render: (record: UploadRecordDataConfig): JSX.Element => (
            <div>
              <Tooltip title="删除">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): Promise<void> => this.deleteItem(record)}
                >
                  <img src={DeliteIcon} alt="" />
                </button>
              </Tooltip>
            </div>
          ),
        },
      ],
    });
  }

  // 打开素材
  private openMaterial = async (record: UploadRecordDataConfig): Promise<void> => {
    const { getMaterialUrl } = this.viewModel;
    await getMaterialUrl(record)
      .then(() => {
        if (record.type === UploadType.JPG || record.type === UploadType.PNG) {
          this.imgRef.current?.setIsModalVisible();
        }
        if (record.type === UploadType.MP4) {
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

  // 删除列表单条数据
  private deleteItem = async (record: UploadRecordDataConfig): Promise<void> => {
    const { delMaterial, getUploadRecordListData } = this.viewModel;
    await delMaterial(record.id || 0)
      .then(() => {
        utils.globalMessge({
          content: '删除成功',
          type: 'success',
        });
        getUploadRecordListData();
      })
      .catch((err) => {
        utils.globalMessge({
          content: `删除失败！${err.message}!`,
          type: 'error',
        });
      });
  };

  // 确认事件
  public onConfirm = (): void => {
    const {
      currentMaterialData,
      closeModal,
      type,
      indexData,
      batchIndexData,
      uploadRecordListDataSource,
    } = this.viewModel;
    const { getMaterialData } = this.creatAdvertisementModalViewModel;
    const { getMaterialDataDefault } = this.defaultModalViewModel;
    const { getMaterialDataDefaultPlatform } = this.defaultPlatformModalViewModel;
    if (!uploadRecordListDataSource.length) {
      utils.globalMessge({
        content: '当前没有可选择的素材，请取消关闭弹窗',
        type: 'error',
      });
      return;
    }
    if (!Object.keys(currentMaterialData).length) {
      utils.globalMessge({
        content: '请勾选素材！',
        type: 'error',
      });
      return;
    }
    if (type === 'advert') {
      getMaterialData(currentMaterialData, indexData, batchIndexData);
    }
    if (type === 'publishDefault') {
      getMaterialDataDefault(currentMaterialData);
    }
    if (type === 'default') {
      getMaterialDataDefaultPlatform(currentMaterialData);
    }

    closeModal();
  };

  public render(): JSX.Element {
    const {
      uploadHistoryRecoedModalVisible,
      closeModal,
      uploadRecordListData,
      uploadRecordListParams,
      uploadRecordListDataSource,
      pageChange,
      imageSrc,
      videoSrc,
      radioChange,
    } = this.viewModel;

    const { uploadRecordListColums } = this.state;
    return (
      <Modal
        visible={uploadHistoryRecoedModalVisible}
        width={1039}
        closable={false}
        footer={null}
        wrapClassName={style.uploadHistoryRecordContainer}
        destroyOnClose
        onCancel={(): void => closeModal()}
      >
        <div className={style.uploadHistoryRecordContent}>
          <div className={style.modalHeader}>
            历史上传记录
            <Button type="text" onClick={(): void => closeModal()}>
              <img src={CloseIcon} alt="" />
            </Button>
          </div>
          <Table
            pagination={{
              size: 'small',
              showSizeChanger: false,
              showQuickJumper: false,
              total: uploadRecordListData.totalElements,
              showTotal: (total): string => `共 ${total} 条`,
              pageSize: uploadRecordListParams.size,
              current: uploadRecordListParams.page + 1,
              onChange: pageChange,
            }}
            className={style.table}
            rowClassName={style.tableRow}
            columns={uploadRecordListColums}
            dataSource={uploadRecordListDataSource}
            rowSelection={{
              type: 'radio',
              onChange: radioChange,
            }}
          />
          <div className={style.bottomButton}>
            <Button type="primary" ghost onClick={(): void => closeModal()}>
              取消
            </Button>
            <Button type="primary" onClick={(): void => this.onConfirm()}>
              确定
            </Button>
          </div>
        </div>
        <MaterialPreviewModal url={imageSrc} type="image" ref={this.imgRef} />
        <MaterialPreviewModal url={videoSrc} type="video" ref={this.videoRef} />
      </Modal>
    );
  }
}
