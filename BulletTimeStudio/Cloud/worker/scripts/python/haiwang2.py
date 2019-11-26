#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Mon Aug 26 17:24:11 2019

@author: pi
"""

import cv2
import numpy as np 
import time
import sys
import numpy
import json
import os

#横店二机位视频处理

# 海王飞船，根据皮筏出现时间和位置剪辑
#  调用格式：
# python c1.py slide3.mp4 out3.mp4 200 200 500 600 2.0  1080 1920
#   调用格式：
#   python3 c1.py input.mp4 output.mp4
#       200 200 500 600 <-- ROI 根据目前2048 1536 分辨率设定
#       2.0 <--- 原来视频秒数，最后视频长度会是5倍
#                 放慢2倍 + 倒车 + 溜下
#       1080 1920  <--- 生成视频宽高

DEBUG_FLAG = True # 完成后设定为 False ！！！！！【DON】
frameH=frameW=fps=numFrames=0.0
ex=ey=ew=eh=ow=oh=ex1=ey1=ew1=eh1=cnt=gx=gy=gw=gh=t=0
v_second = 0.0
gx = gy = gw = gh = 0
inname=outname=combine=jpg='abc'

tfile1 = 't1.mp4'
tfile2 = 't2.mp4'

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

def saveRegion1(cap):
    global frameH, frameW, ex, ey, ew, eh, ex1, ey1, ew1, eh1, ow, oh,gx,gy,gw,gh
    global fps, v_second, fourcc,t

    # 先写到一个文件
    videoWriter = cv2.VideoWriter(tfile1, fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write', tfile1)
        return
            
    width = ow
    height = int(width * oh / ow)
    t = 0
    y = 0
    x = 50
    read_more_frame = int(v_second * fps)
    f_cnt = 0  # 记录写了几帧画面
    ret, frame = cap.read()
   
    print('in saveRegion1', fps, v_second, read_more_frame)
    for i in range(0, read_more_frame):
      
        t += 1
        img = frame[y:y+height, x:x+width]
        img1 = cv2.resize(img, (ow, oh), cv2.INTER_LINEAR)
        err = videoWriter.write(img1)
        #if f_cnt < fps * 2:
        #    videoWriter.write(img1)
            #videoWriter.write(img1)
        x = min(x+12,frameH)
        y = min(y+7,frameW)

        f_cnt += 1

        DrawRect(img1, True, False)
      
        
        if not ret: 
            if f_cnt < read_more_frame:
                k = read_more_frame - f_cnt
                for i in range (0, k):
                    videoWriter.write(img1)
                    print(f_cnt,fps)
                    if f_cnt < fps * 2:
                        videoWriter.write(img1)
                        #videoWriter.write(img1)
                    f_cnt += 1
            break
        
    
        ret, frame = cap.read()
    gx = x
    gy = y
    gw = width
    gh = height

    del img1
    del img
    del frame
    videoWriter.release()
    return f_cnt
  
def saveRegion2(cap,count,total_frame):
    global frameH, frameW, ex, ey, ew, eh, ex1, ey1, ew1, eh1, ow, oh
    global fps, v_second, fourcc
    
    print('total_frame',total_frame)

    # 先写到一个文件
    videoWriter = cv2.VideoWriter(tfile2, fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write', tfile2)
        return

    # print('SaveReverse --front count', count, 'total frame', total_frame)
    cnt = total_frame 
    read_more_frame = int(float(fps) * float(v_second))
    h1 = gh
    w1 = gw
    x = gx  
    y = gy
    #print(gx,gy,gw,gh)

    delta = max(0,count) # 触发前一秒开始采集
    print('cnt',cnt)
    for i in range (0,read_more_frame):
        cap = seektoframe(cap,cnt+delta)
        ret,frame = cap.read()
        if not ret:
            print('视频文件 read error')
            break
                
        # print(x,y, w1, h1)
        img = frame[y:y+h1, x:x+w1]
        img2 = cv2.resize(img, (ow, oh), cv2.INTER_LINEAR)
        
        '''
        cv2.namedWindow("img",0);
        cv2.resizeWindow("img", 540,640);

        cv2.imshow('img',img2)
        '''
        videoWriter.write(img2)
        videoWriter.write(img2)
        DrawRect(img2,True,False)
        x-=12
        y-=7

        del img2
        del img
        del frame
        cnt -= 1
        if cnt < 0:
            break

    return cnt
  
def saveRegion3(cap,videoWriter, count, slow):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps
    global gx,gy,gw,gh, x_move, y_move
    global inname,outname,combine
   
    print('.......')
    #print(frameH,frameW)
    cap.release()  # 要重新找到视频起点，先关闭在打开视频
    cap = cv2.VideoCapture(sys.argv[1]) 
    for i in range (0, count+int(fps)):  # 回到触发前一秒
        cap.grab()

    cnt =0
    read_more_frame = int(float(fps) * float(v_second) )
    #w1 = int(frameW / 2)
    #h1 = int(w1 * oh / ow)
    w1 = int(frameW / 4)
    h1 = int(w1 * 1920 / 1080)
    x = 50
    y = 0

    #if (float(oh)/ow > 1.5):
    #    y_move = 10
    #    x_move = 23
    #else: 
    #    y_move = 18
    #    x_move = 25
        
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
       
    #    if x<=int(frameW) and y<=int(frameH):
           
    #        x = max(x+x_move,0)
           
        
    #        if (float(oh)/ow > 1.5):
            
    #            y = min(y+y_move,int(oh-frameH))
    #        else:
    #            y=  min(y+y_move,int(frameH-oh))
        
      
        #w1 += 2
        #h1 = int(w1 * 1920/1080)
        if x+w1<frameW:
            x+=27
        
        if y+h1<frameH:
            y+=18
        '''
        else:
            if x< frameW-ow:
                x+=27
                if y< frameH-oh:
                    y+=18
        '''   
        # print(x,y, w1, h1)
        img = frame2[y:y+h1, x:x+w1]
        img2 = cv2.resize(img, (1080, 1920), cv2.INTER_LINEAR)

        final_put = ComBine(videoWriter,ret1,frame1,ret2,img2) 
                                        
        DrawRect(frame2, True,True)

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
    cap = cv2.VideoCapture(sys.argv[1]) 
    for i in range (0,count):
        cap.grab()
    return cap

def DrawRect(frame, IS_DETECTED1, IS_DETECTED2):
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
    cv2.resizeWindow('name', 500, int(500*frameH/frameW))
    cv2.imshow('name', frame)

    k = cv2.waitKey(1) & 0xff
    if k == 27 or k == 'q':
        exit(1)

    return False

def three_in_one(cap,count):
    global fps, v_second, fourcc
    global frame_cnt_1, frame_cnt_2
    global oh, ow

    frame_to_write = int(fps * v_second)
    cap = cv2.VideoCapture(sys.argv[1])
    fourcc1 = cv2.VideoWriter_fourcc(*'mp4v')
    fourcc2 = cv2.VideoWriter_fourcc(*'mp4v')
    videoWriter2 = cv2.VideoWriter('b.mp4', fourcc2, fps, (1080, 1920), True)
    videoWriter = cv2.VideoWriter('a.mp4', fourcc1, fps, (1080, 1920), True)
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
 
    ret,frame = cap.read()
    if ret:
        img1 = frame[0:960, 0:540]
        img2 = cv2.resize(img1, (1080, 1920), cv2.INTER_LINEAR)
        img3 = frame[0:960, 0:540]
        img4 = cv2.resize(img3, (1080, 1920), cv2.INTER_LINEAR)
    else :
        print('....')
    print(img2.shape)
    ret1, frame1 = cap1.read()
    ret2, frame2 = cap2.read()
    c = 0
    while True:
        if ret1:
            c += 1
            img2[0:640, 0:1080] = frame1
            img2[640:1280,0:1080] = frame1
            img2[1280:1920,0:1080] = frame1
            img2 = cv2.resize(img2, (1080, 1920), cv2.INTER_LINEAR)
            err1= videoWriter.write(img2)
            DrawRect(img2,True,True)       
        ret1, frame1 = cap1.read()
        if not ret1:
            break
    videoWriter.release()
    
    cap3 = cv2.VideoCapture('a.mp4')
    ret3,frame3 = cap3.read()  
    '''
        if ret3:
            #print('****')
            err3 = videoWriter2.write(frame3)
        ret3,frame3 = cap3.read()
        if not ret3:
        
            while True:
                if ret2:
                    img4[0:640, 0:1080] = frame2
                    img4[640:1280, 0:1080] = frame2
                    img4[1280:1920,0:1080] = frame2
                    img5 = cv2.resize(img4, (1080, 1920), cv2.INTER_LINEAR)
                    err4 = videoWriter2.write(img5)
                if not ret2:
                    return
                ret2,frame2 = cap2.read()
    '''
    while True:
        if ret2:
            img4[0:640, 0:1080] = frame2
            img4[640:1280, 0:1080] = frame2
            img4[1280:1920,0:1080] = frame2
            img5 = cv2.resize(img4, (1080, 1920), cv2.INTER_LINEAR)
            err4 = videoWriter2.write(img5)
        if not ret2:
            break
        ret2,frame2 = cap2.read()
    while True:
        if ret3:
            #print('****')
            err3 = videoWriter2.write(frame3)
        if not ret3:
            break
        ret3,frame3 = cap3.read()
    
    #saveRegion3(cap,videoWriter2, count, True)
    videoWriter2.release()
    #cap.release()
    if cap1:
        cap1.release()
    if cap2:
        cap2.release()
    del fourcc1
    del fourcc2
    del frame
    del img1
    return

def TwoInone():
    fourcc3 = cv2.VideoWriter_fourcc(*'mp4v')
    videoWriter3 = cv2.VideoWriter(sys.argv[2], fourcc3, fps, (1080, 1920), True)
    if not videoWriter3.isOpened():
        print('can not open output file to write')
        return
    if os.path.exists('b.mp4'):
        cap1 = cv2.VideoCapture('b.mp4')
    else:
        cap1 = None

    if os.path.exists('z.mp4'):
        cap2 = cv2.VideoCapture('z.mp4')
    else:
        cap2 = None
    
    ret1, frame1 = cap1.read()
    ret2, frame2 = cap2.read()
    '''
        if ret1:
            #print('****')
            videoWriter3.write(frame1)
        ret1,frame1 = cap1.read()
        if not ret1:
            while True:
                if ret2:
                    videoWriter3.write(frame2)
                if not ret2:
                    return
                ret2,frame2 = cap2.read()
    '''
        
    while ret2:
            #print('****')
        videoWriter3.write(frame2)
        ret2,frame2 = cap2.read()
    if not ret2:
        while ret1:
            videoWriter3.write(frame1)
            ret1,frame1 = cap1.read()
                
    videoWriter3.release()
   
    if cap1:
        cap1.release()
    if cap2:
        cap2.release()
    del fourcc3
    del frame1
    del frame2
    return
    
      
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
                videoWriter.write(final_output)
                return final_output
                
                t2 = int(time.time())
                if t2 > t1:
                   # print('fps=', cnt)
                    cnt = 0
                    t1 = t2
                else:
                    cnt += 1
            else:
                '''
                cv2.namedWindow("img",0);
                cv2.resizeWindow("img", 540,640);

                cv2.imshow('img',img2)
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
    global v_second, fps,fourcc
    global inname,outname
    global frame_cnt_1,frame_cnt_2,t

    #  调用格式：
    #  python3 c1.py input.mp4 output.mp4
    #       3400 350 400 400 <-- 第一个ROI
    #       4 1080 1920
    #
    if (len(sys.argv) != 14):
        print('usage: ', sys.argv[0], 'infile.mp4, outfile.mp4, x1,y1,w1,h1，视频秒数,宽,高;or .json')
        print('python3 c1.py -i 4k2.mp4 -o 4k2out.mp4 -roi 3400,350,400,400 -l 4 -size 1080,1920;or .json')
        return
    
    cap = cv2.VideoCapture(sys.argv[1])

    if cap.isOpened():
        ret, frame = cap.read()
    else:
        print('can not open file:', sys.argv[1])
        return False
    
    ex = int(sys.argv[3]) # 1000
    ey = int(sys.argv[4]) #600
    ew = int(sys.argv[5]) #500
    eh = int(sys.argv[6])  #600
    v_second = float(sys.argv[7])  #  结果视频秒数
    ow = int(sys.argv[8])  # 结果视频宽度
    oh = int(sys.argv[9])  # 结果视频高度
    ex1 = int(sys.argv[10])
    ey1 = int(sys.argv[11])
    ew1 = int(sys.argv[12])
    eh1 = int(sys.argv[13])
    
    if os.path.exists(tfile1):  # 先清理缓存文件
        os.remove(tfile1)
    if os.path.exists(tfile2):
        os.remove(tfile2)
    if os.path.exists('a.mp4'):
        os.remove('a.mp4')
    if os.path.exists('b.mp4'):
        os.remove('b.mp4')
    if os.path.exists('z.mp4'):
        os.remove('z.mp4')
     
    frameH = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    frameW = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    numFrames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    
    print(frameW,frameH,fps,numFrames)
   
    # 设定output 文件名,mp4 压缩格式。
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # 和原来一样fps，大小 宽1080，高1920
    #print('output file w/h=',ow,oh,outname)

	#print('outname=',outname)
   
    videoWriter =  cv2.VideoWriter('z.mp4', fourcc, fps, (1080,1920), True)
    
    if not videoWriter.isOpened():
        print('can not open output file to write')
        #return
    
    f_cnt1 = f_cnt2 = 0 # 记录写了几帧
    c_cnt = max_cosin1 = max_cosin2 = 0
    IS_DETECTED1 = IS_DETECTED2 = IS_DETECTED3 = False
    COMPARE_THRESHOLD1 = 2500
    COMPARE_THRESHOLD2 = 10000

    # 先读第一帧，设定ROI
    ret, frame = cap.read()
    
    # 保持对比区域 【DON】
    # ROI对比区域需要确定第一帧没有皮筏从出水口滑出！！！
    roi1_compare = frame[ey: ey + eh, ex: ex + ew]
    roi2_compare = frame[ey1: ey1 + eh1, ex1: ex1 + ew1]
    
    # 再读一帧
    ret, frame = cap.read()
 
    frame_cnt_1 = frame_cnt_2 = 0  # 全局变量，记录触发帧
    
    # 循环知道视频结束或者预设秒数
    w = frameW
    h = int(w * 1920 / 1080)
    while ret:
        c_cnt += 1
        # print(c_cnt)
        
            
        if not IS_DETECTED1:
            
            roi1_image = frame[ey: ey + eh, ex: ex + ew]

            cosin1 = mse(roi1_image, roi1_compare)
            #print('cosin1',cosin1)
            
            if cosin1 > COMPARE_THRESHOLD1:
                print('region 1  movement detected', cosin1)
                if cosin1 > max_cosin1:
                    max_cosin1 = cosin1
                IS_DETECTED1 = True
                
                frame_cnt_1 = c_cnt
               
                f_cnt1 = saveRegion1(cap)
                
                #saveRegion3(cap1,videoWriter,frame_cnt_1, True)
    
        if not IS_DETECTED2:
            roi2_image = frame[ey1: ey1 + eh1, ex1: ex1 + ew1]
            cosin2 = mse(roi2_image, roi2_compare)
            #print('region 2 ',cosin2)
            if cosin2 > COMPARE_THRESHOLD2:
                print('region 2  movement detected', cosin2)
                #print('t',t)
                #print('f_cnt1',f_cnt1)
                if cosin2 > max_cosin2:
                    max_cosin2 = cosin2
                IS_DETECTED2 = True
                frame_cnt_2 = c_cnt + f_cnt1
                f_cnt2 = saveRegion2(cap,c_cnt,f_cnt1)
               
        DrawRect(frame, IS_DETECTED1,IS_DETECTED2)
        ret, frame = cap.read()
        #del img
    saveRegion3(cap,videoWriter,frame_cnt_1, True)
    del frame   # 释放一刚使用的内存变量
    del roi1_compare
    #del roi1_image
  

    cv2.destroyAllWindows()
    cap.release()
    videoWriter.release()
    #videoWriter4.release()
    three_in_one(cap,frame_cnt_1)  # 把文件合为一个
    
    TwoInone()
   
    del fourcc
    
    if os.path.exists(tfile1):  # 先清理缓存文件
        os.remove(tfile1)
    if os.path.exists(tfile2):
        os.remove(tfile2)
    if os.path.exists('a.mp4'):
        os.remove('a.mp4')
    if os.path.exists('b.mp4'):
        os.remove('b.mp4')
    if os.path.exists('z.mp4'):
        os.remove('z.mp4')
    videoWriter.release()
    #print('total frame=', f_cnt1,  '  max=', max_cosin1)
    
if __name__ == "__main__":
    ret = main()
    sys.exit(ret)
