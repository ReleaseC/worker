cd ../../
pwd
mkdir output/SiivaPage
cd ./LandingPage/SiivaPage
pwd
npm install
npm run build:prod
cd ..
pwd
cp -r SiivaPage/dist/* ../output/SiivaPage/