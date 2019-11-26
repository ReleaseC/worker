cd ..
pwd
mkdir output
mkdir output/admin
cd ./Cloud/admin
pwd
npm install
npm run build:prod
cd ..
pwd
cp -r admin/dist/* ../output/admin/
