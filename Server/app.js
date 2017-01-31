var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var accessEnigmas = require('./routes/accessEnigmas');
var gameMaster = require('./routes/validationGameMaster');
var team = require('./routes/team');

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);


var PORT = process.env.PORT || 8888;
var HOST = process.env.HEROKU_URL || '0.0.0.0';


require('./db/connection').connect(function () {

    server.listen(PORT, HOST, function() {
        console.log('Listening on port %d', PORT);
    });

    // placed after connect() because it needs initialized databases
    require('./db/enigmasDB').init();
    require('./db/teamDB').init();
    require('./db/validationDB').init();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));


/**
 * Enricher of the request : all origins are accepted.
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();
});


/**
 * Environment : Ecolo jusqu'au bout ! Coucou =)
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




app.use('/', index);
app.use('/access', accessEnigmas);
app.use('/master', gameMaster);
app.use('/team', team);


/**
 * catch 404 and forward to error handler
  */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// ------------ SOCKETS ----------



// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room'];

// required to emit on correct socket
var validationDB = require('./db/validationDB');

// on stocke tous les clients pour récup leur socket après, via leur id session
var clients = {};

io.sockets.on('connection', function (socket) {
    clients[socket.id] = socket;
    validationDB.setSockets(clients);

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // store the username in the socket session for this client
        socket.username = username;
        // store the room name in the socket session for this client
        socket.room = 'room';
        // add the client's username to the global list
        usernames[username] = username;
        // send client to the room
        socket.join('room');;
        // echo to room that a person has connected to the room
        socket.emit('updateusernames', usernames, username, 'username');
        socket.broadcast.to('room').emit('updateusername', username, 'username');
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        io.sockets.emit('removeuser', socket.username, 'username');
        // echo globally that this client has left
        socket.broadcast.to('room').emit('removeuser', socket.username, 'username');
        socket.leave(socket.room);
    });

    socket.on('addvalidation', function(data) {
        data.socketId = socket.id;
        data.result = "";

        validationDB.addAValidation(data, function () {
            io.sockets.emit('sentvalidation', 'rien');
        });
    });
});

module.exports = app;

