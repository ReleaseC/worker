import { IWorkerCallback } from '../common/worker.interface';
let config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);
const request = require('request');


export class WorkerCallback implements IWorkerCallback {
    socket;
    flag = 0;

    constructor(socket: any) {
        this.socket = socket;
    };

    changeFlag() {
        this.flag = 1;
    }
    setFlag(data){
        this.flag=data;
    }

    onStop(data, msg, logger, basicInfo) {
        console.log(`id: ${data.task.taskId}, end video cut`);
        console.log('----------------------');
        data['msg'] = msg;
        this.flag = 0;
        request({
            url: `${config.apiServer}/task/task_finish`,
            method: "POST",
            json: true,
			body: data
        }, (error, response, body) => {
            if (logger && !error && response.statusCode == 200) {
                logger.info(`video worker finish task`, basicInfo);
                console.log('----------------------');
    
            }
        })
    }

    onAbort(data, msg) {
        console.log('----------------------');
        console.log(`id: ${data.task.taskId} abort !!`);
        data['msg'] = msg;
        this.flag = 0;
        request({
            url: `${config.apiServer}/task/task_abort`,
            method: "POST",
            json: true,
			body: data
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log('----------------------');
                console.log('video worker abort task=' + JSON.stringify(body));
                console.log('----------------------');
    
            }
        })
    }
}
