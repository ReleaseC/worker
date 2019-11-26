package com.siiva.uploader.util;

public class MyFile {
    public enum UploadState {
        NONE,
        Uploading,
        SUCCESS,
        FAIL
    }

    public String path;
    public UploadState state;
    public long total;
    public long current;
    public String etag;
}
