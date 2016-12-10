var ctx;
module.exports = function(context) {
    ctx = context;
    return exports;
}

exports.draw = function(food) {
    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.arc(food.position.x,food.position.y,30,0,2*Math.PI);
    ctx.fill();
    
    ctx.fillStyle = "#0f0";
    // M is used to get the height because its width is about equal to its height
    ctx.fillText(
        food.text,
        food.position.x-(ctx.measureText(food.text).width/2),
        food.position.y+(ctx.measureText("M").width/2)
    );
}