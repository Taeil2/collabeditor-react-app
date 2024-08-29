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

Notes

- You can open [localhost:5050 ](http://localhost:5050/) to check if the server is running.

## To Do

- collabeditor permissions
  - all (do everything)
  - edit (remove delete button)
  - view (make document read only)
- collabeditors modal based on permissions
  - all (do everything)
  - edit (allow edit and view, no delete)
  - view (read only, no add)
- read only view
- collabeditor cursors

- test thoroughly for errors

optional

- highlighting
- publish
- elegant loading
- redirect to document page after login (if accessing a document URL)

bugs

- collabeditor changes color when certain ones leave
