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
    parser.add_argument('--dataDirInput', dest='dataDirInput', help='the directory of the images',
                        default='./samples/images/')
    parser.add_argument('--dataDirOutput', dest='dataDirOutput', help='the directory of the filtered images',
                        default='./samples/images/')

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

#file_images = sorted(os.listdir(args.dataDirInput))
#n_images = len(file_images)

# Only find *.jpg files
listing = glob.glob(args.dataDirInput + '*.jpg')
n_images = len(listing)
print 'n_images=',n_images,';'

fig = plt.figure()
columns = n_images / 3 + 1
rows = 3

for i in range(0, n_images):
    _, file_ext = os.path.splitext(listing[i])
    if file_ext == '.txt':
        with open(os.path.join(args.dataDirInput, '%03d.txt') % (i + 1), 'r') as f:
            for line in f:
                line = line.strip().split(',')
                src = readb64(line[1])
    else:
        src = cv2.imread(args.dataDirInput + '%d.jpg' % (i + 1), cv2.IMREAD_COLOR)

    hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV)
    lower_range = np.array([152, 64, 0], dtype=np.uint8)
    upper_range = np.array([179, 255, 255], dtype=np.uint8)

    mask = cv2.inRange(hsv, lower_range, upper_range)
    src_filtered = cv2.bitwise_and(src, src, mask=mask)
    im = Image.fromarray(src_filtered[:,:,::-1]) 
    im.save(args.dataDirOutput + '%d.jpg' % (i + 1) ,"JPEG")
print('')
#     fig.add_subplot(rows, columns, i + 1)
#     plt.imshow(src_filtered[:, :, ::-1])
# plt.show()