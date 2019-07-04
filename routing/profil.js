const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(__dirname + '/dbs/db.js');
const uri = "mongodb+srv://yoannmroz:Ech1ariandre@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
const secret = '123456789SECRET';
var myDB;
var router = express.Router();

const getUserName = function (req) {
	if (req.session && req.session.user) {
		return req.session.user
	} else {
		return 'mysterieux inconnu'
	}
}

function requireLogin (req, res, next) {
	if (req.session && req.session.user) {
	  // User is authenticated, let him in
	  next();
	} else {
	  // Otherwise, we redirect him to login form
	  res.redirect("/login");
	}
}

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

router.get('/', [requireLogin], function (req, res) {
	res.redirect('/profil/' + getUserName(req));
});

router.get('/:profilName', function (req, res) {
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

module.exports = router;
