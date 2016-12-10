var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var players = require('./players');
var food = require('./food');

app.use(express.static(__dirname+'/../client'));

var keys = {
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83,
    SPACE: 32
};

var sockets = [];

io.on('connection', function(socket) {
    var socketID = sockets.length;
    sockets.push(socket);
    socket.emit('player-id', socketID);
    
    players.create(['machine','asm','c'][~~(Math.random()*3)],0,0);
    players.all[socketID].id = socketID;
    
    socket.on('keydown', function(keyCode) {
        players.all[socketID].keysDown[keyCode] = true;
    });
    socket.on('keyup', function(keyCode) {
        players.all[socketID].keysDown[keyCode] = false;
    });
    
    socket.on('shift-id', function(keyCode) {
        socketID--;
    });
    socket.on('disconnect', function() {
        sockets.splice(socketID,1);
        players.all.splice(socketID,1);
        
        for (var i=socketID;i<sockets.length;i++) {
            sockets[i].emit('shift-id');
        }
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
            
            if (player.keysDown[keys.SPACE]) player.radius += 1;

            if (player.velocity.x>player.speed) player.velocity.x=player.speed;
            if (player.velocity.y>player.speed) player.velocity.y=player.speed;

            player.velocity.x*=player.friction;
            player.velocity.y*=player.friction;

            player.position.x+=player.velocity.x;
            player.position.y+=player.velocity.y;
        }
        for (var j=0;j<players.all.length;j++) {
            var thisPlayer = players.all[j];

            if (player && thisPlayer && i!=j) {
                var deltaX = thisPlayer.position.x-player.position.x;
                var deltaY = thisPlayer.position.y-player.position.y;
                
                var distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);

                if (distance<player.radius+thisPlayer.radius) {
                    var angle = Math.atan(deltaY/deltaX);
                    var pushDistance = player.radius+thisPlayer.radius-distance;
                    var newX = pushDistance * Math.cos(angle);
                    var newY = deltaX<=0 ? pushDistance : pushDistance * Math.sin(angle);
                    
                    newX *= deltaX>0?-1:1;
                    newY *= deltaY>0?-1:1;
                    
                    player.position.x += newX;
                    player.position.y += newY;
                }
            }
        }
        for (var j=0;j<food.all.length;j++) {
            var thisFood = food.all[j];

            if (player && thisFood) {
                var deltaX = thisFood.position.x-player.position.x;
                var deltaY = thisFood.position.y-player.position.y;

                if (deltaX*deltaX+deltaY*deltaY<Math.pow(player.radius+30,2)) {
                    food.all.splice(j,1);
                    player.radius += 5;
                }
            }
        }
    }
    if (Math.random()>.99) food.create(Math.random()*1000-500,Math.random()*1000-500);
    
    var packetData = [];
    
    for (var i=0;i<players.all.length;i++) {
        var player = players.all[i];
        packetData.push(
            parseInt(player.type,36),
            parseInt(player.text.toLowerCase(),36),
            player.position.x,
            player.position.y,
            player.radius,
            player.velocity.x,
            player.velocity.y
        );
    }
    packetData.push(999999999);
    for (var i=0;i<food.all.length;i++) {
        var thisFood = food.all[i];
        packetData.push(
            thisFood.text,
            thisFood.position.x,
            thisFood.position.y
        );
    }
    
    var slimmerState = new Float64Array(packetData);
    var ucharView = new Uint8Array(slimmerState.buffer);
    var packetMessage = String.fromCharCode.apply(
        String, [].slice.call(ucharView,0)
    );
    
    for (var i=0;i<sockets.length;i++) {
        var socket = sockets[i];
        if (socket) socket.emit('packet-data', packetMessage);
    }
}
setInterval(calculate,1000/60);

server.listen(3000, '192.168.0.150');