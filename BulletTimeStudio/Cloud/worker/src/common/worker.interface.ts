export enum TYPE {
    TYPE_BT = 'BT-1',
    TYPE_RUN = 'RUN',
    TYPE_RIFLE = 'RIFLE-1',
    TYPE_SOCCER = 'soccer',
    TYPE_CUSTOMVIDEO = 'customVideo',
    TYPE_1 ='moment',
    TYPE_BASKETBALL='basketball',
    TYPE_MULTICAM='multicam',
    TYPE_COMMON='common'
}

export enum WORKER_KEY {
    STATUS = 'status',
    ID = 'worker_id'
};

export enum TASK_KEY {
    STATUS = 'status',
    ID = 'task_id'
};

export enum TASK_STATUS {
    START = '0',
    END = '2',
    PROGRESS = '1',
    ERROR = '-1'
};

export enum SOCKET_EVENT {
    CONNECT = 'connect',
    REGISTER = 'register',
    IS_ALIVE = 'is_alive',
    ALLOCATING_TASK = 'allocating_task',
    TASK = 'task',
    STATUS = 'status',
    PROGRESS_STATUS = 'progress_status'
};


export interface IWorker {
    kind: TYPE;
}

export interface IEngine {
    cut_video(data: any, cb: IWorkerCallback, logger);
}

export interface IWorkerCallback {
    changeFlag();
    setFlag(data);
    onStop(id: string, msg: string, logger, basicInfo);
    onAbort(id: string, msg: string);
}

export interface IEngineFactory {
    createFactory(type: string);
}

export enum CUSTOMVIDEO_WORKER_EVENT {
    EVENT_VIDEO_PROCESS = 'video_process',
    EVENT_VIDEO_AVAILABLE = 'video_available',
}
