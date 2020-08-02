/* 
 *  Model/Schema for mongoDB 
 *      used by dbs/model/appt.controller.js
 */

//var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var SALT_FACTOR = 10;
var userSchema = mongoose.Schema({

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    title: String,
    userID: { type: String, required: true, unique: true },
    date: Date,
    tod: String, //time of day
    description: String,



});

/* encryption code... add later  */
var noop = function() {};
userSchema.pre("save", function(done) {
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

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

userSchema.methods.name = function() {
    return this.displayName || this.username;
};


// Make Mongoose use `findOneAndUpdate()` instead of useFindAndModify
mongoose.set('useFindAndModify', false);
var User = mongoose.model("testUser", userSchema);


module.exports = User;