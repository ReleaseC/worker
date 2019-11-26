const mongoose = require('mongoose');
let config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);
const db = mongoose.createConnection(config.mongodb);

/**
 * 新的site_settings集合，整合所有类型的site setting
 */
export const siteSettingsSchema = new mongoose.Schema({
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
// export site settings model
export const siteSettingModel = db.model('site_settings', siteSettingsSchema);

// BulletTime site sitting
export const siteSettingSchema = new mongoose.Schema({
    activity_id: String,
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
export const dbSiteSetting = db.model('bt_site_setting', siteSettingSchema);

// Get site devices status to monitor on Cloud/admin
export const deviceStatusSchema = new mongoose.Schema({
    siteId: String,
    status: Object,
    updateTime: String,
    photoTime: String
});
export const deviceStatus = db.model('device_status', deviceStatusSchema);

// Share site setting 
export const shareSiteSettingSchema = new mongoose.Schema({
    deviceId: String,
    siteId: String
});
export const shareDbSiteSetting = db.model('share_site_setting', shareSiteSettingSchema);

// Soccer site setting (Obsolete)
export const soccorSiteSettingSchema = new mongoose.Schema({
    groupId: String,
    groupName: String,
    activity_id: String,
    siteId: String,
    siteType: String,
    light: Number,
    siteName: String,
    region: String,
    deviceConfig: Array,
    group: Array,
    cameraSetting: Array
});
export const soccorDbSiteSetting = db.model('soccor_site_setting', soccorSiteSettingSchema);

// Soccer site setting (Obsolete)
export const goalEventSchema = new mongoose.Schema({
    siteId: String,
    taskId: String,
    timestamp: String,
    del: false
});
export const goalEvent = db.model('goal_event', goalEventSchema);

//order相关的数据库
export const orderSchema = new mongoose.Schema({
    openid: String,
    order_id: String,
    uid: String,
    is_pay: Number,
    seller: String,
    total_fee: String,
    templates: Object,
    siteId: String,
    time: String,
    taskId: String,
    activity_id: String
});
export const order = db.model('orders', orderSchema);

//模板的数据库
export const templateSchema = new mongoose.Schema({
    template: Object
});
export const template = db.model('tempaltes', templateSchema);

//微信用户的数据库
export const WechatSchema = new mongoose.Schema({
    wechat: Object, //用户微信access_token信息
    info: Object, //用户微信基本信息
    source: String, //来源,页面siteId
    time: String, //进入数据库的时间
    videoNames: Object, //用户子弹时间视频名称
    gameInfo: Object, //路跑用户的信息
    wechatapp: Object,
    likes: Object, //点赞量,
    isTicket: Boolean
});
export const wechatdb = db.model('wechatusers', WechatSchema);


// Activitys
// Create activity, update activity, update activity param, ...
export const ActivitySchema = new mongoose.Schema({
    user_id: String,
    activity_id: String,
    company_id: String,
    project_id: String,
    activity_name: String,
    banner: String,
    group: String,
    address: String,
    mark: String,
    lon: String,
    lat: String,
    create_time: String,
    settings: Object,
    account: Object,
    type: String,
    visits: Array,
    flows: Array,
    state: Object
});
export const activitydb = db.model('activitys', ActivitySchema);

export const DatareportSchema = new mongoose.Schema({
    taskId: String,
    activity_id: String,
    visit: Number,
    play: Number,
    download: Number,
    share: Number,
    like: Number
});
export const datareportdb = db.model('datareports', DatareportSchema);

// Tasks 
// Create task, update task, update task param, ...
export const TaskSchema = new mongoose.Schema({
    task: Object,
    state: String,
    workerId: String,
    createdAt: String,
    updatedAt: String,
    msg: String,
    mode: String,
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
export const taskdb = db.model('tasks', TaskSchema);

// Account for cloud/admin
export const AccountSchema = new mongoose.Schema({
    name: String, // v1
    password: String,
    // group: Number, // v1
    // siteId: Object, // v1
    account: String,
    description: String, // v2
    role: {
        admin: [],
        owner: [],
        siteAdmin: []
    }, // v2
    matchSites: Array, // v2
    active: Boolean, //v2
    groups: Array
});
export const accountdb = db.model('accounts', AccountSchema);

export const CameraSetting = new mongoose.Schema({
    type: Object,
    setting: Object,
    commonset: Object
});
export const CameraSettingdb = db.model('camerasettings', CameraSetting);

export const accountMatchSitesSchema = new mongoose.Schema({
    account: String,
    siteId: String
});
export const accountMatchSites = db.model('account_match_sites', accountMatchSitesSchema);

// (Soccer, Obsolete)
export const apkVersionSchema = new mongoose.Schema({
    siteId: String,
    deviceId: String,
    role: String,
    apkVersion: String
});
export const apkVersionDb = db.model('device_current_apk_version', apkVersionSchema);

// Account match devices (Soccer, Obsolete)
export const accountMatchSig = new mongoose.Schema({
    account: String,
    signature: String
});
export const accMatchSigDb = db.model('account_match_sig', accountMatchSig);

// (Soccer, Obsolete)
export const bindingDeviceTable = new mongoose.Schema({
    siteId: String,
    siteName: String,
    role: String,
    deviceId: String
});
export const bindingDeviceTableDb = db.model('binding_device_table', bindingDeviceTable);

// Basketball annotation site setting 
export const BasketAnnoSiteSettingSchema = new mongoose.Schema({
    siteId: String,
    siteName: String,
    player: Array,
    ffmpegConfig: Object,
    mediaWorker: String
});
export const basketAnnoSiteSettingSchema = db.model('basket_anno_site_setting', BasketAnnoSiteSettingSchema);

export const CommercialTextSchema = new mongoose.Schema({
    comercialTextObj: Object,
});
export const commercialTextDb = db.model('commercial_text', CommercialTextSchema);

export const CommercialVideoSchema = new mongoose.Schema({
    comercialVideoObj: Object,
});
export const commercialVideoDb = db.model('commercial_video', CommercialVideoSchema);

export const CommercialAudioSchema = new mongoose.Schema({
    comercialAudioObj: Object,
});
export const commercialAudioDb = db.model('commercial_audio', CommercialAudioSchema);


export const WeparkSchema = new mongoose.Schema({
    gid: String,
    uid: String,
    fid: String,
    action: String,
    activity_id: String,
    timestamp: String,
    type: String,
    param: Object,
    create_time: String,
});
export const weparkdb = db.model('weparks', WeparkSchema);



