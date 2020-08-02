/* 
 *  Model/Schema for mongoDB 
 *      used by post/post.controller.ts
 */


import * as mongoose from 'mongoose';

/*need to install @nestjs/passport*/
//import * as passportLocalMongoose from 'passport-local-mongoose';

mongoose.set('useFindAndModify', false);

function noop() {
    return;
}

var SALT_FACTOR = 10;


   export const PostSchema = new mongoose.Schema({
    
        path: { type: String, required:false},
        service: { type: String, required:true},
        userName: { type: String, required:true},
        password:{ type: String, required: false},
        title: { type: String, required:true},
        caption: { type: String, required:true},
        content: { type: String, required:false},
        files: { type: Array, required: false},
        userID: { type: String },
        postDate: {type: Date}

        });

        PostSchema.index({_id: 1},{ unique: true }); //decide what to index on later, use _id for now
        
        PostSchema.methods.name = function() {
            var thisSchema: mongoose.Schema =  this;

            return this.displayName || this.userName;
        };
        
//UserSchema.plugin(passportLocalMongoose);
   