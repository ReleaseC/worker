#!/bin/bash

cd /data/BulletTimeStudio/Cloud/server/scripts

./update_code.sh
./update_api_doc.sh
./reploy_front.sh
./reploy_server.sh


exit 0
