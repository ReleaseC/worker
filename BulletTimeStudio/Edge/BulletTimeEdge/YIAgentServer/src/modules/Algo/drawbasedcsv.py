from numpy import genfromtxt
import os
import cv2
import numpy as np
import matplotlib.pyplot as plt

csv_file_real = genfromtxt('/home/rudy/Downloads/bullet_test (3)/realXY.csv', delimiter=',')
csv_file_estimated = genfromtxt('/home/rudy/Downloads/bullet_test (3)/interpolatedXY.csv', delimiter=',')

for idx, row in enumerate(csv_file_estimated):
    imgpath = os.path.join('/home/rudy/Downloads/bullet_test (2)/2018-03-29-20-33/noalign', 'cam%03d.jpg' % (idx + 1))

    rescale_x = 1.0 #1.0 * int(args.wVideo) / int(args.wImage)
    rescale_y = 1.0 #1.0 * int(args.hVideo) / int(args.hImage)

    rects_real = []
    rects_estimated = []

    print(imgpath)
    ori = cv2.imread(imgpath)
    frame = np.array(ori)
    print(frame.shape)

    for j in range(0, 4):
        rects_estimated.append([row[j + j]*rescale_y, row[j + 1 + j]*rescale_x])
        rects_real.append([csv_file_real[idx][j + j]*rescale_y, csv_file_real[idx][j + 1 + j]*rescale_x])
        cv2.circle(frame, (int(csv_file_real[idx][j + j]*rescale_y), int(csv_file_real[idx][j + 1 + j]*rescale_x)), 5, (0, 255, 0), 5)

    cv2.imwrite('/home/rudy/Downloads/bullet_test (2)/out/'+'%03d_circle.jpg' % (idx+1), frame)
    cv2.polylines(ori, [np.array(rects_estimated, np.int32)], True, (0, 255, 255), 10)
    cv2.polylines(ori, [np.array(rects_real, np.int32)], True, (0, 255, 0), 10)
    cv2.imwrite('/home/rudy/Downloads/bullet_test (2)/out/' + '%03d_rect.jpg' % (idx + 1), ori)
    # decoder = init_h264dec(h264_VIDEO_FILE)
    # plt.imshow(frame[:,:,::-1])
    # plt.show()
    # sdf
    # frame = Image.fromarray(frame, mode='RGB')
    # frame.save(os.path.join(args.outputDir, 'cam%03d.jpg' % idx+1))

    # im = cv2.imread(os.path.join(args.outputDir, 'cam%03d.jpg' % idx+1), cv2.IMREAD_COLOR)

    pts_src = np.array(rects_real, np.int32)
    pts_dst = np.array(rects_estimated, np.int32)