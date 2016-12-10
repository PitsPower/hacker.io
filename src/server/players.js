module.exports.all = [];

module.exports.create = function(type,x,y) {
    var text = "";
    if (type=="machine_code") {
        for (var i=0;i<4;i++) {
            text += ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"][~~(Math.random()*16)]
        }
    } else {
        text = type.toUpperCase();
    }
    module.exports.all.push({        
        type: type,
        text: text,
        position: {x:x,y:y},
        radius: 75,

        speed: 5,
        accel: .5,
        friction: .9,
        velocity: {x:0,y:0},
        
        keysDown: []
    });
}