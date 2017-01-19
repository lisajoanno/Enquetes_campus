var xhr = new XMLHttpRequest;

var isValid = function () {
    var idBD = document.getElementById("idAnswer").getAttribute("myId");
    console.log("ID : "+ idBD);

    console.log("j'envoie : " + idBD);
    xhr.open("POST", "http://localhost:8888/master/isValid", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var json = {idAnswer : idBD};
    xhr.send(JSON.stringify(json));
};

var isNotValid = function () {
    var idBD = document.getElementById("idAnswer").getAttribute("myId");
    console.log("ID : "+ idBD);

    console.log("j'envoie : " + idBD);
    xhr.open("POST", "http://localhost:8888/master/isNotValid", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var json = {idAnswer : idBD};
    xhr.send(JSON.stringify(json));
};


