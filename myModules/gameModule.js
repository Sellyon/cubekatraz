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
const level5 = require(__dirname + '/level5.js');
const level6 = require(__dirname + '/level6.js');
const level7 = require(__dirname + '/level7.js');
const levelList = [level1, level2, level3, level4, level5, level6, level7];

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

const playerDeath = function (instance, i) {
  let playerOpacity;
  if (i === 0) {
    instance.player1isDead = true;
  } else {
    instance.player2isDead = true;
  }
  let deathFade = setInterval(function ()
    {
      if (instance.player1Opacity <= 0 || instance.player2Opacity <= 0) {
        instance.rules = lobbyMod.copyObject(instance.checkpoint.rules);
        instance.player1Score = instance.checkpoint.player1Score;
        instance.player2Score = instance.checkpoint.player2Score;
        instance.player1Opacity = 1;
        instance.player2Opacity = 1;
        instance.player1isDead = false;
        instance.player2isDead = false;
        clearThisInterval();
      } else {
        if (i === 0) {
          instance.player1Opacity -= 0.04;
        } else {
          instance.player2Opacity -= 0.04;
        }
      }
    }, 40);
  let clearThisInterval = function () {
    clearInterval(deathFade);
    console.log('interval cleared');
  }
}

exports.mainLoop = function (serverSocketIO, instanceNumber, instancesList) {
  setInterval(function() {
    let instance = instancesList[instanceNumber];
    let playerSpeed = 10;
    let collisionHorizontaleDetectee = false;
    let collisionVerticaleDetectee = false;
    let collisionHorizontaleBorder = false;
    let collisionVerticaleBorder = false;
    let player;
    let otherPlayer;
    let walls = instance.rules.walls;
    let switches;
    let finishZone = instance.rules.finishZone;
    thisLoop = this;
    if (!instance.active) {
      console.log('ERROR THIS LOOP SHOULD BE CLEARED : ', thisLoop);
    }
    if (instance.rules.switches) {
      switches = instance.rules.switches;
    }
    let coins;
    if (instance.rules.coins) {
      coins = instance.rules.coins;
    }

    for (var i = 0; i < 2 && !instance.player1isDead && !instance.player2isDead; i++) {
      let vecteurX = 0;
      let vecteurY = 0;
      if (i === 0) {
        player = instance.rules.player1;
        otherPlayer = instance.rules.player2;
      } else {
        player = instance.rules.player2;
        otherPlayer = instance.rules.player1;
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
      if (player.x + vecteurX > 0 && player.x + player.width + vecteurX < instance.rules.levelDimension.width) {
        collisionHorizontaleBorder = false;
      } else {
        collisionHorizontaleBorder = true;
        if (vecteurX > 0) {
          vecteurX = instance.rules.levelDimension.width - (player.x + player.width);
        } else if (vecteurX < 0) {
          vecteurX = 0 - player.x;
        }
      }
      // vertical test
      if (player.y + vecteurY > 0 && player.y + player.height + vecteurY < instance.rules.levelDimension.height) {
        collisionVerticaleBorder = false;
      } else {
        collisionVerticaleBorder = true;
        if (vecteurY > 0) {
          vecteurY = instance.rules.levelDimension.height - (player.y + player.height);
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
          if (walls[j].isFire) {
            if (!instance.player1isDead && !instance.player2isDead) {
              playerDeath(instance, i);
            }
          }
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
              instance.player1Score += 5;
            } else {
              instance.player2Score += 5;
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
        instance.level ++;
        let nextLevel = exports.instanceGenerator(serverSocketIO, instanceNumber, instancesList);
        if (typeof nextLevel === 'object') {
          instance.rules = nextLevel;
          instance.checkpoint.rules = lobbyMod.copyObject(nextLevel);
          instance.checkpoint.player1Score = instance.player1Score;
          instance.checkpoint.player2Score = instance.player2Score;
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

    //Moving walls moves
    instance.rules.instanceCounter += 0.05;
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].isMoving) {
        walls[i].x += Math.sin(instance.rules.instanceCounter) * 4
      }
    }

    instance.elapsedTime ++;

    if (instance.active) {
      serverSocketIO.emit('updateFrontElements', instance);
    } else {
      clearInterval(thisLoop);
      serverSocketIO.emit('setVictoryScreen', instancesList[instanceNumber]);
      let newMatch = { 
        player1:instance.player1Name,
        player2:instance.player2Name,
        score:instance.player1Score + instance.player2Score,
        victory:true,
        time:instance.elapsedTime*40,
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
  let playerIsDead;
  if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
    player = instancesList[instanceRequired - 1].rules.player1;
    playerIsDead = instancesList[instanceRequired - 1].player1isDead;
  } else if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
    player = instancesList[instanceRequired - 1].rules.player2;
    playerIsDead = instancesList[instanceRequired - 1].player1isDead;
  } else {
    return false
  }
  if (player && !playerIsDead) {
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