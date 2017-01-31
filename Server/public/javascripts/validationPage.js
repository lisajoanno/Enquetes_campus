var xhr = new XMLHttpRequest;
var url =  require('./constants').urlClient;

var isValid = function () {
    var idBD = document.getElementById("idAnswer").getAttribute("myId");
    xhr.open("POST", url + "/master/isValid", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log("j'ai posté dans isValid " + idBD);
    var json = {idAnswer : idBD};
    xhr.send(JSON.stringify(json));

    var showEnigma = document.getElementById("myEnigma");
    showEnigma.setAttribute("style", "display:none");

    var answerSent = document.getElementById("answerSent");
    answerSent.getElementsByTagName("p")[0].innerHTML = "Réponse validée.";
    answerSent.setAttribute("style", "display:block");
};

var isNotValid = function () {
    var idBD = document.getElementById("idAnswer").getAttribute("myId");

    xhr.open("POST", url + "/master/isNotValid", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log("j'ai posté dans isNotValid " + idBD);
    var json = {idAnswer : idBD};
    xhr.send(JSON.stringify(json));

    var showEnigma = document.getElementById("myEnigma");
    showEnigma.setAttribute("style", "display:none");

    var answerSent = document.getElementById("answerSent");
    answerSent.getElementsByTagName("p")[0].innerHTML = "Réponse non validée.";
    answerSent.setAttribute("style", "display:block");
};


