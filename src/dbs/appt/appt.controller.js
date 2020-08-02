/* 
 *  DB API Controller for communicating with mongoDB 
 *      called by routes/scheduler.js
 */


const Appt = require('./appt.model.js'); //DB Model used to talk to MongoDB
//const querystring = require('querystring');
const url = require('url');

//Create new Appointment => POST
exports.create = function(req, res) {

    console.log("INSIDE POST")
        //console.log(req)
    console.log("PARMS: ", req.params);
    console.log("BODY: ", req.body);


    // Request validation
    if (!req.body) {

        return res.status(400).json({
            message: "Appointment content is empty"
        });
    }
    if (!req.body.apptID || !req.body.date) {

        return res.status(400).json({
            message: "Appointment id cannot be made from current user input"
        });
    }


    var myDate;
    var time;
    var dateChecker = formatDate(req.body);
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
        title: req.body.title || "Appointment heading",
        password: req.body.password || "pass",
        apptID: req.body.apptID,
        date: myDate,
        tod: req.body.tod,
        customerName: req.body.cName || "Test user",
        estimatePrice: req.body.estimatePrice || 0,
        description: req.body.description || "N/A",
    });

    /**
     * Check to make sure this appointment hasn't already been created
     *      if this appt time slot is taken then decline user request (404)
     *      -if appt hasn't been previously created then create a new Appt
     */
    Appt.findOne({ apptID: req.body.apptID })
        .then(foundAppt => {
            if (foundAppt) {
                return res.status(409).json({
                    message: "Appoinment time is already taken on " + req.body.date + " at time: " + req.body.tod
                });
            } else {

                // Save Product in the database
                myAppt.save()
                    .then(data => {
                        res.send(data);
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

}; //endof exports.post (Appointment create)

// Retrieve all products from the database => GET (all)
exports.findAll = function(req, res) {

    console.log("INSIDE GET All: ");
    /*
        console.log("PARMS: ", req.params);
        console.log("BODY: ", req.body);
        console.log("qs: ", req.query)
    */
    //db.car.find({ speed: { $gt: 40, $lt: 65 } })
    var startDate;
    var endDate;

    try {
        startDate = new Date(req.query.startdate).toISOString();
        endDate = new Date(req.query.enddate).toISOString();
        if (endDate < startDate) {
            throw "End Date must be great than the Start Date!"
        }
    } catch (err) {
        console.error("Invalid Date: canceling update!", err);
        return res.status(400).json({
            message: "Date format is invalid: " + err.toString(),
        });
    }

    /*find all appointments between the start & endDate */
    Appt.find({ 'date': { $gte: startDate, $lte: endDate } })
        .then(myAppts => {
            res.send(myAppts);
        }).catch(err => {
            res.status(500).json({
                message: err.message || "Error while retrieving appointment"
            });
        });
}; //endof exports.findAll

// Find a single product with a productId => GET (single)
exports.findOne = function(req, res) {
    console.log("INSIDE FindOne")
    Appt.findOne({ apptID: req.params.apptID })
        .then(myAppt => {
            if (!myAppt) {
                return res.status(404).json({
                    message: "Product not found with id " + req.params.apptID
                });
            }
            res.status(200).send(myAppt);

            /* can't render from a different route!
              res.render('/apptList', {
                            title: 'Appointment Results',
                            apptList: [myAppt]
                        });*/

            /* almost works but can't pass objects via qs
            res.redirect(url.format({
                pathname: "/apptList",
                query: {
                    "title": 'Appointment Results',
                    "apptList": JSON.stringify(myAppt),
                }
            }));
            */
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    message: "Appointment not found with id " + req.params.apptID
                });
            }
            return res.status(500).json({
                message: "Something wrong retrieving appointment with id " + req.params.apptID
            });
        });
}; //endof exports.findOne

// Update a product => PUT
exports.update = (req, res) => {

    console.log("INSIDE PUT!!!");

    console.log(req.params)
    console.log(req.body)

    /***
     * Param requirements:
     * 1) date must come in MM/DD/YYYY format
     * 2) tod (time) must be given in military time, preferably without punctuation
     * 3) data is sent via the body parameter
     */


    var query = {};
    var myDate;
    var time;
    var dateChecker = formatDate(req.body);
    if (dateChecker.rtnCode !== 200)
        return res.status(dateChecker.rtnCode).json({
            message: dateChecker.message
        });
    else {
        myDate = dateChecker.date;
        time = dateChecker.time;
    }


    req.body.date = myDate;


    // Request validation
    if (!req.body) {
        return res.status(400).json({
            message: "Appointment information is empty"
        });
    }
    if (!req.body.apptID) {
        return res.status(400).json({
            message: "Appointment ID not found"
        });
    } else {
        req.body.apptID = new String(req.body.apptID).trim();

    }

    // Request validation
    if (!req.params) {
        if (req.body.apptID) {
            query = new String(req.body.apptID).trim();
        } else {
            return res.status(400).json({
                message: "Appointment content is empty"
            });
        }
    } else {
        query = { apptID: new String(req.params.apptID).trim() };

    }

    /* User can't change the appointmentID so update this ID in case it needs changing*/



    req.body.date = myDate;

    myDate = new Date(myDate);
    let mon = myDate.getMonth() + 1;
    let day = myDate.getDate();

    mon = mon < 10 ? '0' + mon.toString() : mon.toString(); // always return a 2 digit month
    day = day < 10 ? '0' + day.toString() : day.toString(); // always return a 2 digit day

    var dateStr = "" + mon + day + myDate.getFullYear().toString();
    var cName = new String(req.body.customerName).trim().replace(/\W/, '_');
    //apptID: 2 digit Mon + 2 digit day + 4 digit year + 2 digit Hr + 2 digit Min
    var newApptID = [dateStr, time, cName].join("");

    /*standardize new user inputs before updating DB*/
    req.body.apptID = newApptID;
    req.body.tod = time;
    req.body.customerName = cName;
    //console.log("ID: ", newApptID, "tod: ", time, "name: ", cName);


    // Find and update product with the request body
    Appt.findOneAndUpdate(query, req.body, { new: true }) //new: return updated document
        .then(myAppt => {
            if (!myAppt) {
                return res.status(404).json({
                    message: "Product not found with id1 " + req.params.apptID
                });
            }
            res.send(myAppt);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).json({
                    message: "Product not found with id2 " + req.params.apptID
                });
            }
            return res.status(500).json({
                message: "Something wrong updating note with id " + req.params.apptID
            });
        });
}; //endof exports.update

/*** 
 * Delete an appointment with the specified apptID in the request
 *      OR if no specific appt was specified then remove all appointments from DB!
 * */
exports.delete = (req, res) => {
    console.log("INSIDE DELETE!!!");
    //console.log(req.params)

    var query = {};
    // Request validation
    if (req.params.apptID !== undefined && req.params.apptID !== null) {

        query = { apptID: new String(req.params.apptID).trim() };
    } else { //if delete is called with no params then delete all
        Appt.deleteMany({})
            .then(Result => {
                if (!Result) {
                    return res.status(404).json({
                        message: "Deleting full db unsuccessful  ",
                    });
                }

                console.log(Result)
                res.send(Result);

            }).catch(err => {
                return res.status(500).json({
                    message: "Something wrong deleting full db "
                });


            })
        return;
    }
    console.log("deleting query... ", query);
    Appt.findOneAndDelete(query)
        .then(Result => {
            if (!Result) {
                return res.status(404).json({
                    message: "ID: " + query.apptID + " could not be deleted"
                });
            }
            console.log(Result)
            res.status(202).send(Result);
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: "Appointment with ID: " + query.apptID + "not deleted"
                });
            }
            return res.status(500).json({
                message: "Could not delete appointment with ID: " + query.apptID
            });
        });
}; //endof exports.delete

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
} //endof formatDate