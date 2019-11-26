cd ../../
pwd
mkdir output/0011
cd ./BulletTime/bullet_WA_UI
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r bullet_WA_UI/dist/* ../output/0011/
