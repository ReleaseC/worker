#!/usr/bin/python
#-*- coding: UTF-8 -*-
import picamera
import time
import sys
print sys.argv
with picamera.PiCamera() as camera:
    camera.resolution = (1280,720)
    camera.iso = 200
    camera.shutter_speed = 5000 # 相机快门速度
    '''camera.exposure_mode = 'off'
    g = camera.awb_gains
    camera.awb_mode = 'off'
    camera.awb_gains = g
    camera.saturation = 80 # 设置图像视频的饱和度
    camera.brightness = 50 # 设置图像的亮度(50表示白平衡的状态)
    
    camera.iso = 800 # ISO标准实际上就是来自胶片工业的标准称谓，ISO是衡量胶片对光线敏感程度的标准。如50 ISO, 64 ISO, 100 ISO表示在曝光感应速度上要比高数值的来得慢，高数值ISO是指超过200以上的标准，如200 ISO, 400 ISO
    camera.framrate = 32 #这里可能用的Fraction是一个分数模块来存储分数1/6，保证分数运算的精度(记得调用模块：from fractions import Fraction)
    camera.hflip = False # 是否进行水平翻转
    camera.vflip = False #是否进行垂直翻转
    camera.rotation = 0 #是否对图像进行旋转
    #camera.resolution = (280,160) #设置图像的width和height'''
    camera.start_preview()
    time.sleep(2)
    camera.start_recording('./video/'+sys.argv[1]+'_'+sys.argv[2]+'_'+sys.argv[3]+'_'+sys.argv[4]+'.h264',quality=24)
    camera.wait_recording(3)
    camera.stop_recording()