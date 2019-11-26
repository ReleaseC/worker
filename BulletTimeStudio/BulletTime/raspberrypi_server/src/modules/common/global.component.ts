var g_id: string = '';
var newsIdx: number = 0;
var newsVideo = ['/media/AI-1.mp4', '/media/AI-2.mp4', '/media/AI-3.mp4', '/media/AI-4.mp4'];
var g_socket = {};//保存socket为全局变量
var g_live_time = [];
var key = '';
var g_data;//保存视频文件的流为全局变量
var g_md5;
var g_filetoken;
var g_Bigmd5;
var g_buffer;
var g_is_start = 0;

export class Global {

    static setUserId(id: string) {
        g_id = id;
    }

    static getUserId() {
        return g_id;
    }

    static getNewsVideo() {
        let count = newsVideo.length;
        newsIdx = (newsIdx + 1) % count;
        console.log(">>> " + newsVideo[newsIdx]);
        return newsVideo[newsIdx];
    }

    //获取socket，并通过worker_id区别开
    static setSocket(worker_id, socket: object) {
        console.log(typeof (worker_id))
        key = worker_id;
        g_socket[key] = socket;
    }

    static getSocket() {
        return g_socket;
    }

    //获取存活时间，并通过worker_id区别开
    static setLive_time(worker_id, live_time: number) {
        console.log(typeof (worker_id))
        key = worker_id;
        g_live_time[key] = live_time;
    }

    static getLive_time() {
        return g_live_time;
    }

    static setData(data) {
        g_data = data;
    }

    static getData() {
        return g_data;
    }


    static setMd5(md5) {
        g_md5 = md5;
    }

    static getMd5() {
        return g_md5;
    }

    static setBigmd5(str) {
        g_Bigmd5 = str;
    }

    static getBigmd5() {
        return g_Bigmd5;
    }

    static setfiletoken(file) {
        g_filetoken = file;
    }

    static getfiletoken() {
        return g_filetoken;
    }

    static setBuffer(buffer) {
        g_buffer = buffer;
    }

    static getBuffer() {
        return g_buffer;
    }

    static setstart(is_start) {
        g_is_start += is_start;
    }

    static getstart() {
        return g_is_start;
    }

}
