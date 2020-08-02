$(function() {
    var submitBtns = ["user_login_form"];
    var formHandler = [loginHandler];

    submitBtns.forEach((elem, ind) => {

        var tmp = "." + elem + ">div.button";
        console.log(tmp, " ", $(tmp));
        console.log($(elem));
        var test = "." + elem + ">div";
        console.log($(test));

        $(tmp).on('click', { "elem": elem }, formHandler[ind]);

        console.log("inside submitBtns", elem, " ", ind);

    });

});


function loginHandler(event) {

    console.log("inside loginHandler", event.data.elem)
    var formDivName = "." + event.data.elem
    event.preventDefault(); //stops form from posting as normal
    console.log(formDivName)
    var fData = getFormInfo(formDivName);

    var url = '/auth/login';
    console.log(url, "fdata: ", fData);

    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(fData),
        contentType: "application/json",
        //dataType: "json",
        processData: false
    }).done(function(data, textStatus, jqXHR) {
        console.log("Response: ", data);
        //alert(response);
        window.location.href = '/userProfile'; //should reload with new user info

    }).fail(function(jqXHR, textStatus, error) {
        console.error("Login POST Error: " + textStatus);
        console.error("Login POST Error:", error);
        console.error("Login Error:", jqXHR.responseText);
        //console.error("Single User Search POST:", xhr.responseJSON.message);
        $('loginErrMsg').css("display", "block");
        alert('Problem locating user');
        //alert('HEAD: File not found.');

    });



}

function getFormInfo(formDiv) {
    console.log($('.user_login_form'));
    var formInputs = $(formDiv).children('[name]');
    console.log(formInputs)
    var fData = {};
    formInputs.each(function(elem) {
        fData[this.name] = this.value; //value of input textbox
        console.log("n: ", this.name, " v: ", this.value)

    })
    return fData;
}