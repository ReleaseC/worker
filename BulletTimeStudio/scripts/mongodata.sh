#mongodump命令路径 
DUMP=/usr/bin/mongodump 
#临时备份目录 
OUT_DIR=/data/BulletTimeStudio/data 
#备份存放路径 
TAR_DIR=/data/BulletTimeStudio/data 
#获取当前系统时间 
DATE=`date +%Y_%m_%d` 
#最终保存的数据库备份文件 
TAR_BAK="mongodb_bak_$DATE.tar.gz" 
TAR_BAK1="mongodb_bak_$DATE.zip"
cd $OUT_DIR 
mkdir -p $OUT_DIR/$DATE 

$DUMP -h localhost:27017 -d bt_prod -o $OUT_DIR/$DATE 
 
$DUMP -h localhost:27017 -d bt_prod -o $OUT_DIR/$DATE 
 
tar -zcvP -f $TAR_DIR/$TAR_BAK $OUT_DIR/$DATE 
tar -zcvP -f $TAR_DIR/$TAR_BAK1 $OUT_DIR/$DATE

 
exit