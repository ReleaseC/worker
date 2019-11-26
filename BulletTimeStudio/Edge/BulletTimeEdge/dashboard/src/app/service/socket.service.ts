export enum CAMERA_DEVICES {
    CAM_NUMBER_OF_DEVICES = 'number_of_devices',
    CAM_NUMBER_OF_ADJUST_DEVICES = 'number_of_adjust_devices',
    CAM_PREVIEW_PIC = 'preview_pic',
    CAM_ADJUST_PREVIEW_PIC = 'adjust_preview_pic',
}

export enum SOCKET_EVENTS {
    EVENT_ECHO = 'echo',
    EVENT_REGISTER = 'register',
    EVENT_PREVIEW = 'preview',
    EVENT_CAMERA_COMMAND = 'cameraCommand',
    EVENT_ADJUST_PREVIEW_COUNT = 'adjust_preview_count',
    EVENT_ADJUST_PREVIEW = 'adjust_preview',
    EVENT_UCLOUD_UPLOAD = 'ucloud_upload',
}

export enum CAMERA_COMMAND {
    KEY_COMMAND = 'command',
    KEY_RECORD_ID = 'recordId',
    KEY_DURATION = 'duration',
    KEY_DEVICE_ID = 'deviceId',
    RECORD_START = 'recordStart',
    SHOOT_START = 'countdown',
    RECORD_STOP = 'recordStop'
}
