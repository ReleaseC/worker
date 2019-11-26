cd ../../
pwd
mkdir output/0014
cd ./LandingPage/0014_bullet
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0014_bullet/dist/* ../output/0014/