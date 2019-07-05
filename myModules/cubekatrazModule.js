const cookieParser = require('cookie-parser');
const level1 = require(__dirname + '/level1.js');

exports.getHandshakeId = function (socket) {
  const cookieRegex = /connect.sid\=([^;]+)/g;
  let userID = cookieRegex.exec(cookieParser.JSONCookies(socket.handshake.headers.cookie));
  if (!userID) {
    return false
  }
  userID = userID[0].substr(12, userID[0].length);
  if (userID) {
    return userID;
  } else {
    return false
  }
}

exports.updateAvatarslots = function (server, socket, avatarSlot1, avatarSlot2) {
  var target = server;
  if (socket) {
    target = socket;
  }
  target.emit('updateFrontAvatarslots', {
    slot1: {
      avatarSlot1: 'images/portraits/' + avatarSlot1.image,
      status: avatarSlot1.status,
      name: avatarSlot1.name
    },
    slot2: {
      avatarSlot2: 'images/portraits/' + avatarSlot2.image,
      status: avatarSlot2.status,
      name: avatarSlot2.name
    }
  });
};

exports.updateAntichamberStatus = function (serverSocketIO, avatarSlot1, avatarSlot2) {
  var antichamberStatusText;
  if (avatarSlot1.status === 'empty' && avatarSlot2.status === 'empty') {
    antichamberStatusText = 'Aucun prisonnier n\'est sur le point de s\'évader';
  } else if ((avatarSlot1.status !== 'empty' && avatarSlot2.status === 'empty') || (avatarSlot1.status === 'empty' && avatarSlot2.status !== 'empty')) {
    antichamberStatusText = 'Un prisonnier veut s\'échapper';
  } else {
    antichamberStatusText = 'Evasion imminente !';
  }
  serverSocketIO.emit('updateAntichamberStatusBack', antichamberStatusText);
};

exports.getCubeAvatar = function (image) {
  if (image === 'rick.jpg') {
    return [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 20,
      color: '#BADEEE'
    },
    {
      x: 0,
      y: 20,
      width: 50,
      height: 30,
      color: '#FF6600'
    }
    ]
  } else if (image === 'cody.jpg') {
    return [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 10,
      color: '#E5ECF4'
    },
    {
      x: 0,
      y: 10,
      width: 50,
      height: 10,
      color: '#4C5EC8'
    },
    {
      x: 0,
      y: 20,
      width: 50,
      height: 10,
      color: '#E5ECF4'
    },
    {
      x: 0,
      y: 30,
      width: 50,
      height: 10,
      color: '#4C5EC8'
    },
    {
      x: 0,
      y: 40,
      width: 50,
      height: 10,
      color: '#E5ECF4'
    }
    ]
  } else {
    return [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 10,
      color: '#FFE80E'
    },
    {
      x: 0,
      y: 10,
      width: 50,
      height: 10,
      color: '#090901'
    },
    {
      x: 0,
      y: 20,
      width: 50,
      height: 10,
      color: '#FFE80E'
    },
    {
      x: 0,
      y: 30,
      width: 50,
      height: 10,
      color: '#090901'
    },
    {
      x: 0,
      y: 40,
      width: 50,
      height: 10,
      color: '#FFE80E'
    }
    ]
  }
}

exports.initiateEvasionCountDown = function (serverSocketIO, countDownStarted, countDownForbidden, instancesList, avatarSlot1, avatarSlot2) {
  if (!countDownStarted) {
    let countDownValue = 125; // 125*40(intervals in ms) = 5 seconds
    let countDownText;
    countDownStarted = true;

    let countDownInterval = setInterval(function () {
      countDownText = Math.round(countDownValue * 40 / 1000);
      if (countDownValue <= 0 || countDownForbidden) {
        serverSocketIO.emit('EvasionCountDownBackFinished');
        clearInterval(countDownInterval);
        countDownForbidden = false;
        countDownStarted = false;
        if (countDownValue <= 0) {
          instancesList.push({
            player1Id: avatarSlot1.status,
            player1Name: avatarSlot1.name,
            player1Image: avatarSlot1.image,
            player1Avatar: exports.getCubeAvatar(avatarSlot1.image),
            player1Score: 0,
            player2Id: avatarSlot2.status,
            player2Name: avatarSlot2.name,
            player2Image: avatarSlot2.image,
            player2Avatar: exports.getCubeAvatar(avatarSlot2.image),
            player2Score: 0,
            level: 1,
            active: true
          });
          instancesList[instancesList.length - 1].rules = instanceGenerator(instancesList.length - 1, instancesList);
          var destination = '/game/' + instancesList.length;
          serverSocketIO.emit('redirectToGameInstance', {
            url: destination,
            player1: avatarSlot1.name,
            player2: avatarSlot2.name
          });
          console.log('instance creation : ' + instancesList.length);
        }
      } else {
        serverSocketIO.emit('updateEvasionCountDownBack', countDownText);
        countDownValue--;
      }
    }, 40);
  }
}

exports.emptySlot = function (socket, playerList, avatarSlot1, avatarSlot2) {
  let leavingName;
  for (var i = 0; i < playerList.length; i++) {
    if (exports.getHandshakeId(socket) === playerList[i].id) {
      leavingName = playerList[i].name;
    }
  }
  if (avatarSlot1.status === exports.getHandshakeId(socket)) {
    avatarSlot1.status = 'empty';
    avatarSlot1.image = 'jail.jpg';
    avatarSlot1.name = 'vide';
    return {
      slot: 1,
      id: exports.getHandshakeId(socket),
      name: leavingName
    }
  } else if (avatarSlot2.status === exports.getHandshakeId(socket)) {
    avatarSlot2.status = 'empty';
    avatarSlot2.image = 'jail.jpg';
    avatarSlot2.name = 'vide';
    return {
      slot: 2,
      id: exports.getHandshakeId(socket),
      name: leavingName
    }
  } else {
    return {
      id: exports.getHandshakeId(socket)
    }
  }
}

var testCollisions = function (obj1, obj2, vecteurX, vecteurY) {
  var collisionDetected = false;
  var horizontalCollision = false;
  var verticalCollision = false;

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
    }
    //If vertical collision detected, block vertical moves
    if (obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width) {
      collisionDetected = true;
      verticalCollision = true;
    }
  }
  return {collisionDetected, horizontalCollision, verticalCollision}
}

exports.mainLoop = function (serverSocketIO, instanceNumber, instancesList) {
  setInterval(function() {
    let collisionHorizontaleDetectee = false;
    let collisionVerticaleDetectee = false;
    let player;
    let walls = instancesList[instanceNumber].rules.walls;
    let switches;
    if (instancesList[instanceNumber].rules.switches) {
      switches = instancesList[instanceNumber].rules.switches;
    }

    for (var i = 0; i < 2; i++) {
      let vecteurX = 0;
      let vecteurY = 0;
      if (i === 0) {
        player = instancesList[instanceNumber].rules.player1;
      } else {
        player = instancesList[instanceNumber].rules.player2;
      }

      if (player.movingLeft) {
        vecteurX = -8;
      }
      if (player.movingRight) {
        vecteurX = 8;
      }
      if (player.movingUp) {
        vecteurY = -8;
      }
      if (player.movingDown) {
        vecteurY = 8;
      }

      // canvas border collisions tests
      // horizontal test
      if (player.x + vecteurX > 0 && player.x + player.width + vecteurX < instancesList[instanceNumber].rules.levelDimension.width) {
        collisionHorizontaleDetectee = false;
      } else {
        collisionHorizontaleDetectee = true;
      }
      // vertical test
      if (player.y + vecteurY > 0 && player.y + player.height + vecteurY < instancesList[instanceNumber].rules.levelDimension.height) {
        collisionVerticaleDetectee = false;
      } else {
        collisionVerticaleDetectee = true;
      }

      // test set up collisions
      for (var j = 0; j < walls.length; j++) {
        // test a collision
        var getCollisions = testCollisions(player, walls[j], vecteurX, vecteurY);

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

      // test switches
      if (switches) {
        for (var k = 0; k < switches.length; k++) {
          // test a collision
          var getCollisions = testCollisions(player, switches[k], vecteurX, vecteurY);
          
          // resolve specific collisions
          if (getCollisions.collisionDetected && !switches[k].activated) {
            for (let l = 0; l < walls.length; l++) {
              if (walls[l].isDoor && switches[k].id === walls[l].isDoor.id && !walls[l].isDoor.activated) {
                walls[l].isDoor.activated = true;
                switches[k].activated = true;
              }
            }
          }
        }
      }
  
      // player1 moves
      if (!collisionHorizontaleDetectee) {
        player.x += vecteurX;
      }
      if (!collisionVerticaleDetectee) {
        player.y += vecteurY;
      }
    }
    
    // Activated doors moves
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].isDoor && walls[i].isDoor.activated) {
        if (walls[i].isDoor.xGauge === 0 && walls[i].isDoor.yGauge === 0) {
          walls[i].isDoor.activated = false;
        }
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
      }
    }

    //Fire walls moves
    instancesList[instanceNumber].rules.instanceCounter += 0.05;
    for (var i = 0; i < walls.length; i++) {
      if (walls[i].isFire) {
        walls[i].x += Math.sin(instancesList[instanceNumber].rules.instanceCounter) * 4
      }
    }

    serverSocketIO.emit('updateFrontElements', instancesList[instanceNumber]);
  }, 40);
};

exports.updatePlayerMoves = function (socket, instancesList, moves, instanceRegex) {
  let instanceRequired = instanceRegex.exec(socket.handshake.headers.referer);
  let player;
  if (exports.getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
    player = instancesList[instanceRequired - 1].rules.player1;
  } else if (exports.getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
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

instanceGenerator = function (instanceId, instancesList) {
  let rules = 'ERROR RULES NOT CORRECTLY GENERATED !';
  if (instancesList[instanceId].level === 1) {
    rules = level1.rules;
  } else if (instancesList[instanceId].level === 2) {
    rules = level1.rules;
  }
  return rules;
}

exports.getAvatarImage = function (changingSlot, otherSlot, avatarList) {
  if (changingSlot.image === 'jail.jpg') {
    if (otherSlot.image !== avatarList[0]) {
      changingSlot.image = avatarList[0];
    } else {
      changingSlot.image = avatarList[1];
    }
  } else {
    for (var i = 0; i < avatarList.length; i++) {
      if (changingSlot.image === avatarList[i]) {
        if (otherSlot.image !== avatarList[(i + 1) % avatarList.length]) {
          changingSlot.image = avatarList[(i + 1) % avatarList.length];
        } else {
          changingSlot.image = avatarList[(i + 2) % avatarList.length];
        }
        i = avatarList.length;
      }
    }
  }
  return changingSlot.image
}