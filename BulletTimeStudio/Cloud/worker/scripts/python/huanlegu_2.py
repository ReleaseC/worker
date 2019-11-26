#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Thu Aug 22 09:38:31 2019

@author: pi
"""


import cv2
import numpy as np 
import time
import sys
import numpy
import random


# 激流涌进/飞舟冲浪，根据皮筏出现时间和位置剪辑
#  调用格式：
# python3 huanlegu_2.py 2_2.mp4 python2.mp4 2800 1300 300 300 2.5 1080 1920
#   调用格式：
#   python3 c1.py input.mp4 output.mp4
#       1550 800 300 300 <-- ROI 根据目前2048 1536 分辨率设定
#       2.2 <--- 原来视频秒数，最后视频长度会是5倍
#                 放慢3倍 + 倒车 + 溜下
#       1080 1920  <--- 生成视频宽高


DEBUG_FLAG = True # 完成后设定为 False ！！！！！【DON】
frameH=frameW=fps=numFrames=0.0
ex=ey=ew=eh=ow=oh=ex1=ey1=ew1=eh1=cnt=x=y=h1=w1=0
v_second = 0.0
gx = gy = gw = gh = 0
combine = jpg = 'abc'
c_t=0

#随机获取一个特效视频，并保存到Json文件中
def SaveCovideo():
    global combine
    
    i = random.randint(1,6)
    
    if i==1:
        combine='test1.mp4'
    elif i==2:
        combine='test2.mp4'
    elif i==3:
        combine='test3.mp4'
    elif i==4:
        combine='test4.mp4'
    elif i==5:
        combine='test5.mp4'
    elif i==6:
        combine='test6.mp4'

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
IS_ROTATE = False

#@profile
'''
    count: 到触发的帧数
    slow: True - 放慢速度 
          False - 正常速度
'''
'''
def saveRegion1(cap,videoWriter, count, slow):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh,x,y,h1,w1
    global v_second, fps
    global gx,gy,gw,gh, x_move, y_move
    global c_t
    global jpg
    
    cap.release()  # 要重新找到视频起点，先关闭在打开视频
    cap = cv2.VideoCapture(sys.argv[1]) 
    for i in range (0, count):  # 回到触发前一秒
        cap.grab()

    cnt =0
    read_more_frame = int(float(fps) * float(v_second) )
    #print('88888')

    if (int(frameH) == 2160):
	
        if(float(oh)/ow > 1.5):
	    #print('?????')
            h1 = 1000
            w1 = int(h1 * ow/ oh)
            if IS_ROTATE:
                x = int(frameW) - h1 - 50
                y = 1500
            else:
                x = 2500
                y = 800
            
            
        else:    
            #print('///////')
            h1 = 1600
            w1 = int(h1 * ow/ oh)
            if IS_ROTATE:
                x = int(frameW) - h1 - 50
                y = 1500
            else:
                x = 300
                y = 0
    else:
        print('unsupported: ', frameW,frameH)
 

    if int(fps) >=  49:
        #print('222222')
        if (float(oh/ow) > 1.5):
            y_move = 9
            x_move = 6
        else:
            y_move = 5
            x_move = 5
    else:
        print('44444')
        if (float(oh)/ow > 1.5):
            y_move = 3
            x_move = 3
        else:
            #print('44444')
            y_move = 2
            x_move = -4
    
    # print('x y move ', x_move, y_move, fps)
    
    print(slow)
    if slow:
        cap1 = cv2.VideoCapture('dddd.mp4')
    else:
        cap1 = cv2.VideoCapture('dddd.mp4')
       # print('c_t',c_t)
        for i in range (0, c_t):  # 回到触发前一秒
            cap1.grab()
            
    newfps = cap1.get(cv2.CAP_PROP_FPS)
    #print('newfps',newfps)

    for i in range (0,read_more_frame):
        ret1, frame1 = cap1.read()
        c_t+=1
        #print('ret1',ret1)
        ret2, frame2 = cap.read()
        if not ret2:
            print('视频读完了')
            break
        cnt += 1
            #print('**********')
        if not IS_ROTATE:
                #print('ttttttt')
                #print('y',y)
                #print(frameH - oh)
                if x>=0 and y<=int(frameH-oh):
                    x  = max(x-x_move,0) 
                    y = min(y+y_move,int(frameH-oh))
                w1 += 2
                h1 = int(w1 * oh / ow)
                img = frame2[y:y+h1, x:x+w1]
                img1 = np.rot90(img)
        else:
                if y>=0 and x>=0 and y<=frameH and x<=frameW:
                    y = max(0,y-y_move) 
                    x = max(0,x-x_move)
                h1 += 1
                w1 = int(h1 * ow / oh)
                #print('y',y)
                img = frame2[y:y+h1, x:x+w1]
                #img1 = np.rot90(img,-1)
                img1 = img

        # print(x,y, w1, h1, ow, oh)
        img2 = cv2.resize(img1, (ow, oh), cv2.INTER_LINEAR)

        final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)  
        if slow:
            if(i > int(read_more_frame/2)):
            	final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)  # 放慢3倍，同一画面写出3帧
            	final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)  
            #final_put = ComBine(videoWriter,ret1,frame1,ret2,img2) 
            #if (i==int(read_more_frame/2)):
		 
                #print(fps)
                #cv2.imwrite(jpg,final_put,[int(cv2.IMWRITE_JPEG_QUALITY),95])
                #for j in range (0, int(fps)):
                #     ComBine(videoWriter,ret1,frame1,ret2,img2)  
                
        
        DrawRect(img2, True)

        del img2
        del img1
        del img
        del frame2

    gx = x
    gy = y
    gw = w1
    gh = h1
    return cnt
    '''
def saveRegion1(cap,videoWriter, count, slow):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps
    global gx,gy,gw,gh, x_move, y_move
    global inname,outname,combine
    global ix,iy,iw,ih,isx,isy,isw,ish
   
    #print(frameH,frameW)
    cap.release()  # 要重新找到视频起点，先关闭在打开视频
    cap = cv2.VideoCapture(sys.argv[1]) 
    for i in range (0, count):  
        cap.grab()

    cnt =0
    read_more_frame = int(float(fps) * float(v_second))
    #w1 = int(frameW / 2)
    #h1 = int(w1 * oh / ow)
    #w1 = int(frameW / 4)
    w1 = 1000
    h1 = int(w1 * oh / ow)
    #x = 50
    #y = 0
    x = 2300
    y = 2000

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
        #w1 += 2
        #h1 = int(w1 * oh / ow)
        if (float(oh)/ow>1.5):
            if x< frameW-ow and x>0:
                #x+=27
                x = max(0,x-35)
            #print('y',y)
            if  y>0:
                #print('?????')
                    #y+=18
                y = max(0,y-12)
        else:
            if x< frameW-ow:
                #x+=27
                x+=2
                if y< frameH-oh:
                    #y+=18
                    y+=2
            
        # print(x,y, w1, h1)
      
        img = frame2[y:y+w1, x:x+h1]
        img1 = np.rot90(img)
        if (img1.shape[1]!=0):
            img2 = cv2.resize(img1, (ow, oh), cv2.INTER_LINEAR)

        final_put = ComBine(videoWriter,ret1,frame1,ret2,img2) 
            #final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)  # 放慢3倍，同一画面写出3帧
            #final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)
        #print('i',i)
        #print('read',read_more_frame)
        if slow:                           
            if (i==int(read_more_frame)-30):
                for j in range (0, int(fps)):
                    #print('1111')
                    final_put = ComBine(videoWriter,ret1,frame1,ret2,img2)
        DrawRect(img2, True)

        del img2
        del img
        del frame2
    gx = x
    gy = y
    gw = w1
    gh = h1
    return cnt


#图像叠加并保存格式为mp4
def ComBine(videoWriter,ret1,frame1,ret2,img2):
    global ow,oh,cnt,c_t
    
    lower_green = np.array([40, 50, 50])
    upper_green = np.array([90, 255, 255])
    
    t1 = int(time.time())  # 记录现在时间
    #while(True):       
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
                final_put = final_output
                
                t2 = int(time.time())
                if t2 > t1:
                    #print('fps=', cnt)
                    cnt = 0
                    t1 = t2
                else:
                    cnt += 1
            else:
                videoWriter.write(img2)
                final_put = img2
                t2 = int(time.time())
                if t2 > t1:
                    cnt = 0
                    t1 = t2
                else:
                    cnt += 1
            
    if cv2.waitKey(1) & 0xFF == ord('q'):
       return True
    return final_put
       

def seektoframe(cap,count):
    cap.release()  # 要重新找到视频起点，先关闭在打开视频
    cap = cv2.VideoCapture(sys.argv[1]) 
    for i in range (0,count):
        cap.grab()
    return cap

# 视频回放
def saveReverse(cap,videoWriter, count, total_frame):
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps
    global x_move, y_move
    global gx,gw,gx,gy

    #print('SaveReverse --front count', count, 'total frame', total_frame) 

    h1 = gh
    w1 = gw
    x = gx 
    y = gy
    #print(gx,gy,gw,gh)
    cnt = count + total_frame

    for i in range (0,total_frame):
        cap = seektoframe(cap,cnt)
        ret,frame = cap.read()
        if not ret:
            print('视频文件 read error')
            break
                
        # print(x,y, w1, h1)
        if not IS_ROTATE:
            x +=35
            y +=12            
            img = frame[y:y+w1, x:x+h1]
            img1 = np.rot90(img)
            
        else:
            x = x+x_move
            y = y+y_move            
            h1 -= 2
            w1 = int(h1 * ow / oh)
            img = frame[y:y+w1, x:x+h1]
            img1 = img     

        img2 = cv2.resize(img1, (ow, oh), cv2.INTER_LINEAR)
        
        if ( i % 2== 0):
            videoWriter.write(img2)  
            DrawRect(img2, True)



        del img2
        del img1
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

    cv2.namedWindow('name', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('name',800, int(800*frameH/frameW))
    cv2.imshow('name', frame)

    k = cv2.waitKey(1) & 0xff
    if k == 27 or k == 'q':
        return True

    return False

def JuByR(frame):
    # 红色 HSV ，根据实际阳光角度再调整！！！！！【DON】
    low = np.array([0, 70, 50])
    high = np.array([10, 250, 255])

    low1 = np.array([170, 70, 50])
    high1 = np.array([180, 250, 255])
   
    roi_img = frame[ey: ey + eh, ex: ex + ew]
    hsv = cv2.cvtColor(roi_img, cv2.COLOR_BGR2HSV)

    mask1 = cv2.inRange(hsv, low, high)
    mask2 = cv2.inRange(hsv, low1, high1)
    image_mask = mask1 | mask2

    cnt = cv2.countNonZero(image_mask)  # 计算多少红色点
    return cnt

#@profile
def main():
    global frameH, frameW, ex,ey,ew,eh, ex1,ey1,ew1,eh1, ow, oh
    global v_second, fps,jpg

    #  调用格式：
    #  python3 c1.py input.mp4 output.mp4
    #       3400 350 400 400 <-- 第一个ROI
    #       4 1080 1920
    #
    if (len(sys.argv) != 10):
        print('usage: ', sys.argv[0], 'infile.mp4, outfile.mp4, x1,y1,w1,h1，视频秒数,宽,高')
        print('python3 c1.py 4k2.mp4 4k2out.mp4 3400 350 400 400 4 1080 1920')
        return
    
    SaveCovideo()

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
    
    print('width =',frameW,' height= ',frameH,fps,numFrames)
   
    ex = int(sys.argv[3]) # 1000
    ey = int(sys.argv[4]) #600
    ew = int(sys.argv[5]) #500
    eh = int(sys.argv[6])  #600
    v_second = sys.argv[7]  #  结果视频秒数,可以有小数点，譬如1.2
    ow = int(sys.argv[8])  # 结果视频宽度
    oh = int(sys.argv[9])  # 结果视频高度
    #jpg = sys.argv[10]

    # 设定output 文件名,mp4 压缩格式。
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # 和原来一样fps，大小 宽1080，高1920
    #print('output file w/h=',ow,oh)
    
    videoWriter = cv2.VideoWriter(sys.argv[2], fourcc, fps, (ow, oh), True)
    if not videoWriter.isOpened():
        print('can not open output file to write')
        return
    
    f_cnt1 = f_cnt2 = 0 # 记录写了几帧
    c_cnt = max_cosin1 = max_cosin2 = 0
    IS_DETECTED1 = IS_DETECTED2 = False
    COMPARE_THRESHOLD1 = 7000
    COMPARE_THRESHOLD2 = 4000

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
            cosin2 = mse(roi1_image, roi1_compare)
            print('cosin2',cosin2)
            
            cosin1 = JuByR(frame)
            print('cosin1',cosin1)
            if cosin1 > COMPARE_THRESHOLD1 and cosin2 > COMPARE_THRESHOLD2:
                #print('region 1  movement detected',c_cnt,cosin1)
                if cosin1 > max_cosin1:
                    max_cosin1 = cosin1
                IS_DETECTED1 = True
                # 写出视频
                f_cnt2 = saveRegion1(cap,videoWriter,c_cnt, True) # slow speed
                if (float(oh)/ow > 1.7):
                    saveReverse(cap,videoWriter,c_cnt, f_cnt2) 
                    f_cnt1 = saveRegion1(cap,videoWriter,c_cnt, False) # normal speed
                    print() 
                break
        
        ret, frame = cap.read()
        DrawRect(frame, IS_DETECTED1)

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
