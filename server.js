'use strict';

/**
 * Partie HTTP
 */

const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(__dirname + '/dbs/db.js');
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";

var myDB;
var msToTime = function(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
var getUserName = function (req) {
	if (req.session.user) {
		return req.session.user
	} else {
		return 'mysterieux inconnu'
	}
}

var convertDateNowToEuropeanDate = function (date) {
	date = new Date(date * 1000);
	return date
}

var getVictoryMessage = function (message) {
	if (message) {
		message = 'oui';
	} else {
		message = 'non';
	}
	return message
}

app.locals.basedir = path.join(__dirname, '/views/includes');

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use("/images", express.static(__dirname + '/images'));
app.use("/css", express.static(__dirname + '/css'));
app.use(session({
    secret:'123456789SECRET',
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

app.get('/profil', function (req, res) {
	if (req.session.user) {
		res.redirect('/profil/' + getUserName(req));
	} else {
		res.redirect('/login');
	}
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

app.get('/lobby', function(req, res) {
	userName = (getUserName(req));
    res.render('lobby', { profil: getUserName(req), title: 'index', message: getUserName(req)});
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
* Partie lobby chat Websocket
*/

let userName;
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
	status: 'empty'
};
let avatarSlot2 = {
	image: 'jail.jpg',
	status: 'empty'
};

serverSocketIO.on('connection', function (socket) {

    console.log('Serveur dit : Connecté au navigateur');
    // console.log(req);

	connectedNumber ++;

    playerList.push(socket.id);
    serverSocketIO.emit('hereIsYourChallenger', {
		playerList: playerList,
		slot1: {
			avatarSlot1: 'images/portraits/' + avatarSlot1.image,
			status: avatarSlot1.status
		},
		slot2: {
			avatarSlot2: 'images/portraits/' + avatarSlot2.image,
			status: avatarSlot2.status
		}
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
    	serverSocketIO.emit('userDisconnected', socket.id);
    	for (var i = 0; i < avatarList.length; i++) {
			// if (slot.image === avatarList[i]) {
			// 	if (i + 1 < avatarList.length) {
			// 		if (otherSlot.image !== avatarList[(i + 1) % avatarList.length]) {
			// 			slot.image = avatarList[(i + 1) % avatarList.length];
			// 		} else {
			// 			slot.image = avatarList[(i + 2) % avatarList.length];
			// 		}
			// 	}
			// }
		}
	    for (var i = 0; i < playerList.length; i++) {
            if (socket.id === playerList[i]) {
            	playerList.splice(i, 1);
            	i = playerList.length;
            }
		}
		connectedNumber --;
	});

	// Antichamber management
	socket.on('antichamberChangeNav', function () {
		if (userName !== avatarSlot1.status && userName !== avatarSlot2.status && (avatarSlot1.status === 'empty' || avatarSlot2.status === 'empty')) {
			if (avatarSlot1.status === 'empty') {
				avatarSlot1.status = userName;
				avatarSlot1.image = getAvatarImage(avatarSlot1);
			} else {
				avatarSlot2.status = userName;
				avatarSlot2.image = getAvatarImage(avatarSlot1);
			}
		}
    	serverSocketIO.emit('antichamberChangeServ', {
    		slot1: {
    			status: avatarSlot1.status,
    			image: avatarSlot1.image
    		},
    		slot2: {
    			status: avatarSlot2.status,
    			image: avatarSlot2.image
    		}
    	});
	});

	const getAvatarImage = function (slot) {
		let otherSlot;
		if (slot === avatarSlot1.status) {
			otherSlot = avatarSlot2;
		} else {
			otherSlot = avatarSlot1;
		}
		if (slot.image === 'jail.jpg') {
			if (otherSlot.image !== 'cody.jpg') {
				slot.image = 'cody.jpg';
			} else {
				slot.image = 'dalton.jpg';
			}
		} else {
			for (var i = 0; i < avatarList.length; i++) {
				if (slot.image === avatarList[i]) {
					if (i + 1 < avatarList.length) {
						if (otherSlot.image !== avatarList[(i + 1) % avatarList.length]) {
							slot.image = avatarList[(i + 1) % avatarList.length];
						} else {
							slot.image = avatarList[(i + 2) % avatarList.length];
						}
					}
				}
			}
		}
		console.log(slot.image);
		return slot.image
	}
});