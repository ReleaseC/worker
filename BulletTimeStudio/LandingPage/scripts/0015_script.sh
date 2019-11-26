cd ../../
pwd
mkdir output/0015
cd ./LandingPage/0015_run
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0015_run/dist/* ../output/0015/