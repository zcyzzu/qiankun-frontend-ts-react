/*
 * @Author: wuhao
 * @Date: 2021-09-22 11:00:03
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-27 10:11:16
 */

import { injectable, inject } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { message, Upload } from 'antd';
import { RcFile } from 'rc-upload/lib/interface';
import { cloneDeep } from 'lodash';
import Compressor from 'compressorjs';
import utils from '../../../utils/index';
import {
  ROOT_CONTAINER_IDENTIFIER,
  CONTENT_MANAGEMENT_IDENTIFIER,
  FILE_IDENTIFIER,
  USER_IDENTIFIER,
  PERMISSIONS,
} from '../../../constants/identifiers';
import RootContainerUseCase from '../../../domain/useCases/rootContainerUseCase';
import MaterialUseCase from '../../../domain/useCases/materialUseCase';
import MaterialPageViewModel, { MaterialListParams, MaterialItemEntityParam } from './ViewModel';
import {
  MaterialItemEntity,
  CreateMaterialEntity,
} from '../../../domain/entities/materialEntities';

import { CommonPagesGeneric, UploadType } from '../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../constants/lookupsCodeTypes';
import UserUseCase from '../../../domain/useCases/userUseCase';
import { LookupsEntity } from '../../../domain/entities/lookupsEntities';
import RootContainereViewModel from '../../rootContainer/viewModel';
import FileUseCase from '../../../domain/useCases/fileUseCase';
import PermissionsUseCase from '../../../domain/useCases/permissionsUseCase';
import { TemplateDownloadEntity } from '../../../domain/entities/fileEntities';

@injectable()
export default class MaterialPageViewModelImpl implements MaterialPageViewModel {
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;
  // MaterialUseCase
  @inject(CONTENT_MANAGEMENT_IDENTIFIER.MATERIAL_USE_CASE)
  private materialUseCase!: MaterialUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  @inject(USER_IDENTIFIER.USER_USE_CASE)
  private userUseCase!: UserUseCase;

  // permissionsUseCase
  @inject(PERMISSIONS.PERMISSIONS_USE_CASE)
  private permissionsUseCase!: PermissionsUseCase;

  public materialList: MaterialItemEntityParam[] = [];
  public materialListData: CommonPagesGeneric<MaterialItemEntity> = { content: [] };
  public materialTypeCode: LookupsEntity[] = [];
  public isShowAllCheckbox: boolean = false;
  public isAllChecked: boolean = false;
  public isChecked: boolean = false;
  public maxHeight: number = 1200;
  public currentSelectedData: MaterialItemEntity[] = [];
  public dataSource: MaterialItemEntityParam[] = [];
  public queryParams: MaterialListParams = {
    page: 0,
    size: 10,
  };
  public uploadFormProps: UploadProps = {
    name: 'file',
    method: 'POST',
    headers: {
      authorization: window.authorization,
    },
    defaultFileList: [],
  };
  // 视频时长
  public videoTime: number = 0;
  //上传时长
  public uploadTime: number | undefined;
  public orgId: number = 0;
  // 图片分辨率
  public imageResolution: string = '';
  // 视频分辨率
  public vodeoResolution: string = '';
  public uploading: boolean = false;
  //上传类型
  public uploadType: string = '';
  //判断无素材状态
  public flag: boolean = false;
  // 素材预览弹窗类型与src
  public previewImageSrc: string = '';
  public previewImageType: string = '';
  // 权限数据
  public permissionsData: {
    [key: string]: boolean;
  } = {};
  private imageCompressor: Blob | null = null;
  public fileKeyData: string = '';

  public constructor() {
    this.beforeUpload = this.beforeUpload.bind(this);

    makeObservable(this, {
      materialList: observable,
      isShowAllCheckbox: observable,
      maxHeight: observable,
      currentSelectedData: observable,
      materialTypeCode: observable,
      uploadFormProps: observable,
      videoTime: observable,
      uploadTime: observable,
      orgId: observable,
      imageResolution: observable,
      vodeoResolution: observable,
      uploading: observable,
      uploadType: observable,
      flag: observable,
      previewImageSrc: observable,
      previewImageType: observable,
      permissionsData: observable,
      fileKeyData: observable,
      getMaterialList: action,
      getLookupsValue: action,
      onFinish: action,
      selectType: action,
      pageChange: action,
      getTitle: action,
      queryCheckbox: action,
      changeDataSource: action,
      onAllChecked: action,
      setMaxHeight: action,
      onExit: action,
      deleteAll: action,
      deleteItem: action,
      initQueryParams: action,
      uploadChange: action,
      getPermissionsData: action,
      setPermissionsData: action,
      createMaterial: action,
      sizeChange: action,
      renderType: action,
    });
  }

  // 获取素材类型快码
  public getLookupsValue = async (): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(LookupsCodeTypes.MATERIAL_SOURCE_TYPE);
      runInAction(() => {
        this.materialTypeCode = [...this.rootContainerUseCase.lookupsValue];
      });
    } catch (error) {
      runInAction(() => {
        this.materialTypeCode = [];
      });
    }
  };
  // 类型-查询表单数据
  public selectType = (e: string): void => {
    if (e && e !== 'all') {
      this.queryParams.searchSourceType = e;
    } else {
      delete this.queryParams.searchSourceType;
    }
    this.queryParams.page = 0;
    this.getMaterialList(true);
  };
  //表单搜索
  public onFinish = (values: MaterialListParams): void => {
    const { name } = values;
    if (name) {
      this.queryParams.name = name;
    } else {
      delete this.queryParams.name;
    }
    this.queryParams.page = 0;
    this.getMaterialList(true);
  };

  // 获取素材列表
  public getMaterialList = async (val?: boolean): Promise<void> => {
    this.flag = val || false;
    const { page, size, name, searchSourceType } = this.queryParams;
    try {
      const data = await this.materialUseCase.getMaterialList(page, size, name, searchSourceType);
      runInAction(async () => {
        this.materialListData = data;
        this.materialList = [];
        if (this.materialListData.content) {
          const materialsPromise = this.materialListData.content.map(
            async (item: MaterialItemEntity, index: number) => {
              let previewData: TemplateDownloadEntity | null = null;
              if (item.previewKey) {
                try {
                  previewData = await this.fileUseCase.getPreviewUrl(item.previewKey);
                } catch (error) {
                  console.log('getPreviewUrl error', error);
                }
              }
              return {
                ...item,
                key: index + 1,
                isChecked: false,
                url: previewData ? previewData.fileTokenUrl : '',
              };
            },
          );
          this.materialList = await Promise.all(materialsPromise);
        }
      });
    } catch (e) {
      utils.globalMessge({
        content: `获取列表失败，${(e as Error).message}`,
        type: 'error',
      });
    }
  };
  // 初始化查询参数
  public initQueryParams = (): void => {
    this.queryParams = {
      page: 0,
      size: 10,
    };
  };
  // 改变分页
  public pageChange = (page: number, pageSize?: number): void => {
    this.queryParams.page = page - 1;
    if (pageSize) {
      this.queryParams.size = pageSize;
    }
    this.isShowAllCheckbox = false;
    this.getMaterialList();
  };
  // 每页条数
  public sizeChange = async (current: number, pageSize: number): Promise<void> => {
    console.log(current, pageSize);
    this.queryParams.page = 0;
    this.queryParams.size = pageSize;
    await this.getMaterialList();
  };
  //删除批量素材
  public deleteAll = async (ids: number[]): Promise<void> => {
    try {
      await this.materialUseCase.deleteAll(ids);
      utils.globalMessge({
        content: '已删除',
        type: 'success',
      });
      this.getMaterialList();
      this.isShowAllCheckbox = false;
    } catch (err) {
      utils.globalMessge({
        content: '删除失败，请重试',
        type: 'error',
      });
    }
  };

  //删除单个素材
  public deleteItem = async (id: number): Promise<void> => {
    try {
      await this.materialUseCase.deleteItem(id);
      utils.globalMessge({
        content: '已删除',
        type: 'success',
      });
      this.isShowAllCheckbox = false;
      this.getMaterialList();
    } catch (err) {
      utils.globalMessge({
        content: '删除失败，请重试',
        type: 'error',
      });
    }
  };
  //下载素材
  public downMaterial = async (record: MaterialItemEntity): Promise<void> => {
    if (record.fileKey) {
      const res = await this.fileUseCase.getPreviewUrl(record.fileKey);
      const eleLink = document.createElement('a');
      eleLink.download = res.fileTokenUrl || '';
      eleLink.style.display = 'none';
      eleLink.href = res.fileTokenUrl || '';
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    } else {
      utils.globalMessge({
        content: '素材资源错误,请联系管理员!',
        type: 'error',
      });
    }
  };

  public getPreviewModalInfo = async (record: MaterialItemEntityParam): Promise<void> => {
    if (record.fileKey) {
      const imageObj = await this.fileUseCase.getPreviewUrl(record.fileKey);
      this.previewImageSrc = imageObj.fileTokenUrl || '';
      this.previewImageType =
        record.type === UploadType.VIDEO || record.type === UploadType.MP4 ? 'video' : 'image';
    } else {
      utils.globalMessge({
        content: '素材资源错误,请联系管理员!',
        type: 'error',
      });
    }
  };

  public queryCheckbox = (): void => {
    if (this.materialList.find((item) => item.isChecked)) {
      this.isShowAllCheckbox = true;
      this.currentSelectedData = this.materialList.filter((item) => item.isChecked);
      if (this.materialList.every((item) => item.isChecked)) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
    } else {
      this.isShowAllCheckbox = false;
      this.currentSelectedData = [];
    }
  };

  public changeDataSource = (index: number): void => {
    this.materialList[index].isChecked = !this.materialList[index].isChecked;
    this.queryCheckbox();
  };

  public onAllChecked = (): void => {
    this.isAllChecked = !this.isAllChecked;
    if (this.isAllChecked) {
      this.materialList.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.isChecked = true;
      });
      this.currentSelectedData = cloneDeep(this.materialList);
    } else {
      this.materialList.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.isChecked = false;
      });
      this.isShowAllCheckbox = false;
      this.currentSelectedData = [];
    }
  };
  public getTitle = async (title: string, itemData: MaterialItemEntity): Promise<void> => {
    const newData = cloneDeep(itemData);
    newData.name = title;
    this.materialUseCase
      .editMaterial(newData)
      .then(() => {
        utils.globalMessge({
          content: '修改成功！',
          type: 'success',
        });
        this.getMaterialList();
      })
      .catch((e) => {
        utils.globalMessge({
          content: `修改失败，${e.message}`,
          type: 'error',
        });
      });
  };
  public setMaxHeight = (height: number): void => {
    this.maxHeight = height + 100;
  };

  public onExit = (): void => {
    this.isShowAllCheckbox = false;
    this.currentSelectedData = [];
    this.materialList.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.isChecked = false;
    });
  };

  public uploadChange = async (
    info: UploadChangeParam,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    const { status } = info.file;
    let thumbImage: Blob;
    if (status === 'done') {
      const data = await this.fileUseCase.getPreviewUrl(info.file.response.fileKey);
      // 视频
      if (info.file.type?.split('/')[0] === UploadType.VIDEO) {
        const fileKey = await utils.getFramesUrl(data.fileTokenUrl || '');
        thumbImage = utils.baseToBlob(fileKey);
        this.createMaterial(thumbImage, info, data, rootContainereViewModel);
      } else {
        // 图片
        if (this.imageCompressor) {
          thumbImage = this.imageCompressor;
          this.createMaterial(thumbImage, info, data, rootContainereViewModel);
        }
      }
    } else if (status === 'error') {
      utils.globalMessge({
        content: '素材上传失败!',
        type: 'error',
      });
    }
  };

  // 创建素材
  public createMaterial = async (
    thumbImage: Blob,
    info: UploadChangeParam,
    uploadData: TemplateDownloadEntity,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    // 上传缩略图
    const obj = await this.fileUseCase.uploadForKey(
      new File([thumbImage], 'png'),
      'material-thumb-image',
    );
    const previewKey = JSON.parse(JSON.stringify(obj)).fileKey;
    // 创建素材
    const urlParam: CreateMaterialEntity = {
      name: info.file.name,
      description: '',
      duration:
        info.file.type?.split('/')[0] === UploadType.VIDEO ? this.videoTime : this.uploadTime,
      fileHash: uploadData.md5,
      fileKey: info.file.response.fileKey,
      unitId: this.orgId,
      resolution:
        info.file.type?.split('/')[0] === UploadType.VIDEO
          ? this.vodeoResolution
          : this.imageResolution,
      size: String(info.file.size),
      tenantId: this.userUseCase.userInfo.tenantId,
      type: info.file.name?.split('.').reverse()[0],
      previewKey,
    };
    const id = await this.materialUseCase.setCreateMaterial(urlParam);
    if (id) {
      utils.globalMessge({
        content: '素材上传成功!',
        type: 'success',
      });
      rootContainereViewModel?.setLoading(false);
      this.uploading = false;
      this.imageCompressor = null;
      this.getMaterialList();
    }
  };

  public createVideo = async (
    file: RcFile,
    isLt: string[],
    resolve: {
      (value: string | boolean | PromiseLike<string | boolean>): void;
      (arg0: boolean): string | void;
    },
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<void> => {
    // 视频预处理
    const videoUrl = URL.createObjectURL(file);
    const videoObj = document.createElement('video');
    videoObj.preload = 'metadata';
    videoObj.src = videoUrl;
    // eslint-disable-next-line consistent-return
    videoObj.onloadedmetadata = (): string | void => {
      URL.revokeObjectURL(videoUrl);
      const times = Math.round(videoObj.duration);
      this.videoTime = times;
      this.vodeoResolution = `${videoObj.videoWidth}*${videoObj.videoHeight}`;
      if (file.type.split('/')[0] === UploadType.VIDEO) {
        const isLt20M = file.size / 1024 / 1024 > 20;
        if (isLt20M) {
          message.error('请上传20M内的视频格式');
          isLt.push('false');
          return Upload.LIST_IGNORE;
        }
      }
      if (times < 5 || times > 20) {
        message.error('请上传5-20秒的视频素材');
        isLt.push('false');
        return Upload.LIST_IGNORE;
      }
      if (isLt.length === 0) {
        rootContainereViewModel?.setLoading(true);
        return resolve(true);
      }
    };
  };

  // eslint-disable-next-line consistent-return
  public createImage(
    file: RcFile,
    isLt: string[],
    resolve: {
      (value: string | boolean | PromiseLike<string | boolean>): void;
      (arg0: boolean): string | void;
    },
    rootContainereViewModel?: RootContainereViewModel,
  ): string | void {
    const isLt2M = file.size / 1024 / 1024 > 2;
    if (isLt2M) {
      message.error('请上传2M内的图片格式');
      isLt.push('false');
      return Upload.LIST_IGNORE;
    }
    // 图片预处理
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (): void => {
      const image = new Image();
      image.src = (reader.result as string) || '';
      image.onload = async (): Promise<void> => {
        // 拿到图片分辨率
        this.imageResolution = `${image.width}*${image.height}`;
        // 拿到压缩图片
        this.imageCompressor = await this.compressImage(file);
      };
    };
    if (isLt.length === 0) {
      rootContainereViewModel?.setLoading(true);
      return resolve(true);
    }
  }

  public beforeUpload = async (
    file: RcFile,
    rootContainereViewModel?: RootContainereViewModel,
  ): Promise<boolean | string> => {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      if (
        file.name.split('.').reverse()[0] !== UploadType.JPG &&
        file.name.split('.').reverse()[0] !== UploadType.PNG &&
        file.name.split('.').reverse()[0] !== UploadType.MP4 &&
        file.name.split('.').reverse()[0] !== UploadType.GIF
      ) {
        message.error('上传视频/图片类型不符，请重新上传');
        return Upload.LIST_IGNORE;
      }
      const isLt: string[] = [];
      this.uploading = true;
      if (file.type.split('/')[0] === UploadType.VIDEO) {
        this.createVideo(file, isLt, resolve, rootContainereViewModel);
      }
      if (file.type.split('/')[0] === UploadType.IMAGE) {
        this.createImage(file, isLt, resolve, rootContainereViewModel);
      }
    });
  };

  // 压缩图片
  private compressImage = (file: File | Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-new
      new Compressor(file, {
        quality: 0.1,
        success: (result): void => {
          resolve(result);
        },
        error: (err): void => {
          console.log(err.message);
        },
      });
    });
  };

  // 获取权限数据
  public getPermissionsData = (param: string[]): Promise<{ [key: string]: boolean }> => {
    return this.permissionsUseCase.getPermission(param);
  };

  // 设置权限数据
  public setPermissionsData = (data: { [key: string]: boolean }): void => {
    this.permissionsData = { ...data };
  };
  // 素材类型
  public renderType = (sourceType: string): string => {
    const data = this.materialTypeCode.filter((item) => item.value === sourceType);
    if (data.length) {
      return data[0].meaning;
    }
    return sourceType;
  };
}
