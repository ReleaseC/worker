cd ../../ 
pwd 
mkdir output 
mkdir output/UserGuide 
cd ./Edge/BulletTimeEdge/UserGuide 
pwd 
npm install 
npm run build-prod 
cd .. 
pwd 
cp -r UserGuide/dist/* ../../output/UserGuide/