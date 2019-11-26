#!/usr/bin/python
#-*- coding: UTF-8 -*
import picamera
with picamera.PiCamera() as camera:
	camera.resolution = (1920,1080)
	camera.start_preview()
	camera.capture('preview.jpg')

