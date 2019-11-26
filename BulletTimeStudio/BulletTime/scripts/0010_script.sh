cd ../../
pwd
mkdir output/0010
cd ./BulletTime/run_DL_UI
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r run_DL_UI/dist/* ../output/0010/
