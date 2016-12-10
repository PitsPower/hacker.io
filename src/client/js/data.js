module.exports.decompress = function(data) {
    var players = [];
    var food = [];
    
    data = group(separate(decode(data)));
    
    var playersData = data[0];
    for (var i=0;i<playersData.length;i++) {
        var playerData = playersData[i];

        if (playerData) {
            var uncompressedPlayerData = {
                type: playerData[0].toString(36),
                text: playerData[1].toString(36).toUpperCase(),
                position: {
                    x: playerData[2],
                    y: playerData[3]
                },
                radius: playerData[4],
                velocity: {
                    x: playerData[5],
                    y: playerData[6]
                }
            };
        }

        players.push(uncompressedPlayerData);
    }
    var foodsData = data[1];
    for (var i=0;i<foodsData.length;i++) {
        var foodData = foodsData[i];

        if (foodData) {
            var uncompressedFoodData = {
                text: foodData[0],
                position: {
                    x: foodData[1],
                    y: foodData[2]
                }
            };
        }

        food.push(uncompressedFoodData);
    }
    
    return {players:players,food:food};
}

function group(data) {
    var playerData = [];
    var foodData = [];
    
    for (var i=0;i<data.length;i++) {
        if (data[i].length==7) playerData.push(data[i]);
        if (data[i].length==3) foodData.push(data[i]);
    }
    
    return [playerData,foodData];
}

function separate(data) {
    var newData = [];
    
    var pushFood = false;
    for (var i=0,add=7;i<data.length-1;i+=add) {
        if (data[i]==999999999) {
            pushFood = true;
            add = 3;
        }
        
        var dataToPush = [];
        for (var j=pushFood?1:0;j<add+(pushFood?1:0);j++) {
            dataToPush.push(data[i+j]);
        }

        newData.push(dataToPush);
    }
    
    return newData;
}

function decode(data) {
    var decodeBuffer = new ArrayBuffer(data.length);
    var decodeView = new Uint8Array(decodeBuffer);
    
    for (var i=0;i<data.length;i++) {
        decodeView[i] = data.charCodeAt(i);
    }
    
    return new Float64Array(decodeBuffer);
}