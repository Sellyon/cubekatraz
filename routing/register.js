const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(path.join(__dirname, '/../dbs/db.js'));
const routMod = require(__dirname + '/routerModules/routerModule.js');
const uri = "mongodb+srv://yoannmroz:ChristopheMonGodetBLOL@cluster0-bznsv.mongodb.net/test?retryWrites=true&w=majority";
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
		return req.session.avatar
	} else {
		return '/images/usersAvatars/placeholderAvatar.png'
	}
}


router.get('/', function(req, res) {
	let message = 'Complétez le formulaire pour vous enregistrer.'
	let connected = false;
	if (req.session && req.session.user) {
		message = routMod.getUserName(req) + ', vous êtes déjà enregistré :)'
		connected = true;
	}
	res.render('register', { profil: routMod.getUserName(req), title: 'login', message: message, avatar: getAvatar(req), connected: connected});
})

router.post('/', function(req, res) {
	let message = 'Veuillez vous connecter.'
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('users');
		let login = req.body.user_login;
		let password = req.body.user_password;

		if (login !== '') {
			collection.find({name: login}).toArray(function(err, data){
				if (err) throw err;
				if (data[0] === undefined){
					req.session.user = login;
					let newUser = { 
						name: login,
						password: password,
						grade: 1,
						description: '',
						avatar: '/images/usersAvatars/placeholderAvatar.png',
						friends: [],
						matchPlayed: 0,
						bestScore: 0,
						gameFinished: 0,
						bestTime: 0,
						achievements: [],
						friendsYouRequest: [],
						RequestYouForFriend: [],
					}
					myDB.collection('users').insertOne(newUser, function(err, insertRes) {
						if (err) throw err;
						console.log("1 document inserted");
						req.session.user = login;
						message = 'enregistrement réussie ' + routMod.getUserName(req) + ', bienvenu à Cubekatraz :)';
						res.render('register', { profil: routMod.getUserName(req), title: 'login', message: message, avatar: getAvatar(req)});
						client.close();
					});
				} else {
				  	message = 'Ce pseudo est déjà utilisé, choisis-en un autre.';
				  	res.render('register', { profil: routMod.getUserName(req), title: 'login', message: message, avatar: getAvatar(req)});
				  	client.close();
				}
			});
		} else {
		 	message = 'Ce pseudo est pourri, choisis-en un autre.';
		  	res.render('register', { profil: routMod.getUserName(req), title: 'login', message: message, avatar: getAvatar(req)});
		  	client.close();
		}
	});
})

module.exports = router;