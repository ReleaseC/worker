# -*- coding: utf-8 -*-
import sys

reload(sys)
sys.setdefaultencoding('utf8')
import os
import os.path as osp
import argparse
import cv2
import numpy as np
import json

from h264_decoder_module.h264module import *
from PIL import Image

this_dir = osp.dirname(__file__)

sys.path.append('/home/aoitek-dl/SHARE/TITIP/IntelligentVideoAnalytics/IVALIB')
os.environ['TENSORFLOW_MODE'] = '1'
os.environ['PERSON_MODULE'] = '1'

from detector import person_faster_rcnn_tf


def parse_args():
    """Parse input arguments."""
    parser = argparse.ArgumentParser(description='Bullet Time Effect')
    parser.add_argument('--gpu_id', dest='gpu_id', help='GPU id', default='0')
    parser.add_argument('--dir_model', dest='dir_model', help='Directory of the models',
                        default='')
    parser.add_argument('--input_video', dest='input_video', help='input_video',
                        default='')
    parser.add_argument('--output_dir', dest='output_dir', help='output_dir',
                        default='')
    parser.add_argument('--skip', dest='skip', help='skip frame',
                        default=1)
    parser.add_argument('--hVideo', dest='hVideo', help='Height of the video',
                        default=720)
    parser.add_argument('--wVideo', dest='wVideo', help='Width of the video',
                        default=1280)

    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    if not os.path.isfile(args.input_video):
        print("The Input video is not exist!")
        sys.exit()

    if not os.path.exists(args.dir_model):
        print("models are not exist!!")
        sys.exit()

    return args


args = parse_args()
model_person = person_faster_rcnn_tf(args.dir_model, 'mobilenet', args.gpu_id)

# vid = imageio.get_reader(args.input_video, 'ffmpeg')
n = 0
# frame = vid.get_data(0)

decoder = init_h264dec(args.input_video)
DEFAULT_H = int(args.hVideo)  # 1080
DEFAULT_W = int(args.wVideo)  # 1920
DEFAULT_C = 3

xhighest = 100000
framehighestjump = -1

anno = {}
highest_bb = []
for num in range(0, 20000):
    frame = get_frame(decoder, width=DEFAULT_W, height=DEFAULT_H, channels=DEFAULT_C)
    # print "get frame:", elapsed_time
    if (frame.shape[0]) != DEFAULT_H:
        break
    frame = Image.fromarray(frame, mode='RGB')

    if int(args.skip) != n:
        n += 1
        continue
    n = 0
    frame = np.array(frame)
    h, w = frame.shape[0:2]

    inds, dets = model_person.process(frame)#frame[:, :, ::-1])

    for ii in inds:
        bbox_person = dets[ii, :4]

        # print(bbox_person)
        # if bbox_person[1] < (h / 5) and bbox_person[0] > w / 4 and bbox_person[2] < (w / 2 + w / 4) and bbox_person[
        #     0] < (w / 2 - 10):
            # print('jump:', num, bbox_person[1], h/5)
            # cv2.rectangle(frame,
            #              (w/4, h/4),
            #              (w/2 + w/4, h/2+h/4),
            #              (0, 0, 255), 2)
            # cv2.rectangle(frame,
            #               (bbox_person[0], bbox_person[1]),
            #              (bbox_person[2], bbox_person[3]),
            #               (255, 0, 0), 2)
            # cv2.line(frame, (0, bbox_person[1]), (w, bbox_person[1]), (0, 255, 0), 2)

        if bbox_person[0] < xhighest:
            xhighest = bbox_person[0]
            framehighestjump = num
            highest_bb = bbox_person

        if not os.path.exists(args.output_dir):
            os.makedirs(args.output_dir)

        cv2.imwrite(osp.join(args.output_dir, str(num) + '.jpg'), frame)

anno['person_rect'] = highest_bb.tolist()
anno['highest_frame'] = int(framehighestjump)
print(framehighestjump)

with open(osp.join(args.output_dir, 'highest_frame.json'), 'w') as fp:
        json.dump(anno.copy(), fp)
