from aip import AipBodyAnalysis
import requests
import urllib3
import base64
import numpy as np
import cv2
import sys
import base64
import io
from PIL import Image

#python3 BaiduAi.py input.jpg output.png mask.png


APP_ID = '15960310'
API_KEY = 'UOyXTTrfVjtu5vRoIR0fIUjX'
SECRET_KEY = 'xb7jxiBlcnuzHyWHHYUL6nq03ZjPQ3UP'

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

client = AipBodyAnalysis(APP_ID, API_KEY, SECRET_KEY)


def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()


def main():
    if (len(sys.argv) != 4):
        print('usage: ', sys.argv[0], 'outfile.jpg, output.png,mask.png')
        return

    image = get_file_content(sys.argv[1])

    #调用人像分割
    client.bodySeg(image)

    #如果有可选参数
    options = {}
    #options["type"] = "foreground"

    #带参数调用人像分割 
    result = client.bodySeg(image, options)
    # print('result',result)
    img_b64decode1 = base64.b64decode(result['foreground'])  # base64解码
    img_b64decode2 = base64.b64decode(result['scoremap'])  # base64解码
    with open(sys.argv[2],'wb') as f:
	     f.write(img_b64decode1)
    with open(sys.argv[3],'wb') as f:
	     f.write(img_b64decode2)
    return
 


if __name__ == "__main__":
    main()
    sys.exit()







