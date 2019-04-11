# COMP4770

This repo contains the implementation of a customized single-player platformer game called **`The Apocolyptic Race`** from scratch using Node JS, Express, HTML5 and Socket.io. Everything from asset creation, level editor and the game engine is customized and easily extendable to a multiplayer platform game.

**Technology Stack Installation:**
* Mongo db must be installed on your machine. Please refer to this link for installation guide based on your operating system (https://www.mongodb.com/)
* All node packages will be installed using NPM which is Node's package installer and manager. NPM can be installed on windows using this link (https://www.npmjs.com/get-npm) and on Mac OS type "**brew install node**" in terminal and finally, if you are running linux run the following commands:
1. sudo apt-get update
2. sudo apt-get install nodejs

Before you can start and enjoy our game we ask you to follow the simple steps listed below:

1. Open the terminal app on your operating system.
2. Clone the repo onto your local machine using git clone https://github.com/hparpia8/COMP4770.git. 
3. Navigate to the contents of the folder COMP4770.
4. Before you can run the game, you will need to install all the dependencies which are included in the **`package.json`**. To do that, please run **`npm install`** from the project. Once you do that you should a message from npm package manager as seen in the screenshot below:

![firsttwocommands](https://github.com/hparpia8/COMP4770/blob/master/client/images/firstwocommands.png)

5. After the dependencies are installed successfully, open a new tab in the terminal and run **`mongod`** to start the database which will listen to connections on port 27017 as seen in the screenshot below:

![mongo](https://github.com/hparpia8/COMP4770/blob/master/client/images/mongod.png)


6. Now, please type **`node app.js`** from the project directory (COMP4770) to start the game. To make the user experience as easy as possible and to have the game running quickly we setup all the collections needed by the database to add values to, automatically when this command is run. This is shown in the screenshot below:
![serverstarted](https://github.com/hparpia8/COMP4770/blob/master/client/images/serverstarted.png)
7. Open up your favourite browser and go to http://localhost:8080. This will bring you to the login page of the game as seen here:

![loginpage](https://github.com/hparpia8/COMP4770/blob/master/client/images/loginpage.png)

This covers the information needed for you to have the game up and running in a few seconds. <br/>

If you would like to get more information about this project we would love to talk to you. You can contact any of us via email:<br/>
Sahil Anand - sa7437@mun.ca <br/>
Dido Maulana - dmaulana@mun.ca<br/>
Hussein Parpia - hparpia@mun.ca<br/>
Victor Mutandwa - vtm806@mun.ca<br/>
Michelle Mushaninga - tbd
