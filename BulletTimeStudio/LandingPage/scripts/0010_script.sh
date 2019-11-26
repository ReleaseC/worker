cd ../../
pwd
mkdir output/0010
cd ./UI/0010_run
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0010_run/dist/* ../output/0010/
