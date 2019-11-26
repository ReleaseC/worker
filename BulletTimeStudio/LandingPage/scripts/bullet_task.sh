cd ../../
pwd
mkdir output/bullet-task
cd ./LandingPage/bullet-task
pwd
npm install
npm run build
cd ..
pwd
cp -r bullet-task/dist/* ../output
