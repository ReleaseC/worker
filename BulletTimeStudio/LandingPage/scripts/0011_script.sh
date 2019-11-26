cd ../
mkdir output/0011
cd ./LandingPage/0011_bullet
npm install
npm run build-prod
cd ..
cp -r 0011_bullet/dist/* ../output/0011/
