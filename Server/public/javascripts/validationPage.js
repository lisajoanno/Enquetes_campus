var xhr = new XMLHttpRequest;

var isValid = function () {
    var idBD = document.getElementById("idAnswer").getAttribute("myId");
    console.log("ID : "+ idBD);
    xhr.open("POST", "http://localhost:8888/master/isValid", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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
    console.log("ID : "+ idBD);

    console.log("j'envoie : " + idBD);
    xhr.open("POST", "http://localhost:8888/master/isNotValid", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var json = {idAnswer : idBD};
    xhr.send(JSON.stringify(json));

    var showEnigma = document.getElementById("myEnigma");
    showEnigma.setAttribute("style", "display:none");

    var answerSent = document.getElementById("answerSent");
    answerSent.getElementsByTagName("p")[0].innerHTML = "Réponse non validée.";
    answerSent.setAttribute("style", "display:block");
};


