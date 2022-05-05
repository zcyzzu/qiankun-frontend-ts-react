/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/*
 * @Author: tongyuqiang
 * @Date: 2021-11-30 15:14:52
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-21 18:07:53
 */
import React from 'react';
import { observer } from 'mobx-react';
import { Image, Input, InputRef, Button, Row, Col, Tooltip } from 'antd';
import style from './style.less';

import { ContentMangementType } from './materialType';
import utils from '../../../utils/index';
import { MaterialItemEntity } from '../../../domain/entities/materialEntities';
import checkboxIcon from '../../../assets/images/checkbox_icon.svg';
import editTitleIcon from '../../../assets/images/edit_title_icon.svg';
import checkboxCheckedIcon from '../../../assets/images/checkbox_checked_icon.svg';
import errorImage from '../../../assets/images/material_load_error.svg';
import MaterialCardDropDown from './materialCardDropDown';

interface TemplateAndMaterialProps {
  // 传入组件根标签的classname
  className?: string;
  // width
  width?: string;
  // // height
  // height?: string;
  // 封面地址
  sourceSrc?: string;
  // 标题
  title?: string;
  // 模板/素材(编辑/下载)
  type: ContentMangementType;
  // 模板/素材类型
  materialtype?: string;
  // 是否被选中
  isChecked?: boolean;
  // 是否显示所有复选框
  isShowAllCheckbox?: boolean;
  // 编辑点击事件
  onEdit?(): void;
  // 下载点击事件
  onDown?(): void;
  // 复选框点击事件
  onCheckbox?(): void;
  // 创建副本
  onCopy?(): void;
  // 删除
  onDelete?(): void;
  // 重命名确认
  onRenameConfirm?(title?: string): void;
  // 点击图片组件事件
  onClick?(item?: MaterialItemEntity): void;
  // 图片是否加载完毕
  imageComplete?(): void;

  // 是否支持查看详情
  detail?: boolean;
  // 是否可以重命名
  rename?: boolean;
  // 是否可以编辑
  edit?: boolean;
  // 是否可以创建副本
  creatCopy?: boolean;
  // 是否可以下载
  download?: boolean;
  // 是否可以删除
  deleteItem?: boolean;
}

interface TemplateAndMaterialState {
  materialSrc: string;
  isHover: boolean;
  isHoverTitle: boolean;
  isRename: boolean;
  nameValue: string;
}

@observer
export default class TemplateAndMaterial extends React.Component<
  TemplateAndMaterialProps,
  TemplateAndMaterialState
> {
  private inputRef = React.createRef<InputRef>();

  public constructor(props: TemplateAndMaterialProps) {
    super(props);
    this.state = {
      materialSrc: props.sourceSrc || errorImage,
      isHover: false,
      isRename: false,
      isHoverTitle: false,
      nameValue: '',
    };
  }

  public render(): JSX.Element {
    const {
      className,
      width,
      title,
      type,
      materialtype,
      onRenameConfirm,
      onClick,
      imageComplete,
      detail,
      rename,
      onCheckbox,
      onCopy,
      onDelete,
      onDown,
      onEdit,
      edit,
      creatCopy,
      download,
      deleteItem,
      isShowAllCheckbox,
      isChecked,
    } = this.props;
    const { isHover, isRename, isHoverTitle, materialSrc } = this.state;

    return (
      <div className={`${style.root} ${className}`}>
        <div
          className={`${style.templateAndMaterialContainer}`}
          style={{ width: `${width}px` }}
          onMouseOver={(): void => {
            this.setState({
              isHover: true,
            });
          }}
          onMouseLeave={(): void => {
            this.setState({
              isHover: false,
            });
          }}
          onClick={(): void => {
            if (onClick && detail) {
              onClick();
            }
          }}
        >
          <Image
            className={style.img}
            src={materialSrc}
            preview={false}
            onLoad={(): void => {
              imageComplete && imageComplete();
            }}
            onError={(): void => {
              this.setState({ materialSrc: errorImage });
            }}
          />
          {(isShowAllCheckbox || isHover) && (
            <div
              className={style.checkboxIcon}
              onClick={(event): void => {
                event.stopPropagation();
                if (onCheckbox) {
                  onCheckbox();
                }
              }}
            >
              <img src={isChecked ? checkboxCheckedIcon : checkboxIcon} alt="" />
            </div>
          )}

          {type === ContentMangementType.MATERIAL && (
            <div className={style.materialType}>{materialtype}</div>
          )}
          <MaterialCardDropDown
            onCopy={onCopy}
            onDelete={onDelete}
            onDown={onDown}
            onEdit={onEdit}
            type={type}
            edit={edit}
            creatCopy={creatCopy}
            download={download}
            deleteItem={deleteItem}
          />
          {isHover && (
            <>
              {/* <div className={style.checkIcon}>
                <img src={checkIcon} alt="" />
              </div> */}
              <div className={`${style.mask} ${style.opacity}`} />
            </>
          )}
        </div>
        <div className={style.title}>
          {!isRename && (
            <div
              onMouseOver={(): void => {
                this.setState({
                  isHoverTitle: true,
                });
              }}
              onMouseLeave={(): void => {
                this.setState({
                  isHoverTitle: false,
                });
              }}
            >
              <Tooltip placement="top" title={title}>
                {title}
              </Tooltip>
              {isHoverTitle && rename && (
                <span
                  onClick={(): void => {
                    this.setState(
                      {
                        isRename: true,
                      },
                      () => {
                        this.inputRef.current?.focus({
                          cursor: 'end',
                        });
                      },
                    );
                  }}
                >
                  <img src={editTitleIcon} alt="" />
                </span>
              )}
            </div>
          )}
          {isRename && (
            <Row justify="space-between" align="middle">
              <Col span={20}>
                <Input
                  placeholder="请输入"
                  defaultValue={title}
                  bordered={false}
                  style={{ height: '24px' }}
                  ref={this.inputRef}
                  onBlur={(): void => {
                    this.setState({
                      isRename: false,
                      isHoverTitle: false,
                    });
                  }}
                  onChange={(e): void => {
                    this.setState({
                      nameValue: e.target.value,
                    });
                  }}
                />
              </Col>
              <Col span={4} className={style.btn}>
                <Button
                  type="primary"
                  size="small"
                  onMouseDown={(event): void => {
                    if (event) {
                      event.preventDefault();
                    }
                    if (onRenameConfirm) {
                      const { nameValue } = this.state;
                      if (!nameValue) {
                        utils.globalMessge({
                          content: `请输入${
                            type === ContentMangementType.TEMPLATE ? '模板' : '素材'
                          }名称!`,
                          type: 'error',
                        });
                        return;
                      }
                      if (nameValue.split('.')[0].length > 30) {
                        utils.globalMessge({
                          content: '请设置30个字符内的名称!',
                          type: 'error',
                        });
                        return;
                      }
                      if (nameValue === title) {
                        utils.globalMessge({
                          content: `请输入新的${
                            type === ContentMangementType.TEMPLATE ? '模板' : '素材'
                          }名称!`,
                          type: 'error',
                        });
                        return;
                      }
                      onRenameConfirm(nameValue);
                      this.setState({
                        isRename: false,
                      });
                    }
                  }}
                >
                  确定
                </Button>
              </Col>
            </Row>
          )}
        </div>
      </div>
    );
  }
}
