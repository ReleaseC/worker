# 大喇叭第三机位视频处理

# python3 y2.py 1_2.mp4 out_2.mp4 1600 0 1000 300 8 540 640
# python3 y2.py 1_2.mp4 out_2.mp4 1600 0 1000 300 8 1920 1080

import cv2
import numpy as np 
import time
import sys

DEBUG_FLAG = True  # 完成后设定为 False ！！！！！【DON】
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

def main():
    #  调用格式：
    if (len(sys.argv) != 10):
        print('usage: ', sys.argv[0], 'infile, outfile.mp4, roi_x,roi_y,roi_width, roi_height，结果视频秒数，宽度，高度')
        print('     python3 c2.py input.mp4 output.mp4 ')
        print('     1100 650 500 600 <-- 2560x1920 横屏ROI')
        print('     5~10             <-- 生成视频长度秒数')
        print('     640 540          <-- 视频宽/高 可以设定作为预览画面')
        print('     1080 1920        <-- 也可以设定为结果视频画面')
        print('                          其他宽高也可以支持，但不能大于1080')
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
    videoWriter = cv2.VideoWriter(sys.argv[2], fourcc, fps, (oh, ow))
    

    c_cnt = frame_cnt = 0
    MAX_COUNT = 30000
    MIN_COUNT = 10000
    IS_DETECTED = False
    scale=1.0

    # YELLOW HSV ，根据实际阳光角度再调整！！！！！【DON】
    low = np.array([23, 41, 133])
    high = np.array([40, 150, 255])

    # 先读第一帧
    ret, frame = cap.read()
    roi1_compare = frame[ey: ey + eh, ex: ex + ew]
    # 循环知道视频结束或者预设秒数
    while ret:
        frame_cnt += 1  # 记录读了多少帧画面
        roi_img = frame[ey: ey + eh, ex: ex + ew]
        cnt = mse(roi_img,roi1_compare)
        
        #cv2.rectangle(frame, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
        cv2.namedWindow('name', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('name',900, int(900*frameH/frameW))
        cv2.imshow('name', frame)

        print(cnt)
        if cnt > MIN_COUNT and not IS_DETECTED:
            if DEBUG_FLAG:
                frame1 = frame.copy()
                cv2.putText(frame1, "Boat Detected! Left", (100, 100), cv2.FONT_HERSHEY_SIMPLEX,3.0,(0,0,0),lineType=cv2.LINE_AA)
                #cv2.rectangle(frame1, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
                cv2.imshow('name', frame1)
                cv2.waitKey(1000)
                del frame1
            # 检测到黄色皮筏出现
            IS_DETECTED = True  

            # 重新读视频，回到触发之前1秒
            frame_new = 0
            #cap.release()  # 关闭视频文件再打开
            #cap = cv2.VideoCapture(sys.argv[1])

            # 快速的找到触发之前一秒的帧画面
            '''
            while frame_new < (frame_cnt-int(fps)):
                ret = cap.grab()
                frame_new+=1
            '''

        # 黄色皮筏出现后开始采集
        if (IS_DETECTED):
            #print(ow/oh)
            o_scale = ow / oh # 根据结果视频大小算出宽/高比例
            if ow < 1000 :
                w = 1300
            else:
                w = 2500         # 采集视频开始宽度设定在 900， 之后慢慢跳高（可以到1080）
            h = int(w/o_scale)  # 根据结果视频宽高比例算出剪裁视频高度  
            if c_cnt <= int(fps*4): # 第一秒没有缩放
                # 计算要crop的画面大小
                width = w 
                height = h
                #print(width,height)
                x1 = 1300    # 原始画面开始剪裁坐标固定不变
                y1= 0            
            else:
                # 计算要crop的画面大小，注意！是横屏转竖屏 【DON】
                d_cnt = c_cnt - int(fps*4)
                width = w + d_cnt * 7
                height = h + d_cnt * 3
                x1 = 1300-(d_cnt*6)    # 移动画面 x 轴
                y1= 0+d_cnt*3         # 移动画面 y 轴
                x1 = max(0,x1)          # x 坐标最小就是0，负数就无法处理视频剪裁了。
                                        # 到这里应该要结束操作，但还是有可能视频还没读完。
                                        # 继续操作就变成 宽高继续改变，但x轴画面不变了，还是可以接受
                
            # 从原始横屏画面中 2560x1920 把画面crop出来, 注意这里时横屏转竖屏哦 【DON】
            #print(width,height)
            img0 = frame[y1:y1+width, x1 : x1 + height]
            #img1 = np.rot90(img0)  #旋转这画面90度
            
            # 根据目前缩放比例调整画面为最终大小 
            #print(img0.shape)
            img2 = cv2.resize(img0, (oh, ow), cv2.INTER_LINEAR)
            #print(img2.shape)
            # 写出这帧画面
            img3=img2.copy()
            #cv2.imshow('name', img3)
            err = videoWriter.write(img3)
            #print('写入')
            if c_cnt < (int(fps * 4)):
                if c_cnt == int(fps*2) : # 定格1秒
                    for i in range (0, int(fps)):
                        err = videoWriter.write(img3) 
                        print('进来了')
                        c_cnt += 1
                else:
                    #前面放慢
                    err = videoWriter.write(img3) 
                    c_cnt += 1
                    #print('cnt',c_cnt)
                    #if c_cnt == 69:
                       #print('此处截取封面图')
                       #cv2.imwrite(sys.argv[10], img3)
            #print(videoWriter.isOpened())
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
            #cv2.rectangle(frame,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
            cv2.imshow('name', frame)

        k = cv2.waitKey(1) & 0xff
        if k == 27 or k == 'q':
            break

        ret, frame = cap.read()

    del roi_img
    del frame
    #del image_mask
    cv2.destroyAllWindows()
    cap.release()
    print(IS_DETECTED)
    if IS_DETECTED == False:
       print('此镜头没有识别到皮筏')
       os.remove(sys.argv[2])
    videoWriter.release()

if __name__ == "__main__":
    main()

