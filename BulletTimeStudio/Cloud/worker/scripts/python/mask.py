import cv2
from PIL import Image
import numpy as np
import sys
import os
import requests
import time

import imghdr
################python3 input.jpg mask.png output.png
def reverAndadd():
    if (len(sys.argv) != 6):
        print('usage: ', sys.argv[0], 'input.jpg, mask.png,outpunt.png,taskid')
        return
    mask1 = cv2.imread(sys.argv[2])
    mask2 = cv2.bitwise_not(mask1)
    cv2.imwrite('out.png',mask2)
    masktu = "out.png"

	#使用opencv叠加图片
    img1 = cv2.imread(sys.argv[1])
    img2 = cv2.imread(masktu)

    alpha = 0.5
    meta = 1 - alpha
    gamma = 0
    image = cv2.add(img1, img2)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    cv2.imwrite("mask.png",image)

def transPNG(srcImageName,dstImageName):
    img = Image.open(srcImageName)
    img = img.convert("RGBA")
    datas = img.getdata()
    newData = list()
    for item in datas:
        if item[0] >220 and item[1] > 220 and item[2] > 220:
            newData.append(( 255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(dstImageName,"PNG") 

def crop_person(srcImageName,dstImageName):
    image = cv2.imread(srcImageName)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gradX = cv2.Sobel(gray, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
    gradY = cv2.Sobel(gray, ddepth=cv2.CV_32F, dx=0, dy=1, ksize=-1)
    gradient = cv2.subtract(gradX, gradY)
    gradient = cv2.convertScaleAbs(gradient)
    blurred = cv2.blur(gradient, (9, 9))
    (_, thresh) = cv2.threshold(blurred, 90, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 25))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    closed = cv2.erode(closed, None, iterations=4)
    closed = cv2.dilate(closed, None, iterations=4)
    (cnts, _) = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = sorted(cnts, key=cv2.contourArea, reverse=True)[0]
    rect = cv2.minAreaRect(c)
    box = np.int0(cv2.boxPoints(rect))
    Xs = [i[0] for i in box]
    Ys = [i[1] for i in box]
    x1 = min(Xs)
    x2 = max(Xs)
    y1 = min(Ys)
    y2 = max(Ys)
    if y1 < 0:
        y1 = 0
    hight = y2 - y1
    width = x2 - x1
    cropImg = image[y1:y1+hight, x1:x1+width]  
    cv2.imwrite("test.png",cropImg)

if __name__ == '__main__':
        reverAndadd()
        crop_person("mask.png",sys.argv[3])
        if(imghdr.what('test.png') == 'png'):
            print('存在人像')
            # transPNG("mask.png",sys.argv[5])
            transPNG("test.png",sys.argv[3])
            os.remove('out.png') 
            os.remove('mask.png') 
            os.remove('test.png') 
        else:
            print('没有检测到人像')
            t = time.time()
            timestamp = int(round(t * 1000))
            r=requests.get("https://iva.siiva.com/task/period_time?taskId="+sys.argv[4]+"&time="+str(timestamp)+"&period=NO_Person")
            os.remove('out.png') 
            os.remove('mask.png') 
        
