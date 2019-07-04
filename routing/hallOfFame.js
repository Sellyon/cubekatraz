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

const getUserName = function (req) {
	if (req.session && req.session.user) {
		return req.session.user
	} else {
		return 'mysterieux inconnu'
	}
}

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

const getVictoryMessage = function (message) {
	if (message) {
		message = 'oui';
	} else {
		message = 'non';
	}
	return message
}

router.get('/', function (req, res) {
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

module.exports = router;