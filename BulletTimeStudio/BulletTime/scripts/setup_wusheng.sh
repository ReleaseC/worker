
cd ../../
mkdir output
mkdir output/0011
cd ./BulletTime/bullet_WA_UI
npm install
npm run build-prod
cd ..
cp -r bullet_WA_UI/dist/* ../output/0011/

