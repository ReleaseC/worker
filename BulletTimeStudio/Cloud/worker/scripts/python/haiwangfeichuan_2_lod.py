#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Tue Aug  6 08:54:35 2019

@author: pi
"""

import cv2
import numpy as np 
import time
import sys
import numpy
import json
import os


# 激流涌进/飞舟冲浪，根据皮筏出现时间和位置剪辑
#  调用格式：
# python c1.py slide3.mp4 out3.mp4 1600 800 300 300 2.3  720 1080
#   调用格式：
#   python3 c1.py input.mp4 output.mp4
#       1550 800 300 300 <-- ROI 根据目前2048 1536 分辨率设定
#       2.2 <--- 原来视频秒数，最后视频长度会是5倍
#                 放慢3倍 + 倒车 + 溜下
#       1080 1920  <--- 生成视频宽高

DEBUG_FLAG = False  # 完成后设定为 False ！！！！！【DON】
frameH=frameW=fps=numFrames=0.0
ex=ey=ew=eh=ow=oh=ex1=ey1=ew1=eh1=cnt=0
v_second = 0.0
gx = gy = gw = gh = 0
inname=outname=combine=jpg='abc'


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

x_move = 16
y_move = 6

#@profile
'''
    count: 到触发的帧数
    slow: True - 放慢速度 
          False - 正常速度
'''
def saveRegion1(cap,videoWriter, count, slow):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps
    global gx,gy,gw,gh, x_move, y_move
    global inname,outname,combine
   
    #print(frameH,frameW)
    cap.release()  # 要重新找到视频起点，先关闭在打开视频
    cap = cv2.VideoCapture(inname) 
    for i in range (0, count+int(fps)):  # 回到触发前一秒
        cap.grab()

    cnt =0
    read_more_frame = int(float(fps) * float(v_second) )
    #w1 = int(frameW / 2)
    #h1 = int(w1 * oh / ow)
    w1 = int(frameW / 4)
    h1 = int(w1 * oh / ow)
    x = 50
    y = 0

    if (float(oh)/ow > 1.5):
        y_move = 10
        x_move = 23
    else: 
        y_move = 18
        x_move = 25
        
    cap1 = cv2.VideoCapture(combine)
    
    #if not cap1.isOpened():
    #    print('cannot open .mp4')
    
        
    for i in range (0,read_more_frame):
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap.read()
        if not ret2:
            print('视频读完了')
            break
       
        cnt += 1
       
        if x<=int(frameW) and y<=int(frameH):
           
            x = max(x+x_move,0)
           
        
            if (float(oh)/ow > 1.5):
            
                y = min(y+y_move,int(oh-frameH))
            else:
                y=  min(y+y_move,int(frameH-oh))
        
      
        w1 += 2
        h1 = int(w1 * oh / ow)
        # print(x,y, w1, h1)
        img = frame2[y:y+h1, x:x+w1]
        img2 = cv2.resize(img, (ow, oh), cv2.INTER_LINEAR)

        final_put = ComBine(videoWriter,ret1,frame1,ret2,img2) 
        if slow:
            final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)  # 放慢3倍，同一画面写出3帧
            final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)
            final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)
            final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)
            final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)

            if (i==int(read_more_frame/2)):
                cv2.imwrite(jpg,final_put,[int(cv2.IMWRITE_JPEG_QUALITY),95])
                for j in range (0, int(fps)):
                 final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)
                     
        
        DrawRect(frame2, True)

        del img2
        del img
        del frame2
   

    gx = x
    gy = y
    gw = w1
    gh = h1
    return cnt

def seektoframe(cap,count):
    cap.release()  # 要重新找到视频起点，先关闭在打开视频
    cap = cv2.VideoCapture(inname) 
    for i in range (0,count):
        cap.grab()
    return cap

# 视频回放
def saveReverse(cap,videoWriter, count, total_frame):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps
    global x_move, y_move

   # print('SaveReverse --front count', count, 'total frame', total_frame)
    cnt = total_frame 
    read_more_frame = int(float(fps) * float(v_second))
    h1 = gh
    w1 = gw
    x = gx  
    y = gy
    #print(gx,gy,gw,gh)


    delta = max(0,count+int(fps)) # 触发前一秒开始采集
    for i in range (0,read_more_frame):
        cap = seektoframe(cap,cnt+delta-1)
        ret,frame = cap.read()
        if not ret:
            print('视频文件 read error')
            break
                
        # print(x,y, w1, h1)
        img = frame[y:y+h1, x:x+w1]
        img2 = cv2.resize(img, (ow, oh), cv2.INTER_LINEAR)
        '''
        cv2.namedWindow("img2",0);
        cv2.resizeWindow("img2", 540,640);

        cv2.imshow('img2',img2)
        '''
        videoWriter.write(img2)  
        DrawRect(frame, True)

        x = max(0,x-x_move)
        y = max(0,y-y_move)
            
        w1 -= 2
        h1 = int(w1 * oh / ow)

        del img2
        del img
        del frame
        cnt -= 1
        if cnt < 0:
            break

    return cnt



def DrawRect(frame, IS_DETECTED1):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh

    if not DEBUG_FLAG:  # draw Rectangle only if DEBUG_FLAG is TRUE
        return False

    if IS_DETECTED1:
        cv2.rectangle(frame, (ex, ey),
                              (ex + ew, ey + eh), (0, 255, 0), 2)
    else:
        cv2.rectangle(frame, (ex, ey), (ex+ew, ey+eh), (0, 0, 255), 2)
    '''
    cv2.namedWindow('name', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('name',500, int(500*frameH/frameW))
    cv2.imshow('name', frame)
    '''
    k = cv2.waitKey(1) & 0xff
    if k == 27 or k == 'q':
        return True

    return False

#写入Json文件
def SaveJson():
    team = {}
    i = 0 
    while(i<11):
        if(sys.argv[i+1] == '\n'):
            break
        elif(sys.argv[i+1] == '-i'):
            team['-i'] = sys.argv[i+2]
            i+=2
        elif(sys.argv[i+1] == '-o'):
            team['-o'] = sys.argv[i+2]
            i+=2
        elif(sys.argv[i+1] == '-roi'):
            b = "".join(sys.argv[i+2])
            team['-roi'] = b.split(",")
            i+=2
        elif(sys.argv[i+1] == '-l'):
            team['-l'] = sys.argv[i+2]
            i+=2
        elif(sys.argv[i+1] == '-jpg'):
            team['-jpg'] = sys.argv[i+2]
            i+=2
        elif(sys.argv[i+1] == '-size'):
            a = "".join(sys.argv[i+2])
            team['-size'] = a.split(",")
            i+=2
        #elif(sys.argv[i+1] == '-c'):
        #    team['-c'] = sys.argv[i+2]
        #    i+=2
        else:
            print('Key input error:not -i,-o,-roi,-l,-size,-c')
            return False
    with open('mydata.json','w') as f:
        json.dump(team, f, sort_keys=True, indent=4, separators=(',', ': '))
    return True

#当输入指令包含-i,-o,-roi等读取Json文件并赋值
def GetValue1():
    global ex,ey,ew,eh,ow,oh
    global v_second
    global inname,outname,combine,jpg
    f = open('mydata.json')
    team = json.load(f)
    inname = team['-i']
    outname = team['-o']
    ex = (int)(team['-roi'][0])
    ey = (int)(team['-roi'][1])
    ew = (int)(team['-roi'][2])
    eh = (int)(team['-roi'][3])
    v_second = (float)(team['-l'])
    ow = (int)(team['-size'][0])
    oh = (int)(team['-size'][1])
    jpg = team['-jpg']
    #combine = team['-c']
    
#当输入指令只用Json，读取Json文件并赋值
def GetValue2():
    global ex,ey,ew,eh,ow,oh
    global v_second
    global inname,outname,combine,jpg
    
    f = open(sys.argv[1])
    team = json.load(f)
    inname = team['-i']
    outname = (str)(team['-o'])
    ex = (int)(team['-roi'][0])
    ey = (int)(team['-roi'][1])
    ew = (int)(team['-roi'][2])
    eh = (int)(team['-roi'][3])
    v_second = (float)(team['-l'])
    ow = (int)(team['-size'][0])
    oh = (int)(team['-size'][1])
    jpg = team['jpg']
    #combine = team['-c']
    
#图像叠加并保存格式为mp4
def ComBine(videoWriter,ret1,frame1,ret2,img2):
    global ow,oh,cnt
    
    lower_green = np.array([40, 50, 50])
    upper_green = np.array([90, 255, 255])
    
    t1 = int(time.time())  # 记录现在时间
    while(True):
        
        if ret2==True:
            if ret1==True:
                '''
                cv2.namedWindow("frame1",0);
                cv2.resizeWindow("frame1", 640,540);
                cv2.imshow('frame1', frame1)
                '''
                
                # 转换画面色彩从 BGR to HSV
                rows, cols, channels = frame1.shape
    #            print(rows, cols)
                backimg = cv2.resize(frame1, (ow, oh))
                hsv = cv2.cvtColor(backimg, cv2.COLOR_BGR2HSV)
                mask1 = cv2.inRange(hsv, lower_green, upper_green)  # 建立绿色黑白遮罩
                mask2 = cv2.bitwise_not(mask1)                      # 建立反转黑白
                
                # Generating the final output
                res2 = cv2.bitwise_and(backimg, backimg, mask=mask2)  # 原图画面
                res1 = cv2.bitwise_and(img2,img2, mask=mask1)  # 背景画面
                final_output = cv2.addWeighted(res1, 1, res2, 1, 0) # 合并画面
                '''  
                cv2.namedWindow("mask1",0);
                cv2.namedWindow("mask2",0);
                cv2.namedWindow("image",0);
                cv2.namedWindow("res1",0);
                cv2.namedWindow("res2",0);
                cv2.resizeWindow("mask1", 640,540);
                cv2.resizeWindow("mask2", 640,540);
                cv2.resizeWindow("image", 640,540);
                cv2.resizeWindow("res1", 640,540);
                cv2.resizeWindow("res2", 640,540);
                
                cv2.imshow('mask1', mask1)
                cv2.imshow('mask2', mask2)
                cv2.imshow('image', final_output)
                cv2.imshow('res1', res1)
                cv2.imshow('res2', res2)
                '''
                return final_output
                videoWriter.write(final_output)
                
                t2 = int(time.time())
                if t2 > t1:
                   # print('fps=', cnt)
                    cnt = 0
                    t1 = t2
                else:
                    cnt += 1
            else:
                '''
                cv2.namedWindow("img2",0);
                cv2.resizeWindow("img2", 540,640);

                cv2.imshow('img2',img2)
                '''
                final_output = img2
                videoWriter.write(img2)
                t2 = int(time.time())
                if t2 > t1:
                 #   print('fps=', cnt)
                    cnt = 0
                    t1 = t2
                else:
                    cnt += 1
                return final_output
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        else:
            break
   
#@profile
def main():
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps
    global inname,outname

    #  调用格式：
    #  python3 c1.py input.mp4 output.mp4
    #       3400 350 400 400 <-- 第一个ROI
    #       4 1080 1920
    #
    if (len(sys.argv) == 13):
        SaveJson()
        GetValue1()
    
    elif (len(sys.argv) == 2):
        GetValue2()
    
    else:
        print('usage: ', sys.argv[0], 'infile.mp4, outfile.mp4, x1,y1,w1,h1，视频秒数,宽,高;or .json')
        print('python3 c1.py -i 4k2.mp4 -o 4k2out.mp4 -roi 3400,350,400,400 -l 4 -size 1080,1920;or .json')
        return
    
    cap = cv2.VideoCapture(inname)

    if cap.isOpened():
        ret, frame = cap.read()
    else:
        print('can not open file:', sys.argv[1])
        return False
 
    frameH = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    frameW = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    numFrames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    
    #print(frameH,frameW,fps,numFrames)
   
    # 设定output 文件名,mp4 压缩格式。
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # 和原来一样fps，大小 宽1080，高1920
    #print('output file w/h=',ow,oh,outname)

	#print('outname=',outname)

    videoWriter =  cv2.VideoWriter(outname, fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write')
        #return
    
    f_cnt1 = f_cnt2 = 0 # 记录写了几帧
    c_cnt = max_cosin1 = max_cosin2 = 0
    IS_DETECTED1 = IS_DETECTED2 = False
    COMPARE_THRESHOLD1 = 2500
    COMPARE_THRESHOLD2 = 2500

    # 先读第一帧，设定ROI
    ret, frame = cap.read()
    
    # 保持对比区域 【DON】
    # ROI对比区域需要确定第一帧没有皮筏从出水口滑出！！！
    roi1_compare = frame[ey: ey + eh, ex: ex + ew]
    
    # 再读一帧
    ret, frame = cap.read()

    # 循环知道视频结束或者预设秒数
    while ret:
        c_cnt += 1 # 读了多少帧

        if not IS_DETECTED1 :
            roi1_image = frame[ey: ey + eh, ex: ex + ew]
            cosin1 = mse(roi1_image, roi1_compare)
            if cosin1 > COMPARE_THRESHOLD1:
            #    print('region 1  movement detected')
                if cosin1 > max_cosin1:
                    max_cosin1 = cosin1
                IS_DETECTED1 = True
                # 写出视频
                f_cnt2 = saveRegion1(cap,videoWriter,c_cnt, True) # slow speed
                if (float(oh)/ow > 1.7):
                     saveReverse(cap,videoWriter,c_cnt, f_cnt2) 
                f_cnt1 = saveRegion1(cap,videoWriter,c_cnt, False) # normal speed
                break
        
        ret, frame = cap.read()
       # DrawRect(frame, IS_DETECTED1)

    del frame   # 释放一刚使用的内存变量
    del roi1_compare
    del roi1_image
    del fourcc

    cv2.destroyAllWindows()
    cap.release()
    videoWriter.release()
    #print('total frame=', f_cnt1,  '  max=', max_cosin1)
 
if __name__ == "__main__":
    ret = main()
    sys.exit(ret)