mkdir tmp
ffmpeg -fflags +genpts -i rtsp://192.168.50.168/0 -map 0 -c copy -f segment -segment_format mp4 -segment_time 10 -segment_list tmp/video.ffcat -reset_timestamps 1 -v info tmp/chunk-%03d.seg
