import {Component, forwardRef, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


var moment = require('moment');

@Component({
  selector: 'ngx-tasklist',
  styleUrls: ['./tasklist.component.scss'],
  templateUrl: './tasklist.component.html',

})
export class TasklistComponent {

  constructor(private http: HttpClient) {
  }

  /*创建时间*/
  createdAt: string;
  taskList: any;
  /*任务状态*/
  state = '';
  /*时间排序*/
  sort = '';
  createTimeSort: boolean = true;
  /*每页多少条数据*/
  pageItems = 50;
  /*第几页*/
  pageIndex = 1;
  /*一共多少页*/
  pages = 1;
  /* task数量 */
  taskCount = 0;

  /*用户过滤*/
  userList = [];
  selPhone: string;
  selUserId: string;

  /*活动过滤*/
  activityList = [];
  selActivity: string;
  selActivityId: string;

  async ngOnInit() {

    this.createdAt = moment(new Date()).format('YYYY-MM-DD');
    this.selUserId = localStorage.getItem('selUserId') || ''
    this.selPhone = localStorage.getItem('selPhone') || '全部'
    this.selActivityId = localStorage.getItem('selActivityId') || ''
    this.selActivity = localStorage.getItem('selActivity') || '全部'
    this.getUserList();

  }

  /*
   * 用户列表
   */
  async getUserList() {

    this.http.get(environment.apiServerData + '/user/list').subscribe((data: any) => {
      this.userList = data;
      this.userList.unshift({'phone': '全部', 'user_id': ''});
      this.getActivityList()
    })

  }

  /*
   * 活动列表
   */
  async getActivityList() {

    this.http.get(environment.apiServerData + '/activity/list?user_id=' + this.selUserId).subscribe((data: any) => {
      this.activityList = data;
      this.activityList.unshift({'activity_name': '全部', 'activity_id': ''});
      this.getTaskList(true)
    })

  }

  /*
   * 上一页
   */
  pageUp() {

    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.getTaskList(false)
    }

  }

  /*
   * 下一页
   */
  pageDown() {

    if (this.pageIndex < this.pages) {
      this.pageIndex++;
      this.getTaskList(false)
    }

  }

  /*
   * 选择用户
   */
  onUserSelected() {

    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].phone === this.selPhone)
        this.selUserId = this.userList[i].user_id
    }
    localStorage['selUserId'] = this.selUserId;
    localStorage['selPhone'] = this.selPhone;
    this.getActivityList();
    this.selActivityId = this.activityList[0].activity_id
    this.selActivity = this.activityList[0].activity_name

  }

  /*
   * 选择活动
   */
  onActivitySelected() {

    for (let i = 0; i < this.activityList.length; i++) {
      if (this.activityList[i].activity_name === this.selActivity)
        this.selActivityId = this.activityList[i].activity_id
    }
    localStorage['selActivityId'] = this.selActivityId;
    localStorage['selActivity'] = this.selActivity;
    this.getTaskList(false);

  }

  /*
   * 视频列表
   */
  async getTaskList(refreshIndex) {

    if (refreshIndex) {
      this.pageIndex = 1
    }
    let url = environment.apiServerData + '/task/list?createdAt=' + this.createdAt + '&start=' + (this.pageIndex - 1) * this.pageItems + '&limit=' + this.pageItems + '&user_id=' + this.selUserId + '&activity_id=' + this.selActivityId + '&state=' + this.state + '&sort=' + this.sort;
    console.log('url:', url);
    this.http.get(url).subscribe((data: any) => {
      this.taskList = data.list;
      this.taskCount = data.count
      console.log(this.taskList)
      this.pages = Math.ceil(data.count / this.pageItems);
    })

  }

  /* 通过create排序*/
  sortByCreateTime() {
    this.sort = this.sort == '' ? '1' : ''
    this.createTimeSort = this.sort == '' ? true : false;
    this.getTaskList(true)
  }

  /*
   * 检测视频
   */
  async checkVideo(data) {
    const url = `${environment.apiServer}/task/get_task_file_lists`;
    const response: any = await this.http.post(url, data.task).toPromise();
    if (response['result'].length > 0) {
      const fileNameList = response['result'].split('\n');
      fileNameList.pop();
      fileNameList.forEach((file, index) => {
        if (confirm(file)) {
          window.open("https://siiva-video.oss-cn-hangzhou.aliyuncs.com/" + file)
        }
      })
    } else {
      alert('no file');
    }
  }

  /* 点击启动 */
  async clickRun(data) {

    if (data.activity_id) {
      let url = environment.apiServerData + '/activity?activity_id=' + data.activity_id;
      this.http.get(url).subscribe((res: any) => {
        console.log('res:', res)
        let files_len = 0
        if (data.task && data.task.files) {
          files_len = data.task.files.length
        }

        if (res && res.settings && res.settings.dst && res.settings.dst.url && files_len < res.settings.camera_setting.cameras.length) {
          // 有fileServer的活动, 点启动代表上传视频
          this.http.get(environment.apiServer + '/task/send_local_cloud?taskId=' + data.task.taskId).subscribe((response: any) => {
            console.log('response:', response)
            if (response && response.createdAt) {
              alert("已通知file_server上传")
            }

          })
        } else {
          // 没有fileServer的活动, 点启动代表通知worker剪辑
          this.updateTask(data)
        }
      })
    }

  }

  /*
   * 更新任务
   */
  async updateTask(data) {

    const fileNameUrl = `${environment.apiServer}/task/get_task_file_lists`;
    const fileNameRes: any = await this.http.post(fileNameUrl, data.task).toPromise();
    const fileNameList = fileNameRes['result'].split('\n');
    fileNameList.pop();
    const update = {
      taskId: data.task.taskId,
      fileName1: fileNameList[0],
      fileName2: fileNameList[1],
      fileName3: fileNameList[2],
      state: 'data.ready',
      type: 'soccer',
    };
    const url = `${environment.apiServer}/task/update_task_to_ready`;
    const response: any = await this.http.post(url, update).toPromise();
    console.log('response:', response)
    if (response && response.code == 0) {
      console.log('直接启动')
      alert('启动任务成功')
    }

  }

  /*
   * 删除一条任务
   */
  async delTask(data) {
    if (confirm("确定删除?")) {
      const url = `${environment.apiServer}/task/del?taskId=${data.task.taskId}`;
      const response: any = await this.http.get(url).toPromise();
      if (response.result.nModified === 1) {
        // 删除成功
        const delIndex = this.taskList.indexOf(data);
        if (delIndex >= 0) {
          this.taskList.splice(delIndex, 1)
        }
      }
    }
  }

  /*
   * 替换mode为汉字
   */
  replaceTaskMode(mode) {
    switch (mode) {
      case 'photo':
        return '照片';
      case 'video':
        return '视频';
      case 'movie':
        return '视频';
      default:
        return mode
    }
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

  /*
   * 替换拍摄方式为汉字
   */
  replaceTasktriggerBy(triggerBy) {
    // console.log('triggerBy:', triggerBy)
    switch (triggerBy) {
      case 'manual':
        return '手动';
      case 'handshake_event':
        return '自动';
      case 'remote_test':
        return '测试';
      case undefined:
        return '手动';
      default:
        return triggerBy
    }
  }

}
