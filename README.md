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
webstratesfs --id=presentationView --host=localhost:7007 --insecure
```

### Reset

```bash
for i in frontpage editor reviewsIframe presentationView questionsIframe; do
	echo $i; curl http://localhost:7007/$i/?delete; echo;
done
```

###
**Options possible in the editor**
- add new slides
- add a text, title
- add image from local or url
- resize images, or text boxes
- hand-drawing mode
- choose the brush thickness and color for the drawing mode
- perform drag and drop on text, images, drawing
- writ an outline / table of contents
- add notes, audience review
- curate the questions from the audience

**Options possible in the presentation view**
- ask questions
- see the slides
- go to previous/slides
- see the reviewed questions and the table of contents of the presentation

Video preview in ![](assets/output.mp4)