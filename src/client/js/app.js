var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var grid = require("./grid");
var players = require("./players")(ctx);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = "40px Lucida Console";
ctx.translate(canvas.width/2,canvas.height/2);

function addParticle(player) {
    var text = +(Math.random()>.5);

    var angle = (Math.random()*Math.PI*2)-(Math.PI);

    var xPos = player.radius*Math.cos(angle);
    var yPos = player.radius*Math.sin(angle);

    player.particles.push({
        text: text,
        position: {x:xPos,y:yPos},
        initialPosition: {x:xPos,y:yPos},
        opacity: 1
    });
}

players.createMachineCode(0,0);

var keys = {
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83
};
var keysDown = [];
document.onkeydown = function(e) {
    keysDown[e.keyCode] = true;
}
document.onkeyup = function(e) {
    keysDown[e.keyCode] = false;
}

var prevTime = performance.now();
function render() {
    requestAnimationFrame(render);

    var time = performance.now();
    var delta = (time-prevTime)/17;

    var player = players.all[0];

    ctx.translate(player.position.x,player.position.y);
    ctx.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);

    grid.draw(ctx,player,80);

    if (keysDown[keys.LEFT]) player.velocity.x -= player.accel;
    if (keysDown[keys.RIGHT]) player.velocity.x += player.accel;
    if (keysDown[keys.UP]) player.velocity.y -= player.accel;
    if (keysDown[keys.DOWN]) player.velocity.y += player.accel;

    if (player.velocity.x>player.speed) player.velocity.x=player.speed;
    if (player.velocity.y>player.speed) player.velocity.y=player.speed;

    player.velocity.x*=player.friction;
    player.velocity.y*=player.friction;

    player.position.x+=player.velocity.x*delta;
    player.position.y+=player.velocity.y*delta;

    ctx.translate(-player.position.x,-player.position.y);

    ctx.fillStyle = "#fff";
    ctx.fillRect(-100,-100,200,200);

    for (var i=0;i<players.all.length;i++) {
        var player = players.all[i];
        if (player.type=="machine_code") {
            players.drawMachineCode(player,delta);
        }

        var particle = Math.random()>.9;
        if (particle) addParticle(player);
    }

    prevTime = time;
}

render();