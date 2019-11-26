cd ../../
pwd
mkdir output/0009
cd ./UI/0009_bullet
pwd
npm install
npm run build-prod
cd ..
pwd
cp -r 0009_bullet/dist/* ../output/0009/
