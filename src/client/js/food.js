var ctx;
module.exports = function(context) {
    ctx = context;
    return exports;
}

exports.draw = function(x,y) {
    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc(x,y,30,0,2*Math.PI);
    ctx.fill();

    var text = +(Math.random()>.5);
    
    ctx.fillStyle = "#0f0";
    // M is used to get the height because its width is about equal to its height
    ctx.fillText(
        text,
        x-(ctx.measureText(text).width/2),
        y+(ctx.measureText("M").width/2)
    );
}