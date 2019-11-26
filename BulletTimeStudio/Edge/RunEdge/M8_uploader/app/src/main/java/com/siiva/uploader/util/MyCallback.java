package com.siiva.uploader.util;

import org.json.JSONObject;

public interface MyCallback {
    void onSuccess(JSONObject message);

    void onProcess(long len);

    void onFail(JSONObject message);
}