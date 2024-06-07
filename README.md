# webstrate_presentation

### Installing via a server

First install Webstrates and run it in a dedicated terminal:

```
git clone https://github.com/Webstrates/Webstrates
cd Webstrates
# install Webstrates
npm install --production # Installs required NPM packages
npm run build # Uses webpack to generate the client application code
npm start # Starts the Webstrates server
```


Webstrates requires MongoDB running, which you can get as simply as, in a dedicated terminal:

```
sudo /usr/bin/mongod --config /etc/mongodb.conf
```

In two new dedicated terminals:

```
sudo npm install -g webstrates-file-system
git clone https://github.com/prspp/webstrate_presentation
cd ./webstrate_presentation
ls public
webstratesfs --id=editor --host=localhost:7007 --insecure
```

```
webstratesfs --id=audience --host=localhost:7007 --insecure
```



### Static Debugging

Just open `./public/index.html` in a browser.
