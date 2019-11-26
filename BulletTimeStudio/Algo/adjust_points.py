import numpy as np
import base64
from StringIO import StringIO
from PIL import Image
import os
import cv2
import argparse
import sys
import math
import pandas as pd
import matplotlib.pyplot as plt
from scipy.spatial import distance as dist
from numpy import genfromtxt
from PIL import Image
import glob

def parse_args():
    """Parse input arguments."""
    parser = argparse.ArgumentParser(description='Bullet Time Effect')
    parser.add_argument('--calibrated', dest='calibrated', help='has calibrated',
                        default=0)
    parser.add_argument('--dataDirInput', dest='dataDirInput', help='the directory of the images',
                        default='./samples/images/')
    parser.add_argument('--dataDirOutput', dest='dataDirOutput', help='the directory of the images',
                        default='./samples/images/')
    parser.add_argument('--param1', dest='param1', help='parameter-1 hough circle',
                        default=10)
    parser.add_argument('--param2', dest='param2', help='parameter-2 hough circle',
                        default=20)
    parser.add_argument('--minRadius', dest='minRadius', help='minimum radius hough circle',
                        default=10)
    parser.add_argument('--maxRadius', dest='maxRadius', help='maximum radius hough circle',
                        default=19)
    parser.add_argument('--thresDistCent', dest='thresDistCent', help='threshold maximum distance to center',
                        default=600)
    parser.add_argument('--lx', dest='lx', help='threshold lower bound x',
                        default=0)
    parser.add_argument('--ux', dest='ux', help='threshold upper bound x',
                        default=1920)
    parser.add_argument('--ly', dest='ly', help='threshold lower bound y',
                        default=0)
    parser.add_argument('--uy', dest='uy', help='threshold upper bound y',
                        default=1080)

    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    if not os.path.exists(args.dataDirInput):
        print('data is not exist!')
        sys.exit()

    return args

args = parse_args()

def readb64(base64_string):
    sbuf = StringIO()
    sbuf.write(base64.b64decode(base64_string))
    pimg = Image.open(sbuf)
    return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)


def orderXY(pts):
    '''
    ref: https://www.pyimagesearch.com/2016/03/21/ordering-coordinates-clockwise-with-python-and-opencv/
    :param pts:
    :return:
    '''
    # sort the points based on their x-coordinates
    xSorted = pts[np.argsort(pts[:, 0]), :]

    # grab the left-most and right-most points from the sorted
    # x-roodinate points
    leftMost = xSorted[:2, :]
    rightMost = xSorted[2:, :]

    # now, sort the left-most coordinates according to their
    # y-coordinates so we can grab the top-left and bottom-left
    # points, respectively
    leftMost = leftMost[np.argsort(leftMost[:, 1]), :]
    (tl, bl) = leftMost

    # now that we have the top-left coordinate, use it as an
    # anchor to calculate the Euclidean distance between the
    # top-left and right-most points; by the Pythagorean
    # theorem, the point with the largest distance will be
    # our bottom-right point
    D = dist.cdist(tl[np.newaxis], rightMost, "euclidean")[0]
    (br, tr) = rightMost[np.argsort(D)[::-1], :]

    # return the coordinates in top-left, top-right,
    # bottom-right, and bottom-left order
    return np.array([tl, tr, br, bl], dtype="float32")

#file_images = sorted(os.listdir(args.dataDirInput))
#n_images = len(file_images)

# Only find *.jpg files
listing = glob.glob(args.dataDirInput + '*.jpg')
n_images = len(listing)
print 'n_images=',n_images,';'
# fig = plt.figure()
columns = n_images/3 + 1
rows = 3

xy_all = []
for i in range(0, n_images):
    _ , file_ext = os.path.splitext(listing[i])
    if file_ext == '.txt':
        with open(os.path.join(args.dataDir, '%03d.txt') % (i+1), 'r') as f:
            for line in f:
                line = line.strip().split(',')
                src = readb64(line[1])
    else:
        src = cv2.imread(args.dataDirInput + '%03d.png' % (i+1), cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    h, w, _ = src.shape

    gray = cv2.medianBlur(gray, 5)

    cx = w / 2
    cy = h / 2

    #center of the image
    cv2.circle(src, (cx, cy), 5, (0, 255, 0), 5)
    #im = Image.fromarray(src[:,:,::-1])
    #im.show()
    # rows = gray.shape[0]
    circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, gray.shape[0] / 8,
                               param1=float(args.param1), param2=float(args.param2),
                               minRadius=int(args.minRadius), maxRadius=int(args.maxRadius))

    xys = []
    if circles is not None:
        circles = np.uint16(np.around(circles))
        for j in circles[0, :]:
            xy = (j[0], j[1])

            if abs(math.hypot(cx - j[0], cy - j[1])) < float(args.thresDistCent) and xy[0]>int(args.lx)\
                    and xy[0]<int(args.ux) and xy[1]>int(args.ly) and xy[1]<int(args.uy):
                # circle center
                cv2.circle(src, xy, 1, (0, 100, 100), 3)
                # circle outline
                radius = j[2]
                cv2.circle(src, xy, radius, (0, 0, 255), 5)
                xys.append(xy)

    if int(args.calibrated):
        if len(xys) != 0:
            if i==0 or i==(n_images-1):
                ordered_xys = orderXY(np.array(xys))
            else:
                ordered_xys = np.zeros((4,2))
            xy_all.append(ordered_xys.flatten())
    
    #im = Image.fromarray(src[:,:,::-1])
    #im.show()
    # fig.add_subplot(rows, columns, i+1)
    # plt.imshow(src[:,:,::-1])

if not int(args.calibrated):
    #plt.show()
    for i in range(0, n_images):
        im = Image.fromarray(src[:,:,::-1]) 
        im.save(args.dataDirOutput + '%03d_adjust0.png' % (i + 1) ,"PNG")
        print ';fileName[',i,']=',args.dataDirOutput + '%03d_adjust0.png' % (i+1),';'
else:
    xy_all = np.asarray(xy_all)
    np.savetxt(args.dataDirOutput + 'realXY.csv', xy_all, delimiter=',')
    xy_real = genfromtxt(args.dataDirOutput + 'realXY.csv', delimiter=',')

    series = pd.read_csv(args.dataDirOutput + 'realXY.csv', sep=',', header=None)
    series.loc[1:n_images-2]='NaN'
    for col in series:
        series[col] = pd.to_numeric(series[col], errors='coerce')
    interpolated = series.interpolate(method='linear')
    interpolated.to_csv(args.dataDirOutput + 'interpolatedXY.csv', sep=',', header=None, index=False)
    xy_interpolated = genfromtxt(args.dataDirOutput + 'interpolatedXY.csv', delimiter=',')

    fig = plt.figure()
    columns = n_images / 3 + 1
    rows = 3
    for idx, row in enumerate(xy_real):
        src = cv2.imread(args.dataDirInput + '%03d.png' % (idx + 1), cv2.IMREAD_COLOR)
        xy_all_real = []
        xy_all_interpolated = []
        for j in range(0, 4):
            xy_all_real.append([xy_real[idx][j + j], xy_real[idx][j + 1 + j]])
            xy_all_interpolated.append([xy_interpolated[idx][j + j], xy_interpolated[idx][j + 1 + j]])

        cv2.polylines(src, [np.array(xy_all_interpolated, np.int32)], True, (0, 255, 255), 10)
        cv2.polylines(src, [np.array(xy_all_real, np.int32)], True, (0, 255, 0), 10)
        fig.add_subplot(rows, columns, idx + 1)
        plt.imshow(src[:,:,::-1])
        
        im = Image.fromarray(src[:,:,::-1])
        im.save(args.dataDirOutput + '%03d_adjust1.png' % (idx + 1) ,"PNG")
        print 'xy_all_real[',idx,']=',xy_all_real,';xy_all_interpolated[',idx,']=',xy_all_interpolated,';fileName[',idx,']=',args.dataDirOutput + '%03d_adjust1.png' % (idx+1),';'
    #plt.show()
