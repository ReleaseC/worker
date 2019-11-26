cd ../../
mkdir output/0005
cd ./LandingPage/0005_bullet
npm install
npm run build-prod
cd ..
pwd
cp -r 0005_bullet/dist/* ../output/0005/

cd ../
mkdir output/0006
cd ./LandingPage/0006_run
npm install
npm run build-prod
cd ..
cp -r 0006_run/dist/* ../output/0006/

cd ../
mkdir output/0007
cd ./LandingPage/0007_bullet
npm install
npm run build-prod
cd ..
cp -r 0007_bullet/dist/* ../output/0007/

cd ../
mkdir output/0008
cd ./LandingPage/0008_run
npm install
npm run build-prod
cd ..
cp -r 0008_run/dist/* ../output/0008/


cd ../
mkdir output/0009
cd ./LandingPage/0009_bullet
npm install
npm run build-prod
cd ..
cp -r 0009_bullet/dist/* ../output/0009/

cd ../
mkdir output/0010
cd ./LandingPage/0010_run
npm install
npm run build-prod
cd ..
cp -r 0010_run/dist/* ../output/0010/