package com.siiva.CameraAgent.net;

import android.util.Log;

import io.reactivex.Observable;
import io.reactivex.Observer;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.schedulers.Schedulers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

import com.siiva.CameraAgent.net.model.Result;
import com.siiva.CameraAgent.net.model.Version;
import com.siiva.CameraAgent.ui.MainActivity;

import java.io.File;

interface ApiService {
    @GET("system/version")
    Observable<Result<Version>> system_version();

    @Multipart
    @POST("upload")
    Call<ResponseBody> upload(@Part MultipartBody.Part filePart,
                              @Part("video_name") RequestBody video_name,
                              @Part("idx") RequestBody idx,
                              @Part("recordId") RequestBody recordId);

}

public class HttpService {

    private static final String TAG = "HttpService";
    private static final String API_URL = SocketService.SERVER;

    private static final HttpService sInstance = new HttpService();
    private ApiService apiService;

    public static HttpService getInstance() {
        return sInstance;
    }

    private HttpService() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(API_URL)
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        apiService = retrofit.create(ApiService.class);
    }

    public void getVersion(Observer<Result<Version>> observer) {
        Observable<Result<Version>> observable = sInstance.apiService.system_version();
        observable.subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(observer);
    }

    public void upload(String src, final String recordId, Callback<ResponseBody> callback) {
        File file = new File(src);

        MultipartBody.Part filePart = MultipartBody.Part.createFormData(
                "video_data", file.getName(),
                RequestBody.create(MediaType.parse("video/mp4"), file));

        String n = src.substring(src.lastIndexOf("/") + 1);
        RequestBody _name = RequestBody.create(MediaType.parse("multipart/form-data"), n);
        RequestBody _idx = RequestBody.create(MediaType.parse("multipart/form-data"), ""+MainActivity.sDeviceIndex);
        RequestBody _recordId = RequestBody.create(MediaType.parse("multipart/form-data"), recordId);
        Call<ResponseBody> call = apiService.upload(filePart, _name, _idx, _recordId);
        call.enqueue(callback);
    }

}

