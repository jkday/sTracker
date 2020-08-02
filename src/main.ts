import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Res, Request, Req, Next} from '@nestjs/common';


import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as flash from 'connect-flash';

import * as passport from 'passport';
import { Strategy } from 'passport-local';

import {IUser} from './users/user.interface';

 //LocalStrategy = pp-local.Strategy;
//var User = require("./dbs/user/user.model");


//var setUpPassport = require("./public/javascript/setuppassport");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(__dirname, 'public')));

  const expressApp = app.getHttpAdapter().getInstance();

  //console.log("app keys:");
  //console.log(Object.keys(expressApp));

 // app.setBaseViewsDir( __dirname + '/views');
 // app.setViewEngine('ejs');

 //setupPP();

  expressApp.set('views', __dirname + '/views');
  // set ejs as the view engine
  expressApp.set('view engine', 'ejs');
  expressApp.disable('view cache');

  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(cookieParser());

  expressApp.use(session({
      //defaults to MemoryStore
    secret: "TKR@#?>Js=HYqrrk$::*=&!F!%V*&@$KiVsxUpiBP<<MX",
    resave: true,
    saveUninitialized: false
    }));
  expressApp.use(flash());

  process.env['NODE_ENV'] = 'DEV';

  var db = {};
  var connectionName = (process.env['NODE_ENV'] ==='prod') ? "mongodb://localhost:27017/db" : "mongodb://localhost:27017/db";
  var connect2DB = function(db, retries=0) { //3 attempts to connect to MongoDB
  
      var attempt = retries || 1;
      //    db = mongoose.connect("mongodb://localhost:27017/db", { useNewUrlParser: true }).then(() => {
  
      db = mongoose.connect(connectionName, { useNewUrlParser: true }).then(() => {
          console.log("Successfully connected to the database");
      }).catch(err => {
  
          if (attempt <= 3) {
              console.error(`Could not connect to the database on attempt ${attempt} of 3.\n Retrying shortly... \n${err}`);
              attempt++;
              setTimeout(() => { let j = 1 + 1 }, 500); //give the MongoDB a chance to start up (.5 sec pause)
              connect2DB(db, attempt);
              return;
          } else {
              //exit the entire node app if a connection cannot be made to DB
              console.error('Could not connect to the database. Exiting now...', err);
              process.exit();
          }
      });
  
  };
  connect2DB(db);

  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  //Not sure if NEST.js recognizes this here... should be in middleware of app.module
  expressApp.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
    });


  await app.listen(3000, function() {
    console.log("NestServer started on port " + 3000);
    });
}


bootstrap();


function setupPP() {
    /*
    console.log("SETTING UP PASSPORT...");
    passport.serializeUser(function(user: IUser, done) {
        done(null, user._id);
        //done(null,user);//FIX ME Jared
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    
    passport.use( new Strategy(function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                console.log("ERROR in passport: ", err);
                return done(err);
            }
            console.log("INSIDE PASSPORT LOGIN!!");
            if (!user) {
                console.log("INSIDE PASSPORT USER DNE!!");

                return done(null, false, { message: "No user has that username!" });
            }

            user.checkPassword(password, function(err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Invalid password." });
                }
            });
        }); //endof findOne
    })); //endof LocalStrategy
    */

}; //endof setupPP
