package com.siiva.uploader;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Looper;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.os.Handler;

import com.crashlytics.android.Crashlytics;
import com.github.angads25.filepicker.controller.DialogSelectionListener;
import com.github.angads25.filepicker.model.DialogConfigs;
import com.github.angads25.filepicker.model.DialogProperties;
import com.github.angads25.filepicker.view.FilePickerDialog;
import com.siiva.uploader.util.FileSizeFormatter;
import com.siiva.uploader.util.MyCallback;
import com.siiva.uploader.util.MyFile;
import com.siiva.uploader.util.UFile;

import cn.ucloud.ufilesdk.UFileSDK;
//import cn.ucloud.ufilesdk.UFileUtils;
import cn.ucloud.ufilesdk.UFileUtils;
import cn.ucloud.ufilesdk.task.HttpAsyncTask;
import io.fabric.sdk.android.Fabric;

import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Properties;
import java.util.Date;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = MainActivity.class.getSimpleName();
    private static final String ITEM_FILE = "Item file";

    public enum GAMES {
        GAME_TEST,
        GAME_DL_HALF,
        GAME_DL_FULL
    }

    public enum DEVICES {
        DEVICE_Normal,
        DEVICE_N8,
        DEVICE_N10
    }

    Map<GAMES, String> mMapPrefixs = new HashMap<>();
    Map<DEVICES, String> mMapFolder = new HashMap<>();
    GAMES mGame = GAMES.GAME_TEST;
    DEVICES mDevice = DEVICES.DEVICE_N8;

    private boolean mIsUploading = false;
    private Button mBtnStart;
    private Button mBtnDate;
    private Spinner mSpinnerGame;
    private Spinner mSpinnerDevice;
    private ListView mListFiles;

    private TextView mTextView_dir_path;
    private String mSDCardFolder;
    private String mChooseFolder;
    private FileListAdapter mFileListAdapter;

    private boolean mIsStart = false;
    private Date mDate;
    String mVersion;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        setContentView(R.layout.activity_main);

        mSDCardFolder = Environment.getExternalStorageDirectory().getAbsolutePath();
        mChooseFolder = mSDCardFolder + "/BackgroundVideoRecorder";
//        mChooseFolder = mSDCardFolder + "/DCIM/Camera";

        mMapPrefixs.put(GAMES.GAME_TEST, "test_");
        mMapPrefixs.put(GAMES.GAME_DL_HALF, "0010_dl_half_");
        mMapPrefixs.put(GAMES.GAME_DL_FULL, "0010_dl_full_");

        mMapFolder.put(DEVICES.DEVICE_Normal, mChooseFolder);
        mMapFolder.put(DEVICES.DEVICE_N8, "/mnt/external_sd/N8Play/video");
        mMapFolder.put(DEVICES.DEVICE_N10, "/mnt/external_sd/TCPlay/video");

        loadHistory();
        readSetting();

        try {
            PackageInfo pInfo = this.getPackageManager().getPackageInfo(getPackageName(), 0);
            mVersion = pInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        initUI();
        updateUI();
    }

    private void initUI() {
        mBtnStart = (Button) findViewById(R.id.btn_start);
        mBtnDate = (Button) findViewById(R.id.btn_date);
        mSpinnerGame = (Spinner) findViewById(R.id.spinner_game);
        mSpinnerDevice = (Spinner) findViewById(R.id.spinner_device);
        mTextView_dir_path = (TextView) findViewById(R.id.txt_scanfolder);
        mListFiles = (ListView) findViewById(R.id.list_files);

        mBtnStart.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (!mIsStart) {
                    MainActivity.this.startScanFiles();
                } else {
                    MainActivity.this.stopScanFiles();
                }
            }
        });

        mBtnDate.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(mDate);
                int dd = cal.get(Calendar.DAY_OF_MONTH);
                int mm = cal.get(Calendar.MONTH);
                int yy = cal.get(Calendar.YEAR);
                new DatePickerDialog(MainActivity.this, new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year, int month, int day) {
                        Calendar cal = Calendar.getInstance();
                        cal.set(Calendar.YEAR, year);
                        cal.set(Calendar.MONTH, month);
                        cal.set(Calendar.DAY_OF_MONTH, day);
                        mDate = cal.getTime();
                        MainActivity.this.updateUI();
                    }
                }, yy, mm, dd).show();
            }
        });

        mSpinnerGame.setOnItemSelectedListener(new Spinner.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                mGame = GAMES.values()[position];
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
            }
        });

        mSpinnerDevice.setOnItemSelectedListener(new Spinner.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                mDevice = DEVICES.values()[position];
                mChooseFolder = mMapFolder.get(mDevice);
                updateUI();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
            }
        });
    }

    private void updateUI() {

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                SimpleDateFormat sdt = new SimpleDateFormat("yyyy-MM-dd");
                mTextView_dir_path.setText(mChooseFolder);
                mBtnStart.setText((mIsStart ? "Stop" : "Start"));
                mBtnDate.setText(sdt.format(mDate));
                mListFiles.invalidateViews();
                setTitle("SIIVA Uploader v." + mVersion);
            }
        });
    }

    private MyFile getNextUpload() {

        for (MyFile mf : mFilesToBeUpload) {
            if (mf.state != MyFile.UploadState.SUCCESS && mf.state != MyFile.UploadState.Uploading) {
                return mf;
            }
        }
        return null;
    }

    private void doUploadStart() {
        updateUI();

        MyFile mf = getNextUpload();
        if (mf != null) {
            doUpload(mf, getKeyName2(mf));
        }
    }

    private void doUploadStop() {
    }

    String getKeyName(String name) {
        String prefix = mMapPrefixs.get(mGame);
        String key_name = prefix + name;

        return key_name;
    }

    String getKeyName2(MyFile mf) {
        File file = new File(mf.path);
        String prefix = mMapPrefixs.get(mGame);
        String key_name = prefix + file.getName();

        return key_name;
    }

    void uploadDone(MyFile mf) {
        mFileListAdapter.notifyDataSetChanged();
        updateUI();
        mIsUploading = false;
        if (mIsStart) {
            doUploadStart();
        }
    }

    public void ChooseScanFolder(View view) {
        try {
            DialogProperties properties = new DialogProperties();
            properties.selection_mode = DialogConfigs.SINGLE_MODE;
            properties.selection_type = DialogConfigs.DIR_SELECT;
            properties.root = new File(Environment.getExternalStorageDirectory().getAbsolutePath());
            FilePickerDialog dialog = new FilePickerDialog(MainActivity.this, properties);
            dialog.setTitle("Select folder");
            dialog.setDialogSelectionListener(new DialogSelectionListener() {
                @Override
                public void onSelectedFilePaths(String[] files) {
                    mChooseFolder = files[0];
                    updateUI();
                }
            });
            dialog.show();
        } catch (android.content.ActivityNotFoundException ex) {
        }
    }

    private ArrayList<MyFile> mFilesToBeUpload = new ArrayList<MyFile>();

    public static String sExt = "mp4";

    public static final String ACTION_MEDIA_SCANNER_SCAN_DIR = "android.intent.action.MEDIA_SCANNER_SCAN_DIR";

    public void scanSDAsync(Context ctx, String dir) {
        Intent scanIntent = new Intent(ACTION_MEDIA_SCANNER_SCAN_DIR);
        scanIntent.setData(Uri.fromFile(new File(dir)));
        ctx.sendBroadcast(scanIntent);
    }

    private void stopScanFiles() {
        mIsStart = false;
        mTimerScan.cancel();
        updateUI();
    }

    private Timer mTimerScan;
    private int PERIOD_SCAN = 10 * 60 * 1000;
    private int PERIOD_SCAN_DELAY = 1 * 1000;

    private void startScanFiles() {
        mIsStart = true;

        mTimerScan = new Timer();
        mTimerScan.schedule(new TimerTask() {
            public void run() {

//                scanFiles();

                // Force MediaStore to scan SD for new added files
                scanSDAsync(MainActivity.this, mChooseFolder);

                // Scan files after MediaStore scan
                Handler handler = new Handler(Looper.getMainLooper());
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        Thread t = new Thread(new Runnable() {
                            @Override
                            public void run() {
                                scanFiles();
                                if (mIsStart && !mIsUploading) {
                                    doUploadStart();
                                }
                            }
                        });
                        t.start();
                    }
                }, PERIOD_SCAN_DELAY);
            }
        }, 0, PERIOD_SCAN);
        updateUI();
    }

    private boolean isNewFile(String newFile) {
        for (MyFile ff : mFilesToBeUpload) {
            if (ff.path.equals(newFile))
                return false;
        }
        return true;
    }

    private void scanFiles() {
        boolean isDirty = false;
        ArrayList newFiles = new ArrayList();

        scanFilesInFolder(mChooseFolder, sExt, newFiles);
        for (Object f : newFiles) {
            File ff = new File(f.toString());
            if (isNewFile(f.toString()) && ff.length() > 0) {
                MyFile mf = new MyFile();
                mf.path = f.toString();

                Log.d(TAG, "Find " + ff.getName() + " checking etag");
                String etag = UFileUtils.calcSha1(ff);
                String etag2 = mHistory.get(f);
                if (etag.equals(etag2)) {
                    mf.state = MyFile.UploadState.SUCCESS;
                } else {
                    mf.state = MyFile.UploadState.NONE;
                }

                mf.total = ff.length();
                mf.current = 0;
                mf.etag = etag;

                mFilesToBeUpload.add(mf);
                isDirty = true;
                prepareAdapter();
                if (mIsStart && !mIsUploading) {
                    doUploadStart();
                }
            }
        }
        if (isDirty) {
            updateVideoCSV();
        }
    }

    void prepareAdapter() {
        final List<Map<String, MyFile>> itemList = new ArrayList<Map<String, MyFile>>();
        for (MyFile f : mFilesToBeUpload) {
            Map<String, MyFile> item = new HashMap<String, MyFile>();
            item.put(ITEM_FILE, f);
            itemList.add(item);
        }
        mFileListAdapter = new FileListAdapter(this, itemList);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mListFiles.setAdapter(mFileListAdapter);
            }
        });
    }

    void updateVideoCSV() {
        String content = "camera,video,record_start,record_end,TR_Mode\n";
        for (MyFile mf : mFilesToBeUpload) {
            File file = new File(mf.path.toString());
            String key = getKeyName(file.getName());

            Date dtEnd = new Date(file.lastModified());

            MediaMetadataRetriever retriever = new MediaMetadataRetriever();
            retriever.setDataSource(this, Uri.fromFile(file));
            String time = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
            retriever.release();
            long timeInMillisec = Long.parseLong(time);
            long lStart = dtEnd.getTime() - timeInMillisec;

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String sStart = sdf.format(new Date(lStart));
            String sEnd = sdf.format(dtEnd);

            String row = "camera1," + key + "," + sStart + "," + sEnd + ",end\n";
            content += row;
        }
        try {
            String key = mMapPrefixs.get(mGame) + "video.csv";
            File file = new File(this.getFilesDir(), "video.csv");
            FileWriter writer = new FileWriter(file);
            writer.append(content);
            writer.flush();
            writer.close();
            UFile.uploadText(key, file);
        } catch (IOException e) {
            Log.e(TAG, e.toString());
        }
    }

    private long getTimeOfStartOfToday() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        return cal.getTimeInMillis();
    }

    private boolean isFileCreateToday(File f) {
        long last = f.lastModified();
        long now = System.currentTimeMillis();
//        long startOfToday = getTimeOfStartOfToday();
        Calendar cal = Calendar.getInstance();
        cal.setTime(mDate);
        long startOfToday = cal.getTimeInMillis();

        return (now - last > 1 * 60 * 1000 && last > startOfToday);
    }

    private void scanFilesInFolder(String folder, String ext, ArrayList container) {

        File folder_file = new File(folder);
        File[] files = folder_file.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    Log.d(TAG, "Scan " + file.getName() + " checking if in upload list");

                    String path = file.getAbsolutePath();
                    String extension = path
                            .substring(path.lastIndexOf(".") + 1);
                    // if the file is audio type, then save it to the database
                    if (!extension.equalsIgnoreCase(ext))
                        continue;

                    // Check if create today
                    if (!isFileCreateToday(file))
                        continue;

                    // Check if recording
                    container.add(path);
                } else {
                    scanFilesInFolder(file.getAbsolutePath(), ext, container);
                }
            }
        }
    }

    class FileListAdapter extends BaseAdapter {
        private LayoutInflater mLayInf;
        List<Map<String, MyFile>> mItemList;

        public FileListAdapter(Context context, List<Map<String, MyFile>> itemList) {
            mLayInf = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            mItemList = itemList;
        }

        @Override
        public int getCount() {
            return mItemList.size();
        }

        @Override
        public Object getItem(int position) {
            return position;
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            Log.d(TAG, "getView: " + position);
            View v;
            if (convertView == null) {
                v = mLayInf.inflate(R.layout.list_view_file_item, parent, false);
            } else {
                v = convertView;
            }

            TextView fileView = (TextView) v.findViewById(R.id.txtView);
            TextView percentView = (TextView) v.findViewById(R.id.txtView_percent);

            MyFile mf = (MyFile) (mItemList.get(position).get(ITEM_FILE));
            String f = mf.path.substring(mf.path.lastIndexOf("/") + 1);

            fileView.setText(f);
            float percent = (float) ((float) mf.current / (float) mf.total) * 100;

            String part1;
            if (mf.state == MyFile.UploadState.SUCCESS) {
                part1 = "Done";
            } else if (mf.state == MyFile.UploadState.FAIL) {
                part1 = "Fail";
            } else {
                part1 = String.format("%.0f%% ", percent) + " " + (int) (mf.current / 1024) + "K" + "/";
            }
            percentView.setText(part1 + " " + FileSizeFormatter.formatFileSize(mf.total));

            return v;
        }
    }

    long mLastTimeNotify = 0;

    void doUpload(final MyFile mf, final String key) {
        mIsUploading = true;

        UFile.uploadVideo(mf, key, new MyCallback() {
            public void onSuccess(JSONObject message) {
                Log.i(TAG, "onSuccess " + message);

                try {
                    mHistory.put(mf.path, mf.etag);
                    saveHistory();
                } catch (Exception e) {
                    Log.e(TAG, e.toString());
                }

                mf.state = MyFile.UploadState.SUCCESS;
                MainActivity.this.uploadDone(mf);
            }

            public void onProcess(long len) {
                mf.current = len;
//                long now = System.currentTimeMillis();
//                if (now - mLastTimeNotify > 1000) {
//                    mLastTimeNotify = now;
//                    Log.i(TAG, key + " onProcess " + len);
//                }
                MainActivity.this.mFileListAdapter.notifyDataSetChanged();
            }

            public void onFail(JSONObject message) {
                Log.i(TAG, "onFail " + message);
                mf.state = MyFile.UploadState.FAIL;
                MainActivity.this.uploadDone(mf);
            }
        });
    }

    Map<String, String> mHistory = new HashMap<String, String>();
    String historyProperty = "history.properties";

    void loadHistory() {
        try {
            mHistory.clear();
            Properties properties = new Properties();
            properties.load(openFileInput(historyProperty));

            for (String key : properties.stringPropertyNames()) {
                mHistory.put(key, properties.get(key).toString());
            }
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
    }

    void saveHistory() {
        try {
            Properties properties = new Properties();

            for (Map.Entry<String, String> entry : mHistory.entrySet()) {
                properties.put(entry.getKey(), entry.getValue());
            }
            properties.store(openFileOutput(historyProperty, Context.MODE_PRIVATE), null);
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
    }

    private SharedPreferences settings;
    private static final String data = "DATA";
    private static final String dateField = "DATE";

    SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public void readSetting() {
        settings = getSharedPreferences(data, 0);
        String date = settings.getString(dateField, "");
        try {
            mDate = DATE_FORMAT.parse(date);
        } catch (Exception e) {
            e.printStackTrace();

            mDate = new Date(getTimeOfStartOfToday());
            saveSetting();
        }
    }

    public void saveSetting() {
        settings = getSharedPreferences(data, 0);

        settings.edit()
                .putString(dateField, DATE_FORMAT.format(mDate))
                .commit();
    }

}
