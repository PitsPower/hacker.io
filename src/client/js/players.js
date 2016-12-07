var ctx;
module.exports = function(context) {
    ctx = context;
    return exports;
}

exports.all = [];

exports.createMachineCode = function(x,y) {
    var text = "";
    for (var i=0;i<4;i++) {
        text += ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"][~~(Math.random()*16)]
    }
    exports.all.push({
        type: "machine_code",
        text: text,
        position: {x:x,y:y},
        radius: 75,

        particles: [],

        speed: 5,
        accel: .5,
        friction: .9,
        velocity: {x:0,y:0}
    });
}

exports.drawMachineCode = function(player,delta) {
    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc(player.position.x,player.position.y,player.radius,0,2*Math.PI);
    ctx.fill();

    ctx.fillStyle = "#fff";
    // M is used to get the height because its width is about equal to its height
    ctx.fillText(
        player.text,
        player.position.x-(ctx.measureText(player.text).width/2),
        player.position.y+(ctx.measureText("M").width/2)
    );

    for (var i=0;i<player.particles.length;i++) {
        var particle = player.particles[i];

        if (particle) {
            ctx.fillStyle = "rgba(0,255,0,"+particle.opacity+")";
            particle.opacity -= 0.01*delta;
            particle.position.x += particle.initialPosition.x/100*delta;
            particle.position.y += particle.initialPosition.y/100*delta;

            if (particle.opacity <= 0) player.particles[i] = null;

            ctx.fillText(
                particle.text,
                player.position.x+particle.position.x-(ctx.measureText(particle.text).width/2),
                player.position.y+particle.position.y+(ctx.measureText("M").width/2)
            );
        }
    }
}