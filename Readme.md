In order to run the editor locally
1. create the id of the webstrate in local by going to the page http://localhost:7007/presentationTool/

Then from the command line :
git clone https://github.com/prspp/webstrate_presentation.git
wfs --id=presentationTool --host=web:strate@localhost:7007 webstrate_presentation/ --insecure

The last command will mount the folder in the file system and upload your local changes to the server

**Options possible in the editor**
- add a text, title
- perform drag and drop on text and drawing
- add notes, audience review