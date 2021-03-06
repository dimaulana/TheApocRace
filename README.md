# COMP4770

This repository contains the implementation of a customized single-player platformer game called **`The Apocolyptic Race`** from scratch using Node JS, Express, HTML5 and Socket.io. Everything from asset creation, level editor and the game engine is customized and easily extendable to a multiplayer platform game.

The game is also available on heroku. **https://theapocalypticrace.herokuapp.com**

**Technology Stack Installation:**
* For a local run, MongoDB must be installed on your machine. Please refer to this link for installation guide based on your operating system (https://www.mongodb.com/). 
* Cloud database is also available. We are using MongoDB Atlas for storing everything that the game needs to have. All you need to do is sign up as a user from the game.
* All node packages will be installed using NPM which is Node's package installer and manager. NPM can be installed on Windows using this link (https://www.npmjs.com/get-npm) and on Mac OS type "**brew install node**" in the terminal and finally, if you are running Linux run the following commands:
1. sudo apt-get update
2. sudo apt-get install nodejs

**Switching between Local & Cloud Database.**<br/>
To switch between the local and cloud database, the user will need to switch the **environment.json** file located in **server/bin** folder. Edit the variable as shown in the screenshot below. <br/>
<br/>
**Local Database** <br/>
"name" : "dev" <br/>
![dev](https://github.com/hparpia8/COMP4770/blob/master/client/images/environmentjsonDev.PNG)<br/>
<br/>
**Cloud Database** <br/>
"name" : "prod" <br/>
![prod](https://github.com/hparpia8/COMP4770/blob/master/client/images/environmentjsonProd.PNG)<br/>



**Run Instructions**:
1. Open the terminal app on your operating system.
2. Clone the repo onto your local machine using git clone https://github.com/hparpia8/COMP4770.git. 
3. Navigate to the contents of the folder COMP4770.
4. Run **`mongod`** in a terminal window. **IGNORE THIS STEP IF YOU ARE SET UP FOR MONGODB ATLAS CLOUD**. <br/><br/>
The screenshot below shows a successful run and set up of your local MongoDB database. 
![mongod](https://github.com/hparpia8/COMP4770/blob/master/client/images/mongod.png) <br/>
<br/>

5. On another terminal window, you will need to install all the dependencies which are included in the **`package.json`**. To do that, please run **`npm install`** from the project. Once you do that you should a message from npm package manager as seen in the screenshot below:


![firsttwocommands](https://github.com/hparpia8/COMP4770/blob/master/client/images/firstwocommands.png)

6. To proceed, please type **`node app.js`** from the project directory (COMP4770) to start the game. To make the user experience as easy as possible and to have the game running quickly we setup all the collections needed by the database to add values to, automatically when this command is run. This is shown in the screenshot below:
![serverstarted](https://github.com/hparpia8/COMP4770/blob/master/client/images/serverstarted.png)
7. Open up your favourite web browser(i.e Google Chrome) and enter your URL as http://localhost:8080. This will bring you to the login page of the game as seen below:

![loginpage](https://github.com/hparpia8/COMP4770/blob/master/client/images/loginpage.png)

This covers all the necessary information required to have the game up and running in a few seconds. <br/>

**`Extra Information:`**

Once you have signed up as a user there will be a record inserted for you directly into the MongoDB cloud which will help you in saving and reading the levels based on your username and the story levels (created by an admin user) successfully and with little trouble. When the game begins, all the assets are loaded directly from the cloud in real time. The same instance happens during a local database run, these same data as shown below will be saved into your local MongoDB database.

The following screenshot shows how the user, level and asset data are stored in the cloud for ease of use:
1. **`User Data`**: <br/>

![usercollection](https://github.com/hparpia8/COMP4770/blob/master/client/images/usercollection.png)

2. **`Level Data`**: <br/>

![leveldata](https://github.com/hparpia8/COMP4770/blob/master/client/images/levelcollection.png)

3. **`Asset Data`**: <br/> 

![assetcollection](https://github.com/hparpia8/COMP4770/blob/master/client/images/assetcollection.png)

If you would like to get more information about this project we would love to help you. You can contact any of us via email: <br/>
Sahil Anand - sa7437@mun.ca <br/>
Dido Maulana - dmaulana@mun.ca <br/>
Hussein Parpia - hparpia@mun.ca <br/>
Victor Mutandwa - vtm806@mun.ca <br/>
Michelle Mushaninga - mm5047@mun.ca <br/>
