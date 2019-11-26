export enum SOCKET_EVENT {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    LOGIN = 'login',
    REGISTER = 'register',
    IS_ALIVE = 'is_alive',
    ALLOCATING_TASK = 'allocating_task',
    TASK = 'task',
    STATUS = 'status',
    PROGRESS_STATUS = 'progress_status',
    PREPARE_TO_RECORD = 'prepare_to_record',
    EVENT_CAMERA_STATUS_FROM_EDGE = 'camera_status_from_edge',
    EVENT_CAMERA_STATUS = 'camera_status',
    EVENT_ADJUST_POTHO = "adjust_photo",
    EVENT_ASK_LOCAL_ADJUST_POTHO = "ask_local_adjust_photo",
    EVENT_ADJUST_POTHO_SUCCESS = "adjust_photo_success",
    EVENT_ADJUST_POTHO_SUCCESS_EDGE_ADMIN = "adjust_photo_success_edge_admin",
    EVENT_GET_CAMERA_CONFIG = "get_camera_config",
    EVENT_CAMERA_CONFIG = "camera_config",
    EVENT_GET_CAMERA_CONFIG_ADMIN = "get_camera_config_admin",
    EVENT_SET_CAMERA_CONFIG = "set_camera_config",
    EVENT_EDGESERVER_STATUS = "edgeserver_status",
    EVENT_RESCAN = "re_scan",
    EVENT_RESCAN_YIAGENT = "rescan_YIAgent",
    EVENT_BINDING = 'binding',
    EVENT_BINDING_SUCCESS = 'binding_success',
    EVENT_PUSH_APK_UPDATE_CLOUD = 'push_apk_update_from_cloud',
    EVENT_PUSH_APK_UPDATE_EDGE = 'push_apk_update_to_edge',
    EVENT_UPDATE_SCALE = 'update_scale_from_cloud_admin',
    EVENT_JOIN_SITE = "join_site",
    EVENT_LEAVE_SITE = "leave_site",

    // TODO: add cmd event, Curry
    EVENT_CMD = "cmd",
    EVENT_CMD_REGISTER = "cmd_register",
    EVENT_CMD_UNREGISTER = "cmd_unregister",
};

// EVENT_CMD data里的参数
export enum CMD_ACTION {
    // SET_GUIDE = 'set_guide',
    // GUIDE_RESPONSE = 'guide_response',
    MAKE_SHOOT = 'make_shoot', // 拍摄
    POST_MAKE_SHOOT = 'post_make_shoot', // 拍摄结果
    GET_PREVIEW = 'get_preview',  // 预览
    POST_PREVIEW = 'post_preview', // 预览结果
    SETUP = 'setup',  // 活动设定
    SETUP_RESPONSE = 'setup_response', // 设定结果
    UPDATE_DEVICE_SETTINGS = 'update_device_settings', // 更新活动设定
    UPDATE_DEVICE_STATUS = 'update_device_status', // 更新设备状态
    UPGRADE_RESPONSE = 'upgrade_response', // 升级结果
    SEND_LOCAL_CLOUD = 'send_local_cloud',  // 通知本地FileServer上传视频
    RESTART = 'restart',  // 重启
    UPGRADE = 'upgrade',  // 升级
    TASKCOMPLETE = 'task_complete',  // 升级
}





export enum SOCCER_EVENT {
    SITES_MATCH_EVENT = 'sites_match',
    SITES_UNMATCH_EVENT = 'sites_unmatch',
    SITES_CONFIG_EVENT = 'sites_config',
    GOAL_EVENT = 'goal',
    EVENT_GOAL_SUCCESS_ACK = "event_server_receive_goal_ack",
    EVENT_CAM_GOAL_ACK = "event_cam_receive_goal_ack",
    PREPARE_UPLOAD_EVENT = 'prepare_upload',
    SINGLE_VIDEO_UPLOADED_EVENT = 'single_video_upload',
    EVENT_REMOTE_SHOT_GETDEVICES = "remote_shot_getdevices",
    EVENT_REMOTE_SHOT = "remote_shot",
    EVENT_REMOTE_SHOT_GET_PICS = "remote_shot_get_pics",
    EVENT_HEARTBEAT = "heartbeat",
    EVENT_SOCCER_CMD = "soccer_cmd",
    EVENT_DEVICEOFFLINE = "device_offline",
    EVENT_LOGIN_DENIED = "login_denied"
};

export enum BASKETBALL_EVENT {
    REBOOT_DEVICE_EDGE = "reboot_device_edge",
    REBOOT_DEVICE_CLOUD = "reboot_device_cloud",
    REBOOT_DEVICE_SUCCESS_EDGE = "reboot_device_success_edge",
    REBOOT_DEVICE_SUCCESS_CLOUD = "reboot_device_success_cloud",
    REBOOT_DEVICE_FAIL_EDGE = "reboot_device_fail_edge",
    REBOOT_DEVICE_FAIL_CLOUD = "reboot_device_fail_cloud",
    DEVICE_ISALIVE = "isAlive",
    DEVICE_IMALIVE = "imAlive"
};

export enum MOME_EVENT {
    DEVICE_CONFIG_CHANGE = "device_config_change",
}
;

export enum MEDIA_WORKER_EVENT {
    START_RECORDING = "start_recording",
    STOP_RECORDING = "stop_recording",
    REQUEST_FRAME = "request_frame",
    FRAME_AVAILABLE = "frame_available",
    ANNO_TOOL_GOAL = "annoTool_goal",
    ANNO_TOOL_GOAL_COMPLETE = "annoTool_goal_complete",
    TEST = "test_connection",
    REGISTER_MEDIA_WORKER = "register_media_worker"
}

export enum CUSTOMVIDEO_WORKER_EVENT {
    EVENT_VIDEO_PROCESS = 'video_process',
    EVENT_VIDEO_AVAILABLE = 'video_available',
}

export enum LOCAL_FILE_EVENT {
    SEND_LOCAL_CLOUD = 'send_local_cloud',
}