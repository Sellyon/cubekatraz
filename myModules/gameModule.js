const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const client = require(path.join(__dirname, '/../dbs/db.js'));
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
var myDB;
const lobbyMod = require(__dirname + '/lobbyModule.js');
const level1 = require(__dirname + '/level1.js');
const level2 = require(__dirname + '/level2.js');
const level3 = require(__dirname + '/level3.js');
const level4 = require(__dirname + '/level4.js');
const levelList = [level1, level2, level3, level4];

const testCollisions = function (obj1, obj2, vecteurX, vecteurY) {
  let collisionDetected = false;
  let horizontalCollision = false;
  let verticalCollision = false;
  let vectorXFinal = vecteurX;
  let vectoryFinal = vecteurY;

  // compraisons between hitbox player and other hitbox
  if (
    obj1.y + obj1.height + vecteurY > obj2.y
  && obj1.y + vecteurY < obj2.y + obj2.height
  && obj1.x + obj1.width + vecteurX > obj2.x
  && obj1.x + vecteurX < obj2.x + obj2.width
  ) {
  
    // If horizontal collision detected, block horizontal moves
    if (obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height) {
      collisionDetected = true;
      horizontalCollision = true;
      if (vecteurX > 0) {
        vecteurX = obj2.x - (obj1.x + obj1.width);
      } else if (vecteurX < 0) {
        vecteurX = (obj2.x + obj2.width) - obj1.x;
      }
    }
    //If vertical collision detected, block vertical moves
    if (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width) {
      collisionDetected = true;
      verticalCollision = true;
      if (vecteurY > 0) {
        vecteurY = obj2.y - (obj1.y + obj1.height);
      } else if (vecteurY < 0) {
        vecteurY = (obj2.y + obj2.height) - obj1.y;
      }
    }
  }
  return {collisionDetected, horizontalCollision, verticalCollision, vecteurX, vecteurY}
}

exports.mainLoop = function (serverSocketIO, instanceNumber, instancesList) {
  setInterval(function() {
    let playerSpeed = 10;
    let collisionHorizontaleDetectee = false;
    let collisionVerticaleDetectee = false;
    let collisionHorizontaleBorder = false;
    let collisionVerticaleBorder = false;
    let player;
    let otherPlayer;
    let walls = instancesList[instanceNumber].rules.walls;
    let switches;
    let finishZone = instancesList[instanceNumber].rules.finishZone;
    thisLoop = this;
    if (!instancesList[instanceNumber].active) {
      console.log('ERROR THIS LOOP SHOULD BE CLEARED : ', thisLoop);
    }
    if (instancesList[instanceNumber].rules.switches) {
      switches = instancesList[instanceNumber].rules.switches;
    }
    let coins;
    if (instancesList[instanceNumber].rules.coins) {
      coins = instancesList[instanceNumber].rules.coins;
    }

    for (var i = 0; i < 2; i++) {
      let vecteurX = 0;
      let vecteurY = 0;
      if (i === 0) {
        player = instancesList[instanceNumber].rules.player1;
        otherPlayer = instancesList[instanceNumber].rules.player2;
      } else {
        player = instancesList[instanceNumber].rules.player2;
        otherPlayer = instancesList[instanceNumber].rules.player1;
      }

      if (player.movingLeft) {
        vecteurX = -playerSpeed;
      }
      if (player.movingRight) {
        vecteurX = playerSpeed;
      }
      if (player.movingUp) {
        vecteurY = -playerSpeed;
      }
      if (player.movingDown) {
        vecteurY = playerSpeed;
      }

      // canvas border collisions tests
      // horizontal test
      if (player.x + vecteurX > 0 && player.x + player.width + vecteurX < instancesList[instanceNumber].rules.levelDimension.width) {
        collisionHorizontaleBorder = false;
      } else {
        collisionHorizontaleBorder = true;
        if (vecteurX > 0) {
          vecteurX = instancesList[instanceNumber].rules.levelDimension.width - (player.x + player.width);
        } else if (vecteurX < 0) {
          vecteurX = 0 - player.x;
        }
      }
      // vertical test
      if (player.y + vecteurY > 0 && player.y + player.height + vecteurY < instancesList[instanceNumber].rules.levelDimension.height) {
        collisionVerticaleBorder = false;
      } else {
        collisionVerticaleBorder = true;
        if (vecteurY > 0) {
          vecteurY = instancesList[instanceNumber].rules.levelDimension.height - (player.y + player.height);
        } else if (vecteurY < 0) {
          vecteurY = 0 - player.y;
        }
      }

      // test set up collisions
      for (var j = 0; j < walls.length; j++) {
        // test a collision
        let getCollisions = testCollisions(player, walls[j], vecteurX, vecteurY);
        vecteurX = getCollisions.vecteurX;
        vecteurY = getCollisions.vecteurY;

        // Horizontal collision detected
        if (getCollisions.horizontalCollision) {
          collisionHorizontaleDetectee = getCollisions.horizontalCollision;
        }

        // Vertical collision detected
        if (getCollisions.verticalCollision) {
          collisionVerticaleDetectee = getCollisions.verticalCollision;
        }

        // Diagonal collision detected
        if (getCollisions.collisionDetected && !getCollisions.verticalCollision && !getCollisions.horizontalCollision) {
          collisionHorizontaleDetectee = true;
          collisionVerticaleDetectee = true;
        }
        // resolve specific collisions
        if (getCollisions.collisionDetected) {
        }
      }

      // test player vs player collisions
      // test a collision
      let getCollisions = testCollisions(player, otherPlayer, vecteurX, vecteurY);
      vecteurX = getCollisions.vecteurX;
      vecteurY = getCollisions.vecteurY;

      // Horizontal collision detected
      if (getCollisions.horizontalCollision) {
        collisionHorizontaleDetectee = getCollisions.horizontalCollision;
      }

      // Vertical collision detected
      if (getCollisions.verticalCollision) {
        collisionVerticaleDetectee = getCollisions.verticalCollision;
      }

      // Diagonal collision detected
      if (getCollisions.collisionDetected && !getCollisions.verticalCollision && !getCollisions.horizontalCollision) {
        collisionHorizontaleDetectee = true;
        collisionVerticaleDetectee = true;
      }
      // resolve specific collisions
      if (getCollisions.collisionDetected) {
      }

      // test switches
      if (switches) {
        for (var k = 0; k < switches.length; k++) {
          // test a collision
          let getCollisions = testCollisions(player, switches[k], vecteurX, vecteurY);
          
          // resolve specific collisions
          if (getCollisions.collisionDetected && !switches[k].activated) {
            for (var l = 0; l < walls.length; l++) {
              if (walls[l].isDoor && switches[k].id === walls[l].isDoor.id && !walls[l].isDoor.activated) {
                walls[l].isDoor.activated = true;
                switches[k].activated = true;
              }
            }
          }
        }
      }

      // test coins
      if (coins) {
        for (var l = 0; l < coins.length; l++) {
          // test a collision
          let getCollisions = testCollisions(player, coins[l], vecteurX, vecteurY);

          // resolve specific collisions
          if (getCollisions.collisionDetected) {
            if (i === 0) {
              instancesList[instanceNumber].player1Score += 5;
            } else {
              instancesList[instanceNumber].player2Score += 5;
            }
            coins.splice(l, 1);
            l--;
          }
        }
      }

      // test finish zone
      // test a collision
      getCollisions = testCollisions(player, finishZone, vecteurX, vecteurY);

      // resolve specific collisions
      if (i === 0) {
        if (getCollisions.collisionDetected) {
         finishZone.player1InZone = true;
        } else {
          finishZone.player1InZone = false;
        }
      } else {
        if (getCollisions.collisionDetected) {
         finishZone.player2InZone = true;
        } else {
          finishZone.player2InZone = false;
        }
      }

      if (finishZone.player1InZone && finishZone.player2InZone) {
        instancesList[instanceNumber].level ++;
        let nextLevel = exports.instanceGenerator(serverSocketIO, instanceNumber, instancesList);
        if (typeof nextLevel === 'object') {
          instancesList[instanceNumber].rules = nextLevel;
        }
      }
  
      // player moves
      if (!collisionHorizontaleDetectee && !collisionHorizontaleBorder) {
        player.x += vecteurX;
      } else if (!collisionVerticaleDetectee) {
        player.x += vecteurX;
      }
      if (!collisionVerticaleDetectee && !collisionVerticaleBorder) {
        player.y += vecteurY;
      } else if (!collisionHorizontaleDetectee) {
        player.y += vecteurY;
      }
      if (collisionHorizontaleDetectee && collisionVerticaleDetectee) {

      }
    }
    
    // Activated doors moves
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].isDoor && walls[i].isDoor.activated) {
        if (walls[i].isDoor.horizMaxPot !== 0 && walls[i].isDoor.horizMaxPot > 0) {
          walls[i].isDoor.xGauge --;
          walls[i].x --;
        };
        if (walls[i].isDoor.horizMaxPot !== 0 && walls[i].isDoor.horizMaxPot < 0) {
          walls[i].isDoor.xGauge ++;
          walls[i].x ++;
        };
        if (walls[i].isDoor.vertMaxPot !== 0 && walls[i].isDoor.vertMaxPot > 0) {
          walls[i].isDoor.yGauge --;
          walls[i].y --;
        };
        if (walls[i].isDoor.vertMaxPot !== 0 && walls[i].isDoor.vertMaxPot < 0) {
          walls[i].isDoor.yGauge ++;
          walls[i].y ++;
        };
        if (walls[i].isDoor.xGauge === 0 && walls[i].isDoor.yGauge === 0) {
          walls[i].isDoor.activated = false;
        }
      }
    }

    //Fire walls moves
    instancesList[instanceNumber].rules.instanceCounter += 0.05;
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].isFire) {
        walls[i].x += Math.sin(instancesList[instanceNumber].rules.instanceCounter) * 4
      }
    }

    instancesList[instanceNumber].elapsedTime ++;

    if (instancesList[instanceNumber].active) {
      serverSocketIO.emit('updateFrontElements', instancesList[instanceNumber]);
    } else {
      clearInterval(thisLoop);
      serverSocketIO.emit('setVictoryScreen', instancesList[instanceNumber]);
      let newMatch = { 
        player1:instancesList[instanceNumber].player1Name,
        player2:instancesList[instanceNumber].player2Name,
        score:instancesList[instanceNumber].player1Score + instancesList[instanceNumber].player2Score,
        victory:true,
        time:instancesList[instanceNumber].elapsedTime*40,
        date:Date.now()
      }
      client.connect(uri, function () {
      myDB = client.get().db('twoPrisoners');
      let collection = myDB.collection('matchs');
        myDB.collection('matchs').insertOne(newMatch, function(err, insertRes) {
          if (err) throw err;
          console.log("1 match inserted");
          client.close();
        });
      });
    }
  }, 40);
};

exports.updatePlayerMoves = function (socket, instancesList, moves, instanceRegex) {
  let instanceRequired = instanceRegex.exec(socket.handshake.headers.referer);
  let player;
  if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
    player = instancesList[instanceRequired - 1].rules.player1;
  } else if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
    player = instancesList[instanceRequired - 1].rules.player2;
  } else {
    return false
  }
  if (player) {
    if (moves.movingUp === true || moves.movingUp === false) {
      player.movingUp = moves.movingUp;
    }
    if (moves.movingDown === true || moves.movingDown === false) {
      player.movingDown = moves.movingDown;
    }
    if (moves.movingLeft === true || moves.movingLeft === false) {
      player.movingLeft = moves.movingLeft;
    }
    if (moves.movingRight === true || moves.movingRight === false) {
      player.movingRight = moves.movingRight;
    }
  }
}

exports.instanceGenerator = function (serverSocketIO, instanceId, instancesList) {
  let rules = 'ERROR RULES NOT CORRECTLY GENERATED !';
  if (levelList[instancesList[instanceId].level - 1] && levelList[instancesList[instanceId].level - 1].rules) {
    rules = levelList[instancesList[instanceId].level - 1].rules;
  } else {
    instancesList[instanceId].active = false;
  }
  return rules;
}