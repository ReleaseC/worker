import numpy as np
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
    parser = argparse.ArgumentParser(description='Count images src')

    parser.add_argument('--dataDirInput', dest='dataDirInput', help='the directory of the images',
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

# Only find *.jpg files
listing = glob.glob(args.dataDirInput + '*.jpg')
count = len(listing)
print 'count=',count