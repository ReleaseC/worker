cd ../../
pwd
mkdir output/0013
cd ./LandingPage/0013_bullet
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0013_bullet/dist/* ../output/0013/