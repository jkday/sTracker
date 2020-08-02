$(function() {
    var pLoadBtns = $('.queryForm'); //post Load div
    var postHandlers = [postsQuery, basicQuery, newPostHandler]

    const postQInd = 0; //postQueryIndex
    const basicQInd = 1; //basicQueryIndex
    const newPostInd = 2; //basicQueryIndex

    console.log(pLoadBtns);
    /*load the individual post query buttons*/
    for (let j = 0; j < pLoadBtns.length; j++) {
        if (!Array.isArray(pLoadBtns[j])) {
            console.log("loading single button", pLoadBtns[j]);

            let queryBtn = $(pLoadBtns[j]).children('button').first();
            console.log("loading single button", queryBtn);

            $(queryBtn).on('click', { elem: $(pLoadBtns[j]).prop('id') }, postHandlers[postQInd]);
            //$(queryBtn).on('click', postHandlers[postQInd]);

        } else {
            pLoadBtns[j].forEach((elem, ind) => { //array of jq elements
                //var pHandler = elemName.value;

                let queryBtn = $(elem).children('button').first();
                console.log("loading buttons", queryBtn);

                $(queryBtn).on('click', { elem: $(elem).prop('id') }, postHandlers[postQInd]);
            });

        } //endof if not array

        /*load the general purpose post query buttons*/
    }

    var generalPosts = $(':button.recent');
    generalPosts.each(function(index, item) {

            if ($(item).hasClass('facebook')) {
                console.log(item)

                $(item).on('click', { elem: $(item).prop('id') }, postHandlers[basicQInd]);

            }

        })
        /*
            for (let j = 0; j++; j < generalPosts.length) {

                console.log('gothere')
                if (generalPosts[j].hasClass('facebook')) {
                    console.log(generalPosts)

                    generalPosts[j].on('click', { elem: $(item).prop('id') }, postHandlers[basicQInd]);

                }
            }
        */
    var newPost = $('#newPostWin');
    let newPostButton = newPost.children("button").first();
    $(newPostButton).on('click', { elem: $(newPost).prop('id') }, newPostHandler);



})


function sendPostWithData(event, pData, displaySection) {

    var url = '/userProfile/postMgr'
        //var displaySection = 'genUpdates'; //div id for updates

    /*
            var oXHR = new XMLHttpRequest();
            oXHR.onload = function() {
                console.log(this.responseText);
            };


            oXHR.open("post", formElem.action);
            oXHR.send(new FormData(formElem));

            var fData = getFormInfo(formDivName);

            var url = '/auth/login';
            console.log(url, "fdata: ", fData);
        */

    //OR USE THIS

    var jqXHR = $.ajax({
        url: url,
        type: 'POST', //using a post to submit a basic query aka stealth GET!
        contentType: "application/json",
        data: JSON.stringify(pData),
        processData: false
    }).done(function(data, textStatus, jqXHR) {
        console.log("Response: ", data);
        genUpdate(displaySection, data);
    }).fail(function(jqXHR, textStatus, error) {
        console.error("Get gen POST Error: " + textStatus);
        console.error("Get gen POST Error:", error);
        console.error("Get gen Error:", jqXHR.responseText);
        //console.error("Single User Search POST:", xhr.responseJSON.message);
        $('loginErrMsg').css("display", "block");

        alert('Problem locating posts!');
        //alert('HEAD: File not found.');
    });




} //sendPostWithData

function basicQuery(event) {
    var divName = event.target;

    //console.log(divName);

    var fData = {};

    Object.assign(fData, getDivInfo(divName)); //collect all query parameters from div

    //HACK section
    //fData['title'] = 'test6';
    console.log("fData:", fData)

    var url = '/userProfile/postMgr'
    var displayPosts = 'genUpdates'; //div id for updates

    $.ajax({
        url: url,
        type: 'POST', //using a post to submit a basic query aka stealth GET!
        contentType: "application/json",
        data: JSON.stringify(fData),
        processData: false
    }).done(function(data, textStatus, jqXHR) {
        console.log("Response: ", data);
        //alert(response);
        //window.location.href = '/userProfile'; //should reload with new user info
        //update the general posts area
        var displaySection = 'genUpdates'; //div for showing received posts
        genUpdate(displaySection, data);
    }).fail(function(jqXHR, textStatus, error) {
        console.error("Get gen POST Error: " + status);
        console.error("Get gen POST Error:", error);
        console.error("Get gen Error:", xhr.responseText);
        //console.error("Single User Search POST:", xhr.responseJSON.message);
        $('loginErrMsg').css("display", "block");
        alert('Problem locating posts!');
        //alert('HEAD: File not found.');

    });

} //basicQuery

function postsQuery(event) {


    //use startDate, endDate, website
    // use XMLHttpRequest to ask for posts in a given Range

    var divName = "#" + event.data.elem;
    console.log("parent id: ", event.data.elem)

    var postData = getDivInfo(divName);

    console.log(divName + "\n" + postData);

    $("#" + postData['service'] + "Results").empty(); //clear the Results DIV after each query
    sendPostWithData(event, postData, (postData['service'] + "Results"));
    //update everything in general update func
}

function getDivInfo(div) {

    var formInputs = $(div).children('[name]');
    var fData = {};

    //get 1st service name only (for now)
    var serviceNames = ["allsocial", "weblog", "instagram", "facebook"];
    let serviceList = $(div).attr('class').split(" ");
    serviceList = serviceList.filter(item => serviceNames.includes(item));

    fData['service'] = serviceList[0]; //only record the 1st service name 

    formInputs.each(function(index, elem) {

        console.log("n: ", this.name, " v: ", this.value);
        console.log("n: ", elem.name, " v: ", elem.value);
        //elem should == this
        fData[this.name] = this.value;

    });
    return fData;
}


function genUpdate(displayDiv, response) {

    const showBlock = document.getElementById(displayDiv);
    if (!showBlock) {
        alert("display section name invalid");
        return;
    }

    response.forEach((elem, ind) => {
        //response format: array of createPostDTO obj
        if (elem.hasOwnProperty('title') && elem['title'] && elem.hasOwnProperty('files')) {
            //showResults(elem.files)
            console.log("results # ", ind, " ", elem['files']);
            var fileArray = elem['files']; //currently arrays of Buffers
            var fileCount = (fileArray.length < 3) ? fileArray.length : 3; //only want the 1st 3 images
            const mainDiv = document.createElement("div");
            mainDiv.id = elem['service'] + "_" + elem['postDate'];

            let borderW = 5;
            var divHeight = 200 + 2 * borderW;
            const mainImg = document.createElement("img");
            mainImg.name = 'showImg';
            mainDiv.style = "border:" + borderW + "px solid red;height:210px;width:210px";
            mainDiv.style.display = "inline-block";
            mainImg.height = (divHeight - (2 * borderW)) * .85;

            //mainImg.style.display = 'block';
            mainImg.style = "display:block;margin-left: auto;margin-right:auto;"

            mainDiv.appendChild(mainImg);

            $(mainDiv).append("<span name='imgBar' style='display:inline-block;text-align:center;width:100%'></span>");
            var imgBar = $(mainDiv).children("span[name='imgBar']");

            console.log("imgBar", Object.keys(imgBar));

            showBlock.append(mainDiv);


            for (let j = 0; j <= fileCount - 1; j++) { //limit 3 files
                console.log("working on file: " + j, typeof fileArray);

                const div = document.createElement("div");
                const img = document.createElement("img");


                if (fileArray[j]) { //this is an array of strings in client

                    var arraybuf = new Uint8Array(toArrayBuffer(fileArray[j]));
                    img.src = URL.createObjectURL(new Blob([arraybuf], { type: "image/png" }));
                    if (j == 0) mainImg.src = img.src;

                    //ex from stackoverflow
                    //var imgsrc = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array([137,80,78,71,13,10,26,10,0,...])));

                    console.log("URL: " + img.src);

                    //below works
                    //img.src = 'data:image/jpeg;base64,' + fileArray[j].toString('base64');
                    //img.height = 60;
                    img.height = divHeight * .15;

                    img.onload = function() {
                        URL.revokeObjectURL(this.src);
                        console.log(this.src)
                            //this.src = "";
                    }
                    img.onerror = function() {
                        this.onerror = null;
                        this.src = 'https://placeimg.com/200/300/animals';
                        this.alt = "IMAGE LOADING ERR";
                    }

                } else {
                    img.src = 'https://placeimg.com/200/300/animals';
                    img.alt = "DEFAULT IMAGE LOADED";
                    img.height = divHeight * .15;
                    img.title = "DEFAULT IMAGE LOADED";
                    if (j == 0) mainImg.src = img.src;

                }
                div.appendChild(img);
                //const info = document.createElement("span");
                //info.innerText = fileList[j].name + ": " + fileList[j].size + " bytes";
                //info.innerText = fileList[j].size + " bytes ";

                //div.appendChild(info);
                div.style.display = 'inline';
                $(imgBar).append(div); //append into the bottom display panel


            }
            //showBlock.style.display = "inline-block";

        } //endof hasOwnproperty
    })
}

function submitPost(website, postDate, caption, event) {



}

function newPostHandler(event) {
    var newWin = window.open('/createPost.ejs', '_blank');

}


function toArrayBuffer(base64) { //no 'Buffer class in client only on Node.js server

    var bin_string = window.atob(base64);
    //var base64_str = base64.toString('base64');
    var base64_str = base64;
    //console.log(base64_str)

    /*//only works on Serverside (node.js)
    excepts input to be a buffer type
    let ab = buf.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    return ab;
    */

    // longer version for pre v4 Node & clientside
    var ab = new ArrayBuffer(bin_string.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < bin_string.length; i++) {
        view[i] = bin_string.charCodeAt(i);
    }
    //console.log(ab)

    //return new Blob([ab], { type: 'image/jpeg' });
    return ab;

}

function toBuffer(ab) { //arraybuffer

    var buffer = Buffer.from(new Uint8Array(ab));
    return buffer;

    /*//for pre Node.js v4
        var buf = Buffer.alloc(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; i++) {
            buf[i] = view[i];
        }
        return buf;
        */

}

function buildImgDiv(postData) {

    var mainDiv = document.createElement('div');
    mainDiv.className += "showPostContainer";

    for (let j = 0; j < postData.length; j++) {

        var mainDiv = document.createElement('div');
        mainDiv.className += "showPostContainer";

        let pText = postData[j]['caption'];
        let pDate = postData[j]['postDate'];
        let pService = postData[j]['service'];
        let pTitle = postData[j]['title'];
        let pUser = postData[j]['userName'];
        let pFiles = postData[j]['files']; //array of bytes

        let divText = document.createElement('div');
        divText.innerHTML = pDate + "\n<span style='bold'>" + pTitle + "</span>\n" + pText + "\n";
        let divServ = document.createElement('div');
        divServ.innerHTML = pService;

        mainDiv.appendChild(pService);
        if (isArray(pFiles)) {

            pFiles.forEach((dbBuffer, ind) => {
                let pImg = document.createElement('img');
                let arraybuf = new Uint8Array(toArrayBuffer(dbBuffer));
                pImg.src = URL.createObjectURL(new Blob([arraybuf], { type: "image/png" }));
                pImg.onload = function() {
                    URL.revokeObjectURL(this.src);
                }
                mainDiv.appendChild(pImg);

            });

        } else {
            var img = document.createElement('img');
            var arraybuf = new Uint8Array(toArrayBuffer(pService));
            img.src = URL.createObjectURL(new Blob([arraybuf], { type: "image/png" }));
            mainDiv.appendChild(img);
        }


        mainDiv.appendChild(divText);


    }


}