import { Component } from '@nestjs/common';
import { IWorkerCallback, IEngine } from '../common/worker.interface';

@Component()
export class RifleService implements IEngine {
    async cut_video(data, cb: IWorkerCallback) {
        const task = data.task;
        console.log('----------------------');
        if (cb) {
            cb.onStop(data, `finish ${task.type} ${task.taskId}`, null, null);
        }
    }

}
