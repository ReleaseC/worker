package com.siiva.CameraAgent.net.model;

public class Result<T> {
    public final int status;
    public final T result;

    public Result(int status, T result) {
        this.status = status;
        this.result = result;
    }
}
