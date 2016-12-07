module.exports.draw = function(ctx,player,size) {
    var canvas = ctx.canvas;
    
    ctx.strokeStyle = "rgba(0,0,0,.5)";

    var xPos = -player.position.x%size;
    var yPos = -player.position.y%size;

    var width = canvas.width/size;
    var height = canvas.width/size;

    for (var i=0;i<width+1;i++) {
        ctx.beginPath();
        ctx.moveTo(i*size+xPos-canvas.width/2-player.velocity.x,-canvas.height);
        ctx.lineTo(i*size+xPos-canvas.width/2-player.velocity.x,canvas.height);
        ctx.stroke();
    }
    for (var i=0;i<height+1;i++) {
        ctx.beginPath();
        ctx.moveTo(-canvas.width,i*size+yPos-canvas.height/2-player.velocity.y);
        ctx.lineTo(canvas.width,i*size+yPos-canvas.height/2-player.velocity.y);
        ctx.stroke();
    }
}