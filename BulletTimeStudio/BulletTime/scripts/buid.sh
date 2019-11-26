cd /project/bullettime/bullet_wechat
mkdir dist
mkdir dist/face
npm install
sudo npm install -g pm2
cd /project/bullettime/bullet_local_page
npm install
npm run build-prod
cd /project/bullettime
cp -r ./bullet_UI/dist/* ./server/dist/face/
cd /project/bullettime/bullet_wechat
if [pm2 start index.js]
then
    pm2 start index.js
else
    pm2 restart all
fi
