import { Injectable, Body, Response, Request } from '@nestjs/common';
import {debug} from 'console';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import { IUser } from './user.interface';
import {IUsersService} from './iusers.service';
import {CreateUserDto} from './create-user.dto';
import { UserSchema } from 'src/dbs/user/user.schema';
const url = require('url');


@Injectable()
export class UsersService implements IUsersService{
    constructor(@InjectModel('testuser') private readonly userModel: Model<IUser>=new Model(UserSchema)) {}

    async findAll(): Promise<IUser[]> {
               
        try{
        const allUsers = await this.userModel.find().exec();
        console.log(allUsers);
        return allUsers;
       }catch (err){
           console.log( err, 'findAll error in UsersService');
           //return allUsers;
       }
    }

    async findOne(options: object): Promise<IUser> {
    
        try{
        var oneUser = await this.userModel.findOne(options).exec();
        
        
        /*if (!oneUser)
            oneUser = await this.userModel.find().exec();
            */
        console.log("Users Service=> OneUser: ", oneUser);
        return oneUser;
        }catch (err){
            console.log( err, 'UsersService.findOne error');
            //return User;
        }
    }

    async findById(ID: number): Promise<IUser> {
        return await this.userModel.findById(ID).exec();
    }

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }


    async update(ID: number, newValue: IUser): Promise<IUser> {
        const user = await this.userModel.findById(ID).exec();

        if (!user._id) {
            debug('user not found');
        }

        await this.userModel.findByIdAndUpdate(ID, newValue).exec();
        return await this.userModel.findById(ID).exec();
    }

    async delete(ID: number): Promise<string> {
        try {
            await this.userModel.findByIdAndRemove(ID).exec();
            return 'The user has been deleted';
        }
        catch (err) {
            debug(err);
            return 'The user could not be deleted';
        }
    }


    

}
/*
   function getSinglePost(@Request() req, @Response() res): {   //I want to return an Appt type, but haven't made this type yet!
        console.log("INSIDE FindOne")
        Appt.findOne({ apptID: req.params.apptID })
            .then(myAppt => {
                return myAppt;
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).json({
                        message: "Appointment not found with id " + req.params.apptID
                    });
                }
                return  null;
                // 
                // res.status(500).json({
                //     message: "Something wrong retrieving appointment with id " + req.params.apptID
                // );
                // }
                
            });
    } //endof getSinglePost

   makePost(@Body() body, @Response() res) {
        console.log("INSIDE POST")
        //console.log(req)
        //console.log("PARMS: ", req.params);
        console.log("BODY: ", body);


        // Request validation
        if (!body) {
            //
            //return res.status(400).json({
            //    message: "Appointment content is empty"
            //});
            //
           console.error("Appointment content is empty")
           return null;
        }
        if (!body.apptID || !body.date) {

            return res.status(400).json({
                message: "Appointment id cannot be made from current user input"
            });
        }


        var myDate;
        var time;
        var dateChecker = formatDate(body);
        if (dateChecker.rtnCode !== 200)
            return res.status(dateChecker.rtnCode).json({
                message: dateChecker.message
            });
        else {
            myDate = dateChecker.date;
            time = dateChecker.time;
        }

        // Create a new Appointment for our POST
        const myAppt = new Appt({
            username: "testUser",
            title: body.title || "Appointment heading",
            password: body.password || "pass",
            apptID: body.apptID,
            date: myDate,
            tod: body.tod,
            customerName: body.cName || "Test user",
            estimatePrice: body.estimatePrice || 0,
            description: body.description || "N/A",
        });

        // //
        //  // Check to make sure this appointment hasn't already been created
        //        if this appt time slot is taken then decline user request (404)
        //        -if appt hasn't been previously created then create a new Appt
        //  
        Appt.findOne({ apptID: body.apptID })
            .then(foundAppt => {
                if (foundAppt) {
                    return null;

                } else {

                    // Save Product in the database
                    myAppt.save()
                        .then(data => {
                            return data;
                            //res.send(data);
                        }).catch(err => {
                            console.log("Error in of POST1");

                            res.status(500).json({
                                message: err.message || "Error while creating appointment."
                            });
                            console.error("Error:", err.message);
                        });
                    console.log("End of POST");
                } //endof else
            }); //endof Appt.findOne.then()



    }//endof exports.post (Appointment create)

*/

function formatDate(apptObj) {

    var errObj = {
        rtnCode: 200,
        message: "",
        date: "",
        time: "",

    };
    var myDate;
    var time;

    try {
        let tmpDate = new String(apptObj.date).match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (!tmpDate)
            throw "change Date format: MM/DD/YY";

        time = new String(apptObj.tod).replace(/[^0-9+]+/gi, ''); //remove all non numeric characters
        //should have a 3-4 digit for the time
        //pad with a leading zero to make it a 4 digit number
        if (time.length < 3 || time.length > 4) time = '0000';
        else if (time.length == 3) time = "0" + time;

        let mon = (Number(tmpDate[1])).toString()
        mon = mon.length == 1 ? "0" + mon : mon;
        myDate = tmpDate[3] + "-" + mon + "-" + tmpDate[2] + "T" + time.slice(0, 2) + ":" + time.slice(2, 4) + ":00.000Z"; //ISO String format
        myDate = new Date(myDate);
        myDate = myDate.toISOString();
    } catch (err) { //catch invalid date formatting error
        console.error("Invalid Date: canceling update!", err);
        errObj.rtnCode = 400;
        errObj.message = "Date format is invalid, use MM/DD/YYYY";
        /*return res.status(400).json({
            message: "Date format is invalid, use MM/DD/YYYY"
        });
        */
    }

    errObj.time = time;
    errObj.date = myDate;



    return errObj;
}; //endof formatDate


