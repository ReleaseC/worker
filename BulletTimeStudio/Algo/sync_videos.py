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
    parser.add_argument('--fps', dest='fps', help='fps',
                        default=120)

    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    if not os.path.exists(args.inputDir):
        print('data is not exist!')
        sys.exit()

    return args


args = parse_args()

videos = glob(os.path.join(args.inputDir, '*.mp4'))

for video in videos:
    extract_cmd = "ffmpeg -y -i '%s' -af lowpass=15000,highpass=12000 '%s'" %(video, '/tmp/freqfilteredVideo.mp4')
    output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read()

    extract_cmd = "ffprobe -f lavfi -i amovie='%s'," \
                  "astats=metadata=1:reset=1 -show_entries " \
                  "frame=pkt_pts_time:frame_tags=lavfi.astats.Overall.RMS_level,lavfi.astats.1.RMS_level,lavfi.astats.2.RMS_level -of csv=p=0 1> '%s'" \
                  % ('/tmp/freqfilteredVideo.mp4', os.path.join(args.csvDir,ntpath.basename(video)[:-4]+'.csv'))

    output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read()

    if not os.path.exists(os.path.join(args.frameDir, ntpath.basename(video)[:-4])):
        os.makedirs(os.path.join(args.frameDir, ntpath.basename(video)[:-4]))

    extract_cmd = "ffmpeg -i '%s' -vf fps='%f' '%s'/" % (
    video, float(args.fps), os.path.join(args.frameDir, ntpath.basename(video)[:-4])) + "%6d.jpg"
    output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read()



csvs = glob(os.path.join(args.csvDir, '*.csv'))
for csv in csvs:
    print(csv)
    outs = genfromtxt(csv, delimiter=',')

    c_frames_audio = outs.shape[0]
    c_frames_video = len(os.listdir(os.path.join(args.frameDir, ntpath.basename(csv)[:-4])))
    print(str(np.max(outs[:,1]))+' dB', str(outs[np.argmax(outs[:,1]),0])+ ' seconds', 'frame-'+str(1+int(np.argmax(outs[:,1])*(c_frames_video*1.0/c_frames_audio))))
