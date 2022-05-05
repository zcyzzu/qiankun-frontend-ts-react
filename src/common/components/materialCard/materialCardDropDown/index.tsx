/*
 * @Author: liyou
 * @Date: 2022-04-20 10:40:31
 * @LastEditors: mayajing
 * @LastEditTime: 2022-04-20 17:21:43
 */

import React, { FC } from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import style from './style.less';
import { ContentMangementType } from '../materialType';
import moreIcon from '../../../../assets/images/more_icon.svg';
import delIcon from '../../../../assets/images/del_info_icon.svg';
import createCopyIcon from '../../../../assets/images/create_copy_icon.svg';
import downloadIcon from '../../../../assets/images/download_icon.svg';
import editIcon from '../../../../assets/images/edit_icon.svg';

interface MaterialCardDropDownProps {
  // 模板/素材(编辑/下载)
  type: ContentMangementType;
  // 编辑点击事件
  onEdit?(): void;
  // 下载点击事件
  onDown?(): void;
  // 创建副本
  onCopy?(): void;
  // 删除
  onDelete?(): void;
  // 是否可以编辑
  edit?: boolean;
  // 是否可以创建副本
  creatCopy?: boolean;
  // 是否可以下载
  download?: boolean;
  // 是否可以删除
  deleteItem?: boolean;
}

const MaterialCardDropDown: FC<MaterialCardDropDownProps> = ({
  type,
  edit,
  creatCopy,
  download,
  deleteItem,
  onEdit,
  onDown,
  onCopy,
  onDelete,
}: MaterialCardDropDownProps) => {
  return (
    <Dropdown
      overlay={
        <Menu>
          {type === ContentMangementType.TEMPLATE && (
            <>
              {edit && (
                <Menu.Item
                  key="edit"
                  style={{ color: '#666' }}
                  icon={<img src={editIcon} alt="" />}
                  onClick={(e): void => {
                    e.domEvent.stopPropagation();
                    if (onEdit) {
                      onEdit();
                    }
                  }}
                >
                  编辑
                </Menu.Item>
              )}
              {creatCopy && (
                <Menu.Item
                  key="copy"
                  style={{ color: '#666' }}
                  icon={<img src={createCopyIcon} alt="" />}
                  onClick={(e): void => {
                    e.domEvent.stopPropagation();
                    if (onCopy) {
                      onCopy();
                    }
                  }}
                >
                  创建副本
                </Menu.Item>
              )}
            </>
          )}
          {type === ContentMangementType.MATERIAL && (
            <>
              {download && (
                <Menu.Item
                  key="download"
                  style={{ color: '#666' }}
                  icon={<img src={downloadIcon} alt="" />}
                  onClick={(e): void => {
                    e.domEvent.stopPropagation();
                    if (onDown) {
                      onDown();
                    }
                  }}
                >
                  下载
                </Menu.Item>
              )}
            </>
          )}
          {deleteItem && (
            <Menu.Item
              key="delete"
              style={{ color: '#F5222D' }}
              icon={<img src={delIcon} alt="" />}
              onClick={(e): void => {
                e.domEvent.stopPropagation();
                Modal.confirm({
                  title: '提示',
                  maskClosable: true,
                  content: `删除该${
                    type === ContentMangementType.MATERIAL ? '素材' : '模板'
                  }后将无法重新找回，请谨慎操作！`,
                  icon: undefined,
                  onOk() {
                    if (onDelete) {
                      onDelete();
                    }
                  },
                });
              }}
            >
              删除
            </Menu.Item>
          )}
        </Menu>
      }
      className={style.dropdown}
      placement="bottomRight"
      arrow
      getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement || triggerNode}
    >
      <div
        onClick={(e): void => {
          e.stopPropagation();
        }}
      >
        <img src={moreIcon} alt="" />
      </div>
    </Dropdown>
  );
};

export default MaterialCardDropDown;
