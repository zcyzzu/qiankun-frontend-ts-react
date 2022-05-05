/*
 * @Author: tongyuqiang
 * @Date: 2022-03-29 15:56:23
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-19 14:43:09
 */
import React from 'react';
import { Modal, Button, InputNumber, Row, Col } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { observer } from 'mobx-react';
import style from './style.less';

import DI from '../../../../inversify.config';
import { CONTENT_MANAGEMENT_IDENTIFIER } from '../../../../constants/identifiers';
import CreateTemplateViewModel from './ViewModel';
import closeIcon from '../../../../assets/images/close_icon.svg';
import editImgIcon from '../../../../assets/images/edit_image_Icon.svg';
import lockIcon from '../../../../assets/images/lock_icon.svg';
import unlockIcon from '../../../../assets/images/unlock_icon.svg';

interface ComponentObj {
  key: number;
  width: number;
  height: number;
  scale: string;
}
interface CreateModalProps {}
interface CreateModalState {
  list: ComponentObj[];
  Icon: string;
  tabKey: number;
}
@observer
export default class CreateTemplate extends React.Component<CreateModalProps, CreateModalState> {
  private createViewModel = DI.DIContainer.get<CreateTemplateViewModel>(
    CONTENT_MANAGEMENT_IDENTIFIER.CREATE_TEMPLATE_VIEW_MODEL,
  );

  public constructor(props: CreateModalProps) {
    super(props);
    this.state = {
      list: [
        { key: 1, width: 1920, height: 1080, scale: '16:9' },
        { key: 2, width: 1080, height: 1920, scale: '9:16' },
        { key: 3, width: 800, height: 600, scale: '3:4' },
      ],
      Icon: lockIcon,
      tabKey: 1,
    };
  }
  private formRef = React.createRef<FormInstance>();

  public templateTab = (item: ComponentObj): void => {
    const { changeValue } = this.createViewModel;
    this.setState({ tabKey: item.key, Icon: lockIcon });
    changeValue(item.width, item.height);
  };
  public onWidthFocus = (): void => {
    const { Icon } = this.state;
    const { onWidthLock } = this.createViewModel;
    this.setState({ tabKey: 0 });
    if (Icon === lockIcon) {
      onWidthLock();
    }
  };
  public onHeightFocus = (): void => {
    const { Icon } = this.state;
    const { onHeightLock } = this.createViewModel;
    this.setState({ tabKey: 0 });
    if (Icon === lockIcon) {
      onHeightLock();
    }
  };
  // 锁定宽高比
  public onLock = (): void => {
    const { Icon } = this.state;
    // const { onLock } = this.createViewModel;
    if (Icon === lockIcon) {
      this.setState({ Icon: unlockIcon, tabKey: 0 });
      // 自动调整比例
    } else {
      this.setState({ Icon: lockIcon });
    }
  };

  public render(): JSX.Element {
    const {
      setIsVisible,
      visible,
      width,
      height,
      onWidthChange,
      onHeightChange,
      openEditor,
    } = this.createViewModel;
    const { list, Icon, tabKey } = this.state;
    return (
      <Modal
        closable={false}
        footer={null}
        wrapClassName={style.exportModalContainer}
        destroyOnClose
        visible={visible}
      >
        <div className={style.modalContent}>
          <div className={style.modalHeader}>
            常用尺寸
            <Button type="text" onClick={(): void => setIsVisible(false)}>
              <img src={closeIcon} alt="" />
            </Button>
          </div>
          <div className={style.materialWrapper}>
            {list.map((item: ComponentObj) => (
              <div
                className={`${style.itemWrapper} ${tabKey === item.key ? style.active : ''}`}
                key={item.key}
                onClick={(): void => this.templateTab(item)}
              >
                <img src={editImgIcon} alt="" />
                <span>
                  {item.width}*{item.height}px
                </span>
                <span>{item.scale}</span>
              </div>
            ))}
          </div>
          <div className={style.modalHeader}>自定义尺寸</div>
          <Row className={style.sizeWrapper}>
            <Col span={4}>
              <InputNumber
                addonAfter="宽"
                className={style.inputWrapper}
                onChange={(e): void => onWidthChange(e)}
                onFocus={(): void => this.onWidthFocus()}
                onBlur={(): void => this.onWidthFocus()}
                controls={false}
                precision={0}
                value={width}
              />
            </Col>
            <Col span={2}>
              <div className={style.lock} onClick={(): void => this.onLock()}>
                <img src={Icon} alt="" />
              </div>
            </Col>
            <Col span={4}>
              <InputNumber
                addonAfter="高"
                className={style.inputWrapper}
                onChange={(e): void => onHeightChange(e)}
                onFocus={(): void => this.onHeightFocus()}
                onBlur={(): void => this.onHeightFocus()}
                controls={false}
                precision={0}
                value={height}
              />
            </Col>
            <Col span={3}>
              <span style={{ marginLeft: '10px', lineHeight: '31px' }}>像素(PX)</span>
            </Col>
          </Row>
          <div className={style.bottomButton}>
            <Button type="primary" onClick={(): void => openEditor()}>
              创建
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
