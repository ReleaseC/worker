import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
    selector: 'app-photomanager',
    templateUrl: './photomanager.component.html',
    styleUrls: ['./photomanager.component.css']
})
export class PhotoManagerComponent implements OnInit {
    myAngularxQrCode:string = ''; // 二维码
    activitylist:any = [];
    selected_activity_id:string = 'all';
    tasklist:any = [];
    border1_width:string='50%';
    height_value:string='50%';
    qrcode_url:string='';
    isshowqrcode:boolean=false;
    isshowtasklist:boolean=true;
    create_time:'';
    task_url:any;
    task_url_mp4:any;
    isshow_qrcode:boolean=false;
    user_id:string='';
    project_id:string='';
    currentPage:number = 0;
    sumPage: number;
    limit:number = 10;
    clientYStart: number ;
    screenYStart: number;
    clientYEnd: number ;
    screenYEnd: number;
    lastScrollTop: number = 0;
    scrollTop: number;
    is_pay: string ;
    is_paySelected: string = '2';
    curTaskId: string = '';
    imgHeight: number = 200;
    delete: boolean = false;
    checked:boolean = false;
    isVideo: boolean = false;
    //私桶
    temp_url_private = "https://siiva-video.oss-cn-hangzhou.aliyuncs.com/";
    //共桶
    temp_url = "https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/"

    // 大图浏览序号
    curIndex:number;

    
    timer    = null;
    remaining   = 0;
    previous = new Date().getTime();
    constructor( private router:Router,private http: HttpClient,private activatedRoute: ActivatedRoute ) {}
  

   ngOnInit() {
        // 取得该账号下活动列表
        this.activitylist=JSON.parse(localStorage.getItem('activitylist')) 
        this.project_id = localStorage['project_id'];
        this.isVideo = this.project_id === 'pr_1539766932' || this.project_id==='pr_1561621296'
        console.log(this.isVideo);
        this.user_id = localStorage['user_id'];
        // this.activitylist[0]=JSON.parse(localStorage.getItem('selected_activity'))
        // this.selected_activity_id=JSON.parse(localStorage.getItem('selected_activity')).activity_id
        this.activitylist.unshift({activity_name:'全部活动', activity_id: 'all'});
        console.log(this.activitylist)
        this.onActivitySelected();
        // this.load();
        
    }
    touchToShowPay(){
        this.is_paySelected = this.is_paySelected === '1'? '2': '1';
        this.onActivitySelected();
    }
    touchToShowNotPay(){
        
        this.is_paySelected = this.is_paySelected === '0'? '2': '0';
        this.onActivitySelected();
    }

    // 发送参数
    getSendParams(){
        var returnObj =  this.selected_activity_id === 'all' ? 
        // 判断是否选择全部活动 发送项目id表示全部活动 活动id表示单个活动
        { 'project_id': this.project_id,'start':this.currentPage.toString(),'has_preview_img':'1','has_preview_video':'1','limit':this.limit.toString() }
        // this.project_id ?
        // { 'project_id': this.project_id,'start':this.currentPage.toString(),'limit':this.limit.toString() } :

        // { 'user_id': this.user_id,'start':this.currentPage.toString(),'limit':this.limit.toString() }
        :{ 'activity_id': this.selected_activity_id,'has_preview_img':'1','has_preview_video':'1','start':this.currentPage.toString(),'limit':this.limit.toString()}
        // 已购未购标记
        this.is_paySelected !== '2' ? returnObj['is_pay']=Number(this.is_paySelected)  : '';
        // 模板标记
        this.is_paySelected === '1' ? returnObj['mul_template_create']='1': '';
        // 锦江视频 全部&未购不加complete
        !(this.is_paySelected !== '1' && this.isVideo) ? returnObj['state']='complete': '';
        console.log(returnObj);
        return returnObj;
    }
    touchToSelect() {
        this.is_paySelected = '2';
        this.onActivitySelected()
    }
    /*选择活动，并取得tasklist */
    onActivitySelected(){
        this.currentPage = 0;
        console.log(this.selected_activity_id)
        this.http
    // .get(`${environment.apiServer}/task/list`,{ params: { 'activity_id': this.selected_activity_id,'state':'complete','start':'0','limit':this.limit.toString()} })
    .get(`${environment.apiServer}/task/list`,{ params: this.getSendParams() })
    // .get(`${environment.apiServer}/task/list?`+ 'activity_id'this.selected_activity_id,'state':'complete','start':this.currentPage*this.limit,'limit':this.limit} })
    .subscribe(data => {
       console.log(data)
       this.tasklist=data['list']
       this.sumPage = data['count']
       console.log(this.sumPage)
     })
    }



    //上划加载更多
    // /*选择活动，并取得tasklist */
    onScrollBottomStart(event){
        this.screenYStart = event.changedTouches[0].screenY
    }
    /*选择活动，并取得tasklist */
    onScrollBottomEnd(event){
        var mat = document.getElementsByTagName('mat-sidenav-content')[0]
        this.scrollTop = mat.scrollTop;
        var clientHeight = document.getElementById('tasklist').clientHeight;
        var scrollTop = document.getElementById('tasklist').scrollTop;
        var offsetTop = document.getElementById('tasklist').offsetTop;
        var bodyclientHeight = document.body.clientHeight;
        console.log(bodyclientHeight+ this.scrollTop+ offsetTop, clientHeight, this.imgHeight, scrollTop)
        this.screenYEnd = event.changedTouches[0].screenY
        if(this.screenYEnd < this.screenYStart){
            if(this.scrollTop + bodyclientHeight  - clientHeight + offsetTop + this.imgHeight * 3 >0){
                this.requestNextTask()
            }
        }
        this.lastScrollTop = this.scrollTop;
    }
    /*选择活动，并取得tasklist */
    requestNextTask(){
        this.currentPage += this.limit;
        if(this.currentPage>this.sumPage)return;
        console.log(this.selected_activity_id)
        this.http
            .get(`${environment.apiServer}/task/list`,{ params: this.getSendParams() })
            .subscribe(data => {
            console.log(data)
                this.tasklist = this.tasklist.concat(data['list'])
            })
    }


    //左右划更换图片
    // /*选择活动，并取得tasklist */
    onScrollRightStart(event){
        this.screenYStart = event.changedTouches[0].screenX
        // let tempTextLeft = document.createElement('div');
        // tempTextLeft.innerHTML = '左滑加载下一张图';
        // let tempTextRight = document.createElement('div');
        // tempTextRight.innerHTML = '左滑加载下一张图';
    }
    /*选择活动，并取得tasklist */
    onScrollRightEnd(event){
        console.log(document.getElementById('bigImg').scrollLeft)
        document.getElementById('bigImg').scrollLeft = 0;
        this.screenYEnd = event.changedTouches[0].screenX
        if (this.screenYEnd - this.screenYStart > 50){
            if(this.curIndex > 1){
                let {activity_id, createdAt } = this.tasklist[this.curIndex-1]
                let { is_pay, taskId } = this.tasklist[this.curIndex-1].task
                
                console.log(activity_id,taskId,createdAt, is_pay)
                console.log(this.tasklist[this.curIndex-1])
                this.goVideo(activity_id,taskId,createdAt, is_pay);
            } else {
                this.tip("已经是第一页了")
            }
        } else if(this.screenYStart - this.screenYEnd > 50 ){
            if(this.curIndex < this.tasklist.length-1){
                let {activity_id,  createdAt } = this.tasklist[this.curIndex+1]
                let {is_pay,taskId } = this.tasklist[this.curIndex+1].task
                console.log(activity_id,taskId,createdAt, is_pay)
                console.log(this.tasklist[this.curIndex+1])
                this.goVideo(activity_id,taskId,createdAt, is_pay);
            } else {
                this.tip("已经是最后一页了")
            }
        }
        this.lastScrollTop = this.scrollTop;
    }

    goVideo(activity_id,taskId,create_time, is_pay, is_pay_task?){
        
        if(this.delete === true)return;
        console.log(activity_id)
        console.log(typeof is_pay)
        let is_pay_temp = is_pay_task || is_pay;
        this.is_pay = is_pay_temp && is_pay_temp.toString();
        console.log(this.is_pay)
        this.curTaskId = taskId;
        this.create_time=create_time;
        this.qrcode_url="https://siiva-video.oss-cn-hangzhou.aliyuncs.com/qrcode/"+taskId+".png";
        this.task_url="https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/"+activity_id+"/"+taskId+".jpg"
        // demo地址
        let demo="https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/"+taskId+"_demo.mp4"
        // 真实地址
        let real ="https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/"+activity_id+"/"+taskId+".mp4"
        this.task_url_mp4 = this.is_pay==='1' ? real : demo;
        this.myAngularxQrCode = this.task_url_mp4;
        this.isshowtasklist=false;
        this.curIndex = this.tasklist.findIndex(x => 
                x.task.taskId === this.curTaskId
            )
            console.log('当前index', this.curIndex);
            console.log('总共', this.tasklist.length -1);
        if(this.tasklist.length - 1 - this.curIndex <= 2){
            this.requestNextTask()
        }
        // this.router.navigate(['/menu/showphoto'],{queryParams:{activity_id:activity_id,taskId:taskId,create_time:create_time}})
    }

    goback(){
        this.isshowtasklist=true;
    }
    toggleBigger(){
        this.isshow_qrcode = !this.isshow_qrcode;
    }
    touchToPrint() {
        
      this.tip('即将开始打印');
        this.throttle(this.sendPrint, 2000).bind(this)();
    }
    sendPrint(){
        
        this.http
    // .get(`${environment.apiServer}/task/list`,{ params: { 'activity_id': this.selected_activity_id,'state':'complete','start':'0','limit':this.limit.toString()} })
    .get(`${environment.apiServer}/print_img`,{ params: {taskId: this.curTaskId} })
    // .get(`${environment.apiServer}/task/list?`+ 'activity_id'this.selected_activity_id,'state':'complete','start':this.currentPage*this.limit,'limit':this.limit} })
    .subscribe(data => {
       console.log(data)
      this.tip('正在打印');
     })
    }
    tip(mes) {
        var toast =  document.getElementById('toast');
      var toastChildren=document.createElement('div');
      toastChildren.innerText=mes;
      toast.appendChild(toastChildren);    
      setTimeout(function() {    
        toast.removeChild(toastChildren);    
      }, 2000);   
    }
    // load(){
    //     var img = document.getElementsByTagName('img');
    //     for(var i=0; i<img.length;i++){
    //         var oldSrc = img[i].src;
    //         img[i].src='assets/images/back.png';
    //         img[i].onload = function() {
    //             img[i].src = oldSrc;
    //         }

    //     }
    
    // }
    touchToCheckdAll() {
        Array.from(document.getElementsByClassName('checkbox')).forEach(e => (e as HTMLInputElement).checked = true);
    }
    touchToCheckedTaggle() {
        Array.from(document.getElementsByClassName('checkbox')).forEach(e => (e as HTMLInputElement).checked=!(e as HTMLInputElement).checked);
    }

    showCheck() {
        this.delete=true;
    }

    touchToDelete() {
        console.log('touched')
        let checkboxDom = Array.from(document.getElementsByClassName('checkbox')).filter(e => (e as HTMLInputElement).checked);
        let checkboxTaskList = checkboxDom.map(e => e.id)
        console.log(checkboxTaskList);
        
        let res = checkboxDom.map(res => (res as HTMLInputElement).value )
        forkJoin(...res.map(e => 
            this.http.get(`${environment.cloudServer1}task/del`,{ params: {taskId: e} })
                )
            )
            .subscribe(
            (resList) =>{
                console.log(resList)
                if(resList.every(res => res['result'] && res['result'].ok === 1 )){        
                    // checkboxDom.forEach(element => {
                    //     console.log(element, element.parentNode, (element.parentNode as HTMLElement));
                    //     (element.parentNode as HTMLElement).remove();

                    // });
                    for(let j=0; j < checkboxTaskList.length; ){
                        for(let i=0; i< this.tasklist.length; i++){
                            console.log(this.tasklist[i].task.taskId);
                            console.log(checkboxTaskList[j]);
                            if(this.tasklist[i].task && this.tasklist[i].task.taskId === checkboxTaskList[j]){
                                this.tasklist.splice(i, 1)
                                i--;
                                j++
                                // 找到最后一个直接返回true
                                console.log(this.tasklist)
                                console.log(j)
                                console.log(checkboxTaskList.length)
                                
                            }
                            
                            if(j === checkboxTaskList.length)return;
                        }
                    }
                    console.log(this.tasklist)
                    this.tip('全部删除成功');
                } else {
                    let resTask = resList.map((res, index) => {
                        if(res['result'] && res['result'].ok === 1){
                            console.log(checkboxDom[index]);
                            (checkboxDom[index].parentNode as HTMLElement).remove()
                        }
                        this.tip('部分错误');
                    })
                    for(let j=0; j < resTask.length; ){
                        for(let i=0; i< this.tasklist.length; i++){
                            console.log(this.tasklist[i].task.taskId);
                            console.log(resTask[j]);
                            if(this.tasklist[i].task && this.tasklist[i].task.taskId === resTask[j]){
                                this.tasklist.splice(i, 1)
                                i--;
                                j++
                                this.tip('删除成功');
                            }
                            if(j === resTask.length)return;
                        }
                    }

                }
            },
            (err) => {
                this.tip('连接失败');
            },
            () => {
                this.delete=false
            }
            );
    }
    
    throttle (fn, delay) {
     
         return function () {
             let now = new Date().getTime(),
             remaining = now - this.previous,
             args = arguments,
             context = this;
             console.log(remaining);
     
             if (remaining >= delay) {
                 if (this.timer) {
                     clearTimeout(this.timer);
                 }
     
                 fn.apply(context, args);
                 this.previous = now;
             } else {
                 if (!this.timer) {
                     this.timer = setTimeout(function () {
                         fn.apply(context, args);
                         this.previous = new Date().getTime();
                     }, delay - remaining);
                 }
             }
         };
     }
}
