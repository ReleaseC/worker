import {Component, forwardRef, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';

@Component({
  selector: 'ngx-profit',
  styleUrls: ['./profit.component.css'],
  templateUrl: './profit.component.html',

})
export class ProfitComponent implements OnInit {
  server = environment.apiServer;
  orderList: any;
  /*每页多少条数据*/
  pageItems = 20;
  /*第几页*/
  pageIndex = 1;
  /*一共多少页*/
  pages = 1;
  /*支付状态*/
  is_pay = 1;
  total_fees = 0;
  myNow = new Date().toLocaleDateString();
  /* 项目 */
  projectList = []
  selProject: string;
  selProjectId: string;
  /*活动过滤*/
  activityList = [];
  selActivity: string;
  selActivityId: string;
  orderNumber:number=0;
  merchant:string='';
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'yyyy/mm/dd',
  };


  dateModel: any = {
    beginDate: {year: this.myNow.split('/')[0] || '2018', month: this.myNow.split('/')[1] || '12', day: '1'},
    endDate: {
      year: this.myNow.split('/')[0] || '2018',
      month: this.myNow.split('/')[1] || '12',
      day: this.myNow.split('/')[2] || '12'
    }
  };

  constructor(private http: HttpClient) {
  }


  ngOnInit() {
    this.selProjectId = ''
    this.selActivityId = ''
    this.getOrderlist(false)
    this.getProjectList()
    this.getActivityList()
  }
  /* 项目列表 */
  async getProjectList() {
    this.http.get(environment.apiServerData + '/project/list?project=').subscribe((data: any) => {
      this.projectList = data;
      this.projectList.unshift({'project_name': '全部', 'project_id': ''});
      console.log(this.projectList)
      console.log("拿取项目列表")
    })

  }
  /* 活动列表 */
  async getActivityList(selProjectId='') {
    if(selProjectId != ''){
      this.http.get(environment.apiServerData + '/activity/list?project_id=' + selProjectId).subscribe((data: any) => {
        this.activityList = data;
        this.activityList.unshift({'activity_name': '全部', 'activity_id': ''});
        console.log(this.activityList)
        console.log("拿取活动列表")
      })
    }else{
      this.http.get(environment.apiServerData + '/activity/list').subscribe((data: any) => {
        this.activityList = data;
        this.activityList.unshift({'activity_name': '全部', 'activity_id': ''});
        console.log(this.activityList)
        console.log("拿取活动列表")
      })
    }
    
    

  }
  

  /*
   * 选择项目
   */
  onProjectSelected() {

    for (let i = 0; i < this.projectList.length; i++) {
      if (this.projectList[i].project_name === this.selProject)
        this.selProjectId = this.projectList[i].project_id
    }
    console.log('this.selProject:', this.selProject)
    console.log('this.selProjectId:', this.selProjectId)
    this.getActivityList(this.selProjectId)

  }
  /*
   * 选择活动
   */
  onActivitySelected() {

    for (let i = 0; i < this.activityList.length; i++) {
      if (this.activityList[i].activity_name === this.selActivity)
        this.selActivityId = this.activityList[i].activity_id
    }
    console.log('this.selActivity:', this.selActivity)
    console.log('this.selActivityId:', this.selActivityId)
    this.getOrderlist(true)

  }
  async getOrderlist(refreshIndex) {

    /*格式化日期*/
    let beginMonth = this.dateModel.beginDate.month < 10 ? '0' + this.dateModel.beginDate.month : this.dateModel.beginDate.month
    console.log('beginMonth:', beginMonth)
    let beginDay = this.dateModel.beginDate.day < 10 ? '0' + this.dateModel.beginDate.day : this.dateModel.beginDate.day
    console.log('beginDay:', beginDay)
    let begin = this.dateModel.beginDate.year + '-' + beginMonth + '-' + beginDay;
    console.log('begin:', begin)
    let endMonth = this.dateModel.endDate.month < 10 ? '0' + this.dateModel.endDate.month : this.dateModel.endDate.month
    console.log('endMonth:', endMonth)
    let endDay = this.dateModel.endDate.day < 10 ? '0' + this.dateModel.endDate.day : this.dateModel.endDate.day
    console.log('endDay:', endDay)
    let end = this.dateModel.endDate.year + '-' + endMonth + '-' + endDay;
    console.log('end:', end)

    if (refreshIndex) {
      this.pageIndex = 1
    }

   // 获取以20条一页的订单信息
    const url = `${this.server}/admin/order/list?start=` + (this.pageIndex - 1) * this.pageItems +
      '&limit=' + this.pageItems + '&is_pay=' + this.is_pay + '&begin_date=' + begin + '&end_date=' + end + '&activity_id=' + this.selActivityId + '&cash_code=1';
    console.log('url:', url)
    this.http.get(url).subscribe((data: any) => {
      console.log('data:', data);
      this.orderNumber=data.count;
      this.orderList = data.list;
      this.merchant=this.orderList[0]["seller"]
      console.log(this.merchant)
      this.total_fees = this.is_pay==1?data.total_fees:0;
      this.pages = Math.ceil(data.count / this.pageItems);
    })
  }

  dateRangeChanged(event: IMyDateRangeModel) {
    // event properties are: event.beginDate, event.endDate, event.formatted, event.beginEpoc and event.endEpoc
    this.dateModel = {
      beginDate: {
        year: event.beginDate.year.toString(),
        month: event.beginDate.month.toString(),
        day: event.beginDate.day.toString()
      },
      endDate: {
        year: event.endDate.year.toString(),
        month: event.endDate.month.toString(),
        day: event.endDate.day.toString()
      }
    };

    this.getOrderlist(true)
  }

  /*
   * 替换任务状态为汉字
   */
  replaceTaskState(state) {
    switch (state) {
      case 'create':
        return '创建';
      case 'uploading':
        return '上传';
      case 'data.ready':
        return '准备';
      case 'start':
        return '剪辑';
      case 'complete':
        return '成功';
      case 'abort':
        return '损坏';
      default:
        return state
    }
  }

  startTask(taskId) {

    console.log('url:', `${this.server}/task/send_local_cloud?taskId=` + taskId)

    this.http.get(`${this.server}/task/send_local_cloud?taskId=` + taskId).subscribe((data: any) => {
      console.log('data:', data);
    })

    // send_local_cloud

  }

  /*
   * 上一页
   */
  pageUp() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.getOrderlist(false)
    }
  }

  /*
   * 下一页
   */
  pageDown() {
    if (this.pageIndex < this.pages) {
      this.pageIndex++;
      this.getOrderlist(false)
    }
  }

}
