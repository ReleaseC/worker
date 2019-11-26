import cv2
import numpy as np 
import time
import sys
import gc

# 大喇叭第二机位画面，根据皮筏出现时间和位置剪辑
#  调用格式：
#  python3 c1.py input.mp4 output.mp4
#  #  调用格式：
#   python3 c1.py input.mp4 output.mp4
#       3400 350 400 400 <-- 第一个ROI
#       4 1080 1920
#       0 1650 550 500   <-- 第二个ROI
#
#
# 由于第一个ROI可能采集不到，这里两个ROI可以独立操作。如果第一个ROI没有画面
# 第二个ROI画面放慢延长。
#
# ROI底图需要随机调整，根据当时天气，太阳方向截图。目前是在视频流内抓第一帧制作两个ROI，
# 如果视频第一帧就是皮筏从出水口出现的话会造成问题！
#
# 可以考虑从第一个ROI里面抓出预览画面
#
# TODOLIST
# - 两个ROI之间的转场和特效
# - 
# python3 y1.py 1_1.mp4 out_1.mp4 0 1650 550 500 4 1080 1920 3400 350 400 400

DEBUG_FLAG = True  # 完成后设定为 False ！！！！！【DON】
frameH=frameW=fps=numFrames=0.0
ex=ey=ew=eh=ow=oh=ex1=ey1=ew1=eh1=0

# @profile
def mse(imageA, imageB):
    # the 'Mean Squared Error' between the two images is the
    # sum of the squared difference between the two images;
    # NOTE: the two images must have the same dimension
    # imageA=Image.fromarray(image_1)
    #imageB=Image.fromarray(image_2)
    #imageA = image_1
    #imageB = image_2

    err = np.sum((imageA.astype("float") - imageB.astype("float")) ** 2)
    err /= float(imageA.shape[0] * imageA.shape[1])
    # return the MSE, the lower the error, the more "similar"
    # the two images are
    return err

#@profile
def saveRegion1(cap,videoWriter):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh

    read_more_frame = 24
    f_cnt = 0 # 记录写了几帧画面
    y = 240
    x = ow 
    print(frameW, ow, x)
    for i in range (0,read_more_frame):
        ret, frame = cap.read()
        if not ret:
            print('read error')
            break
            
        if i < 10:  # 画面左移速度20帧之内不动
            x = x + 10
        elif i < 20: # 20-25帧之后右移动
            x = x + 80
        else:
            x = max(x + 100,0)  # 25帧之后加速左移

        img = frame[y:y+oh, x:x+ow]
        #cv2.namedWindow('1', cv2.WINDOW_NORMAL)
        #cv2.resizeWindow('1',900, int(900*frameH/frameW))
        #cv2.imshow('1', img)
        img1 = img.copy()  # 这边需要复制图片，否则 Write 会 segmentation fault！？【DON】

        err = videoWriter.write(img1)  # 放慢一倍，同一画面写出2帧
        err = videoWriter.write(img1)
        f_cnt += 2
        if i < 30:
            err = videoWriter.write(img1)
            err = videoWriter.write(img1)
            f_cnt += 2

        DrawRect(frame, True, False)

        del img1
        del img
        del frame
        if x <= 0:  # 已到达画面最左方，结束剪辑
            break

    
    return f_cnt


# 大喇叭第二个机位，第二个画面
#@profile
def saveRegion2(cap, videoWriter,frame_cnt):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh

    y = 200
    x = int(frameW-ow) 
    if frame_cnt: # 如果第一入口位置没有采集到内容，这里要多采集一些画面
        read_more_frame = 250
    else:  # 如果第一入口有内容，这里就少一些
        read_more_frame = 100

    direction = 0
    f_cnt = 0  # 记录写了几帧画面
    for i in range(0, read_more_frame):
        ret, frame = cap.read()
        if not ret:
            del frame
            break
        
        if i >= 20 and i < 30:  # 模拟皮筏左右滑动的轨迹
            direction = -20
        elif i>=30 and i< 70:
            direction = -45 
        elif i>=70 and i< 75:
            direction = 3
        elif i>=75 and i< 125:
            direction = 15 
        elif i >= 125 and i< 200:
            direction = -2
        elif i >= 200:
            direction = 0
        x = max( x + direction,0)
        if x==frameW-ow :
            direction = 0
        #print(frameW,frameH)
        #print(x,y,ow,oh)
        #print(y,y+oh, x-ow,x)
        img = frame[y:y+oh, x:x+ow]
       
        img1 = img.copy()  # 这边需要复制图片，否则 Write 会 segmentation fault！？【DON】

        err = videoWriter.write(img1)  # 放慢一倍，同一画面写出2帧
        f_cnt += 1
        if frame_cnt == 0: # 如果第一个画面没有采集到，这里放慢速度，拉长时间
            err = videoWriter.write(img1)
            f_cnt += 1

        DrawRect(frame, False, True)
        del img1
        del img
        del frame
                 

    return f_cnt

def DrawRect(frame, IS_DETECTED1,IS_DETECTED2):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh

    if not DEBUG_FLAG:  # draw Rectangle only if DEBUG_FLAG is TRUE
        return False

    if IS_DETECTED1:
        cv2.rectangle(frame, (ex, ey),
                              (ex + ew, ey + eh), (0, 255, 0), 2)
    else:
        cv2.rectangle(frame, (ex, ey), (ex+ew, ey+eh), (0, 0, 255), 2)

    if IS_DETECTED2:
        cv2.rectangle(frame, (ex1, ey1), (ex1 + ew1, ey1 + eh1), (0, 255, 0), 2)
    else:
        cv2.rectangle(frame, (ex1, ey1), (ex1+ew1, ey1+eh1), (0, 0, 255), 2)

    cv2.namedWindow('name', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('name',900, int(900*frameH/frameW))
    cv2.imshow('name', frame)

    k = cv2.waitKey(1) & 0xff
    if k == 27 or k == 'q':
        return True

    return False

#@profile
def main():
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh

    #  调用格式：
    #  python3 c1.py input.mp4 output.mp4
    #       3400 350 400 400 <-- 第一个ROI
    #       4 1080 1920
    #       0 1650 550 500   <-- 第二个ROI
    #
    if (len(sys.argv) != 14):
        print('usage: ', sys.argv[0], 'infile.mp4, outfile.mp4, x1,y1,w1,h1，视频秒数,宽,高, x2,y2,w2,h2')
        print('python3 c1.py 4k2.mp4 4k2out.mp4 3400 350 400 400 4 1080 1920 0 1650 550 500')
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
    
    #print(frameH,frameW,fps,numFrames)
   
    ex = int(sys.argv[3]) # 1000
    ey = int(sys.argv[4]) #600
    ew = int(sys.argv[5]) #500
    eh = int(sys.argv[6])  #600
    v_second = int(sys.argv[7])  #  结果视频秒数
    ow = int(sys.argv[8])  # 结果视频宽度
    oh = int(sys.argv[9])  # 结果视频高度
    ex1 = int(sys.argv[10])  # 1000
    ey1 = int(sys.argv[11])  # 600
    ew1 = int(sys.argv[12])  # 500
    eh1 = int(sys.argv[13])  # 600

    # 设定output 文件名,mp4 压缩格式。
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # 和原来一样fps，大小 宽1080，高1920
    print('output file w/h=',ow,oh)
    videoWriter = cv2.VideoWriter(sys.argv[2], fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write')
        return
    
    f_cnt1 = f_cnt2 = 0 # 记录写了几帧
    c_cnt = max_cosin1 = max_cosin2 = 0
    IS_DETECTED1 = IS_DETECTED2 = False
    COMPARE_THRESHOLD1 = 300
    COMPARE_THRESHOLD2 = 1000

    # 先读第一帧，设定ROI
    ret, frame = cap.read()
    
    # 保持对比区域 【DON】
    # ROI对比区域需要确定第一帧没有皮筏从出水口滑出！！！
    roi1_compare = frame[ey: ey + eh, ex: ex + ew]
    roi2_compare = frame[ey1: ey1 + eh1, ex1: ex1 + ew1]
    
    # 再读一帧
    ret, frame = cap.read()

    # 循环知道视频结束或者预设秒数
    while ret:
        c_cnt += 1
      
        if not IS_DETECTED1 and not IS_DETECTED2:
            roi1_image = frame[ey: ey + eh, ex: ex + ew]
            cosin1 = mse(roi1_image, roi1_compare)
            if cosin1 > COMPARE_THRESHOLD1:
                print('region 1  movement detected')
                if cosin1 > max_cosin1:
                    max_cosin1 = cosin1
            # 检测到黄色皮筏出现
                IS_DETECTED1 = True
                print(cosin1)
                f_cnt1 = saveRegion1(cap,videoWriter)
        
        if not IS_DETECTED2:
            roi2_image = frame[ey1: ey1 + eh1, ex1: ex1 + ew1]
            cosin2 = mse(roi2_image, roi2_compare)
            print(cosin2)
            if cosin2 > COMPARE_THRESHOLD2:
                print('region 2  movement detected')
                if cosin2 > max_cosin2:
                    max_cosin2 = cosin2
            # 检测到黄色皮筏出现
                IS_DETECTED2 = True
                print(cosin2)
                f_cnt2 = saveRegion2(cap,videoWriter,f_cnt1)
                break

        DrawRect(frame, IS_DETECTED1, IS_DETECTED2)

        # collected = gc.collect()
        #if DEBUG_FLAG:
        #    print("Garbage collector: collected %d objects" % (collected))

        ret, frame = cap.read()

    del frame   # 释放一刚使用的内存变量
    del roi1_image
    del roi2_image
    del roi1_compare
    del roi2_compare
    del fourcc

    cv2.destroyAllWindows()
    cap.release()
    videoWriter.release()
    gc.collect()
    print('total frame=', f_cnt1, f_cnt2, '  max=', max_cosin1, max_cosin2)
 
if __name__ == "__main__":
    ret = main()
    sys.exit(ret)
