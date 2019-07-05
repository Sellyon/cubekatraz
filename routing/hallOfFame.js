const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const client = require(__dirname + '/routerModules/db.js');
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

router.get('/', function (req, res) {
	client.connect(uri, function () {
		myDB = client.get().db('twoPrisoners');
		let collection = myDB.collection('matchs');
		collection.find().sort({score: -1}).limit(5).toArray(function(err, data){
			for (let i = 0; i < data.length; i++) {
				data[i].time = routMod.msToTime(data[i].time);
				data[i].date = routMod.convertDateNowToEuropeanDate(data[i].date);
				data[i].victory = routMod.getVictoryMessage(data[i].victory);
			}
			res.render('hallOfFame', { 
				profil: routMod.getUserName(req), title: 'profil ' + req.params.profilName,
				data: data,
			});
			client.close();
		});
	});
});

module.exports = router;