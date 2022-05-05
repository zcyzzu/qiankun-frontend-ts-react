/*
 * @Author: wuhao
 * @Date: 2021-12-03 09:33:13
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-21 14:37:37
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Button, Select, Upload, FormInstance } from 'antd';
import DI from '../../../../inversify.config';
import {
  DEFAULT_PAGE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  CONFIG_IDENTIFIER,
} from '../../../../constants/identifiers';
import ConfigProvider from '../../../../common/config/configProvider';
import CreatPublishDafaultPageModalViewModel from './viewModel';
import style from './style.less';
import closeIcon from '../../../../assets/images/close_icon_normal.svg';
import uploadIcon from '../../../../assets/images/upload.svg';
import uploadRecord from '../../../../assets/images/upload_record.svg';
import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import UploadHistoryRecordModalViewModel from '../../advertisement/uploadHistoryRecordModal/viewModel';
import utils from '../../../../utils/index';
import PublishDefaultPageListViewModel from '../viewModel';
import RootContainereViewModel from '../../../rootContainer/viewModel';
import { ModalStatus, UploadType, DeviceType } from '../../../../common/config/commonConfig';

@observer
export default class CreatPublishDafaultPageModal extends React.Component {
  private defaultModalViewModel = DI.DIContainer.get<CreatPublishDafaultPageModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_MODAL_VIEW_MODEL,
  );

  private uploadHistoryRecordModalViewModel = DI.DIContainer.get<UploadHistoryRecordModalViewModel>(
    DEFAULT_PAGE_IDENTIFIER.UPLOAD_HISTORY_RECORD_MODAL_VIEW_MODEL,
  );

  private publishDefaultPageListViewModel = DI.DIContainer.get<PublishDefaultPageListViewModel>(
    DEFAULT_PAGE_IDENTIFIER.PUBLISH_DEFAULT_PAGE_LIST_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private configProvider = DI.DIContainer.get<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER);

  private formRef = React.createRef<MaterialPreviewModal>();
  private adRef = React.createRef<FormInstance>();
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

  // 历史上传记录按钮
  private historyUpload = async (): Promise<void> => {
    const {
      getUploadRecordListData,
      setUploadHistoryRecordModalVisible,
    } = this.uploadHistoryRecordModalViewModel;
    await getUploadRecordListData();
    setUploadHistoryRecordModalVisible('publishDefault');
  };

  public render(): JSX.Element {
    const {
      organizationList,
      resolutionList,
      deviceTypeList,
      modalType,
      //上传素材
      fileList,
      imgUrl,
      uploadTime,
      deviceType,
      resolutionType,
      publishDefaultModalVisible,
      uploadFormProps,
      uploadType,
      organizationType,
      uploadChange,
      initBackgroundItem,
      beforeUpload,
      formOnFinish,
      setPublishDefaultModalVisible,
      setUploadType,
      // setUploadTime,
      setImagePreview,
      setDeviceType,
      setResolution,
      setOrganization,
      //   imgUrl,
      materialData,
      isChange,
    } = this.defaultModalViewModel;
    const { userInfo } = this.rootContainereViewModel;
    this.adRef.current?.setFieldsValue({ type: uploadType || undefined });
    if (JSON.stringify(materialData) !== '{}') {
      const data =
        materialData.type === UploadType.JPG || materialData.type === UploadType.PNG
          ? 'image'
          : 'video';
      this.adRef.current?.setFieldsValue({ type: data });
      // 播放时长不用回填
      // if (data === UploadType.IMAGE) {
      //   this.adRef.current?.setFieldsValue({ time: materialData.duration });
      // }
    }
    if (uploadTime === undefined) {
      this.adRef.current?.setFieldsValue({ time: uploadTime });
    }

    return (
      <Modal
        visible={publishDefaultModalVisible}
        width={550}
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        onCancel={(): void => setPublishDefaultModalVisible()}
      >
        <div className={style.exportModalContent}>
          <div className={style.modalHeader}>
            {modalType === ModalStatus.Creat ? '新增缺省' : '编辑缺省'}
            <Button type="text" onClick={(): void => setPublishDefaultModalVisible()}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <Form
            ref={this.adRef}
            onFinish={(values): void => formOnFinish(values, this.publishDefaultPageListViewModel)}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 22 }}
          >
            <Form.Item
              label="组织类型"
              name="organizationType"
              rules={[{ required: true }]}
              initialValue={organizationType}
            >
              <Select placeholder="请选择组织类型" onChange={setOrganization}>
                {organizationList.map((item) => {
                  return <Select.Option value={item.value}>{item.title}</Select.Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="设备类型"
              name="deviceType"
              rules={[{ required: true }]}
              initialValue={deviceType || undefined}
            >
              <Select placeholder="请选择设备类型" onChange={setDeviceType}>
                {deviceTypeList.map((item) => {
                  if (item.value === DeviceType.Raspberry) {
                    return null;
                  }
                  return <Select.Option value={item.value}>{item.meaning}</Select.Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="分辨率值"
              name="resolution"
              rules={[{ required: true }]}
              initialValue={resolutionType || undefined}
            >
              <Select placeholder="请选择分辨率值" onChange={setResolution}>
                {resolutionList.map((item) => {
                  return <Select.Option value={item.value}>{item.meaning}</Select.Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="上传类型"
              name="type"
              rules={[{ required: true }]}
              initialValue={uploadType || undefined}
            >
              <Select placeholder="请选择上传类型" onChange={setUploadType}>
                <Select.Option value={UploadType.IMAGE}>图片</Select.Option>
                <Select.Option value={UploadType.VIDEO}>视频</Select.Option>
              </Select>
            </Form.Item>
            {/* {uploadType === UploadType.IMAGE && (
              <Form.Item
                label="播放时长"
                name="time"
                rules={[
                  { required: true },
                  {
                    pattern: new RegExp('^[0-9]{1,}$', 'g'),
                    message: '请输入整数',
                  },
                ]}
                initialValue={uploadTime}
              >
                <InputNumber
                  placeholder="可输入5-20秒"
                  min={5}
                  max={20}
                  style={{ width: '100%' }}
                  addonAfter="秒"
                  onChange={setUploadTime}
                />
              </Form.Item>
            )} */}
            <div className={style.uploadTitle}>
              <div>1、支持图片、视频格式上传，包括不限于：MP4、PNG、JPG等。</div>
              <div>2、视频格式大小在20M内，图片格式大小在2M内。</div>
              <div>3、可上传5-20秒内的素材。</div>
              <div>4、为了更好的播放效果，请选择分辨率与设备分辨率相同的素材。</div>
            </div>
            <Upload.Dragger
              disabled={
                uploadType === ''
                // (uploadType === UploadType.IMAGE && uploadTime === undefined)
              }
              {...uploadFormProps}
              accept={uploadType === UploadType.IMAGE ? '.jpg, .png' : '.mp4'}
              beforeUpload={(file, fileType): boolean | string => beforeUpload(file, fileType)}
              fileList={fileList}
              showUploadList={{ showRemoveIcon: true }}
              onChange={(e): void => uploadChange(e)}
              onPreview={(file): void => setImagePreview(file, this.formRef)}
              onRemove={(): boolean => {
                initBackgroundItem();
                return true;
              }}
              previewFile={isChange ? this.handlePreviewFile : undefined}
              action={(file): string => {
                return `${this.configProvider.apiPublicUrl}/hfle/v1/${
                  userInfo.tenantId
                }/files/secret-multipart?bucketName=${file.name.split('.').reverse()[0]}&fileName=${
                  file.name
                }`;
              }}
              className={style.uploadContainer}
              style={{ display: fileList?.length ? 'none' : 'block' }}
              maxCount={1}
            >
              <img src={uploadIcon} alt="" />
            </Upload.Dragger>
            <div className={style.record} onClick={(): Promise<void> => this.historyUpload()}>
              <img src={uploadRecord} alt="" />
              历史上传记录
            </div>
            <MaterialPreviewModal url={imgUrl} ref={this.formRef} type={uploadType} />
            <div className={style.bottomButton}>
              <Button type="primary" ghost onClick={(): void => setPublishDefaultModalVisible()}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {modalType === ModalStatus.Creat ? '创建' : '保存'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}
