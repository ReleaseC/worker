import os
import argparse
import cv2
import sys
from h264_decoder_module.h264module import *
from PIL import Image
import numpy as np
import json
import time

def parse_args():
    """Parse input arguments."""
    parser = argparse.ArgumentParser(description='Bullet Time Effect')
    parser.add_argument('--input_video', dest='input_video', help='input_video',
                        default='')
    parser.add_argument('--min_area', dest='min_area', help='min area size',
                        default=500)
    parser.add_argument('--output_dir', dest='output_dir', help='output dir',
                        default='')
    parser.add_argument('--skip', dest='skip', help='skip frame',
                        default=1)
    parser.add_argument('--hVideo', dest='hVideo', help='Height of the video',
                        default=720)
    parser.add_argument('--wVideo', dest='wVideo', help='Width of the video',
                        default=1280)
    parser.add_argument('--scale', dest='scale', help='scale image resolution to process',
                        default=1)

    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    if not os.path.isfile(args.input_video):
        print("The Input video is not exist!")
        sys.exit()

    return args


args = parse_args()

decoder = init_h264dec(args.input_video)
DEFAULT_H = int(args.hVideo)  # 1080
DEFAULT_W = int(args.wVideo)  # 1920
DEFAULT_C = 3

n = 0

firstFrame = None

xhighest = 100000
framehighestjump = -1

anno = {}
highest_bb = []
st = time.time()
for num in range(0, 20000):

    frame = get_frame(decoder, width=DEFAULT_W, height=DEFAULT_H, channels=DEFAULT_C)
    if (frame.shape[0]) != DEFAULT_H:
        break
    frame = Image.fromarray(frame, mode='RGB')

    if int(args.skip) != n:
        n += 1
        continue
    n = 0
    frame_ori = np.array(frame)
    h, w = frame_ori.shape[0:2]

    frame = cv2.resize(frame_ori, (int(h*float(args.scale)), int(w*float(args.scale))))
    gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
    gray = cv2.GaussianBlur(gray, (21, 21), 0)

    if firstFrame is None:
        firstFrame = gray
        continue

    frameDelta = cv2.absdiff(firstFrame, gray)
    thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]

    thresh = cv2.dilate(thresh, None, iterations=2)
    (_, cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
        if cv2.contourArea(c) < int(args.min_area):
            continue

        (x, y, w, h) = cv2.boundingRect(c)
        if y < xhighest:
            xhighest = y
            framehighestjump = num
            highest_bb = [x, y, w, h]

        if not os.path.exists(args.output_dir):
            os.makedirs(args.output_dir)

        cv2.imwrite(os.path.join(args.output_dir, str(num) + '.jpg'), frame_ori[:,:,::-1])

et = time.time() - st
print(et*1000)
anno['person_rect'] = highest_bb
anno['highest_frame'] = int(framehighestjump)
print(framehighestjump)

with open(os.path.join(args.output_dir, 'highest_frame.json'), 'w') as fp:
    json.dump(anno.copy(), fp)
