/*
 * @Author: wuhao
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: wuhao
 * @LastEditTime: 2022-02-28 16:45:42
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Modal, Button, Table, Tooltip } from 'antd';
import DI from '../../../inversify.config';
import { DEVICE_IDENTIFIER } from '../../../constants/identifiers';
import ScreenModalViewModel, { ScreenListData } from './viewModel';
import style from './style.less';
import FormItemTitle from '../../../common/components/formItemTitle/index';
import closeIcon from '../../../assets/images/close_icon_normal.svg';
import sreenShots from '../../../assets/images/screen_shots.svg';
import refresh from '../../../assets/images/refresh.svg';
import download from '../../../assets/images/download.svg';
import MaterialPreviewModal from '../../../common/components/materialPreviewModal/index';

interface ScreenLibraryProps {}
interface ScreenLibraryState {
  //列表表格列头
  screenListColumns: ColumnProps<ScreenListData>[];
  url: string;
}

@observer
export default class ScreenModal extends React.Component<ScreenLibraryProps, ScreenLibraryState> {
  private screenModalViewModel = DI.DIContainer.get<ScreenModalViewModel>(
    DEVICE_IDENTIFIER.ADVERTISEMENT_MACHINE_SCREEN_VIEW_MODEL,
  );
  private formRef = React.createRef<MaterialPreviewModal>();
  constructor(props: ScreenLibraryProps) {
    super(props);
    this.state = {
      screenListColumns: [],
      url: '',
    };
  }

  componentDidMount(): void {
    // const { getScreenList } = this.screenModalViewModel;
    // getScreenList();
    this.setState({
      screenListColumns: [
        {
          title: '截屏文件',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          render: (value, record): JSX.Element => (
            <button
              type="button"
              className={style.opertionBtn}
              onClick={(): Promise<void> => this.setMaterial(record.fileKey)}
            >
              {value}
            </button>
          ),
        },
        {
          title: '截屏时间',
          dataIndex: 'creationDate',
          key: 'creationDate',
          align: 'left',
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          render: (record): JSX.Element => (
            <div>
              <Tooltip title="下载">
                <button
                  type="button"
                  className={style.opertionBtn}
                  onClick={(): Promise<void> => (
                    this.downloadEntityCrad(record.fileKey, record.name)
                  )}
                >
                  <img src={download} alt="" />
                </button>
              </Tooltip>
            </div>
          ),
        },
      ],
    });
  }

  // 打开预览
  private setMaterial = async (fileKey: string): Promise<void> => {
    this.setState({
      url: '',
    });
    this.formRef.current?.setIsModalVisible();
    const { getDownLoadUrl } = this.screenModalViewModel;
    const url = await getDownLoadUrl(fileKey);
    if (url) {
      this.setState({
        url,
      });
    }
  };

  // 下载
  private downloadEntityCrad = async (fileKey: string, name: string): Promise<void> => {
    const { getDownLoadUrl } = this.screenModalViewModel;
    const url = await getDownLoadUrl(fileKey);
    const x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.responseType = 'blob';
    x.onload = (): void => {
        // 会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的
        // 生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        const urls = window.URL.createObjectURL(x.response)
        const a = document.createElement('a');
        a.href = urls
        a.download = name;
        a.click()
    }
    x.send();
  };

  // 刷新
  private refresh = (): void => {
    const { getScreenList, deviceId } = this.screenModalViewModel;
    getScreenList(deviceId, 'refresh');
  };

  public render(): JSX.Element {
    const {
      screenModalVisible,
      setScreenModalVisible,
      getScreenShot,
      pageChange,
      screenListData,
      getscreenListParams,
      screenListDataSource,
    } = this.screenModalViewModel;
    const { screenListColumns, url } = this.state;
    return (
      <Modal
        visible={screenModalVisible}
        width={750}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setScreenModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            截屏
            <Button type="text" onClick={(): void => setScreenModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div>
            <FormItemTitle title="远程截屏" className={style.paddingBottomSpace} />
            <div className={style.screen} onClick={getScreenShot}>
              <div className={style.screenContent}>
                <img src={sreenShots} alt="" />
                <div>截屏设备当前画面</div>
              </div>
            </div>
            <FormItemTitle title="截屏记录" className={style.paddingBottomSpace} />
            <Button type="primary" ghost onClick={this.refresh}>
              <img src={refresh} className={style.refresh} alt="" />
              刷新
            </Button>
            <div className={style.tableContent}>
              <Table
                pagination={{
                  size: 'small',
                  showSizeChanger: false,
                  showQuickJumper: false,
                  showTotal: (total): string => `共 ${total} 条`,
                  total: screenListData.totalElements || 0,
                  pageSize: getscreenListParams.size,
                  current: getscreenListParams.page + 1,
                  onChange: pageChange,
                }}
                className={style.table}
                rowClassName={style.tableRow}
                columns={screenListColumns}
                dataSource={screenListDataSource}
              />
            </div>
          </div>
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => setScreenModalVisible()}>
              关闭
            </Button>
            <MaterialPreviewModal url={url} ref={this.formRef} type="image" />
          </div>
        </div>
      </Modal>
    );
  }
}
