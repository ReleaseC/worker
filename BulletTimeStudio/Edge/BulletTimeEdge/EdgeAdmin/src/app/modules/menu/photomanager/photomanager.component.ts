import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { SocketService } from '../../../shared/socket.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
    selector: 'app-photomanager',
    templateUrl: './photomanager.component.html',
    styleUrls: ['./photomanager.component.css']
})
export class PhotoManagerComponent implements OnInit {
   
    // @Input() data:string;
    constructor( private http: HttpClient ) {}
    server = environment.apiServer;
    tasklist: any;
    taskheader: any;
    time: string;
    site: any;
    msg: string;
    taskNumber:number=0;
    videoNumber:number=0;
    tasksuccesslist:string[] = [];
    month:any;
    day:any;
    siteid_id:any;

   ngOnInit() {
        this.siteid_id = localStorage.getItem('select_siteId');
        console.log(this.siteid_id)
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            this.month = "0" + month;
        }else{
            this.month =month;
        }
        if (strDate >= 0 && strDate <= 9) {
            this.day = "0" + strDate;
        }else{
            this.day =strDate;
        }
        this.time=year+'-'+this.month+'-'+this.day;
        // this.time = typeof this.time !== 'undefined' ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
        console.log(this.time)
        console.log(this.server);
        // this.taskheader = ['taskId', 'userId', 'createTime', 'updateTime', 'state', 'msg', 'url', ''];
        this.taskheader = [ 'NickName','User ID', '拍照时间','预计完成时间', '预警'];
    }
    async getTasklist() {
        this.site='0012'
        this.msg = '';
        // tslint:disable-next-line:no-console
        this.time = typeof this.time !== 'undefined' ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
        this.site = typeof this.site !== 'undefined' ? this.site : '0009';
        const url = `${this.server}task/task_list_get/?time=${this.time}&siteId=${this.site}`;
        const response = await this.http.get(url).toPromise();
        // tslint:disable-next-line:no-console
        console.log(response);
        this.taskNumber=Object.keys(response).length;
        if (Object.keys(response).length === 0) {
            this.msg = 'no matched task';
            this.tasklist = [];
        } else {
            this.tasklist = response;
            // const r1=JSON.parse(JSON.stringify(data));
            this.tasksuccesslist.splice(0,this.tasksuccesslist.length);
            for(let i=0;i<=this.tasklist.length-1;i++){
                // var d=new Date(this.tasklist[i].createdAt)
                // this.tasklist[i].finishtime=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+(d.getMinutes()+(i+1)*3)+':'+d.getSeconds();
                this.tasklist[i].finishtime=(i+1)*2+'分钟';
                if(this.tasklist[i].state==='complete'){
                    this.tasksuccesslist.push(this.tasklist[i])
                }
            }
            // console.log(this.tasklist[1].createdAt)
            // console.log(typeof this.tasklist[1].createdAt)
            // console.log(d.getMonth())
            // console.log(typeof d)
            // console.log(this.taskfaillist.length)
            this.videoNumber=this.tasksuccesslist.length;
        }
        console.log(this.tasklist.length)
    }

    async reDoTask(task) {
        const url = `${this.server}task/task_update`;
        task['state'] = 'data.ready';
        task['msg'] = 'redo task';
        const response = await this.http.post(url, task).toPromise();
        // tslint:disable-next-line:no-console
        console.log(response);
    }
}
