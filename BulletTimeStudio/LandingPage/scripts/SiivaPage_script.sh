cd ../../
pwd
# mkdir output/SiivaPage
cd ./LandingPage/SiivaPage
pwd
npm install --save
npm run build-prod
npm start -- --port=4202 --disable-host-check --public-host=siiva-page.siiva.com
#cd ..
#pwd
#cp -r SiivaPage/dist/* ../output/SiivaPage/
