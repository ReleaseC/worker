#!/usr/bin/expect
#
set account "vingeray"
set password "zxc/*-123"
set timeout 500
 
spawn sudo cd /data/BulletTimeStudio/Cloud/server
expect "password for ubuntu:"
send "siiva0901"

spawn git reset --hard

spawn git pull

expect "Username for 'https://gitlab.com':"
send "$account\n"

expect "Password for 'https://vingeray@gitlab.com':"
send "$password\n"

interact
