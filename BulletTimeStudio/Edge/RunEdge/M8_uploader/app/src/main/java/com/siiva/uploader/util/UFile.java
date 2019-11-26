package com.siiva.uploader.util;

import android.util.Log;
import android.os.Handler;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import cn.ucloud.ufilesdk.Callback;
import cn.ucloud.ufilesdk.UFilePart;
import cn.ucloud.ufilesdk.UFileRequest;
import cn.ucloud.ufilesdk.UFileUtils;
import cn.ucloud.ufilesdk.task.HttpAsyncTask;

import cn.ucloud.ufilesdk.UFileSDK;

public class UFile {

    private static final String TAG = UFile.class.getSimpleName();
    private static final String bucket = "eee";
    private static final String proxySuffix = ".cn-sh2.ufileos.com";
    private static final String authServer = "http://bt-dev-1.siiva.com";

    static UFileSDK uFileSDK = new UFileSDK(bucket, proxySuffix, authServer);

    // PutFile, fails often when file size > 100M
    public static void uploadVideo2(MyFile mf, String key, final MyCallback cb) {
        mf.state = MyFile.UploadState.Uploading;
        File file = new File(mf.path);
        String http_method = "PUT";
        String content_md5 = UFileUtils.getFileMD5(file);
        String content_type = "video/mp4";
        final UFileRequest request = new UFileRequest();
        request.setHttpMethod(http_method);
        request.setContentMD5(content_md5);
        request.setContentType(content_type);
        request.setKeyName(key);
        request.setDate("");

        final HttpAsyncTask httpAsyncTask = uFileSDK.putFile(request, file, key, new Callback() {
            @Override
            public void onSuccess(JSONObject response) {
                cb.onSuccess(response);
            }

            @Override
            public void onProcess(long len) {
                cb.onProcess(len);
            }

            @Override
            public void onFail(JSONObject response) {
                cb.onFail(response);
            }
        });
    }

    // Multi-part
    public static void uploadVideo(MyFile mf, String key, final MyCallback cb) {
        mf.state = MyFile.UploadState.Uploading;
        File file = new File(mf.path);

        UtilMultiPart partUtil = new UtilMultiPart(key, file, cb);
        partUtil.startUpload();
    }

    public static void uploadText(final String key_name, File file) {
        String http_method = "PUT";
        String content_md5 = UFileUtils.getFileMD5(file);
        String content_type = "text/plain";

        final UFileRequest request = new UFileRequest();
        request.setHttpMethod(http_method);
        request.setContentMD5(content_md5);
        request.setContentType(content_type);
        request.setKeyName(key_name);

        final HttpAsyncTask httpAsyncTask = uFileSDK.putFile(request, file, key_name, new Callback() {
            @Override
            public void onSuccess(JSONObject response) {
                Log.i(TAG, "onSuccess " + response);
            }

            @Override
            public void onProcess(long len) {
                Log.i(TAG, key_name + " onProcess " + len);
            }

            @Override
            public void onFail(JSONObject response) {
                Log.i(TAG, "onFail " + response);
            }
        });
    }

    static class UtilMultiPart {
        private UFilePart uFilePart = null;

        String mKey;
        File mFile;
        MyCallback mCallback;

        UtilMultiPart(String key, File file, MyCallback cb) {
            mKey = key;
            mFile = file;
            mCallback = cb;
        }

        public void startUpload() {
            initiateMultipartUpload();
        }

        public void initiateMultipartUpload() {
            String http_method = "POST";

            UFileRequest request = new UFileRequest();
            request.setHttpMethod(http_method);
            request.setKeyName(mKey);

            HttpAsyncTask httpAsyncTask = uFileSDK.initiateMultipartUpload(request, mKey, new Callback() {
                @Override
                public void onSuccess(JSONObject response) {
                    Log.i(TAG, "onSuccess " + response);
                    uFilePart = new UFilePart();
                    try {
                        JSONObject message = response.getJSONObject("message");
                        uFilePart.setUploadId(message.getString("UploadId"));
                        uFilePart.setBlkSize(Long.valueOf(message.getString("BlkSize")));
                        uFilePart.setBucket(message.getString("Bucket"));
                        uFilePart.setKey(message.getString("Key"));
                        uFilePart.setEtags();
                        Log.e(TAG, uFilePart.toString());
                        uploadPart();
                    } catch (JSONException e) {
                        e.printStackTrace();
                        try {
                            JSONObject o = new JSONObject();
                            o.put("Error", e.toString());
//                            mCallback.onFail(o);
                        }
                        catch (Exception e1) {
                            Log.e(TAG, e1.toString());
                        }
                    }
                }

                @Override
                public void onProcess(long len) {
                }

                @Override
                public void onFail(JSONObject response) {
                    Log.i(TAG, "onFail " + response);
                }
            });
        }

        private int count = 0;

        public void uploadPart() {
            if (uFilePart == null) {
                return;
            }
            final String http_method = "PUT";
            String content_type = "video/mp4";

            long blk_size = uFilePart.getBlkSize();
            long file_len = mFile.length();

            final int part = (int) Math.ceil(file_len / blk_size);

            final List<HttpAsyncTask> list = new ArrayList<>();

            for (int i = 0; i <= part; i++) {
                UFileRequest request = new UFileRequest();
                request.setHttpMethod(http_method);
                request.setContentType(content_type);
                request.setKeyName(mKey);

                HttpAsyncTask httpAsyncTask = uFileSDK.uploadPart(request, mKey, uFilePart.getUploadId(), mFile, i, uFilePart.getBlkSize(), new Callback() {
                    @Override
                    public void onSuccess(JSONObject response) {
                        Log.i(TAG, "onSuccess " + response);
                        try {
                            String etag = response.getString("ETag");
                            int partNumber = response.getJSONObject("message").getInt("PartNumber");
                            uFilePart.addEtag(partNumber, etag);
                            if (count < part) {
                                count++;
                                mCallback.onProcess(count * uFilePart.getBlkSize());
                            } else {
                                mCallback.onProcess(mFile.length());
                                count = 0;
                                finishMultipartUpload();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onProcess(long len) {
                    }

                    @Override
                    public void onFail(JSONObject response) {
                        Log.i(TAG, "onFail " + response);
                    }
                });
                list.add(httpAsyncTask);
            }
        }

        public void uploadPartRetry() {
            if (uFilePart == null) {
                return;
            }
            final String http_method = "PUT";
            String content_type = "video/mp4";

            long blk_size = uFilePart.getBlkSize();
            long file_len = mFile.length();

            final int part = (int) Math.ceil(file_len / blk_size);

            final List<UFileSDK.UploadPartManager> list = new ArrayList<>();

            for (int i = 0; i <= part; i++) {
                UFileRequest request = new UFileRequest();
                request.setHttpMethod(http_method);
                request.setContentType(content_type);
                request.setKeyName(mKey);

                UFileSDK.UploadPartManager uploadPartManager = uFileSDK.uploadPart(request, mKey, uFilePart.getUploadId(), mFile, i, uFilePart.getBlkSize(), new Callback() {
                    @Override
                    public void onSuccess(JSONObject response) {
                        Log.i(TAG, "onSuccess " + response);
                        try {
                            String etag = response.getString("ETag");
                            int partNumber = response.getJSONObject("message").getInt("PartNumber");
                            uFilePart.addEtag(partNumber, etag);
                            if (count < part) {
                                count++;
                                mCallback.onProcess(count * uFilePart.getBlkSize());
                            } else {
                                mCallback.onProcess(mFile.length());
                                count = 0;
                                finishMultipartUpload();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onProcess(long len) {
                    }

                    @Override
                    public void onFail(JSONObject response) {
                        Log.i(TAG, "onFail " + response);
                    }
                }, 3, 1000, new Handler());
                list.add(uploadPartManager);
            }
        }

        public void finishMultipartUpload() {
            if (uFilePart == null) {
                return;
            }
            String http_method = "POST";
            String content_type = "text/plain";
            String etags = uFilePart.getEtags();

            String callbackUrl = "http://api.ucloud.cn";
            String callbackBody = "";
            String callbackMethod = "GET";

            UFileRequest request = new UFileRequest();
            request.setHttpMethod(http_method);
            request.setContentType(content_type);
            request.setKeyName(mKey);
            request.setCallbackUrl(callbackUrl);
            request.setCallbackBody(callbackBody);
            request.setCallbackMethod(callbackMethod);

            HttpAsyncTask httpAsyncTask = uFileSDK.finishMultipartUpload(request, mKey, uFilePart.getUploadId(), etags, "new_" + mKey, new Callback() {
                @Override
                public void onSuccess(JSONObject response) {
                    Log.i(TAG, "onSuccess " + response);
                    mCallback.onSuccess(response);
                }

                @Override
                public void onProcess(long len) {
                }

                @Override
                public void onFail(JSONObject response) {
                    Log.i(TAG, "onFail " + response);
                    mCallback.onFail(response);
                }
            });

            uFilePart = null;
        }

        public void abortMultipartUpload() {
            if (uFilePart == null) {
                return;
            }
            String http_method = "DELETE";

            UFileRequest request = new UFileRequest();
            request.setHttpMethod(http_method);
            request.setKeyName(mKey);

            HttpAsyncTask httpAsyncTask = uFileSDK.abortMultipartUpload(request, mKey, uFilePart.getUploadId(), getDefaultCallback());

            uFilePart = null;
        }

        private Callback getDefaultCallback() {
            Callback callback = new Callback() {
                @Override
                public void onSuccess(JSONObject response) {
                    Log.i(TAG, "onSuccess " + response);
                }

                @Override
                public void onProcess(long len) {
                }

                @Override
                public void onFail(JSONObject response) {
                    Log.i(TAG, "onFail " + response);
                }
            };

            return callback;
        }
    }

}
