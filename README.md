# webstrate_presentation
```
git clone https://github.com/prspp/webstrate_presentation
git clone https://github.com/Webstrates/Webstrates
cd Webstrates
rm -r public/; cp -r ../webstrate_presentation/public/ .
cp ../webstrate_presentation/webstrates.js .
# install Webstrates
npm install --production # Installs required NPM packages
npm run build # Uses webpack to generate the client application code
npm start # Starts the Webstrates server
```