cd ../../
pwd
mkdir output/0002
cd ./LandingPage/0002_bullet
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0002_bullet/dist/* ../output/0002/