import cv2
import numpy as np
import time
import sys
import os
import gc

# 波赛冬碗第二机位画面，根据皮筏出现时间和位置剪辑
#  调用格式：
#
# python3 b1.py a_1.mp4 out_b1_3.mp4 2560 230 300 270 5 1080 640 2160 660 1100 190 2000 1100 300 300

# -

DEBUG_FLAG = True  # 完成后设定为 False ！！！！！【DON】
frameH = frameW = fps = numFrames = v_second = 0.0
ex = ey = ew = eh = ow = oh = ex1 = ey1 = ew1 = eh1 = 0
ex2 = ey2 = eh2 = ew2 = 0  # ROI3
tfile1 = 't1.mp4'
tfile2 = 't2.mp4'
tfile3 = 't3.mp4'

# @profile


def mse(imageA, imageB):
    # the 'Mean Squared Error' between the two images is the
    # sum of the squared difference between the two images;
    # NOTE: the two images must have the same dimension
    # imageA=Image.fromarray(image_1)
    # imageB=Image.fromarray(image_2)
    #imageA = image_1
    #imageB = image_2

    err = np.sum((imageA.astype("float") - imageB.astype("float")) ** 2)
    err /= float(imageA.shape[0] * imageA.shape[1])
    # return the MSE, the lower the error, the more "similar"
    # the two images are
    return err

# @profile


def saveRegion1(cap):
    global frameH, frameW, ex, ey, ew, eh, ex1, ey1, ew1, eh1, ow, oh
    global fps, v_second, fourcc

    # 先写到一个文件
    videoWriter = cv2.VideoWriter(tfile1, fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write', tfile1)
        return

    width = ow
    height = int(width * oh / ow)
    y = ey - 300
    x = int(frameW-width) - 1000
    read_more_frame = int(v_second * fps)
    f_cnt = 0  # 记录写了几帧画面
    ret, frame = cap.read()
    print('in saveRegion1', fps, v_second, read_more_frame)
    for i in range(0, read_more_frame):
        img = frame[y:y+height, x:x+width]
        img1 = cv2.resize(img, (ow, oh), cv2.INTER_LINEAR)
        err = videoWriter.write(img1)
        if f_cnt < fps * 2:
            videoWriter.write(img1)
            videoWriter.write(img1)
        x = max(0, x - 10)

        f_cnt += 1

        DrawRect(frame, True, False, False)
        '''        
        if not ret: 
            if f_cnt < read_more_frame:
                k = read_more_frame - f_cnt
                for i in range (0, k):
                    videoWriter.write(img1)
                    print(f_cnt,fps)
                    if f_cnt < fps * 2:
                        videoWriter.write(img1)
                        videoWriter.write(img1)
                    f_cnt += 1
            break
        '''
        ret, frame = cap.read()

    del img1
    del img
    del frame
    videoWriter.release()
    return f_cnt


# 波赛冬第二机位，第二个画面
# @profile
def saveRegion2(cap):
    global frameH, frameW, ex, ey, ew, eh, ex1, ey1, ew1, eh1, ow, oh
    global fps, v_second, fourcc

    # 先写到一个文件
    videoWriter = cv2.VideoWriter(tfile2, fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write', tfile2)
        return

    width = int(ow / 1.5)
    height = int(width * oh / ow)
    y = ey1 - 200
    x = ex1
    read_more_frame = int(fps * v_second)
    f_cnt = 0  # 记录写了几帧画面
    ret, frame = cap.read()

    for i in range(0, read_more_frame):
        img = frame[y:y+height, x:x+width]
        img1 = cv2.resize(img, (ow, oh), cv2.INTER_LINEAR)
        err = videoWriter.write(img1)
        if f_cnt < fps * 2:
            videoWriter.write(img1)
            videoWriter.write(img1)
        f_cnt += 1
        DrawRect(frame, False, True, False)
        ret = cap.grab()
        if not ret:
            if f_cnt < read_more_frame:
                k = read_more_frame - f_cnt
                for i in range(0, k):
                    videoWriter.write(img1)
                    if f_cnt < fps * 2:
                        videoWriter.write(img1)
                        videoWriter.write(img1)
                    f_cnt += 1
            break
        x = max(0, x - 15)
        y = max(0, y-5)
        ret, frame = cap.retrieve()
        del img1
        del img

    del frame
    videoWriter.release()
    return f_cnt


def DrawRect(frame, IS_DETECTED1, IS_DETECTED2, IS_DETECTED3):
    global frameH, frameW, ex, ey, ew, eh, ex1, ey1, ew1, eh1, ow, oh
    global ex2, ey2, ew2, eh2

    if not DEBUG_FLAG:  # draw Rectangle only if DEBUG_FLAG is TRUE
        return False

    if IS_DETECTED1:
        cv2.rectangle(frame, (ex, ey),
                      (ex + ew, ey + eh), (0, 255, 0), 2)
    else:
        cv2.rectangle(frame, (ex, ey), (ex+ew, ey+eh), (0, 0, 255), 2)

    if IS_DETECTED2:
        cv2.rectangle(frame, (ex1, ey1),
                      (ex1 + ew1, ey1 + eh1), (0, 255, 0), 2)
    else:
        cv2.rectangle(frame, (ex1, ey1), (ex1+ew1, ey1+eh1), (0, 0, 255), 2)

    cv2.namedWindow('name', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('name', 900, int(900*frameH/frameW))
    cv2.imshow('name', frame)

    k = cv2.waitKey(1) & 0xff
    if k == 27 or k == 'q':
        exit(1)

    return False

# 把三个文件合为一个视频


def three_in_one():
    global fps, v_second, fourcc
    global frame_cnt_1, frame_cnt_2
    global oh, ow

    frame_to_write = int(fps * v_second)
    cap = cv2.VideoCapture(sys.argv[1])
    videoWriter = cv2.VideoWriter(sys.argv[2], fourcc, fps, (1080, 1920), True)
    if not videoWriter.isOpened():
        print('can not open output file to write')
        return

    if os.path.exists(tfile1):
        cap1 = cv2.VideoCapture(tfile1)
    else:
        cap1 = None

    if os.path.exists(tfile2):
        cap2 = cv2.VideoCapture(tfile2)
    else:
        cap2 = None

    if os.path.exists(tfile3):
        cap3 = cv2.VideoCapture(tfile3)
    else:
        cap3 = None

    height = 1080
    width = int(height * 1080 / 1920)
    x = int(frameW / 2)
    y = int((frameH - height))

    # 全景
    x1 = x
    y1 = y
    height1 = height
    width1 = width

    # 跳到第一个触发点
    print('skip {} frame'.format(frame_cnt_1))
    if (frame_cnt_1):
        for i in range(frame_cnt_1):
            ret = cap.grab()

        ret, frame = cap.read()
        rx = 1800
        ry = 100
        for i in range(0, int(fps * 3)):
            img1 = frame[ry:ry+1920, rx:rx+1080]
            videoWriter.write(img1)
            rx = max(0, rx-18)
            err, frame = cap.read()

    # 跳到第2个触发点
    print('2nd skip {} frame'.format(frame_cnt_2))
    if (frame_cnt_2):
        cap.release()
        cap = cv2.VideoCapture(sys.argv[1])
        for i in range(frame_cnt_2):
            ret = cap.grab()

        ret, frame = cap.read()
        rx = 2000
        ry = 200
        for i in range(0, int(fps * 4)):
            img1 = frame[ry:ry+1920, rx:rx+1080]
            videoWriter.write(img1)
            rx = max(0, rx-12)
            err, frame = cap.read()

    for i in range(0, frame_to_write):

        if cap1:
            err, frame1 = cap1.read()
            img1[0:oh, 0:ow] = frame1

        if cap2:
            err, frame2 = cap2.read()
            img1[oh:(oh+oh), 0:ow] = frame2

        # if cap3:
        #    err,frame3 = cap3.read()
        #    img1[1280:1960,0:1080] = frame3

        err = videoWriter.write(img1)
#        del img
        ret, frame = cap.read()
        if not ret:
            break
        x -= 2
        width -= 1
        height -= 1

    videoWriter.release()
    cap.release()
    if cap1:
        cap1.release()
    if cap2:
        cap2.release()
    if cap3:
        cap3.release()
    del frame
    del img1
    return

# @profile


def main():
    global frameH, frameW, ex, ey, ew, eh, ex1, ey1, ew1, eh1, ow, oh
    global ex2, ey2, ew2, eh2
    global fps, v_second, fourcc
    global frame_cnt_1, frame_cnt_2

    #  调用格式：
    #  python3 c1.py input.mp4 output.mp4
    #       3400 350 400 400 <-- 第一个ROI
    #       4 1080 1920
    #       0 1650 550 500   <-- 第二个ROI
    #
    if (len(sys.argv) != 18):
        print(
            'usage: ', sys.argv[0], 'infile.mp4, outfile.mp4, roi1，视频秒数,宽,高, roi2 roi3')
        print(' python3 波赛冬1.py a_1.mp4 b_out.mp4 2650 230 300 270 5 1080 640 2160 660 1100 190 2000 1100 300 300')
        return

    cap = cv2.VideoCapture(sys.argv[1])

    if cap.isOpened():
        ret, frame = cap.read()
    else:
        # print('can not open file:', sys.argv[1])
        return False

    frameH = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    frameW = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    numFrames = cap.get(cv2.CAP_PROP_FRAME_COUNT)

    print(frameH, frameW, fps, numFrames)

    ex = int(sys.argv[3])
    ey = int(sys.argv[4])
    ew = int(sys.argv[5])
    eh = int(sys.argv[6])
    v_second = int(sys.argv[7])
    ow = int(sys.argv[8])
    oh = int(sys.argv[9])
    ex1 = int(sys.argv[10])
    ey1 = int(sys.argv[11])
    ew1 = int(sys.argv[12])
    eh1 = int(sys.argv[13])
    ex2 = int(sys.argv[14])
    ey2 = int(sys.argv[15])
    ew2 = int(sys.argv[16])
    eh2 = int(sys.argv[17])

    if os.path.exists(tfile1):  # 先清理缓存文件
        os.remove(tfile1)
    if os.path.exists(tfile2):
        os.remove(tfile2)
    if os.path.exists(tfile3):
        os.remove(tfile3)

    # 设定output 文件名,mp4 压缩格式。
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # 和原来一样fps，大小 宽1080，高1920
    print('output file w/h=', ow, oh)

    f_cnt1 = f_cnt2 = f_cnt3 = 0  # 记录写了几帧
    c_cnt = max_cosin1 = max_cosin2 = max_cosin3 = 0
    IS_DETECTED1 = IS_DETECTED2 = IS_DETECTED3 = False
    COMPARE_THRESHOLD1 = 3500
    COMPARE_THRESHOLD2 = 3500
    COMPARE_THRESHOLD3 = 3500

    # 先读第一帧，设定ROI
    ret, frame = cap.read()

    # 保持对比区域 【DON】
    # ROI对比区域需要确定第一帧没有皮筏从出水口滑出！！！
    roi1_compare = frame[ey: ey + eh, ex: ex + ew]
    roi2_compare = frame[ey1: ey1 + eh1, ex1: ex1 + ew1]
    # roi3_compare = frame[ey2: ey2 + eh2, ex2: ex2 + ew2]
    # 再读一帧
    ret, frame = cap.read()

    frame_cnt_1 = frame_cnt_2 = 0  # 全局变量，记录触发帧
    # 循环知道视频结束或者预设秒数
    while ret:
        c_cnt += 1
        # print(c_cnt)

        if not IS_DETECTED1:
            roi1_image = frame[ey: ey + eh, ex: ex + ew]

            cosin1 = mse(roi1_image, roi1_compare)
            # print(cosin1)
            if cosin1 > COMPARE_THRESHOLD1:
                print('region 1  movement detected', cosin1)
                if cosin1 > max_cosin1:
                    max_cosin1 = cosin1
                IS_DETECTED1 = True
                frame_cnt_1 = c_cnt
                f_cnt1 = saveRegion1(cap)

        if not IS_DETECTED2:
            roi2_image = frame[ey1: ey1 + eh1, ex1: ex1 + ew1]
            cosin2 = mse(roi2_image, roi2_compare)
#           print('region 2 ',cosin2)
            if cosin2 > COMPARE_THRESHOLD2:
                print('region 2  movement detected', cosin2)
                if cosin2 > max_cosin2:
                    max_cosin2 = cosin2
                IS_DETECTED2 = True
                frame_cnt_2 = c_cnt + f_cnt1
                f_cnt2 = saveRegion2(cap)
        '''
        if not IS_DETECTED3: 
            
            roi3_image = frame[ey2: ey2 + eh2, ex2: ex2 + ew2]
            cosin3 = mse(roi3_image, roi3_compare)
#            print('region 3 ',cosin3)
            if cosin3 > COMPARE_THRESHOLD3:
                print('region 3  movement detected', cosin3)
                if cosin3 > max_cosin3:
                    max_cosin3 = cosin3
                IS_DETECTED3 = True
                f_cnt3 = saveRegion3(cap)
                break # 最后一个机位，拍完后结束
        '''

        DrawRect(frame, IS_DETECTED1, IS_DETECTED2, IS_DETECTED3)

        ret, frame = cap.read()

    del frame   # 释放一刚使用的内存变量
    del roi1_image
    del roi2_image
# del roi3_image
    del roi1_compare
    del roi2_compare
#    del roi3_compare

    cv2.destroyAllWindows()
    cap.release()

    print('total frame=', f_cnt1, f_cnt2, f_cnt3,
          '  max=', max_cosin1, max_cosin2, max_cosin3)

    three_in_one()  # 把文件合为一个
    del fourcc

    if os.path.exists(tfile1):  # 先清理缓存文件
        os.remove(tfile1)
    if os.path.exists(tfile2):
        os.remove(tfile2)
    if os.path.exists(tfile3):
        os.remove(tfile3)


if __name__ == "__main__":
    ret = main()
    sys.exit(ret)
