import subprocess 
import pandas as pd 
from numpy import genfromtxt 
import numpy as np 
import argparse 
import os 
import sys 
from glob import glob 
import ntpath 
 
def parse_args(): 
    """Parse input arguments.""" 
    parser = argparse.ArgumentParser(description='Bullet Time Effect') 
    parser.add_argument('--inputDir', dest='inputDir', help='Input directory of videos', 
                        default='') 
    parser.add_argument('--csvDir', dest='csvDir', help='Output directory of temp csv', 
                        default='') 
    parser.add_argument('--frameDir', dest='frameDir', help='Output directory of frames', 
                        default='') 
    parser.add_argument('--centerVideo', dest='centerVideo', help='',
                        default=0)
    parser.add_argument('--difference', dest='difference', help='the difference between highest frame and high volume', 
                        default=0) 
    parser.add_argument('--fps', dest='fps', help='fps', 
                        default=30)
 
    args = parser.parse_args() 
    if len(sys.argv) == 1: 
        parser.print_help() 
        sys.exit() 
 
    if not os.path.exists(args.inputDir): 
        print('data is not exist!') 
        sys.exit() 
 
    if not os.path.exists(args.csvDir): 
        os.makedirs(args.csvDir) 
        sys.exit() 
    
    return args 
 
 
args = parse_args()

if int(args.centerVideo):
    videos = glob(os.path.join(args.inputDir))
else:
    videos = glob(os.path.join(args.inputDir, '*.mp4')) 


for video in videos: 
    extract_cmd = "ffprobe -hide_banner -loglevel panic -f lavfi -i amovie='%s'," \
                  "astats=metadata=1:reset=1 -show_entries " \
                  "frame=pkt_pts_time:frame_tags=lavfi.astats.Overall.RMS_level,lavfi.astats.1.RMS_level,lavfi.astats.2.RMS_level -of csv=p=0 1> '%s'" \
                  % (video, os.path.join(args.csvDir,ntpath.basename(video)[:-4]+'.csv')) 
 
    output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read() 
 
    if not os.path.exists(os.path.join(args.frameDir, ntpath.basename(video)[:-4])): 
        os.makedirs(os.path.join(args.frameDir, ntpath.basename(video)[:-4])) 
 
    extract_cmd = "ffmpeg -hide_banner -loglevel panic -i '%s' -vf fps='%f' '%s'/" % ( 
    video, float(args.fps), os.path.join(args.frameDir, ntpath.basename(video)[:-4])) + "%3d.jpg" 
    output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read() 

csvs = glob(os.path.join(args.csvDir, '*.csv'))

targetFrame = []

for csv in csvs: 

    outs = genfromtxt(csv, delimiter=',') 
    c_frames_audio = outs.shape[0] 
    # print('-------audio = --------') 
    c_frames_video = len(os.listdir(os.path.join(args.frameDir, ntpath.basename(csv)[:-4]))) 
    # print('-------video = --------') 
    # print(str(np.max(outs[:,1]))+' dB', str(outs[np.argmax(outs[:,1]),0])+ ' seconds', 'frame-'+str(1+int(np.argmax(outs[:,1])*(c_frames_video*1.0/c_frames_audio)))) 
    
    voiceMax = 1+int(np.argmax(outs[:,1])*(c_frames_video*1.0/c_frames_audio))
    
    if int(args.centerVideo):
        targetFrame.append((int(ntpath.basename(csv)[:-4]),int(args.difference) - voiceMax))
        os.remove(csv)
    else:
        if (int(args.difference) + voiceMax > 90) | (int(args.difference) + voiceMax) < 0:
            targetFrame.append((int(ntpath.basename(csv)[:-4]),str(60)))
        else:    
            targetFrame.append((int(ntpath.basename(csv)[:-4]),str(int(args.difference) + voiceMax)))
        os.remove(csv)
            

sortTargetFrame = sorted(targetFrame, key = lambda x : x[0])

for frame in sortTargetFrame: 
    print(frame[1])

