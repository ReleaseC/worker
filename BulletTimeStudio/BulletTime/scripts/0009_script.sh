cd ../../
pwd
mkdir output/0009
cd ./BulletTime/bullet_DL_UI
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r bullet_DL_UI/dist/* ../output/0009/
