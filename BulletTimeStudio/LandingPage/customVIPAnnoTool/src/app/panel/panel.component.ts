import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SocketService } from '../socket/socket.service';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  apiServer = environment.apiServer;
  commTextArr = [];
  commVideoArr = [];
  commAudioArr = [];
  keyWordSettingArr = [];
  commercialText = '';
  commTextIndex = -1;
  commVideoIndex = -1;
  commAudioIndex = -1;
  videoProcessing = false;

  keywordTypeArr = ['name', 'year', 'property', 'deparment', 'current', 'target', 'gift'];
  keywordTypeMap = new Map<string, string>();
  keywordMaterialArr = [
    'name',
    'year',
    'VIP.jpg',
    'deparment',
    'current',
    'target',
    'gift'
  ];
  keywordMaterialMap = new Map<string, string>();

  videoProcess = '';
  videoLink = '';

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.listenVideoAvailable();
    this.listenVideoProcess();

    this.getCommercialTextTemplate();
    this.getCommercialVideoTemplate();
    this.getCommercialAudioTemplate();
    // this.getMaterialTemplate();

    // this.socketService.sendVideoAvailbale('123');
  }

  listenVideoAvailable() {
    this.socketService.listenVideoAvailbale()
      .subscribe(data => {
        console.log('Video link = ' + data);
        this.videoLink = data.toString();
      });
  }

  listenVideoProcess() {
    this.socketService.listenVideoProcess()
      .subscribe(data => {
        console.log('Video process = ' + data);
        this.videoProcess = '影片剪輯進度: ' + data;
        if (data === '100%') {
          this.videoProcessing = false;
        }
      });
  }

  getCommercialTextTemplate() {
    this.http.get(this.apiServer + 'customize/get_text_template')
    .subscribe(data => {
      this.pushArray(data, this.commTextArr);
    });
  }

  getCommercialVideoTemplate() {
    this.http.get(this.apiServer + 'customize/get_video_template')
    .subscribe(data => {
      this.pushArray(data, this.commVideoArr);
    });
  }

  getCommercialAudioTemplate() {
    this.http.get(this.apiServer + 'customize/get_audio_template')
    .subscribe(data => {
      this.pushArray(data, this.commAudioArr);
    });
  }

  getMaterialTemplate() {
    for (let i = 0; i < this.keywordTypeArr.length; i++) {
      switch (this.keywordTypeArr[i]) {
        case 'name':
          this.keywordMaterialArr.push('name');
          break;
        case 'year':
          this.keywordMaterialArr.push('year');
          break;
        case 'property':
          this.keywordMaterialArr.push('VIP.jpg');
          this.keywordMaterialArr.push('VIP2.jpg');
          break;
        case 'deparment':
          this.keywordMaterialArr.push('deparment');
          break;
        case 'current':
          this.keywordMaterialArr.push('current');
          break;
        case 'target':
          this.keywordMaterialArr.push('target');
          break;
        case 'gift':
          this.keywordMaterialArr.push('gift');
          break;
      }
    }
  }

  pushArray(data, targetArr) {
    if (data['code'] === 0) {
      console.log('data=' + JSON.stringify(data));
      const dataLen = Object.keys(data['result']).length;
      for (let i = 0; i < dataLen; i++) {
        targetArr.push(data['result'][i]);
      }
    }
  }

  commercialParsing() {
    console.log('this.commercialText=' + this.commercialText);
    if (this.commercialText) {
      this.keyWordSettingArr = []; // Clear keyWord array
      let keyWordStart = -1;
      for (let i = 0; i < this.commercialText.length; i++) {
        if (this.commercialText[i] === '[') {
          keyWordStart = i;
          continue;
        }
        if (this.commercialText[i] === ']') {
          if ((keyWordStart < 0) || (i - (keyWordStart + 1) === 0)) {
            continue;
          }
          this.keyWordSettingArr.push({
            'keyword': this.commercialText.substr(keyWordStart + 1, i - (keyWordStart + 1)),
            'type': '',
            'material': '',
            'start_time': '0',
            'end_time': '0',
          });
          keyWordStart = -1;
        }
      }
      this.setDefaultTypeAndMaterial();
    }
  }

  setDefaultTypeAndMaterial() {
    for (let i = 0; i < this.keywordTypeArr.length; i++) {
      console.log('this.keywordMaterialArr[' + i + ']=' + this.keywordMaterialArr[i]);
      this.keyWordSettingArr[i].type = this.keywordTypeArr[i];
      this.keyWordSettingArr[i].material = this.keywordMaterialArr[i];
    }
  }

  selectType(index, value) {
    console.log('selectType index=' + index);
    console.log('selectType value=' + value);
    this.keyWordSettingArr[index].type = this.keywordTypeArr[value][0];
    // this.keywordTypeMap.set(index.toString(), this.keywordTypeArr[value]);
  }

  selectMaterial(index, value) {
    console.log('selectMaterial index=' + index);
    console.log('selectMaterial value=' + value);
    this.keyWordSettingArr[index].material = this.keywordMaterialArr[value];
    // this.keywordMaterialMap.set(index.toString(), this.keywordMaterialArr[value]);
  }

  async startCustomVideo() {
    console.log('keyWordSettingArr=' + JSON.stringify(this.keyWordSettingArr));

    console.log('this.commVideoIndex=' + this.commVideoIndex);
    if ((this.commVideoIndex === -1) || (this.commVideoIndex === undefined)) {
      alert('請選取影片樣板');
      return;
    }

    for (let i = 0; i < this.keyWordSettingArr.length; i++) {
      if ((this.keyWordSettingArr[i].type === '') ||
        (this.keyWordSettingArr[i].material === '') ||
        (this.keyWordSettingArr[i].start_time === '') ||
        (this.keyWordSettingArr[i].end_time === '')) {
          alert('請設定好所有關鍵字素材及秒速再開始剪輯');
          return;
      }
    }

    const body = {
      'type': 'customVideo',
      'description': this.commercialText,
      'video': this.commVideoArr[this.commVideoIndex].videoName,
      'parameter': this.keyWordSettingArr
    };

    if (confirm('確定要開始剪輯？')) {
      console.log('開始剪輯');
      this.videoProcessing = true;
      // Send task to server
      const ret = await this.http.post(this.apiServer + 'task/task_create', body).toPromise();
      console.log('ret=' + JSON.stringify(ret));
      if (ret['code'] === 0) {
        const update_body = {
          'taskId': ret['result'].taskId,
          'state': 'data.ready'
        };
        console.log('ret=' + JSON.stringify(ret));
        await this.http.post(this.apiServer + 'task/task_update', update_body).toPromise();
        this.videoProcess = '影片剪輯進度: 0%';
      }
    } else {
      console.log('取消剪輯');
    }
  }
}
