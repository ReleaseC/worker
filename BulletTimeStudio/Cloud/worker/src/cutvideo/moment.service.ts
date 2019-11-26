import { Component } from '@nestjs/common';
import * as child from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import urlencode from 'urlencode';
import concat from 'ffmpeg-concat';

import { IWorkerCallback, IEngine } from '../common/worker.interface';
import { WorkerUtil } from '../common/worker.util';
const concat = require('ffmpeg-concat');
class MomentParams {
  src_video: string;
  dst_video: string;
  light: number;
  rmboard: boolean;
  rmturn: boolean;
  rmbgm: boolean;
  board: string;
  music: string;
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
export class MomentVideoService implements IEngine {
  param: MomentParams;

  constructor() {}

  initParamFromTask(task: any) {
    task.param = task.param || {};

    // Init param from task. If no set in task, use default param (right side)
    this.param = new MomentParams();
    this.param.src_video = task.fileName1 || '';
    this.param.light = task.param['light'] || 0;
    this.param.rmboard = (task.param['rmboard'] as boolean) || false;
    this.param.rmbgm = (task.param['rmbgm'] as boolean) || false;
    this.param.rmturn = (task.param['rmturb'] as boolean) || false;
    this.param.board =
      task.param['board'] ||
      `template${Math.floor(Math.random() * 10 + 1)}.png`;
  }

  async cut_video(data, cb: IWorkerCallback) {
    const task = data.task;
    console.log(data.task);
    let downloadMsg = '';
    // working directory is the location to put temporary files during cutvideo
    // Delete working dirctory after result video is uploaded.
    let working_directory = WorkerUtil.prepareWorkingDirectory(task.taskId);

    // Init cutvideo params from task.json
    // Each type has it's own parameters, roughtly, the parameters include:
    // type, source media (OSS link), dst (OSS link), cutvideo params
    // Template files (OSS link)
    // Not each params is set before cutvideo, so, set default parameters in initParam
    // It is also for backward compatible as we extends params in each version
    // Not each sites contains all new added params.

    try {
      this.initParamFromTask(data.task);
      data['worker_id'] = WorkerUtil.getWorkerId();

      console.log('Step 1: Prepare templates, include board, music');
      if (!this.param.rmboard) {
        // Not set now
        // await ossDownloadTemplate(this.param.board);
        let src = this.param.board;
        let dst = `${working_directory}/${this.param.board}`;
        await WorkerUtil.ossDownload(src, dst);
      }
      console.log('Step 1: complete');
      // TODO: Check if templates are ready

      console.log('Step 2: Prepare source video');
      let src = this.param.src_video;
      let dst = `${working_directory}/${data.task.taskId}.mp4`;
      await WorkerUtil.ossDownload(src, dst);
      src = dst;
      console.log('Step 2: complete');
      // TODO: Check if source is ready

      // Step 3: Do light adjust   视频亮度
      console.log('Step 3: Adjust light');
      console.log('Step 3: Complete');

      // Step 4: Do turn page (transition effect)  做转场
      console.log('Step 4: Do transition effect');
      if (!this.param.rmturn) {
        let dst_1 = `${working_directory}/tx.mp4`;
        await doTx(working_directory, src, dst_1);
        // TODO: Check result
        dst = dst_1;
      }
      console.log('Step 4: complete');

      // Step 5: Add board  贴模板
      console.log('Step 5: Add board');
      if (!this.param.rmboard) {
        let dst_1 = `${working_directory}/overlay.mp4`;
        let board = `${working_directory}/${this.param.board}`;
        await doOverlay(dst, board, dst_1);
        dst = dst_1;
      }
      console.log('Step 5: complete');

      // Step 6: Add music  贴音乐
      console.log('Step 6: Add music');
      if (!this.param.rmbgm) {
        // TODO: Refactor music assignment
        let dst_1 = `${working_directory}/music.mp4`;
        let music = `assets/overlay/soccer/music${Math.floor(
          Math.random() * 5 + 1
        )}.mp3`;
        await applyMusic(dst, music, dst_1);
        dst = dst_1;
      }
      console.log('Step 6: complete');

      // Step 7: Upload thumbnail and result video
      let frame_jpg = `${working_directory}/${data.task.taskId}.jpg`;
      await getFrame(dst, frame_jpg);
      await WorkerUtil.ossUpload(frame_jpg, `soccer_${task.taskId}.jpg`);
      await WorkerUtil.ossUpload(dst, `soccer_${task.taskId}.mp4`);

      cb ? cb.onStop(data, 'finish task', null, null) : '';
    } catch (err) {
      console.error('剪接錯誤：' + err);
      cb ? cb.onStop(data, err, null, null) : '';
    } finally {
      console.log('Task complete!');
      WorkerUtil.executeCmd(`rm -r -f ${working_directory}`);
    }
  }
}

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
  const cmd = `ffmpeg ${addOptions} ${src} -y -hide_banner -loglevel verbose ${dst}`;
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
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

async function applyMusic(src, music, dst: string) {
  const addOptions = `-c copy -y -hide_banner -loglevel panic`;
  const cmd = `ffmpeg -i ${music} -i ${src} ${addOptions} ${dst}`;
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`add music video error`);
    return Promise.reject('');
  }
}

async function doOverlay(src, board, dst: string) {
  const addOptions = `-filter_complex "[0:v][1:v] overlay=0:0" -hide_banner -loglevel panic -y`;
  const cmd = `ffmpeg -i ${src} -i ${board} ${addOptions} ${dst}`;
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`overlay video error`);
  }
}

async function getFrame(src, dst) {
  const cmd = `ffmpeg -i ${src} -y -f image2 -ss 00:00:01 -vframes 1 -hide_banner -loglevel panic -y ${dst}`;
  try {
    return await WorkerUtil.executeCmd(cmd);
  } catch (err) {
    console.log(`interceptFrame video error`);
    return Promise.reject('');
  }
}
