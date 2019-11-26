cd ../../
pwd
mkdir output/nike-test
cd ./LandingPage/nike-test
pwd
npm install
npm run build
cd ..
pwd
cp -r nike-test/dist/* ../output
