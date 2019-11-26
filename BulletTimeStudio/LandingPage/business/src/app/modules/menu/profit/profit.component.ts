import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IMyDrpOptions } from 'mydaterangepicker';
import { JSONToExcelConvertor } from 'src/app/@core/utils/utils'
import {  NzI18nService, NzMessageService } from 'ng-zorro-antd';
import * as getISOWeek from 'date-fns/get_iso_week';
import {startOfMonth,endOfMonth} from 'date-fns';
import { 
    initDate,
    initMonth,
    initWeek,
    week2send,
    month2send,
    anyRange2send,
    getWeekType,
    day2send} from './transdate';

@Component({
    selector: 'ngx-profit',
    styleUrls: ['./profit.component.css'],
    // styleUrls: ['./profit.component.css'],
    templateUrl: './profit.component.html',

})
export class ProfitComponent implements OnInit {
    date = null; // new Date();
    dateRange = []; // [ new Date(), addDays(new Date(), 3) ];
    isEnglish = false;


    server = environment.cloudServer1;
    orderList: any;
    /*每页多少条数据*/
    pageItems = 10;
    /*第几页*/
    pageIndex = 1;
    /*一共多少页*/
    pages = 1;
    /*支付状态*/
    is_pay = 1;
    totalDay_fees: any = 0;
    totalWeek_fees: any = 0;
    totalMonth_fees:any = 0;
    total_fees: number = 0;
    orderNumber: number = 0;
    img_count: number = 0;
    refund_fees: number = 0;
    /* 公司过滤 */
    companyList: any;
    selCompany = '全部';
    selCompanyId = '';
    /* 设备列表的活动过滤 */
    activityList: any;
    porjectList: any;
    selActivityId = '';
    selProjectId = '';
    // userid
    user_id = ''
    project_id = '';
    myDateRangePickerOptions: IMyDrpOptions = {
        dateFormat: 'yyyy/mm/dd',
    };
    refund: string;
    refund_img_count: number = 0;
    refund_count: number = 0;

    // 日历输入框点击弹出日历控件 绕了一大圈做的没有意义的功能
    calendarBtnLength: number = 16;
    
    beginDate:string = '----/--/--';
    endDate: string = '----/--/--';
    curDate=new Date()
    dayModel: any = initDate(this.curDate);
    // weekModel: any = initWeek(new Date());
    weekModel: any = this.curDate;
    monthModel: any = initMonth(this.curDate);
    // monthModel: any = new Date();
    dateModel: any = getWeekType(new Date());
    // dateModel: any = [startOfMonth(this.curDate),endOfMonth(this.curDate)];
    constructor(
        private http: HttpClient,
        private i18n: NzI18nService,
        private nzMessageService: NzMessageService
        ) {
    }


    ngOnInit() {
        
        this.user_id = localStorage['user_id'];
        this.project_id = localStorage['project_id'];
        this.getProjectList();

    }
    pageRequest() {
        this.pageIndex = 1;
        this.reqGetDay();
        this.reqGetWeek();
        this.reqGetMonth();
        this.reqGetOrder();
    }
    hasProjectId() {
        return this.project_id !== '' ? '&project_id=' + this.project_id : '&user_id=' + this.user_id;
    }
    geturl(beginDate, endDate) {
        let param = `${this.server}admin/order/list?start=` + this.pageItems*(this.pageIndex-1) + '&limit=' + this.pageItems + 
        '&cash_code=1' + '&is_pay=' + this.is_pay + '&begin_date=' + beginDate + '&end_date=' + endDate + this.hasProjectId();
        if(this.selActivityId !== '')param += `&activity_id=${this.selActivityId}`;
        if(this.refund){
            param += `&refund=${this.refund}` 
        }
        return param;
    }
    geturlToDownload(beginDate, endDate, refund) {
        let param = `${this.server}admin/order/list?` + 'limit=1000' +
        '&cash_code=1' + '&is_pay=' + this.is_pay + '&begin_date=' + beginDate + '&end_date=' + endDate + this.hasProjectId();
        if(this.selActivityId !== '')param += `&activity_id=${this.selActivityId}`;
        if(refund !== 'all') {
            param += `&refund=${refund}`
        }
        return param;
    }
    reqGetDay() {
        console.log(this.dayModel)
        if(this.dayModel != ''){
            let {beginDate, endDate} = day2send(this.dayModel)
            this.http.get(this.geturl(beginDate, endDate)).subscribe((data: any) => {
                this.totalDay_fees = this.is_pay == 1 ? data.total_fees : 0;
            })
        } else {
            this.totalDay_fees = '';
        }
    }
    reqGetWeek() {
        console.log(this.weekModel)
        if(this.weekModel != ''){
            let {beginDate, endDate} = week2send(getISOWeek(this.weekModel))
            this.http.get(this.geturl(beginDate, endDate)).subscribe((data: any) => {
                this.totalWeek_fees = this.is_pay == 1 ? data.total_fees : 0;
            })
        } else {
            this.totalWeek_fees = '';
        }
    }
    reqGetMonth() {
        if(this.monthModel != ''){
            let {beginDate, endDate} = month2send(this.monthModel)
            this.http.get(this.geturl(beginDate, endDate)).subscribe((data: any) => {
                this.totalMonth_fees = this.is_pay == 1 ? data.total_fees : 0;
            })
        } else {
            this.totalMonth_fees = ''
        }
    }
    reqGetOrder() {
        console.log(typeof this.dateModel)
        let {beginDate, endDate} = anyRange2send(this.dateModel)
        
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.http.get(this.geturl(beginDate, endDate)).subscribe((data: any) => {
            this.orderNumber = data.count;
            this.orderList = data.list;
            this.total_fees = this.is_pay == 1 ? data.total_fees : 0;
            this.pages = Math.ceil(data.count / this.pageItems);
            this.refund = data.refund;
            this.refund_fees = data.refund_fees;
            this.img_count = data.img_count;
            this.refund_img_count = data.refund_img_count;
            this.refund_count = data.refund_count;
        })
    }
    touchToreqGetOrder(event) {
        
        console.log(event)
        this.pageIndex = 1;
        let {beginDate, endDate} = anyRange2send(event);
        this.beginDate = beginDate;
        this.endDate = endDate;
        // let {beginDate, endDate} = this.anyRange2send(this.dateModel)
        this.http.get(this.geturl(beginDate, endDate)).subscribe((data: any) => {
            this.orderNumber = data.count;
            this.orderList = data.list;
            this.total_fees = this.is_pay == 1 ? data.total_fees : 0;
            this.pages = Math.ceil(data.count / this.pageItems);
            this.refund = data.refund;
            this.refund_fees = data.refund_fees;
            this.img_count = data.img_count;
            this.refund_img_count = data.refund_img_count;
            this.refund_count = data.refund_count;
        })
    }


    /* 获取项目列表*/
    getProjectList() {
        this.http.get(environment.apiServer + '/project/list?user_id=' + this.user_id).subscribe(res => {
            this.porjectList = res;
            this.selProjectId = res[0].project_id
            this.getActivityList();
        });
    }
    /* 获取活动列表*/
    getActivityList() {
        this.http.get(environment.apiServer + '/activity/list?project_id=' + this.selProjectId).subscribe(
            res => {
                // this.selActivityId = res[0].activity_id
                (res as Array<object>).unshift({activity_id:'', activity_name: '全部'})
                this.activityList = res;
                this.pageRequest();
            }
        );
        
    }

    /*
     * 选择活动
     */
    onActivitySelected() {
        this.pageRequest();
    }
    onProjectSelected() {
        this.getActivityList();
    }
    
    touchToDownload(){
        this.http.get(this.geturlToDownload(this.beginDate, this.endDate, '0')).subscribe((data: any) => {
            let finalDate = data.list.map(item => {
                return {
                    '订单时间': item.time,
                    '订单号':item.order_id,
                    '收入金额': item.total_fee/100,
                    '打印数量': item.print.length
                }
            });
            
            let project_name = this.porjectList.find(item => item.project_id === this.project_id)['project_name']
            
            finalDate.unshift({
                '订单时间': '选取时间',
                '订单号': this.beginDate,
                '收入金额': this.endDate,
                '打印数量': ''
            })
            finalDate.unshift({
                '订单时间': '项目名称',
                '订单号': project_name,
                '收入金额': '',
                '打印数量': ''
            })
            finalDate.push({
                '订单时间': '总计',
                '订单号': data.count,
                '收入金额': data.total_fees/100,
                '打印数量': data.img_count

            })
            JSONToExcelConvertor(finalDate, `${this.beginDate}-${this.endDate}`);
        })
    }
    /*
     * 替换任务状态为汉字
     */
    // replaceTaskState(state) {
    //     switch (state) {
    //         case 'create':
    //             return '创建';
    //         case 'uploading':
    //             return '上传';
    //         case 'data.ready':
    //             return '准备';
    //         case 'start':
    //             return '剪辑';
    //         case 'complete':
    //             return '成功';
    //         case 'abort':
    //             return '损坏';
    //         default:
    //             return state
    //     }
    // }

    /*
     * 上一页
     */
    pageUp() {
        if (this.pageIndex > 1) {
            this.pageIndex--;
            this.reqGetOrder()
        }
    }
    

    /*
     * 下一页
     */
    pageDown() {
    
        if (this.pageIndex < this.pages) {
            this.pageIndex++;
            this.reqGetOrder()
        }
    }
    downToTouch(event) {
        if(event.keyCode==13){
            this.reqGetOrder()
        }
    }

    // 实现点击input弹出日历控件
    touchToactive(e){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isChrome = userAgent.indexOf("Chrome") > -1;
        if(isChrome){
            if(e.path.length > this.calendarBtnLength) return;
            // this.calendarBtnLength = e.path.length;
            e.stopPropagation()
            let a = (document.getElementsByClassName('btnpickerenabled')[0] as HTMLButtonElement)
            a .click();
        }
    }
    onChange(result: Date): void {
        console.log('onChange: ', result);
    }

    getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
    }
    toggleFlag(order_id):void {
        console.log('toggleFlag')
        let index = this.orderList.findIndex(order => order.order_id === order_id)
        let refund = this.orderList[index].refund === '0' ? '1' : '0'
        this.orderList[index].refund = 'pending';
        console.log(this.orderList)
        let url = `${this.server}admin/order/refund`;
        let params = {order_id:order_id, refund: refund};
        this.http.get(url, {params: params}).subscribe(data => {
            this.nzMessageService.info('退款成功');
            this.reqGetOrder()
        })
    }

}