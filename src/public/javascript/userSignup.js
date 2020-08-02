$(function() {
    var submitBtns = ["user_signup_form"];
    var formHandler = [signupHandler];

    submitBtns.forEach((elem, ind) => {

        var tmp = "#" + elem + ">div.button";
        console.log($(tmp));

        $(tmp).on('click', { "elem": elem }, formHandler[ind]);

        console.log("inside submitBtns", elem, " ", ind);

    });

})

function signupHandler(event) {

    console.log("inside signupHandler", event.data.elem)
    var formDivName = "#" + event.data.elem
    event.preventDefault(); //stops form from posting as normal

    var fData = getFormInfo(formDivName);

    //var url = '/auth/signup' + fData.username;

    var url = '/auth/signup';
    console.log(url, " ", fData)

    $.ajax({
        url: url,
        type: 'POST',
        //contentType: "text/plain",
        contentType: "application/json",
        //contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: JSON.stringify(fData),

        // dataType: "json",
        processData: false
    }).done(function(data, textStatus, jqXHR) {
        console.log("Response: ", data);
        window.location.href = '/userProfile'; //should reload with new user info

        //window.location.reload(true); //should reload with new user info


    }).fail(function(jqXHR, textStatus, error) {
        console.error("Single Search POST Error: " + textStatus);
        console.error("Single Search POST Error:", error);
        console.error("POST Error:", jqXHR.responseText);
        //console.error("Single Search POST:", xhr.responseJSON.message);
        $('loginErrMsg').css("display", "block");


    });


} //endofSignUpHandler

function getFormInfo(formDiv) {
    var formInputs = $(formDiv).children('[name]');
    //console.log(formInputs)
    var fData = {};
    formInputs.each(function(elem) {
        fData[this.name] = this.value;
        console.log("n: ", this.name, " v: ", this.value)

    })
    return fData;
}