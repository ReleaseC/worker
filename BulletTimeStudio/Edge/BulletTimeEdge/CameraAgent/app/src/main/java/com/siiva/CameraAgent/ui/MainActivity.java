/*
 * Copyright 2014 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.siiva.CameraAgent.ui;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.FileProvider;
import android.util.Log;

import com.siiva.CameraAgent.R;
import com.siiva.CameraAgent.net.HttpService;
import com.siiva.CameraAgent.net.SocketService;

import java.io.File;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;

import com.siiva.CameraAgent.net.model.Result;
import com.siiva.CameraAgent.net.model.Version;
import android.provider.Settings.Secure;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private final String TAG = "MainActivity";
    public static String sDeviceId;
    public static boolean sServerConnected = false;
    public static int sDeviceIndex;
    Observer<Result<Version>> mVersionObserver;
    Camera2VideoFragment mFragment;
    private static SharedPreferences settings;
    private static final String SETTINGS = "SETTINGS";
    private static final String KEY_INDEX = "INDEX";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Thread.setDefaultUncaughtExceptionHandler(new MyExceptionHandler(this));
        settings = getSharedPreferences(SETTINGS, 0);
        sDeviceIndex = settings.getInt(KEY_INDEX, 0);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (null == savedInstanceState) {
            mFragment = Camera2VideoFragment.newInstance();
            getFragmentManager().beginTransaction()
                    .replace(R.id.content, mFragment)
                    .commit();

            sDeviceId = Secure.getString(getContentResolver(), Secure.ANDROID_ID);

            SocketService.getInstance().init(sDeviceId, mFragment);
            initServiceObserver();
            HttpService.getInstance().getVersion(mVersionObserver);
        }
    }

    private void initServiceObserver() {
        mVersionObserver = new Observer<Result<Version>>() {
            @Override
            public void onSubscribe(Disposable d) {}

            @Override
            public void onNext(Result<Version> result) {
                sServerConnected = true;
                Log.d(TAG, result.toString());
                mFragment.updateServer();
            }

            @Override
            public void onError(Throwable e) {
                Log.e(TAG, e.toString());
            }

            @Override
            public void onComplete() {}
        };
    }

    public String md5(String s) {
        try {
            // Create MD5 Hash
            MessageDigest digest = java.security.MessageDigest.getInstance("MD5");
            digest.update(s.getBytes());
            byte messageDigest[] = digest.digest();

            // Create Hex String
            StringBuffer hexString = new StringBuffer();
            for (int i=0; i<messageDigest.length; i++)
                hexString.append(Integer.toHexString(0xFF & messageDigest[i]));
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }

    public static void setDeviceIndex(int index) {
        sDeviceIndex = index;
        settings.edit()
                .putInt(KEY_INDEX, sDeviceIndex)
                .commit();
        SocketService.getInstance().updateRegister();
    }

    static final int REQUEST_TAKE_PHOTO = 1;
    private String mTakePhotoFile;

    public void dispatchTakePictureIntent(String path) {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        // Ensure that there's a camera activity to handle the intent
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {

            Uri photoURI = Uri.parse("file://" + path);

            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
            startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_TAKE_PHOTO && resultCode == Activity.RESULT_OK) {
            sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + mTakePhotoFile)));
        }
    }
}
