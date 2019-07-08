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
            elapsedTime: 0,
            active: true
          });
          instancesList[instancesList.length - 1].rules = gameMod.instanceGenerator(serverSocketIO, instancesList.length - 1, instancesList);
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