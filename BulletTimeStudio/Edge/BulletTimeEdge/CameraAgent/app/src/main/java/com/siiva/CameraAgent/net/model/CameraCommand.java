package com.siiva.CameraAgent.net.model;

public class CameraCommand {

    public static final String CMD_RECORD_START = "recordStart";
    public static final String CMD_SHOOT_START = "shootStart";
    public static final String CMD_RECORD_STOP = "recordStop";

    public String command;
    public String recordId;
    public int duration;
}
