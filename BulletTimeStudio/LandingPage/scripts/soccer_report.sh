cd ../../
pwd
mkdir output/soccer-report
cd ./LandingPage/soccer-report
pwd
npm install
npm run build
cd ..
pwd
cp -r soccer-report/dist/* ../output
