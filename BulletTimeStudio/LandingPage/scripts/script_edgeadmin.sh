cd ../../ 
pwd 
mkdir output 
mkdir output/EdgeAdmin 
cd ./Edge/BulletTimeEdge/EdgeAdmin 
pwd 
npm install 
npm run build:prod 
cd .. 
pwd 
cp -r EdgeAdmin/dist/* ../output/EdgeAdmin/