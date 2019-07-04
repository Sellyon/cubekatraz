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

router.get('/:number', [requireLogin], function(req, res) {
    res.render('game', { profil: getUserName(req), title: 'index', message: getUserName(req)});
})

module.exports = router;
