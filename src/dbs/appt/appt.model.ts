/* 
 *  Model/Schema for mongoDB 
 *      used by dbs/model/appt.controller.js
 */

//var bcrypt = require("bcryptjs");
//var mongoose = require("mongoose");
//var bcrypt = require("bcrypt-nodejs");

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

mongoose.set('useFindAndModify', false);

function noop() {
    return;
}

var SALT_FACTOR = 10;

declare interface WebUser extends Document{
    username: string
    password: string;
    userID: string;
    date?: Date,
    tod?: string, //time of day
    displayName?: string,
    description?: string,


}

export interface WebUserModel extends mongoose.Model<WebUser> {};

export class User {
    private _myUser: mongoose.Model<WebUser>;

    constructor() {
    //const schema = new mongoose.Schema({
        var schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    //password: { type: String, required: true },
    title: String,
    userID: { type: String, required: true, unique: true },
    date: Date,
    tod: String, //time of day
    customerName: String, //firstname_lastname
    displayName: String,
    description: String,


        });

        schema.pre("save", function(done) {
            console.log("in PRE state")
            var user = this;
            if (!user.isModified("password")) {
                return done();
            }
            bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
                if (err) { return done(err); }
                bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
                    if (err) { return done(err); }
                    user.password = hashedPassword;
                    done();
                });
            });
        });
        
       schema.methods.checkPassword = function(guess, done) {
            bcrypt.compare(guess, this.password, function(err, isMatch) {
                done(err, isMatch);
            });
        };
        
        schema.methods.name = function() {
            return this.displayName || this.username;
        };
        

    this._myUser = mongoose.model<WebUser>('TestUser', schema);


    }//endof constructor

    public get model(): mongoose.Model<WebUser>{
        return this._myUser;
    }


}
    /*
// Make Mongoose use `findOneAndUpdate()` instead of useFindAndModify
mongoose.set('useFindAndModify', false);
var Appt = mongoose.model("Appt", apptSchema);

//export default Appt; //exporting for TS
export { Appt }

//declare module 'Appt';
module.exports = Appt; //exporting for basic Express
*/