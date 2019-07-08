const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(path.join(__dirname, '/../dbs/db.js'));
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

router.get('/', function(req, res) {
	let message = 'Veuillez vous connecter.'
	if (req.session && req.session.user) {
		message = getUserName(req) + ' Vous êtes déjà connecté :)'
	}
	res.render('login', { profil: getUserName(req), title: 'login', message: message});
})

router.post('/', function(req, res) {
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
			res.render('login', { profil: getUserName(req), title: 'login', message: message});
			client.close();
		});
	});
})

module.exports = router;
