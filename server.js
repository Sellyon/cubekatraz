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
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';

var myDB;

const convertDateNowToEuropeanDate = function (date) {
	date = new Date(date * 1000);
	return date
}

const msToTime = function(duration) {
    let milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function requireLogin (req, res, next) {
  if (req.session.user) {
    // User is authenticated, let him in
    next();
  } else {
    // Otherwise, we redirect him to login form
    res.redirect("/login");
  }
}

const getUserName = function (req) {
	if (req.session.user) {
		return req.session.user
	} else {
		return 'mysterieux inconnu'
	}
}

const getVictoryMessage = function (message) {
	if (message) {
		message = 'oui';
	} else {
		message = 'non';
	}
	return message
}

const getHandshakeId = function (socket) {
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

app.locals.basedir = path.join(__dirname, '/views/includes');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use("/images", express.static(__dirname + '/images'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
const store = new MongoDBStore({
  uri: uri,
  databaseName: 'twoPrisoners',
  collection: 'sessions'
});
app.use(session({
    secret: secret,
    store: store,
    saveUninitialized : false,
    resave: false
}));

app.set('view engine', 'pug');
app.set('views','./views');

app.get('/', function(req, res) {
    res.render('index', { profil: getUserName(req), title: 'index', message: getUserName(req)});
})

app.get('/login', function(req, res) {
	let message = 'Veuillez vous connecter.'
	if (req.session.user) {
		message = getUserName(req) + ' Vous êtes déjà connecté :)'
	}
	res.render('login', { profil: getUserName(req), title: 'login', message: message});
})

app.post('/loginTreatment', function(req, res) {
	let message = 'Veuillez vous connecter.'
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');
		let response;
		let login = req.body.user_login;
		let password = req.body.user_password;

		collection.find({name: login}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	if (password === data[0].password) {
				response = data[0]._id.toString();
				message = 'Connexion réussie ' + data[0].name;
				req.session.user = data[0].name;
		  	} else {
		  		message = 'Le mot de passe est incorrect.';
		  	}
		  } else {
		  	message = 'Cet utilisateur n\'est pas enregistré.';
		  }
			res.render('loginTreatment', { profil: getUserName(req), title: 'login', message: message});
			client.close();
		});
	});
})

store.on('error', function(error) {
  console.log(error);
});

app.get('/register', function(req, res) {
	let message = 'Complétez le formulaire pour vous enregistrer.'
	if (req.session.user) {
		message = getUserName(req) + ', vous êtes déjà enregistré :)'
	}
	res.render('register', { profil: getUserName(req), title: 'login', message: message});
})

app.post('/registerTreatment', function(req, res) {
	let message = 'Veuillez vous connecter.'
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');
		let login = req.body.user_login;
		let password = req.body.user_password;

		collection.find({name: login}).toArray(function(err, data){
			if (err) throw err;
			if (data[0] === undefined){
				req.session.user = login;
				let newUser = { 
					name: login,
					password: password,
					grade: 1,
					description: '',
					avatar: 'placeholderAvatar.png',
					friends: [],
					matchPlayed: 0,
					bestScore: 0,
					gameFinished: 0,
					bestTime: 0
				}
				myDB.collection('users').insertOne(newUser, function(err, insertRes) {
					if (err) throw err;
					console.log("1 document inserted");
					req.session.user = login;
					message = 'enregistrement réussie ' + getUserName(req) + ', bienvenu à Cubekatraz :)';
					res.render('registerTreatment', { profil: getUserName(req), title: 'login', message: message});
					client.close();
				});
			} else {
			  	message = 'Ce pseudo est déjà utilisé, choisis-en un autre.';
			  	res.render('registerTreatment', { profil: getUserName(req), title: 'login', message: message});
			  	client.close();
			}
		});
	});
})

app.get('/profil', [requireLogin], function (req, res) {
	res.redirect('/profil/' + getUserName(req));
});

app.get('/profil/:profilName', function (req, res) {
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		collection.find({name: req.params.profilName}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	if (getUserName(req) === data[0].name) {
		  		var titleprofil = 'Votre profil';
		  	} else {
		  		var titleprofil = 'Profil de ' + req.params.profilName;
		  	}
			res.render('profil', { 
				profil: getUserName(req), title: 'profil ' + req.params.profilName,
				titleprofil: titleprofil,
				description: data[0].description,
				bestScore: data[0].bestScore,
				matchPlayed: data[0].matchPlayed,
				gameFinished: data[0].gameFinished,
				bestTime: data[0].bestTime,
				friends: data[0].friends,
				avatar: '/images/usersAvatars/' + data[0].avatar
			});
		  } else {
		  	res.redirect('/unknowned');
		  }
		  client.close();
		});
	});
});

app.get('/hallOfFame', function (req, res) {
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('matchs');
		collection.find().sort({score: -1}).limit(5).toArray(function(err, data){
			for (let i = 0; i < data.length; i++) {
				data[i].time = msToTime(data[i].time);
				data[i].date = convertDateNowToEuropeanDate(data[i].date);
				data[i].victory = getVictoryMessage(data[i].victory);
			}
			res.render('hallOfFame', { 
				profil: getUserName(req), title: 'profil ' + req.params.profilName,
				data: data,
			});
			client.close();
		});
	});
});

app.get('/lobby', [requireLogin], function(req, res) {
    res.render('lobby', { profil: getUserName(req), title: 'index', message: getUserName(req)});
})

app.get('/game/:number', [requireLogin], function(req, res) {
    res.render('game', { profil: getUserName(req), title: 'index', message: getUserName(req)});
})

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
	serverSocketIO.emit('updatePlayerList', playerList);
};

let updateAvatarslots = function (socket) {
	var target = serverSocketIO;
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

let updateAntichamberStatus = function () {
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

let initiateEvasionCountDown = function () {
	if (!countDownStarted) {
		let countDownValue = 125; // 125*40(intervals) = 5 seconds
		let countDownText;
		countDownStarted = true;

		let countDownInterval =	setInterval(function () {
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
						player1Score: 0,
						player2Id: avatarSlot2.status,
						player2Name: avatarSlot2.name,
						player2Image: avatarSlot2.image,
						player2Score: 0,
						level: 1,
						active: true
					});
					instancesList[instancesList.length - 1].rules = instanceGenerator(instancesList.length - 1);
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

let emptySlot = function (socket) {
	let leavingName;
	for (var i = 0; i < playerList.length; i++) {
		if (getHandshakeId(socket) === playerList[i].id) {
			leavingName = playerList[i].name;
		}
	}
	if (avatarSlot1.status === getHandshakeId(socket)) {
		avatarSlot1.status = 'empty';
		avatarSlot1.image = 'jail.jpg';
		avatarSlot1.name = 'vide';
		return {
			slot: 1,
			id: getHandshakeId(socket),
			name: leavingName
		}
	} else if (avatarSlot2.status === getHandshakeId(socket)) {
		avatarSlot2.status = 'empty';
		avatarSlot2.image = 'jail.jpg';
		avatarSlot2.name = 'vide';
		return {
			slot: 2,
			id: getHandshakeId(socket),
			name: leavingName
		}
	} else {
		return {
			id: getHandshakeId(socket)
		}
	}
}

const lobbyRegex = /\Wlobby$/i;

serverSocketIO.on('connection', function (socket) {
	if (lobbyRegex.test(socket.handshake.headers.referer)) {
	    console.log('Serveur dit : Connecté au navigateur, bienvenu au lobby ' + getHandshakeId(socket));

		connectedNumber ++;

		socket.on('giveUserName', function (name) {
		    playerList.push({
		    	id: getHandshakeId(socket),
		    	name: name
		    });
		    updateFrontPlayerList();
		    socket.on('nameInFrontUpdated', function () {
		    	updateAvatarslots(socket);
		    	socket.emit('updateConnectedList', playerList);
		    	updateAntichamberStatus();
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
		});
		
		// Disconnection management
		socket.on('disconnect', function () {
			serverSocketIO.emit('userDisconnected', emptySlot (socket));
			updateAntichamberStatus();
		    for (var i = 0; i < playerList.length; i++) {
	            if (getHandshakeId(socket) === playerList[i].id) {
	            	playerList.splice(i, 1);
	            	i = playerList.length;
	            }
			}
			serverSocketIO.emit('updateConnectedList', playerList);
			connectedNumber --;
		});

		// Antichamber management
		socket.on('antichamberChangeFront', function () {
			// test if the player is already in a slot or not (to determine if the player want to join or leave a slot)
			if (getHandshakeId(socket) === avatarSlot1.status || getHandshakeId(socket) === avatarSlot2.status) {
				serverSocketIO.emit('userLeaveAntichamber', emptySlot (socket));
				socket.emit('updateAntichamberAdderText', 'Rejoindre la partie');

			// The player wants to join a slot, so we test if there is a slot available or not
			} else if (getHandshakeId(socket) !== avatarSlot1.status && getHandshakeId(socket) !== avatarSlot2.status && (avatarSlot1.status === 'empty' || avatarSlot2.status === 'empty')) {
				if (avatarSlot1.status === 'empty') {
					avatarSlot1.status = getHandshakeId(socket);
					for (var i = 0; i < playerList.length; i++) {
						if (getHandshakeId(socket) === playerList[i].id) {
							avatarSlot1.name = playerList[i].name;
						}
					}
					avatarSlot1.image = getAvatarImage(avatarSlot1);
				} else {
					avatarSlot2.status = getHandshakeId(socket);
					for (var i = 0; i < playerList.length; i++) {
						if (getHandshakeId(socket) === playerList[i].id) {
							avatarSlot2.name = playerList[i].name;
						}
					}
					avatarSlot2.image = getAvatarImage(avatarSlot2);
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
		    updateAntichamberStatus();
		    if (avatarSlot1.status !== 'empty' && avatarSlot2.status !== 'empty') {
		    	initiateEvasionCountDown();
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
			if (getHandshakeId(socket) === avatarSlot1.status) {
				avatarSlot1.image = getAvatarImage(avatarSlot1);
				serverSocketIO.emit('switchAntichamberBack', {
					slot: 'slot1',
					image: avatarSlot1.image
				});
			} else {
				console.log('Access forbidden to slot 1 !');
			}
		});

		socket.on('switchAvatarSlot2', function () {
			if (getHandshakeId(socket) === avatarSlot2.status) {
				avatarSlot2.image = getAvatarImage(avatarSlot2);
				serverSocketIO.emit('switchAntichamberBack', {
					slot: 'slot2',
					image: avatarSlot2.image
				});
			} else {
				console.log('Access forbidden to slot 2 !');
			}
		});

		const getAvatarImage = function (slot) {
			let otherSlot;
			if (slot === avatarSlot1) {
				otherSlot = avatarSlot2;
			} else {
				otherSlot = avatarSlot1;
			}
			if (slot.image === 'jail.jpg') {
				if (otherSlot.image !== avatarList[0]) {
					slot.image = avatarList[0];
				} else {
					slot.image = avatarList[1];
				}
			} else {
				for (var i = 0; i < avatarList.length; i++) {
					if (slot.image === avatarList[i]) {
						if (otherSlot.image !== avatarList[(i + 1) % avatarList.length]) {
							slot.image = avatarList[(i + 1) % avatarList.length];
						} else {
							slot.image = avatarList[(i + 2) % avatarList.length];
						}
						i = avatarList.length;
					}
				}
			}
			return slot.image
		}
	}
});


/**
* Instances Websocket
*/

const gameRegex = /\Wgame\W\d+$/i;
const instanceRegex = /\d+$/i;
const instancesList = [];

const instanceGenerator = function (instanceId) {
	let rules = 'ERROR RULES NOT CORRECTLY GENERATED !';
	if (instancesList[instanceId].level === 1) {
		rules = {
			levelStarted: false,
			levelDimension: {
				width: 800,
				height: 500
			},
			player1: {
				x: 50,
				y: 50,
				width: 50,
				height: 50,
				movingLeft: false,
				movingRight: false,
				movingUp: false,
				movingDown: false,
			},
			player2: {
				x: 50,
				y: 300,
				width: 50,
				height: 50,
				movingLeft: false,
				movingRight: false,
				movingUp: false,
				movingDown: false,
			},
			walls: [
				{
					x: 200,
					y: 0,
					width: 50,
					height: 350,
					isFire: false,
				},
				{
					x: 400,
					y: 150,
					width: 50,
					height: 350,
					isFire: false,
				},
				{
					x: 600,
					y: 0,
					width: 50,
					height: 350,
					isFire: false,
				},
				{
					x: 215,
					y: 200,
					width: 250,
					height: 50,
					isFire: true,
				},
				{
					x: 700,
					y: 50,
					width: 50,
					height: 50,
					isFire: false,
					key: true
				}
			],
			fireWallsCounter: 0,
			mainLoop: function (instanceNumber) {
				setInterval(function() {
					var collisionHorizontaleDetectee = false;
					var collisionVerticaleDetectee = false;
					var player;

					for (var i = 0; i < 2; i++) {
						var vecteurX = 0;
						var vecteurY = 0;
						if (i === 0) {
							player = rules.player1;
						} else {
							player = rules.player2;
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
						if (player.x + vecteurX > 0 && player.x + player.width + vecteurX < rules.levelDimension.width) {
							collisionHorizontaleDetectee = false;
						} else {
							collisionHorizontaleDetectee = true;
						}
						// vertical test
						if (player.y + vecteurY > 0 && player.y + player.height + vecteurY < rules.levelDimension.height) {
							collisionVerticaleDetectee = false;
						} else {
							collisionVerticaleDetectee = true;
						}
			
						// test set up collisions
						for (var j = 0; j < rules.walls.length; j++) {
							// compraisons between hitbox player and every hitbos set up
							if (
								player.y + player.height + vecteurY > rules.walls[j].y
								&& player.y + vecteurY < rules.walls[j].y + rules.walls[j].height
								&& player.x + player.width + vecteurX > rules.walls[j].x
								&& player.x + vecteurX < rules.walls[j].x + rules.walls[j].width
								) {
								
								// If horizontal collision detected, block horizontal moves
								if (player.y + player.height > rules.walls[j].y && player.y < rules.walls[j].y + rules.walls[j].height) {
									collisionHorizontaleDetectee = true;
									// Firewall collisions management
									if (rules.walls[j].isFire) {
										console.log('T\'ES MORT !');
									}
									// victory management
									if (rules.walls[j].key) {
										console.log('victoire !')
									}
								}
								//If vertical collision detected, block vertical moves
								if (player.x + player.width > rules.walls[j].x && player.x < rules.walls[j].x + rules.walls[j].width) {
									collisionVerticaleDetectee = true;
									// Firewall collisions management
									if (rules.walls[j].isFire) {
										console.log('T\'ES MORT !');
									}
									// victory management
									if (rules.walls[j].key) {
										console.log('victoire !')
									}
								}
								// If no collision detected so the player is making a diagonal move
								if (!collisionHorizontaleDetectee && !collisionVerticaleDetectee) {
									collisionHorizontaleDetectee = true;
									collisionVerticaleDetectee = true;
									// Firewall collisions management
									if (rules.walls[j].isFire) {
										document.location.reload(true);
									}
									// victory management
									if (rules.walls[j].key) {
										console.log('victoire !')
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
		
					// Fire walls moves
					rules.fireWallsCounter += 0.05;
					for (var i = 0; i < rules.walls.length; i++) {
						if (rules.walls[i].isFire) {
							rules.walls[i].x += Math.sin(rules.fireWallsCounter) * 4
						}
					}
					serverSocketIO.emit('updateFrontElements', {
						level: instancesList[instanceId].level,
						player1: rules.player1,
						player1Name: instancesList[instanceNumber].player1Name,
						player2: rules.player2,
						player2Name: instancesList[instanceNumber].player2Name,
						walls: rules.walls
					});
				}, 40);
			},
			updatePlayerMoves: function (socket, moves) {
				let instanceRequired = instanceRegex.exec(socket.handshake.headers.referer);
				let player;
				if (getHandshakeId(socket) === instancesList[instanceRequired - 1].player1Id) {
					player = rules.player1;
				} else if (getHandshakeId(socket) === instancesList[instanceRequired - 1].player2Id) {
					player = rules.player2;
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
		};
	}
	return rules;
}

serverSocketIO.on('connection', function (socket) {
	if (gameRegex.test(socket.handshake.headers.referer)) {
		let instanceRequired = instanceRegex.exec(socket.handshake.headers.referer);
		if (instancesList[instanceRequired - 1] && instancesList[instanceRequired - 1].active) {
			console.log('Serveur dit : Connecté au navigateur, dans la partie '+ instanceRequired + ', demande faite par ' + getHandshakeId(socket));
			if (true && !instancesList[instanceRequired - 1].rules.levelStarted) {
				instancesList[instanceRequired - 1].rules.levelStarted = true;
				instancesList[instanceRequired - 1].rules.mainLoop(instanceRequired - 1);
				console.log('level ' + instanceRequired + ' started');
				socket.on('updatePlayerList', function (moves) {
					playerList[instanceRequired - 1].rules.updatePlayerMoves(socket, moves);
				});
			}
			// Here we collect players inputs
			socket.on('playerMove', function (moves) {
				instancesList[instanceRequired - 1].rules.updatePlayerMoves(socket, moves);
			});
		} else {
			console.log('Serveur dit : l\'accès à l\'instance ' + instanceRequired + ' est refusé, demande faite par ' + getHandshakeId(socket));
			socket.emit('redirectToLobby');
		}
	}
});