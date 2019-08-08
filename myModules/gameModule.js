const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const client = require(path.join(__dirname, '/../dbs/db.js'));
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
var myDB;
const lobbyMod = require(__dirname + '/lobbyModule.js');
const level1 = require(__dirname + '/level1.js');
const level2 = require(__dirname + '/level2.js');
const level3 = require(__dirname + '/level3.js');
const level4 = require(__dirname + '/level4.js');
const level5 = require(__dirname + '/level5.js');
const level6 = require(__dirname + '/level6.js');
const level7 = require(__dirname + '/level7.js');
const level8 = require(__dirname + '/level8.js');
const level9 = require(__dirname + '/level9.js');
const level10 = require(__dirname + '/level10.js');
//const levelList = [level2];
const levelList = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];

const testCollisions = function (obj1, obj2, vecteurX, vecteurY) {
  let collisionDetected = false;
  let horizontalCollision = false;
  let verticalCollision = false;
  let vectorXFinal = vecteurX;
  let vectoryFinal = vecteurY;

  // comparisons between hitbox player and other hitbox
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
        if (i === 0) {
          instance.player1Deaths += 1;
        } else {
          instance.player2Deaths += 1;
        }
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
  }
}

exports.mainLoop = function (serverSocketIO, instanceNumber, instancesList) {
  setInterval(function() {
    let instance = instancesList[instanceNumber];
    if (!instance.player1Disconnected && !instance.player1LeftGame && !instance.player2Disconnected && !instance.player2LeftGame) {
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
          let speed = 1;
          if (walls[i].isDoor.speed) {
            speed = walls[i].isDoor.speed;
          }
          if (walls[i].isDoor.horizMaxPot !== 0 && walls[i].isDoor.horizMaxPot > 0) {
            walls[i].isDoor.xGauge -= speed;
            walls[i].x -= speed;
          };
          if (walls[i].isDoor.horizMaxPot !== 0 && walls[i].isDoor.horizMaxPot < 0) {
            walls[i].isDoor.xGauge += speed;
            walls[i].x += speed;
          };
          if (walls[i].isDoor.vertMaxPot !== 0 && walls[i].isDoor.vertMaxPot > 0) {
            walls[i].isDoor.yGauge -= speed;
            walls[i].y -= speed;
          };
          if (walls[i].isDoor.vertMaxPot !== 0 && walls[i].isDoor.vertMaxPot < 0) {
            walls[i].isDoor.yGauge += speed;
            walls[i].y += speed;
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
      if(instance.player1EmoticonCounter > 0) {
        instance.player1EmoticonCounter--;
        if(instance.player1EmoticonCounter === 0) {
          instance.player1Emoticon = 0;
        }
      }
      if(instance.player2EmoticonCounter > 0) {
        instance.player2EmoticonCounter--;
        if(instance.player2EmoticonCounter === 0) {
          instance.player2Emoticon = 0;
        }
      }
    }

    // disconnection management
    if (instance.player1Disconnected || instance.player2Disconnected) {
      instance.disconnectionTimer --;
    } else if (instance.disconnectionTimer < 750) {
      instance.disconnectionTimer = 750;
    }

    // when disconnection timer reach 0 we end the match
    if (instance.disconnectionTimer <= 0) {
      instance.active = false;
    }

    serverSocketIO.to('room' + (instanceNumber + 1)).emit('updateFrontElements', instance);

    if (!instance.active) {
      clearInterval(thisLoop);
      if (instancesList[instanceNumber].victory) {
        serverSocketIO.to('room' + (instanceNumber + 1)).emit('setVictoryScreen', instancesList[instanceNumber]);
      } else {
        serverSocketIO.to('room' + (instanceNumber + 1)).emit('setGiveUpScreen', instancesList[instanceNumber]);
      }
      let newMatch = { 
        player1:instance.player1Name,
        player2:instance.player2Name,
        score:instance.player1Score + instance.player2Score,
        victory:instancesList[instanceNumber].victory,
        time:instance.elapsedTime*40,
        date:Date.now()
      }
      client.connect(uri, function () {
        myDB = client.get().db('twoPrisoners');
        let collection = myDB.collection('matchs');
        myDB.collection('matchs').insertOne(newMatch, function(err, insertRes) {
          if (err) throw err;
          console.log(insertRes.insertedId); //Here is the Id of the match !! useful to redirect the user to his match when he will click on "hourra !" button
          console.log("1 match inserted");
          collection = myDB.collection('users');

          const updateDBAfterMatch = function (instance) {
            updateDBAfterMatch.findPlayer1(instance);
          }

          updateDBAfterMatch.findPlayer1 = function(instance) {
            collection.find({name: instance.player1Name}).toArray(function(err, data){
              if (err) throw err;
              if (data[0] !== undefined){
                console.log('findPlayer1 fini');
                if (instance.player1Score > data[0].bestScore) {
                  updateDBAfterMatch.findPlayer1.updateScore(instance, data);
                } else {
                  updateDBAfterMatch.findPlayer1.updateMatchPlayed(instance, data);
                }
              }
            });
          }

          updateDBAfterMatch.findPlayer1.updateScore = function(instance) {
            collection.updateOne(
              {name: instance.player1Name},
              { $set: { bestScore: instance.player1Score } }, function(err,records){
                console.log('updateScore1 fini');
              updateDBAfterMatch.findPlayer1.updateMatchPlayed(instance, data);
            });
          }

          updateDBAfterMatch.findPlayer1.updateMatchPlayed = function(instance, data) {
            collection.updateOne(
              {name: instance.player1Name},
              { $set: { matchPlayed: data[0].matchPlayed+1, gameFinished: data[0].gameFinished+1 } }, function(err,records){
                console.log('updateMatchPlayed1 fini');
              if (instance.player1Score > data[0].bestScore) {
                updateDBAfterMatch.findPlayer1.updateBestTime(instance, data);
              } else {
                updateDBAfterMatch.findPlayer2(instance, data);
              }
            });
          }

          updateDBAfterMatch.findPlayer1.updateBestTime = function(instance, data) {
            collection.updateOne(
              {name: instance.player1Name},
              { $set: { bestTime: instance.elapsedTime } }, function(err,records){
                console.log('updateBestTime1 fini');
              updateDBAfterMatch.findPlayer2(instance, data);
            });
          }

          updateDBAfterMatch.findPlayer2 = function(instance, data) {
            collection.find({name: instance.player2Name}).toArray(function(err, data){
              if (err) throw err;
              if (data[0] !== undefined){
                console.log('findPlayer2 fini');
                if (instance.player2Score > data[0].bestScore) {
                  updateDBAfterMatch.findPlayer2.updateScore(instance, data);
                } else {
                  updateDBAfterMatch.findPlayer2.updateMatchPlayed(instance, data);
                }
              }
            });
          }

          updateDBAfterMatch.findPlayer2.updateScore = function(instance, data) {
            collection.updateOne(
              {name: instance.player2Name},
              { $set: { bestScore: instance.player2Score } }, function(err,records){
                console.log('updateScore2 fini');
              updateDBAfterMatch.findPlayer2.updateMatchPlayed(instance, data);
            });
          }

          updateDBAfterMatch.findPlayer2.updateMatchPlayed = function(instance, data) {
            collection.updateOne(
              {name: instance.player2Name},
               { $set: { matchPlayed: data[0].matchPlayed+1, gameFinished: data[0].gameFinished+1 } }, function(err,records){
                console.log('updateMatchPlayed2 fini');
              if (instance.player2Score > data[0].bestScore) {
                updateDBAfterMatch.findPlayer2.updateBestTime(instance, data);
              } else {
                updateDBAfterMatch.closeThis(instance);
              }
            });
          }

          updateDBAfterMatch.findPlayer2.updateBestTime = function(instance, data) {
            collection.updateOne(
              {name: instance.player2Name},
              { $set: { bestTime: instance.elapsedTime } }, function(err,records){
                console.log('updateBestTime2 fini');
              updateDBAfterMatch.closeThis(instance);
            });
          }

          updateDBAfterMatch.closeThis = function (instance) {
            client.close();
            serverSocketIO.to('room' + (instanceNumber + 1)).emit('showVictoryButton', instancesList[instanceNumber]);
            console.log('update en BDD finie')
          }

          updateDBAfterMatch(instance);
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

exports.showEmoticon = function (serverSocketIO, instanceNumber, socket, instancesList, emoticon, instanceRegex) {
  let instanceRequired = instanceRegex.exec(socket.handshake.headers.referer);
  let player;
  let playerIsDead;
  if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
    player = instancesList[instanceRequired - 1].rules.player1;
    playerIsDead = instancesList[instanceRequired - 1].player1isDead;
    if (player && !playerIsDead) {
      instancesList[instanceRequired - 1].player1EmoticonCounter = 75;
      instancesList[instanceRequired - 1].player1Emoticon = emoticon;
    }
  } else if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
    player = instancesList[instanceRequired - 1].rules.player2;
    playerIsDead = instancesList[instanceRequired - 1].player2isDead;
    if (player && !playerIsDead) {
      instancesList[instanceRequired - 1].player2EmoticonCounter = 75;
      instancesList[instanceRequired - 1].player2Emoticon = emoticon;
    }
  } else {
    return false
  }
}

exports.instanceGenerator = function (serverSocketIO, instanceId, instancesList) {
  let rules = 'ERROR RULES NOT CORRECTLY GENERATED !';
  if (levelList[instancesList[instanceId].level - 1] && levelList[instancesList[instanceId].level - 1].rules) {
    rules = JSON.parse(JSON.stringify(levelList[instancesList[instanceId].level - 1].rules));
  } else {
    // players have finished all levels, victory for them
    instancesList[instanceId].active = false;
    instancesList[instanceId].victory = true;
  }
  return rules;
}