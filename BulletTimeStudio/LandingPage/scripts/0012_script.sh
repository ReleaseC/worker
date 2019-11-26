cd ../../
pwd
mkdir output/0012
cd ./LandingPage/0012_bullet
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0012_bullet/dist/* ../output/0012/