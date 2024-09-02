## Collabeditor React App

This is the application for the Collabeditor app. Follow these instructions to install:

- Make sure your IP Address is added to the allowed IPs to the MongoDB Network Access list. Contact Taeil at taeil2@gmail.com with your IP address to add yours. You can find your IP address here: https://whatismyipaddress.com/
- Clone the application from https://github.com/Taeil2/collabeditor-react-app
- Open the app directory and run "npm install" from the terminal
- Clone the server from https://github.com/Taeil2/collabeditor-server
- Open the server directory and run "npm install" from the terminal
- Run "npm start" on the server directory
- Run "npm start" on the app directory
- Open http://localhost:3000/ in your web browser.

## Notes

- To test multiple users editing synchronously
  - Create multiple logins and set their names.
  - Create a new document and click "collabeditors".
  - The Add Collabeditor field autocompletes with names you have added.
- You can open [localhost:5050 ](http://localhost:5050/) to check if the server is running.

## To Do

- styling broke. fix it.
- collabeditor cursors
- keep names across front and back consistent (liveUsers, currentUsers / title, name / etc.)
- test thoroughly for errors
- run through files and do a cleanup

optional

- highlighting
- elegant loading
- responsive
- publish
- redirect to document page after login (if accessing a document URL)
- put things in contexts

bugs

- collabeditor changes color when certain ones leave
