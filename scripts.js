let status = false;
let msgData;
let msgJson;
//Angular App and controllers
let msgApp = angular.module('msgApp', ["ngRoute"]);
msgApp.config(function ($routeProvider){
    $routeProvider
        .when("/msg", {
            templateUrl: "msg.htm"
        });
});
msgApp.controller('msgCtrl',function ($scope, $http){
    $http.get('https://hemantdutta.github.io/JSON-Repo/WSD-LAB-8-MSG')
        .then(function (res){
            $scope.msgJson = res.data;
            msgData = res.data;
            console.log($scope.msgJson);
        })
});

let dataApp = angular.module('dataApp', ["ngRoute"]);
dataApp.config(function ($routeProvider){
    $routeProvider
        .when("/dataMan", {
            templateUrl: "dataMan.htm"
        })
        .when("/dataSearch", {
            templateUrl: "dataSearch.htm"
        });
});
dataApp.controller('dataCtrl',function ($scope, $http){
    $http.get('https://hemantdutta.github.io/JSON-Repo/WSD-LAB-8-DATA')
        .then(function (res){
            $scope.msgJson = res.data;
            msgJson = res.data;
            console.log($scope.msgJson);
        })
});

angular.bootstrap(document.getElementById('dataTab'), ['dataApp']);

//Loading animations
function onLoadAnim(){ //Transitions On Load
    let login = document.getElementById('login');
    login.style.transform = "translateY(0%)";
    login.style.opacity = "100";

}

function setCookie(cname, cvalue, exdays) { //for setting cookies in the browser
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) { //fetching cookie value by name
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function login(){ //login function to set cookies of username and password! Also, store image and convert it into a document URL
    let nameField = document.getElementById('username');
    let passField = document.getElementById('password');

    setCookie(nameField.id, nameField.value, 1);
    setCookie(passField.id, passField.value, 1);

    let profImg = document.getElementById('profileImg');
    profImg.src = imgSrc;

    let userName = getCookie('username');
    document.getElementById('profName').innerText = "Welcome "+userName;
}

//Saving the url of the image as a document object
let img = document.getElementById('img'); //getting image input tag [type: file]
let imgSrc; //Global variable to store url
img.onchange = evt => {
    const [file] = img.files; //storing uploaded file in an array/object
    if (file) { //if file exists
        imgSrc = URL.createObjectURL(file); //URL returns the document object's location as string and createObjectURL creates a url pointing to the file/object passed as the parameter
    }
}

//Checking if user is logged in
function checkLogin(){
    let logStatus = getCookie('username');
    console.log(logStatus);

    document.getElementById('mainCont').classList.remove('d-flex');
    let login = document.getElementById('login');
    let sideNav = document.getElementById('sideNav');
    let midForm = document.getElementById('MidForm');

    if(logStatus.length === 0){
        //Transition Out SideNav Midform
        sideNav.style.transform = "translateX(-50%)";
        midForm.style.transform = "translateX(-50%)";

        sideNav.style.opacity = "0";
        midForm.style.opacity = "0";

        //timeout function to wait previous transitions to finish
        setTimeout(function (){
            sideNav.classList.add('d-none'); //making sidebar and mid form invisible
            midForm.classList.add('d-none');

            login.classList.remove('d-none'); //making login form visible
            login.classList.add('d-flex');

            //timeout to handle login animations
            setTimeout(function (){
                login.style.transform = "translate(0%)";
                login.style.opacity = "100";
            }, 200)
        }, 800)
    }
    else{
        let profImg = document.getElementById('profileImg');
        profImg.src = imgSrc;


        let userName = getCookie('username');
        document.getElementById('profName').innerText = "Welcome "+userName;

        login.style.opacity = "0";
        login.style.transform = "translateY(-50%)";

        setTimeout(function (){
            login.classList.add('d-none');
            login.classList.remove('d-flex');

            document.getElementById('mainCont').classList.add('d-flex');
            sideNav.classList.remove('d-none');
            midForm.classList.remove('d-none');

            setTimeout(function (){
                sideNav.style.transform = "translateX(0%)";
                midForm.style.transform = "translateX(0%)";

                sideNav.style.opacity = "100";
                midForm.style.opacity = "100";
            }, 200)
        }, 800)

        fillDetails();

    }
}

function checkUser(){
    let name = document.getElementById('username');
    let nameResp = document.getElementById('nameResp');

    let nameReg = /^([a-zA-Z]){5,25}$/;
    let nameValid = nameReg.test(name.value);
    if (name.length === 0) {
        nameResp.classList.remove("text-success");
        nameResp.classList.add("text-danger");
        nameResp.innerText = "Enter a username!"
        status = false;
    } else if (!nameValid) {
        nameResp.classList.remove("text-success");
        nameResp.classList.add("text-danger");
        nameResp.innerText = "Username is invalid!"
        status = false;
    } else {
        nameResp.classList.remove("text-danger");
        nameResp.classList.add("text-success");
        nameResp.innerText = "Username is valid";
        status = true;
    }

    let password = document.getElementById('password').value;
    let passResp = document.getElementById('passResp');

    if(password.length === 0){
        passResp.classList.remove("text-success");
        passResp.classList.add("text-danger");
        passResp.innerText = "Enter a Password!"
        status = false;
    }
    else{
        passResp.classList.remove("text-danger");
        passResp.classList.add("text-success");
        passResp.innerText = "Password is valid";
        status = true;
    }

    if(status){
        login();
        checkLogin();
    }
    else{
        document.getElementById('btnResp').innerText = "Please enter correct credentials!"
    }
}

function fillDetails(){
    let username = getCookie('username');
    document.getElementById('profGreeting').innerText = `Hello There, ${username}`;
    document.getElementById('tabProfImg').src = imgSrc;
}


//Logout Function
function logout(){
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLogin();
}

function remClass(){
    if(window.innerWidth<1172){
        document.getElementById('sideNav').classList.remove('col-lg-1');
        document.getElementById('MidForm').classList.remove('col-lg-11');
        document.getElementById('menuH3').classList.add('d-none');
    }
    else{
        document.getElementById('sideNav').classList.add('col-lg-1');
        document.getElementById('MidForm').classList.add('col-lg-11');
        document.getElementById('menuH3').classList.remove('d-none');
    }
}

function displayNotif(){
    document.getElementById('dispBtn').classList.add('d-none');
}

function hideNotif(){
    document.getElementById('dispBtn').classList.remove('d-none');
}


function clickAdd(){
    document.getElementById('dataMan').click();
}

function clickView(){
    document.getElementById('searchMan').click();
}

function showInp(src){
    console.log(src)
    document.querySelectorAll(".srcInp").forEach(x=>{
        if(x.id !== src){
            console.log(x.value);
            x.classList.add('d-none');
        }
        else{
            console.log(x.value);
            x.classList.remove('d-none');
        }
    })
}


