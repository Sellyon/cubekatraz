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

router.get('/', [routMod.requireLogin], function (req, res) {
	res.redirect('/profil/' + routMod.getUserName(req));
});

router.get('/:profilName', function (req, res) {
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');

		collection.find({name: req.params.profilName}).toArray(function(err, data){
		  if (err) throw err;
		  if (data[0] !== undefined){
		  	if (routMod.getUserName(req) === data[0].name) {
		  		var titleprofil = 'Votre profil';
		  	} else {
		  		var titleprofil = 'Profil de ' + req.params.profilName;
		  	}
			res.render('profil', { 
				profil: routMod.getUserName(req), title: 'profil ' + req.params.profilName,
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
