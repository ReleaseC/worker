import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'ngx-bt',
    styleUrls: ['./bullettime.component.scss'],
    templateUrl: './bullettime.component.html',

})
export class BullettimeListComponent implements OnInit {

    constructor(private http: HttpClient) { }

    server = environment.apiServer;
    tasklist=[];
    taskheader: any;
    time: string;
    site: any;
    msg: string;
    taskNumber: number = 0;
    videoNumber: number = 0;
    taskfaillist: string[] = [];
    sitelist = [];  //所有siteId
    siteIdList=[];//选中的siteId
    btn_style:string = 'siteIdBtn';
    timer;
    haveSiteid:boolean=false;
    async ngOnInit() {
        this.time = this.time ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
        console.log(this.time)

        this.makeSiteidUl(); //初始化siteIdList

        
        this.taskheader = ['taskId', 'userId', 'createTime', 'updateTime', 'state', 'msg', 'url', ''];

    }
    //获取siteid列表
    async makeSiteidUl(){
        // const url = this.server + "task/task_list_get/?time="+this.time;
        // let res:any = await this.http.get(url).toPromise();
        // if(res.length != 0){
        //     this.sitelist = []; //siteId列表 0013 0002
        //     for(var v in res){
        //         let id = res[v].task.siteId;
        //         let have = 0;
        //         for(var v2 in this.sitelist){
        //             if(id==this.sitelist[v2].id){
        //                 have = 1;
        //             }
        //         }
        //         if(have == 0){
        //             this.sitelist.push({'id': id,'checked':true}) //初始化siteId列表，全部check
        //             console.log(this.sitelist)
        //         }
        //     }


        //     // this.timer = setInterval(() => {
        //     //     this.getTasklist();
        //     // }, 2000);
        // }else{
        //     this.haveSiteid = true;
        // }
    }


    async getTasklist() {
        // this.siteIdList = [];
        // this.tasklist = [];
        // let url = 'https://bt.siiva.com/task/task_list_get/?time='+ this.time +'&siteId=';
        // for(var k in this.sitelist){ //循环所有siteID
        //     if(this.sitelist[k].checked){
        //         this.siteIdList.push(this.sitelist[k].id)
        //     }
        // }
        // console.log("已选中")
        // console.log(this.siteIdList)//已选中的siteid列表
        // for(let i=0;i<this.siteIdList.length;i++){
        //     let url0 = url+this.siteIdList[i];
        //     let res = await this.http.get(url0).toPromise();
        //     //console.log(res)
        //     for(var j in res){  //多个siteid的task添加到同一数组
        //         //console.log(res[j])
        //         this.tasklist.push(res[j])
        //     }
        // }
        // console.log(this.tasklist)  //各个siteid的task组
        //console.log('makedom')

        // this.msg = '';
        // // tslint:disable-next-line:no-console
        // this.time = typeof this.time !== 'undefined' ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
        // this.site = typeof this.site !== 'undefined' ? this.site : '0009';
        // const url = `${this.server}task/task_list_get/?time=${this.time}&siteId=${this.site}`;
        // const response = await this.http.get(url).toPromise();
        // // tslint:disable-next-line:no-console
        // console.log(response);
        // this.taskNumber = Object.keys(response).length;
        // if (Object.keys(response).length === 0) {
        //     this.msg = 'no matched task';
        //     this.tasklist = [];
        // } else {
        //     this.tasklist = response;
        //     // const r1=JSON.parse(JSON.stringify(data));
        //     this.taskfaillist.splice(0, this.taskfaillist.length);
        //     for (let i = 0; i <= this.tasklist.length - 1; i++) {
        //         if (this.tasklist[i].state === 'complete') {
        //             this.taskfaillist.push(this.tasklist[i])
        //         }
        //     }
        //     // console.log(this.taskfaillist.length)
        //     this.videoNumber = this.taskfaillist.length;
        // }
        // console.log(this.tasklist.length)
    }
    async reDoTask(task) {
        // const url = `${this.server}task/task_update`;
        // task['state'] = 'data.ready';
        // task['msg'] = 'redo task';
        // const response = await this.http.post(url, task).toPromise();
        // // tslint:disable-next-line:no-console
        // console.log(response);
    }

    selectSiteId(siteId){ 
        // for(let v in this.sitelist){
        //     if(siteId.id == this.sitelist[v].id){
        //         this.sitelist[v].checked = !this.sitelist[v].checked;
        //     }
        // }
        // this.getTasklist();
        // clearInterval(this.timer);
        // this.timer = setInterval(() => {
        //     this.getTasklist();
        // }, 2000);

    }
 }
