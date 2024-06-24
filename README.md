# webstrate_presentation

### Install & Run

1. First install Webstrates and run it in a dedicated terminal:

```
git clone https://github.com/Webstrates/Webstrates
cd Webstrates
# install Webstrates
npm install --production # Installs required NPM packages
npm run build # Uses webpack to generate the client application code
npm start # Starts the Webstrates server
```

2. Webstrates requires MongoDB running, which you can get as simply as, in a dedicated terminal:

```
sudo /usr/bin/mongod --config /etc/mongodb.conf
```

3. In another terminal:

```
sudo npm install -g webstrates-file-system
git clone https://github.com/prspp/webstrate_presentation
cd ./webstrate_presentation
ls public
webstratesfs --id=editor --host=localhost:7007 --insecure
```

4. Again, in another terminal:

```
webstratesfs --id=audience --host=localhost:7007 --insecure
```

### Reset

```bash
for i in frontpage editor audience presentationView questionsIframe; do
	echo $i; curl http://localhost:7007/$i/?delete; echo;
done
```

### **Options possible in the editor**

- add a text, title
- perform drag and drop on text and drawing
- add notes, audience review
