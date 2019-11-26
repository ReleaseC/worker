cd ../../
pwd
mkdir output/trade
cd ./LandingPage/trade
pwd
npm install
npm run build:prod
cd ..
pwd
cp -r trade/dist/* ../output/trade/