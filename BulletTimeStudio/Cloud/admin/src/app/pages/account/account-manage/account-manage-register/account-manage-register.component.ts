import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { environment } from '../../../../../environments/environment';
import { FormBuilder  } from '@angular/forms'
import { CookieService } from 'ngx-cookie-service';
import { UploadImageService } from '../../../share/upload-image.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
enum ACCOUNT_ROLE {
  GROUP_ADMIN,
  GROUP_CUSTOMER,
}

@Component({
  selector: 'ngx-account-manage-register',
  templateUrl: './account-manage-register.component.html',
  styleUrls: ['./account-manage-register.component.scss'],
})
export class AccountManageRegisterComponent implements OnInit {
  server = environment.apiServerData;
  // roleEnum = ACCOUNT_ROLE;
  // selectRole = this.roleEnum.GROUP_ADMIN;
  // selectMsg = "";
  // account="";
  // pw="";
  data = {
    "admin": "",
    "password": "",
    "role": {
      "admin": [],
      "owner": [],
      "siteAdmin": []
    }
  };
  param: string;
  isStep1_OK: boolean = false;
  isStep2_OK: boolean = false;
  isStep3_OK: boolean = false;
  isshowOriginalMode: boolean = true;
  fileToUpload: File = null;
  BannerImg_upload_finish: boolean = false;
  HomeImg_upload_finish: boolean = false;

  // 公司创建变量名
  selected_companyId: "";
  CompanyList: any;
  company_form = this.fb.group({
  company_id: "",
  companyName: "",
  mark: "",
  leaderName: "",
  leaderPhoneNumber: "",
  mini_name: "",
  })

  // 创建账号变量名
  AccountList: any;
  selected_account: "";
  account_form = this.fb.group({
    user_id: "",
    nick_name: "",
    account: "",
    password: "",
  })

  // 创建项目变量名
  ProjectList: Array<object>;
  selected_projectId: string = "";
  project_form = this.fb.group({
    project_name: "",
    partner_to: "",
    charge_account: "",
    project_manger: "",
    phone: "",
    passwd: "",
  })

  // 创建活动变量名
  ActivityList: any;
  selected_activityId: "";
  activity_form = this.fb.group({
    activity_id: "",
    activity_name: "",
    activity_mark: "",
    banner_url: "",
    homepage_url: "",
    address: "",
    latitude: "",//纬度
    longitude: "",//经度
  })


  constructor(
    private http: HttpClient,
    private cookieService: CookieService, private imageService: UploadImageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getCompanyList()

  }
  input() {
    console.log(this.data)
  }

  // 新增公司
  Add_company() {
    
    this.isStep1_OK = true;
    //var company_ne =  this.company_form.value.companyName
    let body = {
      ...this.CompanyList.value,
      "company_name": this.company_form.value.companyName,
      "leader": this.company_form.value.leaderName,
      "phone": this.company_form.value.leaderPhoneNumber,
      "mark": this.company_form.value.mark,
      "mini_name": this.company_form.value.mini_name
      
    }
    console.log(body)
    this.http.post(this.server + '/company/create', body)
      .subscribe(data => {
        console.log(data)
        if (data["code"] == 0) {
          alert("公司创建成功");
          this.isStep1_OK = true;
          this.selected_companyId = data["company_id"];
          // this.company_id = data["company_id"];
          this.getCompanyList()
        } else {
          alert("公司创建失败，请重新输入")
        }
      })
  }

  // 选择公司
  chooseCompangId() {
     console.log(this.selected_companyId)
    let index = this.CompanyList.findIndex(item => item.company_id === this.selected_companyId)
    this.company_form.reset()
    if(index !== -1){
      this.company_form.patchValue({...this.CompanyList[index]})
      this.isStep1_OK = true;
      this.getProjectList();
      this.getAccountList()
    }
    // for (var i = 0; i <= this.CompanyList.length - 1; i++) {
    //   if (this.CompanyList[i]['company_name'] == this.selected_companyId) {
    //     //  console.log(this.CompanyList[i])
    //     this.companyName = this.CompanyList[i]["company_name"];
    //     this.mark = this.CompanyList[i]["mark"];
    //     this.leaderName = this.CompanyList[i]["leader"];
    //     this.leaderPhoneNumber = this.CompanyList[i]["phone"];
    //     this.company_id = this.CompanyList[i]["company_id"]
    //     this.mini_name = this.CompanyList[i]["mini_name"]
    //     console.log(this.company_id)
    //     this.isStep1_OK = true;
    //     // this.getAccountList(this.company_id);
    //     // this.getActivityList(this.company_id)
    //     this.getProjectList(this.company_id)
    //   }
    // }
  }
  // 创建账号
  Add_account() {
    console.log("公司ID是:" + this.selected_companyId)
    let { account:phone, password:passwd, nick_name } = this.account_form.value;
    let body = {
      "company_id": this.selected_companyId,
      "project_id": this.selected_projectId,
      // ...this.account_form.value,
      "nick_name": nick_name,
      "phone": phone,
      "passwd": passwd
    }
    console.log(body)
    this.http.post(this.server + '/user/create', body)
      .subscribe(data => {
        console.log(data)
        if (data["code"] == 0) {
          alert("账号创建成功");
          this.isStep2_OK = true;
        } else {
          alert("账号创建失败，请重新输入")
        }
        this.getAccountList()
      })
  }
  // 选择账号
  chooseAccount() {
    console.log(this.selected_account)
    // this.account = this.selected_account;
    let index = this.AccountList.findIndex(item => item.phone === this.selected_account)
    console.log('__________________')
    this.account_form.reset()
    if(index !== -1){
      // 名称跟后台不一致 需要特别注意
      this.account_form.patchValue({...this.AccountList[index], 'account': this.selected_account})
    }
    // for (var i = 0; i <= this.AccountList.length - 1; i++) {
    //   if (this.selected_account == this.AccountList[i]['phone']) {
    //     this.account_form.reset()
    //     // 名称跟后台不一致 需要特别注意
    //     this.account_form.patchValue({...this.AccountList[i], 'account': this.selected_account})
    //     // this.user_id = this.AccountList[i]['user_id'];
    //     // this.nick_name = this.AccountList[i]['nick_name'];
    //   }
    // }
  }

  // 修改项目
  Amend_project() {
    console.log("项目ID是:" + this.selected_projectId)
    let body = {
      "project_id": this.selected_projectId,
      ...this.project_form.value
    }
    console.log(body)
    this.http.post(this.server + '/project/update', body)
      .subscribe(data => {
        console.log(data)
        if (data["code"] == 0) {
          alert("项目修改成功");
          this.isStep3_OK = true;
        } else {
          alert(data["info"])
        }
        this.getProjectList()
      })
  }
  // 创建项目
  Add_project() {
    console.log("项目ID是:" + this.selected_projectId)
    let body = {
      "company_id": this.selected_companyId,
      ...this.project_form.value
    }
    console.log(body)
    this.http.post(this.server + '/project/create', body)
      .subscribe(data => {
        console.log(data)
        if (data["code"] == 0) {
          alert("项目创建成功");
          this.isStep3_OK = true;
        } else {
          alert("活动创建失败，请重新输入")
        }
        this.getProjectList()
      })
  }
  // 创建活动
  Add_activity() {
    console.log("公司ID是:" + this.selected_companyId)
    let { banner_url:banner, 
      homepage_url:leadpage, 
      activity_mark:mark, 
      longitude:lon, 
      latitude:lat, 
      activity_name,
    address } = this.activity_form.value;
    let body = {
      "project_id": this.selected_projectId,
      "company_id": this.selected_companyId,
      banner,
      leadpage,
      mark,
      

      ...this.activity_form.value,
      // "activity_name": this.activity_name,
      // "banner": this.banner_url,
      // "leadpage": this.homepage_url,
      // "address": this.address,
      // "mark": this.activity_mark,
      // "lon": this.longitude,
      // "lat": this.latitude
    }
    console.log(body)
    this.http.post(this.server + '/activity/create', body)
      .subscribe(data => {
        console.log(data)
        if (data["code"] == 0) {
          alert("活动创建成功");
          this.isStep3_OK = true;
        } else {
          alert(data['info'])
        }
        this.getActivityList()
      })
  }

  // 获取公司列表
  getCompanyList() {
    this.http.get(this.server + '/company/list')
      .subscribe(data => {
        //  console.log(data)
        this.CompanyList = data
        if(this.CompanyList.length === 0){
          alert('网络错误')
        }
        console.log(this.CompanyList)
      })
  }

  // 获取项目列表
  getProjectList() {
    this.http.get(this.server + '/project/list', { params: { 'company_id': this.selected_companyId } })
      .subscribe(data => {
        this.ProjectList = data as Array<object>;
        // if(!this.selected_projectId || this.selected_projectId === ""){
          if(this.ProjectList.length === 0){
            this.activity_form.reset()
            this.project_form.reset()
            this.ActivityList = null;
            return
          }
          this.selected_projectId = this.ProjectList[0]['project_id']
          console.log(this.selected_projectId)
          this.chooseProjectId()


      })
  }

  // 获取活动列表
  getActivityList() {
    this.http.get(this.server + '/activity/list', { params: { 'project_id': this.selected_projectId } })
      .subscribe(data => {
        //  console.log(data)
        this.ActivityList = data
        console.log(this.ActivityList)
        if(this.ActivityList.length === 0){
          this.activity_form.reset()
            return ;
        }
        console.log(this.selected_activityId)
        // if(!this.selected_activityId || this.selected_activityId===""){
          this.selected_activityId = this.ActivityList[0].activity_id
          console.log(this.selected_activityId)
          this.chooseActivityId()
        // }
      })
  }
  // 获取账号列表
  getAccountList() {
    this.http.get(this.server + '/user/list', { params: { 'project_id': this.selected_projectId, 'company_id': this.selected_companyId, 'activity_id': this.selected_activityId } })
      .subscribe(data => {
        this.AccountList = data
        console.log(this.AccountList)
        
        if(this.AccountList.length === 0){
          this.account_form.reset()
          return
        }
        this.selected_account = this.AccountList[0]['phone']
        this.chooseAccount()
      })
  }


  // 选择项目
  chooseProjectId() {
    console.log(this.selected_projectId)
    let index = this.ProjectList.findIndex(item => item['project_id'] === this.selected_projectId)
    this.project_form.reset()
    this.activity_form.reset()
    if(index !== -1){
      this.project_form.patchValue({...this.ProjectList[index]})
      this.getActivityList()
      // 账号暂时 不与项目相关
      // this.getAccountList()
    }
  }

  // 选择活动
  chooseActivityId() {
    console.log(this.selected_activityId)
    let index = this.ActivityList.findIndex(item => item['activity_id'] === this.selected_activityId)
    console.log(index, this.ActivityList)
    this.activity_form.reset();
    if(index !== -1){
      // 别名对应 欢迎修改
      let {
        activity_name,
        address,
        mark:activity_mark,
        banner: banner_url,
        leadpage: homepage_url,
        activity_id,
        lat: latitude,
        lon: longitude
      } = this.ActivityList[index];
      this.activity_form.patchValue({
        activity_name,
        address,
        activity_mark,
        banner_url,
        homepage_url,
        activity_id,
        latitude,
        longitude})
    }
    // this.activity_name = this.ActivityList[i]['activity_name'];
    // this.address = this.ActivityList[i]['address'];
    // this.activity_mark = this.ActivityList[i]['mark'];
    // this.banner_url = this.ActivityList[i]['banner']
    // this.homepage_url = this.ActivityList[i]['leadpage']
    // this.activity_id = this.ActivityList[i]['activity_id']
    // this.latitude = this.ActivityList[i]['lat']
    // this.longitude = this.ActivityList[i]['lon']
  }

  // 绑定账号和活动
  bind() {
    let { user_id } = this.account_form.value;
    // console.log(this.account)
    // console.log(this.activity_name)
    console.log(user_id)
    // console.log(this.activity_id)
    this.http.get(this.server + '/activity/bind_account', { params: { 'activity_id': this.selected_activityId, 'user_id': user_id } })
      .subscribe(data => {
        console.log(data)
        if (data['code'] == 0) {
          alert('绑定成功')
        } else {
          alert('绑定失败，请重新绑定')
        }
      })
  }
  onclose() {
    location.reload()
  }
  prient(data) {
    this.isshowOriginalMode = data == 1 ? false : true;
  }
  sendJSON() {
    console.log(this.param)
  }
  quitJSON() {
    this.param = "";
  }

  handleFileInput(file: FileList, Type: string) {
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload)
    this.imageService.postFile(this.fileToUpload, 'account').subscribe(
      data => {
        console.log(data)
        // 上传成功
        if (data['code'] == 0) {
          switch (Type) {
            case 'banner':
              this.activity_form.patchValue({'banner_url': data['iofo']})
              // banner_url = data['info'];
              this.BannerImg_upload_finish = true;
              break;
            case 'homepage':
                this.activity_form.patchValue({'homepage_url': data['iofo']})
              // homepage_url = data['info'];
              this.HomeImg_upload_finish = true;
              break;
            default:
              console.log('没有此类型');
              break;
          }
        } else {
          alert('上传失败，请重新上传')
        }
      }
    );

  }



  // register() {
  //   const acc = (<HTMLInputElement>document.getElementById('acc')).value;
  //   const pwd = Md5.hashStr((<HTMLInputElement>document.getElementById('pwd')).value);
  //   const desc = (<HTMLInputElement>document.getElementById('desc')).value;
  //   const body = {
  //     'account': acc,
  //     'password': pwd,
  //     'role': this.selectRole,
  //     'description': desc,
  //     'access_token': this.cookieService.get( 'CloudAdminToken' ),
  //   };
  //   this.http.post(this.server + 'account/v2/account_register', body)
  //   .subscribe(data => {
  //     if (data['code'] === 0) {
  //       this.selectMsg = data['description'];
  //     }else {
  //       this.selectMsg = data['description'];
  //     }
  //   }, err => {
  //     this.selectMsg = err.toString();
  //   });
  // }

}
