"use strict";
exports.__esModule = true;
var g_id = '';
var newsIdx = 0;
var newsVideo = ['/media/AI-1.mp4', '/media/AI-2.mp4', '/media/AI-3.mp4', '/media/AI-4.mp4'];
var g_socket = {}; //保存socket为全局变量
var g_live_time = [];
var key = '';
var g_data; //保存视频文件的流为全局变量
var g_md5;
var g_filetoken;
var g_Bigmd5;
var g_buffer;
var g_is_start = 0;
var Global = /** @class */ (function () {
    function Global() {
    }
    Global.setUserId = function (id) {
        g_id = id;
    };
    Global.getUserId = function () {
        return g_id;
    };
    Global.getNewsVideo = function () {
        var count = newsVideo.length;
        newsIdx = (newsIdx + 1) % count;
        console.log(">>> " + newsVideo[newsIdx]);
        return newsVideo[newsIdx];
    };
    //获取socket，并通过worker_id区别开
    Global.setSocket = function (worker_id, socket) {
        console.log(typeof (worker_id));
        key = worker_id;
        g_socket[key] = socket;
    };
    Global.getSocket = function () {
        return g_socket;
    };
    //获取存活时间，并通过worker_id区别开
    Global.setLive_time = function (worker_id, live_time) {
        console.log(typeof (worker_id));
        key = worker_id;
        g_live_time[key] = live_time;
    };
    Global.getLive_time = function () {
        return g_live_time;
    };
    Global.setData = function (data) {
        g_data = data;
    };
    Global.getData = function () {
        return g_data;
    };
    Global.setMd5 = function (md5) {
        g_md5 = md5;
    };
    Global.getMd5 = function () {
        return g_md5;
    };
    Global.setBigmd5 = function (str) {
        g_Bigmd5 = str;
    };
    Global.getBigmd5 = function () {
        return g_Bigmd5;
    };
    Global.setfiletoken = function (file) {
        g_filetoken = file;
    };
    Global.getfiletoken = function () {
        return g_filetoken;
    };
    Global.setBuffer = function (buffer) {
        g_buffer = buffer;
    };
    Global.getBuffer = function () {
        return g_buffer;
    };
    Global.setstart = function (is_start) {
        g_is_start += is_start;
    };
    Global.getstart = function () {
        return g_is_start;
    };
    return Global;
}());
exports.Global = Global;
