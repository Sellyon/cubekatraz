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

router.get('/', function (req, res) {
	let connected = false;
	if (req.session && req.session.user) {
		connected = true;
	}
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('matchs');
		collection.find().sort({score: -1, time: 1}).toArray(function(err, data){
			if (data) {
				for (let i = 0; i < data.length; i++) {
					data[i].time = routMod.msToTime(data[i].time);
					data[i].date = routMod.convertDateNowToEuropeanDate(data[i].date);
					data[i].victory = routMod.getVictoryMessage(data[i].victory);
				}
				res.render('hallOfFame', { 
					profil: routMod.getUserName(req),
					title: 'Panthéon',
					data: data,
					avatar: getAvatar(req),
					connected: connected
				});
			}
			client.close();
		});
	});
});

module.exports = router;