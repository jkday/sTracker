/* 
 *  Model/Schema for mongoDB 
 *      used by dbs/model/appt.controller.js
 */

//var bcrypt = require("bcryptjs"); //C version that is faster


import * as mongoose from 'mongoose';
//import * as bcrypt from 'bcrypt-nodejs';
import * as bcrypt from 'bcryptjs';

import {Model} from 'mongoose';
import { IUser } from '../../users/user.interface';

/*need to install @nestjs/passport*/
//import * as passportLocalMongoose from 'passport-local-mongoose';

mongoose.set('useFindAndModify', false);

function noop() {
    return;
}

var SALT_FACTOR = 10;


export const UserSchema = new mongoose.Schema({
    
        method: String,
        local:{
            userName: { type: String, required: true, unique: true },
            hashedPassword: { type: String, required: false },
            userID: { type: String, required: false, unique: false },
            date: Date,
            description: String,
            email: {type: String},
            password: String,
            salt: {type: String}
        }

        } );

        UserSchema.index({_id: 1}, { unique: true }); //decide what to index on later, use _id for now


    UserSchema.pre("save", function(done) {
            console.log("in PRE state")
            var userDoc = this;
            var myHashPW;
            console.log(userDoc.get('local.userName', String));

            if(userDoc.isInit("local.hashedPassword")){
                console.log("variables are initialized!!");
            }

            myHashPW = userDoc.get("local.hashedPassword", String);
            console.log("local hashPW: " + myHashPW);
            if (!userDoc.isModified("local.hashedPassword")) {
                return done();
            }
            else{
                console.log("why does passport say pw was modified!!!");
                //just return for now
                return done();
            }
     //!!Why would you do that!
            /*
            bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
                if (err) { 
                    console.log("error in genSalt func");
                    return done(err); }
//bcrypt-nodejs          //bcrypt.hash(myHashPW, salt, noop, function(err, newHashPW) {

                bcrypt.hash(myHashPW, salt, function(err, newHashPW) {
                  
                    if (err) { 
                        console.log("error in Bcrypt-hash func");

                        return done(err); }

                    userDoc.set("local.hashedPassword", newHashPW, String);
                    //userDoc.local.hashedPassword = newHashPW;
                    done();
                });
            });
            */
        });
        
       UserSchema.methods.checkPassword = function(guess, done) {

            let mySchema: mongoose.Schema = this;
            bcrypt.compare(guess, this.get('local.hashedPassword'), function(err, isMatch) {
                done(err, isMatch);
            });
        };
        
        UserSchema.methods.name = function() {
            //return thisSchema.get('local.displayName') | thisSchema.get('local.userName');
            let mySchema: mongoose.Schema = this;

            let name= mySchema.get('local.displayName');
           return ( (name!= undefined && name!=null) ? name :  mySchema.get('local.userName')   );
        };
        
        //export UserSchema;

  //export const User: mongoose.Model<IUser> = mongoose.model<IUser>("testuser5", UserSchema);


    /*
// Make Mongoose use `findOneAndUpdate()` instead of useFindAndModify
mongoose.set('useFindAndModify', false);
var Appt = mongoose.model("Appt", apptSchema);

//export default Appt; //exporting for TS
export { Appt }

//declare module 'Appt';
module.exports = Appt; //exporting for basic Express
*/