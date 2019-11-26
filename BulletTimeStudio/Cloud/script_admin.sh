#cd ..
#pwd
#mkdir output
#mkdir output/admin
#cd ./Cloud/admin
cd admin/
pwd
npm config set package-lock false
npm install --save
npm rebuild node-sass
npm link @angular/cli
npm run build:prod
npm start -- --port=4201 --disableHostCheck
#cd ..
#pwd
#cp -r admin/dist/* ../output/admin/
