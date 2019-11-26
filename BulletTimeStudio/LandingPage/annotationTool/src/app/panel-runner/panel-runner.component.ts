import 'rxjs/add/operator/map';

import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { SocketService } from '../socket/socket.service';
import { LoggerService } from '../loggerservice/logger.service';


@Component({
  selector: 'app-panel-runner',
  templateUrl: './panel-runner.component.html',
  styleUrls: ['./panel-runner.component.css']
})
export class PanelRunnerComponent implements OnInit {
  apiServer = environment.apiServer;
  mediaServer = environment.mediaServer;

  @ViewChild('MainPreview') mainPreview: ElementRef;
  @ViewChild('MainSeekBarView') mainSeekBarView: ElementRef;
  @ViewChild('ChildSeekBarView') childSeekBarView: ElementRef;
  @ViewChild('SampleImageView') sampleThumbnailView: ElementRef;
  @ViewChild('SampleChildImageView') sampleChildThumbnailView: ElementRef;
  @ViewChild('TaskPanelView') taskPanelView: ElementRef;
  @ViewChild('HotKeyMap') hotKeyMapView: ElementRef;
  @ViewChildren('TaskListView') taskListView;

  siteArr = [];
  teamArr = [];
  playerArr = [];
  imgArr = [];
  imgChildArr = [];
  taskArr = [];
  selectedPlayerArr = [2];
  radioStatusArr = [];
  radioGoalTypesArr = [true, false, false, false];
  goal_detail = {};

  siteId = '';
  goalbtn = true;
  timer: any;
  previewIndexMsg = '';
  mainThumbnailWidth = 0;
  childThumbnailWidth = 0;
  defaultPreview = '../../assets/default.png';
  currentPreviewImg = this.defaultPreview;
  currentThumbnailPreviewWidth = 0;
  currentThumbnailIndex = 0;
  currentChildThumbnailIndex = 0;
  currentTaskIndex = -1;
  currentGoalTypeIndex = 0;
  currentGoalTypeMsg = '跳投兩分';
  lastImageFrameNumber = 0;
  initSiteSetting = -1;
  canvas: any;
  canvas_context: any;

  constructor(
      private http: HttpClient,
      private socketService: SocketService,
      private cookieService: CookieService,
      private logger: LoggerService
  ) {}

  ngOnInit() {
    this.mainThumbnailWidth = this.sampleThumbnailView.nativeElement.width + 5;
    this.childThumbnailWidth = this.sampleChildThumbnailView.nativeElement.width + 5;
    this.logger.info('this.mainThumbnailWidth=' + this.mainThumbnailWidth);
    this.logger.info('this.childThumbnailWidth=' + this.childThumbnailWidth);

    // Get siteName by siteId
    this.getSiteDetail();

    // Get frame from media_server by using socket
    this.listenToFrame();
    this.listenGoalComplete();

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.hotKeyDown(event);
    });

    //  Listen goal event from media_worker
    this.listenDetectReply();
    this.listenDetectDetail();

    this.canvas = document.getElementById('MainPreviewCanvas');
    this.canvas_context = this.canvas.getContext('2d');
  }

  getSiteDetail() {
    this.http
        .get(
            this.apiServer + 'site/v2/get_basketAnnoSite')
            // `?accessToken=${this.cookieService.get('AnnoToolToken')}`)
        .subscribe(data => {
          if (data['code'] === 0) {
            const dataLen = Object.keys(data['result']).length;
            for (let i = 0; i < dataLen; i++) {
              this.siteArr.push(data['result'][i]);
            }

            this.initSiteSetting = (() => {
              const siteId = localStorage.getItem('siteId');
              const index = this.getIndexBySiteId(siteId);

              if (index >= 0) {
                this.onSelectSetting(index);
              }

              return index;
            })();
          }
        });
  }

  listenGoalComplete() {
    this.socketService.listenGoalComplete().subscribe(data => {
      // goal complete
      // if goal complete this data will contains a property "link", this link
      // property is origin production file link on cloud todo use link property
      // to tell user.
      this.logger.info('goal complete: link = ' + data['link']);
    });
  }

  listenDetectReply() {
    this.socketService.listenDetectReplyComplete().subscribe(data => {
      this.logger.info('Detect reply: ' + JSON.stringify(data));
      if (data['isScore']) {
        this.logger.info('frameNo=' + data['frame_no'] + ', 進了！！！');
        this.logger.info('rect_ball=' + JSON.stringify(data['rect_ball'].array));
        this.logger.info('rect_basket=' + JSON.stringify(data['rect_basket'].array));
        this.goal_detail[data['frame_no']] = {
          'rect_ball': data['rect_ball'].array,
          'rect_basket': data['rect_basket'].array
        };
        // console.log(JSON.stringify(this.goal_detail));
        const selectedTeamAndPlayer = this.playerArr[this.selectedPlayerArr[0]][this.selectedPlayerArr[1]];
        this.taskArr.unshift({
          'taskId': '',
          'team': this.teamArr[this.selectedPlayerArr[0]], // temp
          'player': selectedTeamAndPlayer, // temp
          'frame': this.calIndexToTime('main', Math.floor(data['frame_no'])),
          'img': '', // temp
          'mainIndex': Math.floor(Math.floor(data['frame_no'] / 30)),
          'childIndex': Math.floor(Math.floor(data['frame_no'] % 30)),
          'goalType': this.currentGoalTypeMsg, // temp
          'isTaskCreated': false
        });
        // console.log(JSON.stringify(data['frame_no']));
        // console.log(JSON.stringify(this.taskArr));

        this.taskArr.sort((a, b): number => {
          if (a.mainIndex > b.mainIndex) {
            return -1;
          } else if (a.mainIndex < b.mainIndex) {
            return 1;
          } else {
            if (a.childIndex > b.childIndex) {
              return -1;
            } else if (a.childIndex < b.childIndex) {
              return 1;
            }
            return 0;
          }
        });  // End this.taskArr.sort
      } else {
        this.logger.info('frameNo=' + data['frame_no'] + ', 沒進');
      }
    });
  }

  listenDetectDetail() {
    this.socketService.listenDetectDetailComplete().subscribe(data => {
      this.logger.info('Detect detail: ' + JSON.stringify(data));
    });
  }

  imageLoaded(url, cb) {
    const image = new Image();
    image.src = url;
    if (image.complete) {
      // Picture has been loaded
      cb(image);
    } else {
      // Callback if image lazy loading
      image.onload = () => {
        cb(image);
      };
    }
  }

  listenToFrame() {
    this.socketService.listenFrameAvailbale().subscribe((data: any) => {
      const frameNumber = parseInt(data.frame, 10);

      // Clear this.lastImageFrameNumber when receive frame
      if (frameNumber === 29) {
        if (this.lastImageFrameNumber !== 0) {
          this.lastImageFrameNumber = 0;
        }
      }

      let imgUrl = '';
      // Push first image into imgArr
      imgUrl = this.mediaServer + 'images/' + this.siteId + '/' +
          this.imageNumberPadding(this.lastImageFrameNumber, 8) + '.jpg';
      this.imgArr.push(imgUrl);

      // Workaround image too lazy to load
      if (this.lastImageFrameNumber === 0) {
        this.imageLoaded(imgUrl, () => {
          this.currentPreviewImg = this.imgArr[0];
          this.drawRectOnCanvas(0);
        });
      }

      // Push all 30 images into imgChildArr
      const arrIndex = Math.floor(frameNumber / 30);
      this.imgChildArr[arrIndex] = [];
      for (let i = this.lastImageFrameNumber; i <= frameNumber; i++) {
        imgUrl = this.mediaServer + 'images/' + this.siteId + '/' +
            this.imageNumberPadding(i, 8) + '.jpg';
        this.imgChildArr[arrIndex].push(imgUrl);
      }
      this.lastImageFrameNumber = frameNumber + 1;
      this.scrollListener();
    });
  }

  imageNumberPadding(n, paddingLen) {
    if (n.length >= paddingLen) {
      return n;
    }
    return this.imageNumberPadding('0' + n, 8);
  }

  blurTaskPanelBackground(index) {
    if (this.currentTaskIndex === -1) {
      return;
    }
    if (this.taskListView) {
      this.taskListView._results[index].nativeElement.style.background =
          'lightblue';
    }
  }

  focusTaskPanelBackground(index) {
    if (this.currentTaskIndex === -1) {
      return;
    }
    if (this.taskListView) {
      this.taskListView._results[index].nativeElement.style.background =
          'lightgreen';
    }
  }

  taskMouseoverListener(index) {
    this.focusTaskPanelBackground(index);
  }

  taskMouseoutListener(index) {
    if (index === this.currentTaskIndex) {
      return;
    }
    this.blurTaskPanelBackground(index);
  }

  doTaskListFocusAndBlur(index) {
    this.blurTaskPanelBackground(this.currentTaskIndex);
    this.currentTaskIndex = index;
    this.focusTaskPanelBackground(this.currentTaskIndex);
  }

  calIndexToTime(type, index) {
    const time = (type === 'main') ? Math.floor(index / 30) : this.currentThumbnailIndex;
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = (time % 3600) % 60;
    return (type === 'main') ? ('0' + hour).slice(-2) + ':' +
            ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2) + '_' + (index % 30) :
                               ('0' + hour).slice(-2) + ':' +
            ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2) + '_' + index;
  }

  scrollListener() {
    this.currentThumbnailIndex = Math.round(
        (this.mainThumbnailWidth +
         this.mainSeekBarView.nativeElement.scrollLeft) /
            (this.mainThumbnailWidth) -
        1);

    if (this.currentPreviewImg === this.defaultPreview) {
      this.currentThumbnailIndex = 0;
      this.currentChildThumbnailIndex = 0;
      // this.logger.info('this.currentPreviewImg === this.defaultPreview');
      // this.logger.info('this.currentThumbnailIndex=' + this.currentThumbnailIndex);
      // this.logger.info('this.currentChildThumbnailIndex=' + this.currentChildThumbnailIndex);
      this.currentPreviewImg =
          this.imgChildArr[this.currentThumbnailIndex][this.currentChildThumbnailIndex];
      this.previewIndexMsg = 'Frame index: ' +
          this.calIndexToTime('child', this.currentChildThumbnailIndex);
      this.drawRectOnCanvas(this.currentThumbnailIndex * 30 + this.currentChildThumbnailIndex);
    }

    // Main preview listener
    this.mainSeekBarView.nativeElement.onscroll = () => {
      // this.logger.info('scrollListener
      // this.mainSeekBarView.nativeElement.scrollLeft=' +
      // this.mainSeekBarView.nativeElement.scrollLeft);
      this.currentThumbnailIndex = Math.round(
          (this.mainThumbnailWidth +
           this.mainSeekBarView.nativeElement.scrollLeft) /
              (this.mainThumbnailWidth) -
          1);
      // this.logger.info('scrollListener this.currentThumbnailIndex=' +
      // this.currentThumbnailIndex);

      if (this.currentChildThumbnailIndex < this.imgChildArr.length) {
        // this.logger.info('this.currentChildThumbnailIndex < this.imgChildArr.length');
        // this.logger.info('this.currentThumbnailIndex=' +
        // this.currentThumbnailIndex);
        // this.logger.info('this.currentChildThumbnailIndex=' +
        // this.currentChildThumbnailIndex);
        this.currentPreviewImg =
            this.imgChildArr[this.currentThumbnailIndex][this.currentChildThumbnailIndex];
        this.previewIndexMsg = 'Frame index: ' +
            this.calIndexToTime('child', this.currentChildThumbnailIndex);
        this.drawRectOnCanvas(this.currentThumbnailIndex * 30 + this.currentChildThumbnailIndex);
      }

      // Move task list to the specific second
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setInterval(() => {
        // this.logger.info('End scrolling');
        for (let i = 0; i < this.taskArr.length; i++) {
          if (this.taskArr[i].mainIndex === this.currentThumbnailIndex) {
            this.taskListView._results[i].nativeElement.scrollIntoView(true);
            this.doTaskListFocusAndBlur(i);
            break;
          }
        }
        clearTimeout(this.timer);
      }, 1000);
    };

    // Child thumbnail preview listener
    this.childSeekBarView.nativeElement.onscroll = () => {
      this.currentChildThumbnailIndex = Math.round(
          (this.childThumbnailWidth +
           this.childSeekBarView.nativeElement.scrollLeft) /
              (this.childThumbnailWidth) -
          1);
      // this.logger.info('this.currentChildThumbnailIndex=' +
      // this.currentChildThumbnailIndex);
      if (this.currentChildThumbnailIndex < this.imgChildArr.length) {
        // this.logger.info('this.currentChildThumbnailIndex=' +
        // this.currentChildThumbnailIndex);
        // this.logger.info('this.currentChildThumbnailIndex < this.imgChildArr.length');
        this.currentPreviewImg =
            this.imgChildArr[this.currentThumbnailIndex][this.currentChildThumbnailIndex];
        this.previewIndexMsg = 'Frame index: ' +
            this.calIndexToTime('child', this.currentChildThumbnailIndex);
        this.drawRectOnCanvas(this.currentThumbnailIndex * 30 + this.currentChildThumbnailIndex);
      }
    };
  }

  getPreviousGoalTask() {
    this.http
        .get(
            this.apiServer + 'task/task_get_by_type?siteId=' + this.siteId +
            '&data_type=annoTool')
        .subscribe(data => {
          const dataLen = Object.keys(data['result']).length;
          if (dataLen) {
            for (let i = 0; i < dataLen; i++) {
              this.taskArr.unshift({
                'taskId': data['result'][i].task.taskId,
                'team': data['result'][i].task.team,
                'player': data['result'][i].task.player,
                'frame': data['result'][i].task.frame,
                'img': data['result'][i].task.img,
                'mainIndex': data['result'][i].task.mainIndex,
                'childIndex': data['result'][i].task.childIndex,
                'goalType': data['result'][i].task.goalType,
                'isTaskCreated': data['result'][i].task.isTaskCreated
              });

              this.taskArr.sort((a, b): number => {
                if (a.mainIndex > b.mainIndex) {
                  return -1;
                } else if (a.mainIndex < b.mainIndex) {
                  return 1;
                } else {
                  if (a.childIndex > b.childIndex) {
                    return -1;
                  } else if (a.childIndex < b.childIndex) {
                    return 1;
                  }
                  return 0;
                }
              });  // End this.taskArr.sort
            }      // End for
          }        // End if (dataLen)
        });
  }

  setDefaults() {
    this.goalbtn = true;
    // this.currentThumbnailIndex = 0;
    // this.currentChildThumbnailIndex = 0;
    this.currentTaskIndex = -1;
    this.lastImageFrameNumber = 0;
    this.teamArr = [];
    this.playerArr = [];
    this.imgArr = [];
    // this.imgChildArr = [];
    this.taskArr = [];
    this.selectedPlayerArr = [2];
    this.radioStatusArr = [];
    this.currentPreviewImg = this.defaultPreview;
    this.swiftImageIndex('main', 0);
    this.swiftImageIndex('child', 0);
  }

  onSelectSetting(index) {
    this.setDefaults();
    this.socketService.reConnect();
    this.siteId = this.siteArr[index].siteId;
    localStorage.setItem('siteId', index >= 0 && this.siteId);

    this.http
        .get(
            this.apiServer +
            'site/v2/get_basketAnnoTeamBySiteId?siteId=' + this.siteId)
        .subscribe(data => {
          if (data['code'] === 0) {
            const dataLen = Object.keys(data['result'].player).length;
            let playerIndex = 0;
            for (let i = 0; i < dataLen; i++) {
              // Add team name into teamArr
              // Ex. teamArr = ["team1", "team2"]
              if (this.teamArr.indexOf(data['result'].player[i].team) === -1) {
                this.teamArr.push(data['result'].player[i].team);
                this.playerArr[playerIndex] = [];
                this.radioStatusArr[playerIndex] = [];
                playerIndex++;
              }

              // Add player name into playerArr by teamIndex
              // Ex. playerArr[0] = ["team1's player1", "team1's player2", ...]
              //     playerArr[1] = ["team2's player1", "team2's player2", ...]
              const teamIndex =
                  this.teamArr.indexOf(data['result'].player[i].team);
              if (teamIndex !== -1) {
                let name = data['result'].player[i].name;
                const reg = new RegExp('[0-9]*号');
                const num = reg.exec(name);

                if (num) {
                  name = name.replace(num[0] as string, '');
                  name = num + ' ' + name;
                }

                this.playerArr[teamIndex].push(name);
                this.radioStatusArr[teamIndex].push(false);
              }
            }

            // Set radio default to team 1 player 1
            this.selectedPlayer(0, 0);

            // Get frame from media_server
            this.socketService.requestFrameBySiteId({'siteId': this.siteId});

            // Enabled goal btn
            this.goalbtn = false;

            // Blur goal event btn
            // this.logger.info('document.activeElement=' +
            // JSON.stringify(document.activeElement));
            const target = <HTMLSelectElement>document.activeElement;
            target.blur();

            // Get previous goal task from cloud/server
            this.getPreviousGoalTask();
          }
        });
  }

  clickPreview(role, index) {
    if (role === 'main') {
      this.swiftImageIndex('main', index);
      this.currentChildThumbnailIndex = 0;
      this.childSeekBarView.nativeElement.scrollLeft = 0;
    } else {
      this.swiftImageIndex('child', index);
    }

    if (this.currentChildThumbnailIndex < this.imgChildArr.length) {
      // this.logger.info('this.currentChildThumbnailIndex < this.imgChildArr.length');
      // this.logger.info('this.currentThumbnailIndex=' + this.currentThumbnailIndex);
      // this.logger.info('this.currentChildThumbnailIndex=' + this.currentChildThumbnailIndex);
      this.currentPreviewImg =
          this.imgChildArr[this.currentThumbnailIndex][this.currentChildThumbnailIndex];
      this.previewIndexMsg = 'Frame index: ' +
          this.calIndexToTime('child', this.currentChildThumbnailIndex);
      this.drawRectOnCanvas(this.currentThumbnailIndex * 30 + this.currentChildThumbnailIndex);
    }
  }

  swiftImageIndex(role, index) {
    if (index < 0) {
      return;
    }
    const element =
        (role === 'main') ? this.mainSeekBarView : this.childSeekBarView;
    const thumbnailWidth =
        (role === 'main') ? this.mainThumbnailWidth : this.childThumbnailWidth;
    element.nativeElement.scrollLeft = 0;
    element.nativeElement.scrollLeft = (index * thumbnailWidth);
    // this.logger.info('element.nativeElement.clientLeft=' +
    // element.nativeElement.clientLeft);
    // this.logger.info('element.nativeElement.scrollLeft=' +
    // element.nativeElement.scrollLeft);
  }

  clearRadioStatusAndSet(teamIndex, playerIndex) {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.radioStatusArr[i].length; j++) {
        this.radioStatusArr[i][j] = false;
      }
    }
    this.radioStatusArr[teamIndex][playerIndex] = true;
  }

  selectedPlayer(plarArrIndex, selectedIndex) {
    this.clearRadioStatusAndSet(plarArrIndex, selectedIndex);
    this.selectedPlayerArr[0] = plarArrIndex;   // Team
    this.selectedPlayerArr[1] = selectedIndex;  // player
  }

  selectedGoalType(index) {
    for (let i = 0; i < 4; i++) {
      this.radioGoalTypesArr[i] = false;
    }
    this.radioGoalTypesArr[index] = true;
    this.currentGoalTypeIndex = index;
    switch (index) {
      case 0:
        this.currentGoalTypeMsg = '跳投兩分';
        break;
      case 1:
        this.currentGoalTypeMsg = '帶球上籃';
        break;
      case 2:
        this.currentGoalTypeMsg = '扣籃';
        break;
      case 3:
        this.currentGoalTypeMsg = '三分球';
        break;
    }
  }

  selectTask(type, mainIndex, childIndex) {
    // this.logger.info('type=' + type);
    // this.logger.info('mainIndex=' + mainIndex);
    // this.logger.info('childIndex=' + childIndex);
    if (type === 'main') {
      this.swiftImageIndex('main', mainIndex);
      this.swiftImageIndex('child', 0);
    } else {
      if (mainIndex !== this.currentThumbnailIndex) {
        this.swiftImageIndex('main', mainIndex);
      }
      this.swiftImageIndex('child', childIndex);
    }
  }

  checkGoalEvent() {
    for (let i = 0; i < this.taskArr.length; i++) {
      if ((this.taskArr[i].mainIndex === this.currentThumbnailIndex) &&
          (this.taskArr[i].childIndex === this.currentChildThumbnailIndex)) {
        return true;
      }
    }
    return false;
  }

  sendGoalEvent(index) {
    // Set task.isTaskCreated to true
    this.taskArr[index].isTaskCreated = true;

    const body = {
      'siteId': this.siteId,
      'type': 'annoTool',
      'detail': this.taskArr[index]
    };

    // Send task to server
    this.http.post(this.apiServer + 'task/task_create', body)
        .subscribe(
            ret => {
              this.logger.info('ret=' + JSON.stringify(ret));
            },
            err => {
              this.logger.error('err=' + JSON.stringify(err));
              // Set task.isTaskCreated to true
              this.taskArr[index].isTaskCreated = false;
            });

    // Send goal data to media_worker
    this.socketService.sendGoalEvent(body);
  }

  SendGoalEventToServer(sendAll) {
    if ((!sendAll) && (this.taskArr.length < 10)) {
      return;
    }

    let index = 0;
    for (let i = 0; i < this.taskArr.length; i++) {
      if (this.taskArr[i].isTaskCreated === false) {
        if ((!sendAll) && (index < 10)) {
          index++;
          continue;
        }
        // Send task to cloud/server and media_worker
        this.sendGoalEvent(i);
      }
    }
  }

  Goal() {
    this.logger.info('Goal!');

    // check the frame whether it is added before or not
    if (this.checkGoalEvent()) {
      return;
    }

    // Team & player
    const selectedTeamAndPlayer =
        this.playerArr[this.selectedPlayerArr[0]][this.selectedPlayerArr[1]];

    this.taskArr.unshift({
      'taskId': '',
      'team': this.teamArr[this.selectedPlayerArr[0]],
      'player': selectedTeamAndPlayer,
      'frame': this.calIndexToTime('child', this.currentChildThumbnailIndex),
      'img': this.imgChildArr[this.currentThumbnailIndex]
                             [this.currentChildThumbnailIndex],
      'mainIndex': this.currentThumbnailIndex,
      'childIndex': this.currentChildThumbnailIndex,
      'goalType': this.currentGoalTypeMsg,
      'isTaskCreated': false
    });
    this.logger.info('this.taskArr=' + JSON.stringify(this.taskArr));

    this.taskArr.sort((a, b): number => {
      if (a.mainIndex > b.mainIndex) {
        return -1;
      } else if (a.mainIndex < b.mainIndex) {
        return 1;
      } else {
        if (a.childIndex > b.childIndex) {
          return -1;
        } else if (a.childIndex < b.childIndex) {
          return 1;
        }
        return 0;
      }
    });

    this.SendGoalEventToServer(false);
  }

  deleteTask(i) {
    // this.logger.info('deleteTask=' + i);
    const r = confirm('Confirm delete?');
    if (r === false) {
        return;
    }

    // Delete database data
    const body = {
      'siteId': this.siteId,
      'data_type': 'annoTool',
      'detail': this.taskArr[i]
    };

    // Send task to server
    this.http.post(this.apiServer + 'task/task_delete', body)
        .subscribe(
          // Clean array item
          ret => {
            this.taskArr.splice(i, 1);
          },
          err => {
            this.logger.error('err=' + JSON.stringify(err));
          });
  }

  drawRectOnCanvas(frameNo) {
    return;
    // const canvasWidth = this.mainPreview.nativeElement.width;
    // const canvasHeight = this.mainPreview.nativeElement.height;
    // // this.goal_detail[frameNo] = {
    // //   'rect_ball': data['rect_ball'].array,
    // //     'rect_basket': data['rect_basket'].array
    // // };
    // console.log('drawRectOnCanvas frameNo=' + frameNo + ', width=' + canvasWidth + ', height=' + canvasHeight);
    // // this.canvas_context.rect(157, 103, 10, 10);
    // // this.canvas_context.stroke();
    // if (this.goal_detail[frameNo]) {
    //   console.log('drawRectOnCanvas this.currentPreviewImg=' + this.currentPreviewImg);
    //     const widthRatio = canvasWidth / 640;
    //     const heightRatio = canvasHeight / 360;
    //     console.log('widthRatio=' + widthRatio);
    //     console.log('heightRatio=' + heightRatio);
    //     // this.canvas_context.clearRect(0, 0, canvasWidth, canvasHeight);
    //     // this.canvas_context.stroke();
    //     this.canvas_context.rect(
    //       Math.floor(this.goal_detail[frameNo].rect_ball[0] * widthRatio),
    //       Math.floor(this.goal_detail[frameNo].rect_ball[1] * heightRatio),
    //       Math.floor((this.goal_detail[frameNo].rect_ball[2] - this.goal_detail[frameNo].rect_ball[0]) * widthRatio),
    //       Math.floor((this.goal_detail[frameNo].rect_ball[3] - this.goal_detail[frameNo].rect_ball[1]) * heightRatio)
    //     );

    //     console.log('final X=' + Math.floor(this.goal_detail[frameNo].rect_ball[0] * widthRatio));
    //     console.log('final Y=' + Math.floor(this.goal_detail[frameNo].rect_ball[1] * heightRatio));
    //     console.log('final width=' +
    //       Math.floor((this.goal_detail[frameNo].rect_ball[2] - this.goal_detail[frameNo].rect_ball[0]) * widthRatio));
    //     console.log('final height=' +
    //       Math.floor((this.goal_detail[frameNo].rect_ball[3] - this.goal_detail[frameNo].rect_ball[1]) * heightRatio));
    //     this.canvas_context.stroke();
    // }
  }

  // {"rect_ball":[300,173,19,16],"rect_basket":[293,122,36,31]}

  hotKeyDown(event: KeyboardEvent) {
    // alert(event.keyCode);
    let index = 0;
    switch (event.keyCode) {
      case 13:  // enter
        this.selectTask(
            'child', this.taskArr[this.currentTaskIndex].mainIndex,
            this.taskArr[this.currentTaskIndex].childIndex);
        break;
      case 49:  // 1
      case 50:  // 2
      case 51:  // 3
      case 52:  // 4
      case 53:  // 5
      case 54:  // 6
      case 55:  // 7
      case 56:  // 8
      case 57:  // 9
        if (event.shiftKey) {
          // shift + event.keyCode
          this.selectedPlayer(1, event.keyCode - 49);
        } else {
          // event.keyCode
          this.selectedPlayer(0, event.keyCode - 49);
        }
        break;
      case 71:   // G
      case 103:  // g
        if (this.currentTaskIndex !== -1) {
          this.currentTaskIndex++;
        }
        this.Goal();
        break;
      case 37:  // left
        if (event.shiftKey) {
          // shift + left
          if (this.currentChildThumbnailIndex === 0) {
            this.currentChildThumbnailIndex = this.imgChildArr[this.currentThumbnailIndex].length - 1;
            this.swiftImageIndex('child', this.currentChildThumbnailIndex);
          } else {
            this.swiftImageIndex('child', this.currentChildThumbnailIndex - 1);
          }
        } else {
          // left
          if (this.currentThumbnailIndex === 0) {
            this.currentThumbnailIndex = this.imgArr.length - 1;
            this.swiftImageIndex('main', this.currentThumbnailIndex);
          } else {
            this.swiftImageIndex('main', this.currentThumbnailIndex - 1);
          }
          // this.swiftImageIndex('main', this.currentThumbnailIndex - 1);
        }
        break;
      case 38:  // up
        index = (this.currentTaskIndex === 0) ? 0 : this.currentTaskIndex - 1;
        this.doTaskListFocusAndBlur(index);

        this.taskListView._results[index].nativeElement.scrollIntoView(true);
        break;
      case 39:  // right
        if (event.shiftKey) {
          // shift + right
          if (this.currentChildThumbnailIndex === this.imgChildArr[this.currentThumbnailIndex].length - 1) {
            this.currentChildThumbnailIndex = 0;
            this.swiftImageIndex('child', this.currentChildThumbnailIndex);
          } else {
            this.swiftImageIndex('child', this.currentChildThumbnailIndex + 1);
          }
        } else {
          // right
          if (this.currentThumbnailIndex === this.imgArr.length - 1) {
            this.currentThumbnailIndex = 0;
            this.swiftImageIndex('main', this.currentThumbnailIndex);
          } else {
            this.swiftImageIndex('main', this.currentThumbnailIndex + 1);
          }
          // this.swiftImageIndex('main', this.currentThumbnailIndex + 1);
        }
        break;
      case 40:  // down
        index = (this.currentTaskIndex < this.taskArr.length - 1) ?
            this.currentTaskIndex + 1 :
            this.currentTaskIndex;
        this.doTaskListFocusAndBlur(index);

        this.taskListView._results[index].nativeElement.scrollIntoView(false);
        break;
      case 90:   // Z
      case 122:  // z
        this.selectedGoalType(0);
        break;
      case 88:   // Z
      case 120:  // z
        this.selectedGoalType(1);
        break;
      case 67:  // C
      case 99:  // c
        this.selectedGoalType(2);
        break;
      case 86:   // V
      case 118:  // v
        this.selectedGoalType(3);
        break;
    }
  }

  hotKeyMap(visible) {
    if (visible) {
      this.hotKeyMapView.nativeElement.style.visibility = 'visible';
    } else {
      this.hotKeyMapView.nativeElement.style.visibility = 'hidden';
    }
  }

  getIndexBySiteId(siteId) {
    for (let i = 0; i < this.siteArr.length; i++) {
      if (this.siteArr[i].siteId === siteId) {
        return i;
      }
    }

    return -1;
  }

  logout() {
    this.cookieService.deleteAll();
    window.location.reload(true);
  }
}
