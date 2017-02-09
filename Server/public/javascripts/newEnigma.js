
var xhr = new XMLHttpRequest;

var url = 'https://web-map-project-si5.herokuapp.com';
//var url = 'http://localhost:8888';
var currentImageName = '';

var post = function () {

    var enigma = {
        "titre" : "",
        "coo" : {
            lat: 0,
            lng: 0
        },
        "image": "",
        "point" : 0,
        "contenu" : ""
    };

    enigma.titre = document.getElementById("titre").value;
    enigma.coo.lat = document.getElementById("lat").value;
    enigma.coo.lng = document.getElementById("lng").value;
    enigma.point = parseInt(document.getElementById("points").value);
    enigma.contenu = document.getElementById("contenu").value;
    enigma.image = 'enigmas-pics/' + currentImageName;
    xhr.open("POST", url + "/enigmas/new", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(enigma));
    alert("Enigme envoyée");

};

function dragLeaveHandler(event) {
    event.target.classList.remove('draggedOver');
}
function dragEnterHandler(event) {
    event.target.classList.add('draggedOver');
}
function dragOverHandler(event) {
    event.stopPropagation();
    event.preventDefault();
}
function dropHandler(event) {
    console.log('drop event');
    event.stopPropagation();
    event.preventDefault();
    event.target.classList.remove('draggedOver');
    var files = event.dataTransfer.files;
    var filesLen = files.length;
    var filenames = "";

    console.log(files.length + ' file(s) have been dropped:\n' + filenames);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload');

    xhr.onload = function() {
        console.log('Upload complete!');
    };

    var form = new FormData();
    for(var i=0; i < files.length; i++)
        form.append('file', files[i]);

    xhr.send(form);

    showUploadedImage(files[0].name);
}

function showUploadedImage(imageName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/uploads/'+imageName);

    xhr.onload = function(e) {
        var img = document.createElement("img");
        img.src = "/uploads/" + imageName;
        img.width=100;
        document.body.appendChild(img);
    };
    xhr.send();
    currentImageName = imageName;
}


