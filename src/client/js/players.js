var ctx, particles;
module.exports = function(context,particleData) {
    ctx = context;
    particles = particleData;
    return exports;
}

exports.all = [];
exports.temp = [];

exports.drawMachineCode = function(player,delta) {
    drawPlayer(player,"#000","#fff");
    
    if (particles[player.id]) {
        for (var i=0;i<particles[player.id].length;i++) {
            var particle = particles[player.id][i];

            if (particle) {
                ctx.fillStyle = "rgba(0,255,0,"+particle.opacity+")";
                particle.opacity -= 0.01*delta;
                particle.position.x += particle.initialPosition.x/100*delta;
                particle.position.y += particle.initialPosition.y/100*delta;

                ctx.fillText(
                    particle.text,
                    player.position.x+particle.position.x-(ctx.measureText(particle.text).width/2),
                    player.position.y+particle.position.y+(ctx.measureText("M").width/2)
                );

                if (particle.opacity <= 0) particle = null;
            }
        }
    }
}
exports.drawASM = function(player,delta) {
    drawPlayer(player,"#00f","#fff");
}

function drawPlayer(player,mainCol,textCol) {
    ctx.fillStyle = mainCol;

    ctx.beginPath();
    ctx.arc(player.position.x,player.position.y,player.radius,0,2*Math.PI);
    ctx.fill();

    ctx.fillStyle = textCol;
    // M is used to get the height because its width is about equal to its height
    ctx.fillText(
        player.text,
        player.position.x-(ctx.measureText(player.text).width/2),
        player.position.y+(ctx.measureText("M").width/2)
    );
}