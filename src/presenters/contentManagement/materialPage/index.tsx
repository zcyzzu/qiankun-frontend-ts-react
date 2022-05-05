/*
 * @Author: tongyuqiang
 * @Date: 2022-03-29 15:56:23
 * @LastEditors: liyou
 * @LastEditTime: 2022-04-22 12:16:34
 */
import React from 'react';
import { runInAction } from 'mobx';
import { Select, Input, Button, Form, Row, Col, Modal, Pagination, Upload, Tooltip } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import Masonry from 'masonry-layout';
import style from './style.less';
import utils from '../../../utils/index';

import DI from '../../../inversify.config';
import {
  CONTENT_MANAGEMENT_IDENTIFIER,
  CONFIG_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
} from '../../../constants/identifiers';
import RootContainereViewModel from '../../rootContainer/viewModel';

import ConfigProvider from '../../../common/config/configProvider';
import { ContentMangementType } from '../../../common/components/materialCard/materialType';
import MaterialCard from '../../../common/components/materialCard/index';
import MaterialPageViewModel, { MaterialItemEntityParam } from './ViewModel';
import MaterialPreviewModal from './materialPreviewModal/index';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';

import defaultIcon from '../../../assets/images/default_icon.svg';
import uploadIcon from '../../../assets/images/upload_icon.svg';
import checkboxIcon from '../../../assets/images/checkbox_icon.svg';
import checkboxChecked from '../../../assets/images/checkbox_checked.svg';
import checkboxCheckedIcon from '../../../assets/images/checkbox_checked_icon.svg';
import noContentIcon from '../../../assets/images/nocontent_icon.svg';

const { MATERIAL } = PERMISSIONS_CODES;
@observer
export default class MaterialPage extends React.Component {
  private viewModel = DI.DIContainer.get<MaterialPageViewModel>(
    CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_PAGE_VIEW_MODEL,
  );

  private rootContainereViewModel = DI.DIContainer.get<RootContainereViewModel>(
    ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_VIEW_MODEL,
  );

  private materialPreviewModalRef = React.createRef<MaterialPreviewModal>();
  private configProvider = DI.DIContainer.get<ConfigProvider>(CONFIG_IDENTIFIER.CONFIG_PROVIDER);
  private formRef = React.createRef<FormInstance>();

  async componentDidMount(): Promise<void> {
    const { getLookupsValue, getMaterialList } = this.viewModel;
    await this.getPermissonData();
    getLookupsValue();
    getMaterialList();
  }

  componentWillUnmount(): void {
    const { initQueryParams } = this.viewModel;
    initQueryParams();
  }

  // 瀑布流
  private waterFall = debounce((): void => {
    const grid = document.querySelector('.content-management-material-List');
    // eslint-disable-next-line no-new
    new Masonry(grid!, {
      itemSelector: '.grid-item',
      columnWidth: 306,
      horizontalOrder: true,
      gutter: 16,
    });
  }, 500);

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { MADELETE, MARENAME, DOWNLOAD, LOOK, UPLOAD } = MATERIAL;
    try {
      const permissionsData = await getPermissionsData([
        MADELETE,
        MARENAME,
        DOWNLOAD,
        LOOK,
        UPLOAD,
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

  // 重置搜索
  private resetForm = (): void => {
    this.formRef.current?.resetFields();
  };
  public onDelete = (): void => {
    const { currentSelectedData, deleteAll } = this.viewModel;
    const ids = currentSelectedData.map((item) => item.id);
    Modal.confirm({
      title: '提示',
      maskClosable: true,
      content: '删除该素材将无法重新找回，请谨慎操作！',
      icon: undefined,
      onOk() {
        deleteAll(ids);
      },
    });
  };

  public clickItem = async (item: MaterialItemEntityParam): Promise<void> => {
    const { getPreviewModalInfo } = this.viewModel;
    try {
      await getPreviewModalInfo(item);
      this.materialPreviewModalRef.current?.setIsModalVisible(item);
    } catch (error) {
      utils.globalMessge({
        content: `查看素材失败，${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  private textTooltip = (): JSX.Element => {
    return (
      <div>
        <p>提示：1、支持图片、视频格式上传，包括不限于：MP4、GIF、PNG、JPG等。</p>
        <p>2、视频格式大小在20M内，图片格式大小在2M内。</p>
        <p>3、可上传5-20秒内的视频素材。</p>
        <p>4、依据国家相关法律法规，禁止上传包含色情、违法、侵权等性质内容。</p>
      </div>
    );
  };

  public render(): JSX.Element {
    const {
      onFinish,
      materialList,
      isShowAllCheckbox,
      uploadFormProps,
      getTitle,
      changeDataSource,
      currentSelectedData,
      isAllChecked,
      onAllChecked,
      onExit,
      materialTypeCode,
      selectType,
      deleteItem,
      downMaterial,
      uploadChange,
      beforeUpload,
      sizeChange,
      pageChange,
      renderType,
      materialListData,
      queryParams,
      flag,
      permissionsData,
      previewImageSrc,
      previewImageType,
    } = this.viewModel;
    const { MADELETE, MARENAME, DOWNLOAD, LOOK, UPLOAD } = MATERIAL;
    const { userInfo } = this.rootContainereViewModel;
    return (
      <div className={style.mainContainer}>
        <div className={style.materiaPageContainer}>
          {isShowAllCheckbox ? (
            <Row className={`${style.searchArea} ${style.padding}`}>
              <img src={checkboxChecked} alt="" />
              <span className={style.currentSelected}>
                当前页面已选{currentSelectedData.length}个
              </span>
              <span className={style.vertical} />
              <span onClick={onAllChecked} className={style.allCheckedIcon}>
                {isAllChecked ? (
                  <img src={checkboxCheckedIcon} alt="" />
                ) : (
                  <img src={checkboxIcon} alt="" />
                )}
              </span>
              <span className={style.allChecked}>全选</span>
              <div className={style.buttons}>
                <Button type="primary" ghost onClick={onExit}>
                  退出
                </Button>
                <Button type="primary" onClick={(): void => this.onDelete()}>
                  删除
                </Button>
              </div>
            </Row>
          ) : (
            <Row className={style.searchArea}>
              <Col style={{ marginRight: '16px' }}>
                <Select
                  bordered={false}
                  defaultValue="all"
                  onChange={(e: string): void => selectType(e)}
                >
                  <Select.Option value="all">全部类型</Select.Option>
                  {materialTypeCode &&
                    materialTypeCode.map((item, index) => (
                      <Select.Option value={item.value || ''} key={index}>
                        {item.meaning}
                      </Select.Option>
                    ))}
                </Select>
              </Col>
              <Col>
                <Form onFinish={onFinish} className={style.searchArea} ref={this.formRef}>
                  <Row>
                    <Col style={{ minWidth: '240px', marginRight: '24px' }}>
                      <Form.Item name="name">
                        <Input placeholder="请输入素材名称" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <div className={style.buttons}>
                        <Button type="primary" ghost onClick={this.resetForm}>
                          重置
                        </Button>
                        <Button type="primary" htmlType="submit">
                          查询
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          )}
          <div className={style.buttonsContainer}>
            {permissionsData[UPLOAD] && (
              <Upload
                {...uploadFormProps}
                accept=".jpg, .png, .mp4, .gif"
                showUploadList={false}
                action={(file): string => {
                  return `${this.configProvider.apiPublicUrl}/hfle/v1/${
                    userInfo.tenantId
                  }/files/secret-multipart?bucketName=${
                    file.name.split('.').reverse()[0]
                  }&fileName=${file.name}`;
                }}
                onChange={(e): void => {
                  uploadChange(e, this.rootContainereViewModel);
                }}
                beforeUpload={(file): Promise<boolean | string> => {
                  // setLoading(true);
                  return beforeUpload(file, this.rootContainereViewModel);
                }}
              >
                <Tooltip
                  title={this.textTooltip()}
                  placement="bottom"
                  overlayStyle={{ width: '333px' }}
                >
                  <Button type="primary">
                    <img src={uploadIcon} alt="" />
                    <span>上传素材</span>
                  </Button>
                </Tooltip>
              </Upload>
            )}
          </div>
          {materialList.length > 0 ? (
            <>
              <div className={`content-management-material-List ${style.materialContent}`}>
                {materialList &&
                  materialList.map((item, index) => {
                    return (
                      <>
                        <MaterialCard
                          key={`material_card_${index}`}
                          className={`grid-item ${style.materialCard}`}
                          width="306"
                          sourceSrc={item.url}
                          title={item.name}
                          type={ContentMangementType.MATERIAL}
                          materialtype={renderType(item.sourceType || '')}
                          isChecked={item.isChecked}
                          isShowAllCheckbox={isShowAllCheckbox}
                          onCheckbox={(): void => {
                            changeDataSource(index);
                          }}
                          onDelete={(): void => {
                            deleteItem(item.id);
                          }}
                          onDown={(): void => downMaterial(item)}
                          onRenameConfirm={(title: string): void => {
                            getTitle(title, item);
                          }}
                          onClick={(): Promise<void> => this.clickItem(item)}
                          detail={permissionsData[LOOK]}
                          deleteItem={permissionsData[MADELETE]}
                          download={permissionsData[DOWNLOAD]}
                          rename={permissionsData[MARENAME]}
                          imageComplete={(): void => {
                            this.waterFall();
                          }}
                        />
                      </>
                    );
                  })}
              </div>
              <Pagination
                className={style.pageStyle}
                showQuickJumper={false}
                current={queryParams.page + 1}
                total={materialListData.totalElements || 0}
                onShowSizeChange={sizeChange}
                onChange={pageChange}
              />
            </>
          ) : (
            <div className={style.defaultContent}>
              <div className={style.content}>
                <img src={flag ? noContentIcon : defaultIcon} alt="" />
                <span>{flag ? '没找到您想要的搜索结果' : '暂无素材内容'}</span>
              </div>
            </div>
          )}
        </div>
        <MaterialPreviewModal
          url={previewImageSrc}
          type={previewImageType}
          ref={this.materialPreviewModalRef}
        />
      </div>
    );
  }
}
