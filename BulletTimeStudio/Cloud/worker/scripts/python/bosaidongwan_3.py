# 波赛冬碗第三机位视频处理
# 

# 波赛冬碗roi设定以及其他参数修改[JOE]: python3 波赛冬2.py c_2.mp4 b3_2_out.mp4 1600 0 200 200 8 640 540

import cv2
import numpy as np 
import time
import sys
import os
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

DEBUG_FLAG = True  # 完成后设定为 False ！！！！！【DON】

def main():
    size = os.path.getsize(sys.argv[1])
    if(size <= 1000):
        print('文件太小，删除文件')
        os.remove(sys.argv[2])
    #  调用格式：
    if (len(sys.argv) != 10):
        print('usage: ', sys.argv[0], 'infile, outfile.mp4, roi_x,roi_y,roi_width, roi_height，结果视频秒数，宽度，高度')
        return

    #print (sys.argv[1])
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
    # print(frameH,frameW,fps,numFrames)
    #产出1080×1920：600,600,800,800
    #产出1080*960: 1000,600,500,600
    
    ex = int(sys.argv[3]) # 1000
    ey = int(sys.argv[4]) #600
    ew = int(sys.argv[5]) #500
    eh = int(sys.argv[6])  #600
    v_second = int(sys.argv[7])  #  结果视频秒数
    ow = int(sys.argv[8])  # 结果视频宽度
    oh = int(sys.argv[9])  # 结果视频高度

    # 设定output 文件名,mp4 压缩格式。
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # 和原来一样fps，大小 宽1080，高1920
    videoWriter = cv2.VideoWriter(sys.argv[2], fourcc, fps, (ow, oh))

    c_cnt = frame_cnt = 0
    MAX_COUNT = 50000
    MIN_COUNT = 10000
    IS_DETECTED = False
    scale=1.0

    # YELLOW HSV ，根据实际阳光角度再调整！！！！！【DON】
    low = np.array([23, 41, 0])
    high = np.array([40, 150, 255])

    # 先读第一帧
    ret, frame = cap.read()
    roi1_compare = frame[ey: ey + eh, ex: ex + ew]
    # 循环知道视频结束或者预设秒数
    while ret:
        frame_cnt += 1  # 记录读了多少帧画面
        roi_img = frame[ey: ey + eh, ex: ex + ew]
        '''
        hsv = cv2.cvtColor(roi_img,cv2.COLOR_BGR2HSV)
    
        image_mask = cv2.inRange(hsv,low,high)
        #cv2.imshow('mask', image_mask)      # 遮罩，黄色白点，其他黑
        cnt = cv2.countNonZero(image_mask) # 计算多少黄色点
        '''
        cnt = mse(roi_img, roi1_compare)
        print(cnt)
        if cnt > MIN_COUNT and not IS_DETECTED:
            if DEBUG_FLAG:
                frame1 = frame.copy()
                cv2.putText(frame1, "Boat Detected! Left", (100, 100),              cv2.FONT_HERSHEY_SIMPLEX,
                    3.0,(0,0,0),lineType=cv2.LINE_AA)
                cv2.rectangle(frame1, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
                cv2.imshow('name', frame1)
                cv2.waitKey(1000)
                del frame1
            # 检测到黄色皮筏出现
            IS_DETECTED = True  

            # 重新读视频，回到触发之前1秒
            frame_new = 0
            cap.release()  # 关闭视频文件再打开
            cap = cv2.VideoCapture(sys.argv[1])

            # 快速的找到触发之前一秒的帧画面
            while frame_new < (frame_cnt-int(fps)):
                ret = cap.grab()
                frame_new+=1

        # 黄色皮筏出现后开始采集
        x0 = 900
        y0 = 400
        width = 1920
        height = 1080
        if (IS_DETECTED):
            if c_cnt <= int(fps*3): # 第一秒没有缩放
                # 计算要crop的画面大小
                # 修改了x,y初始位置[JOE]
                width = width 
                height = height 
                x1 = x0
                y1= y0            
            else:
                # 计算要crop的画面大小，注意！是横屏转竖屏 【DON】
                d_cnt = c_cnt - int(fps*3)
                width = width
                height = height
                # 修改了x,y的移动速度[JOE]
                x1 = x0+(d_cnt*10)    # 移动画面 x 轴
                y1= y0+d_cnt        # 移动画面 y 轴
            print(x1,y1)
            # 从原始横屏画面中 2560x1920 把画面crop出来, 注意这里时横屏转竖屏哦 【DON】
            img0 = frame[y1:y1+width, x1 : x1 + height]
            # img1 = np.rot90(img0)  #旋转这画面90度
            # 根据目前缩放比例调整画面为最终大小 
            img2 = cv2.resize(img0, (ow, oh), cv2.INTER_LINEAR)

            # 写出这帧画面
            img3=img2.copy()
            videoWriter.write(img3)
            
            if c_cnt < (int(fps * 4)):
                if c_cnt == int(fps*2) : # 定格1秒
                    for i in range (0, int(fps)):
                        videoWriter.write(img3) 
                        c_cnt += 1
                else:
                    #前面放慢
                    videoWriter.write(img3) 
                    c_cnt += 1

            del img0
            #del img1
            del img2
            del img3
            c_cnt += 1
            if c_cnt >= (int(fps) * v_second):
                print('frame count reach max', c_cnt, fps) 
                break  #  看是否超过输入秒数
            #else:
                #print(cnt)
        #else:
        #    print(cnt)

        if DEBUG_FLAG:
            cv2.rectangle(frame,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
            cv2.imshow('name', frame)

        k = cv2.waitKey(1) & 0xff
        if k == 27 or k == 'q':
            break

        ret, frame = cap.read()


    del roi_img
    del frame
    cv2.destroyAllWindows()
    cap.release()
    print(IS_DETECTED)
    if IS_DETECTED == False:
        print('此镜头没有识别到皮筏')
        os.remove(sys.argv[2])
    videoWriter.release()

if __name__ == "__main__":
    main()

