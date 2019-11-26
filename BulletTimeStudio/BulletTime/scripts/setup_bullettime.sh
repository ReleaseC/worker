cd ../../Cloud/server
npm install
cd ../../
rm -r -f output
mkdir output
mkdir output/0004
cd ./BulletTime/bullet_UI
npm install
npm run build-prod
cd ..
cp -r bullet_UI/dist/* ../output/0004/

cd ../
mkdir output/0005
cd ./BulletTime/bullet_JD_UI
npm install
npm run build-prod
cd ..
pwd
cp -r bullet_JD_UI/dist/* ../output/0005/

cd ../
mkdir output/0006
cd ./BulletTime/run_JD_UI
npm install
npm run build-prod
cd ..
cp -r run_JD_UI/dist/* ../output/0006/

cd ../
mkdir output/0007
cd ./BulletTime/bullet_WS_UI
npm install
npm run build-prod
cd ..
cp -r bullet_WS_UI/dist/* ../output/0007/

cd ../
mkdir output/0008
cd ./BulletTime/run_WS_UI
npm install
npm run build-prod
cd ..
cp -r run_WS_UI/dist/* ../output/0008/


cd ../
mkdir output/0009
cd ./BulletTime/bullet_DL_UI
npm install
npm run build-prod
cd ..
cp -r bullet_DL_UI/dist/* ../output/0009/

cd ../
mkdir output/0010
cd ./BulletTime/run_DL_UI
npm install
npm run build-prod
cd ..
cp -r run_DL_UI/dist/* ../output/0010/
