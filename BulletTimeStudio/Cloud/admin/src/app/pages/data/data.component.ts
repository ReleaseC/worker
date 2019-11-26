import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// import { setTimeout } from 'timers';

@Component({
    selector: 'ngx-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {
  // isShow1: boolean = false;
  // isShow2: boolean = false;
  ret1: string[] = [];
  ret2: string[] = [];
  array_pay:string[]=[];
  array_video:string[]=[];
  visit_sum_bullet: number = 0;
  play_sum_bullet: number = 0;
  share_sum_bullet: number = 0;
  like_sum_bullet: number = 0;
  download_sum_bullet:number=0;
  pay_sum_bullet:number=0;
  videonumber_sum_bullet:number=0;
  number:number=0;
  // selAction:any;
  // selProgramme:string;
  // start_time:any;
  // end_time:any;
  // siteid:any;
  // result:any;
  // siteidList:Array<number>;
  siteIdList=[];
  selSiteId:string;
  res:any;  //siteid们
  timeStart:string = "1970-01-01";
  timeEnd:string;
  data:any; //某个siteid的视频数据们
  dataByTime:any=[]; //视频数据 按 时间 筛选后的结果
  selTemplateId:string='template_sum';
  site:any;
  taskList:string[]=[]
  taskSuccessList:string[]=[];
  countList=[];
  timeArr=[];
  timeArrShow=[];


  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.getSiteidList()
      this.setTime();
    this.get_order_list();
    this.getTasklist();
  }

 // 获取支付成功的订单信息
  get_order_list(){
    this.http 
    .get(environment.apiServerData+'/wechat_payment/get_order_list?siteId='+ this.selSiteId) 
    .subscribe(data => { 
      console.log(data['result'])
      this.array_pay=data['result'];
      console.log(this.array_pay);
    });
  }
// 获取视频产出量
  getTasklist() {
    this.http 
    .get(environment.apiServerData+'/datareport/get_statistics?siteId='+this.selSiteId) 
    .subscribe(data => { 
      console.log(data); 
      const r1 = JSON.parse(JSON.stringify(data['result'])); 
      console.log(r1)
      // console.log(data['result'][0])
        for (let i = 0; i<= r1.length-1; i++) {
          // data['result'][i]['videonumber']=0; 
          // this.number=0;
          this.taskSuccessList.splice(0,this.taskSuccessList.length)
        this.http 
        .get(environment.apiServerData+'/task/task_list_get?siteId='+this.selSiteId+'&time='+data['result'][i]['time'].replace(/\-0/g, '-'))
        .subscribe(data=>{
          console.log(data)
          const r3 = JSON.parse(JSON.stringify(data));
          // console.log(r3)
          this.taskSuccessList.push(r3);
          // for(let j=0;j<=r3.length-1;j++){
          //    console.log(r3[j]['state'])       
          //    if(r3[j]['state']==='complete'){
          //      this.taskSuccessList.push(r3[j])
          //    }
          // }
          // console.log(this.taskSuccessList)
          
        });
        // data['result'][i]['videonumber']=this.taskSuccessList.length;
        // console.log( data['result'][i])
      }
    });
    }

  //获取siteId列表
  async getSiteidList(){  
      let account = localStorage.getItem("account");
      let token = localStorage.getItem('toekn');
      let type = "bt";
      /*
      老接口暂时用type，之后会改成用group
      */ 
      const url = environment.apiServerData + '/account/v2/getGroupArray?account='+account+"&token="+token +"&type=" + type;
      const response:any = await this.http.get(url).toPromise();
      console.log(response)
      for(let i=0;i<response.length;i++){
        this.siteIdList.push(response[i].siteId)
      }
      console.log(this.siteIdList);
      this.selSiteId = this.siteIdList[0];
  }
  //初始化时间
  setTime(){
    if(!this.timeEnd){
      let date = new Date()
      let year = date.getFullYear();
      let mon:any = date.getMonth() + 1;
      if(mon<10){mon = "0" + mon}
      let day:any = date.getDate();
      if(day<10){day = "0" + day}
      this.timeEnd = (year + '-' +  mon + '-' + day);
    }
    console.log(this.timeStart+"&" +this.timeEnd)
  }
  //点击查询
  // async search(){
  //   let url =await "https://api.siiva.com/datareport/get_data?siteId=" + this.selSiteId;
  //   let res = await this.http.get(url).toPromise();
  //   this.data = res;
  //   this.data = this.data.result;
  //   console.log(this.data);//该siteid所有数据
  //   let data1:any = new Date(this.timeStart+" 00:00:00");
  //   let data2:any = new Date(this.timeEnd+" 23:59:59");
  //   let timeStartStamp:any =Date.parse(data1)/1000;
  //   let timeEndStamp:any =Date.parse(data2)/1000;
  //   console.log(timeStartStamp +"&" + timeEndStamp);  //选择的起止时间 
  //   this.dataByTime = [];
  //   for(let i in this.data){
  //     let dataTime = this.data[i].time;
  //     let dataTimeStamp = Date.parse(dataTime)/1000; //获取每条数据的时间
  //     //console.log(dataTimeStamp);
  //     if(dataTimeStamp>timeStartStamp && dataTimeStamp<timeEndStamp){ //比较，在起止时间内的添加至dataBytime
  //       let a = this.data[i];
  //       this.dataByTime.push(a)
  //     }
  //   }
  //   console.log(this.dataByTime)
  // }
  selectTemplateId(){
   console.log(this.selTemplateId);
  }
  async search(){
    console.log(this.selSiteId)
    this.http 
    .get(environment.apiServerData+'/datareport/get_statistics?siteId='+this.selSiteId) 
    .subscribe(data => { 
      console.log(data); 
        const r1 = JSON.parse(JSON.stringify(data['result'])); 
        console.log(r1)
        this.ret1.splice(0,this.ret1.length);
        this.visit_sum_bullet = 0; 
        this.like_sum_bullet = 0; 
        this.share_sum_bullet =0; 
        this.play_sum_bullet = 0;
        this.download_sum_bullet=0;
        this.videonumber_sum_bullet=0;
        this.pay_sum_bullet=0;
        // console.log(data['result'][0])
          for (let i = 0; i<= r1.length-1; i++) { 
          data['result'][i]['visit']=0;
          data['result'][i]['like']=0;
          data['result'][i]['play']=0;
          data['result'][i]['share']=0;
          data['result'][i]['download']=0;
          data['result'][i]['pay']=0;
          data['result'][i]['videonumber']=0;
          for(let z=0;z<=this.taskSuccessList.length-1;z++){
            if(this.taskSuccessList[z][0]['createdAt'].split(" ")[0]===data['result'][i]['time'].replace(/\-0/g, '-')){
             data['result'][i]['videonumber']=this.taskSuccessList[z].length;
          }
          }
          for(let k=0;k<=this.array_pay.length-1;k++){
            console.log(typeof this.array_pay[k]['total_fee'])
             if(this.array_pay[k]['time'].split(" ")[0]===data['result'][i]['time']){
              data['result'][i]['pay']+=Number(this.array_pay[k]['total_fee']);
             }
          }
          if(data['result'][i]['time']>=this.timeStart&&data['result'][i]['time']<=this.timeEnd){ 
        
        // 默认情况下多模板总数据
        if(this.selTemplateId=='template_sum'){
           for(let j=0;j<=data['result'][i]['templates'].length-1;j++){
          data['result'][i]['visit']+=data['result'][i]['templates'][j]['visit'];
          data['result'][i]['like']+=data['result'][i]['templates'][j]['like'];
          data['result'][i]['play']+=data['result'][i]['templates'][j]['play'];
          data['result'][i]['share']+=data['result'][i]['templates'][j]['share'];
          data['result'][i]['download']+=data['result'][i]['templates'][j]['download'];
        }
      }
        // 模板1数据
        if(this.selTemplateId==='template_1'){
          for(let j=0;j<=data['result'][i]['templates'].length-1;j++){
            if(data['result'][i]['templates'][j]['templateId']==='template_1'){
              data['result'][i]['visit']+=data['result'][i]['templates'][j]['visit'];
              data['result'][i]['like']+=data['result'][i]['templates'][j]['like'];
              data['result'][i]['play']+=data['result'][i]['templates'][j]['play'];
              data['result'][i]['share']+=data['result'][i]['templates'][j]['share'];
              data['result'][i]['download']+=data['result'][i]['templates'][j]['download'];
            }
          }
        }
        // 模板2数据
        if(this.selTemplateId==='template_2'){
          for(let j=0;j<=data['result'][i]['templates'].length-1;j++){
            if(data['result'][i]['templates'][j]['templateId']==='template_2'){
              data['result'][i]['visit']+=data['result'][i]['templates'][j]['visit'];
              data['result'][i]['like']+=data['result'][i]['templates'][j]['like'];
              data['result'][i]['play']+=data['result'][i]['templates'][j]['play'];
              data['result'][i]['share']+=data['result'][i]['templates'][j]['share'];
              data['result'][i]['download']+=data['result'][i]['templates'][j]['download'];
            }
          }
        }

        this.visit_sum_bullet += data['result'][i]['visit']; 
         this.like_sum_bullet += data['result'][i]['like']; 
         this.share_sum_bullet += data['result'][i]['share']; 
         this.play_sum_bullet += data['result'][i]['play'];
         this.download_sum_bullet+=data['result'][i]['download'];
         this.videonumber_sum_bullet+=data['result'][i]['videonumber'];
         this.pay_sum_bullet+=data['result'][i]['pay'];
         this.ret1.push(data['result'][i]); 
        // this.ret1.push(this.ret2[i]); 
      } 
    } 

    }); 
  }
    
  async getCountList(){
    this.timeArr=[];
    this.http 
    .get(environment.apiServerData+'/wechat/get_tickets_statistics?siteId='+this.selSiteId) 
    .subscribe((data1:any) => {
      console.log(this.selSiteId+"baopiao")
      console.log(data1.result)
      const  data = data1.result;
      for(let i=0;i<data.isTicket.length;i++){
        this.timeArr.push({"time":data.isTicket[i].time,"isTicket":data.isTicket[i].count})
      }
      console.log(this.timeArr)
      for(let i=0;i<data.notTicket.length;i++){ 
        let notTime="";
        if(data.notTicket[i]!=null){
          notTime = data.notTicket[i].time;
        }
        let have=false;
        for(let j=0;j<this.timeArr.length;j++){
          let  isTime = this.timeArr[j].time;
          if(notTime==isTime){
            have=true;
            let count = data.notTicket[i].count
            this.timeArr[j].notTicket = count;
          }

        }
        if(have==false){
          let notTicketOne = data.notTicket[i];
          console.log(notTicketOne)
          let count = notTicketOne.count;
          this.timeArr.push({"time":notTime,"notTicket":count})
        }
      }
      console.log(this.timeArr)

      //筛选时间
      this.timeArrShow=[];
      let time1 = this.timeStart;
      let time1Stamp = Date.parse(time1);
      let time2 = this.timeEnd;
      let time2Stamp = Date.parse(time2);
      console.log(time1+"和"+time2)
      
      console.log(this.timeArr)
      for(let i = 0;i<this.timeArr.length;i++){
        let time = this.timeArr[i].time;
        let timeStamp = Date.parse(time);
        console.log( timeStamp )
        if(timeStamp>=time1Stamp &&timeStamp<=time2Stamp){
          this.timeArrShow.push(this.timeArr[i])
        }
      }
      console.log(this.timeArrShow)
    })
  }
}
