Projects for Bullet Time

Studio/dashboard: the interface for image correction and record video
BulletTime/bullet_localserver: the server which do task
YIAgent: control Yi camera

SOCKET_EVENTS.EVENT_ECHO
SOCKET_EVENTS.EVENT_REGISTER:
    YIAgent向bullet_localserver註冊有多少台相機 (YIAgent -> bullet_localserver)
SOCKET_EVENTS.EVENT_PREVIEW:
    下Preview指令 (dashboard -> bullet_localserver -> YIAgent)
SOCKET_EVENTS.EVENT_CAMERA_COMMAND
    下開始拍攝指令 (dashboard -> bullet_localserver -> YIAgent)
SOCKET_EVENTS.EVENT_ADJUST_PREVIEW_COUNT
    詢問有多少張待做角度校正照片 (dashboard -> bullet_localserver)
SOCKET_EVENTS.EVENT_ADJUST_PREVIEW
    執行角度校正 (dashboard -> bullet_localserver)

CAMERA_DEVICES.CAM_NUMBER_OF_DEVICES
    回報有多少台相機 (bullet_localserver -> dashboard)
CAMERA_DEVICES.CAM_NUMBER_OF_ADJUST_DEVICES
    回報有多少張待做角度校正照片 (bullet_localserver -> dashboard)
CAMERA_DEVICES.CAM_PREVIEW_PIC
    回傳preview照片 (YIAgent -> bullet_localserver -> dashboard)
CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC
    回傳adjust preview照片(bullet_localserver -> dashboard)

There are some steps for doing image correction and record the bullet time video:
step 0: find out the number of cameras for preview and adjust 先找出有幾台相機
    camera for preview: 
        YIAgent透過SOCKET_EVENTS.EVENT_REGISTER向bullet_localserver註冊有多少台相機
        YIAgent start -> SOCKET_EVENTS.EVENT_REGISTER -> bullet_localserver
        bullet_localserver透過CAMERA_DEVICES.CAM_NUMBER_OF_DEVICES回報給dashboard
        bullet_localserver -> CAMERA_DEVICES.CAM_NUMBER_OF_DEVICES -> dashboard
    camera for adjust preview:
        dashboard透過SOCKET_EVENTS.EVENT_ADJUST_PREVIEW_COUNT詢問有多少張待做角度校正的照片
        dashboard -> SOCKET_EVENTS.EVENT_ADJUST_PREVIEW_COUNT -> bullet_localserver
        bullet_localserver透過CAMERA_DEVICES.CAM_NUMBER_OF_ADJUST_DEVICES回報給dashboard
        bullet_localserver -> CAMERA_DEVICES.CAM_NUMBER_OF_ADJUST_DEVICES -> dashboard

step 1: Preview Correction 拍攝preview照片
    下command給YIAgent拍照:
        dashboard -> SOCKET_EVENTS.EVENT_PREVIEW -> bullet_localserver
        bullet_localserver -> SOCKET_EVENTS.EVENT_PREVIEW -> YIAgent
    將拍攝結果回傳給dashboard:
        YIAgent -> CAMERA_DEVICES.CAM_PREVIEW_PIC -> bullet_localserver
        bullet_localserver -> CAMERA_DEVICES.CAM_PREVIEW_PIC -> dashboard

step 2: Find 4 dots
    dashboard透過SOCKET_EVENTS.EVENT_ADJUST_PREVIEW呼叫servre做4點校正(calibration參數為0)
    dashboard -> SOCKET_EVENTS.EVENT_ADJUST_PREVIEW -> bullet_localserver
        calibration = 0
        do adjust_color.py
        do adjust_points.py
    bullet_localserver透過CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC回報給dashboard
    bullet_localserver -> CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC -> dashboard

step 3: Rectangle Correction
    dashboard透過SOCKET_EVENTS.EVENT_ADJUST_PREVIEW呼叫servre做矩形校正(calibration參數為1)
    dashboard -> SOCKET_EVENTS.EVENT_ADJUST_PREVIEW -> bullet_localserver
        calibration = 1
        do adjust_color.py
        do adjust_points.py
    bullet_localserver透過CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC回報給dashboard
    bullet_localserver -> CAMERA_DEVICES.CAM_ADJUST_PREVIEW_PIC -> dashboard

step 4: Recording
    1. need revise locaion and site in bullet_localserver/src/modules/common/env.component.ts
    每一個拍攝點先要在env.component.ts填寫location和site, 用以紀錄拍攝所在地
    2. local page need carring userId
    拍攝時需要帶userId參數
    3. local page should ask SOCKET_EVENTS.EVENT_IS_CAMERA_FREE first
    每一次拍攝會新增一組uniqle Id

    dashboard透過SOCKET_EVENTS.EVENT_ADJUST_PREVIEW呼叫servre開始拍攝
    dashboard -> SOCKET_EVENTS.EVENT_IS_CAMERA_FREE -> bullet_localserver
    if !isCameraFree:
        先確認是否有任務處理中, 有的話不能進行拍攝, 並透過SOCKET_EVENTS.EVENT_ERROR_COMMAND回傳
        bullet_localserver -> SOCKET_EVENTS.EVENT_ERROR_COMMAND -> dashboard
    if no userId:
        再確認是否有帶userId, 沒有的話不能進行拍攝, 並透過SOCKET_EVENTS.EVENT_ERROR_COMMAND回傳
        bullet_localserver -> SOCKET_EVENTS.EVENT_ERROR_COMMAND -> dashboard
    else:
        bullet_localserver透過SOCKET_EVENTS.EVENT_CAMERA_COMMAND通知YIAgent開始拍攝
        bullet_localserver -> SOCKET_EVENTS.EVENT_CAMERA_COMMAND -> YIAgent
        YIAgent透過bullet_localserver回傳錄影檔
        YIAgent -> CAMERA_DEVICES.CAM_VIDEO_CUT_RESULT -> bullet_localserver
