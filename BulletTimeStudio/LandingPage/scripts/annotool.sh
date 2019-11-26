cd ../../
pwd
mkdir output/annotationTool
cd ./LandingPage/annotationTool
pwd
npm install
npm run build
cd ..
pwd
cp -r annotationTool/dist/* ../output