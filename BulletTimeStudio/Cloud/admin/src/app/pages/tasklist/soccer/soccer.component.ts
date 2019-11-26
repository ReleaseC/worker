import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'ngx-bt',
    styleUrls: ['./soccer.component.scss'],
    templateUrl: './soccer.component.html',

})
export class SoccerListComponent implements OnInit {

    constructor(private http: HttpClient) { 
        
        // setInterval(() => {
        //     this.getTasklist();
        // }, 2000);
    }

    server = environment.apiServer;
    tasklist=[];
    taskheader: any;
    time: string;
    siteValue: any;
    msg: string;
    taskNumber: number = 0;
    videoNumber: number = 0;
    taskfaillist: string[] = [];
    sitelist = [];
    btn_style:string = 'siteIdBtn';


    async ngOnInit() {
        this.time = this.time ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
        this.makeSiteidUl(); 
        this.getTasklist();
                // console.log(this.server);
        // // this.taskheader = ['taskId', 'createTime', 'updateTime', 'state', 'msg', 'url', ''];
        // //const url = `${this.server}site/get_site_detail`;
        // // const body = {
        // //     type: 'soccer',
        // //   };
        

        // //const response = await this.http.post(url, body).toPromise();
        // //this.sitelist = response['result'];
    }

    //获取siteid列表
    async makeSiteidUl(){
        const url = "https://iva.siiva.com/task/task_list_get/?time="+this.time;
        const response = await this.http.get(url).toPromise();
        this.sitelist = [];
        for(var v in response){
            let id = response[v].task.siteId;
            let have = 0;
            for(var v2 in this.sitelist){
                if(id==this.sitelist[v2].id){
                    have = 1;
                }
            }
            if(have == 0){
                this.sitelist.push({'id': id,'checked':true})
            }
        }
    }

    //time和siteid改变时，获取taskList
    async getTasklist() { 
        let siteIdList = [];
        let url = 'https://iva.siiva.com/task/task_list_get/?time='+ this.time +'&siteId=';
        for(var k in this.sitelist){
            if(this.sitelist[k].checked){
                siteIdList.push(this.sitelist[k].id)
            }
        }
        console.log(siteIdList)
        for(let i=0;i<siteIdList.length;i++){
            let url0 = url+siteIdList[i];
            let res = await this.http.get(url0).toPromise();
            console.log(res)
            for(var j in res){
                console.log(res[j])
                this.tasklist.push(res[j])
            }
        }
        console.log(this.tasklist)
        console.log('makedom')
        // this.msg = '';
        // this.time = this.time ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
        // console.log(this.siteValue);
        // const siteId = this.siteValue ? this.siteValue.siteId : '3a1ee8e0795711e88b37174870660c74';
        // const url = `${this.server}task/task_list_get/?time=${this.time}&siteId=${siteId}`;
        // const response = await this.http.get(url).toPromise();
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
        // console.log(this.tasklist.length);

    }
    async reDoTask(task) {
        const url = `${this.server}/task/task_update`;
        task['state'] = 'data.ready';
        task['msg'] = 'redo task';
        const response = await this.http.post(url, task).toPromise();
        console.log(response);
    }

    //点击选择siteId，dom效果+siteList处理
    selectSiteId(siteId){ 
        for(let v in this.sitelist){
            if(siteId.id == this.sitelist[v].id){
                this.sitelist[v].checked = !this.sitelist[v].checked;
            }
        }
        this.getTasklist();
    }
}
