'use strict';

/**
 * HTTP part
 */

const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(__dirname + '/dbs/db.js');
const lobbyMod = require(__dirname + '/myModules/lobbyModule.js');
const gameMod = require(__dirname + '/myModules/gameModule.js');
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
var myDB;

app.locals.basedir = path.join(__dirname, '/views/includes');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use('/images', express.static(__dirname + '/images'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/', require('./routing'));

app.set('view engine', 'pug');
app.set('views','./views');

app.use('/Unauthorized', function (req, res) {
	res.status(401).render('error401');
});

app.use(function (req, res) {
  	res.status(404).render('error404');
})
var port = process.env.PORT || 8080;
let BaseHTTPServer = app.listen(port,function() {
  	console.log('ok');
});


/**
* Lobby chat Websocket
*/

let connectedNumber = 0;
let playerList = [];
let SocketIO = require('socket.io');

let serverSocketIO = new SocketIO(BaseHTTPServer);
let avatarList = [
	'cody.jpg',
	'dalton.jpg',
	'rick.jpg'
];
let avatarSlot1 = {
	image: 'jail.jpg',
	status: 'empty',
	name: 'vide'
};
let avatarSlot2 = {
	image: 'jail.jpg',
	status: 'empty',
	name: 'vide'
};

let countDownStarted = false;
let countDownForbidden = false;

let updateFrontPlayerList = function () {
	serverSocketIO.emit('updatePlayerList', {playerList: playerList, instancesList: instancesList});
};

const lobbyRegex = /\Wlobby$/i;

serverSocketIO.on('connection', function (socket) {
	if (lobbyRegex.test(socket.handshake.headers.referer)) {
	    console.log('Bienvenu au lobby ' + lobbyMod.getHandshakeId(socket));

		connectedNumber ++;

		socket.on('giveUserName', function (name) {
		    playerList.push({
		    	id: lobbyMod.getHandshakeId(socket),
		    	name: name
		    });
		    updateFrontPlayerList();
		    socket.on('nameInFrontUpdated', function () {
		    	lobbyMod.updateAvatarslots(serverSocketIO, socket, avatarSlot1, avatarSlot2);
		    	socket.emit('updateConnectedList', playerList);
		    	lobbyMod.updateAntichamberStatus(serverSocketIO, avatarSlot1, avatarSlot2);
			});
		});
		
		socket.on('serverChatNeedTexts', function (data) {
			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('lobbyChat');
				collection.aggregate([
				{
					$match: {
					_id:{
						$exists: true
					}
					}},
					{ $sort: { date: 1 } },
					{ $limit: 100 },
				]).toArray(function(err, data){
				if (err) throw err;
				if (data[0] !== undefined){
						socket.emit('serverGiveChatTexts', data);
				}
				client.close();
				});
			});
		});

		// Add chat message to the DB
	    socket.on('chatTextSubmitted', function (data) {
			client.connect(uri, function () {
				myDB = client.get().db('twoPrisoners');
				let collection = myDB.collection('lobbyChat');
				collection.insertOne({
					author: data.author,
					message: data.message,
					date: data.date
				});
			});
	        serverSocketIO.emit('chatTextDispatched', data);
	        client.close();
		});
		
		// Disconnection management
		socket.on('disconnect', function () {
			serverSocketIO.emit('userDisconnected', lobbyMod.emptySlot(socket, playerList, avatarSlot1, avatarSlot2));
			lobbyMod.updateAntichamberStatus(serverSocketIO, avatarSlot1, avatarSlot2);
		    for (var i = 0; i < playerList.length; i++) {
	            if (lobbyMod.getHandshakeId(socket) === playerList[i].id) {
	            	playerList.splice(i, 1);
	            	i = playerList.length;
	            	if (countDownStarted) {
	            		countDownForbidden = true;
	            	}
	            }
			}
			serverSocketIO.emit('updateConnectedList', playerList);
			connectedNumber --;
		});

		// Antichamber management
		socket.on('antichamberChangeFront', function () {
			// test if the player is already in a slot or not (to determine if the player want to join or leave a slot)
			if (lobbyMod.getHandshakeId(socket) === avatarSlot1.status || lobbyMod.getHandshakeId(socket) === avatarSlot2.status) {
				serverSocketIO.emit('userLeaveAntichamber', lobbyMod.emptySlot (socket, playerList, avatarSlot1, avatarSlot2));
				socket.emit('updateAntichamberAdderText', 'Rejoindre la partie');
				if (countDownStarted) {
	            	countDownForbidden = true;
	            }

			// The player wants to join a slot, so we test if there is a slot available or not
			} else if (lobbyMod.getHandshakeId(socket) !== avatarSlot1.status && lobbyMod.getHandshakeId(socket) !== avatarSlot2.status && (avatarSlot1.status === 'empty' || avatarSlot2.status === 'empty')) {
				if (avatarSlot1.status === 'empty') {
					avatarSlot1.status = lobbyMod.getHandshakeId(socket);
					for (var i = 0; i < playerList.length; i++) {
						if (lobbyMod.getHandshakeId(socket) === playerList[i].id) {
							avatarSlot1.name = playerList[i].name;
						}
					}
					avatarSlot1.image = lobbyMod.getAvatarImage(avatarSlot1, avatarSlot2, avatarList);
				} else {
					avatarSlot2.status = lobbyMod.getHandshakeId(socket);
					for (var i = 0; i < playerList.length; i++) {
						if (lobbyMod.getHandshakeId(socket) === playerList[i].id) {
							avatarSlot2.name = playerList[i].name;
						}
					}
					avatarSlot2.image = lobbyMod.getAvatarImage(avatarSlot2, avatarSlot1, avatarList);
				}
		    	serverSocketIO.emit('playerHasJoinedAntichamber', {
		    		slot1: {
		    			slotName: 'slot1',
		    			status: avatarSlot1.status,
		    			image: avatarSlot1.image,
		    			name: avatarSlot1.name
		    		},
		    		slot2: {
		    			slotName: 'slot2',
		    			status: avatarSlot2.status,
		    			image: avatarSlot2.image,
		    			name: avatarSlot2.name
		    		}
		    	});
		    	socket.emit('updateAntichamberAdderText', 'Quitter la partie');
		    }
		    lobbyMod.updateAntichamberStatus(serverSocketIO, avatarSlot1, avatarSlot2);
		    if (avatarSlot1.status !== 'empty' && avatarSlot2.status !== 'empty') {
		    	lobbyMod.initiateEvasionCountDown(serverSocketIO, countDownStarted, countDownForbidden, instancesList, avatarSlot1, avatarSlot2);
		    } else {
		    	if (countDownStarted) {
					if (!countDownForbidden) {
						countDownForbidden = true;
					}
				}
		    }
		});

		socket.on('stopEvasionCountDown', function () {
			if (countDownStarted) {
				if (!countDownForbidden) {
					countDownForbidden = true;
				}
			}
		});

		socket.on('switchAvatarSlot1', function () {
			if (lobbyMod.getHandshakeId(socket) === avatarSlot1.status) {
				avatarSlot1.image = lobbyMod.getAvatarImage(avatarSlot1, avatarSlot2, avatarList);
				serverSocketIO.emit('switchAntichamberBack', {
					slot: 'slot1',
					image: avatarSlot1.image
				});
			} else {
				console.log('Access forbidden to slot 1 !');
			}
		});

		socket.on('switchAvatarSlot2', function () {
			if (lobbyMod.getHandshakeId(socket) === avatarSlot2.status) {
				avatarSlot2.image = lobbyMod.getAvatarImage(avatarSlot2, avatarSlot1, avatarList);
				serverSocketIO.emit('switchAntichamberBack', {
					slot: 'slot2',
					image: avatarSlot2.image
				});
			} else {
				console.log('Access forbidden to slot 2 !');
			}
		});
	}
});


/**
* Instances Websocket
*/

const gameRegex = /\Wgame\W\d+$/i;
const instanceRegex = /\d+$/i;
const instancesList = [];

serverSocketIO.on('connection', function (socket) {
	if (gameRegex.test(socket.handshake.headers.referer)) {
		let instanceRequired = instanceRegex.exec(socket.handshake.headers.referer);
		if (instancesList[instanceRequired - 1] && instancesList[instanceRequired - 1].active) {
			socket.join('room' + instanceRequired);
			console.log(lobbyMod.getHandshakeId(socket) + ' rejoint l\'instance \"room' + instanceRequired + '\"');
			if (!instancesList[instanceRequired - 1].matchStarted) {
				instancesList[instanceRequired - 1].matchStarted = true;
				gameMod.mainLoop(serverSocketIO, instanceRequired - 1, instancesList);
				console.log('level ' + instanceRequired + ' started');
				socket.on('updatePlayerList', function (moves) {
					playerList[instanceRequired - 1].rules.updatePlayerMoves(socket, instancesList, moves, instanceRegex);
				});
			}
			// Here we collect players inputs
			socket.on('playerMove', function (moves) {
				gameMod.updatePlayerMoves(socket, instancesList, moves, instanceRegex);
			});
			socket.on('showEmoticon', function (emoticon) {
				gameMod.showEmoticon(serverSocketIO, instanceRequired - 1, socket, instancesList, emoticon, instanceRegex);
			});
			// if a player is reconnected in a room, we update instance settings
			if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
				instancesList[instanceRequired - 1].player1Disconnected = false;
			} else if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
				instancesList[instanceRequired - 1].player2Disconnected = false;
			}
			socket.on('disconnect', function () {
				socket.leave('room' + instanceRequired);
				// if a player is disconnected from a room, we update instance settings
				if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
					instancesList[instanceRequired - 1].player1Disconnected = true;
				} else if (lobbyMod.getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
					instancesList[instanceRequired - 1].player2Disconnected = true;
				}
			});
		} else {
			console.log('L\'accès à l\'instance \"room' + instanceRequired + '\"" est refusé, demande faite par ' + lobbyMod.getHandshakeId(socket));
			socket.emit('redirectToLobby');
		}
	}
});