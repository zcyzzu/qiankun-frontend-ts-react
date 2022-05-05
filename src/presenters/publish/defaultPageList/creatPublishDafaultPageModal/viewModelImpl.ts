/*
 * @Author: wuhao
 * @Date: 2021-12-03 09:33:32
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-21 14:37:53
 */
import { injectable, inject } from 'inversify';
import { message, Upload } from 'antd';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { RcFile } from 'rc-upload/lib/interface';
import CreatPublishDafaultPageModalViewModel, {
  FormData,
  OrganizationListData,
  OrganizationOption,
} from './viewModel';
import MaterialPreviewModal from '../../../../common/components/materialPreviewModal/index';
import {
  DEFAULT_IDENTIFIER,
  FILE_IDENTIFIER,
  ROOT_CONTAINER_IDENTIFIER,
  ADVERTISEMENT_IDENTIFIER,
  ORGANIZATION_TREE_IDENTIFIER,
} from '../../../../constants/identifiers';
import {
  CreateMaterialEntity,
  MaterialHistoryRecordEntity,
} from '../../../../domain/entities/advertisementEntities';
import {
  CreateDefaultEntity,
  PublishDefaultPageListItemConfig,
} from '../../../../domain/entities/defaultPageEntities';
import FileUseCase from '../../../../domain/useCases/fileUseCase';
import RootContainerUseCase from '../../../../domain/useCases/rootContainerUseCase';
import utils from '../../../../utils/index';
import DefaultPageUseCase from '../../../../domain/useCases/defaultPageUseCase';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import { ModalStatus, UploadType } from '../../../../common/config/commonConfig';
import { LookupsCodeTypes } from '../../../../constants/lookupsCodeTypes';
import { LookupsEntity } from '../../../../domain/entities/lookupsEntities';
import StoreUseCase from '../../../../domain/useCases/organizationUseCase';
import { OrganizationTreeListEntity } from '../../../../domain/entities/organizationEntities';
import PublishDefaultPageListViewModel from '../viewModel';
import RootContainereViewModel from '../../../rootContainer/viewModel';

@injectable()
export default class CreatPublishDafaultPageModalViewModelImpl
  implements CreatPublishDafaultPageModalViewModel {
  // defaultPageUseCase
  @inject(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_USE_CASE)
  private defaultPageUseCase!: DefaultPageUseCase;
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;
  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;
  // rootUseCase
  @inject(ROOT_CONTAINER_IDENTIFIER.ROOT_CONTAINER_USE_CASE)
  private rootContainerUseCase!: RootContainerUseCase;

  @inject(ORGANIZATION_TREE_IDENTIFIER.ORGANIZATION_TREE_USE_CASE)
  private storeUseCase!: StoreUseCase;

  //标签弹窗状态
  public publishDefaultModalVisible: boolean;

  // 组织
  public organizationType: number | undefined;
  // 分辨率类型
  public resolutionType: string;
  // 设备类型
  public deviceType: string;
  //上传类型
  public uploadType: string;
  // 上传内容
  public fileList: UploadFile[];
  //上传时长
  public uploadTime: number | undefined;
  //上传组件pros
  public uploadFormProps: UploadProps;
  // 预览素材url
  public imgUrl: string;
  // 预览上传类型
  public previewType: string;
  // 视频时长
  public videoTime: number;
  // 素材id
  public materialId: number | undefined;
  // 图片分辨率
  public imageResolution: string;
  // 视频分辨率
  public vodeoResolution: string;
  // 分辨率快码
  public resolutionList: LookupsEntity[];
  // 设备类型快码
  public deviceTypeList: LookupsEntity[];
  public organizationData: OrganizationTreeListEntity[];
  public organizationList: OrganizationListData[];
  public organizationName: string | undefined;

  // 历史素材传过来的数据
  public materialData: MaterialHistoryRecordEntity;
  public modalType: string;
  public defaultId: number | undefined;
  public detailData: PublishDefaultPageListItemConfig;
  public orgId: number;
  public tendId: number;
  public uploading: boolean;
  public isChange: boolean = false;

  public constructor() {
    this.detailData = {};
    this.defaultId = undefined;
    this.modalType = '';
    this.materialData = {};
    this.organizationList = [];
    this.organizationData = [];
    this.resolutionList = [];
    this.deviceTypeList = [];
    this.imageResolution = '';
    this.vodeoResolution = '';
    this.publishDefaultModalVisible = false;
    this.organizationType = undefined;
    this.organizationName = '';
    this.resolutionType = '';
    this.deviceType = '';
    this.uploadType = '';
    this.fileList = [];
    this.uploadTime = undefined;
    this.videoTime = 0; // 视频时长
    this.imgUrl = '';
    this.previewType = '';
    this.uploadFormProps = {
      name: 'file',
      method: 'POST',
      headers: {
        authorization: window.authorization,
      },
      listType: 'picture-card',
      defaultFileList: [],
    };
    this.materialId = undefined;
    this.orgId = 0;
    this.tendId = 0;
    this.uploading = false;
    this.setImagePreview = this.setImagePreview.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);

    makeObservable(this, {
      isChange: observable,
      uploading: observable,
      orgId: observable,
      tendId: observable,
      detailData: observable,
      defaultId: observable,
      modalType: observable,
      materialData: observable,
      organizationName: observable,
      organizationType: observable,
      organizationList: observable,
      organizationData: observable,
      resolutionType: observable,
      deviceTypeList: observable,
      resolutionList: observable,
      imageResolution: observable,
      vodeoResolution: observable,
      deviceType: observable,
      fileList: observable,
      videoTime: observable,
      imgUrl: observable,
      uploadTime: observable,
      previewType: observable,
      materialId: observable,
      uploadType: observable,
      uploadFormProps: observable,
      publishDefaultModalVisible: observable,
      formOnFinish: action,
      setPublishDefaultModalVisible: action,
      setUploadType: action,
      setUploadTime: action,
      setImagePreview: action,
      setDeviceType: action,
      setResolution: action,
      setOrganization: action,
      getDetailDefault: action,
    });
  }
  // 获取详情
  public getDetailDefault = async (id: number): Promise<boolean> => {
    const data = await this.defaultPageUseCase.getDetailDefault(id);
    runInAction(async () => {
      this.detailData = data;
      // id
      this.defaultId = data?.id;
      //组织
      this.organizationType = data?.unitId;
      this.organizationName = data?.unitName;
      // 设备类型
      this.deviceType = data?.deviceType || '';

      // 分辨率
      this.resolutionType = data?.resolution || '';

      // 拿到素材的id集合
      this.materialId = data.material?.id;
      this.uploadTime = data.duration;
      // 拿到素材的上传类型集合
      if (data.material?.type) {
        this.uploadType =
          data.material?.type === UploadType.JPG || data.material?.type === UploadType.PNG
            ? 'image'
            : 'video';

        // 拿到素材的上传时间集合
        // this.uploadTime = Number(data.material?.duration) || undefined;

        // 素材视频的地址filekey请求url
        const url = await this.fileUseCase.getPreviewUrl(data.material?.fileKey || '');
        if (data.material?.type === UploadType.MP4) {
          utils.getFramesUrl(url.fileTokenUrl || '').then((res) => {
            this.fileList = [
              {
                uid: '-1',
                name: 'iconUrl',
                status: 'done',
                url: url.fileTokenUrl || '',
                thumbUrl: res,
              },
            ];
          });
        } else {
          // 拿到素材图片的上传地址集合
          this.fileList = [
            {
              uid: '-1',
              name: 'iconUrl',
              status: 'done',
              url: url.fileTokenUrl || '',
              thumbUrl: url.fileTokenUrl || '',
            },
          ];
        }

        this.imgUrl = url.fileTokenUrl || '';
      }
    });
    return true;
  };

  // 获取组织列表数据
  public getOrganization = async (): Promise<void> => {
    try {
      await this.storeUseCase.getAllStoreTreeListWithStore();
      runInAction(() => {
        this.organizationData = this.storeUseCase.storeTreeListData;
        const dataSource = this.organizationData.filter((item, index) => {
          const idx = this.organizationData.findIndex((i) => {
            return item.unitId === i.unitId;
          });
          return index === idx;
        });
        dataSource.forEach((item) => {
          const { unitId, unitName } = item;
          const obj = {
            title: unitName || '',
            value: unitId || 0,
          };
          this.organizationList.push(obj);
          // Object.assign(arr, obj);
          if (item.children) {
            this.childrenTree(item.children);
          }
        });
      });
    } catch (error) {
      runInAction(() => {
        this.organizationList = [];
        this.organizationData = [];
      });
    }
  };
  public childrenTree = (val?: OrganizationTreeListEntity[]): void => {
    if (val) {
      val.forEach((item) => {
        const { unitId, unitName } = item;
        const obj = {
          title: unitName || '',
          value: unitId || 0,
        };
        this.organizationList.push(obj);
        if (item.children) {
          this.childrenTree(item.children);
        }
      });
    }
  };
  // 请求快码数据
  public getLookupsValue = async (code: LookupsCodeTypes): Promise<void> => {
    try {
      await this.rootContainerUseCase.getLookupsValue(code);
      runInAction(() => {
        // 分辨率快码
        if (code === LookupsCodeTypes.DEVICE_RESOLUTION_TYPE) {
          this.resolutionList = [...this.rootContainerUseCase.lookupsValue];
        }
        // 设备类型
        if (code === LookupsCodeTypes.DEVICE_TYPE_CODE) {
          this.deviceTypeList = [...this.rootContainerUseCase.lookupsValue];
        }
      });
    } catch (e) {
      runInAction(() => {
        this.resolutionList = [];
      });
    }
  };

  //设置组织
  public setOrganization = (e: number, option?: OrganizationOption): void => {
    this.organizationType = e;
    this.organizationName = option?.children;
  };

  //设置分辨率
  public setResolution = (e: string): void => {
    this.resolutionType = e;
  };

  //设置设备类型
  public setDeviceType = (e: string): void => {
    this.deviceType = e;
  };
  //设置上传类型
  public setUploadType = (e: string): void => {
    if (this.uploading) {
      message.error('正在上传请勿切换');
      return;
    }
    this.isChange = false;
    this.materialData = {};
    this.uploadType = e;
    this.uploadTime = undefined;
    if (e === UploadType.IMAGE) {
      this.fileList = [];
      this.materialId = undefined;
    } else {
      this.uploadTime = undefined;
      this.fileList = [];
      this.materialId = undefined;
    }
  };

  // 设置上传时长
  public setUploadTime = (e: number): void => {
    this.uploadTime = e;
  };

  // 背景图上传回调
  public uploadChange = async (info: UploadChangeParam): Promise<void> => {
    const { status } = info.file;
    if (status === 'done') {
      const data = await this.fileUseCase.getPreviewUrl(info.file.response.fileKey);
      runInAction(() => {
        this.imgUrl = data.fileTokenUrl || '';
      });

      // 创建素材
      const urlParam: CreateMaterialEntity = {};
      urlParam.name = info.file.name;
      urlParam.description = '';
      urlParam.duration =
        info.file.type?.split('/')[0] === UploadType.VIDEO ? this.videoTime : this.uploadTime;
      urlParam.fileHash = data.md5;
      urlParam.fileKey = info.file.response.fileKey; //data.fileTokenUrl;
      urlParam.unitId = this.orgId;
      urlParam.resolution =
        info.file.type?.split('/')[0] === UploadType.VIDEO
          ? this.vodeoResolution
          : this.imageResolution;
      urlParam.size = String(info.file.size);
      urlParam.tenantId = this.tendId;
      urlParam.type = info.file.name?.split('.').reverse()[0];
      const id = await this.AdvertisementUseCase.setCreateMaterial(urlParam);
      if (id) {
        this.uploading = false;
      }
      // 存id，保存或者发布需要
      this.materialId = id;
      this.isChange = true;
    } else if (status === 'error') {
      this.isChange = false;
      utils.globalMessge({
        content: '素材上传失败!',
        type: 'error',
      });
    }
    runInAction(() => {
      this.fileList = info.fileList;
    });
  };

  public setImagePreview(
    file: UploadFile<unknown>,
    ref: React.RefObject<MaterialPreviewModal>,
  ): void {
    ref.current?.setIsModalVisible();
  }

  public beforeUpload(file: RcFile, fileType: RcFile[]): boolean | string {
    console.log(fileType);
    this.uploading = true;
    if (
      this.uploadType === UploadType.IMAGE &&
      file.name.split('.').reverse()[0] !== UploadType.JPG &&
      file.name.split('.').reverse()[0] !== UploadType.PNG
    ) {
      message.error('上传图片类型不符,请重新上传');
      return Upload.LIST_IGNORE;
    }

    if (
      this.uploadType === UploadType.VIDEO &&
      file.name.split('.').reverse()[0] !== UploadType.MP4
    ) {
      message.error('上传视频类型不符，请重新上传');
      return Upload.LIST_IGNORE;
    }
    // 拿到视频的时长
    const videoUrl = URL.createObjectURL(file);
    const videoObj = document.createElement('video');
    videoObj.preload = 'metadata';
    videoObj.src = videoUrl;
    videoObj.onloadedmetadata = (): void => {
      URL.revokeObjectURL(videoUrl);
      const times = Math.round(videoObj.duration);
      this.videoTime = times;
      if (times < 5 || times > 20) {
        message.error('请上传5-20秒内的视频素材');
        this.fileList = [];
        this.materialId = 0;
        return;
      }
      this.vodeoResolution = `${videoObj.videoWidth}*${videoObj.videoHeight}`;
    };
    // 拿到图片分辨率
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (): void => {
      const image = new Image();
      image.src = (reader.result as string) || '';
      image.onload = (): void => {
        this.imageResolution = `${image.width}*${image.width}`;
      };
    };

    const isLt = [];
    if (file.type.split('/')[0] === UploadType.VIDEO) {
      const isLt20M = file.size / 1024 / 1024 > 20;
      if (isLt20M) {
        message.error('上传视频不能超过20M');
        isLt.push(1);
      }
    }
    if (file.type.split('/')[0] === UploadType.IMAGE) {
      const isLt2M = file.size / 1024 / 1024 > 2;
      if (isLt2M) {
        message.error('上传图片不能超过2M');
        this.fileList = [];
        isLt.push(2);
      }
    }
    return isLt.length === 0 ? true : Upload.LIST_IGNORE;
  }
  public initBackgroundItem = async (): Promise<void> => {
    this.isChange = false;
    // 不要删除接口，不需要删除素材本身
    // await this.AdvertisementUseCase.delMaterial(this.materialId);
    // utils.globalMessge({
    //   content: '删除素材成功',
    //   type: 'success',
    // });
    this.materialId = undefined;
  };

  //表单提交成功事件
  public formOnFinish = async (
    values: FormData,
    publishDefaultPageListViewModel: PublishDefaultPageListViewModel,
  ): Promise<void> => {
    const { organizationType, deviceType, time, resolution } = values;
    // 创建缺省
    const param: CreateDefaultEntity = {};
    param.deviceType = deviceType;
    param.duration = Number(time);
    param.materialId = this.materialId;
    param.resolution = resolution;
    param.unitId = Number(organizationType);
    param.unitName = this.organizationName;
    param.tenantId = this.tendId;

    this.detailData.deviceType = deviceType;
    this.detailData.materialId = this.materialId;
    this.detailData.duration = Number(time);
    this.detailData.resolution = resolution;
    this.detailData.unitId = Number(organizationType);
    this.detailData.unitName = this.organizationName;
    this.detailData.tenantId = this.tendId;
    if (this.modalType === ModalStatus.Creat) {
      this.addNewAdvert(param, publishDefaultPageListViewModel);
    } else {
      this.putNewAdvert(this.detailData, publishDefaultPageListViewModel);
    }

    // const id = await this.defaultPageUseCase.setCrea
    // teDefault(param, publishDefaultPageListViewModel);
  };

  // 创建缺省
  public addNewAdvert = (
    param: CreateDefaultEntity,
    publishDefaultPageListViewModel?: PublishDefaultPageListViewModel,
  ): void => {
    this.defaultPageUseCase
      .setCreateDefault(param)
      .then(() => {
        this.setPublishDefaultModalVisible();
        utils.globalMessge({
          content: '创建缺省成功',
          type: 'success',
        });
        if (publishDefaultPageListViewModel) {
          const { getPublishDefaultPageList } = publishDefaultPageListViewModel;
          getPublishDefaultPageList();
        }
      })
      .catch((error) => {
        if (error.failed) {
          utils.globalMessge({
            content: error.message,
            type: 'error',
          });
        }
      });
  };

  // 更新缺省
  public putNewAdvert = (
    param: CreateDefaultEntity,
    publishDefaultPageListViewModel?: PublishDefaultPageListViewModel,
  ): void => {
    this.defaultPageUseCase
      .setPutDefault(param)
      .then(() => {
        this.setPublishDefaultModalVisible();
        utils.globalMessge({
          content: '更新缺省成功',
          type: 'success',
        });
        if (publishDefaultPageListViewModel) {
          const { getPublishDefaultPageList } = publishDefaultPageListViewModel;
          getPublishDefaultPageList();
        }
      })
      .catch((error) => {
        if (error.failed) {
          utils.globalMessge({
            content: error.message,
            type: 'error',
          });
        }
      });
  };

  //设置标签model显示隐藏
  public setPublishDefaultModalVisible = (
    type?: string,
    rootContainereViewModel?: RootContainereViewModel,
  ): void => {
    if (rootContainereViewModel) {
      this.orgId = rootContainereViewModel.userInfo.organizationId || 0;
      this.tendId = rootContainereViewModel.userInfo.tenantId || 0;
    }
    if (!type) {
      this.materialData = {};
      this.organizationList = [];
      this.organizationData = [];
      this.resolutionList = [];
      this.deviceTypeList = [];
      this.imageResolution = '';
      this.vodeoResolution = '';
      this.organizationType = undefined;
      this.organizationName = '';
      this.resolutionType = '';
      this.deviceType = '';
      this.uploadType = '';
      this.fileList = [];
      this.uploadTime = undefined;
      this.videoTime = 0; // 视频时长
      this.imgUrl = '';
      this.previewType = '';
      this.modalType = '';
      this.defaultId = undefined;
      this.detailData = {};
    } else {
      this.modalType = type;
    }
    this.uploading = false;
    this.publishDefaultModalVisible = !this.publishDefaultModalVisible;
  };
  // 获取选中的素材数据
  public getMaterialDataDefault = async (data: MaterialHistoryRecordEntity): Promise<void> => {
    this.materialData = data;
    this.materialId = data.id;
    // 拿到素材的上传类型集合
    this.uploadType =
      data.type === UploadType.JPG || data.type === UploadType.PNG ? 'image' : 'video';
    // // 拿到素材的上传时间集合
    // this.uploadTime = data.duration || undefined;
    const url = await this.fileUseCase.getPreviewUrl(data.fileKey || '');
    if (data.type === UploadType.MP4) {
      utils.getFramesUrl(url.fileTokenUrl || '').then((res) => {
        this.fileList = [
          {
            uid: '-1',
            name: 'iconUrl',
            status: 'done',
            url: url.fileTokenUrl || '',
            thumbUrl: res,
          },
        ];
      });
    } else {
      // 拿到素材图片的上传地址集合
      this.fileList = [
        {
          uid: '-1',
          name: 'iconUrl',
          status: 'done',
          url: url.fileTokenUrl || '',
          thumbUrl: url.fileTokenUrl || '',
        },
      ];
    }

    this.imgUrl = url.fileTokenUrl || '';
  };
}
