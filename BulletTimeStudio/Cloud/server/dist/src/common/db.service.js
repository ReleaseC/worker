"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
let config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);
const db = mongoose.createConnection(config.mongodb);
exports.siteSettingsSchema = new mongoose.Schema({
    siteId: String,
    siteName: String,
    siteType: String,
    siteDescription: String,
    source: {
        provider: {
            name: String
        }
    },
    prefix: String,
    groups: Array,
    param: {
        mask: Object,
        loop: String,
        templatesFront: Array,
        templateBack: Array
    },
    output: {
        path: String,
        format: Object
    },
    diviceConfig: {
        camera: Array,
        spareCamera: Array
    },
    paymentConfig: Object
});
exports.siteSettingModel = db.model('site_settings', exports.siteSettingsSchema);
exports.siteSettingSchema = new mongoose.Schema({
    siteId: String,
    name: String,
    type: String,
    param: Object,
    source: Object,
    output: Object,
    workerId: String,
    accessToken: String,
    expireTime: String,
    template: Object,
    deviceConfig: Object,
    sparedeviceConfig: Object,
    paymentConfig: Object,
    group: Array
});
exports.dbSiteSetting = db.model('bt_site_setting', exports.siteSettingSchema);
exports.deviceStatusSchema = new mongoose.Schema({
    siteId: String,
    status: Object,
    updateTime: String,
    photoTime: String
});
exports.deviceStatus = db.model('device_status', exports.deviceStatusSchema);
exports.shareSiteSettingSchema = new mongoose.Schema({
    deviceId: String,
    siteId: String
});
exports.shareDbSiteSetting = db.model('share_site_setting', exports.shareSiteSettingSchema);
exports.soccorSiteSettingSchema = new mongoose.Schema({
    groupId: String,
    groupName: String,
    activity_id: String,
    siteId: String,
    siteType: String,
    siteName: String,
    region: String,
    deviceConfig: Array,
    group: Array,
    cameraSetting: Array
});
exports.soccorDbSiteSetting = db.model('soccor_site_setting', exports.soccorSiteSettingSchema);
exports.goalEventSchema = new mongoose.Schema({
    siteId: String,
    taskId: String,
    timestamp: String,
    del: false
});
exports.goalEvent = db.model('goal_event', exports.goalEventSchema);
exports.orderSchema = new mongoose.Schema({
    openid: String,
    order_id: String,
    is_pay: Number,
    total_fee: String,
    templates: Object,
    siteId: String,
    time: String,
    taskId: String
});
exports.order = db.model('orders', exports.orderSchema);
exports.templateSchema = new mongoose.Schema({
    template: Object
});
exports.template = db.model('tempaltes', exports.templateSchema);
exports.WechatSchema = new mongoose.Schema({
    wechat: Object,
    info: Object,
    source: String,
    time: String,
    videoNames: Object,
    gameInfo: Object,
    wechatapp: Object,
    likes: Object,
    isTicket: Boolean
});
exports.wechatdb = db.model('wechatusers', exports.WechatSchema);
exports.ActivitySchema = new mongoose.Schema({
    user_id: String,
    activity_id: String,
    activity_name: String,
    banner: String,
    group: String,
    address: String,
    mark: String,
    create_time: String,
    visits: Array
});
exports.activitydb = db.model('activitys', exports.ActivitySchema);
exports.DatareportSchema = new mongoose.Schema({
    taskId: String,
    visit: Number,
    play: Number,
    download: Number,
    share: Number,
    like: Number
});
exports.datareportdb = db.model('datareports', exports.DatareportSchema);
exports.TaskSchema = new mongoose.Schema({
    task: Object,
    state: String,
    workerId: String,
    createdAt: String,
    updatedAt: String,
    msg: String,
    group: Array,
    likes: Array,
    collects: Array,
    visits: Array,
    activity_id: String,
    user_id: String,
    activity_name: String,
    triggerBy: String,
    del: String
});
exports.taskdb = db.model('tasks', exports.TaskSchema);
exports.AccountSchema = new mongoose.Schema({
    name: String,
    password: String,
    account: String,
    description: String,
    role: {
        admin: [],
        owner: [],
        siteAdmin: []
    },
    matchSites: Array,
    active: Boolean,
    groups: Array
});
exports.accountdb = db.model('accounts', exports.AccountSchema);
exports.CameraSetting = new mongoose.Schema({
    type: Object,
    setting: Object,
    commonset: Object
});
exports.CameraSettingdb = db.model('camerasettings', exports.CameraSetting);
exports.accountMatchSitesSchema = new mongoose.Schema({
    account: String,
    siteId: String
});
exports.accountMatchSites = db.model('account_match_sites', exports.accountMatchSitesSchema);
exports.apkVersionSchema = new mongoose.Schema({
    siteId: String,
    deviceId: String,
    role: String,
    apkVersion: String
});
exports.apkVersionDb = db.model('device_current_apk_version', exports.apkVersionSchema);
exports.accountMatchSig = new mongoose.Schema({
    account: String,
    signature: String
});
exports.accMatchSigDb = db.model('account_match_sig', exports.accountMatchSig);
exports.bindingDeviceTable = new mongoose.Schema({
    siteId: String,
    siteName: String,
    role: String,
    deviceId: String
});
exports.bindingDeviceTableDb = db.model('binding_device_table', exports.bindingDeviceTable);
exports.BasketAnnoSiteSettingSchema = new mongoose.Schema({
    siteId: String,
    siteName: String,
    player: Array,
    ffmpegConfig: Object,
    mediaWorker: String
});
exports.basketAnnoSiteSettingSchema = db.model('basket_anno_site_setting', exports.BasketAnnoSiteSettingSchema);
//# sourceMappingURL=db.service.js.map