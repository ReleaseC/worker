export enum CAMERA_DEVICES {
    CAM_NUMBER_OF_DEVICES = "number_of_devices",
    CAM_NUMBER_OF_ADJUST_DEVICES = "number_of_adjust_devices",
    CAM_PREVIEW_PIC = "preview_pic",
    CAM_ADJUST_PREVIEW_PIC = "adjust_preview_pic",
    CAM_VIDEO_CUT_RESULT = 'video_cut_result',
}

export enum SOCKET_EVENTS {
    EVENT_ECHO = "echo",
    EVENT_REGISTER = "register",
    EVENT_PREVIEW = "preview",
    EVENT_ADJUST_PREVIEW_COUNT = "adjust_preview_count",
    EVENT_ADJUST_PREVIEW = "adjust_preview",
    EVENT_IS_CAMERA_FREE = "is_camera_free",
    EVENT_CAMERA_COMMAND = "cameraCommand",
    EVENT_ERROR_COMMAND = 'bad_request',
    EVENT_UCLOUD_UPLOAD = "ucloud_upload",
    EVENT_CAMERA_STATUS = 'camera_status',
    EVENT_UPDATE_STATUS = 'update_status',
    EVENT_TASKS_STATUS = 'tasks_status',
    EVENT_CONNECT_CAMERA = 'connect_camera',
    EVENT_ADJUST_POTHO = "adjust_photo",
    EVENT_ADJUST_POTHO_SUCCESS = "adjust_photo_success",
    EVENT_CAMERA_CONFIG = 'camera_config',
    EVENT_GET_CAMERA_CONFIG = 'get_camera_config',
    EVENT_CAMERA_CONFIG_ADMIN = 'get_camera_config_admin',
    EVENT_SET_CAMERA_CONFIG = 'set_camera_config',
    EVENT_RESCAN = "re_scan"
}