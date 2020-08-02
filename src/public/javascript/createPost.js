$(function() {


    var formElem = $('#postForm');
    $(formElem).on('submit', function() {

        formElem[0].reset();
        window.close();
    })


})