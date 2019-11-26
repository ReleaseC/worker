//import { User } from './interfaces/user.interface';
//import { Model } from 'mongoose';
import * as dns from 'dns';
import * as OS from 'os';
import * as timers from 'timers';
import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { RetObject } from '../common/ret.component';
import { Global } from '../common/global.component';
import * as FS from 'fs';
import axios from 'axios';
import * as child from "child_process";
import { exit } from 'process';

@Component()
export class RecordService {
  // constructor(
  //   @Inject('UserModelToken') private readonly userModel: Model<User>) { }
  async post_test(data) {
    let ret: RetObject = new RetObject;
    ret.code = 1;
    ret.result = data;
    return ret;
  }

  async cut(time,id) {
    var uid = Global.getid()
      console.log(id+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log('开始剪辑');
        console.log(time)
        let env = { input_path: './video/'+time, output_path: './video/'+time, photo_path: './video/'+time,txt_path:'./video/'+time+'/video.txt' };
        FS.readFile('./video/'+time+'/video.txt',function(err,data){
            if(err){

            }
            if(data){
               FS.writeFileSync('./video/'+time+'/video.txt',"file 'up.mp4' file 'base.mp4' file 'down.mp4'"); 
            }
        })
        FS.readdir(env.input_path, (err, files) => {
         // var i = 0;
          files.forEach(folder => {
            console.log(files)
            const input_video = `${env.input_path}/${folder}`;
            const output_photo = `${env.photo_path}/${folder}`;
            console.log(folder);
            
          //   const pic = folder.split('_')[1].split('.')[0];
          //  // const pic = i+1;
          //   const photo_path = `${env.photo_path}/${pic}.jpg`;
          //   let cmd = `ffmpeg -y -i ${input_video} -ss 00:00:02 -f image2 -r 1 -vframes 1 -vcodec mjpeg -s 1920*1080 ${photo_path}`;
          //   child.execSync(cmd);
          })
          const output_photo = `${env.photo_path}/%d.jpg`;
          const base_video = `${env.output_path}/base.mp4`;
          const base1_video = `${env.output_path}/base1.mp4`;
          const base2_video = `${env.output_path}/base2.mp4`;
          const up_video = `${env.input_path}/siiva_1.h264`;
          const up = `${env.output_path}/up.mp4`;
          const down_video = `${env.input_path}/siiva_1.h264`;
          const down = `${env.output_path}/down.mp4`;
          const merge_video = `${env.output_path}/merge.mp4`;
          const id_video = `${env.output_path}/video.mp4`;
          // let cmd_up = `ffmpeg -y -i ${up_video} -ss 2.5 -to 3 -filter_complex "setpts=2*PTS" -vcodec libx264 ${up}`;
          // let cmd_down = `ffmpeg -y -i ${down_video} -ss 3 -to 3.5 -filter_complex "setpts=2*PTS" -vcodec libx264 ${down}`;
          let cmd_base = `ffmpeg -y -r 30 -f image2 -i ${output_photo} -vcodec libx264 -crf 25 -pix_fmt yuv420p ${base_video}`;
          // let cmd_base1 = `~/ffmpeg-3.4.2-64bit-static/ffmpeg -i ${base_video} -vf minterpolate=fps=120 ${base1_video}`;
          // let cmd_base2 = `ffmpeg -i ${base1_video} -vf setpts=4*PTS -an ${base2_video}`;
          let cmd_upload = `./filemgr --action put --bucket siiva --key `+uid+`.mp4 --file ${base_video}`
          //let cmd_base = `ffmpeg -y -f image2 -i ${output_photo} -vcodec libx264 -r 15 ${base_video}`;

         // let cmd_merge = `ffmpeg -y -f concat -i ${env.txt_path} -c copy ${merge_video}`;
          //let cmd_video = `ffmpeg -y -i ${merge_video} -filter_complex "setpts=2*PTS" ${id_video}`;

          // console.log(cmd_up);
          // console.log(cmd_down);
          // console.log(cmd_base);
         // console.log(cmd_merge);
          console.log(cmd_upload+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

          // child.execSync(cmd_up);
          // child.execSync(cmd_down);
          child.execSync(cmd_base);
          //child.execSync(cmd_base1);
          //child.execSync(cmd_base2);
         // child.execSync(cmd_upload);
          
        })
        
        //let response = await axios.get('https://bt.siiva.com/wechat/auto_push?id='+uid)
        //console.log(response)
        //return response;
   
  }

  async start_record(id) {
    // var key = id;
    // console.log(Global.getSocket()[key])
    // Global.getSocket()[key].broadcast.emit('start_record', id);
    // //Global.getSocket()[key].emit('start_record',id);
    // return key;
  }


}
