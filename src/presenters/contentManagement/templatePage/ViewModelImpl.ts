/*
 * @Author: wuhao
 * @Date: 2021-09-22 11:00:03
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-29 10:12:15
 */
import { cloneDeep } from 'lodash';
import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

import TemplatePageViewModel, {
  TemplatePageFormData,
  TemplateListParams,
  TemplateListItemEntityConfig,
} from './ViewModel';
import { ComonPages } from '../../../domain/entities/templateEntities';
import { CONTENT_MANAGEMENT_IDENTIFIER, PERMISSIONS } from '../../../constants/identifiers';
import TemplateUseCase from '../../../domain/useCases/templateUseCase';
import utils from '../../../utils/index';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';
import history from '../../../history';

@injectable()
export default class TemplatePageViewModelImpl implements TemplatePageViewModel {
  // TemplateUseCase
  @inject(CONTENT_MANAGEMENT_IDENTIFIER.TEMPLATE_USE_CASE)
  private templateUseCase!: TemplateUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public getTemplateListParams: TemplateListParams;
  public templateListDate: ComonPages<TemplateListItemEntityConfig>;
  public templateListDateSource: TemplateListItemEntityConfig[];
  public isShowAllCheckbox: boolean;
  public isAllChecked: boolean;
  public currentSelectedData: TemplateListItemEntityConfig[];
  public maxHeight: number;
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};

  public constructor() {
    this.getTemplateListParams = {
      page: 0,
      size: 10,
    };
    this.templateListDate = {
      content: [],
    };
    this.templateListDateSource = [];
    this.isShowAllCheckbox = false;
    this.isAllChecked = false;
    this.currentSelectedData = [];
    this.maxHeight = 0;

    makeObservable(this, {
      getTemplateListParams: observable,
      templateListDate: observable,
      templateListDateSource: observable,
      isShowAllCheckbox: observable,
      isAllChecked: observable,
      currentSelectedData: observable,
      maxHeight: observable,
      permissionsData: observable,
      onFinish: action,
      queryCheckbox: action,
      changeDataSource: action,
      onAllChecked: action,
      onBatchDelete: action,
      onExit: action,
      getTitle: action,
      delTemplate: action,
      createCopy: action,
      setMaxHeight: action,
      getTemplateList: action,
      pageChange: action,
      getTemplateDetails: action,
      initialData: action,
      getPermissionsData: action,
      setPermissionsData: action,
    });
  }

  // 表单搜索
  public onFinish = (values: TemplatePageFormData): void => {
    this.getTemplateListParams.name = values.name;
    this.getTemplateList();
  };

  // 获取模板列表数据
  public getTemplateList = async (): Promise<void> => {
    const { name, page, size } = this.getTemplateListParams;
    try {
      const data = await this.templateUseCase.getTemplateList(name, page, size);
      runInAction(() => {
        const listData: TemplateListItemEntityConfig[] = [];
        this.templateListDate = data;
        if (data.content) {
          data.content.forEach((item) => {
            listData.push({
              ...item,
              isChecked: false,
            });
          });
        }
        this.templateListDateSource = listData;
      });
    } catch (error) {
      utils.globalMessge({
        content: `获取列表失败，${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 获取模板详情
  public getTemplateDetails = async (id: string): Promise<void> => {
    try {
      const data = await this.templateUseCase.templateDetails(id);
      console.log('getTemplateDetails', data);
    } catch (error) {
      console.log(error);
    }
    history.push(`/design/editor?id=${id}`);
    // const url = `https://tmis-dev.timework.cn/design/editor?id=${id}`;
    // const a = window.document.createElement('a');
    // a.setAttribute('href', url);
    // a.setAttribute('target', '_blank');
    // a.setAttribute('id', url);
    // // 防止反复添加
    // if (!window.document.getElementById(url)) {
    //   window.document.body.appendChild(a);
    // }
    // a.click();
  };

  // 检查复选框
  public queryCheckbox = (): void => {
    if (this.templateListDateSource.find((item) => item.isChecked)) {
      this.isShowAllCheckbox = true;
      this.currentSelectedData = this.templateListDateSource.filter((item) => item.isChecked);
      if (this.templateListDateSource.every((item) => item.isChecked)) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
    } else {
      this.isShowAllCheckbox = false;
      this.currentSelectedData = [];
    }
  };

  // 更新源数据
  public changeDataSource = (index: number): void => {
    this.templateListDateSource[index].isChecked = !this.templateListDateSource[index].isChecked;
    this.queryCheckbox();
  };

  // 全选/反选
  public onAllChecked = (): void => {
    this.isAllChecked = !this.isAllChecked;
    if (this.isAllChecked) {
      this.templateListDateSource.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.isChecked = true;
      });
      this.currentSelectedData = cloneDeep(this.templateListDateSource);
    } else {
      this.templateListDateSource.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.isChecked = false;
      });
      this.isShowAllCheckbox = false;
      this.currentSelectedData = [];
    }
  };

  // 退出
  public onExit = (): void => {
    this.isShowAllCheckbox = false;
    this.currentSelectedData = [];
    this.templateListDateSource.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.isChecked = false;
    });
  };

  // 获取新标题
  public getTitle = async (
    title: string,
    itemData: TemplateListItemEntityConfig,
  ): Promise<void> => {
    const newData = cloneDeep(itemData);
    newData.templateName = title;
    try {
      await this.templateUseCase.editTemplate(newData);
      utils.globalMessge({
        content: '修改成功！',
        type: 'success',
      });
      this.getTemplateList();
    } catch (error) {
      utils.globalMessge({
        content: `修改失败，${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 设置最大高度
  public setMaxHeight = (height: number): void => {
    this.maxHeight = height + 100;
  };

  // 改变页码
  public pageChange = async (page: number, pageSize: number): Promise<void> => {
    this.getTemplateListParams.page = page - 1;
    if (pageSize) {
      this.getTemplateListParams.size = pageSize;
    }
    await this.getTemplateList();
  };

  // 创建副本
  public createCopy = async (itemData: TemplateListItemEntityConfig): Promise<void> => {
    const templateName = `${itemData.templateName}-副本`;
    if (templateName.split('').length > 30) {
      utils.globalMessge({
        content: '复制模板失败，因要复制的模板名称过长导致，请先修改名称在27个字符内!',
        type: 'error',
      });
      return;
    }
    const newData = cloneDeep(itemData);
    newData.templateName = templateName;
    delete newData.id;
    try {
      await this.templateUseCase.copyTemplate(newData);
      utils.globalMessge({
        content: '复制模板成功',
        type: 'success',
      });
      this.getTemplateList();
    } catch (error) {
      utils.globalMessge({
        content: `复制模板失败，请重试！${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 删除单个模板
  public delTemplate = async (id: string): Promise<void> => {
    try {
      await this.templateUseCase.delTemplate(id);
      utils.globalMessge({
        content: '已删除',
        type: 'success',
      });
      this.isShowAllCheckbox = false;
      this.getTemplateList();
    } catch (error) {
      utils.globalMessge({
        content: `删除失败，请重试！${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 批量删除模板
  public onBatchDelete = async (): Promise<void> => {
    try {
      const data = this.currentSelectedData.map((item) => {
        return item.id;
      });
      await this.templateUseCase.batchDelTemplate(data as string[]);
      utils.globalMessge({
        content: '已删除',
        type: 'success',
      });
      this.isShowAllCheckbox = false;
      this.getTemplateList();
    } catch (error) {
      utils.globalMessge({
        content: `删除失败，请重试！${(error as Error).message}`,
        type: 'error',
      });
    }
  };

  // 初始化数据
  public initialData = (): void => {
    this.getTemplateListParams = {
      page: 0,
      size: 10,
    };
  };

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };
}
