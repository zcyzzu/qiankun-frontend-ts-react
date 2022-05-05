/*
 * @Author: liyou
 * @Date: 2021-10-09 14:44:54
 * @LastEditors: wuhao
 * @LastEditTime: 2022-04-19 11:17:59
 */
const PERMISSIONS_CODES = {
  // 设备管理
  DEVICE_LIST: {
    UPDATE: 'hzero.tmis.system.equipment.manage.list.ps.batch.update',
    BATCH_DELETE: 'hzero.tmis.system.equipment.manage.list.ps.batch.delete',
    RESTART: 'hzero.tmis.system.equipment.manage.list.ps.batch.restart',
    BOOT: 'hzero.tmis.system.equipment.manage.list.ps.batch.boot',
    SHUTDOWN: 'hzero.tmis.system.equipment.manage.list.ps.batch.shutdown',
    SWITCH: 'hzero.tmis.system.equipment.manage.list.ps.timing.switch',
    GROUPING: 'hzero.tmis.system.equipment.manage.list.ps.set.grouping',
    SCREENSHOT: 'hzero.tmis.system.equipment.manage.list.ps.screenshot',
    PATROL: 'hzero.tmis.system.equipment.manage.list.ps.patrol',
    EDIT: 'hzero.tmis.system.equipment.manage.list.ps.edit',
    DELETE: 'hzero.tmis.system.equipment.manage.list.ps.delete',
    SEE: 'hzero.tmis.system.equipment.manage.list.ps.see',
    RASPBERRY_PIE: 'hzero.tmis.system.equipment.manage.list.ps.new.raspberry-pie',
    EXPORT: 'hzero.tmis.system.equipment.manage.list.ps.export',
    RASPBERRY_DEL: 'hzero.tmis.system.equipment.manage.list.ps.batch.delete.raspberry-pie',
    ENABLE: 'hzero.tmis.system.equipment.manage.list.ps.batch.enable',
    DISABLE: 'hzero.tmis.system.equipment.manage.list.ps.batch.disable',
    DOWN_LOG: 'hzero.tmis.system.equipment.manage.list.ps.device.log.download',
    ENABLE_SINGLE: 'hzero.tmis.system.equipment.manage.list.ps.device.one.click.enable',
    DISABLE_SINGLE: 'hzero.tmis.system.equipment.manage.list.ps.device.one.click.disable',
    RESTART_SINGLE: 'hzero.tmis.system.equipment.manage.list.ps.device.one.click.restart',
    SHUTDOWN_SINGLE: 'hzero.tmis.system.equipment.manage.list.ps.device.one.click.shutdown',
    STARTUP_SINGLE: 'hzero.tmis.system.equipment.manage.list.ps.device.one.click.startup',
  },
  STORE_PROJECT: {
    PROJECT_SEE: 'hzero.tmis.system.equipment.manage.project.ps.see',
    PROJECT_NEW: 'hzero.tmis.system.equipment.manage.project.ps.new',
    PROJECT_EDIT: 'hzero.tmis.system.equipment.manage.project.ps.edit',
    PROJECT_DELETE: 'hzero.tmis.system.equipment.manage.project.ps.delete',
    STORE_SEE: 'hzero.tmis.system.equipment.manage.store.ps.see',
    STORE_NEW: 'hzero.tmis.system.equipment.manage.store.ps.new',
    STORE_EDIT: 'hzero.tmis.system.equipment.manage.store.ps.edit',
    STORE_DELETE: 'hzero.tmis.system.equipment.manage.store.ps.delete',
    STORE_DETAILS: 'hzero.tmis.system.equipment.manage.store.ps.detail',
  },
  // 上屏发布
  AD_MANAGEMENT: {
    PUBLISH: 'hzero.tmis.system.screen.release.release.list.ps.publist',
    EDIT: 'hzero.tmis.system.screen.release.release.list.ps.edit',
    DELETE: 'hzero.tmis.system.screen.release.release.list.ps.delete',
    SEE: 'hzero.tmis.system.screen.release.release.list.ps.see',
    DETAILS: 'hzero.tmis.system.screen.release.release.list.ps.approve.details',
    COPY: 'hzero.tmis.system.screen.release.release.list.ps.copy',
  },
  NOTICE: {
    PUBLISH: 'hzero.tmis.system.screen.release.notice.list.ps.publish',
    EDIT: 'hzero.tmis.system.screen.release.notice.list.ps.edit',
    DELETE: 'hzero.tmis.system.screen.release.notice.list.ps.delete',
    SEE: 'hzero.tmis.system.screen.release.notice.list.ps.see',
    DETAILS: 'hzero.tmis.system.screen.release.notice.list.ps.approve.details',
  },
  DEFAULT: {
    NEW: 'hzero.tmis.system.screen.release.default.manage.ps.new',
    EDIT: 'hzero.tmis.system.screen.release.default.manage.ps.edit',
    SEE: 'hzero.tmis.system.screen.release.default.manage.ps.see',
    DELETE: 'hzero.tmis.system.screen.release.default.manage.ps.delete',
  },
  // 播放列表
  AD_LIST: {
    SEE: 'hzero.tmis.system.play.list.advertising.list.ps.see',
    STOP: 'hzero.tmis.system.play.list.advertising.list.ps.stop',
    START: 'hzero.tmis.system.play.list.advertising.list.ps.start',
    DELETE: 'hzero.tmis.system.play.list.advertising.list.ps.delete',
    CONTINUE: 'hzero.tmis.system.play.list.advertising.list.ps.continue',
  },
  NOTICE_LIST: {
    SEE: 'hzero.tmis.system.play.list.notice.list.ps.see',
    STOP: 'hzero.tmis.system.play.list.notice.list.ps.stop',
    DELETE: 'hzero.tmis.system.play.list.notice.list.ps.delete',
    START: 'hzero.tmis.system.play.list.notice.list.ps.start',
  },
  // 审批管理
  AD_APPROVE: {
    SEE: 'hzero.tmis.system.approval.manage.advertising.list.ps.see',
    OPERATION: 'hzero.tmis.system.approval.manage.advertising.list.ps.operation',
  },
  NOTICE_APPROVE: {
    SEE: 'hzero.tmis.system.approval.manage.notice.list.ps.see',
    OPERATION: 'hzero.tmis.system.approval.manage.notice.list.ps.operation',
  },
  SETTING: {
    SEE: 'hzero.tmis.system.approval.manage.approval.setting.ps.see',
    ADD: 'hzero.tmis.system.approval.manage.approval.setting.ps.add',
    EDIT: 'hzero.tmis.system.approval.manage.approval.setting.ps.edit',
    DELETE: 'hzero.tmis.system.approval.manage.approval.setting.ps.delete',
  },
  AD_STATISTICS: {
    AD_TASK: 'hzero.tmis.system.person.overview.advertising.statistics.ps.week.ad.task',
    NOTICE_TASK: 'hzero.tmis.system.person.overview.advertising.statistics.ps.week.notice.task',
    AD_PLAY: 'hzero.tmis.system.person.overview.advertising.statistics.ps.week.ad.play',
    WEEK_AD_PLAY: 'hzero.tmis.system.person.overview.advertising.statistics.ps.last.week.ad.play',
    TODAY_DATA: 'hzero.tmis.system.person.overview.advertising.statistics.ps.today.data',
    HISTORY_DATA: 'hzero.tmis.system.person.overview.advertising.statistics.ps.history.data',
    EXPORT: 'hzero.tmis.system.person.overview.advertising.statistics.ps.play.record.export',
  },
  DEVICE_STATISTICS: {
    OVERVIEW: 'hzero.tmis.system.person.overview.equipment.statistics.ps.data.overview',
    TODAY_DATA: 'hzero.tmis.system.person.overview.equipment.statistics.ps.today.data',
    HISTORY_DATA: 'hzero.tmis.system.person.overview.equipment.statistics.ps.history.data',
    EXPORT: 'hzero.tmis.system.person.overview.equipment.statistics.ps.offline.export',
  },
  TEMPLATE: {
    CREATE: 'hzero.tmis.system.content.manage.template.list.ps.create',
    CREATE_COPOY: 'hzero.tmis.system.content.manage.template.list.ps.create-copy',
    DELETE: 'hzero.tmis.system.content.manage.template.list.ps.delete',
    EDIT: 'hzero.tmis.system.content.manage.template.list.ps.edit',
    RENAME: 'hzero.tmis.system.content.manage.template.list.ps.rename',
  },
  MATERIAL: {
    MADELETE: 'hzero.tmis.system.content.manage.material.list.ps.delete',
    MARENAME: 'hzero.tmis.system.content.manage.material.list.ps.rename',
    DOWNLOAD: 'hzero.tmis.system.content.manage.material.list.ps.download',
    LOOK: 'hzero.tmis.system.content.manage.material.list.ps.look',
    UPLOAD: 'hzero.tmis.system.content.manage.material.list.ps.upload',

  },
};

export default PERMISSIONS_CODES;
