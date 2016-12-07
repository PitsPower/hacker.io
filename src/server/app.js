var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var players = require('./players');

app.use(express.static(__dirname+'/../client'));

var keys = {
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83
};
var keysDown = [];

var sockets = [];

io.on('connection', function(socket) {
    var socketID = sockets.length;
    sockets.push(socket);
    
    players.createMachineCode(0,0);
    players.all[socketID].id = socketID;
    
    socket.on('keydown', function(keyCode) {
        players.all[socketID].keysDown[keyCode] = true;
    });
    socket.on('keyup', function(keyCode) {
        players.all[socketID].keysDown[keyCode] = false;
    });
    
    socket.on('disconnect', function() {
        sockets[socketID] = null;
        players.all[socketID] = null;
    });
});

function calculate() {
    for (var i=0;i<players.all.length;i++) {
        var player = players.all[i];
        
        if (player) {
            if (player.keysDown[keys.LEFT]) player.velocity.x -= player.accel;
            if (player.keysDown[keys.RIGHT]) player.velocity.x += player.accel;
            if (player.keysDown[keys.UP]) player.velocity.y -= player.accel;
            if (player.keysDown[keys.DOWN]) player.velocity.y += player.accel;

            if (player.velocity.x>player.speed) player.velocity.x=player.speed;
            if (player.velocity.y>player.speed) player.velocity.y=player.speed;

            player.velocity.x*=player.friction;
            player.velocity.y*=player.friction;

            player.position.x+=player.velocity.x;
            player.position.y+=player.velocity.y;
        }
    }
    for (var i=0;i<sockets.length;i++) {
        var socket = sockets[i];
        if (socket) socket.emit('player-data', {id:i,players:players.all});
    }
}
setInterval(calculate,1000/60);

server.listen(3000, "192.168.0.150");