import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'ngx_test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})

export class TestComponent implements OnInit {
    constructor(
        private http: HttpClient,
    ) {
    }


    result: '';// log结果
    activityList: any;//所有活动列表
    activity_test = [];//选择测试的活动


    ngOnInit() {
        this.getActivityList()


    }
    // 获取数据
    async getActivityList() {

        let res = await this.http.get(environment.apiServerData + '/activity/list?company_id=' + '').toPromise()
        console.log('activity res:', res)
        this.activityList = res
        console.log('this.activityList:', this.activityList)
        localStorage.setItem('activityList', JSON.stringify(this.activityList));
    }
    // 选择活动
    chooseActivityId(i) {
        console.log(i)
        for (var k = 0; k <= this.activityList.length - 1; k++) {
            if (this.activityList[k]['activity_id'] == this.activity_test[i]['activity_id']) {
                this.activity_test[i] = this.activityList[k];
            }
        }
        console.log('this.activity_test', this.activity_test)
        this.activityList = JSON.parse(localStorage.getItem('activityList'))

    }

    // 开始测试
    begin_test(i) {
        console.log(this.activity_test)
        let body = {
            "activity_id": this.activity_test[i].activity_id,
            "wait": this.activity_test[i].wait,
            "count": this.activity_test[i].count,
            "from": localStorage['browser_device_id'],
            "requestId": localStorage['browser_device_id'] + '_' + Date.now(),
        }
        console.log(body)
        this.http.post(`${environment.apiServer}/activity/pressure_test`, body).subscribe(data => {
            console.log('data:', data)
            alert(data['description'])

        });
    }
    // 删除活动
    delete_activity(i) {
        this.activity_test.splice(i, 1);
        console.log(this.activity_test)
    }
    // 添加活动
    add_activity() {
        this.activity_test.push(this.activityList[0])
        this.activityList = JSON.parse(localStorage.getItem('activityList'))
        console.log('this.activity_test:', this.activity_test);
    }
    // 重置log结果
    reset_result() {
        this.result = ''
    }
    // 保存log到本地
    save_result() {
        console.log(4);
    }
    // 离开页面
    leave() {
        history.go(-1)//返回上一次访问的页面
    }

}

