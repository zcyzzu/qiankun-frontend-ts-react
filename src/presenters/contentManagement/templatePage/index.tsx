/*
 * @Author: tongyuqiang
 * @Date: 2022-03-29 15:56:23
 * @LastEditors: tongyuqiang
 * @LastEditTime: 2022-04-26 14:51:17
 */
import React from 'react';
import { runInAction } from 'mobx';
import { Input, Button, Form, Row, Col, Divider, Pagination, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import Masonry from 'masonry-layout';
import style from './style.less';

import DI from '../../../inversify.config';
import { CONTENT_MANAGEMENT_IDENTIFIER } from '../../../constants/identifiers';
import TemplatePageViewModel from './ViewModel';
import MaterialCard from '../../../common/components/materialCard/index';
import CreateTemplateViewModel from './createTemplate/ViewModel';
import CreateTemplate from './createTemplate/index';
import PERMISSIONS_CODES from '../../../constants/permissionsCodes';

import { ContentMangementType } from '../../../common/components/materialCard/materialType';
import templateEmpty from '../../../assets/images/not_found_template.svg';
import checkboxChecked from '../../../assets/images/checkbox_checked.svg';
import checkboxIcon from '../../../assets/images/checkbox_icon.svg';
import checkboxCheckedIcon from '../../../assets/images/checkbox_checked_icon.svg';
import materialMockImage from '../../../assets/images/mock/material_mock_image.svg';
import addIcon from '../../../assets/images/project_icon_add.svg';

const { TEMPLATE } = PERMISSIONS_CODES;

@observer
export default class TemplatePage extends React.Component {
  private viewModel = DI.DIContainer.get<TemplatePageViewModel>(
    CONTENT_MANAGEMENT_IDENTIFIER.TEMPLATE_PAGE_VIEW_MODEL,
  );
  private createViewModel = DI.DIContainer.get<CreateTemplateViewModel>(
    CONTENT_MANAGEMENT_IDENTIFIER.CREATE_TEMPLATE_VIEW_MODEL,
  );
  private formRef = React.createRef<FormInstance>();

  async componentDidMount(): Promise<void> {
    const { getTemplateList } = this.viewModel;
    await this.getPermissonData();
    getTemplateList();
  }

  componentWillUnmount(): void {
    this.viewModel.initialData();
  }

  private getPermissonData = async (): Promise<void> => {
    const { getPermissionsData, setPermissionsData } = this.viewModel;
    const { CREATE, CREATE_COPOY, DELETE, EDIT, RENAME } = TEMPLATE;
    try {
      const permissionsData = await getPermissionsData([
        CREATE,
        CREATE_COPOY,
        DELETE,
        EDIT,
        RENAME,
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

  // 瀑布流调用
  private waterFall = debounce((): void => {
    const grid = document.querySelector('.content-management-template-List');
    // eslint-disable-next-line no-new
    new Masonry(grid!, {
      itemSelector: '.grid-item',
      columnWidth: 306,
      horizontalOrder: true,
      gutter: 16,
    });
  }, 500);

  // 打开新增弹框
  public createModal = (): void => {
    const { setIsVisible } = this.createViewModel;
    setIsVisible(true);
  };

  public render(): JSX.Element {
    const {
      templateListDate,
      templateListDateSource,
      isShowAllCheckbox,
      changeDataSource,
      getTitle,
      getTemplateListParams,
      pageChange,
      delTemplate,
      createCopy,
      getTemplateDetails,
      currentSelectedData,
      onAllChecked,
      isAllChecked,
      onExit,
      onBatchDelete,
      onFinish,
      permissionsData,
    } = this.viewModel;
    const { CREATE, CREATE_COPOY, DELETE, EDIT, RENAME } = TEMPLATE;

    return (
      <div className={style.templatePageContainer}>
        <div className={style.templatePageContainer}>
          {isShowAllCheckbox ? (
            <div className={`${style.searchArea} ${style.padding}`}>
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
                <Button
                  type="primary"
                  onClick={(): void => {
                    Modal.confirm({
                      title: '提示',
                      maskClosable: true,
                      content: '删除该模板后将无法重新找回，请谨慎操作！',
                      icon: undefined,
                      onOk() {
                        onBatchDelete();
                      },
                    });
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          ) : (
            <Form onFinish={onFinish} className={style.searchArea} ref={this.formRef}>
              <Row>
                <Col style={{ minWidth: '240px', marginRight: '24px' }}>
                  <Form.Item name="name">
                    <Input placeholder="模板名称" />
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
          )}
          <div className={style.dividerContainer}>
            <Divider className={style.divider} />
          </div>
          <div className={style.buttonsContainer}>
            {permissionsData[CREATE] && (
              <Button type="primary" onClick={(): void => this.createModal()}>
                <img src={addIcon} alt="" />
                <span>创建模板</span>
              </Button>
            )}
          </div>
          {templateListDateSource.length > 0 && (
            <>
              <div className={`content-management-template-List ${style.materialCardContainer}`}>
                {templateListDateSource.map((item, index) => {
                  return (
                    <MaterialCard
                      key={`template_material_card_${index}`}
                      className={`grid-item ${style.materialCard}`}
                      width="306"
                      sourceSrc={materialMockImage}
                      title={item.templateName}
                      type={ContentMangementType.TEMPLATE}
                      isChecked={item.isChecked}
                      isShowAllCheckbox={isShowAllCheckbox}
                      onEdit={(): void => {
                        getTemplateDetails(item.id || '');
                      }}
                      onCheckbox={(): void => {
                        changeDataSource(index);
                      }}
                      onCopy={(): void => {
                        createCopy(item);
                      }}
                      onDelete={(): void => {
                        delTemplate(item.id || '0');
                      }}
                      onRenameConfirm={(title: string): void => {
                        getTitle(title, item);
                      }}
                      creatCopy={permissionsData[CREATE_COPOY]}
                      deleteItem={permissionsData[DELETE]}
                      edit={permissionsData[EDIT]}
                      rename={permissionsData[RENAME]}
                      imageComplete={(): void => {
                        this.waterFall();
                      }}
                    />
                  );
                })}
              </div>
              <Pagination
                showSizeChanger
                showQuickJumper={false}
                className={style.pagination}
                current={getTemplateListParams.page + 1}
                total={templateListDate.totalElements}
                pageSize={getTemplateListParams.size}
                onChange={pageChange}
              />
            </>
          )}
          {!templateListDateSource.length && (
            <div className={style.dataEmpty}>
              <img src={templateEmpty} alt="" />
              <p>暂无模板内容</p>
            </div>
          )}
          <CreateTemplate />
        </div>
      </div>
    );
  }
}
