import cv2
import numpy as np
from h264_decoder_module.h264module import *
import os
from PIL import Image
from numpy import genfromtxt
import sys
import argparse

def parse_args():
    """Parse input arguments."""
    parser = argparse.ArgumentParser(description='Bullet Time Effect')

    parser.add_argument('--videoDir', dest='videoDir', help='the directory of the videos',
                        default='./samples/videos/')
    parser.add_argument('--outputDir', dest='outputDir', help='the directory of the outputs',
                        default='./samples/bullet_images/')
    parser.add_argument('--targetFrame', dest='targetFrame', help='the target frame/image for bullet time',
                        default=2)
    parser.add_argument('--xyRealFile', dest='xyRealFile', help='csv file of the real coordinate',
                        default='realXY.csv')
    parser.add_argument('--xyInterpolateFile', dest='xyInterpolateFile', help='csv file of the estimated coordinate',
                        default='interpolatedXY.csv')
    parser.add_argument('--hImage', dest='hImage', help='Height of the image for calibration',
                        default=1080)
    parser.add_argument('--wImage', dest='wImage', help='Width of the image for calibration',
                        default=1920)
    parser.add_argument('--hVideo', dest='hVideo', help='Height of the video',
                        default=720)
    parser.add_argument('--wVideo', dest='wVideo', help='Width of the video',
                        default=1280)

    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    if not os.path.exists(args.videoDir):
        print('data is not exist!')
        sys.exit()

    if not os.path.exists(args.outputDir):
        print('folder is not exist!')
        sys.exit()
    elif not os.path.exists(os.path.join(args.outputDir, 'noalign')):
        os.makedirs(os.path.join(args.outputDir, 'noalign'))
        os.makedirs(os.path.join(args.outputDir, 'align'))

    return args

args = parse_args()

csv_file_real = genfromtxt(args.xyRealFile, delimiter=',')
csv_file_estimated = genfromtxt(args.xyInterpolateFile, delimiter=',')

for idx, row in enumerate(csv_file_estimated):
    h264_VIDEO_FILE = os.path.join(args.videoDir, '%03d.h264' % (idx + 1))
    print(h264_VIDEO_FILE)
    DEFAULT_H = int(args.hVideo)  # 1080
    DEFAULT_W = int(args.wVideo)  # 1920
    DEFAULT_C = 3

    rescale_x = 1.0 * int(args.wVideo) / int(args.wImage)
    rescale_y = 1.0 * int(args.hVideo) / int(args.hImage)

    rects_real = []
    rects_estimated = []
    for j in range(0, 4):
        rects_estimated.append([row[j + j]*rescale_y, row[j + 1 + j]*rescale_x])
        rects_real.append([csv_file_real[idx][j + j]*rescale_y, csv_file_real[idx][j + 1 + j]*rescale_x])

    decoder = init_h264dec(h264_VIDEO_FILE)
    for i in range(20000):
        frame = get_frame(decoder, width=DEFAULT_W, height=DEFAULT_H, channels=DEFAULT_C)
        # print "get frame:", elapsed_time
        if (frame.shape[0]) != DEFAULT_H:
            break
        if i == int(args.targetFrame):
            frame = Image.fromarray(frame, mode='RGB')
            frame.save(os.path.join(args.outputDir, 'noalign/cam%03d_%03d.jpg' % (idx+1, i)))

            im = cv2.imread(os.path.join(args.outputDir, 'noalign/cam%03d_%03d.jpg' % (idx+1, i)), cv2.IMREAD_COLOR)

            pts_src = np.array(rects_real, np.int32)
            pts_dst = np.array(rects_estimated, np.int32)
            h, status = cv2.findHomography(pts_src, pts_dst)
            im_out = cv2.warpPerspective(im, h, (im.shape[1], im.shape[0]))

            cv2.imwrite(os.path.join(args.outputDir, 'align/cam%03d_%03d_transformed.jpg' % (idx+1, i)), im_out)
            break

