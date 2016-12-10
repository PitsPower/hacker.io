module.exports.all = [];

module.exports.create = function(x,y) {
    module.exports.all.push({
        text: +(Math.random()>.5),
        position: {x:x,y:y}
    });
}