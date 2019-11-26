import cv2
import numpy as np
import os
from numpy import genfromtxt
import sys
import argparse

def parse_args():
    """Parse input arguments."""
    parser = argparse.ArgumentParser(description='Bullet Time Effect')

    parser.add_argument('--inputDir', dest='inputDir', help='the root directory of frames',
                        default='')
    parser.add_argument('--outputDir', dest='outputDir', help='the directory of the outputs',
                        default='')
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

    if not os.path.exists(args.inputDir):
        print('data is not exist!')
        sys.exit()

    if not os.path.exists(args.outputDir):
        print('folder is not exist!')
        sys.exit()
    elif not os.path.exists(os.path.join(args.outputDir, 'align')):
        os.makedirs(os.path.join(args.outputDir, 'align'))

    return args

args = parse_args()

csv_file_real = genfromtxt(args.xyRealFile, delimiter=',')
csv_file_estimated = genfromtxt(args.xyInterpolateFile, delimiter=',')

# targetFrame = args.targetFrame.split(',')


for idx, row in enumerate(csv_file_estimated):
    # folder_camid = os.path.join(args.inputDir, str(idx+1))
    # h264_VIDEO_FILE = os.path.join(args.videoDir, '%03d.h264' % (idx + 1))
    # print(h264_VIDEO_FILE)
    # DEFAULT_H = int(args.hVideo)  # 1080
    # DEFAULT_W = int(args.wVideo)  # 1920
    # DEFAULT_C = 3
    #
    # rescale_x = 1.0 * int(args.wVideo) / int(args.wImage)
    # rescale_y = 1.0 * int(args.hVideo) / int(args.hImage)
    rects_real = []
    rects_estimated = []
    for j in range(0, 4):
        rects_estimated.append([row[j + j], row[j + 1 + j]])
        rects_real.append([csv_file_real[idx][j + j], csv_file_real[idx][j + 1 + j]])
    
    im = cv2.imread(os.path.join(args.inputDir, '%d.jpg' % (idx+1)))
    pts_src = np.array(rects_real, np.int32)
    pts_dst = np.array(rects_estimated, np.int32)
    h, status = cv2.findHomography(pts_src, pts_dst)
    im_out = cv2.warpPerspective(im, h, (im.shape[1], im.shape[0]))

    cv2.imwrite(os.path.join(args.outputDir, 'align/cam%03d_transformed.jpg' % (idx+1)), im_out)
    print('cam%03d_transformed.jpg' % (idx+1))

    # decoder = init_h264dec(h264_VIDEO_FILE)
    # for i in range(len(os.listdir(folder_camid))):
        # frame = get_frame(decoder, width=DEFAULT_W, height=DEFAULT_H, channels=DEFAULT_C)
        # # print "get frame:", elapsed_time
        # if (frame.shape[0]) != DEFAULT_H:
        #     break
        # if i == 60:
            # frame = Image.fromarray(frame, mode='RGB')
            # cv2.imwrite(os.path.join(args.outputDir, 'noalign/%03d_cam%03d_transformed.jpg' % (i, idx+1)), im)

            # im = cv2.imread(os.path.join(args.outputDir, 'noalign/cam%03d_%03d.jpg' % (idx+1, i)), cv2.IMREAD_COLOR)


