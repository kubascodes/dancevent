# Dancevent 


# Prerequisites

## Install

* nodejs [official website](https://nodejs.org/en/) - nodejs includes [npm](https://www.npmjs.com/) (node package manager)

Just for the backend application:

* mongodb [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)

## Setup (before first run)

**Install node dependencies**

Go to both Homedirectories relative/client-clean and relative/server and run 

```
npm install
```
 
**Set up your database**

* Create a new directory where your database will be stored (it's a good idea to separate data and business logic - the data directory should be on a different place than your app)
* Start the database server
```
mongod --dbpath relative/path/to/database
```


**Set the environment variables**

You can start the app now. If you wish to have special environment variables you can either change them in relative/server/congig.js or by using the bash e.g.:

```bash
export PORT=3000
```

**Set Emailclient**

You will also wind in the relative/server/congig.js the settings for the mailclient. To test it you can set up an account at ethereal.email (one click) and put the settings into the config file. Ethereal.email will catch all send emails, but you can look through them.

It should also work with a real mailserver (tested!).


# Start

## Backend 

Go to relative/server.

**Development environment**
```bash
npm run devstart
```

**Production environment**
```bash
npm start
```

## Frontend 

Go to relative/client-clean.

**Development environment**
```bash
npm start
```

**Production environment**
```bash
npm start
```