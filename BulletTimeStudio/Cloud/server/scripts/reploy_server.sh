#!/usr/bin/expect

spawn pm2 restart cloud_server
spawn pm2 logs


interact
