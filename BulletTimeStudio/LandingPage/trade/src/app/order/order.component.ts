import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  server = environment.apiServer;
  orderList: any;
  orderHeader: any;
  /*每页多少条数据*/
  pageItems = 20;
  /*第几页*/
  pageIndex = 1;
  /*一共多少页*/
  pages = 1;
  /*创建时间*/
  // createdAt = '';
  /*支付状态*/
  is_pay = 1;
  total_fees = 0;
  myNow = new Date().toLocaleDateString()

  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'yyyy/mm/dd',
  };


  dateModel: any = {
    beginDate: {year: this.myNow.split('/')[0] || '2018', month: this.myNow.split('/')[1] || '12', day: '1'},
    endDate: {year:this.myNow.split('/')[0] || '2018', month: this.myNow.split('/')[1] || '12', day: this.myNow.split('/')[2] || '12'}
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient) {
  }


  ngOnInit() {

    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    // });
    this.orderHeader = ['创建时间', '订单号', '金额(元)', '状态']
    this.getOrderlist(false)
  }

  async getOrderlist(refreshIndex) {

    /*格式化日期*/
    let beginMonth = this.dateModel.beginDate.month.length == 1 ? '0'+this.dateModel.beginDate.month : this.dateModel.beginDate.month
    let beginDay = this.dateModel.beginDate.day.length == 1 ? '0'+this.dateModel.beginDate.day : this.dateModel.beginDate.day
    let begin = this.dateModel.beginDate.year + '-' +  beginMonth + '-' + beginDay;
    console.log('begin:', begin)
    let endMonth = this.dateModel.endDate.month.length == 1 ? '0'+this.dateModel.endDate.month : this.dateModel.endDate.month
    let endDay = this.dateModel.endDate.day.length == 1 ? '0'+this.dateModel.endDate.day : this.dateModel.endDate.day
    let end = this.dateModel.endDate.year + '-' +  endMonth + '-' + endDay;
    console.log('end:', end)




    if (refreshIndex) {
      this.pageIndex = 1
    }
    const url = `${this.server}admin/order/list?start=` + (this.pageIndex - 1) * this.pageItems +
      '&limit=' + this.pageItems + '&is_pay=' + this.is_pay + '&seller=智能云影像' + '&begin_date='+begin + '&end_date='+end;
    console.log('url:', url)
    // const response = await this.http.get(url).toPromise();
    this.http.get(url).subscribe((data: any) => {
      console.log('data:', data);
      this.orderList = data.list;
      this.total_fees = data.total_fees;
      this.pages = Math.ceil(data.count / this.pageItems);
    })
  }


  dateRangeChanged(event: IMyDateRangeModel) {
    // event properties are: event.beginDate, event.endDate, event.formatted, event.beginEpoc and event.endEpoc
    this.dateModel = {
      beginDate: {year: event.beginDate.year.toString(), month: event.beginDate.month.toString(), day: event.beginDate.day.toString()},
      endDate: {year: event.endDate.year.toString(), month: event.endDate.month.toString(), day: event.endDate.day.toString()}
    };

    this.getOrderlist(true)
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
