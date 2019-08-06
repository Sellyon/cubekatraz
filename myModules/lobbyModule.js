const gameMod = require(__dirname + '/gameModule.js');
const cookieParser = require('cookie-parser');

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
      color: [186, 222, 238]
    },
    {
      x: 0,
      y: 20,
      width: 50,
      height: 30,
      color: [255, 102, 0]
    }
    ]
  } else if (image === 'cody.jpg') {
    return [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 10,
      color: [229, 236, 244]
    },
    {
      x: 0,
      y: 10,
      width: 50,
      height: 10,
      color: [76, 94, 200]
    },
    {
      x: 0,
      y: 20,
      width: 50,
      height: 10,
      color: [229, 236, 244]
    },
    {
      x: 0,
      y: 30,
      width: 50,
      height: 10,
      color: [76, 94, 200]
    },
    {
      x: 0,
      y: 40,
      width: 50,
      height: 10,
      color: [229, 236, 244]
    }
    ]
  } else {
    return [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 10,
      color: [255, 232, 14]
    },
    {
      x: 0,
      y: 10,
      width: 50,
      height: 10,
      color: [9, 9, 1]
    },
    {
      x: 0,
      y: 20,
      width: 50,
      height: 10,
      color: [255, 232, 14]
    },
    {
      x: 0,
      y: 30,
      width: 50,
      height: 10,
      color: [9, 9, 1]
    },
    {
      x: 0,
      y: 40,
      width: 50,
      height: 10,
      color: [255, 232, 14]
    }
    ]
  }
}

exports.copyObject = function (original) {
  // Function used to create checkpoint at the beginning of a room and reload when a player die
  try{
      var copy = JSON.parse(JSON.stringify(original));
  } catch(ex){
      alert("Vous utilisez un vieux navigateur bien pourri, qui n'est pas pris en charge par ce site");
  }
  return copy;
}

const setUpInstance = function (instancesList, avatarSlot1, avatarSlot2) {
  let newInstance = {
    player1Id: avatarSlot1.status,
    player1Name: avatarSlot1.name,
    player1Image: avatarSlot1.image,
    player1Opacity: 1,
    player1isDead: false,
    player1Disconnected: false,
    player1Avatar: exports.getCubeAvatar(avatarSlot1.image),
    player1Emoticon: 0,
    player1EmoticonCounter: 0,
    player1Score: 0,
    player1Deaths: 0,
    player2Id: avatarSlot2.status,
    player2Name: avatarSlot2.name,
    player2Image: avatarSlot2.image,
    player2Opacity: 1,
    player2isDead: false,
    player2Disconnected: false,
    disconnectionTimer: 750, // 750*40 = 30 000 ms
    player2Avatar: exports.getCubeAvatar(avatarSlot2.image),
    player2Emoticon: 0,
    player2EmoticonCounter: 0,
    player2Score: 0,
    player2Deaths: 0,
    level: 1,
    elapsedTime: 0,
    active: true,
    victory: false,
    checkpoint: {}
  };
  // Here we check if an instance is finished, if then, we take the slot for a new instance
  for (var i = 0; i < instancesList.length; i++) {
    if (!instancesList[i].active) {
      instancesList.splice(i, 1, newInstance);
      return i
    }
  }
  // If there is no instance to replace, we take a new slot at the end of the list
  instancesList.push(newInstance);
  return (instancesList.length - 1)
}

exports.initiateEvasionCountDown = function (serverSocketIO, countDownStarted, countDownForbidden, instancesList, avatarSlot1, avatarSlot2) {
  if (!countDownStarted) {
    let countDownValue = 125; // 125*40(intervals in ms) = 5 seconds
    let countDownText;
    countDownStarted = true;

    let countDownInterval = setInterval(function () {
      countDownText = Math.round(countDownValue * 40 / 1000);
      if (avatarSlot1.name === 'vide' || avatarSlot2.name === 'vide' || countDownForbidden) {
        clearInterval(countDownInterval);
        countDownValue = 0;
        countDownForbidden = false;
        countDownStarted = false;
        serverSocketIO.emit('EvasionCountDownBackFinished');
      } else if (countDownValue <= 0) {
        serverSocketIO.emit('EvasionCountDownBackFinished');
        clearInterval(countDownInterval);
        countDownForbidden = false;
        countDownStarted = false;
        if (countDownValue <= 0) {
          let instanceIndex = setUpInstance(instancesList, avatarSlot1, avatarSlot2);
          // Settings for created instance
          instancesList[instanceIndex].rules = gameMod.instanceGenerator(serverSocketIO, instanceIndex, instancesList);
          instancesList[instanceIndex].checkpoint.rules = exports.copyObject(instancesList[instanceIndex].rules);
          instancesList[instanceIndex].checkpoint.player1Score = instancesList[instanceIndex].player1Score;
          instancesList[instanceIndex].checkpoint.player2Score = instancesList[instanceIndex].player2Score;
          var destination = '/game/' + (instanceIndex + 1);
          serverSocketIO.emit('redirectToGameInstance', {
            url: destination,
            player1: avatarSlot1.name,
            player2: avatarSlot2.name
          });
          console.log('instance creation : ' + (instanceIndex + 1));
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