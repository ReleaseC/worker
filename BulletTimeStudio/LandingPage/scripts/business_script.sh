cd ../../
pwd
mkdir output/business
cd ./LandingPage/business
pwd
npm install
npm run build:prod
cd ..
pwd
cp -r business/dist/* ../output/business/