package com.siiva.CameraAgent.net;

import android.util.Log;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.google.gson.Gson;
import com.siiva.CameraAgent.net.model.CameraCommand;
import com.siiva.CameraAgent.net.model.Register;
import com.siiva.CameraAgent.ui.MainActivity;
import java.util.Calendar;

public class SocketService {
    public interface SocketCommandListener {
        void onRecordStart(CameraCommand cmd, STOP_RECORD_ACTION action, String recordId);
        void onRecordStop(STOP_RECORD_ACTION action, String recordId);
        void onPreview();
    }

    public enum STOP_RECORD_ACTION {
        STOP_RECORD_THEN_UPLOAD,
        STOP_RECORD_THEN_PREVIEW;
    }


    private static final String TAG = "SocketService";
    public static final String SERVER = "http://192.168.1.79:3001";

    private Socket mSocket;
    private static SocketCommandListener mSocketCommandListener;

    final static String EVENT_ECHO = "echo";
    final static String EVENT_SHOOT = "start_record";
    final static String EVENT_PREVIEW = "preview";
    final static String EVENT_REGISTER = "register";
    final static String EVENT_CAMERA_COMMAND = "cameraCommand";

    private static SocketService _instance;

    public static SocketService getInstance() {
        if (_instance == null) {
            _instance = new SocketService();
        }
        return _instance;
    }

    public void updateRegister() {
        Register r = new Register();
        r.id = MainActivity.sDeviceId;
        r.deviceName = "camera_agent_1";
        r.index = MainActivity.sDeviceIndex;
        Gson gson = new Gson();
        String json = gson.toJson(r);

        mSocket.emit(EVENT_REGISTER, json);
    }

    public void init(final String deviceId, SocketCommandListener socketCommandListener) {
        mSocketCommandListener = socketCommandListener;
        try {
            Emitter.Listener onCameraCommand = new Emitter.Listener() {
                @Override
                public void call(final Object... args) {
                    Log.d(TAG, "" + args.length);
                    Gson gson = new Gson();
                    CameraCommand cmd = gson.fromJson(args[0].toString(), CameraCommand.class);
                    if (cmd.command.equals(CameraCommand.CMD_RECORD_START) || cmd.command.equals(CameraCommand.CMD_SHOOT_START)) {
                        mSocketCommandListener.onRecordStart(cmd, STOP_RECORD_ACTION.STOP_RECORD_THEN_UPLOAD, cmd.recordId);
                    } else {
                        mSocketCommandListener.onRecordStop(STOP_RECORD_ACTION.STOP_RECORD_THEN_UPLOAD, cmd.recordId);
                    }
                }
            };

            Emitter.Listener onEcho = new Emitter.Listener() {
                @Override
                public void call(final Object... args) {
                    updateRegister();
                }
            };

            Emitter.Listener onShoot = new Emitter.Listener() {
                @Override
                public void call(final Object... args) {
                    CameraCommand cmd = new CameraCommand();
                    cmd.command = EVENT_SHOOT;
                    cmd.recordId = "" + Calendar.getInstance().getTime().getTime();
                    cmd.duration = 5;
                    mSocketCommandListener.onRecordStart(cmd, STOP_RECORD_ACTION.STOP_RECORD_THEN_UPLOAD, cmd.recordId);
                }
            };

            Emitter.Listener onPreview = new Emitter.Listener() {
                @Override
                public void call(final Object... args) {
                    Log.d(TAG, "onPreview");
                    mSocketCommandListener.onPreview();
                }
            };

            Emitter.Listener onConnect = new Emitter.Listener() {
                @Override
                public void call(final Object... args) {
                    Log.d(TAG, "Socket.onConnect " + args.length);
                    if (args.length > 0) {
                        Log.d(TAG, args[0].toString());
                    }
                    Register r = new Register();
                    r.id = deviceId;
                    r.deviceName = "camera_agent_1";
                    r.index = MainActivity.sDeviceIndex;
                    Gson gson = new Gson();
                    String json = gson.toJson(r);

                    mSocket.emit(EVENT_REGISTER, json);
                }
            };

            mSocket = IO.socket(SERVER);
            mSocket.on(Socket.EVENT_CONNECT, onConnect);
            mSocket.on(EVENT_CAMERA_COMMAND, onCameraCommand);
            mSocket.on(EVENT_ECHO, onEcho);
            mSocket.on(EVENT_SHOOT, onShoot);
            mSocket.on(EVENT_PREVIEW, onPreview);

            mSocket.connect();
            Log.d(TAG, "");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void doEmit(String event, String data) {
        mSocket.emit(event, data);
    }

    public void exit() {
    }
}
