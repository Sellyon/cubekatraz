const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(path.join(__dirname, '/../dbs/db.js'));
const routMod = require(__dirname + '/routerModules/routerModule.js');
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';
var myDB;
var router = express.Router();

const store = new MongoDBStore({
	uri: uri,
	databaseName: 'twoPrisoners',
	collection: 'sessions'
  });
  store.on('error', function(error) {
	console.log(error);
  });

router.use(session({
  secret: secret,
  store: store,
  saveUninitialized : true,
  resave: false
}));

const getAvatar = function (req) {
	if (req.session && req.session.avatar) {
		return '/images/usersAvatars/' + req.session.avatar
	} else {
		return '/images/usersAvatars/placeholderAvatar.png'
	}
}

router.get('/', [routMod.requireLogin], function (req, res) {
	res.redirect('/profil/' + routMod.getUserName(req));
});

router.get('/:profilName', function (req, res) {
	connected = false;
	if (req.session && req.session.user) {
		connected = true
	}
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		collection.find({name: req.params.profilName}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	if (routMod.getUserName(req) === data[0].name) {
		  		var titleprofil = 'Votre matricule';
		  	} else {
		  		var titleprofil = 'Matricule de ' + req.params.profilName;
		  	}
			res.render('profil', { 
				profil: routMod.getUserName(req), title: 'profil ' + req.params.profilName,
				titleprofil: titleprofil,
				description: data[0].description,
				bestScore: data[0].bestScore,
				matchPlayed: data[0].matchPlayed,
				gameFinished: data[0].gameFinished,
				bestTime: routMod.msToTime(data[0].bestTime*40),
				friends: data[0].friends,
				avatarProfil: '/images/usersAvatars/' + data[0].avatar,
				avatar: getAvatar(req),
				connected: connected
			});
		  } else {
		  	res.redirect('/unknowned');
		  }
		  client.close();
		});
	});
});

router.post('/:profilName', function(req, res) {
	connected = false;
	if (req.session && req.session.user) {
		connected = true
	}

	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		// If a request to modify description is done AND the user in session is the owner of the profile the request is accepted
		if (req.params.profilName === routMod.getUserName(req) && req.body.editDescription) {
			collection.update(
				{name: req.params.profilName},
				{ $set: { description: req.body.editDescription } },
			)
		}
		collection.find({name: req.params.profilName}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	if (routMod.getUserName(req) === data[0].name) {
		  		var titleprofil = 'Votre matricule';
		  	} else {
		  		var titleprofil = 'Matricule de ' + req.params.profilName;
		  	}
			res.render('profil', { 
				profil: routMod.getUserName(req), title: 'profil ' + req.params.profilName,
				titleprofil: titleprofil,
				description: data[0].description,
				bestScore: data[0].bestScore,
				matchPlayed: data[0].matchPlayed,
				gameFinished: data[0].gameFinished,
				bestTime: routMod.msToTime(data[0].bestTime*40),
				friends: data[0].friends,
				avatarProfil: '/images/usersAvatars/' + data[0].avatar,
				avatar: getAvatar(req),
				connected: connected
			});
		  } else {
		  	res.redirect('/unknowned');
		  }
		  client.close();
		});
	});
})

module.exports = router;
