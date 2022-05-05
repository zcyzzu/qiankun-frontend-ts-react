/*
 * @Author: tongyuqiang
 * @Date: 2021-11-29 09:33:12
 * @LastEditors: wuhao
 * @LastEditTime: 2022-03-14 11:46:04
 */
import { cloneDeep } from 'lodash';

import { injectable, inject } from 'inversify';
import { action, makeObservable, observable } from 'mobx';

import UploadHistoryRecordModalViewModel, {
  UploadRecordDataConfig,
  UploadRecordListParamsConfig,
} from './viewModel';
import FileUseCase from '../../../../domain/useCases/fileUseCase';
import {
  ADVERTISEMENT_IDENTIFIER,
  FILE_IDENTIFIER,
  DEFAULT_IDENTIFIER,
} from '../../../../constants/identifiers';
import AdvertisementUseCase from '../../../../domain/useCases/advertisementUseCase';
import { MaterialHistoryRecordEntity } from '../../../../domain/entities/advertisementEntities';
import { CommonPagesGeneric, UploadType } from '../../../../common/config/commonConfig';
import DefaultPageUseCase from '../../../../domain/useCases/defaultPageUseCase';
// import utils from '../../../../utils';

@injectable()
export default class UploadHistoryRecordModalViewModelImpl
  implements UploadHistoryRecordModalViewModel {
  // advertisementUseCase
  @inject(ADVERTISEMENT_IDENTIFIER.ADVERTISEMENT_USE_CASE)
  private AdvertisementUseCase!: AdvertisementUseCase;

  // fileUseCase
  @inject(FILE_IDENTIFIER.FILE_USE_CASE)
  private fileUseCase!: FileUseCase;

  // defaultPageUseCase
  @inject(DEFAULT_IDENTIFIER.DEFAULT_PAGE_LIST_USE_CASE)
  private defaultPageUseCase!: DefaultPageUseCase;

  public imageSrc: string;
  public videoSrc: string;
  public currentMaterialData: MaterialHistoryRecordEntity;
  public uploadRecordListData: CommonPagesGeneric<MaterialHistoryRecordEntity>;
  public uploadRecordListDataSource: UploadRecordDataConfig[];
  // 查看设备弹窗状态
  public uploadHistoryRecoedModalVisible: boolean;
  public uploadRecordListParams: UploadRecordListParamsConfig;
  public type: string;
  public indexData: number;
  public batchIndexData: number | undefined;
  public platformType?: string;

  public constructor() {
    this.uploadHistoryRecoedModalVisible = false;
    this.uploadRecordListData = {
      content: [],
    };
    this.uploadRecordListDataSource = [];
    this.uploadRecordListParams = {
      page: 0,
      size: 5,
    };
    this.imageSrc = '';
    this.videoSrc = '';
    this.currentMaterialData = {};
    this.type = '';
    this.indexData = 0;
    this.batchIndexData = 99;
    this.platformType = undefined;

    makeObservable(this, {
      type: observable,
      indexData: observable,
      batchIndexData: observable,
      uploadRecordListData: observable,
      uploadRecordListDataSource: observable,
      uploadHistoryRecoedModalVisible: observable,
      uploadRecordListParams: observable,
      imageSrc: observable,
      videoSrc: observable,
      currentMaterialData: observable,
      platformType: observable,
      setUploadHistoryRecordModalVisible: action,
      getUploadRecordListData: action,
      pageChange: action,
      delMaterial: action,
      getMaterialUrl: action,
      closeModal: action,
      radioChange: action,
      // onConfirm: action,
    });
  }

  //设置标签model显示隐藏以及新增还是修改详情
  public setUploadHistoryRecordModalVisible = (type?: string, index?: number, i?: number): void => {
    this.type = type || '';
    this.indexData = index || 0;
    if (i || i === 0) {
      this.batchIndexData = i || 0;
    } else {
      this.batchIndexData = i || undefined;
    }
    // this.batchIndexData = i || 99;
    this.uploadHistoryRecoedModalVisible = !this.uploadHistoryRecoedModalVisible;
  };

  // 关闭弹窗
  public closeModal = (): void => {
    this.uploadHistoryRecoedModalVisible = !this.uploadHistoryRecoedModalVisible;
    // 初始化数据
    this.uploadRecordListData = {
      content: [],
    };
    this.uploadRecordListDataSource = [];
    this.uploadRecordListParams = {
      page: 0,
      size: 5,
    };
    this.imageSrc = '';
    this.videoSrc = '';
    this.currentMaterialData = {};
    this.platformType = undefined;
  };

  // 获取列表数据
  public getUploadRecordListData = async (type?: string): Promise<void> => {
    if (type) {
      this.platformType = type;
    }
    const { page, size } = this.uploadRecordListParams;
    if (this.platformType === 'platform') {
      const data = await this.defaultPageUseCase.getMaterialHistoryRecord(page, size);
      this.uploadRecordListData = cloneDeep(data);
      const listData: UploadRecordDataConfig[] = [];
      this.uploadRecordListData.content.forEach((item, index) => {
        listData.push({
          ...item,
          key: index + 1,
        });
      });
      this.uploadRecordListDataSource = listData;
    } else {
      const data = await this.AdvertisementUseCase.getMaterialHistoryRecord(page, size);
      this.uploadRecordListData = cloneDeep(data);
      const listData: UploadRecordDataConfig[] = [];
      this.uploadRecordListData.content.forEach((item, index) => {
        listData.push({
          ...item,
          key: index + 1,
        });
      });
      this.uploadRecordListDataSource = listData;
    }
  };

  // 分页切换页码
  public pageChange = (page: number, pageSize?: number): void => {
    this.uploadRecordListParams.page = page - 1;
    if (pageSize) {
      this.uploadRecordListParams.size = pageSize;
    }
    this.getUploadRecordListData();
  };

  // 删除素材
  public delMaterial = async (id: number): Promise<void> => {
    if (this.platformType === 'platform') {
      await this.defaultPageUseCase.delMaterial(id);
    } else {
      await this.AdvertisementUseCase.delMaterial(id);
    }
    this.uploadRecordListParams.page = 0;
    this.uploadRecordListParams.size = 5;
  };

  // 获取素材url
  public getMaterialUrl = async (record: UploadRecordDataConfig): Promise<void> => {
    if (record.type === UploadType.JPG || record.type === UploadType.PNG) {
      const imageObj = await this.fileUseCase.getPreviewUrl(record.fileKey || '');
      this.imageSrc = imageObj.fileTokenUrl || '';
    }
    if (record.type === UploadType.MP4) {
      const videoObj = await this.fileUseCase.getPreviewUrl(record.fileKey || '');
      this.videoSrc = videoObj.fileTokenUrl || '';
    }
  };

  // radio事件
  public radioChange = (
    selectedRowKeys: React.Key[],
    selectedRows: UploadRecordDataConfig[],
  ): void => {
    [this.currentMaterialData] = selectedRows;
  };
}
