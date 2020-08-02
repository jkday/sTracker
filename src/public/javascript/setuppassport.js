//import * as passport from 'passport';
//import * as passportLocal from 'passport-local';

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose");
//var User = require("../../dbs/user/user.model.js");
var UserSchema = require('../../dbs/user/user.schema');
var User = mongoose.model("testUser", UserSchema);
//import {User} from '../../dbs/user/user.model';


module.exports = function() {
    console.log("SETTING UP PASSPORT... inside setuppassport.js");
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /*
        passport.use("local", new LocalStrategy(function(username, password, done) {
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

}; //endof exports