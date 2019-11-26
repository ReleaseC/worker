import { Component } from '@nestjs/common';
import concat from 'ffmpeg-concat';
import { IWorkerCallback, IEngine } from '../common/worker.interface';
import { WorkerUtil } from '../common/worker.util';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';
const concat = require('ffmpeg-concat');
const path = require('path');
const fs=require('fs');
class MomentParams {
  enableborder: boolean;
  enableturn: boolean;
  enablebgm: boolean;
  enablebefore:boolean;
  enableafter:boolean;
  enablegreen:boolean;
  enableeffect:boolean;
  enablelogo:boolean;
  concatOptions:string;
  border:string;
  template:string;
  template_url:string;
  before_paste:string;
  after_paste:string;
  bgm:string;
  color:string;
  similarity:string;
  blend:string;
  ground_video:string;
  effect_start:string;
  effect_duration:string;
  effect_speed:string;
  logo_url:string;
  logo_x:string;
  logo_y:string;

  pay_photo:boolean;
  pay_video:boolean;
  pay_video_template_background_url:string;
  pay_video_template_front_url:string;
  pay_photo_template_background_url:string;
  transfer_style:string;
  paste_transfer_x:number;
  paste_transfer_y:number;
  transfer_scale:number;
  photo_border:string;
  paste_border_x:number;
  paste_border_y:number;
  print_rotate:boolean;

  pay_photo_template_front_urls:string[]=[]
  pay_video_template_front_urls:string[]=[]
}

// Preferred method
class MomentParams_2 {
  static src_video = class {
    provider: string; // OSS
    key: string;
  };
  static dst_video = class {
    provider: string; // OSS
    key: string;
  };
  static options = class {
    light: number;
    rmboard: boolean;
    rmturn: boolean;
    rmbgm: boolean;
    board: string;
    music: string;
  };
}

@Component()
export class CommonService implements IEngine {
  param: MomentParams;

  constructor() {}

  initParamFromTask(task: any,working_directory:any) {
    task.param = task.later_setting.cut_param || {};
    // Init param from task. If no set in task, use default param (right side)
    this.param = new MomentParams();
    this.param.enableborder = (task.param['enableborder'] as boolean) || false;
    this.param.enablebgm = (task.param['enablebgm'] as boolean) || false;
    this.param.enableturn = (task.param['enableturn'] as boolean) || false;
    this.param.enablebefore=(task.param['enablebefore'] as boolean) ||false;
    this.param.enableafter=(task.param['enableafter'] as boolean) ||false;
    this.param.enablegreen=(task.param['enablebggreen'] as boolean) ||false;
    this.param.enableeffect=(task.param['enableeffect'] as boolean) ||false;
    this.param.enablelogo=(task.param['enablelogo'] as boolean) || false;
    this.param.pay_photo = (task.param['pay_photo'] as boolean) || false;
    this.param.pay_video = (task.param['pay_video'] as boolean) || false;
    this.param.print_rotate = (task.param['print_rotate'] as boolean) || false;
    this.param.color = task.later_setting.source.green_screen.color !== undefined && task.later_setting.source.green_screen.color !=="" ? task.later_setting.source.green_screen.color : 'green';
    this.param.similarity = task.later_setting.source.green_screen.similar !== undefined && task.later_setting.source.green_screen.similar !== "" ? task.later_setting.source.green_screen.similar : '0.17';
    this.param.blend = task.later_setting.source.green_screen.mix !== undefined && task.later_setting.source.green_screen.mix !== "" ? task.later_setting.source.green_screen.mix : '0.05'; 
    this.param.template=`2880_2160_${Math.floor(Math.random()*5+1)}.jpg`
    // this.param.board =
    //   task.param['board'] ||
    //   `template${Math.floor(Math.random() * 10 + 1)}.png`;
    this.param.effect_start=task.later_setting.source.effect!==undefined ? (task.later_setting.source.effect.start!==undefined ? task.later_setting.source.effect.start:'2'):'';
    this.param.effect_duration=task.later_setting.source.effect!==undefined ? (task.later_setting.source.effect.duration!==undefined ? task.later_setting.source.effect.duration:'3'):'';
    this.param.effect_speed=task.later_setting.source.effect!==undefined ? (task.later_setting.source.effect.speed!==undefined ? task.later_setting.source.effect.speed:'2.0'):'';
   
    //根据脚本中视频段数产出对应拼接指令 
    switch(task.mode){
      case 'photo':
        // 照片处理代码
        break;
      default:
          console.log(task.later_setting.record.length)
          if(task.later_setting  && task.later_setting.record && task.later_setting.record.length !=0){
            if(task.later_setting.record.length==1){
              this.param.concatOptions='';
            }else{
                let ffmpeg='ffmpeg '
                let fix=''
                for(var i=0;i<=task.later_setting.record.length-1;i++){
                  //  ffmpeg=ffmpeg+`-ss ${task.later_setting.record[i]['begin']/1000} -t ${task.later_setting.record[i]['duration']/1000} -i ${working_directory}/${task.taskId}_${i}.mp4 `
                  if(task.later_setting.record[i]['paste_mov']){
                    ffmpeg=ffmpeg+`-i ${working_directory}/pasteMOV_${i}.mp4 `
                    fix=fix+`[${i}:v:0]`
                  }else{
                    ffmpeg=ffmpeg+`-i ${working_directory}/${task.taskId}_${i}_brightness.mp4 `
                    fix=fix+`[${i}:v:0]`
                  } 
                }
                console.log(ffmpeg)
                console.log(fix)
                this.param.concatOptions=`${ffmpeg} -filter_complex "${fix}concat=n=${task.later_setting.record.length}:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`;
            }
          }
          break; 
    }

  }

  async cut_video(data, cb: IWorkerCallback) {
    console.log(data)
    // 汇报worker开始处理时间
    let time=Date.now()
    WorkerUtil.report_task_process_time(data.task.taskId,time,'worker_edit_start')
    const task = data.task;
    // console.log(task);
    // console.log(JSON.stringify(data.task));
    console.log(JSON.stringify(data.task.later_setting.record));
    console.log(JSON.stringify(data.task.later_setting.source));
    console.log(JSON.stringify(data.task.later_setting.cut_param));
    // let downloadMsg = '';
    let activity_directory = WorkerUtil.prepareActivityDirectory(data.activity_id);
    let working_directory = WorkerUtil.prepareWorkingDirectory(task.taskId);
    // let ConcatFile=`${working_directory}/concat.txt`;
    let ConcatFile=`${process.cwd()}/working/tasks/${task.taskId}`
    // Init cutvideo params from task.json
    // Each type has it's own parameters, roughtly, the parameters include:
    // type, source media (OSS link), dst (OSS link), cutvideo params
    // Template files (OSS link)
    // Not each params is set before cutvideo, so, set default parameters in initParam
    // It is also for backward compatible as we extends params in each version
    // Not each sites contains all new added params.
    
    // 判断mode为video还是photo然后进行对应处理
    switch(task.mode){
      case 'photo':
        try{
          this.initParamFromTask(data.task,working_directory);
          data['worker_id'] = WorkerUtil.getWorkerId();
          console.log(this.param) 
          let dst; //文件中转变量
          if(data.activity_id=='1560309857ij' || data.activity_id=='1559553188zw'){
              console.log('=====金融中心测试场')
              // 上来原图1920×1080处理方案
              // 随机挑选一个模板进行扣绿幕
              let template=this.param.template;
              let dst_template=`${activity_directory}/${template}`;
              this.param.template_url=dst_template
              if(!WorkerUtil.dirNameIsExist(dst_template)){
                console.log('该绿屏模板不存在，需要下载==========》')
                await WorkerUtil.ossDownload(template,dst_template)
              }
                // 下载原始照片
            let dst_1=`${working_directory}/${data.task.taskId}.jpg`;
            await WorkerUtil.ossDownload(task.later_setting.record[0]['fileName'], dst_1);
            dst=dst_1;
            if(this.param.enablegreen){
                let dst_1=`${working_directory}/green_done.jpg`;
                let mapcmd='-map "[out]" -map 1:0 -hide_banner -loglevel panic -y';
                // 原图：2592×1728
                await applyGreenScreen(dst,dst_template,this.param.color,this.param.similarity,this.param.blend,mapcmd,144,432,dst_1);
                //  // 原图：1920×1080
                //  await applyGreenScreen(dst,dst_template,this.param.color,this.param.similarity,this.param.blend,mapcmd,480,1080,dst_1);
                dst=dst_1
            }

            let upload_min_img=`${working_directory}/${data.task.taskId}_min.jpg`;
            await scalePic(data,dst,0.3,upload_min_img);
            await WorkerUtil.ossUpload(data,upload_min_img, `${data.activity_id}/${task.taskId}_min.jpg`);
            await WorkerUtil.ossUpload(data,dst, `${data.activity_id}/${task.taskId}.jpg`);
          }else{         
          // 准备绿屏背景模板
          if(this.param.enablegreen){
            console.log('=====金融中心正式场')
            let src = `${task.later_setting.source.ground_video.src.split('aliyuncs.com')[task.later_setting.source.ground_video.src.split('aliyuncs.com').length-1]}`;
            let dst_1 = `${activity_directory}/${task.later_setting.source.ground_video.src.split('/')[task.later_setting.source.ground_video.src.split('/').length-1]}`;
            if(!WorkerUtil.dirNameIsExist(dst_1)){
              console.log('绿屏背景不存在，需要下载=============》')
              await WorkerUtil.ossDownload(src, dst_1);
            }
              this.param.ground_video=dst_1;
          }else{   //没有绿屏背景，也需要准备背景模板 ==========画展活动
              console.log('======进来下载画展活动的模板和风格')
              if(data.task.later_setting.source.pay_photo_template ==undefined){
                 console.log('====首次拍摄 随机产出模板=====')
                 let i=`${Math.floor(Math.random()*4+1)}`
                // let i=`1`
                 this.param.pay_photo_template_background_url=`${activity_directory}/template${i}.jpg`;
                 switch(i){
                   case '1':
                      this.param.transfer_style='la_muse';
                      this.param.paste_transfer_x=0;
                      // this.param.paste_transfer_y=250;
                      this.param.transfer_scale=0.6;
                      this.param.photo_border=`${activity_directory}/template1_border.png`;
                      this.param.paste_border_x=227;
                      this.param.paste_border_y=179.5;
                      break;
                    case '2':
                      this.param.transfer_style='rain_princess';
                      this.param.paste_transfer_x=0;
                      // this.param.paste_transfer_y=360;
                      this.param.transfer_scale=1.2;
                      this.param.photo_border=`${activity_directory}/template2_border.png`
                      this.param.paste_border_x=240;
                      this.param.paste_border_y=243;
                      break;
                    case '3':
                      this.param.transfer_style='rain_princess';
                      this.param.paste_transfer_x=0;
                      // this.param.paste_transfer_y=780;
                      this.param.transfer_scale=1.2;
                      this.param.photo_border=`${activity_directory}/template3_border.png`
                      this.param.paste_border_x=285;
                      this.param.paste_border_y=288.5;
                      break;
                    case '4':
                      this.param.transfer_style='rain_princess';
                      this.param.paste_transfer_x=0;
                      // this.param.paste_transfer_y=780;
                      this.param.transfer_scale=0.8;
                      this.param.photo_border=`${activity_directory}/template4_border.png`
                      this.param.paste_border_x=183.5;
                      this.param.paste_border_y=190;
                      break;
                    default:
                      console.log('===查无此风格====')
                      break;
                 }
              }else{
                let src = `${task.later_setting.source.pay_photo_template.background_url.split('aliyuncs.com')[task.later_setting.source.pay_photo_template.background_url.split('aliyuncs.com').length-1]}`;
                let dst_1 = `${activity_directory}/${task.later_setting.source.pay_photo_template.background_url.split('/')[task.later_setting.source.pay_photo_template.background_url.split('/').length-1]}`;
                if(!WorkerUtil.dirNameIsExist(dst_1)){
                  console.log('画展模板不存在，需要下载=============》')
                  await WorkerUtil.ossDownload(src, dst_1);
                }
                  this.param.pay_photo_template_background_url=dst_1;
                  this.param.transfer_style=task.later_setting.source.pay_photo_template.style
                  console.log(`=============================================${task.later_setting.source.pay_photo_template.background_url.split('/')[task.later_setting.source.pay_photo_template.background_url.split('/').length-1]}`)
                  switch(`${task.later_setting.source.pay_photo_template.background_url.split('/')[task.later_setting.source.pay_photo_template.background_url.split('/').length-1]}`){
                    case 'template1.jpg':
                        this.param.transfer_style='la_muse';
                        this.param.paste_transfer_x=0;
                        // this.param.paste_transfer_y=250;
                        this.param.transfer_scale=0.6;
                        this.param.photo_border=`${activity_directory}/template1_border.png`;
                        this.param.paste_border_x=227;
                        this.param.paste_border_y=179.5;
                        break;
                    case 'template2.jpg':
                        this.param.transfer_style='rain_princess';
                        this.param.paste_transfer_x=0;
                        // this.param.paste_transfer_y=30;
                        this.param.transfer_scale=1.2;
                        this.param.photo_border=`${activity_directory}/template2_border.png`
                        this.param.paste_border_x=240;
                        this.param.paste_border_y=243;
                        break;
                    case 'template3.jpg':
                        this.param.transfer_style='rain_princess';
                        this.param.paste_transfer_x=0;
                        // this.param.paste_transfer_y=30;
                        this.param.transfer_scale=1.2;
                        this.param.photo_border=`${activity_directory}/template3_border.png`
                        this.param.paste_border_x=285;
                        this.param.paste_border_y=288.5;
                        break;
                    case 'template4.jpg':
                       this.param.transfer_style='rain_princess';
                       this.param.paste_transfer_x=0;
                        // this.param.paste_transfer_y=780;
                        this.param.transfer_scale=0.8;
                        this.param.photo_border=`${activity_directory}/template4_border.png`
                        this.param.paste_border_x=183.5;
                        this.param.paste_border_y=190;
                       break;
                    default:
                        break;

                  }
              }
       

          }

          // 下载原始照片
          let dst_1=`${working_directory}/${data.task.taskId}.jpg`;
          await WorkerUtil.ossDownload(task.later_setting.record[0]['fileName'], dst_1);
          dst=dst_1;
          // 拼接绿屏模板与照片
          console.log('======绿屏处理======')
          if(this.param.enablegreen){
              let dst_2=`${working_directory}/mini.jpg`;
              await scalePic(data,dst,0.7,dst_2)
              if(this.param.ground_video==`${activity_directory}/2880-2160.png`){
                // 首次拍摄默认进入 
                let dst_1=`${working_directory}/green_done.png`;
                let mapcmd='-map "[out]" -map 1:0 -hide_banner -loglevel panic -y';
               await applyGreenScreen(dst_2,this.param.ground_video,this.param.color,this.param.similarity,this.param.blend,mapcmd,432,648,dst_1);
               dst=dst_1;
                let dst_template=`${working_directory}/green_done1.jpg`;
                let dst_display=`${working_directory}/display.jpg`;
                let board=`${activity_directory}/shuiyin.png`;
                await applyGreenScreen(dst_2,this.param.template_url,this.param.color,this.param.similarity,this.param.blend,mapcmd,432,648,dst_template);
                await doOverlay(dst_template,board,300,300,dst_display)
                await WorkerUtil.ossUpload(data,`${dst_display}`, `${data.activity_id}/${task.taskId}_display.jpg`);
              }else{
                //用户购买模板进入
                let dst_1=`${working_directory}/green_done.jpg`;
              let mapcmd='-map "[out]" -map 1:0 -hide_banner -loglevel panic -y';
              await applyGreenScreen(dst_2,this.param.ground_video,this.param.color,this.param.similarity,this.param.blend,mapcmd,432,648,dst_1);
              dst=dst_1
              }         
          }else{    //非绿屏活动：自动抠图 ===============画展活动
                     console.log('==================进来自动抠图')
                     console.log('此次抠图对应的模板是======'+this.param.pay_photo_template_background_url)
                     console.log('此次抠图对应的风格是======'+this.param.transfer_style)
                     /*照片特效模板叠加*/ 
                      let dst_transparent=`${working_directory}/transparent.png`
                      let dst_back_photo=`${working_directory}/greendone.jpg`
                      let mapcmd=`-map "[out]" -map 1:0 -hide_banner -loglevel panic -y`
                      let upload_min_img=`${working_directory}/greendone_min.jpg`
                      let dst_mask=`${working_directory}/mask.png`
                      let dst_transfer=`${working_directory}/transfer.jpg`
                      let dst_transfer_png=`${working_directory}/transfer.png`
                      let dst_transfer_png_wechat=`${working_directory}/transfer_wechat.png`
                      let dst_transfer_size=`${working_directory}/transfer_size.jpg`
                      let dst_transfer_png_small=`${working_directory}/transfer_small.png`
                      let dst_transfer_png_small_crop_bottom=`${working_directory}/crop_bottom.png`
                      let dst_finish=`${working_directory}/finfish.jpg` 
                      //======step1:取得mask.png(以下有三种API可以调用) 
    
                      /*****腾讯云Versa-ai:API  照片需要低于500K size会变  (串接完成)*/
                      // let config={
                      //   'CLIENT_ID':'OrMVWkVcothSkamc',
                      //   'CLIENT_SECRET':'bHmcPFKiWKCPTWHINqSdfResqhviWnQB'
                      // }
                      // let body=await WorkerUtil.get_VersaAi_access_token(config)
                      // console.log('access_token:'+body['access_token'])
                      // let img_url=`https://siiva-video.oss-cn-hangzhou.aliyuncs.com/`+task.later_setting.record[0]['fileName']
                      // //step1-1：TODO 确保图片<500KB
    
                      // //step1-2:取得mask.png并下载到本地
                      // /**versa-ai人像分割 */
                      // var request = require('request')
                      // let target_human_response=await WorkerUtil.get_VersaAi_asegment_instance_human(body['access_token'],img_url)
                      // console.log('target_human_response:'+JSON.stringify(target_human_response))
                      // request(target_human_response['mask_url']).pipe(fs.createWriteStream(`${working_directory}/mask_mini.png`))
             
                      /**versa-ai实例分割 */
                      // let target_separate_response=await WorkerUtil.get_VersaAi_asegment_instance_separate(body['access_token'],img_url)
                      // console.log('target_separate_response:'+JSON.stringify(target_separate_response))
                      // for(let i=0;i<=target_separate_response['result'][0]['target'].length-1;i++){
                      //   console.log(target_separate_response['result'][0]['target'][i]['url'])
                      //   request(target_separate_response['result'][0]['target'][i]['url']).pipe(fs.createWriteStream(`${working_directory}/${i}.png`))
                      // }
                      // await sleep(5000) 
                      // // await paste_base(`${working_directory}/1.png`,`${working_directory}/0.png`,0,0,`${working_directory}/2.png`)
                      
                      // await sleep(5000)                  
                      // //step1-3:将mask.png resize到和原图一样大
                      // await resize(`${working_directory}/mask_mini.png`,1450,1080,`${dst_mask}`)
                          
                          
    
    
                      /******百度AI：API   //50000次/天  size不会变  (已经串接完成) */           
                      await CallPython(`./scripts/python/BaiduAi.py`,dst,dst_mask,dst_transparent);
    
    
                         
                      /******removebg：API  //50次/月 效果最好  size会变  (暂时无法提供mask)   */
                      // await CallPython(`./scripts/python/remove_bg.py`,dst,``,dst_transparent);
                         
    
                      //======step2:对原图进行风格转移
                      let transfer_options=`--checkpoint ckpt/${this.param.transfer_style}.ckpt --in-path ${dst} --out-path ${dst_transfer}`
                      await CallPython(`./scripts/python/evaluate.py`,``,transfer_options,``)
                      await resize(`${dst_transfer}`,1450,1080,`${dst_transfer_size}`)
                      //======step3:对风格转移后图片与mask重合
                      await CallPython(`./scripts/python/mask.py`,`${dst_transfer_size} ${dst_mask}`,`${task.taskId} ${dst_transfer_png_wechat}`,`${dst_transfer_png}`)
                      await scalePic(data,`${dst_transfer_png}`,this.param.transfer_scale,`${dst_transfer_png_small}`)
                      await CropImg(working_directory,dst_transfer_png,'iw','ih-30',0,0,dst_transfer_png_small_crop_bottom)
                      //======step4:与背景模板进行叠加
                      await paste_base(`${this.param.pay_photo_template_background_url}`,dst_transfer_png_small,this.param.paste_transfer_x,'H-h+30',dst_back_photo);
                      await paste_base(this.param.photo_border,dst_back_photo,this.param.paste_border_x,this.param.paste_border_y,dst_finish)
                      dst=dst_back_photo;

                      /**只有画展需要上传该图片 */
                      if(task.taskId.split('_').length == 2){
                        await WorkerUtil.ossUpload(data,dst_transfer_png_small_crop_bottom,`${data.activity_id}/${task.taskId}.png`)
                        await WorkerUtil.ossUpload(data,dst_finish,`${data.activity_id}/${task.taskId}_display.jpg`)
                      }

                      /**该task需要旋转进行打印 */
                      if(this.param.print_rotate){
                        let dst_print_rotate=`${working_directory}/print_rotate.png`
                        await Rotate(dst,90,dst_print_rotate)
                        await WorkerUtil.ossUpload(data,dst_print_rotate,`${data.activity_id}/${task.taskId}_print.jpg`)
                      }
        }
          let upload_min_img;
          if(this.param.ground_video==`${activity_directory}/2880-2160.png`){
            upload_min_img=`${working_directory}/${data.task.taskId}_min.png`;
            //  生产一张小图
            await scalePic(data,dst,0.1,upload_min_img);
          }else{
            //  生产一张小图
              upload_min_img=`${working_directory}/${data.task.taskId}_min.jpg`;
              await scalePic(data,dst,0.3,upload_min_img);
          }
          // 上传到之炜oss
          if(data.activity_id=='1561534034xb'){   //过滤调办公室直升机测试活动ID：1561534034xb  待删除
            await WorkerUtil.ossUpload(data,dst, `${data.activity_id}/${task.taskId}.mp4`);
          }else{
            await WorkerUtil.ossUpload(data,dst, `${data.activity_id}/${task.taskId}.jpg`);
            await WorkerUtil.ossUpload(data,upload_min_img, `${data.activity_id}/${task.taskId}_min.jpg`);
          }
        }
         cb ? cb.onStop(data, 'finish task', null, null) : '';
        } catch(err){
          console.error('剪接錯誤：' + err);
          cb ? cb.onAbort(data, '剪接錯誤') : '';
        }finally{
          console.log('Task complete!');
          WorkerUtil.executeCmd(`rm -r -f ${working_directory}`);
        }
      break;

      case 'VPhoto':  //金融中心照片转视频3D活动类
         try{
                this.initParamFromTask(data.task,working_directory);
                let dst; //文件中转变量
                console.log(this.param)
                /*准备照片模板 或者 视频模板*/
                if(this.param.pay_photo){
                  if(task.later_setting.source.pay_photo_template.background_url !==undefined && task.later_setting.source.pay_photo_template.background_url !==""){   //判断照片背景模板是否存在并且下载
                    let src = `${task.later_setting.source.pay_photo_template.background_url.split('aliyuncs.com')[task.later_setting.source.pay_photo_template.background_url.split('aliyuncs.com').length-1]}`;
                    let dst = `${activity_directory}/${task.later_setting.source.pay_photo_template.background_url.split('/')[task.later_setting.source.pay_photo_template.background_url.split('/').length-1]}`;
                    if(!WorkerUtil.dirNameIsExist(dst)){
                      console.log('照片背景模板不存在，需要下载=============》')
                      await WorkerUtil.ossDownload(src, dst);
                    }
                      this.param.pay_photo_template_background_url=dst;
                      console.log('照片背景的模板有：====='+this.param.pay_photo_template_background_url)
                  }
                  if(task.later_setting.source.pay_photo_template.front_urls !==undefined && task.later_setting.source.pay_photo_template.front_urls !==""){          //判断照片前景模板存在并且下载：多张
                    for(let i=0;i<=task.later_setting.source.pay_photo_template.front_urls.length-1;i++){
                      let src = `${task.later_setting.source.pay_photo_template.front_urls[i].split('aliyuncs.com')[task.later_setting.source.pay_photo_template.front_urls[i].split('aliyuncs.com').length-1]}`;
                      let dst = `${activity_directory}/${task.later_setting.source.pay_photo_template.front_urls[i].split('/')[task.later_setting.source.pay_photo_template.front_urls[i].split('/').length-1]}`;
                      if(!WorkerUtil.dirNameIsExist(dst)){
                        console.log(`照片前景模板${i}不存在，需要下载=============》`)
                        await WorkerUtil.ossDownload(src, dst);
                      }
                        this.param.pay_photo_template_front_urls[i]=dst;
                    }
                    console.log('照片前景的模板有：====='+this.param.pay_photo_template_front_urls)
                  }
                }
                if(this.param.pay_video){
                  if(task.later_setting.source.pay_video_template.background_url !==undefined && task.later_setting.source.pay_video_template.background_url !==""){   //判断视频背景模板是否存在并且下载
                    let src = `${task.later_setting.source.pay_video_template.background_url.split('aliyuncs.com')[task.later_setting.source.pay_video_template.background_url.split('aliyuncs.com').length-1]}`;
                    let dst = `${activity_directory}/${task.later_setting.source.pay_video_template.background_url.split('/')[task.later_setting.source.pay_video_template.background_url.split('/').length-1]}`;
                    if(!WorkerUtil.dirNameIsExist(dst)){
                      console.log('视频背景模板不存在，需要下载=============》')
                      await WorkerUtil.ossDownload(src, dst);
                    }
                      this.param.pay_video_template_background_url=dst;
                  }
                  if(task.later_setting.source.pay_video_template.front_urls !==undefined && task.later_setting.source.pay_video_template.front_urls !==""){          //判视频断前景模板存在并且下载：多张
                    for(let i=0;i<=task.later_setting.source.pay_video_template.front_urls.length-1;i++){
                      let src = `${task.later_setting.source.pay_video_template.front_urls[i].split('aliyuncs.com')[task.later_setting.source.pay_video_template.front_urls[i].split('aliyuncs.com').length-1]}`;
                      let dst = `${activity_directory}/${task.later_setting.source.pay_video_template.front_urls[i].split('/')[task.later_setting.source.pay_video_template.front_urls[i].split('/').length-1]}`;
                      if(!WorkerUtil.dirNameIsExist(dst)){
                        console.log(`视频前景模板${i}不存在，需要下载=============》`)
                        await WorkerUtil.ossDownload(src, dst);
                      }
                        this.param.pay_video_template_front_urls[i]=dst;
                    }
                    console.log('视频前景的模板有：====='+this.param.pay_video_template_front_urls)
                  }
                }
                // 下载原始照片
                let dst_1=`${working_directory}/${data.task.taskId}.jpg`;
                await WorkerUtil.ossDownload(task.later_setting.record[0]['fileName'], dst_1);
                dst=dst_1;
                
                /*照片特效模板叠加*/ 
                if(this.param.pay_photo){
                  let dst_transparent=`${working_directory}/transparent.png`     //API扣完图透明产出
                  let dst_back_photo=`${working_directory}/greendone_back.jpg`   //贴背景模板后产出
                  let mapcmd=`-map "[out]" -map 1:0 -hide_banner -loglevel panic -y` //扣绿幕贴照片指令
                  let upload_min_img=`${working_directory}/greendone_min.jpg`
                  let dst_mask=`${working_directory}/mask.png`
                  let dst_complete   //前景、后景全部贴完后产出
                  if(this.param.enablegreen){   //绿幕背景：直接使用ffmpeg抠图  1560309857ij:上海金融中心   1558607850so：办公室测试活动
                      if(this.param.pay_photo_template_background_url){
                        let dst_2=`${working_directory}/mini.jpg`;
                        await scalePic(data,dst,0.7,dst_2)
                        await applyGreenScreen(dst_2,this.param.pay_photo_template_background_url,this.param.color,this.param.similarity,this.param.blend,mapcmd,432,648,dst_back_photo);
                        dst_complete=dst_back_photo
                      }else{
                        dst_complete=dst    //没有背景需将原图赋值给dst 提供作为贴前景的输入源
                      }
                      if(this.param.pay_photo_template_front_urls){
                         for(let i=0;i<=this.param.pay_photo_template_front_urls.length-1;i++){
                           let dst_zhongzhuan=`${working_directory}/zhongzhuan_${i}.jpg`  //引入第三方进行两两交换
                           await paste_base(dst_complete,this.param.pay_photo_template_front_urls[i],0,0,dst_zhongzhuan)
                           dst_complete=dst_zhongzhuan;
                         }
                      }               
                  }else{    //非绿幕背景：调用第三方API进行自动抠图
                    //互动小动物============>step1：先贴背景图  step2：再贴前景图（多张）
                    /******百度AI：API   //50000次/天  size不会变  (已经串接完成) */           
                      await CallPython(`./scripts/python/BaiduAi.py`,dst,dst_mask,dst_transparent);
                      if(this.param.pay_photo_template_background_url){
                        await paste_base(this.param.pay_photo_template_background_url,dst_transparent,0,0,dst_back_photo);
                        dst_complete=dst_back_photo
                      }else{
                        dst_complete=dst    //没有背景需将原图赋值给dst 提供作为贴前景的输入源
                      }
                      if(this.param.pay_photo_template_front_urls){
                        for(let i=0;i<=this.param.pay_photo_template_front_urls.length-1;i++){
                          let dst_zhongzhuan=`${working_directory}/zhongzhuan_${i}.jpg`  //引入第三方进行两两交换
                          await paste_base(dst_complete,this.param.pay_photo_template_front_urls[i],0,0,dst_zhongzhuan)
                          dst_complete=dst_zhongzhuan;
                        }
                      }
                  }
                  await scalePic(data,dst_complete,0.2,upload_min_img);
                  await WorkerUtil.ossUpload(data,dst_complete, `${data.activity_id}/${task.taskId}.jpg`);
                  await WorkerUtil.ossUpload(data,upload_min_img, `${data.activity_id}/${task.taskId}_min.jpg`);
                }
                /*视频特效模板叠加*/ 
                if(this.param.pay_video){
                  let dst_transparent=`${working_directory}/transparent.png`     //API扣完图透明产出
                  let dst_back_video=`${working_directory}/greendone_back.mp4`   //贴背景模板后产出
                  let dst_complete          //前景、后景全部贴完后产出
                  let dst_mask=`${working_directory}/mask.png`
                  let mapcmd=`-map "[out]" -map 1:0 -hide_banner -loglevel panic -y`
                  let frame=`${working_directory}/frame.jpg`;
                  let min_frame=`${working_directory}/min_frame.jpg`;
                  if(this.param.enablegreen){   //绿幕背景：直接使用ffmpeg抠图  1560309857ij:上海金融中心   1558607850so：办公室测试活动
                    if(this.param.pay_video_template_background_url){
                      await applyGreenScreen(dst,this.param.pay_video_template_background_url,this.param.color,this.param.similarity,this.param.blend,mapcmd,0,0,dst_back_video);
                      dst_complete=dst_back_video
                    }else{
                      dst_complete=dst    //没有背景需将原图赋值给dst 提供作为贴前景的输入源
                    }
                    if(this.param.pay_video_template_front_urls){
                       for(let i=0;i<=this.param.pay_video_template_front_urls.length-1;i++){
                         let dst_zhongzhuan=`${working_directory}/zhongzhuan_${i}.mp4`  //引入第三方进行两两交换
                         await paste_base(dst_complete,this.param.pay_video_template_front_urls[i],0,0,dst_zhongzhuan)
                         dst_complete=dst_zhongzhuan;
                       }
                    }               
                  }else{
                    //互动小动物============>step1：先贴背景图  step2：再贴前景图（多张）
                    /******百度AI：API   //50000次/天  size不会变  (已经串接完成) */           
                    await CallPython(`./scripts/python/BaiduAi.py`,dst,dst_mask,dst_transparent);
                    if(this.param.pay_video_template_background_url){
                      console.log('进来贴视频背景模板========================')
                      await paste_base(this.param.pay_video_template_background_url,dst_transparent,0,0,dst_back_video);
                      dst_complete=dst_back_video
                    }else{
                      dst_complete=dst    //没有背景需将原图赋值给dst 提供作为贴前景的输入源
                    }
                    if(this.param.pay_video_template_front_urls){
                      for(let i=0;i<=this.param.pay_video_template_front_urls.length-1;i++){
                        let dst_zhongzhuan=`${working_directory}/zhongzhuan_${i}.mp4`  //引入第三方进行两两交换
                        await paste_base(dst_complete,this.param.pay_video_template_front_urls[i],0,0,dst_zhongzhuan)
                        dst_complete=dst_zhongzhuan;
                      }
                    }
                  }
                  await getFrame(dst_complete,'00:00:01',frame)
                  await scalePic(data,frame,0.2,min_frame);
                  await WorkerUtil.ossUpload(data,dst_complete, `${data.activity_id}/${task.taskId}.mp4`);
                  await WorkerUtil.ossUpload(data,min_frame, `${data.activity_id}/${task.taskId}_min.jpg`);
                }
                
                cb ? cb.onStop(data, 'finish task', null, null) : ''; 
         }catch(err){
           console.log('剪辑错误：'+err)
           cb ? cb.onAbort(data,'剪辑错误'):'';
         }finally{
           console.log('Task complete');
           WorkerUtil.executeCmd(`rm -r -f ${working_directory}`)
         }
      break;


      default: //视频类处理
        try {
          // console.log(activity_directory)
          this.initParamFromTask(data.task,working_directory);
          data['worker_id'] = WorkerUtil.getWorkerId();
          console.log(this.param)
          let dst; //文件中转变量

          let acticity_id=data.acticity_id;
          switch(acticity_id){
            case '1561534034xb':  //金融中心直升机
                let dst_1 = `${working_directory}/${task.later_setting.record[0]['fileName']}`;
                await WorkerUtil.ossDownload(task.later_setting.record[0]['fileName'], dst_1);
                dst=dst_1;  
                if(this.param.enablegreen){
                  console.log('======绿屏处理======')
                  let src = `${task.later_setting.source.ground_video.src.split('aliyuncs.com')[task.later_setting.source.ground_video.src.split('aliyuncs.com').length-1]}`;
                  let dst_1 = `${activity_directory}/${task.later_setting.source.ground_video.src.split('/')[task.later_setting.source.ground_video.src.split('/').length-1]}`;
                  if(!WorkerUtil.dirNameIsExist(dst_1)){
                    console.log('绿屏背景不存在，需要下载=============》')
                    await WorkerUtil.ossDownload(src, dst_1);
                  }
                  this.param.ground_video=dst_1;
    
                    let dst_2=`${working_directory}/green_done.mp4`;
                    // let mapcmd='-map "[out]" -map 1:0 -hide_banner -loglevel panic -y -profile:v high -level:v 4.0 -c:a copy -r 30';
                    let mapcmd='-map "[out]" -map 1:0 -hide_banner -loglevel panic -y -profile:v high -level:v 4.0 -c:a copy -r 30';
                    await applyGreenScreen(dst,this.param.ground_video,this.param.color,this.param.similarity,this.param.blend,mapcmd,0,0,dst_2);
                    dst=dst_2
                }
                break;
            default:
                console.log('======Step 1:准备模板：包括边框，音乐，LOGO======='+acticity_id);
                if (this.param.enableborder) {
                  let src = `${task.later_setting.source.frame.split('aliyuncs.com')[task.later_setting.source.frame.split('aliyuncs.com').length-1]}`;
                  let dst_1 = `${activity_directory}/${task.later_setting.source.frame.split('/')[task.later_setting.source.frame.split('/').length-1]}`;
                  console.log(src+'========>')
                  console.log(dst_1+'========>')
                  if(!WorkerUtil.dirNameIsExist(dst_1)){
                    console.log('边框不存在，需要下载=============》')
                    await WorkerUtil.ossDownload(src, dst_1);
                  }
                  this.param.border=dst_1;
                }
                if(this.param.enablebgm){
                  let src = `${task.later_setting.source.bgm.src.split('aliyuncs.com')[task.later_setting.source.bgm.src.split('aliyuncs.com').length-1]}`;
                  let dst_1 = `${activity_directory}/${task.later_setting.source.bgm.src.split('/')[task.later_setting.source.bgm.src.split('/').length-1]}`;
                  console.log(src+'========>')
                  console.log(dst_1+'========>')
                  if(!WorkerUtil.dirNameIsExist(dst_1)){
                    console.log('背景音乐不存在，需要下载=============》')
                    await WorkerUtil.ossDownload(src, dst_1);
                  }
                  this.param.bgm=dst_1;
                }
                if(this.param.enablegreen){
                  let src = `${task.later_setting.source.ground_video.src.split('aliyuncs.com')[task.later_setting.source.ground_video.src.split('aliyuncs.com').length-1]}`;
                  let dst_1 = `${activity_directory}/${task.later_setting.source.ground_video.src.split('/')[task.later_setting.source.ground_video.src.split('/').length-1]}`;
                  console.log(src+'========>')
                  console.log(dst_1+'========>')
                  if(!WorkerUtil.dirNameIsExist(dst_1)){
                    console.log('绿屏背景不存在，需要下载=============》')
                    await WorkerUtil.ossDownload(src, dst_1);
                  }
                  this.param.ground_video=dst_1;
                }
                if(this.param.enablelogo){
                  let src = `${task.later_setting.source.logo.src.split('aliyuncs.com')[task.later_setting.source.logo.src.split('aliyuncs.com').length-1]}`;
                  let dst_1 = `${activity_directory}/${task.later_setting.source.logo.src.split('/')[task.later_setting.source.logo.src.split('/').length-1]}`;
                  this.param.logo_x=`${task.later_setting.source.logo.x}`;
                  this.param.logo_y=`${task.later_setting.source.logo.y}`;
                  console.log(src+'========>')
                  console.log(dst_1+'========>')
                  console.log('logo_x='+this.param.logo_x)
                  console.log('logo_y='+this.param.logo_y)
                  if(!WorkerUtil.dirNameIsExist(dst_1)){
                    console.log('LOGO不存在，需要下载=============》')
                    await WorkerUtil.ossDownload(src, dst_1);
                  }
                  this.param.logo_url=dst_1;
                }   
                 console.log('======Step: 准备特效片段======');
                if(task.later_setting.record.length>0){
                  for(let i=0;i<=task.later_setting.record.length-1;i++){
                    if(task.later_setting.record[i]['paste_mov']){
                      let src = `${task.later_setting.record[i]['paste_mov'].split('aliyuncs.com')[task.later_setting.record[i]['paste_mov'].split('aliyuncs.com').length-1]}`
                      let dst_effect = `${activity_directory}/pasteMOV_${i}.mov`
                      if(!WorkerUtil.dirNameIsExist(dst_effect)){
                        console.log('特效模板不存在，需要下载=============》')
                        await WorkerUtil.ossDownload(src, dst_effect);
                      }else{
                        console.log('=======该特效模板已存在，无需下载======')
                      }
                    }
                  }
                }
                switch(data.activity_id){
                  case '1561625901uq':  //超级大喇叭处理
                      console.log('===============进大喇叭处理')
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                        let dst_out = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                        let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                        let output=`${working_directory}/pasteMOV_${i}.mp4`
                        if(!WorkerUtil.dirNameIsExist(dst_in)){
                          await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                        }else{
                          console.log('=====视频已存在，无需再次下载=====')
                        }
                        if(i==0){
                          //第一个机位视频（2560*1536）放大1.25，再裁切成1080*1920
                          await ScaleAndCropVideo(working_directory,dst_in,'1.25',1080,1920,1060,0,dst_out);
                          //贴第一个MOV特效
                          await paste_base(dst_out,baseMOV,-400,0,output)
                        }
                        if(i==1){
                          //第二个机位视频调用cv1.py产出1080*1920
                          // let option=`3400 350 400 400 4 1080 1920 0 1650 550 500`
                          let option=`3400 350 400 400 4 1080 1920 0 1450 400 500`
                          await CallPython(`${activity_directory}/c1.py`,dst_in,option,dst_out)
                          await sleep(3000)
                           //贴第二个MOV特效
                           await paste_base(dst_out,baseMOV,-600,-300,output)
                        }
                        if(i==2){
                          //第三个机位视频调用cv2.py产出1080*1920
                          // let option=`600 600 800 800 5 1080 1920`
                          let option=`1100 650 500 600 6 1080 1920`
                          await CallPython(`${activity_directory}/c2.py`,dst_in,option,dst_out)
                          await sleep(3000)
                           //贴第三个MOV特效
                           await paste_base(dst_out,baseMOV,-400,200,output)
                        }
                      }     
                      let concatOptions=`ffmpeg -i ${activity_directory}/start.mp4 -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${working_directory}/pasteMOV_2.mp4 -filter_complex "[0]setdar=0/1[a];[1]setdar=0/1[b];[2]setdar=0/1[c];[3]setdar=0/1[d];[a][b][c][d]concat=n=4:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                       dst=`${working_directory}/concat_done.mp4`; 
                      await concatVideo(concatOptions,dst)
                    break;
                  case '1561626034rj':  //超级巨兽碗处理
                    console.log('===============进超级巨兽碗处理')
                    for(let i=0;i<=task.later_setting.record.length-1;i++){
                      let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                      let dst_out = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                      let dst_scale = `${working_directory}/${data.task.taskId}_${i}_scale.mp4`;
                      let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                      let output=`${working_directory}/pasteMOV_${i}.mp4`
                      if(!WorkerUtil.dirNameIsExist(dst_in)){
                        await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                      }else{
                        console.log('=====视频已存在，无需再次下载=====')
                      }
                      if(i==0){
                        //第一个机位视频（2560*1536）放大1.25，再裁切成1080*1920
                        await ScaleAndCropVideo(working_directory,dst_in,'0.9',1080,1920,1400,0,dst_out);
                        //贴第一个MOV特效
                        await paste_base(dst_out,baseMOV,-400,0,output)
                      }
                      if(i==1){
                        //第二个机位视频调用j1.py产出1080*1920
                        let option=`1100 300 200 200 5 1080 960 1050 500 200 200 850 620 180 150`
                        await CallPython(`${activity_directory}/2.py`,dst_in,option,dst_out)
                         //贴第二个MOV特效
                         await paste_base(dst_out,baseMOV,0,0,output)
                      }
                      if(i==2){
                        //第三个机位视频调用j3.py产出1080*1920
                        // let option=`1200 150 1000 700 8 864 1536`
                        let option=`1600 250 600 400 8 1080 1920`
                        await CallPython(`${activity_directory}/3.py`,dst_in,option,dst_out)
                        // await ScaleVideo(working_directory,dst_out,1.25,dst_scale)
                         //贴第三个MOV特效
                         await paste_base(dst_out,baseMOV,0,0,output)
                      }
                    }                
                    let option=`ffmpeg -i ${activity_directory}/start.mp4 -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${working_directory}/pasteMOV_2.mp4 -filter_complex "[0]setdar=0/1[a];[1]setdar=0/1[b];[2]setdar=0/1[c];[3]setdar=0/1[d];[a][b][c][d]concat=n=4:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                     dst=`${working_directory}/concat_done.mp4`; 
                    await concatVideo(option,dst)
                  break;
                case '1564562087ry':  //波塞冬碗处理
                  console.log('===============进波塞冬碗处理')
                    for(let i=0;i<=task.later_setting.record.length-1;i++){
                      let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                      let dst_out = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                      let dst_scale = `${working_directory}/${data.task.taskId}_${i}_scale.mp4`;
                      let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                      let output=`${working_directory}/pasteMOV_${i}.mp4`
                      if(!WorkerUtil.dirNameIsExist(dst_in)){
                        await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                      }else{
                        console.log('=====视频已存在，无需再次下载=====')
                      }
                      if(i==0){
                        //第一个机位视频（2560*1536）放大1.25，再裁切成1080*1920
                        await CropVideo(working_directory,dst_in,1080,1920,1380,0,dst_out);
                        await trimVideo(dst_out,dst_scale,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000)
                        //贴第一个MOV特效
                        // await paste_base(dst_scale,baseMOV,-400,0,output)
                        await paste_base(dst_scale,baseMOV,0,0,output)
                      }
                      if(i==1){
                        //第二个机位视频调用bosaidongwan_2.py产出1080*1920
                        let option=`2460 430 300 270 2 1080 960 2460 800 600 300 2000 1100 300 30`
                        await CallPython(`./scripts/python/bosaidongwan_2.py`,dst_in,option,dst_out)
                        //贴第二个MOV特效
                        // await paste_base(dst_out,baseMOV,-600,0,output)
                        await paste_base(dst_out,baseMOV,0,0,output)
                      }
                      if(i==2){
                        //第三个机位视频调用bosaidongwan_3.py产出1080*1920
                        // let option=`980 600 200 200 5 1080 1920`
                        let option=`1500 600 400 200 8 1080 1920`
                        await CallPython(`./scripts/python/bosaidongwan_3.py`,dst_in,option,dst_out)
                        await sleep(5000)
                        if(WorkerUtil.dirNameIsExist(dst_out)){
                           console.log('python处理完成')
                          //贴第三个MOV特效
                          // await paste_base(dst_out,baseMOV,-400,600,output)
                          await paste_base(dst_out,baseMOV,0,0,output)
                          this.param.concatOptions=`ffmpeg -i ${activity_directory}/bosaidongwan_start.mp4  -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${working_directory}/pasteMOV_2.mp4 -i ${activity_directory}/bosaidongwan_end.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0][4:v:0]concat=n=5:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                        }else{
                          console.log('python.mp4不存在')
                          this.param.concatOptions=`ffmpeg -i ${activity_directory}/bosaidongwan_start.mp4  -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${activity_directory}/bosaidongwan_end.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0]concat=n=4:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                        }
                      }
                  }                
                   dst=`${working_directory}/concat_done.mp4`; 
                  await concatVideo(this.param.concatOptions,dst)
                break;
                case '1561626062to'://非洲冲浪处理
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let dst_1 = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                        // let dst_rotate=`${working_directory}/${data.task.taskId}_${i}_rotate.mp4`
                        let dst_2 = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                        let dst_3 = `${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`
                        if(!WorkerUtil.dirNameIsExist(dst_1)){
                          await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_1);
                        }else{
                          console.log('=====视频已存在，无需再次下载=====')
                        }
                        // await doRotate(dst_1,90,dst_rotate)
                        if(i==0){  //第一机位呼叫python并且贴图和透明图层
                          let option=`1600 560 300 300 1.5 1080 1920`
                          await CallPython(`${activity_directory}/feizhou_c1.py`,dst_1,option,dst_3)
                        }else{
                          if(data.task.later_setting.record[i]['effect']){
                            if(data.task.later_setting.record[i]['effect']=='1'){
                              await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                            }else{
                              await trimVideo(dst_1,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                              await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_3);
                            }
                          }else{
                            console.log('=======未设定特效======')
                            await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                          }
                        }
                      }
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let src=`${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`
                        let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                        let basePIC=`${activity_directory}/aaa.png`
                        let dst_crop=`${working_directory}/${data.task.taskId}_${i}_crop.mp4`
                        let dst_mov= `${working_directory}/pasteMOV_${i}.mp4`
                        if(i==0){
                          await paste_baseMOVandbasePIC(src,baseMOV,basePIC,-400,900,-100,-300,dst_mov)
                        }
                        if(i==1){
                          await CropVideo(working_directory,src,1080,1920,420,0,dst_crop)
                          await paste_base(dst_crop,baseMOV,-300,300,dst_mov)
                        }
                        if(i==2){
                          await CropVideo(working_directory,src,1080,1920,420,640,dst_mov)
                        }
                        if(i==3){
                          await CropVideo(working_directory,src,1080,1920,420,640,dst_crop)
                          await paste_base(dst_crop,baseMOV,-300,-300,dst_mov)
                        }
                      }
                      let concatOption=`ffmpeg -i ${activity_directory}/start.mp4 -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${activity_directory}/three_effect.mp4 -i ${working_directory}/pasteMOV_2.mp4 -i ${working_directory}/pasteMOV_3.mp4  -filter_complex "[0]setdar=0/1[a];[1]setdar=0/1[b];[2]setdar=0/1[c];[3]setdar=0/1[d];[4]setdar=0/1[e];[5]setdar=0/1[f];[a][b][c][d][e][f]concat=n=6:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                      dst=`${working_directory}/concat_done.mp4`; 
                      await concatVideo(concatOption,dst)
                      break;
                  case '1562135606rh':  //微山湖溜索处理
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                        let dst_out = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                        let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                        let output=`${working_directory}/pasteMOV_${i}.mp4`
                        if(!WorkerUtil.dirNameIsExist(dst_in)){
                          await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                        }else{
                          console.log('=====视频已存在，无需再次下载=====')
                        }
                        if(i==0){
                          //第一个机位视频crop=1080:1920:1580:240
                          await TrimAndCropVideo(working_directory,dst_in,0,10,1080,1920,1580,240,dst_out);
                          //贴第一个MOV特效
                          await paste_base(dst_out,baseMOV,0,-300,output)
                        }
                        dst=output;
                      }
                     break;
                  case '1564562056wr':  //海王飞船处理
                     console.log('===============进海王飞船处理')
                     for(let i=0;i<=task.later_setting.record.length-1;i++){
                       let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                       let dst_rotate = `${working_directory}/${data.task.taskId}_${i}_rotate.mp4`;
                       let dst_trim = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                       let dst_crop = `${working_directory}/${data.task.taskId}_${i}_crop.mp4`;
                       let dst_scale = `${working_directory}/${data.task.taskId}_${i}_scale.mp4`;
                       let dst_out=`${working_directory}/${data.task.taskId}_${i}_out.mp4`
                       let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                       let output=`${working_directory}/pasteMOV_${i}.mp4`
                       if(!WorkerUtil.dirNameIsExist(dst_in)){
                         await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                       }else{
                         console.log('=====视频已存在，无需再次下载=====')
                       }
                       if(i==0){
                         //第一个机位视频（2560*1920）缩小0.75，再裁切成1080*1920
                         await doRotate(dst_in,'',dst_rotate)
                         await trimVideo(dst_rotate,dst_trim,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000)
                         await ScaleVideo(working_directory,dst_trim,0.75,dst_scale)
                         await CropVideo(working_directory,dst_scale,1080,1920,180,0,dst_crop);
                         //贴第一个MOV特效
                        //  await paste_base(dst_crop,baseMOV,-400,0,output)
                        await paste_base(dst_crop,baseMOV,0,0,output)
                       }
                       if(i==1){
                         //第二个机位视频调用haiwangfeichaun_2.py产出1080*1920
                         let option=`200 200 400 400 2.0 1080 640 1800 1000 400 400`
                          await CallPython(`./scripts/python/haiwang2.py`,dst_in,option,dst_out)
                          //贴第二个MOV特效
                          // await paste_base(dst_out,baseMOV,-600,-300,output)
                          await paste_base(dst_out,baseMOV,0,0,output)
                       }
                       if(i==2){
                        //  //第三个机位视频调用haiwangfeichuan_3.py产出1080*1920
                        //  let option=`980 320 200 200 6 1080 1920`
                        //  await CallPython(`./scripts/python/haiwangfeichuan_3.py`,dst_in,option,dst_out)
                        //   //贴第三个MOV特效
                        //   await paste_base(dst_out,baseMOV,-400,600,output)
                        
                        await trimVideo(dst_in,dst_trim,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000)
                        await CropVideo(working_directory,dst_trim,1080,1920,1280,240,dst_crop);
                        //贴第三个MOV特效
                        // await paste_base(dst_crop,baseMOV,-400,400,output)
                        await paste_base(dst_crop,baseMOV,0,0,output)

                       }
                     }                
                     let option_haiwangfeichuan=`ffmpeg -i ${activity_directory}/haiwangfeichuan_start.mp4  -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${working_directory}/pasteMOV_2.mp4 -i ${activity_directory}/haiwangfeichuan_end.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0][4:v:0]concat=n=5:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                      dst=`${working_directory}/concat_done.mp4`; 
                     await concatVideo(option_haiwangfeichuan,dst)
                     break;
                  case '1564562123vy':  //亚丁风暴处理
                      console.log('===============进亚丁风暴处理')
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                        let dst_out = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                        let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                        let output=`${working_directory}/pasteMOV_${i}.mp4`
                        if(!WorkerUtil.dirNameIsExist(dst_in)){
                          await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                        }else{
                          console.log('=====视频已存在，无需再次下载=====')
                        }
                        if(i==0){
                          //第一个机位视频（3072*2048)裁切成1080*1920
                          await CropVideo(working_directory,dst_in,1080,1920,996,120,dst_out);
                          //贴第一个MOV特效
                          await paste_base(dst_out,baseMOV,0,0,output)
                        }
                        if(i==1){
                          //第二个机位视频调用yadingfengbao_2.py产出1080*1920
                          // let option=`0 1650 550 500 8 1080 1920 3400 350 400 400`
                          let option=`0 1650 550 500 8 1080 1920 3000 650 400 400`  //0902.1515
                          await CallPython(`${activity_directory}/yadingfengbao_2.py`,dst_in,option,dst_out)
                          // let option=`3400 350 400 400 8 1080 9120`
                          // await CallPython(`./scripts/python/y1_test.py`,dst_in,option,dst_out)
                           //贴第二个MOV特效
                           console.log('=======出来啦==========================================================')
                           await paste_base(dst_out,baseMOV,0,0,output)
                        }
                        if(i==2){
                          //第三个机位视频调用cv2.py产出1080*1920
                          let option=`1600 0 1000 300 8 1920 1080`
                          // let option=`1600 200 1000 300 8 1920 1080`   //0902.1515
                          await CallPython(`./scripts/python/yadingfengbao_3.py`,dst_in,option,dst_out)
                           //贴第三个MOV特效
                           await paste_base(dst_out,baseMOV,0,0,output)
                        }
                      }     
                      let option_yadingfengbao=`ffmpeg -i ${activity_directory}/yadingfengbao_start.mp4 -i ${working_directory}/pasteMOV_0.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${working_directory}/pasteMOV_2.mp4 -i ${activity_directory}/yadingfengbao_end.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0][4:v:0]concat=n=5:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                       dst=`${working_directory}/concat_done.mp4`; 
                      await concatVideo(option_yadingfengbao,dst)
                    break;
                  case '1562565099yj':  //微山湖网红木板桥处理
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let dst_1 = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                        let dst_2 = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                        let dst_3 = `${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`
                        if(!WorkerUtil.dirNameIsExist(dst_1)){
                          await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_1);
                        }else{
                          console.log('=====视频已存在，无需再次下载=====')
                        }
                        if(data.task.later_setting.record[i]['effect']){
                          if(data.task.later_setting.record[i]['effect']=='1'){
                            await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                          }else{
                            if(i==1){
                              let dst_big=`${working_directory}/${data.task.taskId}_${i}_big.mp4`;
                              let dst_crop=`${working_directory}/${data.task.taskId}_${i}_crop.mp4`
                              await trimVideo(dst_1,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                              await ScaleVideo(working_directory,dst_2,3,dst_big)
                              await CropVideo(working_directory,dst_big,1080,1920,900,1000,dst_crop)
                              await slowDownVideo(dst_crop,data.task.later_setting.record[i]['effect'],dst_3);
                            }else{
                              await trimVideo(dst_1,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                              await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_3);
                            }
                          }
                        }else{
                          console.log('=======未设定特效======')
                          await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                        }
                      }
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let input=`${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`;
                        let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                        let output =`${working_directory}/pasteMOV${i}.mp4`;
                        if(i==0){
                          await paste_base(input,baseMOV,-350,-300,output)
                        }
                        if(i==1){
                          await paste_base(input,baseMOV,-380,-300,output)
                        }
                        if(i==2){
                          await addeffect(data,input,output)
                        }
                        if(i==3){
                          await paste_base(input,baseMOV,-400,700,output)
                        }
                      }
                      let concatoption_mubanqiao=`ffmpeg -i ${working_directory}/pasteMOV0.mp4 -i ${working_directory}/pasteMOV1.mp4 -i ${working_directory}/pasteMOV2.mp4 -i ${working_directory}/pasteMOV3.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0]concat=n=4:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                      dst=`${working_directory}/concat_done.mp4`; 
                      await concatVideo(concatoption_mubanqiao,dst) 
                    break;
                  case '1562135549kj':  //微山湖网红玻璃桥处理
                    for(let i=0;i<=task.later_setting.record.length-1;i++){
                      let dst_1 = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                      let dst_2 = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                      let dst_3 = `${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`
                      if(!WorkerUtil.dirNameIsExist(dst_1)){
                        await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_1);
                      }else{
                        console.log('=====视频已存在，无需再次下载=====')
                      }
                      if(data.task.later_setting.record[i]['effect']){
                        if(data.task.later_setting.record[i]['effect']=='1'){
                          await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                        }else{
                          if(i==1){
                              let dst_big=`${working_directory}/${data.task.taskId}_${i}_big.mp4`;
                              let dst_crop=`${working_directory}/${data.task.taskId}_${i}_crop.mp4`
                              await trimVideo(dst_1,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                              await ScaleVideo(working_directory,dst_2,3,dst_big)
                              await CropVideo(working_directory,dst_big,1080,1920,1500,1500,dst_crop)
                              await slowDownVideo(dst_crop,data.task.later_setting.record[i]['effect'],dst_3);
                          }else{
                            await trimVideo(dst_1,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                            await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_3);
                          }
                        }
                      }else{
                        console.log('=======未设定特效======')
                        await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                      }
                    }
                    for(let i=0;i<=task.later_setting.record.length-1;i++){
                      let input=`${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`;
                      let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                      let output =`${working_directory}/pasteMOV${i}.mp4`;
                      if(i==0){
                        await paste_base(input,baseMOV,-350,-300,output)
                      }
                      if(i==1){
                        await paste_base(input,baseMOV,-380,-300,output)
                      }
                      if(i==2){
                        await addeffect(data,input,output)
                      }
                      if(i==3){
                        await paste_base(input,baseMOV,-400,700,output)
                      }
                    }
                    let concatoption_boliqiao=`ffmpeg -i ${working_directory}/pasteMOV0.mp4 -i ${working_directory}/pasteMOV1.mp4 -i ${working_directory}/pasteMOV2.mp4 -i ${working_directory}/pasteMOV3.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0]concat=n=4:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                    dst=`${working_directory}/concat_done.mp4`; 
                    await concatVideo(concatoption_boliqiao,dst) 
                  break;
                  case '1562222513ls':
                    for(let i=0;i<=task.later_setting.record.length-1;i++){
                      let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                      if(!WorkerUtil.dirNameIsExist(dst_in)){
                        await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                      }else{
                        console.log('=====视频已存在，无需再次下载=====')
                      }
                    }
                      
                      for(let i=0;i<=task.later_setting.record.length-1;i++){
                        let dst_1 = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                        let dst_2 = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                        if(i==0){
                          await CropVideo(working_directory,dst_1,1920,1080,0,0,dst_2)
                        }
                        if(i==2) {
                          await CropVideo(working_directory,dst_1,1920,1080,0,0,dst_2)
                        }
                      }
                        let concatoption_bangongshi=`ffmpeg -i ${working_directory}/${data.task.taskId}_0_trim.mp4 -i ${working_directory}/${task.later_setting.record[1]['fileName']} -i ${working_directory}/${data.task.taskId}_2_trim.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0]concat=n=3:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                        dst=`${working_directory}/concat_done.mp4`; 
                        await concatVideo(concatoption_bangongshi,dst)
                      break;
                      case '1565755797bj':  //欢乐谷处理
                          console.log('===============欢乐谷处理')
                            for(let i=0;i<=task.later_setting.record.length-1;i++){
                              let dst_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                              let dst_rotate=`${working_directory}/${data.task.taskId}_${i}_rotate.mp4`;
                              let dst_out = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                              let dst_scale = `${working_directory}/${data.task.taskId}_${i}_scale.mp4`;
                              let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                              let output=`${working_directory}/pasteMOV_${i}.mp4`
                              if(!WorkerUtil.dirNameIsExist(dst_in)){
                                await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_in);
                              }else{
                                console.log('=====视频已存在，无需再次下载=====')
                              }
                              if(i==0){
                                //第一个机位视频（3840×2160）先旋转再缩小0.5，成1080*1920
                                await doRotate(dst_in,90,dst_rotate)
                                await ScaleVideo(working_directory,dst_rotate,0.5,dst_scale);
                                await trimVideo(dst_scale,dst_out,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000)
                                //贴第一个MOV特效
                                // await paste_base(dst_scale,baseMOV,-400,0,output)
                                await paste_base(dst_out,baseMOV,0,0,output)
                              }
                              if(i==1){
                                //第二个机位视频先旋转在调用huanlegu_2.py产出1080*1920
                                await doRotate(dst_in,90,dst_rotate)
                                let option=`2800 2200 600 600 3.0 1080 1920`
                                await CallPython(`./scripts/python/huanlegu_2.py`,dst_rotate,option,dst_out)
                                //贴第二个MOV特效
                                await paste_base(dst_out,baseMOV,0,0,output)
                              }
                              if(i==2){
                                //第三个机位视频调用huanlegu_3.py产出1080*1920
                                let option=`700 900 700 300 5.0 1080 1920`
                                await CallPython(`./scripts/python/huanlegu_3.py`,dst_in,option,dst_out)
                                // await sleep(5000)
                                //贴第三个MOV特效
                                // await paste_base(dst_out,baseMOV,-400,600,output)
                                await paste_base(dst_out,baseMOV,0,0,output)
                              }
                          }                
                          let option_huanlegu=`ffmpeg -i ${activity_directory}/huanlegu_start.mp4  -i ${working_directory}/pasteMOV_0.mp4 -i ${activity_directory}/three_effect.mp4 -i ${working_directory}/pasteMOV_1.mp4 -i ${working_directory}/pasteMOV_2.mp4 -i ${activity_directory}/huanlegu_end.mp4 -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0][4:v:0][5:v:0]concat=n=6:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                          dst=`${working_directory}/concat_done.mp4`; 
                          await concatVideo(option_huanlegu,dst)
                  break;
                  default:  //锦江和其他活动
                      console.log('======Step 2: 准备原视频和剪辑片段======');
                      console.log(data.activity_id)
                      let dst_concat;
                      if(task.later_setting.record.length>1){      //多机位
                          for(let i=0;i<=task.later_setting.record.length-1;i++){
                            let dst_1 = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                            let dst_2 = `${working_directory}/${data.task.taskId}_${i}_trim.mp4`;
                            let dst_3 = `${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`;
                            let dst_crop = `${working_directory}/${data.task.taskId}_${i}_crop.mp4`;
                            if(!WorkerUtil.dirNameIsExist(dst_1)){
                              await WorkerUtil.ossDownload(task.later_setting.record[i]['fileName'], dst_1);
                            }else{
                              console.log('=====视频已存在，无需再次下载=====')
                            }
                            if(data.task.later_setting.record[i]['effect']){
                              if(data.task.later_setting.record[i]['effect']=='1'){
                                // if(data.task.later_setting.record[i]['crop']){    //区分武汉wepark第2机位 1944×1296   ===》1920×1080
                                //   await CropVideo(working_directory,dst_1,1920,1080,data.task.later_setting.record[i]['crop']['x'],data.task.later_setting.record[i]['crop']['y'],dst_crop);
                                //   await trimVideo(dst_crop,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                                // }else{
                                  await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                                // }
                              }else{
                                   if(data.activity_id=='1557886955xa'&&i==2 || data.activity_id=='1557886955xa'&&i==3){                       
                                        //紧急那个第三机位3840*2160需要crop
                                        await CropVideo(working_directory,dst_1,1080,1920,1000,1200,dst_crop);
                                        await trimVideo(dst_crop,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                                        await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_3);                          
                                   }else{
                                    await trimVideo(dst_1,dst_2,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                                    await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_3);
                                   }
                                 }
                                // if(i==1){
                                  // 50fps需要处理圆滑才能和30fps进行无缝拼接
                                  // let dst_slow=`${working_directory}/${data.task.taskId}_${i}_trim_slow.mp4`
                                  // await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_slow);
                                  // await smoothVideo(working_directory,dst_slow,dst_3)
                                // }else{
                                //   await slowDownVideo(dst_2,data.task.later_setting.record[i]['effect'],dst_3);
                                // }
                            }else{
                              console.log('=======未设定特效======')
                              await trimVideo(dst_1,dst_3,data.task.later_setting.record[i]['begin']/1000,data.task.later_setting.record[i]['duration']/1000);
                            }
                          }
                      }else{             //单机位
                        let dst_1 = `${working_directory}/${data.task.taskId}_${0}.mp4`;
                         await WorkerUtil.ossDownload(task.later_setting.record[0]['fileName'], dst_1);
                      } 
                      console.log('=======视频调亮度、饱和度、对比度======')
                      if(task.later_setting.record.length>1){  
                        for(let i=0;i<=task.later_setting.record.length-1;i++){
                          let input=`${working_directory}/${data.task.taskId}_${i}_trim_speed.mp4`;
                          let dst_python_in = `${working_directory}/${task.later_setting.record[i]['fileName']}`;
                          let dst_python_out=`${working_directory}/${data.task.taskId}_${i}_python.mp4`
                          let output =`${working_directory}/${data.task.taskId}_${i}_brightness.mp4`;
                          console.log(data.activity_id+'===========================')
                          if(data.activity_id=='1557886955xa' && i==1){
                              console.log('============================锦江并且第二机位处理:python外挂+原始频0-3秒')
                              //let option=`3200 1600 300 300 1.1 1080 1920`
                              let option=`1100 1100 600 600 1.0 1080 1920`
                              // await addBrightness(input,dst_python_out)
                              await CallPython(`${activity_directory}/jinjiang_2_houqi.py`,dst_python_in,option,dst_python_out);
                              await addBrightness(dst_python_out,output)
                          }else{
                            await addBrightness(input,output)
                          }
                        }
                      }   
                      console.log('=======特效模板与视频贴合======')
                      if(task.later_setting.record.length>1){
                        for(let i=0;i<=task.later_setting.record.length-1;i++){
                          console.log('=========================='+typeof(task.later_setting.record[i]['paste_mov']))
                          if(task.later_setting.record[i]['paste_mov']){
                            let src=`${working_directory}/${data.task.taskId}_${i}_brightness.mp4`
                            let baseMOV=`${activity_directory}/pasteMOV_${i}.mov`
                            let basePIC=`${activity_directory}/sky_${i}.png`
                            let output=`${working_directory}/pasteMOV${i}.mp4`
                            await paste_MOV(src,i,baseMOV,basePIC,output,working_directory)
                          }
                        }
                      }            
                      console.log('======Step3:拼接多段视频======')
                      if(task.later_setting.record.length>1){     //多机位（大于或等于2）
                            dst_concat=`${working_directory}/concat_done.mp4`;
                            let ConcatFileTXT=`${ConcatFile}/merge.txt`;
                            // await make_concatTXT(task,ConcatFileTXT,ConcatFile)
                            // await MergeVideo(ConcatFileTXT,dst)
                            if(data.activity_id=='1557886955xa'){
                              console.log('======锦江后期加片尾')
                              let concatOption=`ffmpeg -i ${activity_directory}/start.mp4 -i ${working_directory}/pasteMOV0.mp4 -i ${working_directory}/pasteMOV1.mp4 -i ${working_directory}/${data.task.taskId}_2_brightness.mp4 -i ${working_directory}/pasteMOV3.mp4 -i ${activity_directory}/end.mp4  -filter_complex "[0:v:0][1:v:0][2:v:0][3:v:0][4:v:0][5:v:0]concat=n=6:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                              await concatVideo(concatOption,dst_concat)
                            }else{
                              if(data.activity_id=='1564467124kx'){
                                console.log('===============将军你室内环境设计好')
                                let concatOptions=`ffmpeg -i ${working_directory}/${data.task.taskId}_0_brightness.mp4 -i ${working_directory}/${data.task.taskId}_1_brightness.mp4 -i ${working_directory}/${data.task.taskId}_2_brightness.mp4 -i ${working_directory}/${data.task.taskId}_3_brightness.mp4 -i ${working_directory}/${data.task.taskId}_4_brightness.mp4 -i ${working_directory}/${data.task.taskId}_5_brightness.mp4 -filter_complex "[0]setdar=0/1[a];[1]setdar=0/1[b];[2]setdar=0/1[c];[3]setdar=0/1[d];[4]setdar=0/1[e];[5]setdar=0/1[f];[a][b][c][d][e][f]concat=n=6:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`
                                await concatVideo(concatOptions,dst_concat)
                              }else{
                                console.log('===============将军你')
                                await concatVideo(this.param.concatOptions,dst_concat)
                              }
                            }
                      }else{                                         //单机位
                            let src=`${working_directory}/${data.task.taskId}_0.mp4`;
                            let dst_1=`${working_directory}/concat_done.mp4`;
                            await trimVideo(src,dst_1,data.task.later_setting.record[0]['begin']/1000,data.task.later_setting.record[0]['duration']/1000);
                            dst_concat=dst_1;
                      }  
                      dst=dst_concat
                    break;
                }
                // if(data.activity_id=='1557886955xa'){
                //   // 锦江活动：视频需要旋转
                //   console.log('=====需要旋转=====')
                //   let dst_1=`${working_directory}/rotate.mp4`;
                //   let deg=2   //0:逆时针旋转90°然后垂直翻转 1:顺时针旋转90° 2:逆时针旋转90° 3:顺时针旋转90°然后水平翻转
                //   await doRotate(dst,deg,dst_1);
                //   dst=dst_1;
                // }      
                if(this.param.enableeffect){
                  console.log('======特效：慢动作======')
                  let dst_1=`${working_directory}/effect.mp4`;
                  await doSpeed(dst,this.param.effect_start,this.param.effect_duration,this.param.effect_speed,`${ConcatFile}/${data.task.taskId}`,dst_1)
                  dst=dst_1;
                }   
                if(this.param.enablegreen){
                  console.log('======绿屏处理======')
                    let dst_1=`${working_directory}/green_done.mp4`;
                    let mapcmd='-map "[out]" -map 1:0 -hide_banner -loglevel panic -y -profile:v high -level:v 4.0 -c:a copy -r 30';
                    await applyGreenScreen(dst,this.param.ground_video,this.param.color,this.param.similarity,this.param.blend,mapcmd,0,0,dst_1);
                    dst=dst_1
                }
                  if(this.param.enableborder){
                    console.log('======贴模板======')
                      let dst_1=`${working_directory}/overlay_done.mp4`;
                      await doOverlay(dst, this.param.border,0,0, dst_1);
                      dst=dst_1;
                  }   
                  if(this.param.enablelogo){
                    console.log('======贴LOGO======')
                      let dst_1=`${working_directory}/logo_done.mp4`;
                      await doOverlay(dst, this.param.logo_url,this.param.logo_x,this.param.logo_y, dst_1);
                      dst=dst_1;
                  }   
                  if(this.param.enablebgm){
                    console.log('======贴背景音乐======')
                      let dst_1=`${working_directory}/music_done.mp4`;
                      await applyMusic(dst, this.param.bgm, dst_1);
                      dst=dst_1;
                  }
              break;
          }
        //   // Step 3: Do light adjust   视频亮度
        //   console.log('Step 3: Adjust light');
        //   console.log('Step 3: Complete');

        //   // Step 4: Do turn page (transition effect)  做转场
        //   console.log('Step 4: Do transition effect');
        //   if (!this.param.rmturn) {
        //     let dst_1 = `${working_directory}/tx.mp4`;
        //     await doTx(working_directory, src, dst_1);
        //     // TODO: Check result
        //     dst = dst_1;
        //   }
        //   console.log('Step 4: complete');


          // Step 7: Upload thumbnail and result video
          if(data.activity_id!=='1557886955xa'){  //非锦江活动需要截图和缩略图
            let frame_jpg = `${working_directory}/${data.task.taskId}.jpg`;
            let frame_jpg_min=`${working_directory}/${data.task.taskId}_min.jpg`
            if(data.acticity_id=='1562135606rh'){
              await getFrame(dst, '00:00:09',frame_jpg);
            }else{
              await getFrame(dst, '00:00:05',frame_jpg);
            }
            await scalePic(data,frame_jpg,0.3,frame_jpg_min);
            await WorkerUtil.ossUpload(data,frame_jpg, `${data.activity_id}/${task.taskId}.jpg`);
            await WorkerUtil.ossUpload(data,frame_jpg_min, `${data.activity_id}/${task.taskId}_min.jpg`);
          }
        console.log('======Step_end:确认上传oss======')
          if(data.task.provider&&data.task.provider.mate){
            if(data.task.provider.mate=='wepark-oss'){
              console.log('上传到wepark的oss==============》')
              await WorkerUtil.ossUploadToWepark(dst, `${data.activity_id}/${task.taskId}.mp4`);
              await WorkerUtil.ossUpload(data,dst, `${data.activity_id}/${task.taskId}.mp4`);
            }else{
              console.log('上传到我们的oss')
              await WorkerUtil.ossUpload(data,dst, `${data.activity_id}/${task.taskId}.mp4`);
              // 生产带参数（taskId）小程序二维码
              // WorkerUtil.getqrcode(data.task.taskId)
            }
          }else{
            console.log('不存在,也上传到我们的oss')
            await WorkerUtil.ossUpload(data,dst, `${data.activity_id}/${task.taskId}.mp4`);
            // 生产带参数（taskId）小程序二维码
              // WorkerUtil.getqrcode(data.task.taskId)
          }
          cb ? cb.onStop(data, 'finish task', null, null) : '';
        } catch (err) {
          console.error('剪接錯誤：' + err);
          cb ? cb.onAbort(data, '剪接錯誤') : '';
        } finally {
          console.log('Task complete!');
          WorkerUtil.executeCmd(`rm -r -f ${working_directory}`);
        }
        break;
    }
  }
}

// 缩图
async function scalePic(data,farme_jpg,value,frame_jpg_min){
  const scalePicCmd = `ffmpeg -i ${farme_jpg} -vf scale=iw*${value}:ih*${value} -y -hide_banner -loglevel panic ${frame_jpg_min}`;
  console.log('scalePicCmd command = ' + scalePicCmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(scalePicCmd); 
  } catch (err) {
      console.log(`scalePicCmd video error`);
      return Promise.reject('');
  }
}

async function addeffect(data,input,output){
  // const addOptions = `-vf hue=s=0`;    //黑白特效
  // const addOptions = `-filter_complex colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131`;    //棕褐色特效
  const addOptions = `-vf frei0r=vertigo:0.2`;    //残影特效
  // const addOptions = `-vf frei0r=glow:1`;    //光晕特效
  const addeffectCmd = `ffmpeg -i ${input} ${addOptions} ${output}`; 
  console.log('add effect command = ' + addeffectCmd); 
  console.log('----------------------'); 
  try {
    return await WorkerUtil.executeCmd(addeffectCmd); 
} catch (err) {
    console.log(`addeffec video error`);
    return Promise.reject('');
}
}


async function concatVideo(options,dst) { 
// console.log(`${options}`)
    const concatCmd = `${options} ${dst}`;
    console.log('concat command = ' + concatCmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(concatCmd);
    } catch (err) {
        console.log('concat Video error')
        return Promise.reject('');
    }
}

async function CallPython(py,input,option,output){
  const CallPythonCmd = `python3 ${py} ${input} ${output} ${option}`;
      console.log('CallPython command = ' + CallPythonCmd);
      console.log('----------------------');
      try {
          return await WorkerUtil.executeCmd(CallPythonCmd);
      } catch (err) {
          console.log(`python ${py} error`)
          return Promise.reject('');
      }
}

// 特效之慢动作
async function doSpeed(input:string,start : string, duration:string,speed:string,ConcatFile:string,output: string) {
  let dst_1 = `${ConcatFile}/trim1.mp4`;
  let dst_2 = `${ConcatFile}/trim2.mp4`;
  let dst_3 = `${ConcatFile}/trim3.mp4`;
  let dst_2_slow=`${ConcatFile}/trim2_slow.mp4`;
  let ConcatFileTXT=`${ConcatFile}/concat.txt`
  await trimVideo(input, dst_1, 0, start);
  await trimVideo(input, dst_2, start, duration);
  await trimVideoLast(input, dst_3, Number(start)+Number(duration));
  await slowDownVideo(dst_2,speed,dst_2_slow)
  let file_video = `file '${dst_1}'\n file '${dst_2_slow}'\n file '${dst_3}'`
  console.log(file_video)
  console.log(ConcatFileTXT)
  await write_mergefile(ConcatFileTXT,file_video);
  // await MergeVideo(ConcatFileTXT,output);
}

// 生成·拼接txt
async function make_concatTXT(task,ConcatFileTXT,ConcatFile){
  let file_video=''
  for(var i=0;i<=task.later_setting.record.length-1;i++){
    if(task.later_setting.record[i]['paste_mov']){
      file_video=file_video+`file '${ConcatFile}/pasteMOV_${i}.mp4'\n `
    }else{
      file_video=file_video+`file '${ConcatFile}/${task.taskId}_${i}_trim_speed.mp4'\n `
    } 
  }
  await write_mergefile(ConcatFileTXT,file_video);
}

// 使用txt文件路径进行拼接视频
// async function MergeVideo(file,dst){
  async function MergeVideo(file,dst){
      const cmd = `ffmpeg -y -f concat -safe 0 -i ${file} -c copy -hide_banner -loglevel panic ${dst}`;
      console.log('mergeVideo command = ' + cmd);
      console.log('----------------------');
      try {
          return await WorkerUtil.executeCmd(cmd);
      } catch (err) {
          console.log('merge Video error')
          return Promise.reject('');
      }
}

// 转化后h264
async function smoothVideo(working_directory,input,output){
  let dst_h264=`${working_directory}/seeing_noaudio.h264`;
  await make_h264(input,dst_h264);
  await change_fps(dst_h264,output)
}

async function make_h264(input,output){
  const cmd = `ffmpeg -y -i ${input} -c copy -f h264 -hide_banner -loglevel panic ${output}`;
  console.log('make_h264 command = ' + cmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
      console.log('make_h264 Video error')
      return Promise.reject('');
  }
}

async function resize(input,width,height,output){
  const cmd = `ffmpeg -i ${input} -s ${width}*${height} -hide_banner -loglevel panic ${output}`;
  // const cmd = `ffmpeg -y -i ${input} -vf scale=${width}:${height} -hide_banner -loglevel panic ${output}`;
  console.log('resize command = ' + cmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
      console.log('resize error')
      return Promise.reject('');
  }
}

// 调节亮度0.2、饱和度2、对比度1.5
async function addBrightness(input,output){
  const cmd = `ffmpeg -y -i ${input} -vf eq=contrast=1.5:brightness=0.1:saturation=2 -hide_banner -loglevel panic ${output}`;
  console.log('addBrightness command = ' + cmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
      console.log('addBrightness Video error')
      return Promise.reject('');
  }
}

async function change_fps(input,output){
  const cmd = `ffmpeg -y -r 25 -i ${input} -c copy -hide_banner -loglevel panic ${output}`;
  console.log('change_fps command = ' + cmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
      console.log('change_fps Video error')
      return Promise.reject('');
  }
}
// 转场
async function doTx(working_directory: string, src: string, dst: string) {
  let dst_1 = `${working_directory}/trim1.mp4`;
  let dst_2 = `${working_directory}/trim2.mp4`;
  let dst_3 = `${working_directory}/trim3.mp4`;
  await trimVideo(src, dst_1, 0, 5);
  await trimVideo(src, dst_2, 3, 5);
  await trimVideo(src, dst_3, 6, 4);
  await applyTx([dst_1, dst_2, dst_3], dst);
}

async function trimVideo(src: string, dst: string, start, duration) {
  const addOptions = `-ss ${start} -t ${duration} -i`;
    const cmd = `ffmpeg ${addOptions} ${src} -y -hide_banner -loglevel panic ${dst}`;
    console.log('trimVideo command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('trim Video error')
        return Promise.reject('');
    }
}

async function paste_MOV(src: string,i,baseMOV:string,basePIC:string, dst: string,working_directory:string) {
  let dst_1=`${working_directory}/baseMOV.mp4`
  await paste_base(src,baseMOV,0,0,dst);
  // if(i==2){
    // await paste_base(src,basePIC,dst)
  // }else{
  //   await paste_base(src,basePIC,dst_1)
  //   await paste_base(dst_1,baseMOV,dst)
  // }
  // switch(i){
  //   case 1:
  //       await paste_base(src,baseMOV,dst);
  //       break;
  //   case 2:
  //       await paste_base(src,basePIC,dst)
  //       break;
  //   default:
  //       await paste_base(src,basePIC,dst_1)
  //       await paste_base(dst_1,baseMOV,dst)
  //       break;
  // }
}
async function paste_base(src: string,base:string,x,y, dst: string) {
  const addOptions = `-vf "movie=${base}[a];[in][a]overlay=${x}:${y}[b]"`;
    const cmd = `ffmpeg -i ${src} ${addOptions} -y -hide_banner -loglevel panic ${dst}`;
    console.log('paste_MOV command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('paste_MOV Video last error')
        return Promise.reject('');
    }
}

async function paste_baseMOVandbasePIC(src,baseMOV,basePIC,MOV_x,MOV_y,PIC_x,PIC_y,dst){
  const addOptions = `-vf "movie=${baseMOV}[a];[in][a]overlay=${MOV_x}:${MOV_y}[b];movie=${basePIC}[c];[b][c]overlay=${PIC_x}:${PIC_y}[d]"`;
  const cmd = `ffmpeg -i ${src} ${addOptions} -y -hide_banner -loglevel panic ${dst}`;
  console.log('paste_baseMOVandbasePIC command = ' + cmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
      console.log('paste_baseMOVandbasePIC Video last error')
      return Promise.reject('');
  }
}

async function trimVideoLast(src: string, dst: string, start) {
  const addOptions = `-ss ${start} -i`;
    const cmd = `ffmpeg ${addOptions} ${src} -y -hide_banner -loglevel panic ${dst}`;
    console.log('trimVideoLast command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('trim Video last error')
        return Promise.reject('');
    }
}

// 放大缩小视频尺寸并裁切
async function ScaleAndCropVideo(working_directory:string,src: string, scale,crop_x,crop_y,crop_w,crop_h,dst: string) {
  let dst_zhuan=`${working_directory}/zhan.mp4`
  let dst_trim=`${working_directory}/trim.mp4`
  await ScaleVideo(working_directory,src,scale,dst_zhuan);
  await CropVideo(working_directory,dst_zhuan,crop_x,crop_y,crop_w,crop_h,dst_trim)
  await trimVideo(dst_trim,dst,0,3)
}

async function TrimAndCropVideo(working_directory,src,start,duration,crop_w,crop_h,crop_x,crop_y,dst){
  const Options = `-ss ${start} -t ${duration} -filter:v "crop=${crop_w}:${crop_h}:${crop_x}:${crop_y}" -c:a copy`;
  const cmd = `ffmpeg -i ${src} ${Options} -y -hide_banner -loglevel panic ${dst}`;
  console.log('TrimAndCropVideo command = ' + cmd);
  console.log('----------------------');
  try {
      return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
      console.log('TrimAndCropVideo error')
      return Promise.reject('');
  }
}
// 放大缩小视频尺寸并裁切
async function ScaleVideo(working_directory:string,src: string, scale,dst: string) {
  let dst_zhuan=`${working_directory}/zhan.mp4`
    const addOptions = `-vf scale=iw*${scale}:ih*${scale}`;
    const cmd = `ffmpeg -i ${src} ${addOptions} -y -hide_banner -loglevel panic ${dst}`;
    console.log('ScaleVideo command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('scale Video error')
        return Promise.reject('');
    }
}
// 放大缩小视频尺寸并裁切
async function CropVideo(working_directory:string,src: string,crop_w,crop_h,crop_x,crop_y,dst: string) {
    const addOptions = `-vf crop=${crop_w}:${crop_h}:${crop_x}:${crop_y}`;
    const cmd = `ffmpeg -i ${src} ${addOptions} -shortest -strict -2 -y -hide_banner -loglevel panic ${dst}`;
    console.log('CropVideo command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('trim Video last error')
        return Promise.reject('');
    }
}

async function CropImg(working_directory:string,src: string,crop_w,crop_h,crop_x,crop_y,dst: string){
    const addOptions = `-vf crop=${crop_w}:${crop_h}:${crop_x}:${crop_y}`;
    const cmd = `ffmpeg -i ${src} ${addOptions} -y -hide_banner -loglevel panic ${dst}`;
    console.log('CropIMG command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('crop img error')
        return Promise.reject('');
    }
}

async function slowDownVideo(input: string, speed: string, output:string) {
  const addOptions = `-filter:v "setpts=${speed}*PTS"`;
    const cmd = `ffmpeg -i ${input} ${addOptions} -y -hide_banner -loglevel panic ${output}`;
    console.log('slowDownVideo command = ' + cmd);
    console.log('----------------------');
    try {
        return await WorkerUtil.executeCmd(cmd);
    } catch (err) {
        console.log('slowdown Video error')
        return Promise.reject('');
    }
}

async function applyTx(src: string[], dst: string) {
  let options = [
    { name: 'crosswarp', duration: 1500 },
    { name: 'cube', duration: 1500 }
  ];
  await concat({
    output: dst,
    videos: src,
    transitions: options
  });
}

async function applyGreenScreen(src,templet,color,similarity,blend,mapcmd,x,y,dst_1) {
    // ref: https://ffmpeg.org/ffmpeg-filters.html#chromakey
    const chromakey = `-filter_complex "[1:v]chromakey=${color}:${similarity}:${blend}[ckout];[0:v][ckout]overlay=${x}:${y}[out]"`;
    const greenCmd = `ffmpeg -i ${templet} -i ${src} ${chromakey} ${mapcmd} ${dst_1}`;   
    console.info(`greenScreen command = ${greenCmd}`);   
    try {
        return await WorkerUtil.executeCmd(greenCmd);
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

async function applyMusic(src, music, dst: string) {
//   const addOptions = `-c copy -y -hide_banner -loglevel panic`;
const addOptions = `-shortest -strict -2 -y -hide_banner -loglevel panic`;
  const cmd = `ffmpeg -i ${music} -i ${src} ${addOptions} ${dst}`;
  console.log('applyMusic command = ' + cmd);
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`add music video error`);
    return Promise.reject('');
  }
}

async function doOverlay(src, board,x,y, dst: string) {
  const addOptions = `-filter_complex "[0:v][1:v] overlay=${x}:${y}" -hide_banner -loglevel panic -y`;
  const cmd = `ffmpeg -i ${src} -i ${board} ${addOptions} ${dst}`;
  console.log('doOverlay command = ' + cmd);
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`overlay video error`);
    return Promise.reject('');
  }
}

async function getFrame(src, starttime,dst) {
  const cmd = `ffmpeg -i ${src} -y -f image2 -ss ${starttime} -vframes 1 -hide_banner -loglevel panic -y ${dst}`;
  console.log('getFrame command='+cmd)
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`interceptFrame video error`);
    return Promise.reject('');
  }
}


async function doRotate(src,deg,dst){
  // const cmd=`ffmpeg -i ${src} -filter_complex "transpose=2[img1];[img1]scale=1920:1080" ${dst} -hide_banner -loglevel panic -y`;
  // const cmd=`ffmpeg -i ${src} -vf "transpose=${deg}" -hide_banner -loglevel panic -y ${dst}`
  const cmd=`ffmpeg -i ${src} -metadata:s:v rotate="90" -c copy -hide_banner -loglevel panic -y ${dst}`
  console.log('doRotate command='+cmd);
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`doRotate error`);
    return Promise.reject('');
  }
}

async function Rotate(src,deg,dst){
  const cmd=`ffmpeg -i ${src} -filter_complex "transpose=2" ${dst} -hide_banner -loglevel panic -y`;
  // const cmd=`ffmpeg -i ${src} -vf "transpose=${deg}" -hide_banner -loglevel panic -y ${dst}`
  // const cmd=`ffmpeg -i ${src} -metadata:s:v rotate="90" -c copy -hide_banner -loglevel panic -y ${dst}`
  console.log('Rotate command='+cmd);
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`doRotate error`);
    return Promise.reject('');
  }
}



async function mkdirp(task) {
    let rootPath = path.join(__dirname, `../../assets/video`);
    const folderName = String(`soccer/${task.taskId}`).split('/');
    folderName.forEach(folder => {
        rootPath = path.join(rootPath, '/', folder);
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath);
        }
    });
    return rootPath;
}

async function write_mergefile(ConcatFile,file_video){
  return  new Promise((resolve, reject) => {
      fs.writeFile(`${ConcatFile}`,file_video,function(error){
          if(error){
              console.log(error)
              reject(error)
          }
          resolve();
      });
  });
}

async function sleep(ms) {
  return new Promise(resolve => {
      setTimeout(resolve, ms)
  })
}


