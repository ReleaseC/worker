import {HttpClientBuckets, HttpClientCallback} from "./httpclient.interface";

const HttpClientConfig = require('./config.json');
const OSS = require('ali-oss');



/**
 * HttpClient is designed for using oss service of Aliyun
 * this is based on ES6
 */
class HttpClient {
    /**
     *
     * static property area START
     *
     */
    private static INSTANCE: HttpClient = null;

    /**
     * static property area END
     */


    /**
     *
     * non-static property area START
     */
    private client;

    private bucket: HttpClientBuckets;

    /**
     * non-static property area END
     */

    private constructor() {
        this.client = new OSS(HttpClientConfig);
    }

    /**
     *
     * static function define area START
     *
     */
    public static getInstance() {
        return HttpClient.INSTANCE || (HttpClient.INSTANCE = new HttpClient());
    }

    /**
     * non-static function define area END
     */


    /**
     * non-static function define area START
     */


    /**
     * 设定使用哪个桶，只需要设定一次即可
     * @param {HttpClientBuckets} bucket 从HttpClientBuckets中枚举
     */
    private useBucket(bucket: HttpClientBuckets) {
        // 当桶发生切换时更新设定
        this.bucket != bucket && (this.bucket = bucket) && this.client.useBucket(bucket);
    }


    /**
     * 查看文件列表
     * @param {HttpClientCallback} callback
     */
    public list(callback: HttpClientCallback, bucket?: HttpClientBuckets) {
        this.useBucket(bucket || HttpClientBuckets.PRIVATE_BUCKET); //  默认列出私有桶文件列表
        this.client.list()
            .then(callback.onSuccess)
            .catch(callback.onError);
    }


    /**
     * 存放文件
     * @param {string} originFileName
     * @param {string} localFileName
     * @param {HttpClientCallback} callback
     * @param {HttpClientBuckets} bucket 桶
     */
    public put(originFileName: string, localFileName: string, callback: HttpClientCallback,
               bucket?: HttpClientBuckets) {
        this.useBucket(bucket || HttpClientBuckets.PUBLIC_BUCKET);  //  默认上传到公共桶
        this.client.put(originFileName, localFileName)
            .then(callback.onSuccess)
            .catch(callback.onError);
    }

    /**
     * 断点上传文件
     * @param {string} originFileName 用于存放远端的文件名
     * @param {string} localFileName 本地的文件路径 + 文件名
     * @param {number} times 上传失败是重试次数
     * @param {HttpClientCallback} callback 回调
     * @param {HttpClientBuckets} bucket 桶
     */
    public breakPointUpload(originFileName: string, localFileName: string, callback: HttpClientCallback,
        times?: number, bucket?: HttpClientBuckets) {

        this.useBucket(bucket || HttpClientBuckets.PUBLIC_BUCKET);   //  设定上传默认使用公共桶
        times = (times != undefined ? times : 5); //  默认重试五次
        let checkpoint; // 记录断点

        this.client.multipartUpload(
            originFileName,
            localFileName,
            {
                checkpoint,
                async progress(percentage, cpt) {
                    checkpoint = cpt;
                    callback.onProgress && callback.onProgress(percentage);
                }
            }
        ).then(callback.onSuccess).catch( err => {
            if (times-- > 0) {
                console.log(`上传失败，正在重试第${5-times}次: ${localFileName}`);
                this.breakPointUpload(originFileName, localFileName, callback, times);
            } else {
                callback.onError(err);
            }
        });
    }

    /**
     * 获取文件
     * @param {string} originFileName
     * @param {string} localFileName
     * @param {HttpClientCallback} callback
     * @param {number} [times=5] 重试次数
     * @param {HttpClientBuckets} [bucket=HttpClientBucket.PRIVATE_BUCKET] 使用桶
     */
    public get(originFileName: string, localFileName: string, callback: HttpClientCallback,
               times?: number, bucket?: HttpClientBuckets) {
        this.useBucket(bucket || HttpClientBuckets.PRIVATE_BUCKET); //  获取默认使用私有桶
        times = times == undefined ? 5 : times;

        this.client.get(originFileName, localFileName)
            .then(callback.onSuccess)
            .catch(err => {
                if (times-- > 0) {
                    console.log(`下载失败，正在重试第${5 - times}次: ${originFileName}`);
                    this.get(originFileName, localFileName, callback, times);
                } else {
                    callback.onError(err);
                }
            });
    }

    /**
     * 删除文件
     * @param {string} originFileName
     * @param {HttpClientCallback} callback
     */
    public delete(originFileName: string, callback: HttpClientCallback,
                  bucket?: HttpClientBuckets) {
        this.useBucket(bucket || HttpClientBuckets.PUBLIC_BUCKET);  //  默认删除公共桶
        this.client.delete(originFileName)
            .then(callback.onSuccess)
            .catch(callback.onError);
    }

    /**
     * non-static function define area END
     */

}

export default HttpClient.getInstance();
